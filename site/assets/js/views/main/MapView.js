define(["jquery", "backbone", "infobox", "foodmap.globals"],

function($, Backbone, _InfoBox, _globals) {
    //Todo: Figure out why Infobox doesnt work when mapped to local variable "Infobox"

    var foodmap = foodmap || {};

    foodmap.MapView = Backbone.View.extend({

        el: "#container-map",

        initialize: function() {
            var
            latlng = new google.maps.LatLng(38.907649, -77.239659), //arbitrary coordinates
                my_options = {
                    zoom: _globals.initial_zoom,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false
                };
            dom_id = "container-map";

            this.markers = {};
            this.markerBounds = new google.maps.LatLngBounds();
            this.map = new google.maps.Map(document.getElementById(dom_id), my_options);
            this.infoBox = null;

            this.collection.bind("reset", _.bind(this.parseMarkers, this));

        },

        parseMarkers: function() {
            var _this = this;
            this.collection.each(function(mapItem) {
                var latLng = new google.maps.LatLng(parseFloat(mapItem.get("coordinates").lat, 10), parseFloat(mapItem.get("coordinates").lng, 10));
                this.markerBounds.extend(latLng);

                // create map markers
                var marker = new google.maps.Marker({
                    position: latLng,
                    animation: google.maps.Animation.DROP,
                    map: this.map,
                    icon: _globals.map_icons[mapItem.get("price")],
                    title: mapItem.get("name"),
                    description: mapItem.get("description"),
                    price: mapItem.get("price"),
                    ethnicity: mapItem.get("ethnicity"),
                    tags: mapItem.get("tags")
                });

                addGoogleClickListener(marker);
                this.markers[marker.title] = marker;
            }, this);

            function addGoogleClickListener(marker) {
                google.maps.event.addListener(marker, 'click', function() {
                    _this.trigger("clickMapMarker", marker.title);
                });
            }
        },

        // Zoom to a specific marker, assuming the map hasn't been zoomed already.
        zoomToMarker: function(id) {
            if (!this.zoomedOnce) {
                this.zoomedOnce = true;
                this.map.setCenter(this.markers[id].getPosition());
                this.map.setZoom(13);
            }
        },

        showInfoBox: function(id) {
            var marker = this.markers[id],
                price_map = _globals.price_map[marker.price],
                content_tags = marker.tags ? ", " + marker.tags : "",
                content =
                    '<span class="title">' + marker.title + '</span>' +
                    '<span class="price" data-price="' + marker.price + '">' + price_map + '</span>' +
                    '<span class="tags">' + marker.ethnicity + content_tags + '</span>' + marker.description;

            if (this.infoBox) {
                this.infoBox.close();
            }

            this.infoBox = new InfoBox({
                boxClass: "infobox-container",
                content: content,
                infoBoxClearance: new google.maps.Size(50, 50),
                pixelOffset: new google.maps.Size(-200, 0)
            });

            this.infoBox.open(this.map, marker);
        },

        resetZoom: function() {
            if (this.infoBox) {
                this.infoBox.close();
            }
            this.zoomedOnce = false;
            this.map.fitBounds(this.markerBounds);
        },

        setMarkersVisible: function() {
            _.each(this.markers, function(marker) {
                marker.setVisible(true);
            });
        },

        filterMarkersByTag: function(id) {
            var active_markers = [],
                // filterMarkers are markers that contain the current tag (id)
                filtered_markers = _.filter(this.markers, function(marker) {
                    return ((marker.tags && marker.tags.indexOf(id) > -1) || marker.ethnicity.indexOf(id) > -1);
                });

            _.each(this.markers, function(marker) {
                if ($.inArray(marker, filtered_markers) > -1) {
                    marker.setVisible(true);
                    active_markers.push(marker.title);
                } else {
                    marker.setVisible(false);
                }
            });

            return active_markers;
        }

    });

    return foodmap.MapView;

});