
define(["jquery", "backbone", "foodmap.globals"],
    
    function($, Backbone, _globals) {

        var foodmap = foodmap || {};

        foodmap.ListingView = Backbone.View.extend({

            tagName: 'div',
            className: "listing",

            template: _.template( $("#template-listing").html() ),

            render: function() {
                this.model.attributes.price_map = _globals.price_map[this.model.get("price")];
                this.$el.html( this.template( this.model.toJSON() ));
                this.$el.attr("data-id", this.model.get("name"));

                return this;
            }

        });

    return foodmap.ListingView;
    
    }
);