
define(["jquery", "backbone", "collections/MapItemList", "views/admin/AdminListView"],
    
    function($, Backbone, MapItemList, AdminListView) {

        var foodmap = foodmap || {};

        foodmap.AdminMain = Backbone.View.extend({

            el: "body",

            events: {},
            
            initialize: function() {
                this.$body = this.$el;

                foodmap.MapList = new MapItemList();
                this.adminListView = new AdminListView({ collection: foodmap.MapList }),

                foodmap.MapList.fetch({reset: true});
            }

        });

    return foodmap.AdminMain;

    }
);
