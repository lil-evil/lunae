const error = require("../tools/Error")
const { clock } = require("../tools/Util")

let ping, pstart, pend;

class WebSocketManager extends require("node:events"){
    constructor(Lunae, Intents){
        super()
        Object.defineProperty(this, "lunae", {value:Lunae})
        this.intents = Intents
        this.statut = 1 /* -1 :disconnected, 0 :connected, 1 :not connected */
        this.logged = 1  /* -1 :logged out, 0 :logged, 1 :not logged */
        this.closed = false /* closed volontary */
        this.reconnect = false  /* must reconnect */
    }
    /* metadata */
    gateway = "gateway.discord.gg"
    encoding = "json"
    version = 10
    supportedVersions = [10]
    sequence = 0

    get ping(){
        return ping ?? -1
    }
    /* functions */
    reConnect(token){
        if(!this.reconnect || this.statut != -1 || this.logged != -1)return false
        this.statut = 1
        this.logged = 1
        this.connection = false
        this.emit("reconnect")
        return this.connect(token)
    }
    connect(token){
        if(this.statut !==1)return false
        if(!token || typeof token !== "string")throw new error({message:"missing token"})
        this.on(0, (data)=>{    /* events */
        const {t,d} = data
            if(t == "READY"){ /* connected successfully */
                this.logged = 0
                this.sessionID = d.session_id
                this.readyData = d
            }
            const r = this.lunae.middleware.handle(t, d)
            this.lunae.emit(r[0], r[1])
            this.lunae.emit("*", r[0], r[1])
        })
        this.on("1", (data)=>{    /* heartbeat */
            console.log("op: 1", data)
        })
        this.on("7", (data)=>{    /* reconnect */
        console.log("op: 7", data)
        this.reconnect = true
        })
        this.on("9", (data)=>{    /* invalid session */
            console.log("op: 9", data)
        })
        this.on("11", ()=>{   /* heartbeat ack */
            pend = process.hrtime(pstart)
            ping = clock(pstart)
            this.emit("pong", {
                end:process.hrtime(),
                elapsed:pend,
                ping:this.ping
            })
        })
        this.connection = new (require("ws")).WebSocket(`wss://${this.gateway}/?v=${this.version}&encoding=${this.encoding}`)
        this.connection.on("open", ()=>{
            this.statut = 0
            if(this.reconnect){
                this.reconnect = false
                this.send(6, {d:{
                    token,
                    session_id:this.sessionID,
                    seq:this.sequence
                }})
            }
        })
        this.connection.on('close', (code)=>{
            if(code == 1005){
                return this.closed = true
            }
            if(this.reconnect){
                this.logged = -1
                this.statut = -1
                return this.reConnect(token)
            }
            const err = error.apiError.resolve(code)
            this.statut = -1
            throw new error.apiError({message:"connection closed: "+err})
        })

        this.connection.on("message", (data)=>{
            data = JSON.parse(data)
            const { op, t, d, s } = data

            this.emit(String(op), {t,d,s});
            this.sequence = s ?? this.sequence
            console.log(op)
            
            if(op == "10"){
                this.heartbeat = d.heartbeat_interval
                if(this.logged == 1 ){
                    this.loggin(token)
                    this.send(1, {d:this.sequence})
                    pstart = process.hrtime()
                    this.emit("ping", {
                        start:pstart,
                        ping:this.ping
                    })
                }
                this.heart = setInterval(()=>{
                    this.send(1, {d:this.sequence})
                    pstart = process.hrtime()
                    this.emit("ping", {
                        start:pstart,
                        ping:this.ping
                    })
                },  this.heartbeat*Math.random())
            }
        })
    }
    async loggin(token){
        this.send(2, {
                d:{
                    token,
                    intents:this.intents.value,
                    large_threshold:250,
                    /* shard:[], */
                    /* presence:{}, */
                    properties:{
                        os:process.platform,
                        browser:"Lunae",
                        device:"Lunae"
                    }
                }
            }
        )
    }
    /**
     * send data througt websocket
     * @param {1|2|3|4|6|8} op 1: ping, 2: loggin, 3: presence, 4: voice update, 6:resume connection, 8: request members list
     * @param {Object} data 
     * @param {*} data.d
     * @param {String} data.t
     * @param {Number} data.s
     */
    send(op, data){
        if(![1,2,3,4,6,8].includes(op)) throw new error.apiError({message: "unallowed op code: "+op})

        this.connection.send(JSON.stringify(Object.assign({op}, data)))
    }
}

module.exports = WebSocketManager