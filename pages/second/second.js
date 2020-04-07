// pages/second/second.js
var app = getApp();

//console.log(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: app.globalData.name,
    userInfo:{},

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getSetting({
        success (res){
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log(res.userInfo)
                
                  
                
                
              },
              
            })
          }
        }
      })
    
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      
    });
    console.log(userInfo);
  },
  change() {
    this.setData({
      name: '大大大',
    });
  },

  onJump() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  onUpload(){
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:["album","camera"],
      success: (res) => {
        
        app.globalData.uploadData = res;
        wx.navigateTo({
          url: '/pages/detile/detile',
        })
      },
    })
  },
  onGotUserInfo: function (e) {
    //console.log(e.detail.errMsg)
    //console.log(e.detail.userInfo)
    //console.log(e.detail.rawData)
    this.setData({
      userInfo:e.detail.userInfo,
    })
    console.log(userInfo)
  },


})