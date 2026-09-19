/* Dashboard page controller. */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};
  window.GSTUIPageModules.dashboard = {
    mount(root){
      if(!root) return;
      root.dataset.moduleMounted='1';
      const filter = root.querySelector('#invoiceChartMode');
      const groups = root.querySelectorAll('.candle-group');
      if(filter){
        const applyMode = () => {
          const mode = filter.value;
          groups.forEach(group => {
            group.classList.toggle('is-buy', mode === 'buy');
            group.classList.toggle('is-sale', mode === 'sale');
          });
        };
        filter.addEventListener('change', applyMode);
        applyMode();
      }
    },
    unmount(root){ if(root) delete root.dataset.moduleMounted; }
  };
})();
