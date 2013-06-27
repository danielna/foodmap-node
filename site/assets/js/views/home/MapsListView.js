define(["jquery", "backbone", "text!templates/home/mapsListing.html"],

function($, Backbone, map_template) {

    var foodmap = foodmap || {};

    foodmap.MapsListView = Backbone.View.extend({

        el: "#maps-list",

        events: {
            "click .map-name": "loadMap",
            "click .map-edit": "editListing",
            "click .map-delete": "deleteListing"
        },

        initialize: function() {
            this.collection.bind("reset", _.bind(this.render, this));
            this.listenTo(this.collection, 'add', this.render);
        },

        render: function() {
            this.$el.html("");
            var mapTemplate = _.template(map_template);
            this.collection.each(function(map) {
                this.$el.append( mapTemplate(map.toJSON()) );
            }, this);
        },

        editListing: function(e) {
            e.preventDefault();

            // var id = $(e.currentTarget).parents("li").attr("data-id");

            // window.location = "/#/admin/" + id;
        },

        deleteListing: function(e) {
            e.preventDefault();
            // var id = $(e.currentTarget).parents("li").attr("data-id"),
            //     model = this.collection.get(id),
            //     that = this;

            // if ( confirm("Are you sure you want to delete " + model.get("name") + "?") ){
            //     model.destroy({
            //         success: function(response) {
            //             console.log(response.get("name") + " deleted.");
            //             that.trigger("deleteListing");
            //         },
            //         error: function(respose) {
            //             console.error("Error deleting: " + response.get("name"));
            //         }
            //     });
            // }
        },

        loadMap: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents(".map-panel-item").attr("data-map-id");

            window.location = "/#/map/" + id;
        }

    });

    return foodmap.MapsListView;

});