const API_URL='https://viva-sorte-api.matheuscosta-tecnologia.workers.dev/config';
const STORAGE_KEY='campanha-premiada-settings';
const TOKEN_KEY='viva-sorte-admin-token';

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
  regulationUrl:'regulationInput',
  termsUrl:'termsInput'
};

function toast(msg,duration=2200){
  const t=document.createElement('div');
  t.className='toast';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),duration);
}

function fillForm(data){
  const s={...defaults,...data};
  Object.entries(ids).forEach(([key,id])=>{
    const el=document.getElementById(id);
    if(el) el.value=s[key]??'';
  });
}

function collectForm(){
  const data={};
  Object.entries(ids).forEach(([key,id])=>{
    const el=document.getElementById(id);
    data[key]=(el?.value??'').trim();
  });
  return data;
}

async function loadGlobalConfig(){
  try{
    const response=await fetch(API_URL+'?t='+Date.now(),{
      method:'GET',
      cache:'no-store',
      headers:{'Accept':'application/json'}
    });
    if(!response.ok) throw new Error('HTTP '+response.status);
    const data=await response.json();
    fillForm(data);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch{}
  }catch(error){
    console.error(error);
    try{
      const cached=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      fillForm(cached);
      toast('Não foi possível acessar a configuração global. Exibindo cópia local.',3500);
    }catch{
      fillForm(defaults);
      toast('Não foi possível acessar a configuração global.',3500);
    }
  }
}

function getAdminToken(){
  let token=sessionStorage.getItem(TOKEN_KEY)||'';
  if(!token){
    token=prompt('Digite o ADMIN_TOKEN configurado no Cloudflare para salvar as alterações:')||'';
    token=token.trim();
    if(token) sessionStorage.setItem(TOKEN_KEY,token);
  }
  return token;
}

async function postConfig(data){
  const token=getAdminToken();
  if(!token) throw new Error('TOKEN_REQUIRED');

  const response=await fetch(API_URL,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+token
    },
    body:JSON.stringify(data)
  });

  if(response.status===401){
    sessionStorage.removeItem(TOKEN_KEY);
    throw new Error('UNAUTHORIZED');
  }

  if(!response.ok){
    const text=await response.text().catch(()=> '');
    throw new Error('HTTP '+response.status+' '+text);
  }

  return response.json();
}

document.getElementById('settingsForm')?.addEventListener('submit',async e=>{
  e.preventDefault();

  const button=e.submitter || document.querySelector('.save-button');
  if(button) button.disabled=true;

  try{
    const data=collectForm();
    await postConfig(data);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch{}
    toast('Alterações salvas globalmente.');
  }catch(error){
    console.error(error);
    if(error.message==='TOKEN_REQUIRED'){
      toast('Salvamento cancelado: token não informado.');
    }else if(error.message==='UNAUTHORIZED'){
      toast('Token incorreto. Tente salvar novamente.');
    }else{
      toast('Erro ao salvar globalmente. Tente novamente.',3500);
    }
  }finally{
    if(button) button.disabled=false;
  }
});

document.getElementById('restoreButton')?.addEventListener('click',async()=>{
  if(!confirm('Restaurar os valores padrão globalmente?')) return;

  try{
    await postConfig(defaults);
    fillForm(defaults);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(defaults))}catch{}
    toast('Padrão restaurado globalmente.');
  }catch(error){
    console.error(error);
    if(error.message==='UNAUTHORIZED'){
      toast('Token incorreto. Tente novamente.');
    }else{
      toast('Não foi possível restaurar globalmente.',3500);
    }
  }
});

loadGlobalConfig();
