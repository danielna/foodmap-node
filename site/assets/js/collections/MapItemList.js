
define(["jquery", "backbone", "models/Listing"],
    function($, Backbone, Listing) {

        var foodmap = foodmap || {};

        foodmap.MapItemList = Backbone.Collection.extend({

            model: Listing,

            url: '/api/maps/' + this.map_id + '/listings',

            initialize: function(map_id) {
                this.map_id = map_id;
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
            // comparator: function( mapItem ) {
            //     return mapItem.get("created");
            // },

            // Sort collection by a date property
            // @param dateProperty: "created" or "modified" right now
            // @param desc: Sort direction boolean. Ascending is true, descending is false.
            sortByDateProperty: function(dateProperty, desc) {
                var sorted = this.sortBy(function(mapItem) { 
                    var date = new Date(mapItem.get(dateProperty));
                    return -date.getTime(); 
                });

                if (desc) {
                    return sorted.reverse();
                }
                return sorted;
            },

            sortByAlpha: function(desc){
                var sorted = this.sortBy(function(mapItem){
                    return mapItem.get("name");
                });

                if (desc) {
                    return sorted.reverse();
                }
                return sorted;
            }

        });

    return foodmap.MapItemList;

    }
);
