require.config({
    baseUrl: "/assets/js", // generally the same directory as the script used in a data-main attribute for the top level script
    paths: {
        'underscore': 'lib/underscore.min',
        'backbone': 'lib/backbone.min',
        'jquery': 'lib/jquery-1.10.1.min',
        'async': 'lib/async',
        'infobox': 'lib/infobox.packed',
        'text': 'lib/text'
    }, // set up custom paths to libraries, or paths to RequireJS plugins
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'infobox': {
            deps: ['gmaps']
        }
    } // used for setting up all Shims (see below for more detail)
});


// convert Google Maps into an AMD module
define('gmaps', ['async!http://maps.googleapis.com/maps/api/js?key=AIzaSyDiA6472v_0VZUQjmVvXQ4peWbFZsUcpVc&sensor=false'], function() {
    return window.google.maps;
});

require(["jquery", "underscore", "backbone", "mapRouter"],
    function($, _, Backbone, Router) {

        var foodmap = foodmap || {};

        $(function() {
            new Router();
        });
    }
);