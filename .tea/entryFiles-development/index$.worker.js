if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


      if( navigator.userAgent && (navigator.userAgent.indexOf('LyraVM') > 0 || navigator.userAgent.indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../node_modules/mini-ddui/es/grid/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/loading/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/list/index?hash=e1617a0257fb9de746f60d50b03404ad924976c9');
require('../../node_modules/mini-ali-ui/es/list/auto-size-img/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/am-icon/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/list/list-item/index?hash=a5465b8c889360e3f854461d3ac41cf414aec633');
require('../../node_modules/mini-ali-ui/es/list/alphabet/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/list/list-secondary/index?hash=f75be69226a587e5ccc990c4b63309fd714f1354');
require('../../node_modules/mini-ali-ui/es/tag/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../node_modules/mini-ali-ui/es/am-switch/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/am-radio/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../node_modules/mini-ali-ui/es/button/index?hash=e1617a0257fb9de746f60d50b03404ad924976c9');
require('../../node_modules/mini-ali-ui/es/flex/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/flex/flex-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/modal/index?hash=febd4c40992222524e0db12a74760a28f8f9b339');
require('../../node_modules/mini-ali-ui/es/badge/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/tabs/index?hash=4a98b35daa3eee1b62960d4d5bbcbf254cbf11e3');
require('../../node_modules/mini-ali-ui/es/tabs/tab-content/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/card/index?hash=8c77e86e89c40c5b2ab9f0f22cf86a6245babc59');
require('../../node_modules/mini-ali-ui/es/collapse/index?hash=a11fdcdff8ea970c65f185a8731cafe48f67047c');
require('../../node_modules/mini-ali-ui/es/collapse/collapse-item/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../node_modules/mini-ali-ui/es/multi-liner/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=1706df8dd2eaa2f210580303c73825b1f6b6b1b0');
require('../../pages/kpi/kpi?hash=6afb217eadccd1c4e8bfda0d0b7fb88324ecf08f');
require('../../pages/handle/handle?hash=d6615376edfe812f1ac464b35f21c5b9e6d222b6');
require('../../pages/scores/scores?hash=c3ce55500d7c7c6a43bf6bfd10a7cfdb37d32663');
require('../../pages/excellent/excellent?hash=6afb217eadccd1c4e8bfda0d0b7fb88324ecf08f');
require('../../pages/excellent/upload/upload?hash=d6615376edfe812f1ac464b35f21c5b9e6d222b6');
require('../../pages/impeach/impeach?hash=6afb217eadccd1c4e8bfda0d0b7fb88324ecf08f');
require('../../pages/doubleAudit/doubleAudit?hash=6eef006181ab19400e63237d958df5000bd9cb0f');
require('../../pages/doubleAudit/toBeDoubleAudit/toBeDoubleAudit?hash=9cd1a71ff7f43277f1637d1ce18f06a2ecb3a3db');
require('../../pages/mine/mine?hash=bb6be94eeb1a277c746c1e9a0a8507e056c481bf');
require('../../pages/community/community?hash=8803d242f0d662db19e3cfa0fb6bfe90ae8170bb');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}