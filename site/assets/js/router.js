define(["jquery", "backbone", "views/main/Main", "views/admin/AdminMain"],

function($, Backbone, Main, AdminMain) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            '': 'main',
            'admin': 'admin',
            '*actions': 'default' //default
        },

        default: function() {
            console.log("default called");
        },

        initialize: function() {
            Backbone.history.start();
        },

        main: function() {
            console.log("main");
            new Main();
        },

        admin: function() {
            console.log("admin");
            new AdminMain();
        }

    });

    return foodmap.Router;

});