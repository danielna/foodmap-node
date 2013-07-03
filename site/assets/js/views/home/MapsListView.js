define(["jquery", "backbone", "text!templates/home/mapsListing.html", "text!templates/home/leftMenu.html"],

function($, Backbone, map_template, left_template) {

    var foodmap = foodmap || {};

    foodmap.MapsListView = Backbone.View.extend({

        el: "#left-panel",

        events: {
            "click .map-name": "loadMap",
            "click .map-edit": "editMap",
            "click .map-delete": "deleteListing",
            "click #home": "home"
        },

        initialize: function() {
            this.collection.bind("reset", _.bind(this.render, this));
            this.listenTo(this.collection, 'add', this.render);
        },

        render: function() {
            var panelTemplate = _.template(left_template),
                mapTemplate = _.template(map_template);

            this.$el.html(panelTemplate);
            this.$mapsList = this.$el.find("#maps-list");

            this.collection.each(function(map) {
                this.$mapsList.append( mapTemplate(map.toJSON()) );
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

            window.open("/map/#" + id, '_blank');
        },

        home: function() {
            Backbone.history.navigate("/", true);
        }

    });

    return foodmap.MapsListView;

});