const error = require("../tools/Error")

class BitBase{
    constructor(mapper, bits){ //accept integer, string, array of flags
        let bit
        if(["bigint", "number", "string"].includes(typeof bits)){
            bit = Number(bits)
            if(isNaN(bit))throw new error({message:`Cannot convert ${bits} to a BigInt`})
            bit = BigInt(bit)
            if(!this.validate(bit))throw new error({message:"Bits value is out of range"})
            mapper.call(this, Object.values(this.constructor.flags).map(f=>({...f, _value:(bit & f.value)===f.value})).filter(f=>Boolean(f._value)))
        } else if(bits instanceof Array && bits?.length > 0){
            mapper.call(this, Object.values(this.constructor.flags).map(f=>({...f, _value:bits.includes(f.name)})).filter(f=>Boolean(f._value)))
        }
    }

    static flags = {
    }
    static max = 0n
    value=0n
    flags={}
    get max(){return this.constructor.max}
    static validate(bit){
        return Boolean(bit <= this.max && bit >0n)
    }
    validate(bit){return this.constructor.validate(bit)}
    has(value){
        return value in this.flags
    }
    list(){
        return Object.fromEntries(Object.values(this.constructor.flags).map(t=>[t.name, t.name in this.flags]))
    }
    
}

class Permissions extends BitBase{
    constructor(bits){
        function mapper(arr){
            arr.forEach(t=>{
                this.flags[t.name]=t.value
                this.value=this.value|t.value
            })
        }
        super(mapper, bits)
    }
    static flags = new Proxy({
        CREATE_INSTANT_INVITE:1n<<0n,
        KICK_MEMBERS:1n<<1n,
        BAN_MEMBERS:1n<<2n,
        ADMINISTRATOR:1n<<3n,
        MANAGE_CHANNELS:1n<<4n,
        MANAGE_GUILD:1n<<5n,
        ADD_REACTIONS:1n<<6n,
        VIEW_AUDIT_LOG:1n<<7n,
        PRIORITY_SPEAKER:1n<<8n,
        STREAM:1n<<9n,
        VIEW_CHANNEL:1n<<10n,
        SEND_MESSAGES:1n<<11n,
        SEND_TTS_MESSAGES:1n<<12n,
        MANAGE_MESSAGES:1n<<13n,
        EMBED_LINKS:1n<<14n,
        ATTACH_FILES:1n<<15n,
        READ_MESSAGE_HISTORY:1n<<16n,
        MENTION_EVERYONE:1n<<17n,
        USE_EXTERNAL_EMOJIS:1n<<18n,
        VIEW_GUILD_INSIGHTS:1n<<19n,
        CONNECT:1n<<20n,
        SPEAK:1n<<21n,
        MUTE_MEMBERS:1n<<22n,
        DEAFEN_MEMBERS:1n<<23n,
        MOVE_MEMBERS:1n<<24n,
        USE_VAD:1n<<25n,
        CHANGE_NICKNAME:1n<<26n,
        MANAGE_NICKNAMES:1n<<27n,
        MANAGE_ROLES:1n<<28n,
        MANAGE_WEBHOOKS:1n<<29n,
        MANAGE_EMOJIS_AND_STICKERS:1n<<30n,
        USE_APPLICATION_COMMANDS:1n<<31n,
        REQUEST_TO_SPEAK:1n<<32n,
        MANAGE_EVENTS:1n<<33n,
        MANAGE_THREADS:1n<<34n,
        CREATE_PUBLIC_THREADS:1n<<35n,
        CREATE_PRIVATE_THREADS:1n<<36n,
        USE_EXTERNAL_STICKERS:1n<<37n,
        SEND_MESSAGES_IN_THREADS:1n<<38n,
        USE_EMBEDDED_ACTIVITIES:1n<<39n,
        MODERATE_MEMBERS:1n<<40n
    }, {
        get:(target, name)=>{
            if(target[name]){
                const value = Object.keys(target).indexOf(name)
                return {name:name, value:target[name]}
            }
        }
    })
    static max = Object.values(this.flags).reduce((a,b)=>a|b.value, 0n)
}

