
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

                foodmap.MapList = new MapItemList();
                this.adminListView = new AdminListView({ collection: foodmap.MapList }),

                foodmap.MapList.fetch({reset: true});
            },

            addListing: function(e) {
                e.preventDefault();

                var formData = {};
                
                _.each(this.$form.serializeArray(), function(data) {
                    formData[data.name] = data.value;
                });
                
                foodmap.MapList.create( formData );
            }

        });

    return foodmap.AdminMain;

    }
);
