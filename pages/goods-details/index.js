// pages/goods-details/index.js
Page({

  data: {
    autoplay:true,
    interval:3000,
    duration:1000,
    goodsDetails:{},
    swiperCurrent:0,
  },
  swiperchange:function(e)
  {
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  onLoad: function (options) {
    var that=this 
    wx.setStorageSync('postId', options._id)
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/posts/' + options._id,
      //url: 'http://202.182.124.93/api/v1/posts/'+options._id,
     // url: 'http://localhost:3002/api/v1/posts/' + options._id,
      method:'GET',
      header:{
        auth:wx.getStorageSync('auth')
      },
      success:function(res)
      {
        var goodsDetails=res.data
        that.setData({
          goodsDetails:goodsDetails,
          count:goodsDetails.favoriteCount, //previous state
          liked:goodsDetails.favorite
        })
        console.log('check wechat_id---',that.data.goodsDetails)
      }
    })
  },

  share: function () {
   wx.showShareMenu({
  withShareTicket: true
})
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.goodsDetails.title + " by " + that.data.goodsDetails.writer,
      path: "/pages/goods-details/index?_id=" + that.data.goodsDetails._id,
      success: function (res) {
        // 转发成功
        console.log('sukses！')
        console.log("book id gue----", that.data.goodsDetails._id)
      },
      fail: function (res) {
        // 转发失败
      } 
      }
  },



  // onShareAppMessage: function () {
  //   let that = this;
  //   return {
  //     title: that.data.poem.title,
  //     path: '/pages/poem/detail/index?id=' + that.data.poem.id,
  //     // imageUrl:'/images/poem.png',
  //     success: function (res) {
  //       // 转发成功
  //       console.log('转发成功！')
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }




  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.goodsDetails.pics // 需要预览的图片http链接列表  
    })
  },

  addWechat:function()
  {
    var that=this
    if( that.data.goodsDetails.user.qrcode.length===0)
    {
      var auth_check=wx.getStorageSync('auth')
      if(that.data.goodsDetails.user._id!==auth_check)
      {
        wx.showModal({
          title:'Info',
          content:'Please bind your wechat qrcode',
          showCancel:true,
          cancelText:'Nope',
          cancelColor:'green',
          confirmText:'Ok',
          success:function(res)
          {
            if(res.confirm)
            {
              wx.navigateTo({
                url:'/pages/qrcode/index?id=1'
              })
            }
          }
        })
      }
      else{
wx.showModal({
        title:'Info',
        content:'The owner of this post has not yet set the wechat qrcode,Please try again later',
        showCancel:false,
        confirmText:'Ok',
        success:function(res)
        {
          if(res.confirm)
          {
            wx.navigateBack()
          }
        }
      })
      }
      
    }
    else{
      var datlength = that.data.goodsDetails.user.qrcode.length
      console.log(datlength)
      var dl = datlength-1
      console.log(dl)
      var qrcodeUrl=that.data.goodsDetails.user.qrcode[dl].path
     var wechat_id=that.data.goodsDetails.user.qrcode[dl].wechat_id
      wx.navigateTo({
        url:'/pages/qrcode-image/index?qrcodeUrl='+qrcodeUrl+'&wechat_id='+wechat_id
      })
    }
    
  },

  onReady: function () {
  
  },
  toHome:function(e)
  {
    wx.naviageTo({
      url:'/pages/index/index'
    })
  },

  makecall: function () {
    var that = this
    var datlength = that.data.goodsDetails.user.qrcode.length
    console.log(datlength)
    var dl = datlength - 1
    console.log(dl)
    var phone_num = that.data.goodsDetails.user.qrcode[dl].phone_num
    console.log("my number--", phone_num)
    wx.makePhoneCall({
      phoneNumber: phone_num //仅为示例，并非真实的电话号码
    })
  },


  favoritePost:function()
  {
    var that=this 
    console.log(that.data.liked)
    var postId=wx.getStorageSync('postId')
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/posts/' + postId + '/favoritePost',
     // url:'http://202.182.124.93/api/v1/posts/'+postId+'/favoritePost',
    //  url: 'http://localhost:3002/api/v1/posts/' + postId + '/favoritePost',
      method:'POST',
      header:{
        auth:wx.getStorageSync('auth')
      },
      success:function(res)
      {
        if(res.data.code===0)
        {
          wx.request({
            url: 'https://api.pickabook.xyz/api/v1/posts/' + postId,
          //  url:'http://202.182.124.93/api/v1/posts/'+postId,
          //  url: 'http://localhost:3002/api/v1/posts/' + postId,
            method:'GET',
            header:{
              auth:wx.getStorageSync('auth')
            },
            success:function(res)
            {
              that.setData({
                count:res.data.favoriteCount, //current state
                liked:res.data.favorite
              })
            }
          })
        }
      }
    
    })
  }



  
})