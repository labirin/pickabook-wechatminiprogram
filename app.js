//app.js
App({
  onLaunch: function () {
this.getUserInfo()
  },
  getUserInfo:function(cb){
    var that = this
      //调用登录接口
      wx.login({

       success: res => {
          console.log('the code is ', res.code)
          this.globalData.code = res.code
          wx.request({
            url:'https://api.pickabook.xyz/api/v1/users/auth',
           // url:'http://202.182.124.93/api/v1/users/auth',
            // url: 'http://localhost:3002/api/v1/users/auth',
            
            method:'POST',
            data:{
              code: this.globalData.code
            },
            success:function(res){
            //  that.globalData.token=res.data.token
              wx.setStorage({
                key: 'token',
                data: res.data.token,
                success: function(res){
                  console.log('successfully stored token')
                  wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo
        typeof cb == "function" && cb(that.globalData.userInfo)
      }
    })
      var token=wx.getStorageSync('token')
      console.log('login token new---',token)
    
    wx.request({
      url: 'https://api.pickabook.xyz/api/v1/users/login',
     // url:'http://202.182.124.93/api/v1/users/login',
     // url: 'http://localhost:3002/api/v1/users/login',
      
      method:'POST',
      header:{
        'content-Type':'application/json'
      },
      data:{
        wechat:{
          openid:token
        }
      },
      success:function(res)
      {
        console.log(res.data)
        var mytoken = res.data.token
        if(res.data.code===0)
        {
          wx.setStorage({
            key: 'auth',
            data: res.data.token,
            success: function(res){
              // success
              console.log('auth stored')
            },
            fail: function() {
              // fail
              console.log('could not retrive auth')
            },
            complete: function() {
              // complete
            }
          })
        }
      }
    })

                },
                fail: function() {
                  console.log('could not store the token')
                },
                complete: function() {
                  // complete
                }
              })
              console.log('token in storage---',wx.getStorageSync('token'))
              
             // that.login_in()
              return
              
            }
          })
        
        }
      })
    
  },
  login_in:function(){
    var that=this 
    console.log('login called')
    var token=wx.getStorageSync('token')
    console.log('token in login---',token)
    console.log('token sending for login ',token)
    
  },
  
  globalData:{
    userInfo: null,
    version: '1.0', //app version 
    mytoken:{}
  },
  //my utils 
  showLoadToast:function(title,duration){
    wx.showToast({
      title: title || 'Loading...',
      icon:'loading',
      mask:true,
      duration:duration || 10000
    })
  }
})
