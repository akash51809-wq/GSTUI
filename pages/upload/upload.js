/* Upload Invoice page controller. */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};
  window.GSTUIPageModules.upload = {
    mount(root){ if(root) root.dataset.moduleMounted='1'; },
    unmount(root){ if(root) delete root.dataset.moduleMounted; }
  };
})();
