define(["jquery", "backbone", "collections/MapItemList", "views/main/Main", "views/admin/AdminMain"],

function($, Backbone, MapItemList, Main, AdminMain) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            '': 'main',
            'admin': 'admin',
            'admin/:id': 'adminEdit',
            '*actions': 'default' //default
        },

        initialize: function() {
            mapItemList = new MapItemList();
            Backbone.history.start();
        },

        default: function() {
            alert("No designated action");
        },

        main: function() {
            console.log("main");
            new Main();
        },

        admin: function() {
            console.log("admin");
            new AdminMain();
        },

        adminEdit: function(id) {
            mapItemList.fetch({
                success: function() {
                    var listing = mapItemList.get(id),
                        main = new AdminMain(listing);
                },
                error: function() {
                    console.error("Something went wrong with the collection fetch.");
                }
            });
        }

    });

    return foodmap.Router;

});