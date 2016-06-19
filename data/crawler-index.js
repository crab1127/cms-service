var Superagent = require('superagent');
var Cheerio = require('cheerio');

var mongoose = require('mongoose');

var config = require('../config');
//链接数据库
var dbUrl = config.URL;
// var db = mongoose.connect(dbUrl);


//引入数据模型
var Ads = require('../models/ads');
var IndexFloor = require('../models/indexFloor');
var IndexProduct = require('../models/indexProduct');
var IndexLogo = require('../models/indexLogo');
var IndexLink = require('../models/indexLink');



Superagent.get('http://www.gdp8.com')
  .end(function(err, res) {
    var resText = res.text;
    var $ = Cheerio.load(resText);

    //banner 数据
    var $banner = $('#main-slide .bd li');
    var banners = [];
    $banner.each(function(index, el) {
      var $el = $(el);
      var _ads = new Ads({
        img: $el.find('img').attr('data-src'),
        link: $el.find('a').attr('href'),
        area: 1,
        sortid: 10
      })
      _ads.save(function(err, res) {
        if(err) return;
        console.log( 'banner ->' + res.title);
      })
    });


    //楼层
    var $floor = $('.industry-item')
    $floor.each(function(index, el){
      var $el = $(el);
      var title = $el.find('h2').text().replace(/^\dF/, '');
      var _floor = new IndexFloor({name: title});
      _floor.save(function(err, res) {
        console.log( title + '--楼层添加成功');

        link(el, res._id);
        logo(el, res._id);
        product(el, res._id);
      })

    })


    function link(el, floorId) {
      var $links = $(el).find('.link a');
      var links = [];
      $links.each(function(index, el) {
        var $link = $(el);
        var _link = new IndexLink({
          title: $link.text(),
          link: $link.attr('href'),
          floorid: floorId
        });
        _link.save(function(err, res) {
          if(err) return;
          console.log( ': 链接 ->' + res.title);
        })
      });
    }

    function logo(el, floorId) {
      var $logos = $(el).find('.floor-brand a');
      var logos = []
      $logos.each(function(index, el) {
        var $logo = $(el);
        var _logo = new IndexLogo({
          title: $logo.find('img').attr('alt'),
          img: $logo.find('img').attr('data-src'),
          link: $logo.attr('href'),
          floorid: floorId
        });
        _logo.save(function(err, res) {
          if(err) return;
          console.log( ': logo ->' + res.img);
        })
      });
    }


    function product(el, floorId) {
      var $products = $(el).find('.banner, .big, .sm, .floor-brand-product');
      var products = [];
      $products.each(function(index, el) {
        var $product = $(el);
        var type;
        var className = $(el).attr('class');
        if (/banner/g.test(className)) {
          type = 'a';
        } else if (/big/g.test(className)) {
          type = 'b';
        } else if (/sm/g.test(className)) {
          type = 'c';
        } else if (/floor-brand-product/g.test(className)) {
          type = 'd';
        }
        var _product = new IndexProduct({
          title: $product.find('img').attr('alt'),
          img: $product.find('img').attr('data-src'),
          link: $product.attr('href'),
          type: type,
          floorid: floorId
        })
        _product.save(function(err, res) {
          if(err) return;
          console.log( ': 产品 ->' +type + '--' + res.img);
        })
      });
    }
  })
