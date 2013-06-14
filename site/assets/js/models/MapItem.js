
define(["jquery", "backbone"],

    function($, Backbone) {

        var foodmap = foodmap || {};

        foodmap.MapItem = Backbone.Model.extend({

            defaults: {
                "name": "Default MapItem",
                "description": "",
                "price": "",
                "ethnicity": "",
                "tags": "",
                "coordinates": ""
            },

            parse: function( response ) {
                response.id = response._id;
                return response;
            }

        });
 
        return foodmap.MapItem;
    }
);
