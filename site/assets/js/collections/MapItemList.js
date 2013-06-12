
define(["jquery", "backbone", "models/MapItem"],
    function($, Backbone, MapItem) {

        var foodmap = foodmap || {};

        foodmap.MapItemList = Backbone.Collection.extend({

            model: MapItem,

            // url: "/assets/resources/eateries.json",
            url: '/api/listings',

            initialize: function() {
                // console.log("collection init");
            },

            // Return unique tags for the collection as an array
            tags: function() {
                return _.uniq(this.pluckCollectionProperty("tags"));
            },

            // Return unique ethnicities for the collection as an array
            ethnicities: function() {
                return _.uniq(this.pluckCollectionProperty("ethnicity"));
            },

            // Pluck a collection property, returning an array of properties that do not include empty strings
            pluckCollectionProperty: function(property) {
                var properties = _.chain(this.pluck(property));

                var flattened = properties.flatten().map(function(s){
                    return s.trim();
                });

                var filtered = flattened.filter(function(s) {
                    return s !== "";
                });

                return filtered.value();
            },

            // Sort by original insertion order
            comparator: function( mapItem ) {
                return mapItem.get("order");
            }
        });

    return foodmap.MapItemList;

    }
);
