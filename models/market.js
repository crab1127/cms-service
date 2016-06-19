/**
 * 广货基地
 * @time 2016/4/21
 */
var mongoose = require('mongoose');
var shortid = require('shortid');

// var dbUrl = 'mongodb://localhost/gmcms';
// mongoose.connect(dbUrl)
//创建模型
var Schema = mongoose.Schema;

//定义一个新的模型
var MarketSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: String,
  title: String,
  img: String,
  logo: String,
  floorId: {
    type: String,
    ref: 'MarketFloor'
  },
  keywords: String,
  description: String,
  content: String, //市场介绍
  sortId:Number,
  ishidden: {        //是否公开， 默认公开
    type: String,
    default: '1'
  },
  appSortId: Number
});

var Market = mongoose.model('Market', MarketSchema)

// Market.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = Market;
