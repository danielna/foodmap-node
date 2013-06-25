define(["jquery", "backbone", "collections/MapItemList", "views/map/MapView", "views/map/ListingContainerView", "views/map/TagsView", "foodmap.globals", "text!templates/map/index.html"],

function($, Backbone, MapItemList, MapView, ListingContainerView, TagsView, _globals, template) {

    var foodmap = foodmap || {};

    foodmap.Main = Backbone.View.extend({

        el: "body",

        template: _.template(template),

        events: {
            "click #js-btn-welcome": "toggleWelcome",
            "click #js-close-welcome": "toggleWelcome",
            "click #js-btn-reset": "onReset",
            "click #js-btn-menu": "toggleLeftMenu",
            "click #js-btn-admin": "redirectToAdmin"
        },

        initialize: function() {
            this.resetContainer();

            this.$container_welcome = this.$app_container.find(_globals.container_welcome);
            this.$tags = this.$app_container.find(".tags .tag");
            this.$body = this.$el;

            this.childViews = [];

            foodmap.MapList = new MapItemList();
            this.map = new MapView({
                collection: foodmap.MapList
            });
            this.listingContainerView = new ListingContainerView({
                collection: foodmap.MapList
            }),
            this.tagsView = new TagsView({
                collection: foodmap.MapList
            }),

            this.childViews.push(this.map);
            this.childViews.push(this.listingContainerView);
            this.childViews.push(this.tagsView);

            this.listenTo(this.map, "clickMapMarker", this.clickMapMarker);
            this.listenTo(this.listingContainerView, "clickListing", this.clickListing);
            this.listenTo(this.tagsView, "clickTag", this.clickTag);

            foodmap.MapList.fetch({
                reset: true
            });
        },

        resetContainer: function() {
            this.$app_container = this.$el.find(".app-container");
            this.$app_container.html(this.template);
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

    return foodmap.Main;

});