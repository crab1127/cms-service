# cms服务端
cms 是使用 Node.js + MongoDB + 客户端vue框架开发的b2b电商平台cms系统,前后端分离  
客户端：[vue](https://github.com/crab1127/cms-client)

**主要功能：**  
1. 用户登录、注册
2. b2b行业类目管理
3. 产品增删改查，支持指定页面投放
4. 专业镇，专业市场添加及管理
5. 模板管理及修改


##开发

###环境准备

```
node.js 4.0+
mognodb 3.0+
redis 2.8+
```

```
 git clone https://github.com/crab1127/cms-service.git
 cd cms-service
 npm install 
 npm run start
 在浏览器中自动打开 http://localhost:3000
```


##目录结构

```
    .  
    |- README.md  
    |- controllers       //控制器， c层  
    |- models            //数据模型， m层  
    |- views             //视图      
    |- routes            //路由  
    |- middlewares       //中间件  
    |- util              //工具函数
    |- data              //爬虫，项目爬初始数据 
    |- logs              //日志  
    |- bin               //命令  
    |- app.js            //入口  
    |- config.js         //项目配置文件 
    |- History.md        //项目历史纪录  
    |- package.json      //项目说明  
```


##线上部署

```
    npm run pm2-start
```


##项目截图
![1](https://github.com/crab1127/cms-client/raw/master/src/image/1.png)
![2](https://github.com/crab1127/cms-client/raw/master/src/image/2.png)
![3](https://github.com/crab1127/cms-client/raw/master/src/image/3.png)
![4](https://github.com/crab1127/cms-client/raw/master/src/image/4.png)
![5](https://github.com/crab1127/cms-client/raw/master/src/image/5.png)
![6](https://github.com/crab1127/cms-client/raw/master/src/image/6.png)
![7](https://github.com/crab1127/cms-client/raw/master/src/image/7.png)
![8](https://github.com/crab1127/cms-client/raw/master/src/image/8.png)