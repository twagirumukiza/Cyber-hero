import React,{useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import "./style.css";

const DAYS=[
 {id:1,icon:"🎯",title:"Ton compte est ciblé",tag:"Identité numérique",xp:150,
  intro:"Une notification apparaît : une nouvelle connexion vient d’être détectée sur ton compte.",
  dialogue:[["Nora","Tu as reçu une alerte de connexion ?"],["Toi","Oui. Je ne reconnais pas l’appareil…"],["Nora","Alors ne clique pas au hasard. Vérifie depuis l’application ou le site officiel."]],
  question:"Que fais-tu en premier ?",choices:["Je clique sur le lien de l’alerte.","Je vérifie l’activité depuis l’application officielle.","J’envoie mes identifiants au support."],good:1,
  lesson:"Une alerte inhabituelle doit être vérifiée depuis une source de confiance. Ne communique jamais tes identifiants pour « vérifier » ton compte."},
 {id:2,icon:"🔑",title:"Quelqu’un veut ton mot de passe",tag:"Authentification",xp:150,
  intro:"Un camarade t’écrit : « Donne-moi ton mot de passe, c’est juste pour me connecter cinq minutes. »",
  dialogue:[["Sam","Promis, je ne vais rien changer !"],["Toi","Même si je te connais, je ne dois pas partager mon mot de passe."],["Nora","Exact. Un mot de passe est personnel."]],
  question:"Quelle réaction est la plus sûre ?",choices:["Je le donne à mon ami.","Je donne seulement un ancien mot de passe.","Je refuse et garde mon mot de passe secret."],good:2,
  lesson:"Les mots de passe sont personnels. Utilise des mots de passe uniques et robustes et, quand c’est possible, une authentification renforcée."},
 {id:3,icon:"🎣",title:"Le faux message de l’établissement",tag:"Phishing",xp:200,
  intro:"Tu reçois un message urgent : « Votre compte scolaire sera supprimé aujourd’hui. Cliquez ici pour confirmer. »",
  dialogue:[["Nora","Le message te met la pression…"],["Toi","Je vais chercher les indices avant d’agir."],["Nora","Bonne idée : urgence, lien étrange et demande d’informations."]],
  question:"Que fais-tu ?",choices:["Je clique immédiatement.","Je vérifie l’expéditeur et passe par le site officiel.","Je transfère le message à tous mes amis."],good:1,
  lesson:"L’urgence artificielle, un lien inhabituel ou une demande d’informations sont des signaux d’alerte. En cas de doute, vérifie par un canal fiable."},
 {id:4,icon:"📱",title:"Ton téléphone disparaît",tag:"Mobilité",xp:200,
  intro:"Après le sport, tu ne retrouves plus ton smartphone. Il contient tes messages, photos et comptes.",
  dialogue:[["Sam","Respire. Tu avais activé le verrouillage et la localisation ?"],["Toi","Oui, et mes données sont sauvegardées."],["Sam","Parfait. Maintenant, sécurise tes comptes depuis un autre appareil."]],
  question:"Quelle action est prioritaire ?",choices:["Attendre quelques jours.","Utiliser les fonctions de localisation/verrouillage et sécuriser les comptes.","Publier ton numéro partout pour le retrouver."],good:1,
  lesson:"Un terminal mobile doit être protégé contre la perte ou le vol : verrouillage, mises à jour, sauvegardes et fonctions de localisation peuvent limiter les conséquences."},
 {id:5,icon:"🚨",title:"Tes amis reçoivent tes messages",tag:"Incident",xp:250,
  intro:"Tes amis reçoivent des messages que tu n’as jamais écrits. Ton compte semble compromis.",
  dialogue:[["Nora","Quelqu’un utilise peut-être ton compte."],["Toi","Je vais changer le mot de passe depuis un appareil de confiance."],["Nora","Et signale l’incident à un adulte ou au responsable concerné."]],
  question:"Quelle séquence est la plus sûre ?",choices:["Ignorer et attendre.","Changer le mot de passe, sécuriser l’accès et signaler l’incident.","Supprimer tous tes messages et recommencer."],good:1,
  lesson:"Après un incident, il faut agir rapidement : sécuriser l’accès, vérifier les sessions/appareils, renforcer l’authentification et signaler le problème à la bonne personne."}
];

const MISSIONS=[
["🪪","Ton identité numérique","Ce que tu montres, partages et laisses derrière toi."],
["🔑","Les mots de passe","Créer des secrets difficiles à deviner et ne pas les partager."],
["📱","Ton smartphone","Verrouillage, mises à jour, sauvegarde et installation fiable."],
["🎣","Détective phishing","Repérer urgence, lien étrange, demande d’informations et incohérences."],
["📸","Réseaux sociaux","Vérifier avant d’accepter, publier ou répondre."],
["🦠","Virus & logiciels malveillants","Comprendre les risques liés aux fichiers et logiciels inconnus."],
["📥","Liens & téléchargements","Privilégier les sources fiables et vérifier avant d’ouvrir."],
["📡","Wi-Fi public","Limiter les usages sensibles sur les réseaux non maîtrisés."],
["🔄","Mises à jour & sauvegardes","Réduire les risques liés aux vulnérabilités et à la perte de données."],
["🚨","En cas de problème","Réagir, conserver les éléments utiles et prévenir la bonne personne."]
];

const QUIZ=[
 ["Ton ami demande ton mot de passe.","Je le partage","Je refuse","Je le poste dans un groupe",1],
 ["Une clé USB inconnue est trouvée dans la cour.","Je la branche","Je la donne au responsable","Je la prête",1],
 ["Un message demande une action urgente via un lien étrange.","Je clique","Je vérifie par un canal officiel","Je transfère",1],
 ["Une mise à jour officielle est disponible.","Je l’ignore toujours","Je mets à jour depuis une source fiable","Je cherche une copie inconnue",1],
 ["Mon téléphone est perdu.","J’attends","Je le sécurise/localise et protège mes comptes","Je donne mes codes",1],
 ["Un compte se comporte bizarrement.","Je ne fais rien","Je sécurise le compte et signale","Je partage le lien",1],
 ["Pour un mot de passe, le mieux est…","le prénom + année","un secret unique et robuste","le même partout",1],
 ["Sur un Wi-Fi public, je dois…","tout faire sans réfléchir","limiter les usages sensibles et rester vigilant","partager mes codes",1],
 ["Une demande d’ami inconnue…","j’accepte automatiquement","je vérifie avant d’accepter","je donne mon adresse",1],
 ["Après un clic suspect…","je donne mon mot de passe","je m’arrête et vérifie / signale","je clique encore",1],
];

function App(){
 const [page,setPage]=useState("home");
 const [dark,setDark]=useState(()=>localStorage.getItem("ch-theme")!=="light");
 const [xp,setXp]=useState(()=>+localStorage.getItem("ch-xp")||0);
 const [done,setDone]=useState(()=>JSON.parse(localStorage.getItem("ch-done")||"[]"));
 const [badges,setBadges]=useState(()=>JSON.parse(localStorage.getItem("ch-badges")||"[]"));
 const [day,setDay]=useState(Math.max(1,Math.min(5,done.length+1)));
 const [mission,setMission]=useState(null);
 const [toast,setToast]=useState("");
 useEffect(()=>{localStorage.setItem("ch-xp",xp);localStorage.setItem("ch-done",JSON.stringify(done));localStorage.setItem("ch-badges",JSON.stringify(badges))},[xp,done,badges]);
 useEffect(()=>{document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("ch-theme",dark?"dark":"light")},[dark]);
 const level= xp>=1500?["Maître du numérique","👑"]:xp>=1000?["Cyber Gardien","🛡️"]:xp>=500?["Cyber Héros","🦸"]:xp>=200?["Cyber Éclaireur","🔎"]:["Recrue Cyber","🌱"];
 const pct=Math.min(100,Math.round(xp/1500*100));
 const add=(n,b)=>{setXp(v=>v+n);if(b&&!badges.includes(b))setBadges(v=>[...v,b]);setToast(`+${n} XP`);setTimeout(()=>setToast(""),1800)};
 const completeDay=(d)=>{if(!done.includes(d.id)){setDone(v=>[...v,d.id]);add(d.xp,`badge-${d.id}`)}};
 return <div className="app">
  <header><button className="brand" onClick={()=>setPage("home")}><span>🛡️</span><b>CYBER HÉROS</b><small>Apprends. Joue. Protège-toi.</small></button>
   <nav>{[["home","Accueil"],["campaign","Campagne"],["missions","Missions"],["games","Mini-jeux"],["progress","Ma progression"],["teacher","Enseignant"],["parents","Parents"]].map(([id,t])=><button className={page===id?"active":""} onClick={()=>setPage(id)}>{t}</button>)}</nav>
   <button className="theme" onClick={()=>setDark(v=>!v)}>{dark?"☀️":"🌙"}</button>
  </header>
  {toast&&<div className="toast">{toast}</div>}
  <main>
   {page==="home"&&<Home xp={xp} pct={pct} level={level} done={done} setPage={setPage} setDay={setDay}/>}
   {page==="campaign"&&<Campaign day={day} setDay={setDay} done={done} setPage={setPage}/>}
   {page==="day"&&<Day d={DAYS.find(x=>x.id===day)} done={done} completeDay={completeDay} setPage={setPage} add={add}/>}
   {page==="missions"&&<Missions setMission={setMission} setPage={setPage}/>}
   {page==="mission"&&<MissionDetail m={MISSION_DATA[mission]} setPage={setPage} add={add}/>}
   {page==="games"&&<Games add={add}/>}
   {page==="progress"&&<Progress xp={xp} pct={pct} level={level} done={done} badges={badges}/>}
   {page==="teacher"&&<Teacher/>}
   {page==="parents"&&<Parents/>}
   {page==="challenge"&&<Challenge add={add} setPage={setPage}/>}
  </main>
  <footer>CYBER HÉROS v2.5 • Contenu pédagogique original inspiré de principes d’hygiène numérique • Aucun classement public individuel.</footer>
 </div>
}

function Home({xp,pct,level,done,setPage,setDay}){return <section className="hero">
 <div className="hero-copy"><div className="eyebrow">MISSION : PROTÉGER TON IDENTITÉ NUMÉRIQUE</div><h1>Deviens un<br/><span>CYBER HÉROS.</span></h1><p>Internet est ton terrain de jeu. Apprends à reconnaître les pièges, prendre les bonnes décisions et réagir quand quelque chose tourne mal.</p>
 <div className="actions"><button className="primary" onClick={()=>{setDay(Math.max(1,Math.min(5,done.length+1)));setPage("day")}}>🚀 Continuer l’aventure</button><button className="secondary" onClick={()=>setPage("missions")}>Explorer les missions</button></div></div>
 <div className="hero-card"><div className="avatar">🦸</div><div className="level">{level[1]} {level[0]}</div><div className="xp">{xp} <span>XP</span></div><div className="bar"><i style={{width:pct+"%"}}/></div><small>{pct}% vers Maître du numérique</small><div className="stats"><div><b>{done.length}/5</b><span>Jours campagne</span></div><div><b>10</b><span>Missions</span></div><div><b>6</b><span>Badges</span></div></div></div>
 <div className="feature-grid"><Feature icon="🎣" title="Déjoue les arnaques" text="Apprends à repérer les signaux suspects."/><Feature icon="🔐" title="Protège tes comptes" text="Adopte les bons réflexes d’authentification."/><Feature icon="📱" title="Sécurise tes appareils" text="Verrouillage, mises à jour, sauvegardes."/><Feature icon="🚨" title="Réagis aux incidents" text="Savoir quoi faire compte autant que prévenir." /></div>
 </section>}
function Feature(p){return <div className="feature"><span>{p.icon}</span><div><b>{p.title}</b><p>{p.text}</p></div></div>}

function Campaign({day,setDay,done,setPage}){return <section className="page"><div className="section-head"><div><div className="eyebrow">MODE CAMPAGNE</div><h2>5 jours pour devenir plus vigilant.</h2></div><div className="progress-pill">⭐ {done.length}/5 terminés</div></div>
 <div className="timeline">{DAYS.map(d=><button className={`day ${d.id===day?"selected":""} ${done.includes(d.id)?"complete":""}`} onClick={()=>{setDay(d.id);setPage("day")}}><div className="day-num">{done.includes(d.id)?"✓":d.id}</div><span>{d.icon}</span><b>Jour {d.id}</b><strong>{d.title}</strong><small>{d.tag}</small></button>)}</div>
 <div className="campaign-banner"><span>💡</span><div><b>Ta règle d’or</b><p>Une situation suspecte ? <strong>Stoppe-toi, vérifie, puis agis.</strong></p></div></div>
 <button className="primary" onClick={()=>setPage("day")}>Commencer le Jour {day} →</button></section>}

function Day({d,done,completeDay,setPage,add}){const [choice,setChoice]=useState(null); const [finished,setFinished]=useState(false); if(!d)return null;
 return <section className="page day-page"><button className="back" onClick={()=>setPage("campaign")}>← Campagne</button><div className="scene"><div className="scene-main"><div className="mission-tag">{d.icon} JOUR {d.id} • {d.tag}</div><h2>{d.title}</h2><p className="intro">{d.intro}</p><div className="chat">{d.dialogue.map(([who,text])=><div className={who==="Toi"?"bubble me":"bubble"}><b>{who}</b><p>{text}</p></div>)}</div></div><aside><div className="scene-avatar">🧑‍💻</div><p>« Dans le doute, ne donne jamais tes secrets. »</p></aside></div>
 <div className="decision"><div className="eyebrow">QUE FAIS-TU ?</div><h3>{d.question}</h3><div className="choices">{d.choices.map((c,i)=><button className={choice===i?"picked":""} onClick={()=>setChoice(i)}>{String.fromCharCode(65+i)}. {c}</button>)}</div>
 {choice!==null&&<div className={`feedback ${choice===d.good?"good":"bad"}`}><b>{choice===d.good?"🟢 Bonne décision":"🟠 Pas idéal — mais c’est l’occasion d’apprendre"}</b><p>{choice===d.good?d.lesson:`La meilleure option était : « ${d.choices[d.good]} ». ${d.lesson}`}</p></div>}
 {choice!==null&&<div className="decision-actions">{choice===d.good&&!done.includes(d.id)&&<button className="primary" onClick={()=>{completeDay(d);setFinished(true)}}>Valider le jour +{d.xp} XP</button>}{done.includes(d.id)&&<button className="secondary" onClick={()=>setPage(d.id===5?"challenge":"campaign")}>Jour validé ✓</button>}{choice!==d.good&&<button className="secondary" onClick={()=>setChoice(null)}>Réessayer</button>}</div>}</div>
 {finished&&<div className="success-card"><span>🏆</span><div><h3>Mission accomplie !</h3><p>Ton réflexe cyber vient de progresser.</p></div><button className="primary" onClick={()=>setPage(d.id<5?"campaign":"challenge")}>{d.id<5?"Jour suivant":"Grand Cyber Challenge"} →</button></div>}
 </section>}

const MISSION_DATA=Object.fromEntries(MISSIONS.map((m,i)=>[i,{icon:m[0],title:m[1],text:m[2],xp:100+i*10}]));
function Missions({setMission,setPage}){return <section className="page"><div className="eyebrow">10 MISSIONS</div><h2>Ta boîte à outils cyber.</h2><p className="lead">Chaque mission transforme une règle de sécurité en situation concrète.</p><div className="mission-grid">{MISSIONS.map((m,i)=><button className="mission-card" onClick={()=>{setMission(i);setPage("mission")}}><span>{m[0]}</span><div><small>MISSION {String(i+1).padStart(2,"0")}</small><h3>{m[1]}</h3><p>{m[2]}</p></div><b>→</b></button>)}</div></section>}
function MissionDetail({m,setPage,add}){const [ok,setOk]=useState(false);return <section className="page narrow"><button className="back" onClick={()=>setPage("missions")}>← Missions</button><div className="detail-card"><span className="big-icon">{m.icon}</span><div className="eyebrow">MISSION LIBRE</div><h2>{m.title}</h2><p>{m.text}</p><div className="mini-choice"><h3>Quel réflexe veux-tu retenir ?</h3>{["Je vérifie avant d’agir.","Je protège mes accès.","Je signale ce qui semble suspect."].map((x,i)=><button onClick={()=>{setOk(true);add(m.xp)}}>{i+1}. {x}</button>)}</div>{ok&&<div className="feedback good"><b>✓ Réflexe enregistré</b><p>Bonne pratique ajoutée à ton parcours.</p></div>}</div></section>}

function Games({add}){const go=()=>window.dispatchEvent(new CustomEvent("gochallenge"));return <section className="page"><div className="eyebrow">ZONE D’ENTRAÎNEMENT</div><h2>Mini-jeux cyber.</h2><div className="game-grid"><Game title="🎣 Détective phishing" text="Trouve les signaux suspects dans un message." action="Lancer" onClick={()=>add(50)}/><Game title="🔑 Coffre-fort" text="Choisis les principes d’un bon mot de passe." action="Jouer" onClick={()=>add(50)}/><Game title="💾 USB trouvé" text="Prends la bonne décision face à un support inconnu." action="Jouer" onClick={()=>add(50)}/><Game title="🔄 Mise à jour" text="Décide comment installer une mise à jour en sécurité." action="Jouer" onClick={()=>add(50)}/><Game title="🚨 Réaction incident" text="Remets les actions de réponse dans le bon ordre." action="Jouer" onClick={()=>add(75)}/><Game title="🔎 Trouve 5 erreurs" text="Analyse un faux message et repère les indices." action="Jouer" onClick={()=>add(75)}/></div><div className="challenge-call"><div><span>🏆</span><div><b>Grand Cyber Challenge</b><p>10 questions • score final • badge Cyber Héros</p></div></div><button className="secondary" onClick={()=>alert("Termine les 5 jours de la campagne pour lancer le Grand Cyber Challenge.")}>Débloqué après la campagne</button></div><button className="challenge-btn hidden" onClick={()=>{}}/></section>}
function Game({title,text,action,onClick}){return <div className="game"><div className="game-icon">{title.split(" ")[0]}</div><h3>{title.substring(title.indexOf(" ")+1)}</h3><p>{text}</p><button className="secondary" onClick={onClick}>{action} →</button></div>}

function Progress({xp,pct,level,done,badges}){return <section className="page"><div className="eyebrow">TABLEAU DE BORD</div><h2>Ta progression.</h2><div className="dashboard"><div className="dash-main"><div className="rank">{level[1]}<div><b>{level[0]}</b><span>{xp} XP</span></div></div><div className="bar large"><i style={{width:pct+"%"}}/></div><div className="level-list">{[["🌱","Recrue Cyber",0],["🔎","Cyber Éclaireur",200],["🦸","Cyber Héros",500],["🛡️","Cyber Gardien",1000],["👑","Maître du numérique",1500]].map(x=><div className={xp>=x[2]?"unlocked":""}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]} XP</small></div>)}</div></div><div className="dash-side"><h3>🏅 Badges</h3><div className="badges">{["🎯","🔑","🎣","📱","🚨","👑"].map((b,i)=><div className={badges.includes(`badge-${i+1}`)|| (i===5&&done.length===5)?"earned":""}><span>{b}</span><small>{["Compte","Mots de passe","Phishing","Smartphone","Incident","Cyber Héros"][i]}</small></div>)}</div></div></div><div className="certificate"><span>📜</span><div><b>Certificat Cyber Héros</b><p>Après le Grand Cyber Challenge, imprime ton certificat depuis ton navigateur.</p></div><button className="secondary" onClick={()=>window.print()}>Imprimer</button></div></section>}

