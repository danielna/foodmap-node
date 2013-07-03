define(["jquery", "backbone", "views/map/Main"],

function($, Backbone, MapMain) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            ':id': 'map'
        },

        initialize: function() {
            var self = this;
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