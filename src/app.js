/** main class */
class Lunae extends require("node:events") {

    /**
     * initialize your client
     * @param {Object} options
     * @param {Number} options.intents
     */
    constructor(options = {}){
        super()

        /* parse and verify options */
        if(typeof options !==  "object" || Array.isArray(options))throw new module.exports.Error({message:"options must be an object"})
            /* intents */
        if(!module.exports.Bits.Intents.validate(options.intents)) throw new module.exports.Error({message:"missing or invalid options.intents"})
            /* retryLimit */
        if("retryLimit" in options){
            if(isNaN(options.retryLimit) || options.retryLimit >100 || options.retryLimit < 0)throw new module.exports.Error({message:"invalid options.retryLimit (must be a finite number between 0 and 100)"})
        } else {options.retryLimit = 3}
            /* protectToken */
        if("protectToken" in options){
            if(typeof options.protectToken !== "boolean") throw new module.exports.Error({message:"invalid options.protectToken (must be a boolean)"})
        } else {options.protectToken = true}
            /* requestTimeout */
        if("requestTimeout" in options){
            if(isNaN(options.requestTimeout) || options.requestTimeout < 0)throw new module.exports.Error({message:"invalid options.requestTimeout (must be a finite number greater than 0)"})
        } else {options.requestTimeout = 5000}

        this.options = options

        /* set managers */
        this.guilds = new (module.exports.GuildClass.manager)(this)
        this.users
        this.channels = new (module.exports.ChannelClass.manager)(this)
        this.net = {
            ws: new (module.exports.Websocket)(this, new (module.exports.Bits.Intents)(options.intents)),
            request:null
        }
    }
    connect(token){
        const t =  token ?? global.TOKEN ?? process.env["LUNAE_TOKEN"]
        if(!t || typeof t !== "string") throw new module.exports.Error({message:"missing token"})

        this.net.request = new (module.exports.Request)(this, token) /* init req class */

        this.net.ws.connect(t)
        Object.defineProperty(this, "ping", { get: function () { return this.net.ws.ping } });
    }
    middleware = new (require("./manager/Middleware"))(this)
    extensions = new(require("./manager/Middleware").Extension)(this)
    load(...args){return this.extensions.load(...args)}
    use(...args){return this.middleware.use(...args)}
}

/* exports */
module.exports = Lunae
module.exports.Error = require("./tools/Error")

/* class */
module.exports.Member = {Member:class Member{}}
module.exports.User = {User:class User{}}
exports = module.exports.GuildClass = require("./class/Guild")
module.exports.Guild = exports.Guild
exports = module.exports.ChannelClass = require("./class/Channel")
module.exports.BaseChannel = exports.BaseChannel
module.exports.TextChannel = exports.TextChannel
module.exports.DmChannel = exports.DmChannel
module.exports.VoiceChannel = exports.VoiceChannel
module.exports.GroupDmChannel = exports.GroupDmChannel
module.exports.CategoryChannel = exports.CategoryChannel
module.exports.NewsChannel = exports.NewsChannel
module.exports.NewsThreadChannel = exports.NewsThreadChannel
module.exports.PublicThreadChannel = exports.PublicThreadChannel
module.exports.PrivateThreadChannel = exports.PrivateThreadChannel
module.exports.StageChannel = exports.StageChannel
module.exports.DirectoryChannel = exports.DirectoryChannel
module.exports.ForumChannel = exports.ForumChannel

module.exports.Message = require("./class/Message")
module.exports.Embed = require("./class/Embed")
module.exports.Emoji
module.exports.Sticker
module.exports.Bmap = require("./tools/Bmap")
module.exports.Websocket = require("./manager/Websocket") 
module.exports.Request = require("./manager/Request")
module.exports.Util = require("./tools/Util")
module.exports.baseManager = require("./manager/BaseManager")
exports = module.exports.Bits = require("./class/Bit")
module.exports.Permissions = exports.Permissions
module.exports.Intents = exports.Intents

/* class manager */