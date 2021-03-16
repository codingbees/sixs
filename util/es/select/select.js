// Componet/Componet.js
Component({
  /**
   * 组件的属性列表
   */
    props:{
      array:[],
      onClick: function onClick() {},
      seindex:0,
    },
  /**
   * 组件的初始数据
   */
    data: {
        selectShow:false,//初始option不显示
        nowText:"请选择",//初始内容
        animationData:'',//右边箭头的动画
    },
  /**
   * 组件的方法列表
   */
    methods: {
　　　//option的显示与否
        selectToggle:function(e){
            var _props = this.props,
            array = _props.array;
            console.log("option---》"+JSON.stringify(e))
            var nowShow=this.data.selectShow;//获取当前option显示的状态
            //创建动画
            var animation = dd.createAnimation({
                timeFunction:"ease",
            })
            this.animation=animation;
            if(nowShow){
                animation.rotate(0).step();
                this.setData({
                    animationData: animation.export()
                })
            }else{
                animation.rotate(180).step();                
                this.setData({
                    animationData: animation.export()
                })
            }
            this.setData({
                selectShow: !nowShow
            })
        },
        //设置内容
        setText:function(e){
            var _props = this.props,
            onClick = _props.onClick;

            var nowData = this.props.array;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
            var nowIdx = e.target.dataset.index;//当前点击的索引
            var nowText = nowData[nowIdx].name;//当前点击的内容
            var nowId = nowData[nowIdx].id;
            var nowNo = nowData[nowIdx].stand_no;
            //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
            this.animation.rotate(0).step();
            this.setData({
                selectShow: false,
                nowText:nowText,
                animationData: this.animation.export()
            })
            onClick({ info: nowId,info2 : nowNo,seindex : _props.seindex});
        }
    }
})