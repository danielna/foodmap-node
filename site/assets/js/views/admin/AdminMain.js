define(["jquery", "backbone", "collections/MapItemList", "views/admin/AdminListView", "models/MapItem", "text!templates/admin/index.html", "text!/assets/css/map.css"],

function($, Backbone, MapItemList, AdminListView, MapItem, template) {

    var foodmap = foodmap || {};

    foodmap.AdminMain = Backbone.View.extend({

        el: "body",

        template: _.template(template),

        events: {
            "click #submit": "addListing",
            "click .filter": "filterListHandler"
        },

        initialize: function() {
            this.$app_container = this.$el.find(".app-container");
            this.$app_container.html(this.template);

            this.$form = this.$app_container.find("#add-listing");
            this.$count = this.$app_container.find(".count");
            this.$body = this.$el;

            this.collection = new MapItemList();
            this.adminListView = new AdminListView({
                collection: this.collection
            }),

            this.collection.fetch({
                reset: true
            });

            this.listenTo(this.collection, 'add', this.resetView);
            this.listenTo(this.collection, 'reset', this.resetView);
            this.listenTo(this.adminListView, 'editListing', this.addListing);
            this.listenTo(this.adminListView, 'deleteListing', this.deleteListing);
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

            this.collection.create(formData);
        },

        resetView: function() {
            this.$form[0].reset();
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
        }

    });

    return foodmap.AdminMain;

});