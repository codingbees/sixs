let app = getApp()

Page({
  data: {
    prize:[],
    modalOpened5:false,
    selectedItemNo: 0,
    buttons5: [
      { text: '取消' },
      { text: '确定', extClass: 'buttonBold' },
    ],
    selectScore:'',
    selectPrize:'',
    userid:'',
    username:'',
    totalScore:0,
    usedScore:0,
    imgSrc:app.globalData.imgSrc+'prize_pictures/'
  },
  onLoad() {
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        this.setData({userid : res.data.jobnumber});
        this.setData({username : res.data.name});
        dd.httpRequest({
          url: app.globalData.serverUrl+'/sixs/getPrizeList',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          dataType: 'json',
          data:{userid:res.data.jobnumber},
          success: (resp) => {
            console.log('getPrizeList')
            console.log(resp)
          this.setData({
            prize : resp.data.PrizeList,
            totalScore:resp.data.totalScore,
            usedScore:resp.data.usedScore,
          });
          },
          fail: (resp) => {
            dd.alert({content: JSON.stringify(resp)});
          },
         });
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
  },
  toExchange(e) {
    console.log("event in dataattr is :")
    console.log(e)
    console.log("prize is")
    console.log(this.data.prize[e.currentTarget.dataset.attr-1].prize_name_cn)
    this.setData({
      modalOpened5:true,
      selectScore:this.data.prize[e.currentTarget.dataset.attr-1].cost_score,
      selectPrize:this.data.prize[e.currentTarget.dataset.attr-1].prize_name_cn,
      selectPrizeIndex:e.currentTarget.dataset.attr
  })
  },
 
  onButtonClick5(e) {
    console.log('this.data.selectPrize')
      console.log(this.data.selectPrize)
    if(e.currentTarget.dataset.index==1){
      //分值不足的情况
      if(this.data.selectScore>this.data.totalScore-this.data.usedScore){
        this.setData({modalOpened5: false});
        dd.alert({
          content:'您当前可用积分为：'+(this.data.totalScore-this.data.usedScore)+'分，分值不足'
        })
        return 
      }

      
      dd.httpRequest({
      url: app.globalData.serverUrl+'/check/toExchangePrize',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      method: 'POST',
      data:{
        score:this.data.selectScore,
        apply_userid:this.data.userid,
        apply_username: this.data.username,
        prize_name:this.data.selectPrize,
        prizeid:this.data.selectPrizeIndex
      },
      dataType: 'json',
      success: (res) => {
        this.setData({
          modalOpened5: false,
          usedScore:this.data.usedScore+this.data.selectScore
        });
        dd.alert({content: "恭喜！申请奖品成功，请联系你的班长或你所在车间的精益专员领取。"});
        
      },
      fail: (res) => {
        console.log("httpRequestFail---",res)
        // dd.alert({content: JSON.stringify(res)});
        dd.alert({content: "申请失败，请检查您的积分是否足够或联系管理员。"});
        this.setData({modalOpened5: false,});
      },
      complete: (res) => {
          dd.hideLoading();
      }
                });
    }else{
       this.setData({
      modalOpened5: false,
    }); 
    }

  },
 
});
