'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _require = require('./models'), BlogPost = _require.BlogPost;

var _require = require('./config'),
	PORT = _require.PORT,
	DATABASE_URL = _require.DATABASE_URL;

// var db = 'mongodb://localhost/tempTestDb';

mongoose.connect(DATABASE_URL, {useMongoClient: true});

// Mongoose: mpromise (mongoose's default promise library) is deprecated; plug in your own promise library instead
mongoose.Promise = global.Promise;

var port = 8080;

// test GET request to root and display a message
app.get('/', function(req, res) {
	console.log("Someone made a GET request to root");
	res.send("You made a GET request to root");
});

// GET all posts and display on a web page in JSON format
app.get('/posts', function(req, res) {
	// res.send('Welcome to the database. You are making a GET request.');
	console.log('getting all the posts');
	BlogPost.find()
		.exec(function(err, BlogPost) {
			if(err){
				res.send('Error has occurred!');
			}
			else {
				console.log(BlogPost);
				res.json(BlogPost);
			}
		});
});

// GET one blog post in particular
app.get('/posts/:id', function(req, res) {
	console.log('getting one post');
	BlogPost.findOne({
		_id:req.params.id
	})
	.exec(function(err, BlogPost) {
		if(err) {
			res.send('An error has occurred!');
		}
		else {
			console.log(BlogPost);
			res.json(BlogPost);
		}
	});
});

// POST request to add a blog post to the database
// we will use body-parser
app.use(bodyParser.json());
// this will allow us to use Postman
app.use(bodyParser.urlencoded({
	extended: true
}));
// now the actual POST request
app.post('/posts', function(req, res) {
	var requiredFields = ['title', 'content', 'author'];
	for (var i = 0; i < requiredFields.length; i++) {
		var field = requiredFields[i];
		if (!(field in req.body)) {
			var message = 'Missing ' + field + ' in request body';
			console.error(message);
			return res.status(400).send(message);
		}
	}

	BlogPost.create({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	}).then(function (BlogPost) {
		return res.status(201).json(BlogPost);
	}).catch(function(err) {
		console.error(err);
		res.status(500).json({
			message: 'Internal server error'
		});
	});
});

// PUT request
// this is the only thing that isn't working of the 4 CRUD operations
app.put('/posts/:id', function(req, res) {
	// validate that ids in request path and request body match
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		var message = "Request path ID (" + req.params.id + ") and request body ID (" + req.body.id + ") must match!";
		console.error(message);
		res.status(400).json({
			message: message
		});
	}
	BlogPost.findOneAndUpdate({
		_id: req.params.id
	}, {$set: {title: req.body.title},
		function(err, BlogPost) {
			if(err) {
				console.log('error oh no!');
			}
			else {
				console.log(BlogPost);
				res.status(204).send('A-OK');
			}
		}});
});

// DELETE request
app.delete('/posts/:id', function(req, res) {
	BlogPost.findByIdAndRemove(req.params.id).exec().then(function(blogPost) {
		return res.status(204).end();
	}).catch(function(err) {
		return res.status(500).json({
			message: 'Internal server error!'
		});
	});
});

// make the whole thing go
app.listen(port, function() {
	console.log('app listening on port ' + port);
});



// 'use strict';

// // dependencies/requirements
// var bodyParser = require('body-parser');
// var express = require('express');
// var mongoose = require('mongoose');
// var morgan = require('morgan');

// var _require = require('./config'),
// 	PORT = _require.PORT,
// 	DATABASE_URL = _require.DATABASE_URL;

// var _require2 = require('./models'),
// 	BlogPost = _require2.BlogPost;

// var app = express();
// app.use(bodyParser.json());
// app.use(morgan('common'));

// mongoose.Promise = global.Promise;

// // GET requests to '/posts'
// app.get('/posts', function (req, res) {
// 	BlogPost.find
// 	().exec
// 	().then(function (posts) {
// 		res.json({
// 			posts: posts.map(function (post) {
// 				return post.apiRepr();
// 			});
// 		});
// 	}).catch(function (err) {
// 		console.error(err);
// 		res.status(500).json({
// 			message: 'Internal server error'
// 		});
// 	});
// });
// // requirements:
// // sends back all posts in the database
// // each post should be an object:
// // {
// 	// "title": "a title",
// 	// "content": "some content",
// 	// "author": "some author",
// 	// "created": "1234590202848"
// // }
// // GET requests to '/posts/:id'
// app.get('/posts/:id', function (req, res) {
// 	BlogPost
// 		.findById(req.params.id).exec().then(function (blogPost) {
// 			return res.json(blogPost);
// 		}).catch(function (err) {
// 			console.error(err);
// 			res.status(500).json({
// 				message: 'Internal server error'
// 			});
// 		});
// })
// // sends back a single post with :id if it exists using the schema above

// // POST requests to '/posts'
// app.post('posts', function (req, res) {
// 	var requiredFields = ['title', 'content', 'author'];
// 	for (var i = 0; i < requiredFields.length; i++) {
// 		var field = requiredFields[i];
// 		if (!(field in req.body)) {
// 			var message = 'Missing ' + field + ' in request body';
// 			console.error(message);
// 			return res.status(400).send(message);
// 		}
// 	}

// 	BlogPost.create({
// 		title: req.body.title,
// 		content: req.body.content,
// 		author: req.body.author
// 	}).then(function (BlogPost) {
// 		return res.status(201).json(BlogPost);
// 	}).catch(function(err) {
// 		console.error(err);
// 		res.status(500).json({
// 			message: 'Internal server error'
// 		});
// 	})
// });
// // requirements:
// // endpoint for creating new blog posts
// // expects request body to contain a JSON object
// // validates that request body includes title, content, and author
// // returns a 400 status and helpful error message if one of these is missing
// // returns the new post (using the same key/value pairs as the posts returned by GET /posts)

// // DELETE requests to '/posts/:id'
// // requirements:
// // allows user to delete 

// // PUT requests to '/posts/:id'
// // requirements:
// // endpoint that allows user to update title, content, and author fields
// // expects request body to contain a JSON object
// // id property in request body is required (must be there)
// // if the id in the URL path (/posts/:id) and the id in the request body don't match, should return a 400 status code with helpful error message
// // should return the updated object with a 200 status code