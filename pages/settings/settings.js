/* Settings page controller. */
(function(){
  'use strict';

  window.GSTUIPageModules = window.GSTUIPageModules || {};

  function saveCompanySettings(){
    try{
      localStorage.setItem('gstui_company_name', document.getElementById('company-name-input')?.value || '');
      localStorage.setItem('gstui_auto_email', document.getElementById('auto-email-toggle')?.checked ? '1' : '0');
    }catch(e){}
  }

  function loadCompanySettings(){
    try{
      const name = localStorage.getItem('gstui_company_name');
      const auto = localStorage.getItem('gstui_auto_email');
      const input = document.getElementById('company-name-input');
      const toggle = document.getElementById('auto-email-toggle');
      if(input && name) input.value = name;
      if(toggle) toggle.checked = auto === '1';

      const logo = localStorage.getItem('gstui_company_logo');
      const preview = document.getElementById('company-logo-preview');
      if(logo && preview) preview.innerHTML = '<img src="' + logo + '" alt="Company Logo">';
    }catch(e){}
  }

  window.showSettingsPanel = function(name, button){
    document.querySelectorAll('.settings-panel').forEach(function(panel){
      panel.classList.toggle('active', panel.id === name + '-panel');
    });
    document.querySelectorAll('.settings-shortcut').forEach(function(btn){
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  window.GSTUIPageModules.settings = {
    mount(root){
      if(!root) return;
      root.dataset.moduleMounted='1';

      const input = root.querySelector('#company-name-input');
      const toggle = root.querySelector('#auto-email-toggle');
      const logoInput = root.querySelector('#company-logo-input');
      const preview = root.querySelector('#company-logo-preview');

      if(input) input.addEventListener('input', saveCompanySettings);
      if(toggle) toggle.addEventListener('change', saveCompanySettings);

      if(logoInput) logoInput.addEventListener('change', function(){
        const file = this.files && this.files[0];
        if(!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = function(e){
          try{
            localStorage.setItem('gstui_company_logo', e.target.result);
            if(preview) preview.innerHTML = '<img src="' + e.target.result + '" alt="Company Logo">';
          }catch(err){}
        };
        reader.readAsDataURL(file);
      });

      loadCompanySettings();
    },
    unmount(root){ if(root) delete root.dataset.moduleMounted; }
  };
})();