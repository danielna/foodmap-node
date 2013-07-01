define(["jquery", "backbone", "collections/MapItemList", "views/map/MapView", "views/map/ListingContainerView", "views/map/TagsView", "models/Map", "foodmap.globals", "text!templates/map/index.html"],

function($, Backbone, MapItemList, MapView, ListingContainerView, TagsView, Map, _globals, template) {

    var foodmap = foodmap || {};

    foodmap.MapMain = Backbone.View.extend({

        el: "body",

        template: _.template(template),

        events: {
            "click #js-btn-welcome": "toggleWelcome",
            "click #js-close-welcome": "toggleWelcome",
            "click #js-btn-reset": "onReset",
            "click #js-btn-menu": "toggleLeftMenu",
            "click #js-btn-admin": "redirectToAdmin"
        },

        initialize: function(options) {
            var self = this;
            this.map_id = options.map_id;
            this.model = new Map({ 'map_id': this.map_id });
            this.model.fetch({
                reset: true,
                success: function(model){
                    self.resetContainer();
                    self.setChildViews();

                    // ToDo: this is not the best SEO decision.
                    // Might need a refactor where you render the entire map page (including head) via a template.
                    $(document).attr("title", model.get("name") + " | MAPEATER");
                }
            });
        },

        setChildViews: function() {
            var self = this;
            this.childViews = [];

            this.$container_welcome = this.$app_container.find(_globals.container_welcome);
            this.$tags = this.$app_container.find(".tags .tag");
            this.$body = this.$el;

            this.collection = new MapItemList({ 'map_id': this.map_id });

            this.map = new MapView({
                collection: this.collection
            });
            this.listingContainerView = new ListingContainerView({
                collection: this.collection
            }),
            this.tagsView = new TagsView({
                collection: this.collection
            }),

            this.childViews.push(this.map);
            this.childViews.push(this.listingContainerView);
            this.childViews.push(this.tagsView);

            this.listenTo(this.map, "clickMapMarker", this.clickMapMarker);
            this.listenTo(this.listingContainerView, "clickListing", this.clickListing);
            this.listenTo(this.tagsView, "clickTag", this.clickTag);

            this.collection.fetch({
                reset: true,
                success: function() {
                    self.map.resetZoom();
                }
            });
        },

        resetContainer: function() {
            this.$el.find("#title-bar").remove();
            this.$app_container = this.$el.find(".app-container");
            console.log("this.model.toJSON()", this.model.toJSON());
            this.$app_container.html(this.template(this.model.toJSON()));
        },

        toggleWelcome: function() {
            this.$container_welcome.fadeToggle();
        },

        resetActiveTag: function() {
            this.$tags.removeClass("active");
        },

        onReset: function() {
            this.$container_welcome.fadeIn();
            this.resetActiveTag();
            this.map.resetZoom();
            this.map.setMarkersVisible();
            this.listingContainerView.resetListings();

        },

        toggleLeftMenu: function(event) {
            var $this = $(event.currentTarget);

            this.$container_welcome.fadeOut();
            this.$el.toggleClass("menu-left");

            if (this.$el.hasClass("menu-left")) {
                $this.html("&raquo; Hide");
            } else {
                $this.html("&laquo; Show");
            }
        },

        // Delegate behavior to views based on the click of a map marker
        clickMapMarker: function(id) {
            this.$container_welcome.fadeOut();

            if (!this.$body.hasClass("menu-on")) {
                this.$body.addClass("menu-on");
            }
            this.listingContainerView.setActiveListing(id);
            this.map.zoomToMarker(id);
            this.map.showInfoBox(id);
        },

        // Delegate behavior to views based on the click of a listing
        clickListing: function(id) {
            this.$container_welcome.fadeOut();
            this.listingContainerView.setActiveListing(id);
            this.map.zoomToMarker(id);
            this.map.showInfoBox(id);
        },

        clickTag: function(id) {
            var active_markers = this.map.filterMarkersByTag(id);
            this.listingContainerView.filterListingsByArray(active_markers);
        },

        redirectToAdmin: function() {
            window.location = "#/admin";
        },

        close: function() {
            this.resetContainer();
            this.stopListening();
            _.each(this.childViews, function(childView) {
                childView.remove();
            });
        }

    });

    return foodmap.MapMain;

});