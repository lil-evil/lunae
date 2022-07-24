const [ error, BaseManager, Channel, Util ] = [require("../tools/Error"), require("../manager/BaseManager"), require("./Channel"), require("../tools/Util")]


function formatGuild(data, lunae, add){

    let guild = new Guild(data, lunae)
    if(add)return lunae.guilds._add(guild.id, guild)
    return guild
}
class GuildsManager extends BaseManager{
    constructor(lunae){
        super(lunae)
        
    }
    async fetch(id){
        if(!id || typeof id !== "string") throw new error({message:"missing valid id."})
        const guild = await this.lunae.net.api.guilds[id].get({with_counts:true})
        return formatGuild(guild, this.lunae, true)
    }
    async create(){}
}

class Guild{
    constructor(data, lunae){
        Object.defineProperty(this, "lunae", {value:lunae})
        this.id = data.id
        this.name = data.name
        this.channels = new Channel.manager(lunae)
        /* add channels */
        if(Array.isArray(data.channels)){
            data.channels.forEach((t)=>{
                t = Channel(t, lunae)
                t.guild = t
                lunae.channels._add(t.id, t)
                this.channels._add(t.id, t)
            })
        }
        this.icon = data.icon ?? data.icon_hash
        this.owner = data.owner_id /* create user or get user */
        this.afkTimeout = data.afk_timeout
        this.afkChannel = data.afk_channel_id
        this.verificationLevel = data.verification_level
        this.notificationLevel = data.default_message_notifications
        this.explicitContentFilter = data.explicit_content_filter
        this.mfa = data.mfa_level
        this.systemChannel = data.system_channel_id
        this.rulesChannel = data.rules_channel_id
        this.maxMembers = data.max_members
        this.maxPresences = data.max_presences
        this.desciption = data.desciption
        this.banner = data.banner
        this.premium  = data.premium_tier
        this.premiumCount = data.premium_subscription_count ?? 0
        this.premiumBarEnabled = data.premium_progress_bar_enabled
        this.nsfwLevel = data.nsfw_level
        this.local = data.preferred_locale
        this.CommunityUpdateChannel = data.public_updates_channel_id
        this.maxUsersInVideoChannel = data.max_video_channel_users
        this.aMemberCount = data.approximate_member_count
        this.aPresenceCount = data.approximate_presence_count



        this.features = data.features /* parse to roles manager */
        this.roles = data.roles /* parse to roles manager */
        this.emojis = data.emojis /* parse to emoji manager */
        this.stickers = data.stickers /* parse to stickers manager */
        this.bans = data.bans /* parse to bans manager */
        this.invites = data.invites /* parse to invites manager */
        this.integrations = data.integrations /* parse to integrations manager */
        this.widget = data.widget   /* parse to widget Class */
        this.welcomeScreen = data.welcomeScreen   /* parse to welcomeScreen Class */
        this.voices = data.voices   /* parse to voices manager */

        /* splash?
            discovery_splash?
            permissions:me.permissions
            widget_enabled:widget.enabled
            widget_channel_id:widget.channel_id
            application_id?
            system_channel_flags: systemChannel.flags
            vanity_url_code:vanityURL.code
            welcome_screen
        */



    }
    getIcon(options={}){
        return Util.Image(this.icon, "icons", this.id, options)
    }
    getBanner(options={}){

        return Util.Image(this.banner, "banners", this.id, options)
    }
    async setName(name, reason){
        return this.edit({name, reason})
    }
    async setIcon(icon, reason){
        return this.edit({icon, reason})
    }
    async edit(options){

        const [data, opt] = [{}, {}]
        if("name" in options){
            data.name = options.name
        }
        if("region" in options){
            data.region = options.region
        }
        if("verification_level" in options){
            data.verification_level = options.verification_level
        }
        if("default_message_notifications" in options){
            data.default_message_notifications = options.default_message_notifications
        }
        if("explicit_content_filter" in options){
            data.explicit_content_filter = options.explicit_content_filter
        }
        if("afk_channel_id" in options){
            data.afk_channel_id = options.afk_channel_id
        }
        if("afk_timeout" in options){
            data.afk_timeout = options.afk_timeout
        }
        if("owner_id" in options){
            data.owner_id = options.owner_id
        }
        if("system_channel_id" in options){
            data.system_channel_id = options.system_channel_id
        }
        if("system_channel_flags" in options){
            data.system_channel_flags = options.system_channel_flags
        }
        if("rules_channel_id" in options){
            data.rules_channel_id = options.rules_channel_id
        }
        if("public_updates_channel_id" in options){
            data.public_updates_channel_id = options.public_updates_channel_id
        }
        if("preferred_locale" in options){
            data.preferred_locale = options.preferred_locale
        }
        if("description" in options){
            data.description = options.description
        }
        if("premium_progress_bar_enabled" in options){
            data.premium_progress_bar_enabled = options.premium_progress_bar_enabled
        }
        if("features" in options){
            data.features = options.features
        }

        if("icon" in options){
            data.icon =  await new Util.Data(options.icon).ImageData()
        }
        if("splash" in options){
            data.splash = await new Util.Data(options.splash).ImageData()
        }
        if("disovery_splash" in options){
            data.disovery_splash = await new Util.Data(options.disovery_splash).ImageData()
        }
        if("banner" in options){
            data.banner = await new Util.Data(options.banner).ImageData()
        }

        if("reason" in options){
            opt.headers = {"X-Audit-Log-Reason": options.reason}
        }

        await this.lunae.net.api.guilds[this.id].patch(data, opt)
        return this
    }
    async fetch(){
        const guild = await this.lunae.net.api.guilds[this.id].get({with_counts:true})
        return formatGuild(guild, this.lunae, true)
    }
    async delete(){}
    async setMfa(){}
    async pruneCount(){}
    async prune(){}
    async getVoiceRegions(){}
    async getVanityURL(){}
}

module.exports = formatGuild
module.exports.manager = GuildsManager
module.exports.Guild = Guild