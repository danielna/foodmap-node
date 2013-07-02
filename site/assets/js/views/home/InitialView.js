define(["jquery", "backbone", "text!templates/home/initial.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.InitialView = Backbone.View.extend({

        el: "#right-panel",

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html("");
            var header_template = _.template(template);
            this.$el.html( header_template );
        },

        close: function() {
            this.$el.html("");
        }
    });

    return foodmap.InitialView;

});