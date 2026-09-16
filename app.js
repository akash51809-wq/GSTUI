function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.add('hidden'));
  const reportIds=['pending-invoice','upload-invoice-report','ai-report'];
  const targetId=reportIds.includes(id)?'reports':id;
  const target=document.getElementById(targetId);
  if(target) target.classList.remove('hidden');

  const titles={dashboard:'Dashboard',upload:'Upload Invoice',reports:'Report',parties:'Party List',settings:'Settings'};
  const reportTitles={'pending-invoice':'Pending Invoice','upload-invoice-report':'Upload Invoice','ai-report':'AI Report'};
  const title=reportTitles[id]||titles[targetId]||'Dashboard';
  document.getElementById('pageTitle').textContent=title;
  const crumb=document.getElementById('crumbTitle');
  if(crumb) crumb.textContent=title;

  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.classList.remove('active'));
  document.querySelectorAll('.nav-parent').forEach(a=>a.classList.remove('active'));
  const link=document.querySelector('.sidebar-nav > a[href="#'+targetId+'"]');
  if(link) link.classList.add('active');
  if(reportIds.includes(id)){
    const reportParent=document.querySelector('.nav-parent');
    if(reportParent) reportParent.classList.add('active');
    const submenu=document.getElementById('reportSubmenu');
    if(submenu) submenu.classList.add('open');
    const subLink=document.querySelector('.submenu a[href="#'+id+'"]');
    if(subLink) subLink.classList.add('active');
    showReportSubpage(id,subLink);
  }
  window.location.hash=id;
  window.scrollTo({top:0,behavior:'smooth'});
}

function toggleSubmenu(id){
  const submenu=document.getElementById(id);
  if(submenu) submenu.classList.toggle('open');
}

function showReportSubpage(id,button){
  document.querySelectorAll('.report-subpage').forEach(x=>x.classList.remove('active'));
  const target=document.getElementById(id);
  if(target) target.classList.add('active');
  document.querySelectorAll('.report-tab').forEach(x=>x.classList.remove('active'));
  if(button) button.classList.add('active');
}

function showSettingsPanel(id,button){
  document.querySelectorAll('.settings-panel').forEach(x=>x.classList.remove('active'));
  const target=document.getElementById(id+'-panel');
  if(target) target.classList.add('active');
  document.querySelectorAll('.settings-shortcut').forEach(x=>x.classList.remove('active'));
  if(button) button.classList.add('active');
}

function logout(){
  const confirmed=window.confirm('Are you sure you want to logout?');
  if(confirmed) window.location.href='index.html';
}

function enhanceUploadPage(){
  if(document.getElementById('uploadSubmitBtn')) return;

  const uploadSection=document.getElementById('upload');
  if(!uploadSection) return;

  const dropzone=uploadSection.querySelector('.dropzone');
  const chooseBtn=dropzone?.querySelector('.primary');
  const workflowTitle=uploadSection.querySelector('.process-info .info-title');
  const workflowItems=uploadSection.querySelectorAll('.process-info>div:not(.info-title)');

  const style=document.createElement('style');
  style.id='upload-enhancement-style';
  style.textContent=`
    .upload-actions{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px}
    .upload-submit-btn{border:1px solid rgba(16,185,129,.35);background:linear-gradient(145deg,#10B981,#047857);color:#fff;padding:11px 19px;border-radius:12px;font-size:10px;font-weight:900;letter-spacing:.2px;cursor:pointer;box-shadow:7px 8px 15px rgba(5,150,105,.22),inset 1px 1px 2px rgba(255,255,255,.3);transition:.22s;position:relative;overflow:hidden}
    .upload-submit-btn:before{content:"";position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.32),transparent);transform:skewX(-20deg);animation:submitShine 2.8s ease-in-out infinite}
    .upload-submit-btn:hover{transform:translateY(-3px);box-shadow:10px 13px 21px rgba(5,150,105,.27)}
    .upload-submit-btn span{position:relative;z-index:1}
    .process-info .info-title{font-family:"Trebuchet MS","Segoe UI",sans-serif;font-size:16px;font-weight:950;letter-spacing:1.8px;color:#0F172A;line-height:1.25;margin-bottom:14px;position:relative;display:inline-block;background:linear-gradient(90deg,#1E3A8A,#2563EB,#0D9488,#1E3A8A);background-size:240% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:workflowGradient 3.8s linear infinite,workflowFloat 2.2s ease-in-out infinite}
    .process-info .info-title:after{content:"";position:absolute;left:0;bottom:-6px;width:62%;height:3px;border-radius:99px;background:linear-gradient(90deg,#2563EB,#10B981,transparent);box-shadow:0 2px 8px rgba(37,99,235,.25);animation:workflowLine 2s ease-in-out infinite}
    .process-info>div:not(.info-title){font-size:11px;font-weight:650;color:#334155;line-height:1.55;margin:9px 0;display:flex;align-items:center;gap:8px}
    .process-info>div:not(.info-title):first-letter{color:#10B981}
    @keyframes workflowGradient{0%{background-position:0% center}100%{background-position:240% center}}
    @keyframes workflowFloat{0%,100%{transform:translateY(0);filter:drop-shadow(0 2px 3px rgba(37,99,235,.08))}50%{transform:translateY(-2px);filter:drop-shadow(0 5px 8px rgba(37,99,235,.18))}}
    @keyframes workflowLine{0%,100%{width:38%;opacity:.65}50%{width:78%;opacity:1}}
    @keyframes submitShine{0%,55%{left:-80%}80%,100%{left:135%}}
    @media(max-width:760px){.process-info .info-title{font-size:14px;letter-spacing:1.3px}.process-info>div:not(.info-title){font-size:10px}.upload-submit-btn{padding:10px 17px}}
  `;
  document.head.appendChild(style);

  if(dropzone && chooseBtn){
    const actions=document.createElement('div');
    actions.className='upload-actions';
    chooseBtn.parentNode.insertBefore(actions,chooseBtn);
    actions.appendChild(chooseBtn);

    const submitBtn=document.createElement('button');
    submitBtn.id='uploadSubmitBtn';
    submitBtn.type='button';
    submitBtn.className='upload-submit-btn';
    submitBtn.innerHTML='<span>✓ Submit Invoice</span>';
    submitBtn.addEventListener('click',()=>{
      submitBtn.innerHTML='<span>✓ Invoice Ready for Processing</span>';
      submitBtn.style.pointerEvents='none';
      setTimeout(()=>{
        submitBtn.innerHTML='<span>✓ Submit Invoice</span>';
        submitBtn.style.pointerEvents='auto';
      },1800);
    });
    actions.appendChild(submitBtn);
  }

  workflowItems.forEach((item,index)=>{
    item.style.animationDelay=(index*90)+'ms';
  });
}

window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.sidebar-nav > a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault(); showSection(a.getAttribute('href').slice(1));
  }));
  document.querySelectorAll('.submenu a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault(); showSection(a.getAttribute('href').slice(1));
  }));
  enhanceUploadPage();
  const id=location.hash.replace('#','')||'dashboard';
  showSection(document.getElementById(id)?id:'dashboard');
});