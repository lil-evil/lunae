Lunae = require("./src/app")
config = require("./options.json")
lunae = new Lunae(config)

const devs = [ "550041732893376542", "580811402067836928", "782164174821523467" ]

lunae.on("MESSAGE_CREATE", async(data)=>{
    if(await lunae.net.api.users[data.author.id].get().then(t=>t.bot).catch(t=>true))return
    if(!devs.includes(data.author.id))return

    if(data.content.trim().split(" ")[0] !== "$e")return
    const args = data.content.trim().split(" ").slice(1).join(" ")
    let evaled

    const guild = lunae.guilds.get(data.guild_id)
    const channel = lunae.channels.get(data.channel_id)
    try{
        evaled = "```js\n"+require("node:util").inspect(await eval(args), 0, true).slice(0, 1990)+"\n```"
    } catch (err){
        evaled = "```js\n"+err+"\n```"
    }
    channel.send(evaled)
})

lunae.connect("ODgwNDU5MTA5NTU4ODA4NjU2.GsBaQW.rAP6ZgpVTpQT_t_qnDW6cB0EfB6N19ILeFrlt8")