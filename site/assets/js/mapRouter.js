define(["jquery", "backbone", "collections/MapItemList", "views/init/Splash", "views/home/Home", "views/map/Main", "views/admin/AdminMain", "models/User", "views/home/HeaderView", "views/home/MapsListView", "collections/MapsList", "views/home/InitialView"],

function($, Backbone, MapItemList, Splash, Home, MapMain, AdminMain, User, HeaderView, MapsListView, MapsList, InitialView) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            ':id': 'map'
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

        map: function(id) {
            console.log("main");
            if (this.currentView) {
                this.closeCurrentView();
            }
            var view = new MapMain({map_id: id});
            this.setCurrentView(view);
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