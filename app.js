function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.add('hidden'));
  const target=document.getElementById(id);
  if(target) target.classList.remove('hidden');

  const titles={
    dashboard:'Dashboard',
    invoices:'All Invoices',
    upload:'Upload Invoice',
    parties:'Party List',
    reports:'Report',
    settings:'Settings'
  };

  document.getElementById('pageTitle').textContent=titles[id]||'Dashboard';
  const crumb=document.getElementById('crumbTitle');
  if(crumb) crumb.textContent=titles[id]||'Dashboard';

  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.classList.remove('active'));
  const link=document.querySelector('.sidebar-nav > a[href="#'+id+'"]');
  if(link) link.classList.add('active');

  window.location.hash=id;
  window.scrollTo({top:0,behavior:'smooth'});
}

function toggleSubmenu(id){
  const submenu=document.getElementById(id);
  if(submenu) submenu.classList.toggle('open');
}

function logout(){
  const confirmed=window.confirm('Are you sure you want to logout?');
  if(confirmed){
    window.location.href='index.html';
  }
}

window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();
    showSection(a.getAttribute('href').slice(1));
  }));

  document.querySelectorAll('.submenu a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();
    showSection(a.getAttribute('href').slice(1));
  }));

  const id=location.hash.replace('#','')||'dashboard';
  showSection(document.getElementById(id)?id:'dashboard');
});