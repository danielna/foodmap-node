define(["jquery", "backbone", "text!templates/admin/admin-listing.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.AdminListing = Backbone.View.extend({

        tagName: 'li',

        template: _.template(template),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.attr("data-id", this.model.get("_id"));
            this.$el.attr("data-name", this.model.get("name"));

            return this;
        }

    });

    return foodmap.AdminListing;

});