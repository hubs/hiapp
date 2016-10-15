HiApp
=====
此项目想在(HiApp)[https://github.com/BelinChung/HiApp]基础上实现实现聊天功能,感谢HiApp

后端通过(netty-socket)[https://github.com/mrniko/netty-socketio]搭建

## 界面
![](https://github.com/hubs/hiapp/blob/master/res/register.png)
![](https://github.com/hubs/hiapp/blob/master/res/login.png)
![](https://github.com/hubs/hiapp/blob/master/res/info.png)
![](https://github.com/hubs/hiapp/blob/master/res/info-content.png)
![](https://github.com/hubs/hiapp/blob/master/res/chat.png)
![](https://github.com/hubs/hiapp/blob/master/res/comment.png)
![](https://github.com/hubs/hiapp/blob/master/res/peoples.png)
![](https://github.com/hubs/hiapp/blob/master/res/people-content.png)
![](https://github.com/hubs/hiapp/blob/master/res/setting.png)
![](https://github.com/hubs/hiapp/blob/master/res/talk.png)
##Requirements

* cordova `^5.0.0`
* framework7 `^1.4.0`

## Dependencies

HiApp use `npm` to manage third-party packages now.

Then install all dependencies, in repo's root:

```
$ npm install
```

## PhoneGap App Guides

Install the cordova module using npm utility of Node.js.

```
$ npm install -g cordova
```

### Create App

Go to the directory where you maintain your source code, and run a command such as the following:

```
$ cordova create hiapp com.hiapp.hiapp HiApp
```


### Add Platforms

Before you can build the project, you need to specify a set of target platforms.

```
$ cordova platform add ios
```

### Add Plugins

You need to add plugins that provide access to core Cordova APIs.

```
$ cordova plugin add cordova-plugin-whitelist cordova-plugin-camera cordova-plugin-geolocation cordova-plugin-file-transfer cordova-plugin-inappbrowser cordova-plugin-network-information
```

### Build the App

Run the following command to iteratively build the project:

```
$ cordova build ios
```

### Test the App on an iOS Device with Xcode

Double-click to open the `platforms/ios/HiApp.xcodeproj` file

Press the `Run` button to deploy the application in the emulator

## Web App Preview

HiApp use webpack browser sync server to develop, Just run it in repo's root:

```
$ npm run dev
```

WebApp will be available on `http://localhost:3000/`

## Web App Release / PhoneGap App Release

```
$ npm run build
```

The result is available in `www/` folder.

## Demo

[http://hi.dearb.me/]

[![App Store](http://dearb.u.qiniudn.com/appstore-button.png)](https://itunes.apple.com/us/app/hi-liao-gao-xiao-shu-dong/id917320045?mt=8)

## License

Copyright (c) 2014-2016 Belin Chung. MIT Licensed, see [LICENSE] for details.

[http://hi.dearb.me/]: http://hi.dearb.me/
[LICENSE]:https://github.com/BelinChung/HiApp/blob/master/LICENSE.md