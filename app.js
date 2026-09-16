function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.add('hidden'));
  const target=document.getElementById(id);
  if(target) target.classList.remove('hidden');
  const titles={dashboard:'Dashboard',invoices:'All Invoices',upload:'Upload Invoice',parties:'Customers & Suppliers',reports:'Invoice Report',settings:'Settings'};
  document.getElementById('pageTitle').textContent=titles[id]||'Dashboard';
  document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));
  const link=document.querySelector('.sidebar a[href="#'+id+'"]');
  if(link) link.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.sidebar a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showSection(a.getAttribute('href').slice(1));}));
  const id=location.hash.replace('#','')||'dashboard';
  showSection(document.getElementById(id)?id:'dashboard');
});