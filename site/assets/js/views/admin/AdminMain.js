
define(["jquery", "backbone", "collections/MapItemList", "views/admin/AdminListView", "models/MapItem"],
    
    function($, Backbone, MapItemList, AdminListView, MapItem) {

        var foodmap = foodmap || {};

        foodmap.AdminMain = Backbone.View.extend({

            el: "body",

            events: {
                "click #submit": "addListing"
            },
            
            initialize: function() {
                this.$body = this.$el;
                this.$form = this.$el.find("#add-listing");

                this.collection = new MapItemList();
                this.adminListView = new AdminListView({ collection: this.collection }),

                this.collection.fetch({reset: true});

                this.listenTo( this.collection, 'add', this.resetView );
            },

            addListing: function(e) {
                e.preventDefault();

                var formData = {};
                
                _.each(this.$form.serializeArray(), function(data) {
                    formData[data.name] = data.value;
                });
                
                this.collection.create( formData );
            },

            resetView: function() {
                alert("Reset!");
                this.$form[0].reset();
                this.collection.trigger("reset");
            }

        });

    return foodmap.AdminMain;

    }
);
