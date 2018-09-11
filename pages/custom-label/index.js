// pages/custom-label/index.js
const qiniuUploader = require("../../utils/qiniuUploader-min.js");
var app = getApp();
Page({
  data: {
    picUrls: [],
    actionText: "Cam/Alb",
    btnBgc: "",
    imgkey: "",
    qiniu: "",
    libName: ""
  },
  bindInput: function (e) {
    var libName = e.detail.value;

    this.setData({
      libName: libName
    });
    console.log("libName--", this.data.libName);
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "Customize Label"
    });
    var that = this;
    wx.showNavigationBarLoading();
    //get the upload token for qiniu
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/uptoken',
     //   url: "http://202.182.124.93/api/v1/uptoken",
     // url: "http://localhost:3002/api/v1/uptoken",

      method: "GET",
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            qiniu: res.data.token
          });
        }
        return;
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  },
  bindCamera: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        let tfps = res.tempFilePaths;
        let _picUrls = that.data.picUrls;
        for (let item of tfps) {
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
          //upload to qiniu
          console.log("whats in picUrls==", that.data.picUrls);
          for (var i = 0; i < that.data.picUrls.length; i++) {
            var e = that.data.picUrls[i];
            qiniuUploader.upload(
              e,
              res => {
                that.setData({
                  imgkey: res.imageURL
                });
              },
              error => {
                console.log("error: " + error);
              },
              {
                region: "ECN",
                domain: "http://P763o9a7j.bkt.clouddn.com", // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                key: new Date().getTime() + ".jpg", // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                uptoken: that.data.qiniu, // 由其他程序生成七牛 uptoken
                uptokenURL:'https://api.pickabook.xyz/api/v1/uptoken',
              //  uptokenURL: "http://localhost:3002/api/v1/uptoken",
               //  uptokenURL: "http://202.182.124.93/api/v1/uptoken", // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                uptokenFunc: function () {
                  return "[yourTokenString]";
                }
              }
            );
          }
        }
        var tempFilePath = res.tempFilePaths[0];
        if (that.data.picUrls.length === 0) {
          that.setData({
            btnBgc: ""
          });
        } else {
          that.setData({
            btnBgc: "#42b3f4"
          });
        }
      }
    });
  },

  delPic: function (e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    });
  },

  formSubmit: function (e) {
    var that = this;

    console.log("my library name--", that.data.libName);
    wx.showNavigationBarLoading();
    if (that.data.imgkey === "") {
      wx.showModal({
        title: "Warning",
        content: "Banner image is required",
        showCancel: false,
        confirmText: "OK"
      });
      return;
    }
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/label',
     // url: "http://202.182.124.93/api/v1/label",
     // url: "http://localhost:3002/api/v1/label",
      method: "POST",
      header: {
        auth: wx.getStorageSync("auth")
      },
      data: {
        path: that.data.imgkey,
        libName: that.data.libName
      },
      success: function (res) {
        if (res.data.code === 0) {
          console.log(res.data.data);

          //upload to server was successful
          wx.showToast({
            title: "Uploading..",
            icon: "loading",
            duration: 1500
          });
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/library/library'
            });
          }, 1500);
        }
      },



      fail: function () {
        wx.hideNavigationBarLoading()
        wx.showModal({
          title: "Error",
          content: "Could not upload banner,Please try again",
          confirmText: "Ok",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/custom-label/index"
              });
            }
          }
        });
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        that.setData({
          picUrls: [],
          imgkey: ""
        });
      }
    });
  }
});
