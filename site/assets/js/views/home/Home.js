define(["jquery", "backbone", "text!templates/home/home.html", "text!templates/home/header.html", "models/User"],

function($, Backbone, template, header_template, User) {

    var foodmap = foodmap || {};

    foodmap.Home = Backbone.View.extend({

        el: ".app-container",

        template: _.template(template),

        events: {
        },

        initialize: function() {
            this.resetContainer();
            this.childViews = [];

            // size the panels appropriately based on browser size
            var left_panel_width = 240,
                top_bar_height = 50,
                self = this;

            this.user = new User();
            this.user.fetch({
                success: function(response) {
                    self.populateChildViews();
                    $(window).trigger("resize");
                }
            });

            this.$title_bar = $("#title-bar");
            this.$left_panel = $("#left-panel");
            this.$right_panel = $("#right-panel");

            $(window).resize(function(){
                var window_height = window.innerHeight,
                    window_width = window.innerWidth,
                    width = Math.abs(window_width - left_panel_width),
                    height = Math.abs(window_height - top_bar_height);

                self.$right_panel.css("width", width);

                self.$right_panel.css("height", height);
                self.$left_panel.css("height", height);
            });

            $(window).trigger("resize");

        },

        resetContainer: function() {
            this.$el.html(this.template({email: "blah", password:"blah"}));
        },

        close: function() {
            this.resetContainer();
            this.stopListening();
            _.each(this.childViews, function(childView) {
                childView.remove();
            });
        },

        populateChildViews: function() {
            // oh so hacky
            var thisUser = this.user.get("0");
            // console.log("this.user:", this.user.get("0"));
            this.$el.html(this.template(thisUser));
            // is this a hack?  yup.
            var headerTemplate = _.template(header_template);
            $("body").prepend( headerTemplate( thisUser ));
        }
    });

    return foodmap.Home;

});