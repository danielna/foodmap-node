define(["jquery", "backbone"],

function($, Backbone) {

    var foodmap = foodmap || {};

    foodmap.Map = Backbone.Model.extend({

        urlRoot: '/api/maps',

        idAttribute: "_id",

        initialize: function(options) {
            if (options) {
                this.id = options.map_id;
            }
        },

        parse: function(response) {
            response.id = response._id;
            return response;
        }

    });

    return foodmap.Map;
});