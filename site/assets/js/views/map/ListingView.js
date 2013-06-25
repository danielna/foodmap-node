define(["jquery", "backbone", "foodmap.globals", "text!templates/map/template-listing.html"],

function($, Backbone, _globals, template) {

    var foodmap = foodmap || {};

    foodmap.ListingView = Backbone.View.extend({

        tagName: 'div',
        className: "listing",

        template: _.template(template),

        render: function() {
            this.model.attributes.price_map = _globals.price_map[this.model.get("price")];
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.attr("data-id", this.model.get("name"));

            return this;
        }

    });

    return foodmap.ListingView;

});