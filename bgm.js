'use strict';
// 뚜비전 BGM — Web Audio로 직접 합성하는 은은한 배경음 (외부 음원 없음)
window.BGM=(()=>{
const hz=n=>440*Math.pow(2,(n-69)/12);
// 0: 봄 수성못 / 1: 노을 버드나무 길 / 2: 밤 닫힌 누각 / 3: 종장·엔딩
const MOODS=[
 {bpm:84,wave:'triangle',oct:12,density:.85,arpVol:.07,padVol:.035,lp:2400,
  chords:[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]],arp:[0,1,2,3,2,1,3,2]},
 {bpm:62,wave:'sine',oct:12,density:.6,arpVol:.075,padVol:.04,lp:1500,
  chords:[[57,60,64,67],[53,57,60,64],[48,52,55,59],[52,56,59,64]],arp:[0,2,1,3,2,1,0,2]},
 {bpm:50,wave:'sine',oct:0,density:.35,arpVol:.09,padVol:.05,lp:700,
  chords:[[50,57,60,65],[50,58,62,65],[48,55,58,63],[49,57,61,64]],arp:[0,1,0,2,0,3,1,2]},
 {bpm:76,wave:'triangle',oct:12,density:.8,arpVol:.065,padVol:.04,lp:2600,
  chords:[[53,57,60,64],[52,55,60,64],[50,53,57,60],[58,62,65,69]],arp:[0,1,2,3,1,2,3,2]}
];
let ctx,master,music,delay,mood=0,want=0,step=0,nextT=0,timer=null,on=true,started=false;
try{on=localStorage.getItem('ddubi-sound')!=='off'}catch(e){}
const VOL=.55;
function init(){
 ctx=new (window.AudioContext||window.webkitAudioContext)();
 master=ctx.createGain();master.gain.value=on?VOL:0;master.connect(ctx.destination);
 music=ctx.createGain();music.gain.value=0;music.connect(master);
 // 잔향 대신 쓰는 부드러운 피드백 딜레이
 delay=ctx.createDelay(1);delay.delayTime.value=.33;
 const fb=ctx.createGain();fb.gain.value=.32;const wet=ctx.createGain();wet.gain.value=.3;
 const dl=ctx.createBiquadFilter();dl.type='lowpass';dl.frequency.value=1800;
 delay.connect(dl);dl.connect(fb);fb.connect(delay);dl.connect(wet);wet.connect(music);
}
function pad(notes,t,dur,m){
 const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=m.lp;f.Q.value=.3;
 const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(m.padVol,t+1.2);
 g.gain.setValueAtTime(m.padVol,t+dur-.2);g.gain.linearRampToValueAtTime(0,t+dur+1.4);
 f.connect(g);g.connect(music);
 notes.forEach(n=>[-7,7].forEach(d=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=hz(n-12);o.detune.value=d;
  const og=ctx.createGain();og.gain.value=.5/notes.length;o.connect(og);og.connect(f);o.start(t);o.stop(t+dur+1.5)}));
}
function pluck(n,t,m){
 const o=ctx.createOscillator();o.type=m.wave;o.frequency.value=hz(n);
 const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(m.arpVol,t+.015);
 g.gain.exponentialRampToValueAtTime(.0005,t+1.6);
 o.connect(g);g.connect(music);g.connect(delay);o.start(t);o.stop(t+1.7);
}
function tick(){
 while(nextT<ctx.currentTime+.2){
  const m=MOODS[mood],eighth=60/m.bpm/2,bar=Math.floor(step/8)%4,ch=m.chords[bar],i=step%8;
  if(i===0)pad(ch,nextT,eighth*8,m);
  if(Math.random()<m.density){const n=ch[m.arp[i]%ch.length]+m.oct;pluck(n,nextT+(Math.random()-.5)*.02,m)}
  nextT+=eighth;step++;
 }
}
function fadeTo(v,sec){const g=music.gain,t=ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(v,t+sec)}
function set(k){
 k=Math.max(0,Math.min(3,k|0));want=k;
 if(!started||k===mood)return;
 fadeTo(0,1.4);
 setTimeout(()=>{if(want!==k)return;mood=k;step=0;nextT=ctx.currentTime+.05;fadeTo(1,2.5)},1500);
}
function start(){
 if(!ctx)init();
 if(ctx.state==='suspended')ctx.resume();
 if(!started){started=true;mood=want;step=0;nextT=ctx.currentTime+.1;timer=setInterval(tick,40);fadeTo(1,3)}
 else set(want);
}
function toggle(){
 on=!on;try{localStorage.setItem('ddubi-sound',on?'on':'off')}catch(e){}
 if(ctx){const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(on?VOL:0,t+.4)}
 return on;
}
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend();else if(started)ctx.resume()});
return{start,set,toggle,isOn:()=>on};
})();
