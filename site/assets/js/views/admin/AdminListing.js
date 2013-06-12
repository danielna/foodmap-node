
define(["jquery", "backbone"],
    
    function($, Backbone, _globals) {

        var foodmap = foodmap || {};

        foodmap.AdminListing = Backbone.View.extend({

            tagName: 'li',

            template: _.template( $("#template-admin-listing").html() ),

            render: function() {
                this.$el.html( this.template( this.model.toJSON() ));
                this.$el.attr("data-id", this.model.get("_id"));

                return this;
            }

        });

    return foodmap.AdminListing;
    
    }
);