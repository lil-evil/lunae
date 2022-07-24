const error = require("../tools/Error")


class Intents {
	constructor(int = {}){
		if(Number.isFinite(int)){
			if(!this.constructor.validate(int))throw new error({message:"Intent value is out of range"})
			const reduced = {intents:[], events:[...Intents.default], value:0}
			Object.entries(this.constructor.list).map(t=>({name:t[0], value:(int & t[1].value)=== t[1].value})).filter(t=>Boolean(t.value)).forEach(t=>{reduced.intents.push(t.name); reduced.events = reduced.events.concat(this.constructor.list[t.name].events); reduced.value|=this.constructor.list[t.name].value})
			return reduced
		} else if(int instanceof Array && int?.length > 0){
			if(!this.constructor.validate(int))throw new error({message:"Invalid Intents name provided: ["+int.map((t)=>({name:t, valid:Object.keys(this.constructor.list).includes(t)})).filter(t=>t.valid===false).map(t=>t.name).join(", ")+"]"})
			const reduced = {intents:[], events:[...Intents.default], value:0}
			int.forEach(t=>{reduced.intents.push(t); reduced.events = reduced.events.concat(this.constructor.list[t].events); reduced.value|=this.constructor.list[t].value})
			return reduced
		} else {
			throw new error({message:"Intents must be a number or array of intents name"})
		}
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
	static list = new Proxy({
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

	}, {get:((target, name)=>{
            if(target[name]){
                const value = Object.keys(target).indexOf(name)
                return {name:name, value:1<<(value>16?value+3:value), events:target[name]}
            }}).bind(this)
        })
	static validate(bit){
		if (bit instanceof Array)return Boolean(bit.length > 0 && bit.map((t)=>({name:t, valid:Object.keys(this.list).includes(t)})).filter(t=>t.valid===false).length<=0)
		else return Boolean(Number.isFinite(bit) && bit <= this.max && bit >0)
	}
    static max = Object.entries(this.list).reduce((a,b)=>a|b[1].value, 0)
}

module.exports = Intents