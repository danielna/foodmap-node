
define(["jquery", "backbone", "models/Map"],
    function($, Backbone, Map) {

        var foodmap = foodmap || {};

        foodmap.MapsList = Backbone.Collection.extend({

            model: Map,

            url: '/api/maps',

        });

    return foodmap.MapsList;

    }
);
