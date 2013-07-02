// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ), //MongoDB integration
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


//Create server
var app = express(),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Configure server
app.configure( function() {
    app.use(express.static( path.join( application_root, 'site') ));
    // app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'eat maps' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use(app.router);
    //Show all errors in development
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});




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

UserSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

var MapSchema = new mongoose.Schema({
    name: String,
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    welcome_message: String,
    description: String
});

// Models
var Listing = mongoose.model( 'Listing', ListingSchema );
var User = mongoose.model( 'User', UserSchema );
var Map = mongoose.model( 'Map', MapSchema );




// MONGOOSE

//Connect to db using mongoose
mongoose.connect( 'mongodb://localhost/foodmap_db' );

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback (db) {
    // I think it's only important to have this in the callback if I'm running commands in this file
    console.log("Mongoose connection open");

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
        description: "this is BOB's map!!!!",
        welcome_message: "oh shit it's bob's map"
    });
    var carlMap = new Map({
        name: "carl's map",
        user_id: bob._id,
        description: "this is CARL's map!!!!",
        welcome_message: "oh shit it's carl's map"
    });
    var lennyMap = new Map({
        name: "lenny's map",
        user_id: bob._id,
        description: "this is LENNY's map!!!!",
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

    var bestof = { tags: 'BestOf' },
        burgers = { tags:'Burgers'},
        pizza = { tags:'Pizza'},
        update1 = { $set: { map_id: bobMap.id }},
        update2 = { $set: { map_id: carlMap.id }},
        update3 = { $set: { map_id: lennyMap.id }},
        options = { multi: true };

    Listing.update(bestof, update1, options, function(err, foo) {});
    Listing.update(burgers, update2, options, function(err, foo) {});
    Listing.update(pizza, update3, options, function(err, foo) {});

});







// Passport / Auth
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne( {'_id':id} , function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));







app.get('/', ensureAuthenticated(), function(req, res) {
    res.render("index.html");
});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
});

app.get('/logout', ensureAuthenticated(), function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated() {
    return function(req, res, next) {
        console.log("req.isAuthenticated():", req.isAuthenticated());
        if (req.isAuthenticated()) {
            next();
        } else {
            res.render("splash.html");
        }
    };
}

// Routes
app.get( '/api', ensureAuthenticated(), function( request, response ) {
    response.send( 'Library API is running' );
});

//// LISTINGS
// Get all listings
app.get( '/api/listings', ensureAuthenticated(), function( request, response ) {
    return Listing.find( function( err, listings ) {
        if( !err ) {
            return response.send( listings );
        } else {
            return console.log( err );
        }
    });
});
//Get listing details
app.get( '/api/listings/:id', ensureAuthenticated(), function( request, response ) {
    return Listing.findById( request.params.id , function( err, listing ) {
        if( !err ) {
            return response.send( listing );
        } else {
            return console.log( err );
        }
    });
});
// Insert a new listing
app.post( '/api/listings', ensureAuthenticated(), function( request, response ) {
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
app.put( '/api/listings/:id', ensureAuthenticated(), function( request, response ) {
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
app.delete( '/api/listings/:id', ensureAuthenticated(), function( request, response ) {
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
app.get( '/api/users', ensureAuthenticated(), function( request, response ) {
    if (request.user.id) {
        return User.findById( request.user.id, function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    }
    return User.find( function( err, res ) {
        if( !err ) {
            return response.send( res );
        } else {
            return console.log( err );
        }
    });
});
// Get a single user by id
app.get( '/api/users/:id', ensureAuthenticated(), function( request, response ) {
    return User.findById( request.params.id, function( err, res ) {
        if( !err ) {
            return response.send( res );
        } else {
            return console.log( err );
        }
    });
});


//// MAPS
// Get all maps
app.get( '/api/maps', ensureAuthenticated(), function( request, response ) {
    if (request.user.id) {
        return Map.find( {"user_id": request.user.id }, function( err, res ) {
            if( !err ) {
                return response.send( res );
            } else {
                return console.log( err );
            }
        });
    }
    return Map.find( function( err, res ) {
        if( !err ) {
            return response.send( res );
        } else {
            return console.log( err );
        }
    });
});
// Get a single map by id
app.get( '/api/maps/:id', ensureAuthenticated(), function( request, response ) {
    return Map.findById( request.params.id, function( err, res ) {
        if( !err ) {
            return response.send( res );
        } else {
            return console.log( err );
        }
    });
});
// Get a single map by id
app.get( '/api/maps/:id/listings', ensureAuthenticated(), function( request, response ) {
    return Listing.find( {"map_id": request.params.id} , function( err, res ) {
        if( !err ) {
            return response.send( res );
        } else {
            return console.log( err );
        }
    });
});




//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});


// db.maps.find().pretty()
// db.listings.update({ tags: "BestOf" }, { $set: { map_id: ObjectId("51d1a38ad5e8f2390b000004") } }, { multi: true })
// db.listings.update({ tags: "Pizza" }, { $set: { map_id: ObjectId("51d1a38ad5e8f2390b000005") } }, { multi: true })
// db.listings.update({ tags: "Burgers" }, { $set: { map_id: ObjectId("51d1a38ad5e8f2390b000006") } }, { multi: true })
// db.listings.find( { $or: [ {tags:"BestOf"}, {tags:"Burgers"}, {tags:"Pizza"} ] }).pretty()
