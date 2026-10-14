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
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return {...defaults}}}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value||''}
function render(){
  const s=load();
  setText('customerName',(s.customerName||defaults.customerName).toUpperCase());
  setText('campaignName',s.campaignName);
  setText('message',s.message);
  setText('prizeValue',s.prizeValue);
  setText('redeemCustomerName',(s.customerName||defaults.customerName).toUpperCase());
  setText('redeemCampaignName',s.campaignName);
  setText('redeemText',s.redemptionText||s.message);
  setText('redeemPrizeValue',s.prizeValue);
  setText('paymentMethodLabel',s.paymentMethod==='boleto'?'Boleto':'PIX');
  setText('paymentCodeDisplay',s.paymentCode||'Código não configurado');
  setText('companyName',s.companyName);
  setText('cnpj',s.cnpj);
  setText('contact',s.contact);
  const regulation=document.getElementById('regulationLink'); if(regulation) regulation.href=s.regulationUrl||'#';
  const terms=document.getElementById('termsLink'); if(terms) terms.href=s.termsUrl||'#';
}
function showRedemption(){
  document.getElementById('winnerView').hidden=true;
  document.getElementById('redemptionView').hidden=false;
  window.scrollTo({top:0,behavior:'smooth'});
}
function showWinner(){
  document.getElementById('redemptionView').hidden=true;
  document.getElementById('winnerView').hidden=false;
  window.scrollTo({top:0,behavior:'smooth'});
}
async function copyCode(){
  const s=load();
  const code=(s.paymentCode||'').trim();
  const feedback=document.getElementById('copyFeedback');
  if(!code){feedback.textContent='Nenhum código foi configurado no painel.';return}
  try{await navigator.clipboard.writeText(code)}
  catch{
    const ta=document.createElement('textarea');
    ta.value=code; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  feedback.textContent='Código copiado.';
  setTimeout(()=>feedback.textContent='',1800);
}
function launchConfetti(){
  const layer=document.getElementById('confettiLayer');
  if(!layer) return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches){layer.remove();return}
  const colors=['#c61fb0','#7a2cff','#ff8a4c','#ffcf3f','#1ec8a5'];
  const fragment=document.createDocumentFragment();
  for(let i=0;i<120;i++){
    const piece=document.createElement('i');
    piece.className='confetti-piece';
    piece.style.left=(Math.random()*100)+'%';
    piece.style.setProperty('--c',colors[Math.floor(Math.random()*colors.length)]);
    piece.style.setProperty('--r',(Math.random()*360)+'deg');
    piece.style.setProperty('--spin',(540+Math.random()*540)+'deg');
    piece.style.setProperty('--drift',((Math.random()*220)-110)+'px');
    piece.style.animationDelay=(Math.random()*.3)+'s';
    piece.style.animationDuration=(4+Math.random()*.7)+'s';
    piece.style.width=(6+Math.random()*8)+'px';
    piece.style.height=(10+Math.random()*12)+'px';
    fragment.appendChild(piece);
  }
  layer.appendChild(fragment);
  let cleanupTimer;
  function cleanup(){
    clearTimeout(cleanupTimer);
    motion.removeEventListener('change',onMotionChange);
    layer.remove();
  }
  function onMotionChange(event){if(event.matches) cleanup()}
  motion.addEventListener('change',onMotionChange);
  cleanupTimer=setTimeout(cleanup,5100);
}
document.getElementById('ctaButton')?.addEventListener('click',showRedemption);
document.getElementById('backButton')?.addEventListener('click',showWinner);
document.getElementById('copyPaymentCode')?.addEventListener('click',copyCode);
render();
launchConfetti();
window.addEventListener('storage',render);