define(["jquery", "backbone", "text!templates/home/home.html", "text!templates/home/header.html"],

function($, Backbone, template, header_template) {

    var foodmap = foodmap || {};

    foodmap.Home = Backbone.View.extend({

        el: ".app-container",

        template: _.template(template),

        events: {
        },

        initialize: function() {
            this.resetContainer();
            // is this a hack?  yup.
            $("body").prepend(_.template(header_template));
            var left_panel_width = 240,
                top_bar_height = 50,
                self = this;

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

            // this.childViews = [];

        },

        resetContainer: function() {
            this.$el.html(this.template);
        },

        close: function() {
            this.resetContainer();
            this.stopListening();
            _.each(this.childViews, function(childView) {
                childView.remove();
            });
        }
    });

    return foodmap.Home;

});