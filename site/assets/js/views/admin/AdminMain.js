define(["jquery", "backbone", "models/MapItem", "collections/MapItemList", "views/admin/AdminForm", "views/admin/AdminListView", "text!templates/admin/index.html", "text!/assets/css/map.css"],

function($, Backbone, MapItem, MapItemList, AdminForm, AdminListView, template) {

    var foodmap = foodmap || {};

    foodmap.AdminMain = Backbone.View.extend({

        el: "body",

        template: _.template(template),

        events: {
            "click .filter": "filterListHandler"
        },

        initialize: function(model) {
            console.log("Initialize");
            this.resetContainer();

            this.childViews = [];

            this.$form = this.$app_container.find("#add-listing");
            this.$count = this.$app_container.find(".count");
            this.$body = this.$el;

            if (model) {
                this.model = model;
            } else {
                this.model = new MapItem();
            }

            this.adminForm = new AdminForm({
                model: this.model
            });

            if (model) {
                this.setFormFields(model);
            }

            this.collection = new MapItemList();
            this.adminListView = new AdminListView({
                collection: this.collection
            });
            this.collection.fetch({
                reset: true
            });

            this.childViews.push(this.adminForm);
            this.childViews.push(this.adminListView);

            this.listenTo(this.collection, 'add', this.resetView);
            this.listenTo(this.collection, 'reset', this.updateCount);
            this.listenTo(this.adminListView, 'deleteListing', this.deleteListing);
            this.listenTo(this.adminForm, 'addListing', this.addListing);
        },

        addListing: function() {
            console.log("FIRE ADD");

            var model = this.adminForm.model,
                formData = {};

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
            this.listenTo(model, 'change', this.resetAdmin);
            // PUT
            if (model) {
                // Reset/redirect the form
                // Put a cute little message saying the form was updated
                // Try to edit the same eatery multiple times -- url error.
                model.save(formData, {
                    success: function() {
                        console.log("successful save!");
                    },
                    error: function() {
                        console.error("error in update.");
                    }
                });

            } else {
                // POST
                console.log("else");
                this.collection.create(formData);
            }
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
            this.$app_container = this.$el.find(".app-container");
            this.$app_container.html(this.template);
        },

        resetView: function() {
            console.log("RESET");
            this.$form[0].reset();
            this.updateCount();
        },

        resetAdmin: function() {
            window.location = "/#/admin";
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