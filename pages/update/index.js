
const qiniuUploader = require('../../utils/qiniuUploader-min.js');

var app = getApp()
Page({
  data: {
    files: [],
    title: '',
    writer: '',
    isbn: '',
    description: '',
    //    price: 0, 
    categoryIndex: null,
    switchChecked: null,

    //    tags: [], 
    tempFile: '',
    imgkey: [],
    qiniu: '',
    btnBgc: "",
    loading: false,
    imgWidth: 525,
    imgHeight: 350,
    actionText: "Cam/Alb",
    goodsDetails: {},
    clicked: false,
    clicked2: false
  },
  //try to write own qiniu uploader 
  uploadImg: function (path) {
    var that = this
    wx.showNavigationBarLoading()
    wx.uploadFile({
      //url:'https://up-z2.qbox.me',
      url: 'https://up.qbox.me',

      // url: 'https://P763o9a7j.bkt.clouddn.com',
      header: {
        'content-Type': 'multipart/form-data'
      },
      filePath: path,
      name: 'file',
      formData: {
        token: that.data.qiniu
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log('own uploader--res data--', data)
        if (data.key && that.data.imgkey.indexOf('http://P763o9a7j.bkt.clouddn.com/' + data.key) == -1) {
          that.setData({
            imgkey: that.data.imgkey.concat('http://P763o9a7j.bkt.clouddn.com/' + data.key)
          })

        }
        console.log(that.data.imgkey)

      }
    })
  },
  errorModal: function (content) {
    wx.showModal({
      title: 'Warning',
      content: content,
      showCancel: false,
      confirmText: 'Ok'
    })
  },
  onReady: function (options) {
    var that = this
    wx.showNavigationBarLoading()
    //get the upload token for qiniu
    wx.request({
       url: 'https://api.pickabook.xyz/api/v1/uptoken',
      // url:'http://202.182.124.93/api/v1/uptoken',
    //  url: 'http://localhost:3002/api/v1/uptoken',
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            qiniu: res.data.token
          })
        }
        return;
      },
      complete: function () {
        wx.hideNavigationBarLoading()
      }
    })

    var that = this
    //TODO: use wx.request!!!!!!!!!
    var dummy = ["Novel", "Education & Knowledge", "Computer & Technology", "Hobbies & Skills", "Language", "Others"]
    that.setData({
      arrayCategories: dummy
    })
  },

  onLoad: function (options) {
    var that = this
    wx.setStorageSync('postId', options._id)

    wx.request({
       url: 'https://api.pickabook.xyz/api/v1/posts/' + options._id,
      // url: 'http://202.182.124.93/api/v1/posts/'+options._id,
   //   url: 'http://localhost:3002/api/v1/posts/' + options._id,
      method: 'GET',
      header: {
        auth: wx.getStorageSync('auth')
      },
      success: function (res) {
        var goodsDetails = res.data
        var bufferedPost = wx.getStorageSync('post')
        that.setData({
          bufferedPost: bufferedPost,
          goodsDetails: goodsDetails,
          count: goodsDetails.favoriteCount, //previous state
          liked: goodsDetails.favorite,
        })
        console.log('check wechat_id---', that.data.goodsDetails)
      }
    })
  },

  bindPickerChange: function (e) {

    var categoryIndex = e.detail.value
    var click = this.data.arrayCategories[categoryIndex]

    console.log("ini apa---", click)
    //store the current index
    this.setData({
      categoryIndex: categoryIndex,
      clicked: true
    })

    console.log('have they clicked?: ', this.data.clicked)
    console.log("yang kamu pilih--", this.data.categoryIndex)
  },

  bindswitch: function (e) {
    var switchChecked = e.detail.value
    console.log("nilainya---", switchChecked)

    this.setData({
      switchChecked: switchChecked,
      clicked2: false
    })
    console.log('have they clicked?: ', this.data.clicked)
    console.log("yang kamu pilih--", this.data.switchChecked)



  },

  bindCamera: function (e) {
    var that = this;
    if (that.data.files.length === 0) {
      that.setData({
        btnBgc: ""
      })
    }
    else {
      that.setData({
        btnBgc: "#42b3f4"
      })
    }
    wx.showModal({
      title: 'Info',
      content: 'You can upload from album or take live pictures',
      confirmText: 'Ok',
      cancelText: 'Back',
      showCancel: true,
      cancelColor: 'black',
      confirmColor: 'Red',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 4,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              let tfps = res.tempFilePaths
              // let _files=that.data.files
              let _files = that.data.files
              // for(let tfp of tfps)
              // {
              //   _files.concat(tfp)
              //   console.log('_files--',_files)
              //   that.setData({
              //     files:_files,
              //     actionText:'+'
              //   })
              // }
              _files = _files.concat(tfps)
              console.log('__files--', _files)
              that.setData({
                files: _files,
                actionText: "+"
              })
              console.log('after- _files--', _files)
              // that.setData({
              //   files: that.data.files.concat(res.tempFilePaths),
              //   tempFile: res.tempFilePaths.join(''),
              //    actionText:'+'
              // });

              //resize images before uploading
              for (var i = 0; i < that.data.files.length; i++) {
                var img = that.data.files[i]
                wx.getImageInfo({
                  src: img,
                  success: function (res) {
                    res.width = 800
                    res.height = 320
                  }
                })
              }
              //fix


              //uplaod code was here
              for (var i = 0; i < that.data.files.length; i++) {
                var e = that.data.files[i]
                // that.uploadImg(e)

                qiniuUploader.upload(e, (res) => {
                  that.setData({
                    imgkey: that.data.imgkey.concat(res.imageURL),
                  });

                }, (error) => {
                  console.log('error--upload: ', error);
                  //upload bug

                }, {
                    region: 'ECN',
                    domain: 'http://P763o9a7j.bkt.clouddn.com',
                    //domain: 'http://connectimage.duohuo.org', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                    key: new Date().getTime() + '.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                    // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                    uptoken: that.data.qiniu, // 由其他程序生成七牛 uptoken

                      uptokenURL: 'https://api.pickabook.xyz/api/v1/uptoken',
                   // uptokenURL: 'http://localhost:3002/api/v1/uptoken',
                    //  uptokenURL: 'http://202.182.124.93/api/v1/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                    uptokenFunc: function () { return '[yourTokenString]'; }
                  });

              }

            },
            // complete:function()
            // {
            //   that.setData({
            //     imgKey:[],
            //     files:[],
            //     actionText:"Cam/Alb"
            //   })
            // }
          })
        }
      }
    })

  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
      //urls:bufferedPost.pics
    })

  },
  delPic: function (e) {
    let index = e.currentTarget.id;
    let files = this.data.files;
    files.splice(index, 1);
    this.setData({
      files: files
    })
  },
  uploadQiniu: function () {
    var that = this
    for (var i = 0; i < that.data.files.length; i++) {
      var e = that.data.files[i]
      // that.uploadImg(e)

      qiniuUploader.upload(e, (res) => {
        that.setData({
          imgkey: that.data.imgkey.concat(res.imageURL),
        });

      }, (error) => {
        console.log('error--upload: ', error);
        //upload bug

      }, {
          region: 'SCN',
          domain: 'http://P763o9a7j.bkt.clouddn.com',
          //domain: 'http://connectimage.duohuo.org', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
          key: new Date().getTime() + '.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
          // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
          uptoken: that.data.qiniu, // 由其他程序生成七牛 uptoken
          uptokenURL: 'https://api.pickabook.xyz/api/v1/uptoken',
       //   uptokenURL: 'http://localhost:3002/api/v1/uptoken',
          // uptokenURL: 'http://202.182.124.93/api/v1/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
          uptokenFunc: function () { return '[yourTokenString]'; }
        });

    }
  },


  submitF: function (e) {
    wx.showNavigationBarLoading()
    var that = this
    var postId = e.detail.value.idpost

    //wx.setStorageSync('postId', e._id)

    console.log('check post_id---', that.data.goodsDetails.id)

    var title = e.detail.value.inputTitle
    var writer = e.detail.value.inputWriter
    var isbn = e.detail.value.inputISBN
    var description = e.detail.value.inputDescription
    // var price = e.detail.value.inputPrice
    // var tags=e.detail.value.tagsInput

    that.setData({
      title: title,
      writer: writer,
      isbn: isbn,
      description: description,
      categoryIndex: this.data.categoryIndex,
      switchChecked: this.data.switchChecked

    })

    if (title == "") {
      this.errorModal('Please enter the title')
      return
    }
    if (writer == "") {
      this.errorModal('Please enter writer name')
      return
    }
    // if (!price.match(/^\d{0,8}(\.\d{1,4})?$/)) {
    //   this.errorModal('Please enter valid price')
    //   return
    // }
    if (that.data.categoryIndex === null) {
      this.errorModal('Please choose the category')
      return
    }
    if (that.data.imgkey.length == 0) {
      this.errorModal('Images are required')
      return
    }



    wx.request({
       url: 'https://api.pickabook.xyz/api/v1/posts/' + postId,
      //url: 'http://202.182.124.93/api/v1/posts/' + postId,
    //  url: 'http://localhost:3002/api/v1/posts/' + postId,
      method: 'PATCH',
      data: {
        pics: that.data.imgkey,
        title: title,
        writer: writer,
        isbn: isbn,
        description: description,
        categoryIndex: that.data.categoryIndex,
        switchChecked: that.data.switchChecked

        //  tags:tags,
      },
      header: {
        'content-type': 'application/json',
        auth: wx.getStorageSync('auth')
      },

      success: function (res) {
        if (res.data.code === 0) {
          //upload to server was successful
          wx.setStorageSync('post', res.data.data)

          wx.showToast({
            title: 'Updating..',
            icon: 'loading',
            duration: 1000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 1500)
        }
      },
      fail: function () {
        wx.showModal({
          title: 'Error',
          content: 'Could not update your post,Please try again',
          confirmText: 'Ok',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/upload/index'
              }) //end of navigateTo
            }
          }
        })
      },
      complete: function () {
        that.setData({
          files: [],
          categoryIndex: '',
          switchChecked: '',
          title: '',
          writer: '',
          isbn: '',
          description: '',
          // price:0,
          //  tags:[],
          imgkey: []
        })


        wx.hideNavigationBarLoading()
      }
    })

  }

});

