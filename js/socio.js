App = {
    
    init: function(){ 

        var that = this;

        this.templates = [
            "templates/_facebook.html",
            "templates/_instagram.html",
            "templates/_twitter.html"
        ]

        this.loadTemplates().done(function(templates){

            $('.preview').prepend(templates);

            Composer.init();
            Previewer.init();
        });

    },

    loadTemplates: function(){

        var deferred = $.Deferred();

        var i = 0,
            total = this.templates.length,
            combined = "";

        $.each(this.templates, function(i, t){

            $.get(t, function(html) {

                combined += html;

                i++;

                if (i == total){ 
                    deferred.resolve(combined); 
                }

            })
        })

        return deferred.promise();

    }

}



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
        this.$textarea.on('keyup', this.render.bind(this));
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
        var data = "";
        var that = this;

        $.each(this.socialNetworks, function(i, n){
            if (n.preview) {
                html += Mustache.render(n.template, that.getContent(i));
            }
        })

        this.$render.html(html);
        this.save();

    },

    getContent: function(network){
        
        this.content_text = Composer.$textarea.val();

        if (network == "twitter") {

            var regex = /([@|#]\w+)/ig;

            this.content_text = this.content_text.replace(regex, '<a href="#">$1</a>')

        }
        
        
        return {
            text: this.content_text
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
    App.init();
})