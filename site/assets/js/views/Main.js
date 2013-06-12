
define(["jquery", "backbone", "collections/MapItemList", "views/ListingContainerView", "views/TagsView", "views/MapView", "foodmap.globals"],
    
    function($, Backbone, MapItemList, ListingContainerView, TagsView, MapView, _globals) {

        var foodmap = foodmap || {};

        foodmap.Main = Backbone.View.extend({

            el: "body",

            events: {
                "click #js-btn-welcome": "toggleWelcome",
                "click #js-close-welcome": "toggleWelcome",
                "click #js-btn-reset": "onReset",
                "click #js-btn-menu": "toggleLeftMenu"
            },
            
            initialize: function() {
                this.$container_welcome = _globals.container_welcome;
                this.$tags = this.$(".tags .tag");
                this.$body = this.$el;

                foodmap.MapList = new MapItemList();
                this.listingContainerView = new ListingContainerView({ collection: foodmap.MapList }),
                this.tagsView = new TagsView({ collection: foodmap.MapList }),
                this.map = new MapView({ collection: foodmap.MapList });

                this.listenTo(this.map, "clickMapMarker", this.clickMapMarker);
                this.listenTo(this.listingContainerView, "clickListing", this.clickListing);
                this.listenTo(this.tagsView, "clickTag", this.clickTag);

                foodmap.MapList.fetch({reset: true});
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
                
                if (this.$el.hasClass("menu-left")){
                    $this.html("&raquo; Hide");
                } else {
                    $this.html("&laquo; Show");
                }
            },

            // Delegate behavior to views based on the click of a map marker
            clickMapMarker: function(id){
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
            }

        });

    return foodmap.Main;

    }
);
