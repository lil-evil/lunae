const urlReg = /https?:\/\/(www\.)?[-a-zA-Z\d@:%._+~#=]{1,256}\.[a-zA-Z\d()]{1,6}\b([-a-zA-Z\d()@:%_+.~#?&/{2}=]*)/

const Colors = {
	DEFAULT: 0x000000,
	WHITE: 0xffffff,
	AQUA: 0x1abc9c,
	GREEN: 0x57f287,
	BLUE: 0x3498db,
	YELLOW: 0xfee75c,
	PURPLE: 0x9b59b6,
	LUMINOUS_VIVID_PINK: 0xe91e63,
	FUCHSIA: 0xeb459e,
	GOLD: 0xf1c40f,
	ORANGE: 0xe67e22,
	RED: 0xed4245,
	GREY: 0x95a5a6,
	NAVY: 0x34495e,
	DARK_AQUA: 0x11806a,
	DARK_GREEN: 0x1f8b4c,
	DARK_BLUE: 0x206694,
	DARK_PURPLE: 0x71368a,
	DARK_VIVID_PINK: 0xad1457,
	DARK_GOLD: 0xc27c0e,
	DARK_ORANGE: 0xa84300,
	DARK_RED: 0x992d22,
	DARK_GREY: 0x979c9f,
	DARKER_GREY: 0x7f8c8d,
	LIGHT_GREY: 0xbcc0c0,
	DARK_NAVY: 0x2c3e50,
	BLURPLE: 0x5865f2,
	GREYPLE: 0x99aab5,
	DARK_BUT_NOT_BLACK: 0x2c2f33,
	NOT_QUITE_BLACK: 0x23272a,
};
function resolveColor(color) {
	if (typeof color === 'string') {
		if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
		if (color === 'DEFAULT') return 0;
		color = Colors[color] ?? parseInt(color.replace(/#/g, ''), 16);
	} else if (Array.isArray(color)) {
		color = (color[0] << 16) + (color[1] << 8) + color[2];
	}
	
	if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
	else if (Number.isNaN(color)) throw new TypeError('COLOR_CONVERT');
	
	return color;
}

class EmbedBuilder {
	/**
	 * @param {Object} data
	 */
	constructor(data) {}
	/**
	 * @param {String} name
	 * @param {String} [icon]
	 * @param {String} [url]
	 * @return {EmbedBuilder}

	 */
	setAuthor(name, icon, url){
		if (typeof name == "string" && name.length > 0 && name.length < 257) {
			if (!("author" in this)) this.author = {};
			this.author.name = name;
		}
		else throw new Error("Author name must be a string from 1 to 256 characters")
		if (typeof icon == "string" && urlReg.test(icon)) {
			if (!("author" in this)) this.author = {};
			this.author.icon_url = icon;
		}
		else if (icon) throw new Error("Author icon must be a valid url")
		if (typeof url == "string" && urlReg.test(url)) {
			if (!("author" in this)) this.author = {};
			this.author.url = icon;
		}
		else if (url) throw new Error("Author url must be a valid url");
		return this;
	}
	/**
	 * @param {String} url
	 * @return {EmbedBuilder}

	 */
	setUrl(url){
		if (typeof url == "string" && urlReg.test(url)) this.url = url;
		else throw new Error("Embed url must be a valid url");
		return this;
	}
	/**
	 * @param {String} title
	 * @return {EmbedBuilder}

	 */
	setTitle(title){
		if (typeof title == "string" && title.length > 0 && title.length < 257) this.title = title;
		else throw new Error("Embed title must be a string from 1 to 256 characters");
		return this;
	}
	/**
	 * @param {String} description
	 * @return {EmbedBuilder}

	 */
	setDescription(description){
		if (typeof description == "string" && description.length > 0 && description.length < 4097) this.description = description;
		else throw new Error("Embed description must be a string from 1 to 4096 characters");
		return this;
	}
	/**
	 * @param {Number|String|Array<number>} color
	 * @return {EmbedBuilder}

	 */
	setColor(color) {
		if (!Array.isArray(color) && isNaN(color) && typeof color !== "string") throw new Error("Color must be a number, string or array");
		this.color = resolveColor(color);
		return this;
	}
	// footer
	/**
	 *
	 * @param {String} text
	 * @param {String} [icon]
	 * @return {EmbedBuilder}

	 */
	setFooter(text, icon){
		if (typeof text == "string" && text.length > 0 && text.length < 2049) {
			if (!("footer" in this)) this.footer = {};
			this.footer.text = text
		} else throw new Error("Text must be a string from 1 to 2048 characters")
		if (typeof icon == "string" && urlReg.test(icon)) {
			if (!("footer" in this)) this.footer = {};
			this.footer.icon_url = text
		} else if (icon) throw new Error("Footer icon url must be a valid url");
		return this;
	}
	/**
	 * @param {Date|Number} [date]
	 * @return {EmbedBuilder}

	 */
	setTimestamp(date = Date.now()){
		this.timestamp = (date instanceof Date) ? date.getTime() : date;
		return this;
	}
	// images
	/**
	 * @param {String} url
	 * @return {EmbedBuilder}

	 */
	setImage(url){
		if (typeof url == "string" && urlReg.test(url)){
			if (!("image" in this)) this.image = {};
			this.image.url = url
		} else throw new Error("Embed image must be a valid URL");
		return this;
	}
	setThumbnail(url){
		if (typeof url == "string" && urlReg.test(url)){
			if (!("thumbnail" in this)) this.thumbnail = {};
			this.thumbnail.url = url
		} else throw new Error("Embed thumbnail must be a valid URL");
		return this;
	}
	// fields
	/**
	 * @param {String} name
	 * @param {String} value
	 * @param {Boolean} [inline]
	 * @return {EmbedBuilder}

	 */
	addField(name, value, inline = false){
		if (!("fields" in this)) this.fields = [];
		if (typeof name !== "string" || name.length < 0 || name.length > 256) throw new Error("Field name must be a string from 0 to 256 characters");
		if (typeof value !== "string" || value.length < 0 || value.length > 256) throw new Error("Field value must be a string from 0 to 256 characters");
		if (this.fields.length >= 25) throw new Error("You can also set up to 25 fields");
		this.fields.push({ name, value, inline: !!inline });
		return this;
	}
	/**
	 * @param {Object<{ name: string, value: string, inline?: boolean }>} fields
	 * @return {EmbedBuilder}

	 */
	addFields(...fields){ fields.map((f) => this.addField(f)); return this; };
	/**
	 * @param {Object<{ name: string, value: string, inline?: boolean }>} fields
	 * @return {EmbedBuilder}

	 */
	setFields(...fields){
		if (!Array.isArray(fields) || fields.length < 1 || fields.length > 25) throw new Error("You cannot set fields with invalid values");
		if (fields.some(({ name, value }) => typeof name !== "string" || name.length < 0 || name.length > 256 || typeof value !== "string" || value.length < 0 || value.length > 256))
			throw new Error("A invalid field was provided");
		this.fields = fields;
		return this;
	}
	/**
	 * @param {(this:any, key: string, value: any) => any} [replacer]
	 * @param {String|Number} [space]
	 * @return {String}

	 */
	toJSON(replacer = null, space = 2){
		return JSON.stringify(this, replacer, space);
	}
}

module.exports = EmbedBuilder