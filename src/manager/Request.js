const error = require("../tools/Error")

function t0ken(){}
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const wait = async(time)=>await new Promise(resolve=>setTimeout(resolve, time))

class RequestManager extends require("node:events") {
    constructor(lunae, token){
        super()
        Object.defineProperty(this, "lunae", {value:lunae})
        this.lunae.net.private = new WeakMap()
        this.lunae.net.private.set(t0ken, token)
        this.private = this.lunae.net.private

        Object.defineProperty(this.lunae.net, "api", {get:()=>Api.bind(this)()})
        this.queue = new Queue(this)
    }
    async send(method, path, options={}, opt={}){
        let data
        if(method instanceof Request){
            this.emit("retry", {path, method:method.req.method, retry:method.retry})
            data = await this.queue.push(method.clean())
        } else {
            this.emit("request", {path, method})
            const request = new Request(method, path, options, opt, this.lunae)
            data = await this.queue.push(request)
        }
        const res = await data.req.response
        /* todo: handle rate limits */

        if(!res.ok){
            const json = await res.json().catch(()=>{})
            if(res.status == 429){
                console.log("rate limit", data.req.retry) /* debug */

                this.emit("rateLimit", {path:data.req.path.replace(this.base, ""), data:json})
                this.onRateLimit=true
                this.rateLimitWait =  wait(Number(json.retry_after)*1000)
                await this.rateLimitWait
                this.onRateLimit=false
                return await this.send(data.req)
            }
            throw new error.apiError({status:res.status, path:res.url.replace(this.base, ""), message:json.message, data:json}, this.lunae)
        } else {
            this.emit("fail", {path, method})
            return res.headers.get("content-type").startsWith("application/json")?res.json().catch(()=>{}):res.buffer().catch(()=>{})
        }
    }

    static UserAgent="bot:lunae@v0.1.0"
    static base = "https://discord.com/api/v10"
    static methods = [
        "get",
        "patch",
        "put",
        "delete",
        "post"
    ]
    getAuthoritzation(y){
        return this.private.get(y)
    }
    static contentType(type){
        let types = {"text/html":["html"], "application/javascript":["js"], "application/pdf":["pdf"], "application/json":["json"], "image/gif":["gif"],"image/jpeg":["jpeg", "jpg"], "image/png":["png"], "text/css":["css"], "text/plain":[], "video/mp4":["mp4"], "audio/mpeg":["mp3"]}
        return (Object.entries(types).map(t=>t[1].includes(type)?.[0]?.slice(1)?t[0]:false)).filter(Boolean)[0]??"application/json"
    }
}

const Api = function(){
    let route = []
    const handler = {
        get:(target, name)=>{
            if(RequestManager.methods.includes(name))return async(arg, headers)=>{const path = "/"+route.join("/"); route = []; return await this.send.bind(this)(name, path, arg, headers)}
            route.push(name)
            return new Proxy(target, handler)
        },
        set:()=>{}
    }
    return new Proxy(()=>{}, handler)
}


class Request extends require("node:events"){
    constructor(method, path, options, opt, lunae){
        super()
        if(!RequestManager.methods.includes(method))throw new error({message:"Method not allowed : "+method})
        if(!path.startsWith("/"))throw new error({message:"Path must be a absolute path ( starting with \"/\" )"})
        if(!(!Array.isArray(options) && typeof options === "object"))new error({message:"options must be an object"})

        this.path = path
        this.link = RequestManager.base+path
        this.options = options
        this.retry = -1
        this.abortController = new AbortController()
        this.lunae = lunae

        this.req = {
            method, 
            headers: {
                Authorization:`Bot ${this.lunae.net.request.getAuthoritzation(t0ken)}`, 
                "User-Agent":RequestManager.UserAgent, 
                "Content-Type": RequestManager.contentType(options.type)
            }
        }
        Object.assign(this.req.headers, opt.headers??{})
        if(method !== "get")this.req.body=this.formatBody(options)
    }

    formatBody(options){
        if(options?.content){
            if(options.content.length > 2000) throw new error({message:"message content must be 2000 or fewer in length"})
        }
        let str =  JSON.stringify(options)
        return this.lunae.options.protectToken? str?.replace(this.lunae.net.request.getAuthoritzation(t0ken), "token"): str
    }
    send(){
        this.response = fetch(this.link, this.req, {signal : this.abortController.signal}).then(res=>{this.emit("end", {aborted:false, req:this}); return res})
        this.timeout =  setTimeout(()=>this.abort(), this.options.requestTimeout || 5000).unref()
        return this
    }
    async abort(){
        this.abortController.abort()
        this.emit("end", {aborted:true, req:this})
    }
    clean(){
        clearTimeout(this.timeout)
        this.response = null
        return this
    }
}

class Queue extends Array{
    constructor(requestManager){
        super()
        this.manager = requestManager
    }
    async push(req){
        if(!(req instanceof Request))throw new error({message:"Argument must be a Request, receveid instance of "+req.constructor.name})
        if(this.manager.onRateLimit)await this.manager.rateLimitWait
        if(req.retry >=req.options.retryLimit)throw new error.apiError({message:"request failed after maximum amout of retries", path:req.path}, req.lunae)
        if(this.length === 0){
            super.push(req)
            this.next()
        } else {super.push(req)}
        req.retry++
        return await new Promise((resolve)=>req.once("end", (data)=>{this.shift(); this.next();resolve(data)}))
    }
    async next(){
        if(this.length > 0){
            this[0].send().response
       }
    }
}
module.exports = RequestManager
module.exports.Request = Request
module.exports.Queue = Queue