let app = getApp()
Page({
  data: {
    userid: '',
    partid: '',
    partname: '',
    username: '',
    gloveList:[],
    year:'',
    lastMonth:'',
    imgSrc:app.globalData.imgSrc
  },
  onLoad() {
    let date =  new Date()
    let curYear = date.getFullYear()
    let curMonth = date.getMonth()
    if(curMonth<10){
      curMonth='0'+curMonth
    }
    this.setData({
      year:curYear,
      lastMonth:''+curMonth
    })
    let checkdate = curYear+'-'+curMonth
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log("userInfo is")
        console.log(res)
        this.setData({ userid: res.data.jobnumber });
        this.setData({ partid: res.data.department });
        this.setData({ username: res.data.name });
        this.setData({ partname: res.data.departments });

        this.getGlovesList(checkdate)
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });

  },
  upLoadData(){
    dd.navigateTo({
      url:'/pages/excellent/upload/upload'
    })
  },
  datePicker(e) {
    let _this = this
    my.datePicker({
      format:'yyyy-MM',  
      startDate: '2021-1-1', 
      success: (res) => {
        let selDate = res.date
        let selYear = selDate.split('-')[0]
        let selMonth = selDate.split('-')[1]
        if(_this.year!=parseInt(selYear)&&_this.lastMonth!=parseInt(selMonth)){
          this.setData({
            year:selYear,
            lastMonth:selMonth
          })
          let selectDate = selYear+'-'+selMonth
          this.getGlovesList(selectDate)

        }
      },
    });
  },
  preview(e){
    console.log(e)
    my.previewImage({
      current: 2,
      urls: [
        app.globalData.imgSrc+e.currentTarget.dataset.img
      ],
    });
  },
getGlovesList(selectDate){
  dd.httpRequest({
          url: app.globalData.serverUrl + '/sixs/getGlovesList',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          dataType: 'json',
          data: { selectDate},
          success: resp => {
            let array = resp.data.gloveList
            console.log("res from getGlovesList is ")
            console.log(resp)

            let set = new Set()

          
           array.forEach((v,k) => {
             set.add(v.release_date.split(" ")[0])
           });
          console.log(set)
          console.log(array)
           let newList = []

           set.forEach(v=>{
             let l = array.filter(item=>{
              return item.release_date.indexOf(v)>-1
             })
             newList.push({
               date:v,
               list:l
             })
           })
           console.log(newList)
            this.setData({ gloveList: newList });
          },
          fail: function (resp) {
            dd.alert({ content: '获取待处理清单失败，请联系管理员' });
          }
        });
}

});
