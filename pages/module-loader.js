/* GSTUI modular page loader.
 * Common shell/navigation remains shared. Report subpages are mounted inside the Report module.
 */
(function(){
  'use strict';

  const modules={
    dashboard:{html:'pages/dashboard/dashboard.html',css:'pages/dashboard/dashboard.css',js:'pages/dashboard/dashboard.js'},
    upload:{html:'pages/upload/upload.html',css:'pages/upload/upload.css',js:'pages/upload/upload.js'},
    reports:{html:'pages/report/report.html',css:'pages/report/report.css',js:'pages/report/report.js'},
    parties:{html:'pages/parties/parties.html',css:'pages/parties/parties.css',js:'pages/parties/parties.js'},
    settings:{html:'pages/settings/settings.html',css:'pages/settings/settings.css',js:'pages/settings/settings.js'}
  };
  const reportSubpages={
    'pending-invoice':{html:'pages/report/pending-invoice.html',css:'pages/report/pending-invoice.css',js:'pages/report/pending-invoice.js'},
    'upload-invoice-report':{html:'pages/report/upload-invoice-report.html',css:'pages/report/upload-invoice.css',js:'pages/report/upload-invoice.js'},
    'ai-report':{html:'pages/report/ai-report.html',css:'pages/report/ai-report.css',js:'pages/report/ai-report.js'}
  };
  const loaded=new Set();

  function loadCss(url){
    if(document.querySelector(`link[data-gstui-module-css="${url}"]`)) return;
    const link=document.createElement('link');link.rel='stylesheet';link.href=url;link.dataset.gstuiModuleCss=url;document.head.appendChild(link);
  }
  function loadJs(url){
    return new Promise((resolve,reject)=>{
      if(document.querySelector(`script[data-gstui-module-js="${url}"]`)) return resolve();
      const script=document.createElement('script');script.src=url;script.dataset.gstuiModuleJs=url;script.onload=resolve;script.onerror=()=>reject(new Error(`Failed to load ${url}`));document.body.appendChild(script);
    });
  }
  async function loadInto(host,meta,key){
    if(!host||!meta||loaded.has(key)) return;
    const response=await fetch(meta.html,{cache:'no-cache'});
    if(!response.ok) throw new Error(`GSTUI module ${key} failed to load (${response.status})`);
    host.innerHTML=await response.text();loadCss(meta.css);await loadJs(meta.js);loaded.add(key);
    host.dispatchEvent(new CustomEvent('gstui:module-mounted',{detail:{name:key}}));
  }
  async function mountReportSubpages(){
    const report=document.querySelector('.page-module-host[data-page-module="reports"]');if(!report)return;
    for(const id of Object.keys(reportSubpages)){
      const host=report.querySelector(`[data-report-subpage-host="${id}"]`);
      try{await loadInto(host,reportSubpages[id],`report:${id}`);}catch(error){console.error('[GSTUI report-module]',error);}
    }
  }
  async function mount(name){
    const meta=modules[name],host=document.querySelector(`.page-module-host[data-page-module="${name}"]`);
    if(!meta||!host||loaded.has(name))return;
    await loadInto(host,meta,name);
    if(name==='reports')await mountReportSubpages();
  }
  async function mountAll(){
    for(const name of Object.keys(modules)){try{await mount(name);}catch(error){console.error('[GSTUI module-loader]',error);}}
    document.documentElement.dataset.gstuiModulesReady='1';
    document.dispatchEvent(new CustomEvent('gstui:modules-ready'));
    if(typeof window.showSection==='function'){
      const hash=window.location.hash.replace(/^#/,'')||'dashboard';
      window.showSection(hash);
    }
  }
  window.GSTUIModule={mount,mountAll,modules};window.GSTUIPageLoader=window.GSTUIModule;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountAll,{once:true});else mountAll();
})();