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

}



module.exports =  BaseManager