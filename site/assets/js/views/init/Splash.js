define(["jquery", "backbone", "text!templates/home/splash.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.Splash = Backbone.View.extend({

        el: ".app-container",

        template: _.template(template),

        events: {},

        initialize: function() {
            this.resetContainer();
            // this.childViews = [];
        },

        resetContainer: function() {
            $("header").remove();
            this.$el.html(this.template);
        },

        close: function() {
            this.resetContainer();
            this.stopListening();
            _.each(this.childViews, function(childView) {
                childView.remove();
            });
        }

    });

    return foodmap.Splash;

});