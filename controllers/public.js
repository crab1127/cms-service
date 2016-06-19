var _ = require('underscore');
var eventproxy = require('eventproxy');
var Superagent = require('superagent');

var redis = require('../util/redis');
var toTreeData = require('../util/tree').toTreeData;

//模型
var Category = require('../models/category');
var Ads = require('../models/ads');
var Product = require('../models/product');

//首页
var IndexFloor = require('../models/indexFloor');
var IndexProduct = require('../models/indexProduct');
var IndexLogo = require('../models/indexLogo');
var IndexLink = require('../models/indexLink');

//样品中心
var Sample = require('../models/sample');
var SampleProduct = require('../models/sampleProduct');

//专业镇
var Industrial = require('../models/industrial');
var IndustrialMenu = require('../models/industrialMenu');
var IndustrialShop = require('../models/industrialShop');

//专业市场
var Market = require('../models/market');
var MarketMenu = require('../models/marketMenu');
var MarketProduct = require('../models/marketProduct');
var MarketFloor = require('../models/marketFloor');
var MarketContentFloor = require('../models/marketContentFloor');


//首页
exports.index = function (req, res) {

  var type = req.query.type;

  var industrys, categorys, ads;

  //楼层
  IndexFloor.find({'state':1})
    .sort('sortId')
    //.populate('product')
    //.populate('link')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      var a = b = c = 0;

      //去除mongoose 对象的值，转为普通的json
      floor = JSON.parse(JSON.stringify(floor));

      if (!floor|| !floor.length) {
        industrys = [];
        _res();
        return
      }

      floor.forEach(function(value, index){

        //产品
        IndexProduct.find({'floorid': value._id})
          .sort('sortId')
          .exec(function(err, product){
            a++
            if (err) {
              console.log(err);
            }
            floor[index].banner = _.where(product, {type:'a'})[0];
            floor[index].big = _.where(product, {type:'b'}).slice(0,3);
            floor[index].sm = _.where(product, {type:'c'}).slice(0,3);
            floor[index].logoimg = _.where(product, {type:'d'})[0];

            floorDate();
          });

        //logo
        IndexLogo.find({'floorid': value._id})
          .sort('sortId')
          .exec(function(err, logo){
            b++
            if (err) {
              console.log(err);
            }
            floor[index].logo = logo.slice(0,6);

            floorDate();
          });

        //链接
        IndexLink.find({'floorid': value._id})
          .sort('sortId')
          .exec(function(err, link) {
            c++;
            if (err) {
              console.log(err);
            }
            floor[index].link = link.slice(0, 5);

            floorDate();
          });

        function floorDate() {
          if (a == floor.length && b == floor.length && c == floor.length) {
            industrys = floor;
            _res();
          }
        }
      })
    });


  //类目
  category(function(ress){
    categorys = ress;
    _res();
  })

  //广告
  Ads.find({'ishidden':1, 'area':1})
    .sort('sortid')
    .exec(function(err, resAds){
      if (err) {
        console.log(err);
      }
      ads = resAds;
      _res();
    });


  function _res() {
    if (industrys && categorys && ads) {
      var resDate = {
        title: '首页',
        industrys: industrys,
        categorys: categorys,
        ads: ads
      }
      if (type == 'json') {
        res.json(resDate)
      } else {
        res.type('.html');
        res.render('index', resDate);
      }
    }
  }
}

//样品中心
exports.sample = function (req, res) {
  var ep = new eventproxy();
  //var categorys, samples, ads;
  var type = req.query.type;
  ep.all('samples', 'categorys', 'ads', 'recommend', function(samples, categorys, ads, recommend) {
    var resDate = {
      title: '光贸网',
      floors: samples,
      categorys: categorys,
      ads: ads,
      recommend: recommend
    }
    if (type == 'json') {
      res.json(resDate)
    } else {
      res.type('.html');
      res.render('sample', resDate);
    }
  });

  //样品数据
  Sample.find({'state':1})
    .sort('sortId')
    .limit(5)
    .exec(function(err, resSample){
      if (err) {
        console.log(err);
      }

      var a = 0;
      resSample = JSON.parse(JSON.stringify(resSample));
      if(!resSample || !resSample.length) {
        ep.emit('samples', [])
      }
      resSample.forEach(function(value, index){
        //产品
        SampleProduct.find({'isTop':1,'pid': value._id})
          .sort('sortId')
          .exec(function(err, product){
            a++
            if (err) {
              console.log(err);
            }
            resSample[index].products = product;
            if (a == resSample.length ) {
              ep.emit('samples', resSample)
            }
          });
      });
    });

  //类目
  category(function(ress){
    ep.emit('categorys', ress)
  })

  //推荐产品
  //推荐产品
  Product.find({'ishidden':1,'area': 2, 'type': 1})
    .sort('sortid')
    .limit(5)
    .exec(function(err, res){
      if (err) console.log(err);
      ep.emit('recommend', res)
    })

  //广告
  Ads.find({'ishidden':1, 'area':2})
    .sort('sortid')
    .exec(function(err, resAds){
      if (err) {console.log(err); }
      ep.emit('ads', resAds)
    });
}

