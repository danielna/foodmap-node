define(["jquery", "backbone", "collections/MapItemList", "views/init/Splash", "views/home/Home", "views/map/Main", "views/admin/AdminMain", "models/User", "views/home/HeaderView"],

function($, Backbone, MapItemList, Splash, Home, MapMain, AdminMain, User, HeaderView) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            '': 'home',
            'map/:id': 'map',
            'admin': 'admin',
            'admin/:id': 'adminEdit',
            '*actions': 'default'
        },

        initialize: function() {
            mapItemList = new MapItemList();
            this.currentView = null;
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
            this.user = new User();
            var view = new HeaderView({
                model: this.user
            });

            this.user.fetch();

        },

        map: function(id) {
            console.log("main");
            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new MapMain({map_id: id});
            this.setCurrentView(view);
        },

        admin: function() {
            console.log("admin");
            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new AdminMain();
            this.setCurrentView(view);
        },

        adminEdit: function(id) {
            console.log("edit");
            var self = this;
            mapItemList.fetch({
                success: function() {
                    var listing = mapItemList.get(id);
                    if (self.currentView) {
                        self.closeCurrentView();
                    }
                    var view = new AdminMain(listing);
                    self.setCurrentView(view);

                    self.listenTo(view, "resetAdminRoute", function() {
                        this.navigate("admin", { trigger: true });
                    });
                },
                error: function() {
                    console.error("Something went wrong with the collection fetch.");
                }
            });
        },

        setCurrentView: function(view){
            this.currentView = view;
        },

        closeCurrentView: function(){
            this.currentView.close();
        }

    });

    return foodmap.Router;

});