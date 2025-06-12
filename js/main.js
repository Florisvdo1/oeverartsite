import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { PAYPAL_CLIENT_ID, IG_HANDLE } from './constants.js';

/* ----------  3‑D HERO  ---------- */
const canvas = document.getElementById('three-canvas');
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0,1.6,3);
const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
renderer.setSize(innerWidth, innerHeight);

const light = new THREE.DirectionalLight(0xffffff,1.2);
light.position.set(5,10,7);
scene.add(light);

new GLTFLoader().load('/assets/astronaut_floris.glb', gltf=>{
  const model = gltf.scene;
  model.scale.set(1.2,1.2,1.2);
  scene.add(model);
  animate();
});
window.addEventListener('resize',()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
function animate(){
  requestAnimationFrame(animate);
  scene.rotation.y += 0.002;
  renderer.render(scene,camera);
}

/* ----------  INFINITE IG FEED  ---------- */
const igGrid = document.getElementById('ig-grid');
let endCursor = '';
async function loadMedia(){
  const res = await fetch(`/api/instagram?cursor=${endCursor}`);
  const data = await res.json();
  data.items.forEach(m=>{
    const img=document.createElement('img');
    img.src=m.thumbnail;
    img.alt=`Instagram post ${m.id}`;
    img.loading='lazy';
    igGrid.appendChild(img);
  });
  endCursor=data.next;
}
loadMedia();
window.addEventListener('scroll',()=>{
  if(innerHeight+scrollY>=document.body.offsetHeight-300){
    loadMedia();
  }
});

/* ----------  QUIZ  ---------- */
const painters = ['Van Gogh','Monet','Picasso','Da Vinci'];
let round=0, score=0;
const qText=document.getElementById('q-text');
const ansDiv=document.getElementById('answers');
function nextRound(){
  if(round===10){ endQuiz(); return; }
  round++;
  const correct = painters[Math.floor(Math.random()*painters.length)];
  qText.textContent=`Round ${round}: Which painter inspired this artwork?`;
  ansDiv.innerHTML='';
  painters.sort(()=>Math.random()-0.5).forEach(p=>{
    const btn=document.createElement('button');
    btn.textContent=p;
    btn.onclick=()=>{ if(p===correct) score++; nextRound(); };
    ansDiv.appendChild(btn);
  });
}
function endQuiz(){
  document.getElementById('score').textContent=`Your Score: ${score}/10`;
  fetch('/api/quiz/score',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({score})
  });
}
nextRound();

/* ----------  PAYPAL  ---------- */
const ppScript=document.createElement('script');
ppScript.src=`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
ppScript.onload=()=>{
  paypal.Buttons({
    createOrder:()=>fetch('/api/paypal/create-order').then(r=>r.json()).then(d=>d.id),
    onApprove:(d,actions)=>actions.order.capture().then(()=>{
      alert('Thank you! Order confirmed.');
    })
  }).render('#paypal-button-container');
};
document.body.appendChild(ppScript);
