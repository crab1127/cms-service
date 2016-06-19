var url = require('url');
var util = require('util');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');

var express = require('express');
var router = express.Router();

var config = require('../config');

//用户
var User = require('../controllers/user');
router
  .post('/login', User.login)
  .post('/logout', User.logout)
  .get('/users', User.signinRequired, User.adminRequired, User.getList)
  .post('/user', User.signinRequired, User.adminRequired, User.save)
  .delete('/user/:ids', User.signinRequired, User.adminRequired, User.del)

//栏目首页
var IndexFloor = require('../controllers/index');
router
  //楼层
  .get('/indexFloor', User.signinRequired, IndexFloor.get)
  .post('/indexFloor', User.signinRequired, IndexFloor.save)
  .delete('/indexFloor/:id', User.signinRequired, IndexFloor.del)
  //产品
  .get('/indexProduct/:floorid', User.signinRequired, IndexFloor.getProduct)
  .post('/indexProduct', User.signinRequired, IndexFloor.saveProduct)
  .delete('/indexProduct/:id', User.signinRequired, IndexFloor.delProduct)
  //logo
  .get('/indexLogo/:floorid', User.signinRequired, IndexFloor.getLogo)
  .post('/indexLogo', User.signinRequired, IndexFloor.saveLogo)
  .delete('/indexLogo/:id', User.signinRequired, IndexFloor.delLogo)
  //link
  .get('/indexLink/:floorid', User.signinRequired, IndexFloor.getLink)
  .post('/indexLink', User.signinRequired, IndexFloor.saveLink)
  .delete('/indexLink/:id', User.signinRequired, IndexFloor.delLink)


//类目管理
var Category = require('../controllers/category');
router
  .get('/category', Category.getAll)
  .post('/category/cache', Category.setCache)
  .get('/category/list/:parentid', User.signinRequired, Category.get)
  .get('/category/:id', User.signinRequired, Category.getOne)
  .post('/category', User.signinRequired, Category.save)
  .post('/category/move', User.signinRequired, Category.move)
  .delete('/category/:ids', User.signinRequired, Category.del)



//广货基地
var Industrial = require('../controllers/industrial');
router
  .get('/industrial', User.signinRequired, Industrial.get)
  .post('/industrial', User.signinRequired, Industrial.save)
  .delete('/industrial/:ids', User.signinRequired, Industrial.del)
  .get('/industrial/:id', User.signinRequired, Industrial.getOne)
  //商家
  .get('/industrial/shop/:id', User.signinRequired, Industrial.getShops)
  .post('/industrial/shop', User.signinRequired, Industrial.saveShop)
  .delete('/industrial/shop/:ids', User.signinRequired, Industrial.delShop)
  //菜单
  .get('/industrial/menu/:id', User.signinRequired, Industrial.getMenus)
  .post('/industrial/menu', User.signinRequired, Industrial.saveMenu)
  .delete('/industrial/menu/:ids', User.signinRequired, Industrial.delMenu)


  .get('/industrial/:id/has', User.signinRequired, Industrial.hasIndustrial)
  .post('/industrial/:id/shop/sync', User.signinRequired, Industrial.syncShop)
  .get('/specialTown/searchTown', User.signinRequired, Industrial.specialTown)


//专业市场
var Market = require('../controllers/market');
router
  .get('/market', User.signinRequired, Market.get)
  .post('/market', User.signinRequired, Market.save)
  .delete('/market/:ids', User.signinRequired, Market.del)
  .get('/market/one/:id', User.signinRequired, Market.getOne)
  //楼层
  .get('/market/floor', User.signinRequired, Market.getFloor)
  .post('/market/floor', User.signinRequired, Market.saveFloor)
  .delete('/market/floor/:ids', User.signinRequired, Market.delFloor)
  //产品
  .get('/market/:id/product', User.signinRequired, Market.getProducts)
  .get('/market/product/:id', User.signinRequired, Market.getProduct)
  .post('/market/product', User.signinRequired, Market.saveProduct)
  .delete('/market/product/:ids', User.signinRequired, Market.delProduct)
  //产品楼层
  .get('/market/:id/floor', User.signinRequired, Market.getProductFloor)
  .post('/market/:id/floor', User.signinRequired, Market.saveProductFloor)
  .delete('/market/:id/floor/:ids', User.signinRequired, Market.delProductFloor)
  //菜单
  .get('/market/:id/menu', User.signinRequired, Market.getMenus)
  .post('/market/menu', User.signinRequired, Market.saveMenu)
  .delete('/market/menu/:ids', User.signinRequired, Market.delMenu)



//样品中心
var Sample = require('../controllers/sample');
router
  //样品分类
  .get('/sample/sort', User.signinRequired, Sample.getSort)
  .post('/sample/sort', User.signinRequired, Sample.saveSort)
  .delete('/sample/sort/:id', User.signinRequired, Sample.delSort)
  //产品
  .get('/sample/product/:id', User.signinRequired, Sample.getProduct)
  .post('/sample/product', User.signinRequired, Sample.saveProduct)
  .get('/sample/like/:id', Sample.productLike)
  .delete('/sample/product/:id', User.signinRequired, Sample.delProduct)

//产品管理
var Product = require('../controllers/product');
router
  .get('/product', User.signinRequired, Product.getProductAll)
  .post('/product', User.signinRequired, Product.saveProduct)
  .delete('/product/:ids', User.signinRequired, Product.delProduct)


//广告管理
var Ads = require('../controllers/ads');
router
  .get('/ads', User.signinRequired, Ads.getAdsAll)
  .post('/ads', User.signinRequired, Ads.saveAds)
  .delete('/ads/:ids', User.signinRequired, Ads.delAds)

//模板修改
var ViewsManager = require('../controllers/viewsManager');
router
  .get('/viewsAll', User.signinRequired, ViewsManager.getViewsFiles)
  .get('/views', User.signinRequired, ViewsManager.getFileContent)
  .post('/views', User.signinRequired, ViewsManager.saveFileContent)

//上传文件
router.post('/uploading', User.signinRequired, function(req, res, next) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './public/upload/'});
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);
    if(err){
      //console.log('parse error: ' + err);
    } else {
      //console.log('parse files: ' + filesTmp);
      var inputFile = files.file[0];

      var originalName = inputFile.originalFilename;

      var timestamp = Date.now()
      var type = originalName.substr(originalName.lastIndexOf('.'), originalName.length);

      var uploadedPath = inputFile.path;
      var dstPath = './public/upload/' + timestamp + type

      //重命名为真实文件名
      fs.rename(uploadedPath , dstPath, function(err) {
        if(err){
          //console.log('rename error: ' + err);
        } else {
          //console.log('rename ok');
          var resulte = {
            status: 1,
            data: {
              domain: 'http://localhost:3000',
              url: dstPath.replace('./public', ''),
              size: inputFile.size
            }
          }
          res.json(resulte)
        }
      });
    }
  });
});

module.exports = router;

