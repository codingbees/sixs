let app = getApp()


Page({
  data: {
    getCheckItem: {},
    requireFinishDate:'',
    imgSrc:app.globalData.imgSrc,
    arrIndex:0,
    objectArray:[0,1,2,3,4,5],
    check_tatus:2,
    id:'',
    modalOpened5:false,
    buttons5: [
      { text: '取消' },
      { text: '确定', extClass: 'buttonBold' },
    ],
    

  },
  onLoad(query) {
    this.setData({
      id: query.id
    })
    dd.httpRequest({
      url: app.globalData.serverUrl + '/sixs/getHandleItem',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: { id: query.id },
      dataType: 'json',
      success: res => {
        let newl = res.data.handleItem[0]
        newl.create_time = newl.date_time.split(" ")[0]
        this.setData({ getCheckItem: newl });
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，未知原因，请联系管理员' });
      }
    });
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({ userid: res.data.userid });
        this.setData({ username: res.data.name });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });
    dd.setNavigationBar({
      title: '处理匿名检举'
    });
  },
  bindObjPickerChange(e) {
    this.setData({
      arrIndex: e.detail.value,
    });
  },
  selectDate() {
    dd.datePicker({
      format: 'yyyy-MM-dd',
      success: (res) => {
        this.setData({ requireFinishDate: res.date })
      },
    });
  },
  radioChange(e) {
    this.setData({
      check_tatus:e.detail.value
    })
  },
  previewImage(e){
    my.previewImage({
      current: 1,
      urls: [
        this.data.imgSrc+e.currentTarget.dataset.img
      ],
    });
  },
  onButtonClick5(e) {
    this.setData({
      modalOpened5: false,
    });
    let dataForm = {
      id:this.data.id,
      check_status:this.data.check_tatus,
      score:this.data.objectArray[this.data.arrIndex],
      first_req_date:this.data.requireFinishDate
    }
    if(e.currentTarget.dataset.index ==0) return 
    if(dataForm.first_req_date==null||"" == dataForm.first_req_date){
          dd.showToast({ content: '请选择要求完成日期！' })
          return false
      }

    dd.httpRequest({
      url:app.globalData.serverUrl+'/sixs/handleImpeach',
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      dataType:'JSON',
      data:dataForm,
      success:res=>{
        if(res.data.status==200){
          dd.showToast({
            content:'处理成功'
          })
        }
      },
      fail:res=>{},
      complete:res=>{
        dd.redirectTo({
          url:'/pages/doubleAudit/doubleAudit'
        })
        
      }
    })

    
  },
  submit() {
    this.setData({
      modalOpened5: true,
    })
  }


});


