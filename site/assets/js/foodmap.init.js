

require.config({
    baseUrl: "/assets/js", // generally the same directory as the script used in a data-main attribute for the top level script
    paths: {
        'underscore': '/assets/js/lib/underscore.min',
        'backbone': '/assets/js/lib/backbone.min',
        'jquery': '/assets/js/lib/jquery-1.10.1.min',
        'infobox': '/assets/js/lib/infobox.packed'
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


require( ["jquery", "underscore", "backbone", "views/Main" ],
    function($, _, Backbone, Main) {

        var foodmap = foodmap || {};

        $(function() {

            new Main();

        });
    }
);
