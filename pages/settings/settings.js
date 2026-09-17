/* Settings page controller. */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};
  window.GSTUIPageModules.settings = {
    mount(root){ if(root) root.dataset.moduleMounted='1'; },
    unmount(root){ if(root) delete root.dataset.moduleMounted; }
  };
})();
