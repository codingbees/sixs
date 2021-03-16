let app = getApp()


Page({
  data: {
    CommunityDataList: {},
    commentArr: [],
    commentcomten: '',
    showrCommentRpno: '',
    ProblemPic: [],
    ProposalPic: [],
    HandlePic: [],
    src: 'http://110.186.68.166:18901/rationalproposal/',
    handlers: [],
    indexHandler: 0,
    no: '',
    img: [],
    fileqty: 0,
    filename: '',
    fileupdateqty: 0,
    userid: '',
    partid: '',
    partname: '',
    username: '',
    userjobnumber: '',
    test: null
  },
  handlerChange(e) {
    this.setData({
      indexHandler: e.detail.value,
    });
  },
  onLoad(query) {
    
  },
  showProblemPic(e) {
    console.log(e)
    if (e.currentTarget.dataset.pic == null) {
      dd.showToast({
        type: 'fail',
        content: '此处暂无图片'
      })
      return
    }
    let pic = e.currentTarget.dataset.pic
    let ProblemPic = []
    let pics = pic.split(";")
    for (const index in pics) {
      if (index < pics.length - 1) {
        ProblemPic.push(this.data.src + pics[index].substr(pics[index].lastIndexOf("_") + 1));
      }
    }
    my.previewImage({
      urls: ProblemPic,
    });
  },
  showProposalPic(e) {
    if (e.currentTarget.dataset.pic == null) {
      dd.showToast({
        type: 'fail',
        content: '此处无图片描述',
        duration: 1000,

      })
      return
    }
    let pic = e.currentTarget.dataset.pic
    let ProblemPic = []
    let pics = pic.split(";")
    for (const index in pics) {
      ProblemPic.push(this.data.src + pics[index].substr(pics[index].lastIndexOf("_") + 1));
    }
    my.previewImage({
      urls: ProblemPic,
    });
  },
  
  comment(e) {
    this.setData({
      commentArr: [],
    })
    console.log('e in comment')
    console.log(e)
    let rpno = e.currentTarget.dataset.rpno
    let newconment = e.currentTarget.dataset.im.newcontent
    if (this.data.showrCommentRpno == rpno) {
      this.setData({
        showrCommentRpno: '',
      })
    } else {
      this.setData({
        showrCommentRpno: rpno,
      })
    }
    if (newconment != null) {
      let newArr = newconment.split("*&^,")
      let l = newArr.length
      let newArray = newArr.map((item) => {
        return item;
      })
      newArr[l - 1] = newArray[l - 1].split('').reverse().join('').slice(3).split('').reverse().join('')
      let newArr2 = []
      for (const key in newArr) {
        newArr2.push(newArr[key].split("$^$"))
      }
      this.setData({
        commentArr: newArr2,
      })
    }

  },

  
});


