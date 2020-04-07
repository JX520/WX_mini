// pages/detile/detile.js
var app = getApp();
var cfg = {
  photo: {},
  template: {},
  canvasWrapper: {},
  scale: 1,
};
var SCALE = {
  MIN: 0.1,
  MAX: 2,
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNewScene: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    templates: [{
        cover: '/pages/img/img1.jpg',
      },
      {
        cover: '/pages/img/img.jpg',
      },
      {
        cover: '/pages/img/img2.jpg',
      },
      {
        cover: '/pages/img/img3.jpg',
      },
      {
        cover: '/pages/img/img4.jpg',
      },
      {
        cover: '/pages/img/img5.jpg',
      },
      {
        cover: '/pages/img/img6.jpg',
      },
      {
        cover: '/pages/img/img7.jpg',
      },
      {
        cover: '/pages/img/img8.jpg',
      },
      {
        cover: '/pages/img/img9.jpg',
      },
      {
        cover: '/pages/img/img10.jpg',
      },
      {
        cover: '/pages/img/img11.jpg',
      },
      {
        cover: '/pages/img/img12.jpg',
      },
      {
        cover: '/pages/img/img13.jpg',
      },
      {
        cover: '/pages/img/img14.jpg',
      },
      {
        cover: '/pages/img/img15.jpg',
      },
    ],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置画布的大小
    this.setCanvasSize();
  },

  setCanvasSize: function () {
    var uploadData = app.globalData.uploadData;
    //console.log(JSON.stringify(uploadData) );
    var that = this;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg",
    //     "size": 55905
    //   }]
    // };

    // 先要知道容器的高度和宽度
    wx.createSelectorQuery().select("#detile-edit").boundingClientRect(function (canvasWrapper) {
      //console.log(canvasWrapper);
      cfg.canvasWrapper = canvasWrapper;

      // 要知道图片原始高度和宽度
      wx.getImageInfo({
        src: uploadData.tempFilePaths[0],
        success(res) {
          //console.log(res);
          cfg.photo.path = res.path;

          var originalHeight = cfg.photo.originalHeight = res.height;
          var originalWidth = cfg.photo.originalWidth = res.width;

          // 画布的高度、宽度
          if (originalHeight / originalWidth > (canvasWrapper.height / canvasWrapper.width)) {
            cfg.canvasHeight = canvasWrapper.height;
            cfg.canvasWidth = originalWidth * cfg.canvasHeight / originalHeight;
          } else {
            cfg.canvasWidth = canvasWrapper.width;
            cfg.canvasHeight = originalHeight * cfg.canvasWidth / originalWidth;
          }

          that.setData({
            canvasWidth: cfg.canvasWidth,
            canvasHeight: cfg.canvasHeight
          });

          that.drawNewScene(that.data.currentNewScene);
        }
      })
    }).exec();
  },

  drawNewScene: function (index) {
    var uploadData = app.globalData.uploadData;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg",
    //     "size": 55905
    //   }]
    // };

    var templates = this.data.templates;
    var ctx = wx.createCanvasContext("detile");

    //console.log(templates[index]);

    wx.getImageInfo({
      src: templates[index].cover,
      success(res) {
        var width = cfg.template.originalWidth = res.width;
        var height = cfg.template.originalHeight = res.height;
        cfg.template.x = 50;
        cfg.template.y = 150;
        cfg.template.cover = templates[index].cover;
        ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
        ctx.drawImage(cfg.template.cover, 50, 150, 80, 80 * height / width);
        ctx.draw();
      }
    })

  },

  onTapScene: function (event) {
    var index = event.currentTarget.dataset.index;

    this.setData({
      currentNewScene: index
    });

    this.drawNewScene(index);
  },

  //移动前准备
  startMove(event) {
    //初始图片位移（x，y）
    var touchPoint = event.touches[0];
    var x = cfg.template.x;
    var y = cfg.template.y;
    cfg.offsetX = touchPoint.clientX - x;
    cfg.offsetY = touchPoint.clientY - y;
  },
  //缩放前准备
  startZoom(event) {
    var xMove = event.touches[1].clientX - event.touches[0].clientX;
    var yMove = event.touches[1].clientY - event.touches[0].clientY;
    //勾股定理算出初始两指间距
    cfg.initialDistance = Math.sqrt(xMove * xMove + yMove * yMove);
  },
  onTouchStart(event) {
    //判断移动还是缩放
    if (event.touches.length > 1) {
      //开始缩放
      this.startZoom(event);
    } else {
      //开始移动
      this.startMove(event);
    }
  },

  //移动中
  move(event) {
    //移动图片新位移（x，y）
    console.log(event);
    var touchPoint = event.touches[0];
    var x = touchPoint.clientX - cfg.offsetX;
    var y = touchPoint.clientY - cfg.offsetY;

    //算出新位移后画新图
    var uploadData = app.globalData.uploadData;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg",
    //     "size": 55905
    //   }]
    // };
    var ctx = wx.createCanvasContext("detile");
   
    cfg.template.x = x;
    cfg.template.y = y;
    var newWidth = 100 * cfg.scale;
    var newHeight = newWidth * cfg.template.originalHeight / cfg.template.originalWidth;
    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.drawImage(cfg.template.cover, x, y, newWidth, newHeight);
    ctx.draw();

  },
  //缩放中
  zoom(event) {
    var xMove = event.touches[1].clientX - event.touches[0].clientX;
    var yMove = event.touches[1].clientY - event.touches[0].clientY;
    //勾股定理算出缩放后两指间距
    cfg.curDistance = Math.sqrt(xMove * xMove + yMove * yMove);
    cfg.scale = cfg.scale + 0.001 * (cfg.curDistance - cfg.initialDistance);
    cfg.scale = Math.min(cfg.scale, SCALE.MAX);
    cfg.scale = Math.max(cfg.scale, SCALE.MIN);

    //开始画新缩放图
    var uploadData = app.globalData.uploadData;
    // var uploadData = {
    //   "errMsg": "chooseImage:ok",
    //   "tempFilePaths": ["http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg"],
    //   "tempFiles": [{
    //     "path": "http://tmp/wx2cc7e47c681d1101.o6zAJs6edam7HSVVc8-cjlyPakBo.51A0RLzg03hb54b4197bb28cd8bba68debe5f09ff367.jpg",
    //     "size": 55905
    //   }]
    // };
    var ctx = wx.createCanvasContext("detile");
    var template = cfg.template;
    var newWidth = 100 * cfg.scale;
    var newHeight = newWidth * template.originalHeight / template.originalWidth;
    ctx.drawImage(uploadData.tempFilePaths[0], 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.drawImage(template.cover, template.x, template.y, newWidth,newHeight);
    ctx.draw();
  },
  onTouchMove(event) {
    //判断移动还是缩放
    if (event.touches.length > 1) {
      //缩放中
      this.zoom(event);
    } else {
      //离上次结束小于600ms，不处理，解决缩放bug
      if(new Date().getTime() - cfg.ednTime < 600){
        return;
      }
      //移动中
      this.move(event);


    };
  },

  onTouchEnd(){
    const date = new Date();
    cfg.ednTime = date.getTime();
    
    
     
    
  },

  downloadPic(){
    var canvasWidth = cfg.canvasWidth;
    var canvasHeight = cfg.canvasHeight;
    wx.canvasToTempFilePath({
     width:canvasWidth,
     height:canvasHeight,
     destWidth:canvasWidth *2,
     destHeight:canvasHeight *2,
     canvasId:'detile',
     success(res){
       wx.saveImageToPhotosAlbum({
         filePath: res.tempFilePath,
         success(res){
          wx.showToast({
            title: '保存成功！',
          });
         }
       });
     }
    });
  },
});