class Intents extends BitBase{
    constructor(bits){
        function mapper(arr){
            this.events = this.constructor.default
            arr.forEach(t=>{
                this.flags[t.name]=t.value
                this.value=this.value|t.value
                this.events=this.events.concat(t.events)
            })
        }
        super(mapper, bits)
    }
    static default = [
        "READY",
        "VOICE_SERVER_UPDATE",
        "APPLICATION_COMMAND_CREATE",
        "APPLICATION_COMMAND_UPDATE",
        "APPLICATION_COMMAND_DELETE",
        "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
        "INTERACTION_CREATE",
        "USER_UPDATE"
    ]
    static flags = new Proxy({
        GUILDS:["GUILD_CREATE", "GUILD_UPDATE","GUILD_DELETE","GUILD_ROLE_CREATE","GUILD_ROLE_UPDATE","GUILD_ROLE_DELETE","CHANNEL_CREATE","CHANNEL_UPDATE","CHANNEL_DELETE","CHANNEL_PINS_UPDATE","THREAD_CREATE","THREAD_UPDATE","THREAD_DELETE","THREAD_LIST_SYNC","THREAD_MEMBER_UPDATE","THREAD_MEMBERS_UPDATE","STAGE_INSTANCE_CREATE","STAGE_INSTANCE_UPDATE","STAGE_INSTANCE_DELETE"],
        GUILD_MEMBERS:["GUILD_MEMBER_ADD","GUILD_MEMBER_UPDATE","GUILD_MEMBER_REMOVE","THREAD_MEMBERS_UPDATE"],
        GUILD_BANS:["GUILD_BAN_ADD","GUILD_BAN_REMOVE"],
        GUILD_EMOJIS_AND_STICKERS:["GUILD_EMOJIS_UPDATE", "GUILD_STICKERS_UPDATE"],
        GUILD_INTEGRATIONS :["GUILD_INTEGRATIONS_UPDATE", "INTEGRATION_CREATE", "INTEGRATION_UPDATE", "INTEGRATION_DELETE"],
        GUILD_WEBHOOKS:["WEBHOOKS_UPDATE"],
        GUILD_INVITES:["INVITE_CREATE", "INVITE_DELETE"],
        GUILD_VOICE_STATES:["VOICE_STATE_UPDATE"],
        GUILD_PRESENCES:["PRESENCE_UPDATE"],
        GUILD_MESSAGES:["MESSAGE_CREATE", "MESSAGE_UPDATE", "MESSAGE_DELETE", "MESSAGE_DELETE_BULK"],
        GUILD_MESSAGE_REACTIONS:["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "MESSAGE_REACTION_REMOVE_EMOJI"],
        GUILD_MESSAGE_TYPING:["TYPING_START"],
        DIRECT_MESSAGES:["MESSAGE_CREATE", "MESSAGE_UPDATE", "MESSAGE_DELETE", "CHANNEL_PINS_UPDATE"],
        DIRECT_MESSAGE_REACTIONS:["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "MESSAGE_REACTION_REMOVE_EMOJI"],
        DIRECT_MESSAGE_TYPING:["TYPING_START"],
        MESSAGE_CONTENT:[],
        GUILD_SCHEDULED_EVENTS:["GUILD_SCHEDULED_EVENT_CREATE", "GUILD_SCHEDULED_EVENT_UPDATE", "GUILD_SCHEDULED_EVENT_DELETE", "GUILD_SCHEDULED_EVENT_USER_ADD", "GUILD_SCHEDULED_EVENT_USER_REMOVE"],
        AUTO_MODERATION_CONFIGURATION:["AUTO_MODERATION_RULE_CREATE", "AUTO_MODERATION_RULE_UPDATE", "AUTO_MODERATION_RULE_DELETE"],
        AUTO_MODERATION_EXECUTION:["AUTO_MODERATION_ACTION_EXECUTION"]

    }, {get:(target, name)=>{
            if(target[name]){
                const value = Object.keys(target).indexOf(name)
                return {name:name, value:1n<<BigInt(value>16?value+3:value), events:target[name]}
            }}
    })
    static max = Object.values(this.flags).reduce((a,b)=>a|b.value, 0n)
}


module.exports = {
    BitBase,
    Permissions,
    Intents
}