//专业镇 列表页
exports.industrial = function(req, res) {
  var old = +new Date();
  var ep = new eventproxy();
  ep.all('categorys', 'silde', 'shops', function(categorys, silde, shops) {
    res.type('.html');
    res.render('industrial-list', {
      title: '首页',
      keywords: '专业市场',
      categorys: categorys,
      silde: silde,
      shops: shops
    })
  });

  //类目
  category(function(res) {
    ep.emit('categorys', res)
  });

  //主banner
  Ads.find({'ishidden':1, 'area':3})
    .sort('sortid')
    .exec(function(err, resAds) {
      if (err) {
        console.log(err);
        return;
      }
      ep.emit('silde', resAds);
    })

  //专业镇
  Industrial.find({'state':1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err);
      }
      ep.emit('shops', res);
    })
}
//专业组-首页
exports.industrialContent = function(req, res) {
  var ep = new eventproxy();
  var id = req.params.id;
  var path = req.path;
  var result = res;
  ep.all('base', 'menu', 'slide', 'recommend', 'shops', 'logo',
    function(base, menu, slide, recommend, shops, logo) {
      res.type('.html');
      res.render('industrial-index', {
        base: base,
        menus: menu,
        slide: slide,
        recommend: recommend,
        shops: shops,
        logos: logo,
        path: path,
        logo: base.logo
      })
  })



  //base
  Industrial.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
      //res.json({'status':0, 'msg': err});
      //return;
    }
    ep.emit('base', industrial)
  });

  //菜单
  IndustrialMenu.find({industrialId: id, ishidden:1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      }
      var menu = toTreeData(res, id);
      if (menu && menu.length) {
        menu = menu.slice(0, 4)
      }
      ep.emit('menu', menu || []);
    })

  //幻灯片
  Ads.find({'ishidden':1, 'area':id})
    .sort('sortid')
    .exec(function(err, res) {
      if (err) {
        console.log(err);
        return;
      }
      ep.emit('slide', res);
    })

  //推荐产品
  Product.find({'ishidden':1,'area':id})
    .sort('sordid')
    .limit(2)
    .exec(function(err, res){
      if (err) {
        console.log(err)
      }
      ep.emit('recommend', res)
    })

  //商家/logo
  IndustrialShop.find({pId:id, state:1})
    .sort('sortId')
    .populate('categoryId')
    .exec(function(err, res) {
      if (err) { console.log(err) }
      if(!res.length) {
        //return ep.emit('floorContent', contentFloor)
        return result.redirect('/industrial')
      }
      var logos = [];
      for (var i = 0, len = res.length; i < len; i++) {
        if (!res[i].logo) {
          continue;
        }
        var isIn = false;
        //假如没值， 表示在其他类型中
        //(function(i){
          if (!res[i].categoryId) {
            res[i].categoryId = {};
            res[i].categoryId._id = 0;
            res[i].categoryId.name = '其他';
            // {
            //   _id: 0,
            //   name: '其他'
            // }
            console.log(res[i].categoryId)
          }
          for (var x = logos.length - 1; x >= 0; x--) {
            if (res[i].categoryId && logos[x].id === res[i].categoryId._id) {
              logos[x].items.push(res[i]);
              isIn = true;
            }
          }
          if (!logos.length || !isIn) {
            logos.push({
              id: res[i].categoryId._id,
              name: res[i].categoryId.name,
              items: [res[i]]
            });
          }
        //})(i)
      }
      ep.emit('shops', res);
      ep.emit('logo', logos);
    })

}
// 商城
exports.industrialShop = function(req, res) {
  var id = req.params.id;
  var params = req.query;
  var path = req.path;
  //base
  Industrial.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    if (!industrial.id) {
      var a = '/industrial/'+ id
      return res.redirect(a);
    }
    var industrialId = industrial.id
    var a = '';
    for (var key in params) {
      a += key + '=' + params[key] + '&';
    }
    params.productType = params.productType ? params.productType.split(',') : [];
    params.vip = params.vip ? params.vip.split(',') : [];
    delete params.page;

    Superagent.get('/productSearch/searchResult.cf?townId='+industrialId+'&' + a )
      .end(function(err, ress){
        if(err) {
          return res.render('industrial-shop', {
            base: industrial,
            path: path,
            logo: industrial.logo,
            filter: params,
            pages: {},
            products: []
          })
        }
        var a = JSON.parse(ress.text);
        var product = a.data.result.itemList;
        var pages = a.pagination;
        res.render('industrial-shop', {
          base: industrial,
          path: path,
          logo: industrial.logo,
          filter: params,
          pages: pages,
          products: product
        })
      });
  });
}
// 物流
exports.industrialLogistics = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  //base
  Industrial.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    res.render('industrial-logistics', {
      base: industrial,
      path: path,
      logo: industrial.logo
    })
  });
}
// 产业介绍
exports.industrialIntroduce = function(req, res) {
  var id = req.params.id;

  var path = req.path;

  Industrial.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    var content = industrial.content;
    if (content) {
      var marked = require('marked');
      content = marked(content);
    } else {
      res.redirect('/industrial/' + id)
    }
    res.render('industrial-introduce', {
      base: industrial,
      path: path,
      content: content,
      logo: industrial.logo
    })
  });
}
//电商园
exports.industrialElectric = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  Industrial.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    res.render('industrial-electric', {
      base: industrial,
      path: path,
      logo: industrial.logo
    })
  });
}
//展贸中心
exports.industrialExhibition = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  Industrial.findById(id, function(err, industrial) {
    if (err) {
      console.log(err);
    }
    var content = industrial.exhibition;
    if (content) {
      var marked = require('marked');
      content = marked(content);
    } else {
      res.redirect('/industrial/' + id)
    }
    res.render('industrial-exhibition', {
      base: industrial,
      content: content,
      path: path,
      logo: industrial.logo
    })
  });
}

