define(["jquery", "backbone", "text!templates/home/home.html", "text!templates/home/header.html", "collections/MapsList", "views/home/MapsListView"],

function($, Backbone, template, header_template, MapsList, MapsListView) {

    var foodmap = foodmap || {};

    foodmap.Home = Backbone.View.extend({

        el: ".app-container",

        template: _.template(template),

        events: {
        },

        initialize: function(user) {
            this.resetContainer();
            this.childViews = [];
            this.user = user;

            // size the panels appropriately based on browser size
            var left_panel_width = 240,
                top_bar_height = 50,
                self = this;

            this.populateChildViews();
            $(window).trigger("resize");

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

            this.collection = new MapsList();
            this.mapsListView = new MapsListView({
                collection: this.collection
            });
            this.collection.fetch({
                reset: true
            });

            this.childViews.push(this.mapsListView);
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
            this.$el.html(this.template( this.user.toJSON() ));
            // is this a hack?  yup.
            var headerTemplate = _.template(header_template);
            $("body").prepend( headerTemplate( this.user.toJSON() ));
        }
    });

    return foodmap.Home;

});