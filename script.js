const intro=document.getElementById('intro'),mainSite=document.getElementById('mainSite');
let introDone=false;
const phrases=[['pssst... hey you.','go on. you know you want to.','CLICK ME'],['uy ikaw! oo, ikaw. 👀','konting click lang, promise.','CLICK MEEE'],['hoy, may opening kami.','secret reveal? ikaw bahala. 😏','TAP ME'],['wag ka lang silip nang silip haha.','sige na nga, pindutin mo na.','CLICK ME!']];
let phraseIndex=0;
const whisper=document.getElementById('whisper'),note=document.getElementById('introNote'),clickText=document.getElementById('clickText');
function cyclePhrases(){if(introDone)return;phraseIndex=(phraseIndex+1)%phrases.length;whisper.textContent=phrases[phraseIndex][0];note.textContent=phrases[phraseIndex][1];clickText.textContent=phrases[phraseIndex][2];}
const phraseTimer=setInterval(cyclePhrases,2900);
function enterSite(){if(introDone)return;introDone=true;clearInterval(phraseTimer);intro.classList.add('revealing');setTimeout(()=>{intro.classList.add('leaving');mainSite.classList.remove('hidden');window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});setTimeout(()=>intro.remove(),1050)},650)}
document.getElementById('clickMe').addEventListener('click',enterSite);
document.getElementById('skipIntro').addEventListener('click',enterSite);

const roles={
 sales:{title:'Field Sales Representative',intro:'A field-based position for someone passionate about helping people and rural development. You will promote the benefits of solar and renewable energy, build relationships in communities, and support local outreach.',responsibilities:['Promote the benefits of solar and renewable energy to customers and communities.','Conduct fieldwork and visit assigned communities; travel to other areas when needed.','Build trust with customers and provide helpful, respectful customer service.','Communicate field activity, customer feedback, and sales updates to the team.'],qualifications:['At least vocational graduate or college level.','Passionate about helping people and rural development.','Strong customer service orientation.','Willing to do fieldwork and travel to different communities; nationwide assignment may be needed. Staff house is provided for nationwide assignment, as stated in the hiring poster.','Valid driver’s license and motorcycle required upon regularization, according to the hiring poster.'],benefits:['Meal allowance: ₱100 per day.','Transportation allowance: up to ₱325 per day.','Communication allowance: ₱350 per month.','Sales incentives: up to ₱25,000, depending on performance.','Insurance coverage: health insurance, life insurance, personal accident insurance, and sick leave.','Mandatory benefits: SSS, Pag-IBIG, PhilHealth, 13th-month pay, and retirement pay.','Leave benefits: vacation, sick, birthday, and emergency leave.','Career advancement, promotion opportunities, skills development, and employee support programs.'],hubs:'Isabela 1 Hub — Santiago City, Diadi, Jones, Ramon, Alicia, Echague, Alfonso Lista, Cauayan, San Mateo. Isabela 2 Hub — Ilagan City, Tumauini, Gamu, Burgos, Quezon, Roxas, Aurora, Cabatuan. Cagayan Hub — Tuguegarao, Tuao, Alcala, Solana.',poster:'/assets/field-sales-poster.png'},
 logtech:{title:'Logtech Associate',intro:'The Logistics Technician supports daily hub operations, including product handling, basic electrical work, inventory checking, and addressing customer concerns.',responsibilities:['Support daily hub operations and handle products carefully.','Check, count, arrange, and organize stock at the hub.','Perform basic electrical work appropriate to your skills and assigned duties.','Listen to customer concerns and assist with resolving or referring them.','Use Excel and other basic computer programs for operational tasks.'],qualifications:['At least vocational graduate or college level.','Knowledge of simple to more complex electrical work.','Experience organizing or counting stock at a hub.','Comfortable assisting customers and addressing their concerns.','Able to use Excel and other basic computer programs.'],benefits:['The supplied Logtech Associate poster does not specify compensation, allowances, or benefits. Please confirm these details with recruitment before accepting an offer.'],hubs:'Isabela 1 Hub, Isabela 2 Hub, or Cagayan Hub. Confirm the specific hub and coverage area with recruitment.',poster:'/assets/logtech-associate-poster.png'}
};
let activeRole='sales';
const roleModal=document.getElementById('roleModal'),applyModal=document.getElementById('applyModal');
function openRole(key){activeRole=key;const r=roles[key];document.getElementById('modalTitle').textContent=r.title;document.getElementById('modalIntro').textContent=r.intro;document.getElementById('responsibilities').innerHTML=r.responsibilities.map(x=>`<li>${escapeHTML(x)}</li>`).join('');document.getElementById('qualifications').innerHTML=r.qualifications.map(x=>`<li>${escapeHTML(x)}</li>`).join('');document.getElementById('benefits').innerHTML=r.benefits.map(x=>`<li>${escapeHTML(x)}</li>`).join('');document.getElementById('hubAreas').textContent=r.hubs;document.getElementById('rolePoster').src=r.poster;document.getElementById('rolePoster').alt='Hiring poster for '+r.title;roleModal.classList.remove('hidden');document.body.style.overflow='hidden'}
function openApply(){roleModal.classList.add('hidden');applyModal.classList.remove('hidden');document.getElementById('positionInput').value=roles[activeRole].title;document.getElementById('applyTitle').textContent='Apply: '+roles[activeRole].title;document.getElementById('salesQuestions').classList.toggle('hidden',activeRole!=='sales');document.body.style.overflow='hidden'}
function closeModals(){roleModal.classList.add('hidden');applyModal.classList.add('hidden');document.body.style.overflow=''}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
document.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>openRole(b.dataset.role)));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModals));
document.getElementById('applyBtn').addEventListener('click',openApply);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals()});

