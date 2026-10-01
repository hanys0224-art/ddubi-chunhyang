'use strict';
const $=id=>document.getElementById(id);
const chapters=[['第一章','봄, 수성못','봄날의 만남'],['第二章','노을, 버드나무 길','멀어지는 발걸음'],['第三章','밤, 닫힌 누각','약속을 지키는 용기'],['終章','다시, 수성못','우리의 마지막 장']];
const scenes={
start:{who:'춘향 뚜비',m:'happy',c:0,t:'꽃잎이 물 위에 내려앉았네. 오늘은 왠지 좋은 일이 생길 것 같아.',n:'meet',solo:'pink'},
meet:{who:'몽룡 뚜비',m:'surprised',c:0,t:'뚜, 뚜비! 저기… 이 책, 네가 떨어뜨린 거야? 꽃잎 사이에 숨어 있더라.',n:'answer'},
answer:{who:'춘향 뚜비',m:'shy',c:0,t:'내 책이 맞아. 그런데 책갈피에 쓴 글까지 본 건 아니지?',choices:[['웃으며 고맙다고 한다','warm','love'],['책에 대해 먼저 물어본다','book','courage']]},
warm:{who:'몽룡 뚜비',m:'happy',c:0,t:'“마음은 누구의 허락도 필요 없다.” 그 한 줄이 참 좋아서… 아, 안 읽은 척해야 했는데!',n:'walk'},
book:{who:'몽룡 뚜비',m:'shy',c:0,t:'응. 네가 쓴 문장이 궁금했어. 남이 정해 준 이야기 말고, 네 이야기를 듣고 싶어서.',n:'walk'},
walk:{who:'춘향 뚜비',m:'happy',c:0,t:'그럼 같이 걸을래? 수성못을 한 바퀴 돌면 이야기가 하나쯤 생길 거야.',n:'promise'},
promise:{who:'몽룡 뚜비',m:'shy',c:0,t:'너와 걷는 길은 이상해. 한 바퀴가 너무 짧아. 내일도, 그다음 날도 만나면 안 될까?',choices:[['여기서 매일 만나자고 약속한다','ribbon','love'],['서로의 꿈부터 이야기한다','dream','courage']]},
ribbon:{who:'춘향 뚜비',m:'happy',c:0,t:'좋아. 이 분홍 책갈피를 가져. 길을 잃어도, 이곳으로 돌아오는 건 잊지 마.',n:'departure'},
dream:{who:'춘향 뚜비',m:'happy',c:0,t:'난 누구나 자기 이야기를 읽을 수 있는 작은 책방을 열고 싶어. 네 꿈도 응원할게.',n:'departure'},
departure:{who:'몽룡 뚜비',m:'sad',c:1,t:'춘향아… 아버지를 따라 한양에 가야 해. 이렇게 갑자기 떠나게 될 줄은 몰랐어.',n:'farewell'},
farewell:{who:'춘향 뚜비',m:'sad',c:1,t:'어제까지 함께 걷던 길인데, 벌써 혼자 남은 기분이야. 마지막으로 무슨 말을 해야 할까?',choices:[['돌아올 때까지 마음을 간직할게','wait','love'],['나는 여기서 내 꿈을 지킬게','stand','courage']]},
wait:{who:'몽룡 뚜비',m:'sad',c:1,t:'기다림을 네 몫으로만 남기지 않을게. 편지를 쓰고, 꼭 돌아올게. 약속해.',n:'letter'},
stand:{who:'몽룡 뚜비',m:'happy',c:1,t:'응. 네 꿈이 멈추지 않았으면 좋겠어. 다시 만날 때는 서로 더 멋진 뚜비가 되어 있자.',n:'letter'},
letter:{who:'춘향 뚜비',m:'sad',c:1,t:'처음엔 매주 오던 편지가 끊겼다. 그래도 나는 책방 문을 열고, 이웃들의 이야기를 모았다.',n:'arrival',solo:'pink'},
arrival:{who:'이야기꾼',m:'neutral',c:2,t:'새로 온 사또 변학도는 마을 잔치를 핑계로 곳간을 채웠다. 이번에는 춘향의 책방까지 탐냈다.',n:'demand',solo:'villain'},
demand:{who:'변학도 뚜비',m:'stern',c:2,t:'잔치에서 내 곁을 지켜라. 거절한다면 네 책방도 무사하지 못할 것이다!',n:'resist',solo:'villain'},
resist:{who:'춘향 뚜비',m:'surprised',c:2,t:'누군가의 권력 때문에 내 마음까지 내어줄 수는 없어. 하지만 책방과 이웃들은 어떡하지?',choices:[['내 마음은 내가 정한다고 말한다','refuse','courage'],['이웃들과 함께 부당함을 밝힌다','neighbors','community']],solo:'pink'},
refuse:{who:'춘향 뚜비',m:'stern',c:2,t:'제 대답은 아니오입니다. 책방을 빼앗을 수는 있어도, 제 뜻까지 바꿀 수는 없어요.',n:'locked',solo:'pink'},
neighbors:{who:'춘향 뚜비',m:'stern',c:2,t:'우리가 겪은 일을 함께 적어 주세요. 한 사람의 목소리는 막아도, 모두의 이야기는 지울 수 없어요.',n:'locked',solo:'pink'},
locked:{who:'이야기꾼',m:'sad',c:2,t:'변학도는 춘향을 누각에 가두었다. 문밖에는 이웃들이 놓고 간 따뜻한 밥과 작은 쪽지가 쌓였다.',n:'courage',solo:'pink'},
courage:{who:'춘향 뚜비',m:'sad',c:2,t:'무섭지 않다면 거짓말이야. 그래도… 내가 틀린 건 아니잖아. 여기서 포기하지 않을 거야.',n:'return',solo:'pink'},
return:{who:'몽룡 뚜비',m:'sad',c:2,t:'춘향아. 너무 늦어서 미안해. 편지가 중간에서 막혔다는 걸 이제야 알았어.',n:'recognize'},
recognize:{who:'춘향 뚜비',m:'surprised',c:2,t:'몽룡…? 정말 너야? 그런데 그 낡은 옷은… 아니, 네가 와 준 게 먼저야.',n:'plan'},
plan:{who:'몽룡 뚜비',m:'stern',c:2,t:'나, 암행어사가 되어 돌아왔어. 하지만 가장 중요한 건 네 뜻이야. 어떻게 이 일을 바로잡고 싶어?',choices:[['내가 모은 기록을 사람들 앞에 펼친다','evidence','community'],['함께 변학도에게 당당히 맞선다','together','love']]},
evidence:{who:'춘향 뚜비',m:'stern',c:2,t:'책방에 기록이 있어. 부당하게 거둔 곡식, 빼앗긴 물건… 이웃들의 이름 하나도 빠뜨리지 말아 줘.',n:'justice'},
together:{who:'춘향 뚜비',m:'stern',c:2,t:'네 뒤에 숨지는 않을 거야. 나도 함께 나갈게. 내 이야기는 내가 직접 말하고 싶어.',n:'justice'},
justice:{who:'몽룡 뚜비',m:'surprised',c:2,t:'암행어사 출두요! 변학도는 들으라. 이 마을 사람들의 증언과 기록이 여기 있다!',n:'freedom'},
freedom:{who:'이야기꾼',m:'happy',c:3,t:'변학도의 횡포가 드러나고 누각 문이 열렸다. 빼앗긴 것들이 돌아오자, 마을에는 다시 웃음이 번졌다.',n:'future'},
future:{who:'춘향 뚜비',m:'happy',c:3,t:'이제 정말 봄이 돌아왔네. 기다림도, 두려움도 지나온 나. 앞으로 어떤 이야기를 써 볼까?',choices:[['몽룡과 약속했던 길을 다시 걷는다','resolveLove',null],['모두가 모이는 책방의 문을 연다','communityEnd',null],['내 꿈을 향해 새로운 길을 떠난다','selfEnd',null]]},
loveEnd:{who:'춘향 뚜비',m:'happy',c:3,t:'돌아와 줘서 고마워. 이번에는 기다리는 약속 말고, 같이 걸어가는 약속을 하자. 우리의 이야기는 이제 시작이야.',end:'꽃잎 아래, 다시 우리'},
quietEnd:{who:'몽룡 뚜비',m:'shy',c:3,t:'서로의 꿈을 응원하며 천천히 걸어가자. 매일 만나지 않아도 괜찮아. 우리가 고른 속도로, 오래 함께 가자.',end:'서로의 봄이 되어'},
communityEnd:{who:'춘향 뚜비',m:'happy',c:3,t:'책방의 첫 책은 우리 마을 이야기야. 겁이 나도 함께 목소리를 낸 뚜비들. 오늘은 모두가 주인공이야!',end:'함께 지킨 우리의 이야기'},
selfEnd:{who:'춘향 뚜비',m:'happy',c:3,t:'누군가의 춘향으로만 남지는 않을래. 세상의 이야기를 모으러 떠날 거야. 다음 장의 제목은, 내가 정할게!',end:'내 이름으로 쓰는 다음 장'}
};
const moods={happy:['기쁨','♪',1.65,1.18,'뚜비!'],sad:['슬픔','',.75,.68,'뚜… 비…'],surprised:['놀람','!',1.9,1.38,'뚜비?!'],shy:['설렘','♡',1.35,.85,'뚜비…'],stern:['용기','!',.95,.95,'뚜비!'],neutral:['이야기','',1,1,'뚜비']};
let current='start',started=false,typing=null,fullText='',shown=0,log=[],scores={love:0,courage:0,community:0};
function toast(s){$('toast').textContent=s;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',3000)}
function characterKey(who){return who==='춘향 뚜비'?'pink':who==='몽룡 뚜비'?'green':who==='변학도 뚜비'?'villain':'narrator'}
function stopTyping(){clearInterval(typing);typing=null;shown=fullText.length;$('text').textContent=fullText}
function render(id){if(id==='resolveLove')id=scores.love>=2?'loveEnd':'quietEnd';current=id;const s=scenes[id];if(!s)throw Error('Unknown scene');clearInterval(typing);$('game').classList.toggle('night',s.c===2);$('game').classList.toggle('ending',!!s.end);$('chapter').textContent=s.end?'結末':chapters[s.c][0];$('place').textContent=s.end||chapters[s.c][1];$('progress').textContent=`0${s.c+1} / ${chapters[s.c][2]}`;$('speaker').textContent=s.who;$('dialogue').dataset.character=characterKey(s.who);$('mood').textContent=moods[s.m][0];['pink','green','villain'].forEach(k=>{$(k).classList.toggle('hidden',k==='villain'?s.solo!=='villain':!!s.solo&&s.solo!==k);const active=characterKey(s.who)===k;$(k).classList.toggle('active',active);$(k).querySelector('.emotion').textContent=active?moods[s.m][1]:''});fullText=s.t;shown=0;$('text').textContent='';typing=setInterval(()=>{shown++;$('text').textContent=fullText.slice(0,shown);if(shown>=fullText.length){clearInterval(typing);typing=null}},24);$('choices').replaceChildren();if(s.choices)s.choices.forEach(([label,next,score],i)=>{const b=document.createElement('button'),num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');b.append(num,document.createTextNode(label));b.onclick=()=>choose(i);$('choices').append(b)});$('next').hidden=!!s.choices;$('next').firstChild.textContent=s.end?'다시 시작 ':'다음 ';$('hint').textContent=s.choices?'마음이 가는 대답을 골라 주세요':s.end?'당신의 선택으로 완성한 이야기':'클릭 또는 SPACE로 계속';log.push({who:s.who,text:s.t});if(window.BGM)BGM.set(s.end?3:s.c);}
function choose(i){const s=scenes[current];if(!started||!s.choices||!Number.isInteger(i)||!s.choices[i])throw Error('지금 선택할 수 없는 항목입니다.');const [label,next,score]=s.choices[i];if(score)scores[score]++;log.push({who:'나의 선택',text:label});render(next);return {scene:current}}
function next(){if(!started||$('log').open||$('confirm').open)return;if(typing){stopTyping();return}const s=scenes[current];if(s.choices)return;if(s.end){$('confirm').showModal();return}render(s.n)}
function start(){started=true;if(window.BGM)BGM.start();$('intro').style.display='none';scores={love:0,courage:0,community:0};log=[];render('start')}
$('start').onclick=start;const snd=$('sound'),sndLabel=()=>{const o=window.BGM&&BGM.isOn();snd.innerHTML=o?'♪<span class="sl"> 소리 켬</span>':'♪<span class="sl"> 소리 끔</span>';snd.classList.toggle('off',!o);snd.title=o?'배경음 끄기':'배경음 켜기';snd.setAttribute('aria-pressed',String(!!o))};if(snd){sndLabel();snd.onclick=()=>{if(window.BGM){BGM.toggle();if(started)BGM.start()}sndLabel()}}$('next').onclick=next;$('text').onclick=next;
$('restart').onclick=()=>{if(started)$('confirm').showModal()};$('cancelRestart').onclick=()=>$('confirm').close();$('yesRestart').onclick=()=>{$('confirm').close();start()};$('history').onclick=()=>{$('logContent').replaceChildren();if(!log.length)$('logContent').textContent='이야기를 시작하면 대화가 여기에 남습니다.';log.forEach(a=>{const p=document.createElement('p'),b=document.createElement('b');b.textContent=a.who;p.append(b,document.createTextNode(a.text));$('logContent').append(p)});$('log').showModal()};$('closeLog').onclick=()=>$('log').close();document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['BUTTON','INPUT'].includes(document.activeElement.tagName)){e.preventDefault();next()}if(started&&!$('log').open&&!$('confirm').open&&/^[1-3]$/.test(e.key)&&scenes[current].choices?.[+e.key-1])choose(+e.key-1)});
render('start');stopTyping();log=[];
if(document.modelContext?.registerTool){try{document.modelContext.registerTool({name:'read_story_scene',description:'현재 뚜비전 장면과 선택지를 읽습니다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({started,scene:current,text:scenes[current].t,choices:scenes[current].choices?.map(x=>x[0])||[]})});document.modelContext.registerTool({name:'choose_story_option',description:'진행 중인 이야기에서 1부터 시작하는 번호로 선택합니다.',inputSchema:{type:'object',properties:{option:{type:'integer',minimum:1,maximum:3}},required:['option'],additionalProperties:false},execute:input=>{if(!input||!Number.isInteger(input.option))throw Error('선택 번호가 필요합니다.');return choose(input.option-1)}})}catch{}}
