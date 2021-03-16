Component({
  props: {
    title: '',
    onClick: function onClick() {},
    info: '',
    userid: '',
    info2: '',
  },
  methods: {
    onCardClick: function onCardClick() {
      var _props = this.props,
          info = _props.info,
          onClick = _props.onClick,
          userid = _props.userid,
          info2 = _props.info2;

      onClick({ info: info,userid: userid,info2: info2 });
    }
  }
});