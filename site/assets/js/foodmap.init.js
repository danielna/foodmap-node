require.config({
    baseUrl: "/assets/js", // generally the same directory as the script used in a data-main attribute for the top level script
    paths: {
        'underscore': 'lib/underscore.min',
        'backbone': 'lib/backbone.min',
        'jquery': 'lib/jquery-1.10.1.min',
        'text': 'lib/text'
    }, // set up custom paths to libraries, or paths to RequireJS plugins
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    } // used for setting up all Shims (see below for more detail)
});


require(["jquery", "underscore", "backbone", "router"],
    function($, _, Backbone, Router) {

        var foodmap = foodmap || {};

        $(function() {
            new Router();
        });
    }
);