define(["jquery", "backbone", "text!templates/admin/form-addlisting.html"],

function($, Backbone, template) {

    var foodmap = foodmap || {};

    foodmap.AdminForm = Backbone.View.extend({

        el: "#add-listing",

        events: {
            "click #submit": "addListing"
        },

        template: _.template(template),

        initialize: function(){
            this.render();
        },

        render: function() {
            this.$el.html(this.template);
            return this;
        },

        addListing: function(e) {
            e.preventDefault();

            var model = this.model,
                formData = {},
                that = this;

            _.each(this.$el.serializeArray(), function(data) {
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

            model.save(formData, {
                success: function(res) {
                    console.log("Saved model: ", res.get("name"));
                    that.trigger("addListing");
                },
                error: function(err) {
                    console.error("Error saving model:", err);
                }
            });
        }

    });

    return foodmap.AdminForm;

});