define(["jquery", "backbone"],

function($, Backbone) {

    var foodmap = foodmap || {};

    foodmap.User = Backbone.Model.extend({

        urlRoot: function(){
            if (this.isNew()){
              return '/api/users';
            } else {
              return '/api/users' + this.id;
            }
        },

        idAttribute: "_id",

        parse: function(response) {
            response.id = response._id;
            return response;
        }

    });

    return foodmap.User;
});