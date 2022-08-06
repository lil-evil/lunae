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
    if(!hash)return undefined
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

const Colorlist = {
    "lightpink":"#FFB6C1",
    "pink":"#FFC0CB",
    "crimson":"#DC143C",
    "lavenderblush":"#FFF0F5",
    "palevioletred":"#DB7093",
    "hotpink":"#FF69B4",
    "deeppink":"#FF1493",
    "mediumvioletred":"#C71585",
    "orchid":"#DA70D6",
    "thistle":"#D8BFD8",
    "plum":"#DDA0DD",
    "violet":"#EE82EE",
    "fuchsia":"#FF00FF",
    "darkmagenta":"#8B008B",
    "purple":"#800080",
    "mediumorchid":"#BA55D3",
    "darkviolet":"#9400D3",
    "darkorchid":"#9932CC",
    "indigo":"#4B0082",
    "blueviolet":"#8A2BE2",
    "mediumpurple":"#9370DB",
    "mediumslateblue":"#7B68EE",
    "slateblue":"#6A5ACD",
    "darkslateblue":"#483D8B",
    "ghostwhite":"#F8F8FF",
    "lavender":"#E6E6FA",
    "blue":"#0000FF",
    "mediumblue":"#0000CD",
    "darkblue":"#00008B",
    "navy":"#000080",
    "midnightblue":"#191970",
    "royalblue":"#4169E1",
    "cornflowerblue":"#6495ED",
    "lightsteelblue":"#B0C4DE",
    "lightslategray":"#778899",
    "slategray":"#708090",
    "dodgerblue":"#1E90FF",
    "aliceblue":"#F0F8FF",
    "steelblue":"#4682B4",
    "lightskyblue":"#87CEFA",
    "skyblue":"#87CEEB",
    "deepskyblue":"#00BFFF",
    "lightblue":"#ADD8E6",
    "powderblue":"#B0E0E6",
    "cadetblue":"#5F9EA0",
    "darkturquoise":"#00CED1",
    "azure":"#F0FFFF",
    "lightcyan":"#E0FFFF",
    "paleturquoise":"#AFEEEE",
    "aqua":"#00FFFF",
    "darkcyan":"#008B8B",
    "teal":"#008080",
    "darkslategray":"#2F4F4F",
    "mediumturquoise":"#48D1CC",
    "lightseagreen":"#20B2AA",
    "turquoise":"#40E0D0",
    "aquamarine":"#7FFFD4",
    "mediumaquamarine":"#66CDAA",
    "mediumspringgreen":"#00FA9A",
    "mintcream":"#F5FFFA",
    "springgreen":"#00FF7F",
    "mediumseagreen":"#3CB371",
    "seagreen":"#2E8B57",
    "honeydew":"#F0FFF0",
    "darkseagreen":"#8FBC8F",
    "palegreen":"#98FB98",
    "lightgreen":"#90EE90",
    "limegreen":"#32CD32",
    "lime":"#00FF00",
    "forestgreen":"#228B22",
    "green":"#008000",
    "darkgreen":"#006400",
    "lawngreen":"#7CFC00",
    "chartreuse":"#7FFF00",
    "greenyellow":"#ADFF2F",
    "darkolivegreen":"#556B2F",
    "yellowgreen":"#9ACD32",
    "olivedrab":"#6B8E23",
    "ivory":"#FFFFF0",
    "beige":"#F5F5DC",
    "lightyellow":"#FFFFE0",
    "lightgoldenrodyellow":"#FAFAD2",
    "yellow":"#FFFF00",
    "olive":"#808000",
    "darkkhaki":"#BDB76B",
    "palegoldenrod":"#EEE8AA",
    "lemonchiffon":"#FFFACD",
    "khaki":"#F0E68C",
    "gold":"#FFD700",
    "cornsilk":"#FFF8DC",
    "goldenrod":"#DAA520",
    "darkgoldenrod":"#B8860B",
    "floralwhite":"#FFFAF0",
    "oldlace":"#FDF5E6",
    "wheat":"#F5DEB3",
    "orange":"#FFA500",
    "moccasin":"#FFE4B5",
    "papayawhip":"#FFEFD5",
    "blanchedalmond":"#FFEBCD",
    "navajowhite":"#FFDEAD",
    "antiquewhite":"#FAEBD7",
    "tan":"#D2B48C",
    "burlywood":"#DEB887",
    "darkorange":"#FF8C00",
    "bisque":"#FFE4C4",
    "linen":"#FAF0E6",
    "peru":"#CD853F",
    "peachpuff":"#FFDAB9",
    "sandybrown":"#F4A460",
    "chocolate":"#D2691E",
    "saddlebrown":"#8B4513",
    "seashell":"#FFF5EE",
    "sienna":"#A0522D",
    "lightsalmon":"#FFA07A",
    "coral":"#FF7F50",
    "orangered":"#FF4500",
    "darksalmon":"#E9967A",
    "tomato":"#FF6347",
    "salmon":"#FA8072",
    "mistyrose":"#FFE4E1",
    "lightcoral":"#F08080",
    "snow":"#FFFAFA",
    "rosybrown":"#BC8F8F",
    "indianred":"#CD5C5C",
    "red":"#FF0000",
    "brown":"#A52A2A",
    "firebrick":"#B22222",
    "darkred":"#8B0000",
    "maroon":"#800000",
    "white":"#FFFFFF",
    "whitesmoke":"#F5F5F5",
    "gainsboro":"#DCDCDC",
    "lightgrey":"#D3D3D3",
    "silver":"#C0C0C0",
    "darkgray":"#A9A9A9",
    "gray":"#808080",
    "dimgray":"#696969",
    "black":"#000000"
}
module.exports.Colorlist = Colorlist
class Color{
    constructor(color, type){
        if(typeof color === "string"){
            if(color.toString("utf8").trim().toLowerCase() == "random"){
                this.value = Color.toHex(Math.random().toString(16).slice(2,8))
                this.type = "hex"
            }
        } else {
            if(Array.isArray(color) && color.length === 3){ //admit it's rgb
                if(type === "hsl"){this.type = "hsl"; this.value = {h:color[0], s:color[1], l:color[2]}}
                else {this.type = "rgb"; this.value = {r:color[0], g:color[1], b:color[2]}}
            } else if(typeof color === "object"){ //hsl or rgb
                if("h" in color && "s" in color && "l" in color){ //hsl
                    this.type = "hsl"; this.value = {h:color.h, s:color.s, l:color.l}
                } else if("r" in color && "g" in color && "b" in color){
                    this.type = "rg"; this.value = {r:color.r, g:color.g, b:color.b}
                }
            } else if(["string", "number"].includes(typeof color)){
                if(color.toString(16).match(/^#?[a-fA-F0-9]{6}$/)){ //hex!
                    this.value = (color.toString(16)?.startsWith("#")? "":"#") + color.toString(16)
                    this.type = "hex"
                } else { //name..?
                    if(color in Colorlist) {
                        this.type="name"
                        this.value = color
                    }
                }
            }
        }

        if(!this.type || !this.value)throw new error({message:"invalid color"})

    }
    toRgb(){
        return new Color(Color.toRgb(this.value), "rgb")
    }
    toHex(){
        return new Color(Color.toHex(this.value), "hex")
    }
    toHsl(){
        return new Color(Color.toHsl(this.value), "hsl")
    }
    toName(){
        return new Color(Color.toName(this.value), "name")
    }
    get hsl(){
        if(this.type=="hsl")return this.value
        else return Color.toHsl(this.value)
    }
    get hex(){
        if(this.type=="hex")return this.value
        else return Color.toHex(this.value)
    }
    get rgb(){
        if(this.type=="rgb")return this.value
        else return Color.toRgb(this.value)
    }
    get name(){
        if(this.type=="name")return this.value
        else return Color.toName(this.value)
    }
    toJSON(){
        return parseInt(this.hex.slice(1), 16)
    }


    static toRgb(color){
        if(Array.isArray(color)&& color.length === 3){ //admit it's hsl
           return Color.hslToRgb({h:color[0], s:color[1], l:color[2]})
        } else if(typeof color === "object"){ //hsl or rgb
            if("h" in color && "s" in color && "l" in color){ //hsl
                return Color.hslToRgb(color)
            } else if("r" in color && "g" in color && "b" in color){
                return color
            }
        } else if(["string", "number"].includes(typeof color)){
            if(color.toString(16).match(/^#?[a-fA-F0-9]{6}$/)){ //hex!
                return Color.hexToRgb(color.toString(16))
            } else { //name..?
                let hex = nameToHex(color)
                if(hex) return Color.hexToRgb(hex)
            }
        }
    }
    static toHsl(color){
        if(Array.isArray(color)&& color.length === 3){ //admit it's rgb
            return Color.rgbToHsl({r:color[0], g:color[1], b:color[2]})
         } else if(typeof color === "object"){ //hsl or rgb
             if("h" in color && "s" in color && "l" in color){ //hsl
                 return color
             } else if("r" in color && "g" in color && "b" in color){
                 return Color.rgbToHsl(color)
             }
         } else if(["string", "number"].includes(typeof color)){
             if(color.toString(16).match(/^#?[a-fA-F0-9]{6}$/)){ //hex!
                 return Color.hexToHsl(color.toString(16))
             } else { //name..?
                let hex = Color.nameToHex(color)
                if(hex) return Color.hexToHsl(hex)
             }
         }
    }
    static toHex(color, type="rgb"){
        if(Array.isArray(color)&& color.length === 3){ //admit it's rgb
            if(type === "hsl")return hslToHex({h:color[0], s:color[1], l:color[2]})
            else return Color.rgbToHex({r:color[0], g:color[1], b:color[2]})
         } else if(typeof color === "object"){ //hsl or rgb
             if("h" in color && "s" in color && "l" in color){ //hsl
                 return Color.hslToHex(color)
             } else if("r" in color && "g" in color && "b" in color){
                 return Color.rgbToHex(color)
             }
         } else if(["string", "number"].includes(typeof color)){
             if(color.toString(16).match(/^#?[a-fA-F0-9]{6}$/)){ //hex!
                 return (color.toString(16)?.startsWith("#")? "":"#") + color.toString(16)
             } else { //name..?
                return Color.nameToHex(color)
             }
         }
    }
    static toName(color, type){
        return Color.hexToName(Color.toHex(color))
    }

    static hexToRgb(color){
        return Object.fromEntries(color.match(/\w{2}/g).map((h,i)=> [!i?"r":i<2?"g":"b", parseInt(h, 16)])) 
    }
    static rgbToHex(color){
        return "#"+[color.r, color.g, color.b].map(h=>h.toString(16).padStart(2, "0")).join("")
    }
    static hexToHsl(color){
        return Color.rgbToHsl(Color.hexToRgb(color))
    }
    static hslToHex(color){
        return Color.rgbToHex(Color.hslToRgb(color))
    }
    static hexToName(color){
        return Object.entries(Colorlist).find(t=>t[1] === (color.startsWith("#")? "":"#")+color)?.[0] ??  (color.startsWith("#")? "":"#")+color
    }
    static nameToHex(color){
        return Colorlist[color.toString().toLowerCase().trim()]
    }
    static hslToRgb(color){
        let {h,s,l}=color
        h=h/360;s=s/100;l=l/100
        let r=0, g=0, b=0
        if(s === 0){r=g=b=l}
        else {
            function h2r(p,q,t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = h2r(p, q, h + 1/3);
            g = h2r(p, q, h);
            b = h2r(p, q, h - 1/3);
        }
        return {r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255)}
    
    }
    static rgbToHsl(color){
        let {r,g,b}=color
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
      
        if (max == min) {
          h = s = 0;
        } else {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return  { h:Math.round(h * 360), s:Math.round(s*100), l:Math.round(l*100)}
    }
}
module.exports.Color = Color