/* Dashboard page controller. */
(function(){
  'use strict';
  window.GSTUIPageModules = window.GSTUIPageModules || {};

  function applyChartMode(root, mode){
    root=root || document;
    const chart=root.querySelector ? root.querySelector('#invoiceChart') : document.getElementById('invoiceChart');
    const filter=root.querySelector ? root.querySelector('#invoiceChartMode') : document.getElementById('invoiceChartMode');
    if(!chart) return;
    const value=mode || (filter && filter.value) || 'both';
    chart.dataset.mode=value;
    chart.querySelectorAll('.candle-group').forEach(group=>{
      group.classList.toggle('hide-buy',value==='sale');
      group.classList.toggle('hide-sale',value==='buy');
    });
  }

  window.setInvoiceChartMode=function(value){
    const chart=document.getElementById('invoiceChart');
    if(!chart) return;
    chart.dataset.mode=value;
    chart.querySelectorAll('.candle-group').forEach(group=>{
      group.classList.toggle('hide-buy',value==='sale');
      group.classList.toggle('hide-sale',value==='buy');
    });
  };

  window.GSTUIPageModules.dashboard={
    mount(root){
      if(root){
        root.dataset.moduleMounted='1';
        applyChartMode(root);
      }
    },
    unmount(root){
      if(root) delete root.dataset.moduleMounted;
    }
  };

  document.addEventListener('gstui:module-mounted',event=>{
    if(event.detail && event.detail.name==='dashboard') applyChartMode(event.target);
  });

  document.addEventListener('change',event=>{
    const filter=event.target.closest('#invoiceChartMode');
    if(filter) window.setInvoiceChartMode(filter.value);
  });
})();
