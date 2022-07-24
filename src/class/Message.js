const BaseManager = require("../manager/BaseManager")

function formatMessage(data, lunae){
    return message = new Message(data, lunae)
}

const MessageTypes = {
    0:"DEFAULT",
    1:"RECIPIENT_ADD",
    2:"RECIPIENT_REMOVE",
    3:"CALL",
    4:"CHANNEL_NAME_CHANGE",
    5:"CHANNEL_ICON_CHANGE",
    6:"CHANNEL_PINNED_MESSAGE",
    7:"USER_JOIN",
    8:"GUILD_BOOST",
    9:"GUILD_BOOST_TIER_1",
    10:"GUILD_BOOST_TIER_2",
    11:"GUILD_BOOST_TIER_3",
    12:"CHANNEL_FOLLOW_ADD",
    14:"GUILD_DISCOVERY_DISQUALIFIED",
    15:"GUILD_DISCOVERY_REQUALIFIED",
    16:"GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING",
    17:"GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING",
    18:"THREAD_CREATED",
    19:"REPLY",
    20:"CHAT_INPUT_COMMAND",
    21:"THREAD_STARTER_MESSAGE",
    22:"GUILD_INVITE_REMINDER",
    23:"CONTEXT_MENU_COMMAND",
    24:"AUTO_MODERATION_ACTION"
}

class MessagesManager extends BaseManager{
    constructor(lunae){
        super(lunae)
    }
}

class Message{
    constructor(data, lunae){
        if(!data.id)return null
        this.id = data.id
        this.tts = data.tts
        
    }

}

module.exports = formatMessage
module.exports.manager = MessagesManager
module.exports.Message = Message
module.exports.types = MessageTypes