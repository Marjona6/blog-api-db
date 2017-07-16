'use strict';

var mongoose = require('mongoose');

// Here is the schema to represent a blog post
var Schema = mongoose.Schema;

var BlogPostSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	// embedded sub-document; can retrieve this data with dot notation
	author: {
		//type: String,
		//required: true
		firstName: String,
		lastName: String
	}
	//created: {
	//	type: Date,
	//	default: Date.now
	//}
//}, {
	//collection: blogData
});

// Virtual. What exactly is a virtual (vs a schema or an apiRepr()?)
// BlogPostSchema.virtual('authorName').get(function() {
// 	return (this.author.firstName + ' ' + this.author.lastName).trim();
// });

// // apiRepr();
// BlogPostSchema.methods.apiRepr = function() {
// 	return {
// 		id: this._id,
// 		author: this.authorName,
// 		content: this.content,
// 		title: this.title,
// 		created: this.created
// 	};
// }

var BlogPost = mongoose.model('BlogPost', BlogPostSchema)
module.exports = {
	BlogPost: BlogPost
};