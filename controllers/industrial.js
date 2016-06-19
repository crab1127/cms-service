/**
 * 广贸基地
 * @time 2016/4/21
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var Superagent = require('superagent');


//模型
var Industrial = require('../models/industrial');
var IndustrialMenu = require('../models/industrialMenu');
var IndustrialShop = require('../models/industrialShop');

var agent = require('../config').java_api_host;

//获取基地
exports.get = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }

  Industrial.find()
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, industrial) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return Industrial.count(function(err, count) {
        res.json({'status':1, data: industrial, count: count})
      })
    })
}
//获取一条类目
exports.getOne = function(req, res) {
  var id = req.params.id;
  Industrial.findById(id, function(err, industrial) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: industrial})
    })
}
//删除类目
//支持删除多个 用逗号分隔
exports.del = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    Industrial.remove({_id: {$in: idsArr}}, function (err, industrial) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}
//添加类目
exports.save = function(req, res) {
  var id = req.body._id;
  var industrialObj = req.body;
  var _cate;
  if (id) {
    Industrial.findById(id, function(err, industrial) {
      _cate = _.extend(industrial, industrialObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new Industrial(industrialObj);
    _cate.save(function(err, industrial){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:industrial})

      getRemoteIndustrialShop(industrialObj.id, industrial._id)
    })
  }
}




//获取基地产品
exports.getShops = function(req, res) {
  var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
  var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 10;
  var startRow = (current - 1)*perPage;
  var sortName = req.query.shortName || 'sortId';
  var sortOrder = req.query.sortOrder;
  if (sortOrder === 'false') {
    sortName = '-' + sortName
  }


  var industrialId = req.params.id;
  var search = {
    pId: industrialId
  }
  req.query.categoryId && (search.categoryId = req.query.categoryId)

  IndustrialShop.find(search)
    .skip(startRow)
    .limit(perPage)
    .sort(sortName)
    .exec(function(err, shops) {
      if (err) {
        return res.json({'status':0, 'msg': err});
      }
      return IndustrialShop.find(search).count(function(err, count) {
        res.json({'status':1, data: shops, count: count})
      })
    })
}
//获取一条类目
exports.getProduct = function(req, res) {
  var id = req.params.id;
  IndustrialShop.findById(id, function(err, industrial) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: industrial})
    })
}
//添加类目
exports.saveShop = function(req, res) {
  var id = req.body._id;
  var shopObj = req.body;
  var _cate;
  if (id) {
    IndustrialShop.findById(id, function(err, shop) {
      _cate = _.extend(shop, shopObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new IndustrialShop(shopObj);
    _cate.save(function(err, shop){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:shop})
    })
  }
}
//删除类目
//支持删除多个 用逗号分隔
exports.delShop = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    IndustrialShop.remove({_id: {$in: idsArr}}, function (err, industrial) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}



//获取基地菜单
exports.getMenus = function(req, res) {
  var industrialId = req.params.id;
  IndustrialMenu
    .find({industrialId: industrialId})
    .sort('sortId')
    .exec(function(err, industrial) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: industrial})
    })
}
//获取一条类目
exports.getMenu = function(req, res) {
  var id = req.params.id;
  IndustrialMenu
    .findById(id, function(err, industrial) {
      if (err) {
        console.log(err);
        res.json({'status':0, 'msg': err});
        return;
      }
      res.json({'status':1, data: industrial})
    })
}
//删除类目
//支持删除多个 用逗号分隔
exports.delMenu = function(req, res) {
  var ids = req.params.ids;
  var idsArr = [];
  if (ids) {
    idsArr = ids.split(',')
  }

  if (idsArr.length) {
    IndustrialMenu.remove({_id: {$in: idsArr}}, function (err, industrial) {
      if (err) {
        res.json({'status': 0, 'msg': err})
        return
      }
      res.json({'status': 1})
    });
  }
}
//添加类目
exports.saveMenu = function(req, res) {
  var id = req.body._id;
  var industrialObj = req.body;
  var _cate;
  if (id) {
    IndustrialMenu.findById(id, function(err, industrial) {
      _cate = _.extend(industrial, industrialObj);
      _cate.save(function(err, cate) {
        res.json({status:1})
      })
    })
  }
  else {
    _cate = new IndustrialMenu(industrialObj);
    _cate.save(function(err, industrial){
      //newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
      res.json({status:1, data:industrial})
    })
  }
}

//判断基地是否已经添加
exports.hasIndustrial = function(req, res) {
  var id = req.params.id;
  Industrial.find({id: id})
    .exec(function(err, resIndust) {
      if (resIndust.length) {
        res.json({status: 0})
      } else {
        res.json({status: 1})
      }
    })
}

exports.syncShop = function(req, res) {
  var pid = req.params.id;
  var id = req.body.id;
  getRemoteIndustrialShop(id, pid, function(err, count, updateCount){
    if (err) {
      return res.json({status: 0})
    }
    res.json({status:1, count: count, updateCount: updateCount})
  })
}

exports.specialTown = function(req, res) {
  var keyword = req.query.keyword;
  var url = agent + '/specialTown/searchTown.cf?keyword=' + keyword;
  Superagent.get(url)
    .end(function(err, resData) {
      if(err) {
        return res.json({code:-888, msg: err})
      }
      var data = JSON.parse(resData.text);
      res.json(data)
    })
}

//获取专业镇的商家管理到
function getRemoteIndustrialShop(id, pid, callBack) {
  if (!callBack) {
    callBack = function(){};
  }
  var url = agent + '/specialTown/searchSCompanyByTownId.cf?townId=' + id;
  Superagent.get(url)
    .end(function(err, res) {
      if (err) return callBack(err);
      var data = JSON.parse(res.text)
      if (0 != data.code || !(data.data && data.data.length)) {
        return callBack(null, 0, 0)
      }
      var count = 0, updateCount = 0;
      data.data.forEach(function(item, i) {
        IndustrialShop.find({id: item.id, pId:pid})
          .exec(function(err, resShop) {
            if (err) return callBack(err);
            if (!resShop.length){
              var shopObj = {
                id: item.id,
                name: item.name,
                logo: item.logo,
                img: item.imgShow,
                pId: pid,
                categoryId: '0'
              }
              var _shop = new IndustrialShop(shopObj);
              _shop.save(function(err, resShop1){
                if (err) return callBack(err);
                console.log(resShop1);
              })
              updateCount++
            }
            count++;
            _cb();
          })
      })

      function _cb() {
        if (count == data.data.length) {
          callBack(null, count, updateCount)
        }
      }

    })
}
