let app = getApp()

Page({
  onLoad(){
    let curDate =  new Date()
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth()

    if(parseInt(curMonth)<10){
      curMonth='0'+curMonth
    }
    this.setData({
      year:curYear,
      lastMonth:curMonth,
    })
    let date = curYear+"-"+curMonth
    dd.getStorage({
      key:'userInfo',
      success:(res) => {
        this.setData({userid : res.data.jobnumber});
        this.setData({username : res.data.name});
        console.log(res.data.jobnumber)
        this.getAllList(date)
      },
      fail:function(res){
        dd.alert({content:res.errorMessage})
      }
    });
    
    
    
    
  },
  data:{
    originTotalList:[],
    arrayDistrict:[],
    arrayDistrictWithId:[],
    year:'',
    lastMonth:'',
    arrayStatus:['未解决','已解决','全部'],
    arrayStatusList:[{status:0,value:'未解决'},{status:1,value:'已解决'},{status:2,value:'全部'}],
    indexDistrict:0,
    indexStatus:0,
    totalQty:'',
    notClosedQty:'',
    toView:'section',
    totalList:[],
    closeRate:0,
    src:app.globalData.imgSrc,
    handlerList:[],
    userid:'',
    username:'',

  },
  getObjectValues(object){
    var values = [];
    for (var property in object)
      values.push(object[property].dis_name);
    return values;
  },
  getAllList(selectDate){
    dd.httpRequest({
        url: app.globalData.serverUrl+'/sixs/getAllList',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        dataType: 'json',
        data:{selectDate},
        success: (res) => {
          let arr = this.getObjectValues(res.data.districtList)
          
          let newList = res.data.totalList.map(item=>{
            return{
              ...item,
              date:item.date_time.split(" ")[0]
            }
          })
          
          let closeR =res.data.totalQty[0].totalQty==0?100:Math.ceil(
            (res.data.totalQty[0].totalQty-res.data.notClosedQty[0].notClosedQty)*100/res.data.totalQty[0].totalQty)

          this.setData({
            closeRate:closeR,
            arrayDistrict:arr,
            totalList:newList,
            originTotalList:newList,
            arrayDistrictListWithId:res.data.districtListWithId,
            totalQty:res.data.totalQty[0].totalQty,
            notClosedQty:res.data.notClosedQty[0].notClosedQty,
            handlerList:res.data.handlerList
          })
          
        },
        fail: (res) => {
          console.log("httpRequestFail---",res)
          dd.alert({content: JSON.stringify(res)});
        },
        complete: (res) => {
            dd.hideLoading();
        }
      });
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
          this.getLatestData()

        }
      },
    });
  },
  districtChange(e){
    this.setData({
      indexDistrict:e.detail.value
    })
    this.getLatestData()
  },
  statusChange(e){
    this.setData({
      indexStatus:e.detail.value
    })
    this.getLatestData()
  },
  //预览图片
  previewImage(e){
    my.previewImage({
      current: 1,
      urls: [
        app.globalData.imgSrc+e.currentTarget.dataset.img
      ],
    });
  },
  getLatestData(){
    
    let curDate = this.data.year+'-'+this.data.lastMonth
    dd.httpRequest({
        url: app.globalData.serverUrl+'/sixs/getLatestData',
        method: 'POST',
        dataType: 'json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        data:{
          selectDate:curDate,
          selectDistrictId:''+this.data.arrayDistrictListWithId[this.data.indexDistrict].id,
          selectStatus:''+this.data.arrayStatusList[this.data.indexStatus].status
        },
        success: (res) => {
          console.log("res from getLatest")
          console.log(res.data)
          let arr = this.getObjectValues(res.data.districtList)
          
          let newList = res.data.totalList.map(item=>{
            return{
              ...item,
              date:item.date_time.split(" ")[0]
            }
            
          })
          let closeR =res.data.totalQty[0].totalQty==0?100:Math.ceil(
            (res.data.totalQty[0].totalQty-res.data.notClosedQty[0].notClosedQty)*100/res.data.totalQty[0].totalQty)
          this.setData({
            closeRate:closeR,
            totalQty:res.data.totalQty[0].totalQty,
            notClosedQty:res.data.notClosedQty[0].notClosedQty,
            totalList:newList,
            handlerList:res.data.handlerList
          })
          
        },
        fail: (res) => {
          console.log("httpRequestFail---",res)
          dd.alert({content: JSON.stringify(res)});
        },
        complete: (res) => {
            dd.hideLoading();
        }
      })
  },
  upLoadPic(e) {
    var _this = this;
    //判断用户是否为处理人
    let flag = false
    this.data.handlerList.forEach(item => {
      if(item.p_job_number==this.data.userid){
        flag=true
      }
    });
    console.log(this.data.handlerList)
    if(!flag){
      dd.showToast({content:'只有该车间处理人才可以上传图片'})
      return 
    }

    //判断如果超期则不能处理
    let curDate = new Date()
    let preDate = new Date(curDate.getTime() - 16*60*60*1000)
    let handleDate = new Date(''+e.currentTarget.dataset.item.date)
    if(preDate>handleDate){
      dd.showToast({content:'该处理节点已过，请到下个月的待整改清单中处理该问题'})
      return 
    }

    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1,
      success: res => {
        let paths = res.filePaths[0]
          dd.uploadFile({
            url: app.globalData.serverUrl+'/sixs/uploadFile',
            fileType: 'image',
            fileName: 'file',
            filePath: paths,
            success: res => {
              let resp = JSON.parse(res.data);
              //将图片名称保存至数据库
              dd.httpRequest({
                url: app.globalData.serverUrl+'/sixs/savePicName',
                method: 'POST',
                dataType: 'json',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                data:{
                  id:e.currentTarget.dataset.item.id,
                  pic_after_ck:resp.picName
                },
                success:res=>{
                  dd.showToast({content:'图片上传成功'})
                _this.getLatestData()
                },
                fail:res=>{
                  dd.alert({ title: `图片上传失败：${JSON.stringify(res)}` });
                },
                complete:res=>{

                }
              })
              _this.setData({
                filename : _this.data.filename+resp.fileName,        
              })
            },
            fail: function (res) {
              dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            },
          });
        }
    });
  },
})