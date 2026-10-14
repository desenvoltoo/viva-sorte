const STORAGE_KEY='campanha-premiada-settings';
const CHANNEL_NAME='campanha-premiada-sync';

const defaults={
  customerName:'VERA LÚCIA APARECIDA GNANI',
  campaignName:'Familhão da Lotérica',
  message:'Sua participação foi essencial e é com enorme satisfação que anunciamos que você foi contemplado com essa premiação especial.',
  prizeValue:'R$ 50.000,00',
  paymentMethod:'pix',
  paymentCode:'',
  redemptionText:'Sua participação foi essencial e é com enorme satisfação que anunciamos que você foi contemplado com essa premiação especial.',
  companyName:'Empresa responsável',
  cnpj:'49.520.113/0001-07',
  regulationUrl:'#',
  termsUrl:'#',
  updatedAt:0
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
  regulationUrl:'regulationInput',
  termsUrl:'termsInput'
};

function readRaw(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{}}
  catch{return {}}
}
function load(){
  const s={...defaults,...readRaw()};
  if(s.cnpj==='CNPJ não informado') s.cnpj=defaults.cnpj;
  return s;
}
function populate(){
  const s=load();
  Object.entries(ids).forEach(([k,id])=>{
    const el=document.getElementById(id);
    if(el) el.value=s[k]??'';
  });
}
function toast(msg){
  const t=document.createElement('div');
  t.className='toast';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1800);
}

let channel=null;
try{channel=new BroadcastChannel(CHANNEL_NAME)}catch{}

function saveSettings(){
  const current=load();
  const next={...current};
  Object.entries(ids).forEach(([k,id])=>{
    const el=document.getElementById(id);
    next[k]=(el?.value??'').trim();
  });
  next.updatedAt=Date.now();

  // grava de forma atômica e valida imediatamente
  const serialized=JSON.stringify(next);
  localStorage.setItem(STORAGE_KEY,serialized);
  const check=localStorage.getItem(STORAGE_KEY);
  if(check!==serialized) throw new Error('Falha ao confirmar gravação local');

  try{channel?.postMessage({type:'settings-updated',updatedAt:next.updatedAt})}catch{}
  return next;
}

document.getElementById('settingsForm').addEventListener('submit',e=>{
  e.preventDefault();
  try{
    saveSettings();
    toast('Alterações salvas e sincronizadas');
  }catch(err){
    console.error(err);
    toast('Não foi possível salvar. Verifique o armazenamento do navegador.');
  }
});

document.getElementById('restoreButton').addEventListener('click',()=>{
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify({...defaults,updatedAt:Date.now()}));
    populate();
    try{channel?.postMessage({type:'settings-updated',updatedAt:Date.now()})}catch{}
    toast('Padrão restaurado e sincronizado');
  }catch(err){
    console.error(err);
    toast('Não foi possível restaurar.');
  }
});

// Se outra aba alterar, atualiza o formulário também.
window.addEventListener('storage',e=>{
  if(e.key===STORAGE_KEY) populate();
});
try{
  if(channel) channel.onmessage=event=>{
    if(event.data?.type==='settings-updated') populate();
  };
}catch{}

populate();
