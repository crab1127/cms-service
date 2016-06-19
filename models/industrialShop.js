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
  id: String, //店铺id
  name: String,   //店铺名
  img: String,   //图片名
  logo: String, //
  pId: String, //专业镇id
  categoryId: {
    type: String, //关联的类目
    ref: 'IndustrialMenu'
  },
  sortId:Number,
  state: {        //是否公开， 默认公开
    type: String,
    default: '1'
  },
  appSortId: Number
});

var Industrial = mongoose.model('IndustrialShop', IndustrialSchema)

// Industrial.find({}, function(err, floor){
//   console.log(floor);
// })

module.exports = Industrial;
