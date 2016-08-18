/* 

    Compose a message allowing for these types of input:

    - Text
    - Image
    - Video

-------------------------------------------------------- */

Composer = {

    init: function(){
        this.cacheDom();
        this.bindEvents();
    },

    cacheDom: function(){
        this.$el = $('.compose');
        this.$textarea = this.$el.find('.compose_textarea');
    },

    bindEvents: function(){
        this.$textarea.on('keydown', this.render.bind(this));
    },

    render: function(){
        Previewer.render();
    }

}

/* 

    Preview a message for these social-networks:

    - Facebook
    - Twitter
    - Instagram

-------------------------------------------------------- */

Previewer = {

    init: function(){
        this.cacheDom();
        this.bindEvents();
        this.settings();
    },
    
    settings: function(){

    },

    cacheDom: function(){
        this.$el = $('.preview');
        this.$chooser = this.$el.find('.preview_chooser');
        this.$chooserLink = this.$chooser.find('a');
        this.$render  = this.$el.find('.preview_render');

        this.socialNetworks = {

            facebook: {
                preview:  false,
                template: this.$el.find('.template_facebook').html()
            },

            twitter: {
                preview:  false,
                template: this.$el.find('.template_twitter').html()
            },

            instagram: {
                preview:  false,
                template: this.$el.find('.template_instagram').html()
            }

        }

    },

    bindEvents: function(){
        this.$chooserLink.on('click', this.choose.bind(this));
    },

    choose: function(e){
        var $button = $(e.target).toggleClass('isActive');;

        this.socialNetworks[$button.data('socialnetwork')].preview = $button.is('.isActive') ? true : false;
        this.render();
    },

    render: function(){

        var html = "";
        var data = this.getContent();

        $.each(this.socialNetworks, function(i, n){
            if (n.preview) {
                html += Mustache.render(n.template, data);
            }
        })

        this.$render.html(html);

    },

    getContent: function(){
        return {
            text: Composer.$textarea.val()
        }
    }
    
    
}

$(function(){
    Composer.init();
    Previewer.init();
})