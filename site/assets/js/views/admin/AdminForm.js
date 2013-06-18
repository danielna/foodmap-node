define(["jquery", "backbone", "text!templates/admin/form-addlisting.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.AdminForm = Backbone.View.extend({

        el: "#add-listing",

        events: {
            "click #submit": "addListing"
        },

        template: _.template(template),

        initialize: function(){
            this.render();
        },

        render: function() {
            this.$el.html(this.template);
            return this;
        },

        addListing: function(e) {
            e.preventDefault();
            this.trigger("addListing");
        }

    });

    return foodmap.AdminForm;

});