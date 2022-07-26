const [ Guild, Channel, Message ] = [ require("../class/Guild"), require("../class/Channel"), require("../class/Message") ]
const error = require("../tools/Error"), bmap = require("../tools/Bmap")


class Extension extends bmap{
    constructor(lunae){
        super()
        Object.defineProperty(this, "lunae", {value:lunae, writable:false, configurable:false})
    }
    load(linker, options){
        if(typeof linker !== "function")throw new error({message:"unvalid extension linker, must be a function"})
        const ext = linker(lunae, options)

        if(!ext.id)throw new error({message:"invalid extension, missing or invalid <extension>.id"})
        if(this.has(ext.id))throw new error({message:"this extensions, is already loaded, or an extension share the same id."})
        return this.set(ext.id, ext)
    }
    send(filter, eventName, data){
        let ext = this.array
        if(typeof filer === "function"){}
    }
}


const handlers = {
    "GUILD_CREATE":(lunae, data)=>{
        const guild = Guild(data, lunae)
        lunae.guilds._add(guild.id, guild)
        return ["guild_create", guild]
    },
    "GUILD_UPDATE":(lunae, data)=>{
        const guild = Guild(data, lunae)
        return ["guild_create", lunae.guilds._add(guild.id, guild)]
    }
}

class Middleware {
    constructor(lunae){
        Object.defineProperty(this, "lunae", {value:lunae, writable:false, configurable:false})
        this._list = []
    }
    handle(event, ...data){
        let passthrough = false
        function done(ev, dt){
            if(!ev && (!dt || dt?.length < 1))return passthrough=true
            if(!ev || (!dt || dt?.length < 1) )return
            else {
                event = ev, data = dt
                return passthrough=true
            }
        }
        for(let func of this._list){
            if(typeof func !== "function")continue
            if(passthrough)continue
            func(event, data, done)
        }
        if(!passthrough)return
        if(event in handlers){
            return handlers[event](this.lunae, ...data)
        } else return [event, ...data]
    }
    
    use(func){
        if(typeof func !== "function")throw new error({message:"middleware must be a function."})
        this._list.push(func)
    }
}

module.exports = Middleware
module.exports.Extension = Extension