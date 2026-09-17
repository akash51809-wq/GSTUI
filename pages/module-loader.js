/* GSTUI modular page loader.
 * Common shell/navigation remains shared. Each page's HTML/CSS/JS is loaded from pages/<page>/.
 */
(function(){
  'use strict';

  const modules = {
    dashboard: { html:'pages/dashboard/dashboard.html', css:'pages/dashboard/dashboard.css', js:'pages/dashboard/dashboard.js' },
    upload: { html:'pages/upload/upload.html', css:'pages/upload/upload.css', js:'pages/upload/upload.js' },
    reports: { html:'pages/report/report.html', css:'pages/report/report.css', js:'pages/report/report.js' },
    parties: { html:'pages/parties/parties.html', css:'pages/parties/parties.css', js:'pages/parties/parties.js' },
    settings: { html:'pages/settings/settings.html', css:'pages/settings/settings.css', js:'pages/settings/settings.js' }
  };

  const loaded = new Set();

  function loadCss(url){
    if(document.querySelector(`link[data-gstui-module-css="${url}"]`)) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=url;
    link.dataset.gstuiModuleCss=url;
    document.head.appendChild(link);
  }

  function loadJs(url){
    return new Promise((resolve,reject)=>{
      if(document.querySelector(`script[data-gstui-module-js="${url}"]`)) return resolve();
      const script=document.createElement('script');
      script.src=url;
      script.dataset.gstuiModuleJs=url;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`Failed to load ${url}`));
      document.body.appendChild(script);
    });
  }

  async function mount(name){
    const meta=modules[name];
    const host=document.querySelector(`.page-module-host[data-page-module="${name}"]`);
    if(!meta || !host || loaded.has(name)) return;

    const response=await fetch(meta.html,{cache:'no-cache'});
    if(!response.ok) throw new Error(`GSTUI module ${name} failed to load (${response.status})`);
    host.innerHTML=await response.text();
    loadCss(meta.css);
    await loadJs(meta.js);
    loaded.add(name);
    host.dispatchEvent(new CustomEvent('gstui:module-mounted',{detail:{name}}));
  }

  async function mountAll(){
    for(const name of Object.keys(modules)){
      try{ await mount(name); }
      catch(error){ console.error('[GSTUI module-loader]',error); }
    }
    document.documentElement.dataset.gstuiModulesReady='1';
    if(typeof window.showSection==='function'){
      const hash=window.location.hash.replace(/^#/,'') || 'dashboard';
      window.showSection(hash);
    }
  }

  window.GSTUIModule={ mount, mountAll, modules };
  window.GSTUIPageLoader=window.GSTUIModule;

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountAll,{once:true});
  else mountAll();
})();
