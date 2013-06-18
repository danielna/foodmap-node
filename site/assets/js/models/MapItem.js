define(["jquery", "backbone"],

function($, Backbone) {

    var foodmap = foodmap || {};

    foodmap.MapItem = Backbone.Model.extend({

        urlRoot: '/api/listings',

        idAttribute:"_id",

        parse: function(response) {
            response.id = response._id;
            return response;
        }

    });

    return foodmap.MapItem;
});