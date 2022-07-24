const error = require("./Error")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Buffer = require("node:buffer").Buffer
const fs = require("node:fs")

module.exports.snowflake=(id)=>{
    const date = Number((BigInt(id) >> 22n)+ 1420070400000n)
    return {
        timestamp:date,
        date:new Date(date)
    }
}
module.exports.Image = Image
function Image(hash, path, id, options){
	if(!path)throw new error({message:"cannot get image"})
    if(hash===null)return null
	return `${Image.base}${path}/${id}/${hash}.${Image.formats.includes(options?.format)?options.format:Image.formats[0]}${Image.sizes.includes(options?.size)?`?size=${options.size}`:""}`
	}
Image.base = "https://cdn.discordapp.com/"
Image.formats = [ "png", "jpg", "jpeg", "webp", "gif", "json" ]
Image.sizes = Array.from(new Array(9), (_, i)=>2**(i+4))

module.exports.componentToHex = function componentToHex(c) { return (c.toString(16)).length == 1 ? "0" + (c.toString(16)) : (c.toString(16)); };

module.exports.testUrl = function testUrl(url){ return (/^https?:\/\/[a-zA-Z0-9]+\.((?:[a-zA-Z0-9]+\.){0,15}[a-zA-Z0-9_]+)((?:\/?(?:[a-zA-Z0-9]\/?)+)+)?\??((?:&?[a-zA-Z0-9_]+=[^&\n\s]+)+)?$/).test(url) }
module.exports.testImageURL = function testImageURL(url){ return this.testUrl(url) && (/(?:png|jpg|jpeg|webp|gif)$/).test(url) }
module.exports.array = {
	separate(array, callback){
		if(!(array instanceof Array))throw new error({message:"Invalid 1st argument: \n	must be an Array, got an "+typeof callback+ " instead"})
		if(!(callback instanceof Function))throw new error({message:"Invalid callback: \n	must be an Function, got an "+typeof callback+ " instead"})
		const obj = {}
		array.map((t,i,a)=>[callback(t,i,a), t]).forEach(t=>t[0] instanceof Object?obj[Symbol.for(typeof t[0])] instanceof Array?obj[Symbol.for(typeof t[0])].push(t[1]):obj[Symbol.for(typeof t[0])]=[t[1]]:obj[t[0]] instanceof Array? obj[t[0]].push(t[1]): obj[t[0]]=[t[1]])
		return obj
	}
}
module.exports.string = {
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

module.exports.clock = function clock(start){
    if(!start)return process.hrtime()
    let end  = process.hrtime(start)
    return Math.round((end[0]*1000)+(end[1]/1000000))
}

module.exports.Data = class Data{
    constructor(data, options={}){
        this.data = data
        this.options = options
    }
    async ImageData(){
        if(Buffer.isBuffer(this.data)){
            return `data:image/jpeg;base64,${this.data.toString('base64')}`
        }
        if(typeof this.data === "string"){
            if(this.data.match(/^http(?:s\:|\:)\/\//)){
                return await fetch(this.data).then(async t=>{
                    if(t.ok){
                        let ext
                        if(["image/gif", "image/png", "image/jpeg", "image/bmp", "image/webp"].includes(t.headers.get("Content-Type")))ext = t.headers.get("Content-Type").split("/")[1]
                        else ext = "jpeg"
                        
                        if(Buffer.isBuffer(t.body))return `data:image/${ext};base64,${t.body.toString('base64')}`
                        else {
                            const buffer = []
                            for await (let d of t.body) buffer.push(d)
                            return `data:image/${ext};base64,${Buffer.concat(buffer).toString('base64')}`
                        }
                    } else {
                        throw new error("invalid image data")
                    }
                }).catch(t=>{throw new error("an error occured when reaching for ("+this.data+")")})
            } else {
                if(fs.existsSync(this.data)){
                    if(fs.statSync(this.data).isFile()){
                        const splt = this.data.split(".")
                        const ext = ["jpeg", "jpg", "png", "gif", "bmp", "webp"].includes(splt[splt.length-1])?splt[splt.length-1]:"jpeg"

                        return `data:image/${ext};base64,${fs.readFileSync(this.data, 'base64')}`
                    }else throw new error("invalid image data")
                }else throw new error("invalid image data")
            }
        } else throw new error("invalid image data")
    }
}