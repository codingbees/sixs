let app = getApp()
Page({
  data: {
    updateId:'',
    listToBeChecked: [],
    imgSrc:app.globalData.imgSrc,
    doubleAuditListAfterHandle:[],
    userid: '',
    username: '',
    managerids:[],
    index:0,
    activeTab: 0,
    districList:[],
    arrIndex:0,
    modalOpened5: false,
    buttons5: [
      { text: '拒绝' },
      { text: '同意', extClass: 'buttonBold' },
    ],
    tabs: [
      {
        title: '匿名检举审核',
        subTitle: '检举审核',
        number: '6',
        showBadge: false,
        badge: {
          arrow: true,
          stroke: true,
        },
      },
      {
        title: '处理图片审核',
        subTitle: '检举审核',
        number: '6',
        showBadge: false,
        badge: {
          arrow: true,
          stroke: true,
        },
      },
      {
        title: '提交数据',
        subTitle: '提交现场检查数据',
        number: '66',
        showBadge: false,
        badge: {
          arrow: false,
          stroke: true,
        },
      },
    ],
    upLoadList:[
      {
        picture:[],
        problem:'',
        district:'',
        first_req_date:''
      }
    ]
  },
  onLoad() {
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        
        this.setData({ userid: res.data.jobnumber });
        this.setData({ username: res.data.name });
        dd.httpRequest({
          
          url: app.globalData.serverUrl + '/sixs/getDoubleAuditList',
          data: { handler_userid: this.data.userid },
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          dataType: 'json',
          success: resp => {

            if (resp.data.doubleAuditList.length == 0) {
              
              this.setData({ getHandleListIsEmpty: true });
            } else {
              
              this.setData({ getHandleListIsEmpty: false });
            }
            let [...newList] = resp.data.doubleAuditList
            
            let newl = newList.map(item=>{
              return {
              ...item,create_date:item.date_time.split(" ")[0]
              }
            })

            let arr = this.getObjectValues(resp.data.district)
            console.log('res')
            console.log(resp)
            console.log('arr')
            console.log(arr)
            this.setData({ 
              listToBeChecked: newl ,
              managerids:resp.data.managerList,
              districList:arr,
              doubleAuditListAfterHandle:resp.data.doubleAuditListAfterHandle

            });
          },
          fail: function (resp) {
            dd.alert({ content: '获取待处理清单失败，请联系管理员' });
          }
        });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });

  },
  datePicker(e) {
    console.log(e)
    let _this = this
    my.datePicker({
      format:'yyyy-MM-DD',  
      startDate: '2021-1-1', 
      success: (res) => {
        let selDate = res.date
        let selYear = selDate.split('-')[0]
        let selMonth = selDate.split('-')[1]
        console.log(res)
        let [...list]  =  this.data.upLoadList
              list[e.currentTarget.dataset.id].first_req_date = res.date
              this.setData({
                upLoadList:list
              })
      },
    });
  },
  getObjectValues(object){
    var values = [];
    for (var property in object)
      values.push(object[property].dis_name);
    return values;
  },
  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
  handleTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
  onItemClick(ev) {
    //待审核建议是所有人都可以查看的，此处设置审核权限，只有精益专员可以点击审核
    let checkRight =  false
    
    let managerids = this.data.managerids
    for (const key in managerids) {
      if (managerids.hasOwnProperty(key)) {
        const element = managerids[key];
        if(this.data.userid == element.ding_user_id){
          checkRight = true
        }
      }
    }
    
    if (!checkRight) {
      dd.showToast({
        type: 'fail',
        content: '该申请正在等待精益专员审核。',
        duration: 1500,
      })
      return
    }
    console.log("有审核权限")
    
    dd.navigateTo({
      url: '/pages/doubleAudit/toBeDoubleAudit/toBeDoubleAudit?id=' + ev.currentTarget.dataset.id
    })
  },
  upLoadPic(e) {
    var _this = this;
    console.log(e)
    

    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 9,
      success: res => {
        dd.showLoading({
          content: '图片上传中，请稍候',
        });
        res.filePaths.forEach(item=>{
          dd.uploadFile({
            url: app.globalData.serverUrl+'/sixs/uploadFile',
            fileType: 'image',
            fileName: 'file',
            filePath: item,
            success: resp => {
              let response = JSON.parse(resp.data);
              console.log('response')
              console.log(response)
              let [...list]  =  this.data.upLoadList
              list[e.currentTarget.dataset.id].picture.push(response.picName)
              this.setData({
                upLoadList:list
              })
              
              
            },
            fail: function (res) {
              dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            },
          });
        })
        
          
        },
        complete:res=>{
          dd.hideLoading()
        }

    });
  },
  previewImage(e){
    let current = e.currentTarget.dataset.imgindex
    let urls = []
    let len = e.currentTarget.dataset.img.length
    for(let i = 0;i<len;i++){
      urls.push(app.globalData.imgSrc+e.currentTarget.dataset.img[i])
    }
    my.previewImage({
      current,
      urls,
    });
  },
  bindObjPickerChange(e){
    let [...list] = this.data.upLoadList
    
    list[e.currentTarget.dataset.id].district = this.data.districList[e.detail.value]

    this.setData({
      upLoadList:list
    })
    console.log(e)
  },
  addData(){
    let empty = {
        picture:[],
        problem:'',
        district:'',
        first_req_date:''
      }
      let [...list] = this.data.upLoadList
    list.push(empty)
    this.setData({
      upLoadList:list
    })
  },
  submitData(){
    console.log(this.data.upLoadList)
    //判断用户是否为处理人
    // let flag = true
    // this.data.handlerList.forEach(item => {
    //   if(item.p_job_number==this.data.userid){
    //     flag=true
    //   }
    // });
    // console.log(this.data.handlerList)
    // if(!flag){
    //   dd.showToast({content:'只有该车间处理人才可以上传图片'})
    //   return 
    // }
    let [...list] = this.data.upLoadList
    let flag = false
    list.forEach(item=>{
      if(!item.district){
        flag = true
      }
    })
    if(flag){
      dd.showToast({content:'请选择问题区域'})
      return 
    }
      let len = list.length
      list.forEach((item,index)=>{

      this.saveLeanCheckData(item,index,len)
    })
    //将图片名称保存至数据库
      
  },
  saveLeanCheckData(data,index,len){
    let {picture,
        problem,
        district,
        first_req_date} = data
        
    picture.forEach(item=>{
      dd.httpRequest({
        url: app.globalData.serverUrl+'/sixs/saveLeanCheckData',
        method: 'POST',
        dataType: 'json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        data:{
          picture:item,
          problem,
          district,
          first_req_date
        },
        success:res=>{
          
        },
        fail:res=>{
          dd.alert({ title: `图片上传失败：${JSON.stringify(res)}` });
        },
        complete:res=>{
          if((index+1)==len){

            dd.showToast({type: 'success',content:'数据全部上传成功！'})
            let list = [{
                picture:[],
                problem:'',
                district:'',
                first_req_date:''
              }]
            this.setData({
              upLoadList:list
            })
          }
        }
      })
    })
    
  },
  setproblem(e){
    
    let [...list] = this.data.upLoadList
    
    list[e.currentTarget.dataset.id].problem = e.detail.value

    this.setData({
      upLoadList:list
    })
  },
  checkPicture(e){
    console.log(e)
  },
  openModal5(e) {
    console.log(e)
    this.setData({
      modalOpened5: true,
      updateId:e.currentTarget.dataset.id
    });
  },
  onButtonClick5(e) {
    const { target: { dataset } } = e;
    console.log(e)
    this.setData({
      modalOpened5: false,
    });
    let dataObj = {}
    if(dataset.index==1){
      dataObj={
        id: this.data.updateId,
        dbl_check_status:1,
        note:'精益审核处理图片通过',
        
      }
      
    }else{
      dataObj={
        id: this.data.updateId,
        handle_status:0,
        note:'精益审核处理图片不合格，请重新提交处理图片',
        pic_after_ck:null,
        act_fin_date:null
      }
    }
    dd.httpRequest({
          url: app.globalData.serverUrl + '/sixs/updateDoubleAuditStatus',
          data: dataObj,
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          dataType: 'json',
          success: resp => {
            dd.showToast({
              type:'success',content:'处理完成'
            })
            let [...newl] = this.data.doubleAuditListAfterHandle
            let arr= newl.filter(item=>{
              return item.id!=this.data.updateId
            })
            console.log(newl)
            console.log(arr)
              this.setData({
                updateId:'',
                doubleAuditListAfterHandle:arr
              })
          },
          fail: function (resp) {
            dd.alert({ content: '获取待处理清单失败，请联系管理员' });
          }
        });
  },

});
