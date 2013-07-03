define(["jquery", "backbone", "collections/MapItemList", "views/init/Splash", "views/home/Home", "views/admin/AdminMain", "models/User", "views/home/HeaderView", "views/home/MapsListView", "collections/MapsList", "views/home/InitialView"],

function($, Backbone, MapItemList, Splash, Home, AdminMain, User, HeaderView, MapsListView, MapsList, InitialView) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            '': 'home',
            'admin/map/:id': 'admin',
            'admin/map/:map_id/listing/:listing_id': 'admin',
            '*actions': 'default'
        },

        initialize: function() {
            var self = this;

            this.collection = new MapsList();
            this.currentView = null;

            if (this.currentView) {
                this.closeCurrentView();
            }
            this.user = new User();

            new HeaderView({
                model: this.user
            });

            new MapsListView({
                collection: this.collection
            });

            Backbone.history.start();
        },

        default: function() {
            alert("No designated action");
        },

        splash: function() {
            console.log("splash");
            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new Splash();
            this.setCurrentView(view);
        },

        home: function() {
            console.log("home");
            var self = this;

            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new InitialView();
            this.setCurrentView(view);

            this.user.fetch();
            this.collection.fetch({
                reset: true
            });

            // Todo: this shouldn't be in the router.
            // But where does it go?  I have no idea.
            this.resizeWindow();
        },

        admin: function(id, listingId) {
            console.log("admin");
            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new AdminMain({"map_id": id, "listingId": listingId});
            this.setCurrentView(view);
        },

        setCurrentView: function(view){
            this.currentView = view;
        },

        closeCurrentView: function(){
            this.currentView.close();
        },

        resizeWindow: function() {
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
        }

    });

    return foodmap.Router;

});