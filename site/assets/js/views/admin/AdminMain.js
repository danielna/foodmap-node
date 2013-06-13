
define(["jquery", "backbone", "collections/MapItemList", "views/admin/AdminListView", "models/MapItem"],
    
    function($, Backbone, MapItemList, AdminListView, MapItem) {

        var foodmap = foodmap || {};

        foodmap.AdminMain = Backbone.View.extend({

            el: "body",

            events: {
                "click #submit": "addListing",
                "click .filter": "filterListHandler"
            },
            
            initialize: function() {
                this.$body = this.$el;
                this.$form = this.$el.find("#add-listing");
                this.$count = this.$body.find(".count");

                this.collection = new MapItemList();
                this.adminListView = new AdminListView({ collection: this.collection }),

                this.collection.fetch({reset: true});

                this.listenTo( this.collection, 'add', this.resetView );
                this.listenTo( this.collection, 'reset', this.resetView );
            },

            addListing: function(e) {
                e.preventDefault();

                var formData = {};
                
                _.each(this.$form.serializeArray(), function(data) {
                    formData[data.name] = data.value;
                });

                var ethnicity = [],
                    tags = [],    
                    req_e = formData.ethnicity.split(","),
                    req_t = formData.tags.split(",");

                for (var ety in req_e) {
                    ethnicity.push((req_e[ety]).trim());
                }

                for (var t in req_t) {
                    tags.push((req_t[t]).trim());
                }

                formData.ethnicity = ethnicity;
                formData.tags = tags;
                
                this.collection.create( formData );
            },

            resetView: function() {
                this.$form[0].reset();
                this.$count.text(this.collection.length);
            },

            filterListHandler: function(ev) {
                ev.preventDefault();

                var $link = $(ev.currentTarget),
                    asc = true,
                    className = $link.attr("class").replace("filter ", "");
                
                if (!$link.hasClass("asc")){
                    asc = false;
                }

                if (!asc) {
                    className = className + "-desc";
                }

                

                this.adminListView.renderFiltered(className);           

                $link.toggleClass("asc");
            }

        });

    return foodmap.AdminMain;

    }
);
