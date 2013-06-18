// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express();

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, 'site') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get( '/api', function( request, response ) {
    response.send( 'Library API is running' );
});



// MONGOOSE

//Connect to db using mongoose
mongoose.connect( 'mongodb://localhost/foodmap_db' );

// Schema(s)
var ListingSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    ethnicity: [String],
    tags: [String],
    coordinates: { lat: String, lng: String},
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now }
});

// Models
var ListingModel = mongoose.model( 'Listing', ListingSchema );

// REST

// Get a list of all listings
app.get( '/api/listings', function( request, response ) {
    return ListingModel.find( function( err, listings ) {
        if( !err ) {
            return response.send( listings );
        } else {
            return console.log( err );
        }
    });
});

//Get a single listing by id
app.get( '/api/listings/:id', function( request, response ) {
    return ListingModel.findById( request.params.id, function( err, listing ) {
        if( !err ) {
            return response.send( listing );
        } else {
            return console.log( err );
        }
    });
});

// Insert a new listing
app.post( '/api/listings', function( request, response ) {
    var date = new Date();

    var listing = new ListingModel({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        ethnicity: request.body.ethnicity,
        tags: request.body.tags,
        coordinates: {
            lat: request.body.lat,
            lng: request.body.lng
        },
        created: date,
        modified: date
    });

    listing.save( function( err ) {
        if( !err ) {
            return console.log( 'Created listing: ' + request.body.name );
        } else {
            return console.log( err );
        }
    });
    return response.send( listing );
});

// Update a listing
app.put( '/api/listings/:id', function( request, response ) {
    console.log( 'Updating listing ' + request.body.name );
    return ListingModel.findById( request.params.id, function( err, listing ) {
        listing.name = request.body.name,
        listing.description = request.body.description,
        listing.price = request.body.price,
        listing.ethnicity = request.body.ethnicity,
        listing.tags = request.body.tags,
        listing.coordinates.lat = request.body.lat,
        listing.coordinates.lng = request.body.lng,
        listing.modified = new Date();

        return listing.save( function( err ) {
            if( !err ) {
                return console.log( 'Updated listing: ' + request.body.name );
            } else {
                return console.log( "ERROR: " + err );
            }
        });
    });
});

// Delete a listing
app.delete( '/api/listings/:id', function( request, response ) {
    console.log( 'Deleting listing with id: ' + request.params.id );
    return ListingModel.findById( request.params.id, function( err, listing ) {
        return listing.remove( function( err ) {
            if( !err ) {
                console.log( 'Listing removed: ' + request.body.name );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
});


//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});