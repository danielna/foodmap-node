define(["jquery", "backbone", "text!templates/admin/mapDetails.html", "text!templates/admin/mapForm.html"],

function($, Backbone, detailsTemplate, formTemplate) {

    var foodmap = foodmap || {};

    foodmap.MapDetailsView = Backbone.View.extend({

        el: ".map-details",

        events: {
            "click .show-hide": "showHide"
        },

        template: _.template(detailsTemplate),

        initialize: function(){
            this.model.bind("reset", _.bind(this.render, this));
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        showHide: function() {
            this.$el.find(".show-hide-container").slideToggle();
        }

        // addListing: function(e) {
        //     e.preventDefault();

        //     var model = this.model,
        //         formData = {},
        //         that = this;

        //     _.each(this.$el.serializeArray(), function(data) {
        //         formData[data.name] = data.value;
        //     });

        //     var ethnicity = [],
        //         tags = [],
        //         req_e = formData.ethnicity.split(","),
        //         req_t = formData.tags.split(",");

        //     for (var ety in req_e) {
        //         ethnicity.push((req_e[ety]).trim());
        //     }

        //     for (var t in req_t) {
        //         tags.push((req_t[t]).trim());
        //     }

        //     formData.ethnicity = ethnicity;
        //     formData.tags = tags;

        //     model.save(formData, {
        //         success: function(res) {
        //             console.log("Saved model: ", res.get("name"));
        //             that.trigger("addListing");
        //         },
        //         error: function(err) {
        //             console.error("Error saving model:", err);
        //         }
        //     });
        // }

    });

    return foodmap.MapDetailsView;

});