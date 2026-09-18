(function(){
  const init=()=>{
    const root=document.getElementById('upload'); if(!root||root.dataset.uploadReady==='1')return;
    root.dataset.uploadReady='1';
    const input=root.querySelector('#invoiceFileInput'),drop=root.querySelector('#invoiceDropzone'),choose=root.querySelector('#chooseInvoiceBtn'),process=root.querySelector('#processInvoiceBtn'),card=root.querySelector('#uploadFilesCard'),list=root.querySelector('#uploadFilesList'),summary=root.querySelector('#uploadFileSummary'),clear=root.querySelector('#clearInvoiceBtn'),progress=root.querySelector('#uploadProgress'),fill=root.querySelector('#uploadProgressFill'),status=root.querySelector('#uploadStatus'),percent=root.querySelector('#uploadPercent');
    let files=[];
    const size=b=>b<1048576?Math.round(b/1024)+' KB':(b/1048576).toFixed(1)+' MB';
    const render=()=>{summary.textContent=files.length+' file'+(files.length===1?'':'s');card.hidden=!files.length;list.innerHTML=files.map(f=>'<div class="upload-file-row"><div class="upload-file-icon">PDF</div><div><div class="upload-file-name">'+f.name.replace(/</g,'&lt;')+'</div><div class="upload-file-size">'+size(f.size)+'</div></div><span class="upload-file-state">READY</span></div>').join('')};
    const add=fs=>{files=[...files,...Array.from(fs||[]).filter(f=>f.type==='application/pdf'||/\.pdf$/i.test(f.name)).slice(0,50-files.length)];render();if(files.length){progress.hidden=false;status.textContent=files.length+' invoice'+(files.length===1?'':'s')+' selected';percent.textContent='0%';fill.style.width='0%'}};
    choose.onclick=()=>input.click();input.onchange=()=>{add(input.files);input.value=''};clear.onclick=()=>{files=[];render();progress.hidden=true};
    ['dragenter','dragover'].forEach(e=>drop.addEventListener(e,x=>{x.preventDefault();drop.classList.add('dragover')}));
    ['dragleave','drop'].forEach(e=>drop.addEventListener(e,x=>{x.preventDefault();drop.classList.remove('dragover')}));
    drop.addEventListener('drop',e=>add(e.dataTransfer.files));
    process.onclick=()=>{if(!files.length){input.click();return}let n=0;process.disabled=true;progress.hidden=false;const t=setInterval(()=>{n=Math.min(100,n+10);fill.style.width=n+'%';percent.textContent=n+'%';status.textContent=n<100?'Processing invoices...':'Processing completed';if(n>=100){clearInterval(t);process.disabled=false;list.querySelectorAll('.upload-file-state').forEach(x=>{x.textContent='PROCESSED';x.style.color='#059669'})}},120)};
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
  document.addEventListener('gstui:module-mounted',e=>{if(e.detail?.name==='upload')init()});
})();