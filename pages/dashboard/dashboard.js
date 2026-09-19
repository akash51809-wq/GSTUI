/* Dashboard page controller. */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};

  function applyChartMode(root){
    if(!root) return;
    const filter=root.querySelector('#invoiceChartMode');
    const chart=root.querySelector('#invoiceChart');
    if(!filter || !chart) return;
    chart.dataset.mode=filter.value || 'both';
  }

  window.GSTUIPageModules.dashboard={
    mount(root){
      if(root) {
        root.dataset.moduleMounted='1';
        applyChartMode(root);
      }
    },
    unmount(root){
      if(root) {
        delete root.dataset.moduleMounted;
      }
    }
  };

  /* Delegated change handler works even when the dashboard HTML is injected later. */
  document.addEventListener('change',event=>{
    const filter=event.target.closest('#invoiceChartMode');
    if(!filter) return;
    const root=filter.closest('.page-module-host') || document;
    const chart=root.querySelector ? root.querySelector('#invoiceChart') : null;
    if(chart) chart.dataset.mode=filter.value || 'both';
  });

  document.addEventListener('gstui:module-mounted',event=>{
    if(event.detail && event.detail.name==='dashboard'){
      applyChartMode(event.target);
    }
  });
})();
