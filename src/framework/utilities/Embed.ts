export default class Embed {

    public author: any;
    public title: string;
    public description: string;
    public fields: object[];
    public image: any;
    public thumbnail: any;
    public color: any;
    public footer: any;

    public constructor() {
    }

    /**
     * setTitle
     * 
     * Set the title to the embed.
     * 
     * @param title String
     * 
     * @example .setTitle("Nice Embed")
     */
    public setTitle(_title: string) {

        if(_title.length > 256) {
            throw new Error("[Embed] Embed title can't reach 256 characters.");
        }

        this.title = `${_title}`;
        return this;
    }

    /**
     * setAuthor
     * 
     * Set the author to the embed.
     * 
     * @param name String
     * @param url URL
     * @param icon_url Image URL
     * 
     * @example .setAuthor("Jean", "http://iarejeanbro.com", "http://example.com/image.png/")
     */
    public setAuthor(_name: string, _url?: string, _icon_url?: string) {
        this.author = new Object;

        if(_name.length > 256) {
            throw new Error("[Embed] Embed author name can't reach 256 characters.");
        }

        this.author.name = `${_name}`;
        if(_url) {
            this.author.url = `${_url}`;
        }

        if(_icon_url) {
            this.author.icon_url = `${_icon_url}`;
        }

        return this;
    }

    /**
     * setDescription
     * 
     * Set the description to the embed.
     * 
     * @param description String
     * 
     * @example .setDescription("Hello, Whirlybird is amazing!!")
     */
    public setDescription(_description: string) {

        if(_description.length > 2048) {
            throw new Error("[Embed] Embed description can't reach 2048 characters.");
        }

        this.description = `${_description}`;
        return this;
    }

    /**
     * addField
     * 
     * Add a field to the embed.
     * 
     * @param name String
     * @param value String
     * @param inline Boolean
     * 
     * @example .addField("Hello", "I are a field", true)
     */
    public addField(_name: string, _value: string, _inline?: boolean) {
        if(!this.fields) this.fields = [];

        if(_name.length > 256 || _value.length > 1024) {
            throw new Error("[Embed] Embed field (name) can't reach 256 characters and (value) can't reach 1024 characters.");
        }

        if(_inline && typeof _inline !== "boolean") {
            throw new Error("[Embed] Embed field (inline) must be have of type boolean (true or false).");
        }

        this.fields.push({
            name: `${_name}`,
            value: `${_value}`,
            inline: _inline
        });

        return this;
    }

    /**
     * setImage
     * 
     * Set a image to the embed.
     * 
     * @param url Image URL
     * 
     * @example .setImage("http://example.com/image.png/")
     */
    public setImage(_url: any) {
        this.image = {
            url: `${_url}`
        };

        return this;
    }

    /**
     * setThumbnail
     * 
     * Set the thumbnail to the embed.
     * 
     * @param url Image URL
     * 
     * @example .setThumbnail("http://example.com/image.png/")
     */
    public setThumbnail(_url: any) {
        this.thumbnail = {
            url: `${_url}`
        };

        return this;
    }

    /**
     * setColor
     * 
     * Set the main color to the embed.
     * 
     * @arg color Number
     * 
     * @example .setColor(0xF1F1F1)
     */
    public setColor(_color: number) {
        this.color = _color;

        return this;
    }

    /**
     * setFooter
     * 
     * Set the footer for the embed, with text and optional icon.
     * 
     * @param text String
     * @param icon_url Image URL
     * 
     * @example .setFooter("Whirlybird | 2020", "http://example.com/image.png/")
     */
    public setFooter(_text: string, _icon_url?: string) {
        if(_text.length > 2048) {
            throw new Error("[Embed] Embed footer text can't reach 2048 characters.");
        }

        this.footer = {
            text: `${_text}`,
            icon_url: `${_icon_url}`
        };

        return this;
    }

    get toString() {
        return "[Embed Constructor]";
    }
};