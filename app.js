function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.add('hidden'));
  const reportIds=['pending-invoice','upload-invoice-report','ai-report'];
  const targetId=reportIds.includes(id)?'reports':id;
  const target=document.getElementById(targetId);
  if(target) target.classList.remove('hidden');
  document.body.classList.toggle('upload-active',targetId==='upload');
  const titles={dashboard:'Dashboard',upload:'Upload Invoice',reports:'Report',parties:'Party List',settings:'Settings'};
  const reportTitles={'pending-invoice':'Pending Invoice','upload-invoice-report':'Upload Invoice','ai-report':'AI Report'};
  const title=reportTitles[id]||titles[targetId]||'Dashboard';
  const pageTitle=document.getElementById('pageTitle');
  if(pageTitle) pageTitle.textContent=title;
  const crumb=document.getElementById('crumbTitle');
  if(crumb) crumb.textContent=title;
  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.classList.remove('active'));
  document.querySelectorAll('.nav-parent').forEach(a=>a.classList.remove('active'));
  const link=document.querySelector('.sidebar-nav > a[href="#'+targetId+'"]');
  if(link) link.classList.add('active');
  document.querySelectorAll('.submenu a').forEach(a=>a.classList.remove('active'));
  if(reportIds.includes(id)){
    const reportParent=document.querySelector('.nav-parent');
    if(reportParent) reportParent.classList.add('active');
    const submenu=document.getElementById('reportSubmenu');
    if(submenu) submenu.classList.add('open');
    const subLink=document.querySelector('.submenu a[href="#'+id+'"]');
    if(subLink) subLink.classList.add('active');
    if(typeof showReportSubpage==='function') showReportSubpage(id,subLink);
  }
  window.location.hash=id;
  window.scrollTo({top:0,behavior:'smooth'});
}
function toggleSubmenu(id){const submenu=document.getElementById(id);if(submenu) submenu.classList.toggle('open')}
function showReportSubpage(id,button){document.querySelectorAll('.report-subpage').forEach(x=>x.classList.remove('active'));const target=document.getElementById(id);if(target) target.classList.add('active');document.querySelectorAll('.report-tab').forEach(x=>x.classList.remove('active'));if(button) button.classList.add('active')}
function showSettingsPanel(id,button){document.querySelectorAll('.settings-panel').forEach(x=>x.classList.remove('active'));const target=document.getElementById(id+'-panel');if(target) target.classList.add('active');document.querySelectorAll('.settings-shortcut').forEach(x=>x.classList.remove('active'));if(button) button.classList.add('active')}
function logout(){if(window.confirm('Are you sure you want to logout?')) window.location.href='index.html'}
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showSection(a.getAttribute('href').slice(1))}));
  document.querySelectorAll('.submenu a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showSection(a.getAttribute('href').slice(1))}));
  const id=location.hash.replace('#','')||'dashboard';
  showSection(document.getElementById(id)?id:'dashboard');
});