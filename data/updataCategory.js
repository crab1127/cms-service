var fs = require('fs');

var mongoose = require('mongoose');
var Cheerio = require('cheerio');
var _ = require('underscore');

var Category = require('../models/category');
var config = require('../config');


//链接数据库
var dbUrl = config.URL;
var db = mongoose.connect(dbUrl);


fs.readFile(__dirname + '/category.html', 'utf-8', function (err, data) {
  if (err) console.log(err);
  var $ = Cheerio.load(data);
  $('a').each(function(index, el) {
    $el = $(el);
    var text = $el.text().trim();
    var href = $el.attr('href').replace('${path}', '');
    Category.findOne({'name': text}, function(err, res) {
      //var _cate = _.extend({}, res,)
      if (res) {
        res.link = href;
        res.save(function(err,res1) {
          console.log(res1.name,'链接修改成功', res1.link);
        })
      }
    })
  });
});
