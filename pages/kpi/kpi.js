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
      yearAward:curYear,
      lastMonthAward:curMonth,
    })
    let selectDate = curYear+'-'+curMonth
    this.getTotalList(selectDate)
    this.getAwardList(selectDate)
    },
  data: {
    totalList:[],
    toView: 'section',
    scrollTop: 100,
    year:'',
    lastMonth:'',
    originList:[],
    yearAward:'',
    lastMonthAward:'',
    totalListAward:[]

  },
  datePicker() {
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

        this.getTotalList(selDate)
        this.getAwardList(selDate)
        }
      },
    });
  },
  datePickerAward() {
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
            yearAward:selYear,
            lastMonthAward:selMonth
          })

        

        }
      },
    });
  },
 
  //获取检查情况一览表
  getTotalList(data){
    let _this= this
    dd.httpRequest({
        url: app.globalData.serverUrl+'/sixs/getSixSTotalListByMonth',
        method: 'POST',
        dataType: 'json',
        data:{selectDate:data},
        success: (res) => {
          console.log('getSixSTotalListByMonth res is:')
          console.log('success----',res.data);
          let list  = res.data.totalList
          
         let list1 = list.map((item)=>{
          return{
             ...item,
            closeRate:item.tabtotal>0?(item.closed==item.tabtotal?100:(((item.closed/item.tabtotal)*100).toFixed(2) )):100,
            score:item.staff_qty!=null?
            (item.tabtotal>0?
            ((0.4*(1-item.tabtotal/item.staff_qty)+0.6*(item.closed/item.tabtotal))*100).toFixed(2)
            :100.00)
            :null
          }
        })
        //把有员工和没有员工的区域分开（没有员工的区域不参加排名，给默认19名）
        let noRankList = list1.filter(item=>item.staff_qty==null)
        let rankList = list1.filter(item=>item.staff_qty!=null)
        console.log(noRankList)
        console.log(rankList)
        //再增加排名rank列
          let noRankList1 = noRankList.map((item,key)=>{
            return {
              ...item,rank:null
            }
          })
          let rankList1=rankList.sort((a,b)=>b.score-a.score)
          let rankList2 = rankList1.map((item,key)=>{
            return {
              ...item,rank:key+1
            }
          })
        //如果分值相同，则排名并列
        for (let i = 0; i < rankList2.length - 1; i++) {
            if (rankList2[i + 1].score == rankList2[i].score) {
              rankList2[i + 1].rank = rankList2[i].rank
          }
        }
        let newlist = [...rankList2,...noRankList1]
        console.log('after calculated')
        console.log(newlist)
        this.setData({totalList : newlist});
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
  //获取激励记录
  getAwardList(date){
    dd.httpRequest({
        url: app.globalData.serverUrl+'/sixs/getAwardList',
        method: 'POST',
        dataType: 'json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        data:{selectDate:date},
        success: (res) => {
          console.log("res from getAwardList")
          console.log(res.data)
          this.setData({
            totalListAward:res.data.totalListAward
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
  }

  
});