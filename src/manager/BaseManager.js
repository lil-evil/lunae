const [ error, Bmap ] = [ require("../tools/Error"), require("../tools/Bmap")]

class BaseManager extends Bmap{
    constructor(lunae){
        super()
        Object.defineProperty(this, "lunae", {value:lunae})

    }
    _add(key, data){
        if(this.has(key)) return this._edit(key, data)
        return this.set(key, data)
    }
    _delete(key){
        if(!this.has(key)) return false
        return Boolean(this.delete(id))
    }
    _edit(key, data){
        if(!this.has(key)) return false
        Object.assign(this.get(key), data)
        return this.get(key)
    }
    _fill(itterable, options){
        if(!Array.isArray(itterable))return this
        else{
            if(typeof options.instancer !== "function")options.instancer = (data)=>data
            itterable.forEach(item=>{
                item = options.instancer(item, this.lunae)
                if(Array.isArray(options.properties)){
                    options.properties.forEach(prop=>{
                        if([undefined, null].includes(prop.name))return
                        else item[prop.name]=prop.value
                    })
                }
                if(Array.isArray(options.managers)){
                    options.managers.forEach(m=>m?._add(item.id, item))
                }
                this._add(item.id, item)
            })
            return this
        }
    }
}

module.exports = BaseManager