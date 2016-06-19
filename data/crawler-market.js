var Superagent = require('superagent');
var Cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var _ = require('underscore');
var mongoose = require('mongoose');

var config = require('../config');
//链接数据库
var dbUrl = config.URL;
//var db = mongoose.connect(dbUrl);

var Ads = require('../models/ads');
var Product = require('../models/product');
var Market = require('../models/market');
var MarketMenu = require('../models/marketMenu');
var MarketProduct = require('../models/marketProduct');
var MarketFloor = require('../models/marketFloor');
var MarketProductFloor = require('../models/marketContentFloor');

var ep = new eventproxy();

Superagent.get('http://www.gdp8.com/market/professionalMarket.cf')
  .end(function(err, res) {
    var resText = res.text;
    var $ = Cheerio.load(resText);



    var $floors = $('.gm-title');
    var $products = $('.gm-conter');

    $floors.each(function(index, el) {
      var $floor = $(el);
      var _floor = new MarketFloor({
        name: index+ '楼',
        img: $floor.find('img').attr('src')
      })
      _floor.save(function(err, res) {
        if(err) return;
        console.log(res.img + '--楼层添加成功');
        product($products[index], res._id)
      })
    });

    function product(el, floorId) {
      var $products = $(el).find('.col-md-3');
      var products = [];
      $products.each(function(index, el) {
        var $product = $(el);
        var type;
        var ishidden = $product.find('a').attr('href') == '#' ? 0 : 1;
        var _product = new Market({
          name: $product.find('strong').text(),
          title: $product.find('p').text(),
          img: $product.find('img').attr('src'),
          floorId: floorId,
          ishidden: ishidden
        })
        _product.save(function(err, res) {
          if(err) return;
          console.log( ': 产品 ->' + res.img);
          ep.emit('market', [$product.find('a').attr('href'), res._id])
        })
      });
    }

    var $prod = $('.gm-container .col-md-3')
    ep.after('market', $prod.length, function(res) {
      console.log(res);
      res.forEach(function(el, index) {
        if(el[0] != '#') {
          var id = el[1];
          Superagent.get(el[0])
            .end(function(err, res) {
              var resText = res.text;
              var $ = Cheerio.load(resText);

              Market.findById(id, function(err, market){
                _market = _.extend(market, {logo: $('.logo img').eq(1).attr('src')})
                _market.save(function(err, ads) {
                  console.log('专业市场: logo')
                });
              })

              var $contains = $('.gm-container');

              menu($contains, id);
              banner($contains.find('#scrol-box-list-id .scrol'), id);
              tuij($contains.find('.a-tuj > div'), id)
              floor($contains.find('.floor-box'), id)

              function menu($el, floorId){
                var $menu1 = $el.find('.lemenu .ti');
                var $menu2 = $el.find('.lemenu .ty');

                $menu1.each(function(index, el) {
                  var _menu = new MarketMenu({
                    name: $menu1.text(),
                    marketId: floorId,
                    parentid: floorId
                  })
                  _menu.save(function(err, res){
                    if(err) return;
                    $($menu2[index]).find('a').each(function(index, el) {
                      var $el = $(el);
                      var _menu2 = new MarketMenu({
                        name: $el.text(),
                        marketId: floorId,
                        parentid: res._id,
                        link: $el.attr('href')
                      })
                      _menu2.save(function(err, res){
                        if(err) return;
                        console.log('菜单->'+ $el.text())
                      })
                    });
                  })
                });
              }

              function banner($el, floorId){
                $el.each(function(index, el) {
                  var $el = $(el);
                  var _ads = new Ads({
                    img: $el.find('img').attr('src'),
                    link: $el.find('a').attr('href'),
                    area: id,
                    sortid: 10
                  })
                  _ads.save(function(err, res) {
                    if(err) return;
                    console.log( 'banner ->' + res.img);
                  })
                });
              }

              function tuij($tuij, floorId){
                $tuij.each(function(index, el) {
                  var $el = $(el);
                  var _product = new Product({
                    name: $el.find('.ti').text(),
                    link: $el.find('a').attr('href'),
                    desc: $el.find('.de').text(),
                    price: $el.find('.pr').text().replace('￥ ', ''),
                    area: floorId
                  })
                  _product.save(function(err, res) {
                    if(err) return;
                    console.log( '推荐 ->' + res.name);
                  })
                });
              }

              function floor($floors, floorId) {
                $floors.each(function(index, el) {
                  var $el = $(el);
                  var _floor = new MarketProductFloor({
                    img: $el.find('.one img').attr('src'),
                    link:$el.find('.one').attr('href'),
                    marketId: floorId,
                    name: (index + 1) + '楼'
                  });
                  _floor.save(function(err, res) {
                    product($('.gm-container .floor-box')[index], floorId, res._id);
                  })
                });
              }

              function product(el, marketId, floorId) {
                console.log('专业市场id' + marketId)
                console.log('楼层id' + floorId)
                var $products = $(el).find('.two, .fou, .fiv, .six, .sev');
                var products = [];
                $products.each(function(index, el) {
                  var $product = $(el);
                  var type;
                  var className = $(el).attr('class');
                  if (/two/g.test(className)) {
                    type = '1';
                  } else if (/fou/g.test(className)) {
                    type = '2';
                  } else if (/fiv/g.test(className)) {
                    type = '3';
                  } else if (/six/g.test(className)) {
                    type = '4';
                  } else if (/sev/g.test(className)) {
                    type = '5';
                  }
                  var _product = new MarketProduct({
                    img: $product.find('img').attr('src'),
                    link: $product.attr('href'),
                    type: type,
                    marketId: marketId,
                    floorId:floorId
                  })
                  _product.save(function(err, res) {
                    if(err) return;
                    console.log( '产品 ->' +type + '--' + res.img);
                  })
                });
              }

            })
        }
      });
    })

  })





