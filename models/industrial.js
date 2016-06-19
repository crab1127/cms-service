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
var IndustrialSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  id: String, //基地id
  name: String,   //基地名
  nameEn: String,   //基地名
  img: String,   //图片名
  logo: String,   //图片名
  keywords: String,   //关键词
  description: String,   //描述
  content: String, //产业介绍
  exhibition: String, //展会中心
  sortId:Number,
  cmsLink: String, //资讯链接
  cmsName: String, //资讯名字
  state: {        //是否公开， 默认公开
    type: String,
    default: '1'
  },
  appSortId: Number
});

var Industrial = mongoose.model('Industrial', IndustrialSchema)

// Industrial.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = Industrial;
