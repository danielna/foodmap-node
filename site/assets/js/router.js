define(["jquery", "backbone", "collections/MapItemList", "views/map/Main", "views/admin/AdminMain"],

function($, Backbone, MapItemList, Main, AdminMain) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            '': 'main',
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

        main: function() {
            console.log("main");
            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new Main();
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