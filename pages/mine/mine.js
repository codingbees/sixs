let app = getApp()

Page({
  data: {
    username:'',
    position:'',
    departments:'',
    myScores:[],
    myExchangeList:[],
    expand3rd:false,
    showMyMessage: false,
    showMyExchange: false,
    myImpeachList:[],
    imgSrc:app.globalData.imgSrc
  },
  onLoad(){
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        this.setData({username : res.data.name})
        this.setData({position : res.data.position})
        this.setData({departments : res.data.departments})
      dd.httpRequest({
        url: app.globalData.serverUrl + '/sixs/getMyMessage',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        dataType: 'json',
        data:{userid: res.data.jobnumber},
        success: res => {
          console.log("res getMyMessage")
          console.log(res)
          let newl = res.data.myImpeachList.map(item=>{
            return {
              ...item,date:item.date_time.split(" ")[0]
            }
          })
          this.setData({ myScores: res.data });
          this.setData({ myExchangeList : res.data.myExchangeList})
          this.setData({ myImpeachList : newl})
        },
        fail: function (res) {
          dd.alert({ content: 'check/getCheckList发起失败，未知原因，请联系管理员' });
          }
        });
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
  },
  preview(e){
    my.previewImage({
      current: 2,
      urls: [
        app.globalData.imgSrc+e.currentTarget.dataset.img
      ],
    });
  },
  sendMSG(){
    dd.httpRequest({
      url:app.globalData.serverUrl+"/sixs/sendMessage",
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method:'POST',
      dataType:'json',
      success:res=>{
        console.log('sendmessage')
        console.log(res)
      },
      fail:res=>{
        console.log(res)
      }
    })
  }
});
