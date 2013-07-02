define(["jquery", "backbone", "text!templates/home/header.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.HeaderView = Backbone.View.extend({

        el: "#title-bar",

        events: {
            "click #logout": "logout"
        },

        initialize: function() {
            this.model.bind("change", _.bind(this.render, this));
        },

        render: function() {
            this.$el.html("");
            var header_template = _.template(template);
            this.$el.html( header_template(this.model.toJSON()) );
        },

        logout: function(e) {
            window.location = "/logout";
        }

    });

    return foodmap.HeaderView;

});