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

function buildUploadWorkspace(){
  const section=document.getElementById('upload');
  if(!section || section.dataset.workspaceBuilt==='1') return;
  section.dataset.workspaceBuilt='1';

  const style=document.createElement('style');
  style.id='upload-workspace-style';
  style.textContent=`
    /* Upload page only: compact above-the-fold layout */
    #upload .section-head{margin:0 0 9px;padding:0;min-height:0}
    #upload .section-head .breadcrumb{margin-bottom:2px}
    #upload .section-head h2{margin:2px 0 2px;font-size:22px;line-height:1.05}
    #upload .section-head p{margin:0;font-size:9px;line-height:1.35}
    #upload .upload-workspace{display:grid;grid-template-columns:minmax(285px,.9fr) minmax(390px,1.1fr);grid-template-rows:auto auto;gap:12px;margin-top:0;align-items:stretch}
    #upload .upload-hero-card,#upload .workflow-card,#upload .uploaded-card{background:rgba(255,255,255,.97);border:1px solid #E2E8F0;border-radius:21px;box-shadow:12px 15px 28px rgba(15,23,42,.1),-5px -5px 14px rgba(255,255,255,.92),inset 1px 1px 2px rgba(255,255,255,.95);position:relative;overflow:hidden}
    #upload .upload-hero-card{padding:15px;min-height:225px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(145deg,#fff,#F4F8FC)}
    #upload .upload-hero-card:before{content:"";position:absolute;width:220px;height:220px;border-radius:50%;right:-135px;top:-135px;background:radial-gradient(circle,rgba(37,99,235,.14),transparent 68%);pointer-events:none}
    #upload .upload-hero-card:after{content:"";position:absolute;width:170px;height:170px;border-radius:50%;left:-115px;bottom:-115px;background:radial-gradient(circle,rgba(13,148,136,.13),transparent 68%);pointer-events:none}
    #upload .dropzone-3d{width:100%;min-height:195px;border:1.5px dashed #93C5FD;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:13px;background:linear-gradient(145deg,rgba(239,246,255,.9),rgba(248,250,252,.92));box-shadow:inset 3px 3px 9px rgba(37,99,235,.05),inset -3px -3px 9px rgba(255,255,255,.9);position:relative;overflow:hidden;transition:.25s}
    #upload .dropzone-3d.dragover{border-color:#10B981;background:linear-gradient(145deg,#ECFDF5,#EFF6FF);transform:scale(1.01);box-shadow:0 0 0 5px rgba(16,185,129,.08),inset 3px 3px 9px rgba(16,185,129,.08)}
    #upload .dropzone-3d:before{content:"";position:absolute;inset:-60% -20%;background:linear-gradient(110deg,transparent 42%,rgba(255,255,255,.65) 50%,transparent 58%);transform:translateX(-55%);animation:uploadSweep 4.5s ease-in-out infinite;pointer-events:none}
    #upload .upload-orb-3d{width:62px;height:62px;border-radius:21px;display:grid;place-items:center;background:linear-gradient(145deg,#60A5FA,#1E3A8A);color:#fff;font-size:29px;font-weight:950;box-shadow:9px 11px 19px rgba(30,58,138,.24),inset 2px 2px 4px rgba(255,255,255,.38),inset -3px -3px 6px rgba(15,23,42,.2);transform:rotate(-7deg);animation:uploadFloat 2.4s ease-in-out infinite;position:relative;z-index:1}
    #upload .dropzone-3d h3{font-size:15px;margin:9px 0 3px;color:#0F172A;position:relative;z-index:1}
    #upload .dropzone-3d p{font-size:9px;color:#64748B;margin:0 0 9px;position:relative;z-index:1}
    #upload .upload-choose-btn{border:0;background:linear-gradient(145deg,#3B82F6,#1E3A8A);color:#fff;border-radius:10px;padding:8px 13px;font-size:9px;font-weight:900;cursor:pointer;box-shadow:6px 7px 12px rgba(37,99,235,.22),inset 1px 1px 2px rgba(255,255,255,.3);position:relative;z-index:1;transition:.2s}
    #upload .upload-choose-btn:hover{transform:translateY(-3px);box-shadow:9px 11px 18px rgba(37,99,235,.27)}
    #upload .upload-limit{font-size:7px;color:#94A3B8;margin-top:7px;position:relative;z-index:1}
    #upload .upload-progress-wrap{width:100%;margin-top:9px;position:relative;z-index:1}
    #upload .upload-progress-track{height:6px;border-radius:99px;background:#E2E8F0;overflow:hidden;box-shadow:inset 2px 2px 4px rgba(15,23,42,.08)}
    #upload .upload-progress-fill{height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#2563EB,#0D9488,#10B981);box-shadow:0 0 12px rgba(37,99,235,.3);transition:width .35s ease}
    #upload .upload-progress-label{display:flex;justify-content:space-between;font-size:7px;font-weight:800;color:#64748B;margin-top:4px}
    #upload .process-main-btn{width:100%;margin-top:7px;border:1px solid rgba(16,185,129,.3);border-radius:11px;padding:9px 12px;color:#fff;background:linear-gradient(145deg,#10B981,#047857);font-size:9px;font-weight:950;letter-spacing:.3px;cursor:pointer;box-shadow:7px 8px 14px rgba(5,150,105,.2),inset 1px 1px 2px rgba(255,255,255,.3);position:relative;overflow:hidden;transition:.2s}
    #upload .process-main-btn:before{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.35) 50%,transparent 65%);transform:translateX(-110%);animation:buttonShine 2.8s ease-in-out infinite}
    #upload .process-main-btn:hover{transform:translateY(-3px);box-shadow:10px 12px 20px rgba(5,150,105,.25)}
    #upload .process-main-btn span{position:relative;z-index:1}
    #upload .workflow-card{padding:14px 16px;min-height:225px;background:linear-gradient(145deg,#FFFFFF,#F8FAFC)}
    #upload .workflow-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px}
    #upload .workflow-title{font-family:"Trebuchet MS","Segoe UI",sans-serif;font-size:16px;font-weight:950;letter-spacing:1.1px;background:linear-gradient(90deg,#1E3A8A,#2563EB,#0D9488,#1E3A8A);background-size:240% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:workflowGradient 3.8s linear infinite,workflowFloat 2.2s ease-in-out infinite;margin:0}
    #upload .workflow-subtitle{font-size:8px;color:#64748B;margin-top:3px;line-height:1.3}
    #upload .workflow-live{padding:5px 8px;border-radius:9px;background:#ECFDF5;color:#047857;font-size:7px;font-weight:900;white-space:nowrap;box-shadow:inset 1px 1px 2px #fff,3px 4px 8px rgba(5,150,105,.08)}
    #upload .workflow-list{display:flex;flex-direction:column;gap:3px}
    #upload .workflow-step{display:grid;grid-template-columns:27px 1fr auto;align-items:center;gap:8px;padding:5px 8px;border-radius:10px;border:1px solid transparent;transition:.25s;position:relative}
    #upload .workflow-step:after{content:"";position:absolute;left:21px;top:32px;width:2px;height:10px;background:#E2E8F0}
    #upload .workflow-step:last-child:after{display:none}
    #upload .workflow-step.active{background:linear-gradient(90deg,#EFF6FF,#ECFDF5);border-color:#BFDBFE;box-shadow:5px 7px 13px rgba(37,99,235,.08);transform:translateX(3px)}
    #upload .workflow-step.done{background:#F8FAFC}
    #upload .step-number{width:27px;height:27px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(145deg,#E2E8F0,#CBD5E1);color:#64748B;font-size:8px;font-weight:950;box-shadow:3px 4px 7px rgba(15,23,42,.08),inset 1px 1px 2px #fff}
    #upload .workflow-step.active .step-number{background:linear-gradient(145deg,#60A5FA,#2563EB);color:#fff;box-shadow:4px 5px 9px rgba(37,99,235,.22);animation:stepPulse 1.5s ease-in-out infinite}
    #upload .workflow-step.done .step-number{background:linear-gradient(145deg,#34D399,#059669);color:#fff}
    #upload .step-copy strong{display:block;font-size:11px;font-weight:850;color:#0F172A;line-height:1.1}.step-copy small{display:block;font-size:7px;color:#64748B;margin-top:2px;line-height:1.1}
    #upload .step-status{font-size:7px;font-weight:950;color:#94A3B8}.workflow-step.active .step-status{color:#2563EB}.workflow-step.done .step-status{color:#059669}
    #upload .uploaded-card{grid-column:1/-1;padding:12px 14px;min-height:150px}
    #upload .uploaded-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}.uploaded-head h3{margin:0;font-size:13px;font-weight:950;letter-spacing:.5px}.uploaded-count{font-size:7px;color:#64748B;background:#F1F5F9;padding:5px 8px;border-radius:8px;font-weight:900}
    #upload .invoice-list{display:flex;flex-direction:column;gap:5px;max-height:142px;overflow:auto}
    #upload .invoice-row{display:grid;grid-template-columns:30px minmax(130px,1.2fr) minmax(90px,.8fr) 85px 95px 70px;align-items:center;gap:8px;padding:7px 9px;border:1px solid #E2E8F0;border-radius:10px;background:linear-gradient(145deg,#fff,#F8FAFC);box-shadow:4px 6px 12px rgba(15,23,42,.06),inset 1px 1px 2px #fff;animation:rowIn .35s ease both}
    #upload .pdf-badge{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(145deg,#FCA5A5,#EF4444);color:#fff;font-size:8px;font-weight:950;box-shadow:4px 5px 8px rgba(239,68,68,.16)}
    #upload .invoice-file strong,#upload .invoice-file small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.invoice-file strong{font-size:9px;color:#0F172A;font-weight:850}.invoice-file small{font-size:7px;color:#94A3B8;margin-top:2px}.invoice-meta{font-size:8px;color:#475569}.invoice-amount{font-size:9px;font-weight:900;color:#0F172A}.invoice-status{font-size:7px;font-weight:950;padding:5px 6px;border-radius:7px;text-align:center;background:#EFF6FF;color:#2563EB}.invoice-status.done{background:#ECFDF5;color:#047857}.invoice-status.warn{background:#FFFBEB;color:#B45309}
    #upload .email-toast{position:fixed;right:28px;bottom:28px;width:310px;padding:14px 15px;border-radius:16px;background:linear-gradient(145deg,#fff,#F8FAFC);border:1px solid #FDE68A;box-shadow:12px 15px 28px rgba(15,23,42,.18),inset 1px 1px 2px #fff;z-index:180;animation:toastIn .35s ease both}
    #upload .email-toast .toast-top{display:flex;align-items:center;gap:9px}.email-toast .toast-icon{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(145deg,#FBBF24,#F59E0B);color:#fff;font-weight:950;box-shadow:4px 5px 8px rgba(245,158,11,.18)}.email-toast strong{font-size:10px;color:#0F172A}.email-toast p{font-size:8px;color:#64748B;line-height:1.5;margin:9px 0}.email-toast button{border:0;border-radius:9px;padding:7px 10px;background:#2563EB;color:#fff;font-size:8px;font-weight:900;cursor:pointer;box-shadow:3px 4px 8px rgba(37,99,235,.18)}
    @keyframes uploadFloat{0%,100%{transform:translateY(0) rotate(-7deg)}50%{transform:translateY(-7px) rotate(-4deg)}}
    @keyframes uploadSweep{0%,55%{transform:translateX(-55%)}80%,100%{transform:translateX(55%)}}
    @keyframes buttonShine{0%,55%{transform:translateX(-110%)}80%,100%{transform:translateX(110%)}}
    @keyframes stepPulse{0%,100%{box-shadow:4px 5px 9px rgba(37,99,235,.22),0 0 0 0 rgba(37,99,235,.16)}50%{box-shadow:4px 5px 9px rgba(37,99,235,.22),0 0 0 6px rgba(37,99,235,0)}}
    @keyframes rowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @media(max-width:900px){#upload .upload-workspace{grid-template-columns:1fr}.invoice-row{grid-template-columns:30px 1fr 70px}.invoice-row>:nth-child(3),.invoice-row>:nth-child(5){display:none}}
    @media(max-width:560px){#upload .section-head h2{font-size:20px}#upload .upload-hero-card,#upload .workflow-card,#upload .uploaded-card{padding:11px}.invoice-row{grid-template-columns:30px 1fr 65px}.email-toast{right:14px!important;left:14px;width:auto!important;bottom:18px!important}}
  `;
  document.head.appendChild(style);

  section.innerHTML=`
    <div class="section-head">
      <div><div class="breadcrumb">AI INVOICE PROCESSING</div><h2>Upload Invoice</h2><p>Upload, process and automatically organize your GST invoices with AI.</p></div>
    </div>
    <div class="upload-workspace">
      <div class="upload-hero-card">
        <div class="dropzone-3d" id="invoiceDropzone">
          <div class="upload-orb-3d">↥</div>
          <h3>Upload Invoice</h3>
          <p>Drag & Drop your PDF invoice here</p>
          <button class="upload-choose-btn" id="chooseInvoiceBtn" type="button">＋ Choose Invoice</button>
          <input id="invoiceFileInput" type="file" accept="application/pdf,.pdf" multiple hidden>
          <div class="upload-limit">PDF only • Maximum 50 files • 25 MB per file</div>
          <div class="upload-progress-wrap">
            <div class="upload-progress-track"><div class="upload-progress-fill" id="uploadProgressFill"></div></div>
            <div class="upload-progress-label"><span id="uploadProgressText">Ready to upload</span><strong id="uploadPercent">0%</strong></div>
          </div>
          <button class="process-main-btn" id="processInvoiceBtn" type="button"><span>↑ Upload & Process</span></button>
        </div>
      </div>
      <div class="workflow-card">
        <div class="workflow-head"><div><h3 class="workflow-title">AUTOMATED WORKFLOW</h3><div class="workflow-subtitle">Invoice processing will move through every step automatically.</div></div><span class="workflow-live" id="workflowLive">● READY</span></div>
        <div class="workflow-list" id="workflowList">
          <div class="workflow-step" data-step="1"><div class="step-number">01</div><div class="step-copy"><strong>Uploading Invoice</strong><small>Securely receiving PDF files</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="2"><div class="step-number">02</div><div class="step-copy"><strong>AI Invoice Extraction</strong><small>Reading invoice fields with Gemini AI</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="3"><div class="step-number">03</div><div class="step-copy"><strong>GSTIN Detection</strong><small>Validating supplier and buyer GSTIN</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="4"><div class="step-number">04</div><div class="step-copy"><strong>Buyer / Seller Classification</strong><small>Identifying Purchase or Sales invoice</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="5"><div class="step-number">05</div><div class="step-copy"><strong>Duplicate Invoice Check</strong><small>Checking party and invoice number</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="6"><div class="step-number">06</div><div class="step-copy"><strong>Google Drive Storage</strong><small>Saving invoice in the correct folder</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="7"><div class="step-number">07</div><div class="step-copy"><strong>Database Indexing</strong><small>Updating reports and invoice records</small></div><span class="step-status">WAITING</span></div>
          <div class="workflow-step" data-step="8"><div class="step-number">08</div><div class="step-copy"><strong>Email Notification</strong><small>Preparing party email workflow</small></div><span class="step-status">WAITING</span></div>
        </div>
      </div>
      <div class="uploaded-card">
        <div class="uploaded-head"><h3>UPLOADED INVOICES</h3><span class="uploaded-count" id="uploadedCount">0 FILES</span></div>
        <div class="invoice-list" id="invoiceList"><div style="padding:18px;text-align:center;color:#94A3B8;font-size:8px">Uploaded invoices will appear here automatically.</div></div>
      </div>
    </div>`;

  const input=document.getElementById('invoiceFileInput');
  const choose=document.getElementById('chooseInvoiceBtn');
  const process=document.getElementById('processInvoiceBtn');
  const drop=document.getElementById('invoiceDropzone');
  const list=document.getElementById('invoiceList');
  const count=document.getElementById('uploadedCount');
  const fill=document.getElementById('uploadProgressFill');
  const percent=document.getElementById('uploadPercent');
  const progressText=document.getElementById('uploadProgressText');
  const live=document.getElementById('workflowLive');
  let files=[];
  let processing=false;

  function formatSize(bytes){if(bytes<1024)return bytes+' B';if(bytes<1024*1024)return (bytes/1024).toFixed(0)+' KB';return (bytes/1024/1024).toFixed(1)+' MB'}
  function renderFiles(){
    count.textContent=files.length+' FILE'+(files.length===1?'':'S');
    if(!files.length){list.innerHTML='<div style="padding:18px;text-align:center;color:#94A3B8;font-size:8px">Uploaded invoices will appear here automatically.</div>';return}
    list.innerHTML=files.map((f,i)=>`<div class="invoice-row"><div class="pdf-badge">PDF</div><div class="invoice-file"><strong>${f.name.replace(/</g,'&lt;')}</strong><small>${formatSize(f.size)} • Invoice ${String(i+1).padStart(3,'0')}</small></div><div class="invoice-meta">${i%2?'Sales':'Purchase'}</div><div class="invoice-amount">${f.amount||'Pending'}</div><div class="invoice-status ${f.status==='Completed'?'done':f.status==='Email Missing'?'warn':''}">${f.status||'Ready'}</div><div class="invoice-meta">${f.progress||0}%</div></div>`).join('');
  }
  function resetWorkflow(){document.querySelectorAll('#workflowList .workflow-step').forEach(s=>{s.classList.remove('active','done');s.querySelector('.step-status').textContent='WAITING'})}
  function setWorkflow(step){document.querySelectorAll('#workflowList .workflow-step').forEach(s=>{const n=Number(s.dataset.step);s.classList.toggle('done',n<step);s.classList.toggle('active',n===step);s.querySelector('.step-status').textContent=n<step?'✓ DONE':n===step?'PROCESSING':'WAITING'})}
  function notifyMissingEmail(party){
    document.querySelector('.email-toast')?.remove();
    const toast=document.createElement('div');toast.className='email-toast';toast.innerHTML=`<div class="toast-top"><div class="toast-icon">✉</div><strong>Party Email Missing</strong></div><p>${party} के लिए email ID उपलब्ध नहीं है। Full email ID add करें ताकि invoice email भेजा जा सके।</p><button type="button">＋ Add Email</button>`;
    document.body.appendChild(toast);
    toast.querySelector('button').onclick=()=>{toast.remove();showSection('parties')};
    setTimeout(()=>toast.remove(),7000);
  }
  function addFiles(selected){
    const incoming=Array.from(selected||[]).filter(f=>f.type==='application/pdf'||/\.pdf$/i.test(f.name)).slice(0,50);
    if(!incoming.length)return;
    files=[...files,...incoming].slice(0,50).map((f)=>({name:f.name,size:f.size,status:'Ready',progress:0,amount:'Pending'}));
    renderFiles();
    progressText.textContent=files.length+' invoice'+(files.length===1?'':'s')+' ready';
  }
  choose.addEventListener('click',()=>input.click());
  input.addEventListener('change',()=>{addFiles(input.files);input.value=''});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('dragover')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('dragover')}));
  drop.addEventListener('drop',e=>addFiles(e.dataTransfer.files));
  process.addEventListener('click',()=>{
    if(processing||!files.length){if(!files.length)choose.click();return}
    processing=true;process.style.pointerEvents='none';resetWorkflow();live.textContent='● PROCESSING';live.style.background='#EFF6FF';live.style.color='#2563EB';
    let step=1;let value=0;
    const timer=setInterval(()=>{
      value=Math.min(100,value+Math.floor(Math.random()*9)+5);
      step=Math.min(8,Math.max(1,Math.ceil(value/12.5)));
      fill.style.width=value+'%';percent.textContent=value+'%';progressText.textContent=step<8?'Processing invoice • Step '+step+' of 8':'Finalizing invoice';setWorkflow(step);
      files=files.map(f=>({...f,progress:value,status:step>=8?'Completed':'Processing'}));renderFiles();
      if(value>=100){clearInterval(timer);setTimeout(()=>{processing=false;process.style.pointerEvents='auto';live.textContent='● COMPLETED';live.style.background='#ECFDF5';live.style.color='#047857';progressText.textContent='Processing completed successfully';files=files.map(f=>({...f,progress:100,status:'Completed'}));renderFiles();notifyMissingEmail('Invoice party');},350)}
    },420);
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
  buildUploadWorkspace();
  const id=location.hash.replace('#','')||'dashboard';
  showSection(document.getElementById(id)?id:'dashboard');
});