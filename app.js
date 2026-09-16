function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.add('hidden'));
  const target=document.getElementById(id);
  if(target) target.classList.remove('hidden');

  const titles={
    dashboard:'Dashboard',
    invoices:'All Invoices',
    upload:'Upload Invoice',
    parties:'Customers & Suppliers',
    reports:'Invoice Report',
    settings:'Settings'
  };

  document.getElementById('pageTitle').textContent=titles[id]||'Dashboard';
  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.classList.remove('active'));
  document.querySelectorAll('.submenu a').forEach(a=>a.classList.remove('active'));

  if(id==='dashboard' || id==='parties' || id==='reports' || id==='settings'){
    const link=document.querySelector('.sidebar-nav > a[href="#'+id+'"]');
    if(link) link.classList.add('active');
  }

  if(id==='invoices' || id==='upload'){
    const parent=document.querySelector('.nav-parent');
    if(parent) parent.classList.add('active');
    const subLink=document.querySelector('.submenu a[href="#'+id+'"]');
    if(subLink) subLink.classList.add('active');
    const submenu=document.getElementById('invoiceSubmenu');
    if(submenu) submenu.classList.add('open');
  }

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