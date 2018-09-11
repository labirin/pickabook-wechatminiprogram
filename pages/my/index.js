// pages/my/index.js
var app=getApp()
Page({
  data: {
  userInfo:{},
  navs:[
   // {icon:'../../images/sold.png',name:'Sold',typeId:0},
    { icon: '../../images/favorites.png', name: 'Starred', typeId: 1 }
    
  ],
  items:[
    {
      icon: '../../images/me-qrcode.png',
      text: 'Set QR-Code & Phone Number',
      path: '/pages/qrcode/index'
    },
    {
      icon: '../../images/me-label.png',
      text: 'Customize Label',
      path: '/pages/custom-label/index'
    },
    {
      icon: '../../images/me-preview.png',
      text: 'Preview Library',
      path: '/pages/bookshelf/bookshelf'
    },
    {
      icon: '../../images/me-feedback.png',
      text: 'Feedback',
      path: '/pages/suggestions/index'
    },
     {
      icon:'../../images/me-about.png',
      text:'About Us',
      path:'/pages/about/index'
    },
    //  {
    //    icon: '../../images/qr-code.png',
    //    text: 'MYQR',
    //    path: '/pages/qrcode-image/index'
    //  },
    
   
  
  ]
  },

   onLoad: function() {
    var that = this
    app.getUserInfo( function( userInfo ) {
      that.setData( {
        userInfo: userInfo,
        
      }),console.log(userInfo)
      
      
    })
  },
  //handler for the `sold` and `starred` 
  catchTapCategory:function(e)
  {
    //get the dataset and store it globally
    var data= e.currentTarget.dataset 
    app.globalData.currentCateType={typeName:data.type,typeId:data.typeid}
    wx.navigateTo({
      url:'/pages/category/index?app.globalData.currentCateType='
    })

  },

  onReady: function () {
  wx.setNavigationBarTitle({
    title: 'My Profile',
  })
  },
  navigateTo:function(e){
    var path=e.currentTarget.dataset.path 
    wx.navigateTo({
      url:path
    })
  }
})