let app = getApp();

Page({
  data: {
    id:'',
    arrayDis: [],
    indexDis: 0,
    problem: '',
    picName:'',
    p_name:'',
    p_job_number:'0',
    picture:'',
    imgSrc:app.globalData.imgSrc
  },
  onLoad() {
    dd.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log("userInfo is")
        console.log(res)
        this.setData({ p_name: res.data.name });
        this.setData({ p_job_number: res.data.jobnumber });
        dd.httpRequest({
          url: app.globalData.serverUrl + '/sixs/getDistrict',
          method: 'POST',
          dataType: 'json',
          success: res => {
            console.log(res.data)
            let arr = this.getObjectValues(res.data.district)
            console.log(arr)
            this.setData({
              arrayDis:arr
            })
          },
          fail: function (res) {
            dd.alert({ content: '获取问题区域失败，请联系管理员' });
          }
        });
      },
      fail: function (res) {
        dd.alert({ content: res.errorMessage })
      }
    });
    
  },
  getObjectValues(object){
    var values = [];
    for (var property in object)
      values.push(object[property].dis_name);
    return values;
  },
  selectFile(e) {
    let _this = this;
    console.log(e)
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
              this.setData({
                picture:resp.picName
              })
            },
            fail: function (res) {
              dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            },
          });
        }
    });
  },

  onSubmit: function (e) {
    e.detail.value.district = this.data.arrayDis[this.data.indexDis];
    
    var formdata = e.detail.value;
    formdata.p_job_number = this.data.p_job_number
    formdata.p_name = this.data.p_name
    if (formdata.problem == null || "" == formdata.problem) {
      dd.showToast({ content: '请填写问题描述！' })
      return false;
    }
    if (formdata.picture == null || "" == formdata.picture) {
      dd.showToast({ content: '请上传问题图片！' })
      return false;
    }
    console.log(formdata)

    dd.httpRequest({
      url: app.globalData.serverUrl + '/sixs/submitProposal',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      data: formdata,
      dataType: 'json',
      success: res=> {
        
        dd.showToast({
          type: 'success',
          content: "数据提交成功",
          duration: 1100
        });
        this.setData({
          picture:'',
          problem:''
        })
      },
      fail: function (res) {
        dd.alert({ content: '发起失败，请联系管理员' });
      },
      complete: function (res) {
        
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  disChange(e) {
    
    this.setData({
      indexDis: e.detail.value,
    });
    
  },
  resetBtn(){
    this.setData({
      picture:'',
      problem:''
    })
    console.log(this.data.problem)
  },
  onReset(){

  }
  
});