//专业市场
exports.market = function(req, res) {
  var ep = new eventproxy();

  ep.all('categorys', 'slides', 'markets', function(categorys, slides, markets) {
    res.type('.html')
    res.render('market-list', {
      categorys: categorys,
      slides: slides,
      markets: markets
    })
  });

  //类目
  category(function(res){
    ep.emit('categorys', res)
  });

  //slides
  Ads.find({'ishidden':1, 'area':4})
    .sort('sortid')
    .limit(4)
    .exec(function(err, resAds) {
      if (err) {
        console.log(err);
        return;
      }
      ep.emit('slides', resAds);
    })

  //markets;
  //分开查询
  MarketFloor.find({ishidden:1})
    .sort('sortId')
    .exec(function(err, resFloor) {
      if(!resFloor.length) {
        return ep.emit('markets', [])
      }
      resFloor = JSON.parse(JSON.stringify(resFloor));
      var count = 0
      resFloor.forEach(function(item, i){
        Market.find({ishidden:1, floorId: item._id})
          .sort('sortId')
          .exec(function(err, resMarket){
            resFloor[i].items = resMarket;
            count++;
            _res()
          })
      })
      function _res() {
        if (count == resFloor.length) {
          ep.emit('markets', resFloor);
        }
      }
    })
  // Market.find({ishidden:1})
  //   .populate('floorId', null, null, {find: {ishidden:1}, sort:'sortId'})
  //   .sort('sortId')
  //   .exec(function(err, res){
  //     var markets = [];
  //     for (var i = 0, len = res.length; i < len; i++) {
  //       var isIn = false;
  //       for (var x = markets.length - 1; x >= 0; x--) {
  //         if (markets[x].id === res[i].floorId._id) {
  //           markets[x].items.push(res[i]);
  //           isIn = true;
  //         }
  //       }
  //       if (!markets.length || !isIn) {
  //         markets.push({
  //           id: res[i].floorId._id,
  //           name: res[i].floorId.name,
  //           img: res[i].floorId.img,
  //           items: [res[i]]
  //         });
  //       }
  //     }
  //     ep.emit('markets', markets);
  //   })
}

