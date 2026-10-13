const STORAGE_KEY='campanha-premiada-settings';
const defaults={
  customerName:'VERA LÚCIA APARECIDA GNANI',
  campaignName:'Familhão da Lotérica',
  message:'Sua participação foi essencial e é com enorme satisfação que anunciamos que você foi contemplado com essa premiação especial.',
  prizeValue:'R$ 50.000,00',
  paymentMethod:'pix',
  paymentCode:'',
  redemptionText:'Sua participação foi essencial e é com enorme satisfação que anunciamos que você foi contemplado com essa premiação especial.',
  companyName:'Empresa responsável',
  cnpj:'CNPJ não informado',
  contact:'Contato não informado',
  regulationUrl:'#',
  termsUrl:'#'
};
const ids={
  customerName:'nameInput',
  prizeValue:'valueInput',
  campaignName:'campaignInput',
  message:'messageInput',
  paymentMethod:'paymentMethodInput',
  paymentCode:'paymentCodeInput',
  redemptionText:'redemptionTextInput',
  companyName:'companyInput',
  cnpj:'cnpjInput',
  contact:'contactInput',
  regulationUrl:'regulationInput',
  termsUrl:'termsInput'
};
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return {...defaults}}}
function populate(){const s=load();Object.entries(ids).forEach(([k,id])=>{const el=document.getElementById(id);if(el)el.value=s[k]??''})}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
document.getElementById('settingsForm').addEventListener('submit',e=>{
  e.preventDefault();
  const s={};
  Object.entries(ids).forEach(([k,id])=>s[k]=document.getElementById(id).value.trim());
  localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
  toast('Alterações salvas');
});
document.getElementById('restoreButton').addEventListener('click',()=>{
  localStorage.removeItem(STORAGE_KEY);
  populate();
  toast('Padrão restaurado');
});
populate();