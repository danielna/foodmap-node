define(["jquery", "backbone", "text!templates/home/mapsListing.html"],

function($, Backbone, map_template) {

    var foodmap = foodmap || {};

    foodmap.MapsListView = Backbone.View.extend({

        el: "#maps-list",

        events: {
            "click .map-name": "loadMap",
            "click .map-edit": "editMap",
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

        editMap: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents(".map-panel-item").attr("data-map-id");
            window.location = "#/admin/map/" + id;
            // this.trigger("editMap", id);
        },

        loadMap: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents(".map-panel-item").attr("data-map-id");

            window.open("/#/map/" + id, '_blank');
        }

    });

    return foodmap.MapsListView;

});