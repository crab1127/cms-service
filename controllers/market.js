/**
 * 广贸基地
 * @time 2016/4/21
 */

var mongoose = require('mongoose');
var _ = require('underscore');


//模型
var Market = require('../models/market');
var MarketMenu = require('../models/marketMenu');
var MarketProduct = require('../models/marketProduct');
var MarketFloor = require('../models/marketFloor');
var MarketProductFloor = require('../models/marketContentFloor');

//专业市场
exports.get = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }

  var search = {};
  req.query.floorId && (search.floorId = req.query.floorId)

  Market.find(search)
    .skip(startRow)
    .limit(perPage)
    .populate('floorId')
    .sort(sortName)
    .exec(function(err, market) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return Market.find(search).count(function(err, count) {
        return res.json({'status':1, data: market, count: count})
      })
    })
}
exports.getOne = function(req, res) {
  var id = req.params.id;
  Market
    .findById(id, function(err, market) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: market})
    })
}
exports.del = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    Market.remove({_id: {$in: idsArr}}, function (err, market) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}
exports.save = function(req, res) {
  var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    Market.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new Market(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}


//专业市场楼层
exports.getFloor = function(req, res) {
  MarketFloor.find()
    .sort('sortId')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': floor})
    });
}
exports.saveFloor = function (req, res) {
  var id = req.body._id
  var floorObj = req.body
  var _floor;

  if (id) {
    MarketFloor.findById(id, function(err, floor){
      _floor = _.extend(floor, floorObj)
      _floor.save(function(err, floor) {
        res.json({status:1})
      });
    })
  } else {
    _floor = new MarketFloor(floorObj);
    _floor.save(function(err, floor){
      console.log(floor);
      res.json({status:1, data: {_id: floor._id}})
    })
  }
}
exports.delFloor = function (req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }
  if (idsArr.length) {
    MarketFloor.remove({_id: {$in: idsArr}}, function(err, floor){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}


//产品
//获取莫个市场的产品
exports.getProducts = function(req, res) {

  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1) * perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  var marketId = req.params.id;
  var search = {};
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }

  //搜索

  search.marketId = marketId;

  req.query.type && (search.type = req.query.type)
  req.query.floorId && (search.floorId = req.query.floorId)



  MarketProduct.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, shops) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      return MarketProduct.find(search).count(function(err, count){
        return res.json({'status':1, data: shops, 'count': count})
      })
    })
}
exports.getProduct = function(req, res) {
  var id = req.params.id;
  MarketProduct.findById(id, function(err, market) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: market})
    })
}
exports.saveProduct = function(req, res) {
  var id = req.body._id;
  var shopObj = req.body;
  var _cate;
  if (id) {
    MarketProduct.findById(id, function(err, shop) {
      _cate = _.extend(shop, shopObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketProduct(shopObj);
    _cate.save(function(err, shop){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:shop})
    })
  }
}
exports.delProduct = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    MarketProduct.remove({_id: {$in: idsArr}}, function (err, market) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}

//专业市场产品楼层
exports.getProductFloor = function(req, res) {
  var marketId = req.params.id;
  MarketProductFloor.find({marketId: marketId})
    .sort('sortId')
    .exec(function(err, floor){
      if (err) {
        console.log(err);
      }
      res.json({'status':1, 'data': floor})
    });
}
exports.saveProductFloor = function (req, res) {
  var id = req.body._id
  var floorObj = req.body
  var _floor;
  floorObj.marketId = req.params.id;

  if (id) {
    MarketProductFloor.findById(id, function(err, floor){
      _floor = _.extend(floor, floorObj)
      _floor.save(function(err, floor) {
        res.json({status:1})
      });
    })
  } else {
    _floor = new MarketProductFloor(floorObj);
    _floor.save(function(err, floor){
      console.log(floor);
      res.json({status:1, data: {_id: floor._id}})
    })
  }
}
exports.delProductFloor = function (req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }
  if (idsArr.length) {
    MarketProductFloor.remove({_id: {$in: idsArr}}, function(err, floor){
      if (err) {
        res.json({status:0,message:err})
      } else {
        res.json({status:1})
      }
    })
  }
}

//获取基地菜单
exports.getMenus = function(req, res) {
  var marketId = req.params.id;
  MarketMenu
    .find({marketId: marketId})
    .sort('sortId')
    .exec(function(err, market) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: market})
    })
}
exports.getMenu = function(req, res) {
  var id = req.params.id;
  MarketMenu
    .findById(id, function(err, market) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: market})
    })
}
exports.delMenu = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    MarketMenu.remove({_id: {$in: idsArr}}, function (err, market) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}
exports.saveMenu = function(req, res) {
  var id = req.body._id;
  var marketObj = req.body;
  var _cate;
  if (id) {
    MarketMenu.findById(id, function(err, market) {
      _cate = _.extend(market, marketObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new MarketMenu(marketObj);
    _cate.save(function(err, market){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:market})
    })
  }
}
