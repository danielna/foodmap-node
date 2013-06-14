
define(["jquery", "backbone", "views/admin/AdminListing"],
    
    function($, Backbone, AdminListing) {

        var foodmap = foodmap || {};

        foodmap.AdminListView = Backbone.View.extend({

            el: "ul.list",

            events: {
                "click .model-edit": "editListing",
                "click .model-delete": "deleteListing"
            },

            initialize: function() {
                this.collection.bind("reset", _.bind(this.render, this));
                this.listenTo( this.collection, 'add', this.render );
            },

            render: function() {
                this.collection.each(function(listing) {
                    var adminListing = new AdminListing({
                        model: listing
                    });

                    this.$el.append( adminListing.render().el );
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
                
                _.each( collection, function(listing) {
                    var adminListing = new AdminListing({
                        model: listing
                    });
                    
                    this.$el.append( adminListing.render().el );
                }, this);
            },

            editListing: function(e){
                e.preventDefault();

                var $this = $(event.currentTarget),
                    id = $this.attr("data-id");
                
                this.trigger("editListing", id);
            },

            deleteListing: function(e){
                e.preventDefault();

                var $this = $(event.currentTarget),
                    id = $this.attr("data-id");
                
                this.trigger("deleteListing", id);
            }

        });
    
    return foodmap.AdminListView;
    
    }
);
