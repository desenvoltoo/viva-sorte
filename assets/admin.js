const STORAGE_KEY='campanha-premiada-settings';
const defaults={customerName:'Visitante',campaignName:'Campanha Premiada',headline:'Parabéns, {nome}!',message:'Você possui uma condição especial disponível para consulta.',prizeValue:'R$ 0,00',paymentType:'pix',pixCode:'',barcodeCode:'',recipientName:'Não informado',buttonText:'Continuar',buttonLink:'#'};
const ids={customerName:'nameInput',campaignName:'campaignInput',headline:'headlineInput',message:'messageInput',prizeValue:'valueInput',paymentType:'paymentTypeInput',pixCode:'pixInput',barcodeCode:'barcodeInput',recipientName:'recipientInput',buttonText:'buttonTextInput',buttonLink:'buttonLinkInput'};
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return {...defaults}}}
function populate(){const s=load();Object.entries(ids).forEach(([key,id])=>{const el=document.getElementById(id);if(el)el.value=s[key]??''});document.getElementById('currentName').textContent=s.customerName||'Visitante'}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
document.getElementById('settingsForm').addEventListener('submit',e=>{e.preventDefault();const s={};Object.entries(ids).forEach(([key,id])=>s[key]=document.getElementById(id).value.trim());localStorage.setItem(STORAGE_KEY,JSON.stringify(s));document.getElementById('currentName').textContent=s.customerName||'Visitante';toast('Alterações salvas')});
document.getElementById('restoreButton').addEventListener('click',()=>{localStorage.removeItem(STORAGE_KEY);populate();toast('Configuração restaurada')});
populate();
