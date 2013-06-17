define(["jquery", "backbone", "text!templates/admin/form-addlisting.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.AdminForm = Backbone.View.extend({

        el: "#add-listing",

        template: _.template(template),

        initialize: function(){
            this.render();
        },

        render: function() {
            this.$el.html(this.template, this.model.toJSON());
            return this;
        }

    });

    return foodmap.AdminForm;

});