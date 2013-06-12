
define(["jquery", "backbone", "views/admin/AdminListing"],
    
    function($, Backbone, AdminListing) {

        var foodmap = foodmap || {};

        foodmap.AdminListView = Backbone.View.extend({

            el: "ul.list",

            events: {},

            initialize: function() {
                this.collection.bind("reset", _.bind(this.render, this));
                this.listenTo( this.collection, 'add', this.render );
            },

            render: function() {
                this.collection.each( function(listing) {
                    var adminListing = new AdminListing({
                        model: listing
                    });

                    this.$el.append( adminListing.render().el );
                }, this);
            }

        });
    
    return foodmap.AdminListView;
    
    }
);
