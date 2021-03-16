Component({
  props: {
    className: '',
    align: false,
    disabled: false,
    multipleLine: false,
    wrap: false
  },
  methods: {
    onItemTap: function onItemTap(ev) {
      var _props = this.props,
          onClick = _props.onClick,
          disabled = _props.disabled;

      if (onClick && !disabled) {
        onClick({
          index: ev.target.dataset.index,
          figureno: ev.target.dataset.figureno,
          info: ev.target.dataset.info,
        });
      }
    }
  }
});