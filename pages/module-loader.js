/* GSTUI modular page loader foundation.
 * Common shell/navigation stays in the existing app.js.
 * Page-specific modules register themselves through window.GSTUIPageModules.
 */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};

  window.GSTUIModule = {
    mount(name, root){
      const mod = window.GSTUIPageModules[name];
      if(mod && typeof mod.mount === 'function') mod.mount(root);
    },
    unmount(name, root){
      const mod = window.GSTUIPageModules[name];
      if(mod && typeof mod.unmount === 'function') mod.unmount(root);
    }
  };
})();
