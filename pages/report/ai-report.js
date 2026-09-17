/* Report > AI Report page controller. */
(function(){
  'use strict';
  window.GSTUIReportModules = window.GSTUIReportModules || {};
  window.GSTUIReportModules.aiReport = {
    mount(root){
      if(!root) return;
      root.dataset.moduleMounted='1';
    },
    unmount(root){
      if(root) delete root.dataset.moduleMounted;
    }
  };
})();
