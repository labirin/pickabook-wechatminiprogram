// pages/bookshelf/bookshelf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false, // loading
    userInfo: {},
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    loadingMoreHidden: true,
    user: {},
    label: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userid = wx.getStorageSync('auth')
    console.log(userid)
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/users/' + userid,
      // url: 'http://202.182.124.93/api/v1/' + userid,
     // url: 'http://localhost:3002/api/v1/users/' + userid,
      header: {
        auth: wx.getStorageSync('auth')
      },
      success: function (res) {
        var user = res.data;
        var label = user.data.label
        var labelength = label.length
        var ll = labelength - 1
        var mylibName = label[ll].libName
        var mylibPict = label[ll].path
        that.setData({
          user: user,
          label: label,
          mylibName: mylibName,
          mylibPict: mylibPict,
          loadingMoreHidden: true
        }); console.log("my user--", user)

        console.log('label guaa dong baru', label)
        console.log('libName:', mylibName)
        console.log('libName:', mylibPict)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'Shared Library',
    })
  },
  bindViewTapAdd: function () {
    wx.navigateTo({
      url: '../addbook/addbook'
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?_id=" + e.currentTarget.dataset.id
    })
  },
  share: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // toDetailsTap: function (e) {
  //   wx.navigateTo({
  //     url: "/pages/goods-details/index?_id=" + e.currentTarget.dataset.id
  //   })
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/posts',
     // url: 'http://202.182.124.93/api/v1/posts',
     // url: 'http://localhost:3002/api/v1/posts',
      header: {
        auth: wx.getStorageSync('auth')
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }

        for (var i = 0; i < res.data.data.length; i++) {
          console.log('data-->', res.data.data[i])
          if (res.data.data[i].user._id === wx.getStorageSync('auth')) {
            goods.push(res.data.data[i]);
          }

        }
        that.setData({
          goods: goods,
        });
      }
    })
    //get the current users post
    var post = wx.getStorageSync('post')
    //push to the top of  the current posts
    this.data.goods.push(post)
    that.setData({
      goods: that.data.goods
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  // get the current logged in user auth 
  // send to some endpoint 
  // myapi/userId 
    return {
      title: "Pick one from my bookshelf!",
    }
  },

  // delClick: function (e) {
  //    this.setData({
  //      activeCategoryId: e.currentTarget.id
  //    });
  //    this.delClickrun(this.data.activeCategoryId);
  //  },


})

