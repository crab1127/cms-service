/**
 * 配置
 */

module.exports = {
  title: 'gmcms',
  description: '广贸内贸网',
  keywords: 'b2b,专业镇, 专业市场',

  //
  site_headers: [
    '<meta name="auto" content="crab1127@gmail.com"/>'
  ],
  site_logo: '/static/index/images/logo.png',
  site_logo_icon: '/static/IndustrialCluster/images/10003/industrial_cluster_logo1.png',
  site_icon: '',
  site_navs: [
    //格式 [path title [target]]
    ['/', '首页'],
    ['/industrial', '专业镇'],
    ['/market', '专业市场'],
    ['/sample', '样品中心'],
    ['http://club.mr-world.com', '招商加盟']
  ],

  host: '',
  //网站静态资源路径
  assets_path: '/static',
  //网站根路径
  domain_path: '',

  img_host: 'http://img.gdp.com',
  //后端api接口
  java_api_host: 'http://dev.gdpcrm.com',

  //mongodb数据库配置
  URL: 'mongodb://mongo.gdp.com/gmcms',
  DB: 'gmcms',

  //redis
  redis_host: 'redis.gdp.com',
  redis_port: 6379,
  redis_db: 0,

  //程序运行端口
  port: 3000,

  //文件上传配置
  upload: {
    path: '',
    url: ''
  }
};
