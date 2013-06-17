define(["jquery", "backbone", "views/main/Main", "views/admin/AdminMain"],

function($, Backbone, Main, AdminMain) {

    var foodmap = foodmap || {};

    foodmap.Router = Backbone.Router.extend({

        routes: {
            '': 'main',
            'admin': 'admin',
            'admin/:id': 'adminEdit',
            '*actions': 'default' //default
        },

        default: function() {
            alert("No designated action");
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
        },

        adminEdit: function(id) {
            console.log("admin id:", id);
            var main = new AdminMain();
            main.setForm(id);
        }

    });

    return foodmap.Router;

});