function Teacher(){return <section className="page"><div className="eyebrow">ESPACE ENSEIGNANT</div><h2>Une vue pour faire progresser la classe.</h2><p className="lead">Prototype de tableau de bord : la version connectée pourra être branchée à une base de données.</p><div className="teacher-grid"><Stat n="28" t="Élèves actifs"/><Stat n="76%" t="Progression moyenne"/><Stat n="91%" t="Mission phishing"/><Stat n="84%" t="Grand Challenge"/></div><div className="class-card"><h3>Classe 4e B</h3><table><thead><tr><th>Compétence</th><th>Progression</th><th>Signal</th></tr></thead><tbody>{[["Authentification","92%","Excellent"],["Phishing","76%","À renforcer"],["Mobilité","84%","Bon"],["Incidents","63%","À travailler"]].map(r=><tr><td>{r[0]}</td><td><div className="mini-bar"><i style={{width:r[1]}}/></div>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table><small>Les élèves ne sont pas classés individuellement publiquement : priorité à la progression.</small></div></section>}
function Stat({n,t}){return <div className="stat"><b>{n}</b><span>{t}</span></div>}
function Parents(){return <section className="page"><div className="eyebrow">MODE PARENT</div><h2>Accompagner sans dramatiser.</h2><p className="lead">Des fiches courtes pour ouvrir le dialogue et renforcer les bons réflexes à la maison.</p><div className="parent-grid">{[["📱","Smartphone perdu","Verrouillage, localisation, sauvegarde et protection des comptes."],["🎣","Reconnaître une arnaque","Faire une pause, vérifier l’expéditeur et ne pas donner ses codes."],["💬","Réseaux sociaux","Parler de confidentialité, traces numériques et demandes inconnues."],["🚨","Compte piraté","Sécuriser l’accès, vérifier les sessions et signaler l’incident."],["🔗","Lien suspect","Ne pas cliquer à nouveau ; vérifier depuis une source officielle."],["🧠","Cyberharcèlement","Conserver les éléments utiles et chercher rapidement l’aide d’un adulte."]].map(x=><div className="parent-card"><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></section>}

function Challenge({add,setPage}){const [i,setI]=useState(0),[score,setScore]=useState(0),[ended,setEnded]=useState(false);const qs=useMemo(()=>QUIZ.slice().sort(()=>Math.random()-.5),[]);if(ended)return <section className="page challenge-result"><div className="trophy">🏆</div><div className="eyebrow">GRAND CYBER CHALLENGE</div><h2>{score}/10</h2><p>{score>=8?"Cyber Héros confirmé !":"Continue à t’entraîner : chaque erreur est une occasion d’apprendre."}</p><button className="primary" onClick={()=>{add(score*25,"badge-6");setPage("progress")}}>Enregistrer mon résultat</button></section>;const q=qs[i];return <section className="page narrow"><div className="eyebrow">🏆 GRAND CYBER CHALLENGE • {i+1}/10</div><h2>{q[0]}</h2><div className="challenge-options">{[q[1],q[2],q[3]].map((x,j)=><button onClick={()=>{if(j===q[4])setScore(v=>v+1);if(i===9)setEnded(true);else setI(v=>v+1)}}>{String.fromCharCode(65+j)}. {x}</button>)}</div></section>}

function AppChallengeLink(){return null}

createRoot(document.getElementById("root")).render(<App/>);
