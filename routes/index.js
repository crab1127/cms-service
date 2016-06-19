var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var ejs = require('ejs');

var superagent = require('superagent');

var config = require('../config');

var User = require('../controllers/user');



//后台
router.get('/cptbtptp', function(req, res) {
  res.type('.html');
  res.render('admin/index', {
    title: 'Expresss',
    path: '/cms/api'
  });
});
router.get('/admin', function(req, res) {
  res.type('.html');
  res.render('admin/index', {
    title: 'Expresss',
    path: '/cms/api'
  });
});


//预览
var Public = require('../controllers/public');
router.get('/', Public.index);
router.get('/index', function(req, res) {
  res.redirect('/');
});

router.get('/sample', Public.sample);

router.get('/industrial', Public.industrial);
router.get('/industrial/:id', Public.industrialContent);
router.get('/industrial/:id/onlineShop', Public.industrialShop);
router.get('/industrial/:id/logistics', Public.industrialLogistics);
router.get('/industrial/:id/introduce', Public.industrialIntroduce);
router.get('/industrial/:id/electricBusinessPark', Public.industrialElectric);
router.get('/industrial/:id/exhibitionTradeCenter', Public.industrialExhibition);

router.get('/market', Public.market);
router.get('/market/:id', Public.marketContent);
router.get('/market/:id/onlineShop', Public.marketShop);
router.get('/market/:id/logistics', Public.marketLogistics);
router.get('/market/:id/introduce', Public.marketIntroduce);
router.get('/market/:id/electricBusinessPark', Public.marketElectric);
router.get('/market/:id/exhibitionTradeCenter', Public.marketExhibition);




//生成页面
router.get('/create/index', function(req, res) {
  var _path = path.join(__dirname, '..', 'views/index.html');
  //var tempale = fs.readFileSync(_path, 'utf-8');
  superagent.get('/index?type=json').end(function (err, sres) {
    sres.body.assetsPath = config.ASSETS_PATH;
    ejs.renderFile(_path, sres.body, function(err, result) {
      if (err) return;
      fs.writeFile('index.html', result, 'utf-8', function(err) {
        if (!err) {
          res.json({'status':1, msg: '成功'})
        } else {
          res.json({'status':0, msg: '失败'})
        }
      })
    });
  })
});
router.get('/create/sample', function(req, res) {
  var _path = path.join(__dirname, '..', 'views/sample.html');
  //var tempale = fs.readFileSync(_path, 'utf-8');

  superagent.get('/sample?type=json').end(function (err, sres) {
    sres.body.assetsPath = config.ASSETS_PATH;
    ejs.renderFile(_path, sres.body, function(err, result) {
      fs.writeFile('sample.html', result, 'utf-8', function(err) {
        if (!err) {
          res.json({'status':1, msg: '成功'})
        } else {
          res.json({'status':0, msg: '失败'})
        }
      })
    });
  })
});

module.exports = router;
