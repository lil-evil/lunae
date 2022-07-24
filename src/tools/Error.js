const Util = {
    string :{
        decolorize(string){
            if(typeof string !== "string")throw new error({message:"argument must be a string"})
            const reg = /\[[0-9]{1,2}m/g
            return string.replace(reg, "")
        },
        colorize(string){
            if(typeof string !== "string")throw new error({message:"argument must be a string"})
            const colors = {$:{n:30, r:31, g:32, y:33, b:34, m:35, c:36, w:97, 0:0, 1:1, 2:2, 3:3, 4:4}, $$:{n:40, r:41, g:42, y:43, b:44, m:45, c:46, w:107}}
            const reg = /\${1,2}([a-z0-4])/g
            return string.replace(reg, (t)=>{
                const color = t.startsWith("$$")?colors["$$"][t[t.length-1]]:colors["$"][t[t.length-1]]
                if(color == undefined)return ""
                else return `\x1b[${color}m`
            })+"\x1b[0m"
        }
    }
}

function head(name){return `[ ${name} ]`}
function getStackTrace(stack){
    stack = stack.split("\n")
    stack = stack.filter(t=>!t.includes("node:"))
    return stack.join("\n")
}
function getInfoStackTrace(stack){
    stack = stack.split("\n")
    stack.splice(1,1); stack.splice(2)
    return stack.join('\n')
}
function emit(name, data, lunae){
    if(!(typeof lunae === "object")) return
    if(!(lunae instanceof require("events"))) throw new error({message:"third argument must be a eventEmitter instance"})
    return lunae.emit(name, data)
}



class error extends Error{
    constructor({message="Unknown error"}={}, lunae){
        super(Util.string.colorize("$r"+message))
        this.name = Util.string.colorize(head("$4$bLunae$0::$rError$0"))
        this.stack = getStackTrace(this.stack)
        this.name=head("Lunae::Error")
        this.message=message; this.stackTrace=this.stack.split("\n").slice(1).map(t=>t.replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, ""))
        emit("error", {type:"error", message, stackTrace: this.stackTrace}, lunae)
        return this
    }
}

module.exports= error
module.exports.debug = function debug({message="Something has happened", module="Unknown", details={}}={}, lunae){
    if(!(lunae instanceof require("events"))) throw new error({message:"second argument must be a eventEmitter instance"}) 
    lunae.emit("debug", {message, module, details})
}

module.exports.warning = class warning extends Error {
    constructor({message="Something has happened!"}={}, lunae){
        super(Util.string.colorize("$y$1"+message))
        this.name = Util.string.colorize(head("$4$bLunae$0::$rWarning$0"))
        this.stack = getStackTrace(this.stack)
        this.name=head("Lunae::Warning")
        this.message=message; this.stackTrace=this.stack.split("\n").slice(1).map(t=>t.replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, ""))
        emit("warning", {type:"warning", message, stackTrace: this.stackTrace}, lunae)
        return this
    }
}

module.exports.fatalError = class fatalError extends Error{
    constructor({message="Unknown fatal error, can't continue!"}={}, lunae){
        super(Util.string.colorize("$r"+message))
        this.name = Util.string.colorize(head("$4$bLunae$0::$$r$1FatalError$0"))
        this.stack = getStackTrace(this.stack)
        this.name=head("Lunae::FatalError")
        this.message=message; this.stackTrace=this.stack.split("\n").slice(1).map(t=>t.replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, ""))
        emit("fatalError", {type:"fatalError", message, stackTrace: this.stackTrace}, lunae)
        return this
    }
}
module.exports.internalError = class internalError extends Error{
    constructor({message="Unknown fatal error, can't continue!"}={}, lunae){
        super(Util.string.colorize("$r"+message))
        this.name = Util.string.colorize(head("$4$bLunae$0::$$rInternalError$0"))
        this.stack = getStackTrace(this.stack)
        this.name=head("Lunae::IntenalError")
        this.message=message; this.stackTrace=this.stack.split("\n").slice(1).map(t=>t.replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, ""))
        emit("internalError", {type:"internalError", message, stackTrace: this.stackTrace}, lunae)
        return this
    }
}
module.exports.apiError = class apiError extends Error{
    constructor({message="Unknown error from discord API", path, status="UNKNOWN", data={}}={}, lunae){
        super(Util.string.colorize("$r"+message))
        this.name = Util.string.colorize(head("$4$bLunae$0::$$rApiError$0"))
        this.stack = getStackTrace(this.stack)
        this.name=head("Lunae::ApiError")
        this.data=data; this.path = path ?? null
        this.message=message; this.status = status; this.stackTrace=this.stack.split("\n").slice(1).map(t=>t.replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, ""))
        emit("apiError", {type:"apiError", path, message, status, stackTrace: this.stackTrace, data}, lunae)
        return this
    }
    static resolve(code){
        return code /* todo, resolve api error code to human text */
    }
}
module.exports.info = class info{
    constructor({message="something happened", reason="UNKNOWN"}={}, lunae){
        this.message = Util.string.colorize("$g"+message)
        this.name = Util.string.colorize(head("$4$bLunae$0::$gInfo$0"))
        Error.captureStackTrace(this)
        const stack = getInfoStackTrace(this.stack)
        this.stack = getStackTrace(this.stack)
        this.name=head("Lunae::Info")
        const module = stack.split("\n")[1].replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, "")
        this.message=message; this.module = module; this.stackTrace=this.stack.split("\n").slice(1).map(t=>t.replace(/^(.+\()/g, "").replace(/(?:\).+|\))/g, ""))
        emit("info", {type:"info", message, reason, module, stackTrace: this.stackTrace}, lunae)
        console.log(stack)
        return true
    }
}

/*
$ -color
    n:noir
    r:red
    g:green
    y:yellow
    b:blue
    m:magenta
    c:cyan
    w:white
    0:reset
    1:bold
    2:faint
    3:italic
    4:underline

$$ -background
    n:noir
    r:red
    g:green
    y:yellow
    b:blue
    m:magenta
    c:cyan
    w:white
*/

