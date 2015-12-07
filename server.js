// Haar.appcloud.net

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var mongodbURL = 'mongodb://haar.cloudapp.net:27017/test';
var mongoose = require('mongoose');

// redirect /create?.........
app.post('/create',function(req,res) {
	res.redirect('/name/'+req.query.name+'/building/'+req.query.building+'/street/'+req.query.street+'/zipcode/'+req.query.zipcode+'/lon/'+req.query.lon+'/lat/'+req.query.lat+'/borough/'+req.query.borough+'/cuisine/'+req.query.cuisine+'/restaurant_id/'+req.query.id);
});

// redirect /search?id=xxx to RESTful path /id/:id/
app.get('/search',function(req,res) {
	res.redirect('/restaurant_id/'+req.query.id);
});

// redirect /search?id=xxx&field=xxx to RESTful path /id/:id/
app.get('/search',function(req,res) {
	res.redirect('/restaurant_id/'+req.query.id+'/field/'+req.query.field);
});

// redirect /delete?id=xxx to RESTful path /id/:id/
app.delete('/delete',function(req,res) {
	res.redirect('/restaurant_id/'+req.query.id);
});

// modify /update?id=xxx&FIELD=xxx& to RESTful path /id/:id/
app.put('/update',function(req,res) {
	res.redirect('/restaurant_id/'+req.query.id+'/+req.query.field/'+req.query.value);
});

app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		r.save(function(err) {
       		if (err) {
				var restaurantSchema = require('./models/restaurant');
				mongoose.connect(mongodbURL);
				var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function (callback) {
				var rObj = {};
				rObj.name = req.body.name;
				rObj.restaurant_id = req.body.restaurant_id;
		
				var Restaurant = mongoose.model('Restaurant', restaurantSchema);
				var r = new Restaurant(rObj);
				r.save(function(err2){
				if (err2){
					res.status(500).json(err2);
					throw err2;
					
					}
				db.close();
				res.status(200).json({message: 'insert done', id: r._id});	
				});
				}
			}
       		db.close();
			res.status(200).json({message: 'insert done', id: r._id});
    	});
    });
});

app.delete('/restaurant_id/:id',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		db.close();
			res.status(200).json({message: 'delete done', id: req.params.id});
    	});
    });
});

app.get('/restaurant_id/:id', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document', restaurant_id: req.params.id});
			}
			db.close();
    	});
    });
});

app.get('/restaurant_id/:id/:field', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var fieldName = req.params.field;
		Restaurant.find(({restaurant_id: req.params.id},{fieldName: 1}),function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document', restaurant_id: req.params.id});
			}
			db.close();
    	});
    });
});

app.put('/restaurant_id/:restaurant_id/grade', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var settings = req.body;
		criteria = {"grades":settings};
		Restaurant.update({restaurant_id:req.params.restaurant_id},{$set:criteria},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'Update done'});
			}
		});
	});
});

app.put('/restaurant_id/:restaurant_id/:field/:value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var fieldName = req.params.field;
		var fieldValue = req.params.value;
		criteria = {fieldName:fieldValue};
		Restaurant.update({restaurant_id:req.params.restaurant_id},{$set:criteria},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'Update done'});
			}
		});
	});
});

app.listen(process.env.PORT || 8099);
