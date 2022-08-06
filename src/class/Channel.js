const [ error, BaseManager, Message, Embed ] = [ require("../tools/Error"), require("../manager/BaseManager"), require("./Message"), require("./Embed")] /* production */

function formatChannel(data, lunae){

    let channel = new BaseChannel(data, lunae)/* create channel by it's type */
    return channel
}

class ChannelsManager extends BaseManager{
    constructor(lunae){
        super(lunae)
    }
}

class BaseChannel{
    constructor(data, lunae){
        Object.defineProperty(this, "lunae", {value:lunae})
        this.id = data.id
        this.type = null
    }

    async send(object){
        let data
        if(typeof object ==  "string"){
            data = {content:object}
        } else if(object instanceof Object && !(object instanceof Array)){
            data = object
        }

        if(Array.isArray(data.embeds)){
            data.embeds.map(t=>{if(t instanceof Embed)return t.json(); else return t})
        }
        const message = await this.lunae.net.api.channels[this.id].messages.post(data)
        return message
        if(!message.id)return message
        else return new Message(message, lunae)
    }
    async sendTyping(){

    }
    async delete(reason){

    }
    async edit(object){

    }

}

class TextChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class VoiceChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class DmChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class GroupDmChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class CategoryChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class NewsChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class NewsThreadChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class PublicThreadChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class PrivateThreadChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class StageChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class DirectoryChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}

class ForumChannel extends BaseChannel{
    constructor(data, lunae){
        super(data, lunae)
    }
}



module.exports = formatChannel
module.exports.manager = ChannelsManager

module.exports.BaseChannel = BaseChannel

module.exports.TextChannel = TextChannel
module.exports.DmChannel = DmChannel
module.exports.VoiceChannel = VoiceChannel
module.exports.GroupDmChannel = GroupDmChannel
module.exports.CategoryChannel = CategoryChannel
module.exports.NewsChannel = NewsChannel
module.exports.NewsThreadChannel = NewsThreadChannel
module.exports.PublicThreadChannel = PublicThreadChannel
module.exports.PrivateThreadChannel = PrivateThreadChannel
module.exports.StageChannel = StageChannel
module.exports.DirectoryChannel = DirectoryChannel
module.exports.ForumChannel = ForumChannel