const form=document.getElementById('applicationForm');
form.addEventListener('submit',async e=>{
 e.preventDefault();
 const message=document.getElementById('formMessage'),submit=form.querySelector('[type="submit"]');
 const file=form.elements.resume.files[0];
 message.className='form-message';message.textContent='';
 if(!file){message.textContent='Please attach your resume before submitting.';return;}
 const allowed=['pdf','doc','docx'];const ext=file.name.split('.').pop().toLowerCase();
 if(!allowed.includes(ext)){message.textContent='Resume must be a PDF, DOC, or DOCX file.';return;}
 // Keep below Vercel's serverless request-body limit and allow headroom for Base64 expansion.
 if(file.size>3*1024*1024){message.textContent='Please upload a resume no larger than 3 MB.';return;}
 const values=new FormData(form);
 const base64=await fileToBase64(file);
 const payload={
   position:values.get('position'),fullName:values.get('fullName'),email:values.get('email'),
   contactNumber:values.get('phone'),preferredLocation:values.get('location'),
   motorcycle:activeRole==='sales' ? form.elements.motorcycle.checked : false,
   travel:activeRole==='sales' ? form.elements.travel.checked : false,
   consent:form.elements.consent.checked,website:'',
   resumeData:{fileName:file.name,mimeType:file.type||mimeFromExt(ext),base64:base64}
 };
 submit.disabled=true;submit.textContent='SUBMITTING…';
 try{
   const response=await fetch('/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const result=await response.json().catch(()=>({success:false,message:'Unexpected response from recruitment service.'}));
   if(!response.ok||!result.success)throw new Error(result.message||'Unable to submit. Please try again.');
   message.classList.add('success');message.textContent=`Application received! Your reference number is ${result.applicantId}. Please check your email for confirmation.`;
   form.reset();
 }catch(error){message.classList.add('error');message.textContent=error.message||'Unable to reach the recruitment system. Please try again later.';}
 finally{submit.disabled=false;submit.innerHTML='SUBMIT APPLICATION <span>↗</span>';message.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
});
function fileToBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=()=>reject(new Error('Unable to read your resume file.'));reader.readAsDataURL(file);});}
function mimeFromExt(ext){return ext==='pdf'?'application/pdf':ext==='doc'?'application/msword':'application/vnd.openxmlformats-officedocument.wordprocessingml.document';}
