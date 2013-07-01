define(["jquery", "backbone", "models/Listing", "models/Map", "collections/MapItemList", "views/admin/AdminForm", "views/admin/AdminListView", "text!templates/admin/index.html", "text!/assets/css/map.css"],

function($, Backbone, Listing, Map, MapItemList, AdminForm, AdminListView, template) {

    var foodmap = foodmap || {};

    foodmap.AdminMain = Backbone.View.extend({

        el: "#right-panel",

        template: _.template(template),

        events: {
            "click .filter": "filterListHandler"
        },

        initialize: function(options) {
            console.log("Initialize adminMain");
            var self = this;
            this.map_id = options.map_id;

            this.map = new Map({ 'map_id': this.map_id });
            this.map.fetch({
                reset: true,
                success: function() {
                    self.resetContainer();
                    self.createChildViews(options);
                }
            });
        },

        createChildViews: function(options) {
            this.childViews = [];

            this.$form = this.$app_container.find("#add-listing");
            this.$count = this.$app_container.find(".count");
            this.$body = this.$el;

            if (options.model) {
                this.model = options.model;
            } else {
                this.model = new Listing();
            }

            this.adminForm = new AdminForm({
                model: this.model
            });

            if (options.model) {
                this.setFormFields(model);
            }

            this.collection = new MapItemList({ 'map_id': this.map_id });
            this.adminListView = new AdminListView({
                collection: this.collection
            });
            this.collection.fetch({
                reset: true
            });

            this.childViews.push(this.adminForm);
            this.childViews.push(this.adminListView);

            this.listenTo(this.adminForm, 'addListing', this.resetView);
            this.listenTo(this.adminListView, 'deleteListing', this.resetView);
            this.listenTo(this.collection, 'reset', this.updateCount);
        },

        setFormFields: function(model) {
            this.$el.find("h1.top").text("Edit Eatery");

            this.$form.find("#name").val(model.get("name"));
            this.$form.find("#description").val(model.get("description"));
            this.$form.find("select[name='price']").find("option[value='" + model.get("price") + "']").attr("selected", true);
            this.$form.find("#ethnicity").val(model.get("ethnicity"));
            this.$form.find("#tags").val(model.get("tags"));
            this.$form.find("#lat").val(model.get("coordinates").lat);
            this.$form.find("#lng").val(model.get("coordinates").lng);
        },

        resetContainer: function() {
            this.$app_container = this.$el;
            this.$app_container.html(this.template(this.map.toJSON()));
        },

        resetView: function() {
            console.log("RESET");
            var that = this;
            this.$form[0].reset();
            this.collection.fetch({
                reset: true,
                success: function() {
                    that.updateCount();
                    that.adminListView.render();
                    that.trigger("resetAdminRoute");
                }
            });
        },

        updateCount: function() {
            this.$count.text(this.collection.length);
        },

        // Parse the class of the link to determine how to sort the view
        // Todo: I don't like how coupled the markup and functionality are here.
        filterListHandler: function(ev) {
            ev.preventDefault();

            var $link = $(ev.currentTarget),
                className = $link.attr("class").replace("filter ", "");
            className = (className.indexOf("-desc") < 0) ? className + "-desc" : className.substring(0, className.length - 5);

            $link.attr("class", "filter " + className);
            this.adminListView.renderFiltered(className);
        },

        close: function() {
            this.resetContainer();
            this.stopListening();
            _.each(this.childViews, function(childView) {
                childView.remove();
            });
        }

    });

    return foodmap.AdminMain;

});