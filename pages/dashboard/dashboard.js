/* Dashboard page controller. */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};
  function setup(root){
    if(!root || root.dataset.chartReady==='1') return;
    const filter=root.querySelector('#invoiceChartMode');
    const chart=root.querySelector('#invoiceChart');
    if(!filter || !chart) return;
    root.dataset.chartReady='1';
    const applyMode=()=>{
      chart.dataset.mode=filter.value;
    };
    filter.addEventListener('change',applyMode);
    applyMode();
  }
  window.GSTUIPageModules.dashboard={
    mount(root){ if(root) root.dataset.moduleMounted='1'; setup(root); },
    unmount(root){
      if(root) {
        delete root.dataset.moduleMounted;
        delete root.dataset.chartReady;
      }
    }
  };
  document.addEventListener('gstui:module-mounted',event=>{
    if(event.detail && event.detail.name==='dashboard') setup(event.target);
  });
})();
