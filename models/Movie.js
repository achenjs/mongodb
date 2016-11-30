const mongodb = require('./mongodb');

const Schema = mongodb.mongoose.Schema;

const MovieSchema = new Schema({
  name : String,
  alias : [String],
  publish : Date,
  create_date : { type: Date, default: Date.now},
  images :{
    coverSmall:String,
    coverBig:String,
  },
  source :[{
    source:String,
    link:String,
    swfLink:String,
    quality:String,
    version:String,
    lang:String,
    subtitle:String,
    create_date : { type: Date, default: Date.now }
  }]
});

const Movie = mongodb.mongoose.model("Movie", MovieSchema);

const MovieDAO = function(){};
module.exports = new MovieDAO();
