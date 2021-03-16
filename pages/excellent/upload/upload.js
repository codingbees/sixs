let app = getApp();

Page({
  data: {
    objectArray: [
      {
        check_status: 0,
        name: '差',
      },
      {
        check_status: 1,
        name: '中',
      },
      {
        check_status: 2,
        name: '优',
      },
    ],
    arrIndex:[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    totalList:[],
    totalIndex:'',
    arrImg:[],

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
              totalList:arr
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
  bindObjPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let [...arr] = this.data.arrIndex
    arr[e.currentTarget.dataset.item] = e.detail.value
    this.setData({
      arrIndex: arr,
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
  previewImage(e){
    my.previewImage({
      current: 1,
      urls: [
        app.globalData.imgSrc+e.currentTarget.dataset.img
      ],
    });
  },
  upLoadPic(e) {
    console.log(this.data.totalList[e.currentTarget.dataset.item])
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
                url: app.globalData.serverUrl+'/sixs/saveGloves',
                method: 'POST',
                dataType: 'json',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                data:{
                  check_status:this.data.objectArray[this.data.arrIndex[e.currentTarget.dataset.item]].check_status,
                  dis_name:this.data.totalList[e.currentTarget.dataset.item],
                  picture:resp.picName
                },
                success:res=>{
                  dd.showToast({content:'图片上传成功'})
                  let [...arr] =this.data.arrImg
                  arr[e.currentTarget.dataset.item] = resp.picName

                  this.setData({
                    arrImg:arr,
                  })
                },
                fail:res=>{
                  dd.alert({ title: `图片上传失败：${JSON.stringify(res)}` });
                },
                complete:res=>{

                }
              })
              
            },
            fail: function (res) {
              dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            },
          });
        }
    });
  },
  
});
