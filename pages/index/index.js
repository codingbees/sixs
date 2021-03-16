let app = getApp();

Page({
    data:{
        corpId: '',
        authCode:'',
        userId:'',
        userName:'',
        avatar:'',
        hideList: true,
        list5: [
            {
              // "icon": "http://192.168.18.126:18080/icons/generalp.png",
              "icon": "./img/generalp.png",
              "text": "KPI"
            },
            {
              "icon": "./img/asdb.png",
              "text": "待整改"
            },
            {
              "icon": "./img/ap.png",
              "text": "匿名检举"
            },
            {
              "icon": "./img/auditp2.png",
              "text": "精益审核"
            },
            {
              "icon": "./img/excellentb.png",
              "text": "白手套工程"
            },
            {
              "icon": "./img/scoresb.png",
              "text": "积分兑换"
            },
          ],
    },
    onItemClick: function(ev) {
      //console.log(ev);
      if(ev.detail.index==0){
        dd.navigateTo({
          url: '/pages/kpi/kpi'
              })
      }else if(ev.detail.index==1){
        dd.navigateTo({
          url: '/pages/handle/handle'
        })
      }else if(ev.detail.index==2){
       dd.navigateTo({
          url: '/pages/impeach/impeach'
        })
      }else if(ev.detail.index==3){
       dd.navigateTo({
          url: '/pages/doubleAudit/doubleAudit'
        })
      }else if(ev.detail.index == 4){
        dd.navigateTo({
          url: '/pages/excellent/excellent'
        })
      }else if(ev.detail.index == 5){
        dd.navigateTo({
          url: '/pages/scores/scores'
        })
      }
    },
    onLoad(){
        this.setData({
            corpId: app.globalData.corpId
        });
        
        dd.showLoading({
          content: '登录中...'
        });
        dd.getAuthCode({
            success:(res)=>{
              console.log("res from getAuthCode is:")
              console.log(res);
                this.setData({
                    authCode:res.authCode
                })
                dd.httpRequest({
                    url: app.globalData.serverUrl+'/login',
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                      console.log('indexjs  httpsuccess----',res)
                      dd.setStorage({
                        key:'userInfo',
                        data:JSON.parse(res.data.result.userinfo)
                      })
                    },
                    fail: (res) => {
                      dd.alert({ content: '钉钉登录失败，请检查网络或将钉钉升级到最新版',buttonText: '我知道了' })
                      console.log('httpfailed----',res)
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                    
                });
            },
            
            fail: (err)=>{
                console.log(err)
                dd.alert('获取用户信息失败，请检查您的网络或将钉钉升级到最新版本')
            }
        })
        
        
    }
})