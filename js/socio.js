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
        this.load();
    },
    
    settings: function(){
        this.selectedNetworks = [];
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
        var $button = $(e.target).toggleClass('isActive');
        this.socialNetworks[$button.data('socialnetwork')].preview = $button.is('.isActive') ? true : false;
        this.render();
        this.save();
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
        this.save();

    },

    getContent: function(){
        return {
            text: Composer.$textarea.val()
        }
    },

    /*
        This is messy
    */

    save: function(){
        this.selectedNetworks = $.map(Previewer.$chooserLink.filter('.isActive'), function(a){
                                    return $(a).data('socialnetwork') 
                                });

        Cookies.set('chosen', JSON.stringify(this.selectedNetworks.join()), { expires: 365 });
    },

    load: function(){
        this.selectedNetworks = Cookies.get('chosen') ? JSON.parse(Cookies.get('chosen')).split(',') : [];

        var that = this;

        $.each(this.selectedNetworks, function(i, node){
            $('[data-socialnetwork='+node+']').addClass('isActive');
            that.socialNetworks[node].preview = true;
        })

        this.render();
    }

}

$(function(){
    Composer.init();
    Previewer.init();
})