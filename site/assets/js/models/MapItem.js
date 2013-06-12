
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
            }

        });

        return foodmap.MapItem;
    }
);
