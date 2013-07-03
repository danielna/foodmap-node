define(["jquery", "backbone", "views/admin/AdminListing"],

function($, Backbone, AdminListing) {

    var foodmap = foodmap || {};

    foodmap.AdminListView = Backbone.View.extend({

        el: "ul.list",

        events: {
            "click .model-delete": "deleteListing",
            "click .hideShow": "toggleListingVisible"
        },

        initialize: function() {
            this.collection.bind("reset", _.bind(this.render, this));
            this.listenTo(this.collection, 'add', this.render);
        },

        render: function() {
            this.$el.html("");
            var collection = _(this.collection.sortByDateProperty("modified"));
            collection.each(function(listing) {
                var adminListing = new AdminListing({
                    model: listing
                });

                this.$el.append(adminListing.render().el);
            }, this);
        },

        renderFiltered: function(filter) {
            var collection = this.collection;

            switch (filter) {
                case "date-modified":
                    collection = this.collection.sortByDateProperty("modified");
                    break;
                case "date-modified-desc":
                    collection = this.collection.sortByDateProperty("modified", true);
                    break;
                case "date-created":
                    collection = this.collection.sortByDateProperty("created");
                    break;
                case "date-created-desc":
                    collection = this.collection.sortByDateProperty("created", true);
                    break;
                case "alpha":
                    collection = this.collection.sortByAlpha();
                    break;
                case "alpha-desc":
                    collection = this.collection.sortByAlpha(true);
                    break;
            }
            this.$el.html("");

            _.each(collection, function(listing) {
                var adminListing = new AdminListing({
                    model: listing
                });

                this.$el.append(adminListing.render().el);
            }, this);
        },

        editListing: function(e) {
            e.preventDefault();

            var id = $(e.currentTarget).parents("li").attr("data-id");

            window.location = "/#/admin/listing/" + id;
        },

        deleteListing: function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).parents("li").attr("data-id"),
                model = this.collection.get(id),
                that = this;

            if ( confirm("Are you sure you want to delete " + model.get("name") + "?") ){
                model.destroy({
                    success: function(response) {
                        console.log(response.get("name") + " deleted.");
                        that.trigger("deleteListing");
                    },
                    error: function(respose) {
                        console.error("Error deleting: " + response.get("name"));
                    }
                });
            }
        },

        toggleListingVisible: function(e) {
            e.preventDefault();

            return $(e.currentTarget).parent().siblings(".slide").slideToggle();
        }

    });

    return foodmap.AdminListView;

});