exports.marketContent = function(req, res) {
  var ep = new eventproxy();
  var id = req.params.id;
  var path = req.path;

  ep.all('base', 'menus', 'slides', 'recommend', 'floorContent',
    function(base, menus, slides, recommend, floorContent) {
      res.type('.html');
      res.render('market-index', {
        menus: menus,
        base: base,
        slides: slides,
        recommend: recommend,
        floorContent: floorContent,
        path: path,
        logo: base.logo
      })
    }
  );

  //楼层内容
  MarketContentFloor.find({marketId:id, state: 1})
    .sort('sortId')
    .exec(function(err, res1){
      if (err) { console.log(err) }
      var contentFloor = JSON.parse(JSON.stringify(res1));
      if(!contentFloor.length) {
        //return ep.emit('floorContent', contentFloor)
        return res.redirect('/market')
      }
      var a = b = c = d = e = 0
      contentFloor.forEach(function(item, i) {

          MarketProduct.find({marketId:id, floorId:contentFloor[i]._id, ishidden:1, type:1})
            .sort('sortId')
            .limit(1)
            .exec(function(err, resBanner) {
              a++
              contentFloor[i].banner = resBanner;
              _res()
            })
          MarketProduct.find({marketId:id, floorId:contentFloor[i]._id, ishidden:1, type:2})
            .sort('sortId')
            .limit(2)
            .exec(function(err, res) {
              b++
              contentFloor[i].product1 = res;
              _res()
            })
          MarketProduct.find({marketId:id, floorId:contentFloor[i]._id, ishidden:1, type:3})
            .sort('sortId')
            .limit(1)
            .exec(function(err, res) {
              c++
              contentFloor[i].product2 = res;
              _res()
            })
          MarketProduct.find({marketId:id, floorId:contentFloor[i]._id, ishidden:1, type:4})
            .sort('sortId')
            .limit(2)
            .exec(function(err, res) {
              d++
              contentFloor[i].product3 = res;
              _res()
            })
          MarketProduct.find({marketId:id, floorId:contentFloor[i]._id, ishidden:1, type: 5})
            .sort('sortId')
            .limit(2)
            .exec(function(err, res) {
              e++
              contentFloor[i].product4 = res;
              _res();
            })
        //})(i)
      })
      function _res() {
        if (a == contentFloor.length && b == contentFloor.length
            && c == contentFloor.length && d == contentFloor.length
            && e == contentFloor.length) {
          ep.emit('floorContent', contentFloor)
        }
      }
    })

  //楼层基本信息
  Market.findById(id, function(err, market) {
      if (err) {
        console.log(err);
      }
      ep.emit('base', market)
    })


  //菜单
  MarketMenu.find({marketId: id, ishidden:1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      }
      var menu = toTreeData(res, id);
      if (menu && menu.length) {
        menu = menu.slice(0, 5)
      }
      ep.emit('menus', menu || []);
    })

  //幻灯片
  Ads.find({'ishidden':1, 'area':id})
    .sort('sortid')
    .limit(3)
    .exec(function(err, res) {
      if (err) {
        console.log(err);
        return;
      }
      ep.emit('slides', res);
    })

  //推荐产品
  Product.find({'ishidden':1,'area':id})
    .sort('sortid')
    .limit(3)
    .exec(function(err, res){
      if (err) {
        console.log(err)
      }
      ep.emit('recommend', res)
    })
}
// 商城
exports.marketShop = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  var ep = new eventproxy();

  ep.all('base', 'menus', function(base, menus) {
    res.render('market-shop', {
      base: base,
      menus: menus,
      path: path,
      logo: base.logo
    })
  })
  //base
  Market.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    ep.emit('base', market);
  });
  MarketMenu.find({marketId: id, ishidden:1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      }
      var menu = toTreeData(res, id);
      if(menu && menu.length) {
        menu = menu.slice(0, 5);
      }
      ep.emit('menus', menu || []);
    })
}
// 物流
exports.marketLogistics = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  //base
  Market.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    res.render('market-logistics', {
      base: market,
      path: path,
      logo: market.logo
    })
  });
}
// 产业介绍
exports.marketIntroduce = function(req, res) {
  var id = req.params.id;

  var path = req.path;

  Market.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    var content = market.content;
    if (content) {
      var marked = require('marked');
      content = marked(content);
    } else {
      return res.redirect('/market/' + id)
    }
    res.render('market-introduce', {
      base: market,
      path: path,
      content: content,
      logo: market.logo
    })
  });
}
//电商园
exports.marketElectric = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  Market.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    res.render('market-electric', {
      base: market,
      path: path,
      logo: market.logo
    })
  });
}
//展贸中心
exports.marketExhibition = function(req, res) {
  var id = req.params.id;
  var path = req.path;
  var ep = new eventproxy();
  ep.all('base', 'menus', function(base, menus) {
    res.render('market-exhibition', {
      base: base,
      menus: menus,
      path: path,
      logo: base.logo
    })
  })
  Market.findById(id, function(err, market) {
    if (err) {
      console.log(err);
    }
    ep.emit('base', market)
  });
  MarketMenu.find({marketId: id, ishidden:1})
    .sort('sortId')
    .exec(function(err, res) {
      if (err) {
        console.log(err)
      }
      var menu = toTreeData(res, id);
      if (menu && menu.length) {
        menu = menu.slice(0, 5)
      }
      ep.emit('menus', menu || []);
    })
}



//转为树形结构


function category(cb) {
  redis.get('category', function(err, res){
    res = JSON.parse(res);
    if (res && res.length) {
      res = res.slice(0, 12)
    }
    cb(res || []);
  })
}
