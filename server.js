// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express(),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

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

    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    // app.use(passport.initialize());
    // app.use(passport.session());

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

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback (db) {
    // I think it's only important to have this in the callback if I'm running commands in this file
    console.log("Mongoose connection open");

    // Schema(s)
    var ListingSchema = new mongoose.Schema({
        name: String,
        description: String,
        price: String,
        ethnicity: [String],
        tags: [String],
        coordinates: { lat: String, lng: String},
        created: { type: Date, default: Date.now },
        modified: { type: Date, default: Date.now },
        map_id: {type: Schema.Types.ObjectId, ref: 'Map'}
    });

    var UserSchema = new mongoose.Schema({
        email: String,
        password: String
    });

    var MapSchema = new mongoose.Schema({
        name: String,
        created: { type: Date, default: Date.now },
        modified: { type: Date, default: Date.now },
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        welcome_message: String
    });

    // Models
    var Listing = mongoose.model( 'Listing', ListingSchema );
    var User = mongoose.model( 'User', UserSchema );
    var Map = mongoose.model( 'Map', MapSchema );



    //// LISTINGS
    // Get all listings
    app.get( '/api/listings', function( request, response ) {
        return Listing.find( function( err, listings ) {
            if( !err ) {
                return response.send( listings );
            } else {
                return console.log( err );
            }
        });
    });
    //Get listing details
    app.get( '/api/listings/:id', function( request, response ) {
        return Listing.findById( request.params.id , function( err, listing ) {
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

        var listing = new Listing({
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
            modified: date,
            map_id: request.body.map_id
        });

        listing.save( function( err ) {
            if( !err ) {
                console.log( 'Created listing: ' + request.body.name );
                response.send(listing);
            } else {
                console.log( "POST Error: ", err );
                response.send( err );
            }
        });
        return response.send( listing );
    });
    // Update a listing
    app.put( '/api/listings/:id', function( request, response ) {
        console.log( 'Updating listing ' + request.body.name );
        return Listing.findById( request.params.id, function( err, listing ) {
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
                    console.log( 'Updated listing: ' + request.body.name );
                    response.send(listing);
                } else {
                    console.log( "PUT Error: ", err );
                    response.send(err);
                }
            });
        });
    });
    // Delete a listing
    app.delete( '/api/listings/:id', function( request, response ) {
        console.log( 'Deleting listing with id: ' + request.params.id );
        return Listing.findById( request.params.id, function( err, listing ) {
            return listing.remove( function( err ) {
                if( !err ) {
                    console.log( 'Listing removed: ' + request.body.name );
                    response.send( listing );
                } else {
                    console.log( err );
                }
            });
        });
    });



    //// USERS
    // Get all users
    app.get( '/api/users', function( request, response ) {
        return User.find( function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    });
    // Get a single user by id
    app.get( '/api/users/:id', function( request, response ) {
        return User.findById( request.params.id, function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    });
    // Get maps for a user by user_id
    app.get( '/api/users/:id/maps', function( request, response ) {
        return Map.find( { user_id: request.params.id }, function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    });



    //// MAPS
    // Get all maps
    app.get( '/api/maps', function( request, response ) {
        return Map.find( function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    });
    // Get a single map by id
    app.get( '/api/maps/:id', function( request, response ) {
        return Map.findById( request.params.id, function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    });
    // Get listings for a map by map_id
    app.get( '/api/maps/:id/listings', function( request, response ) {
        return Listing.find({ map_id: request.params.id }, function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    });


// *****************
// One-off Commands
// *****************

    User.remove().exec();
    Map.remove().exec();

    var bob = new User({
        email: "bob@gmail.com",
        password: "password"
    });
    var carl = new User({
        email: "carl@gmail.com",
        password: "password"
    });
    var lenny = new User({
        email: "lenny@gmail.com",
        password: "password"
    });

    bob.save( function(error, data){
        if(error) { console.log(error); }
    });
    carl.save( function(error, data){
        if(error) { console.log(error); }
    });
    lenny.save( function(error, data){
        if(error) { console.log(error); }
    });

    var bobMap = new Map({
        name: "bob's map",
        user_id: bob._id,
        welcome_message: "oh shit it's bob's map"
    });
    var carlMap = new Map({
        name: "carl's map",
        user_id: carl._id,
        welcome_message: "oh shit it's carl's map"
    });
    var lennyMap = new Map({
        name: "lenny's map",
        user_id: lenny._id,
        welcome_message: "oh shit it's lenny's map"
    });

    bobMap.save(function(error, data){
        if(error) { console.log(error); }
    });
    carlMap.save(function(error, data){
        if(error) { console.log(error); }
    });
    lennyMap.save(function(error, data){
        if(error) { console.log(error); }
    });

    User.find(function (err, res) {
      if (err) {
        console.log("error");
      } // TODO handle err
      console.log(res);
    });

    Map.find(function (err, res) {
      if (err) {
        console.log("error");
      } // TODO handle err
      console.log(res);
    });

});


//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

// db.maps.find().pretty()
// db.listings.update({ tags: "BestOf" }, { $set: { map_id: ObjectId("51cb51f87268d88734000001") } }, { multi: true })
// db.listings.update({ tags: "Pizza" }, { $set: { map_id: ObjectId("51cb51f87268d88734000002") } }, { multi: true })
// db.listings.update({ tags: "Burgers" }, { $set: { map_id: ObjectId("51cb51f87268d88734000003") } }, { multi: true })
// db.listings.find( { $or: [ {tags:"BestOf"}, {tags:"Burgers"}, {tags:"Pizza"} ] }).pretty()
