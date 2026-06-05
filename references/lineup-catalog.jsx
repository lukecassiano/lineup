import React, { useState, useEffect, useRef } from "react";
import {
  Map as MapIcon, Users, User, Waves, Plus, Heart, MessageCircle, Share2,
  Lock, MapPin, Wind, Send, Play, ChevronLeft, ChevronRight, Star, Flame,
  Sunrise, Compass, X, Check, Navigation, MoreHorizontal, Crosshair,
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,500;1,9..144,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=JetBrains+Mono:wght@400;500;700&display=swap');

html,body{margin:0;padding:0;height:100%;background:#d8c7a4;}
.lu*{box-sizing:border-box;margin:0;padding:0;}
.lu{
  --cream:#f3e8d2; --cream2:#ede0c5; --card:#f9efd9; --paper:#fbf4e3;
  --terra:#c54f2d; --terra-deep:#9d3a1c; --terra-soft:#e8a78c;
  --mustard:#d9a847; --mustard-deep:#b08530;
  --teal:#1d5366; --teal-deep:#0e3947; --teal-soft:#a8c5cf;
  --pink:#e6336d; --pink-soft:#f7b6c8;
  --ink:#2a1f15; --soft:#7a6850; --faint:#a89880; --line:#d4c4a3; --line2:#c5b48f;
  font-family:'Newsreader',Georgia,serif; color:var(--ink);
  background:var(--cream);
  width:100%;max-width:430px;height:100svh;margin:0 auto;
  position:relative;overflow:hidden;display:flex;flex-direction:column;
  -webkit-font-smoothing:antialiased;
}
.lu .mono{font-family:'JetBrains Mono',monospace;}
.lu .disp{font-family:'Fraunces',serif;}
.lu .scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;position:relative;}
.lu .scroll::-webkit-scrollbar{width:0;}

.lu .top{
  padding:14px 20px 14px;display:flex;align-items:center;justify-content:space-between;
  background:var(--terra);color:var(--cream);position:relative;z-index:4;flex:none;
  border-bottom:4px solid var(--mustard);
}
.lu .wordmark{font-family:'Bagel Fat One',sans-serif;font-weight:400;font-size:34px;letter-spacing:-1px;color:var(--cream);line-height:.85;}
.lu .masthead-meta{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:2.5px;color:rgba(243,232,210,.7);text-transform:uppercase;margin-top:4px;}

.lu .icon-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--cream);background:transparent;color:var(--cream);display:grid;place-items:center;cursor:pointer;transition:background .12s;}
.lu .icon-btn:hover{background:rgba(243,232,210,.15);}
.lu .icon-btn-dark{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--line);background:var(--card);color:var(--ink);display:grid;place-items:center;cursor:pointer;}
.lu .avatar{border-radius:50%;display:grid;place-items:center;font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--cream);flex:none;font-size:11px;}

.lu .nav{
  display:flex;align-items:center;justify-content:space-around;
  height:66px;padding:0 8px max(0px,env(safe-area-inset-bottom));
  background:var(--teal);position:relative;z-index:4;flex:none;
  border-top:4px solid var(--mustard);
}
.lu .navbtn{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:none;border:none;cursor:pointer;color:rgba(243,232,210,.55);
  font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:1.5px;
  text-transform:uppercase;padding:0 6px;height:100%;flex:1;transition:color .15s;position:relative;
}
.lu .navbtn.on{color:var(--mustard);}
.lu .navbtn.on::before{content:'';position:absolute;top:8px;width:5px;height:5px;border-radius:50%;background:var(--mustard);}
.lu .logbtn{
  width:54px;height:54px;border-radius:50%;color:var(--cream);border:3px solid var(--cream);
  background:var(--pink);position:relative;display:grid;place-items:center;
  cursor:pointer;flex:none;margin-top:-12px;
  box-shadow:0 6px 18px -4px rgba(230,51,109,.6);transition:transform .12s;
}
.lu .logbtn:active{transform:scale(.93);}

.lu .h1{font-family:'Fraunces',serif;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:1;color:var(--ink);}
.lu .h2{font-family:'Fraunces',serif;font-size:19px;font-weight:700;letter-spacing:-.3px;color:var(--ink);}
.lu .kicker{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--terra);font-weight:600;}
.lu .stamp{
  font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;
  background:var(--mustard);color:var(--ink);padding:4px 9px;border-radius:3px;display:inline-block;font-weight:700;
}
.lu .stamp-terra{background:var(--terra);color:var(--cream);}
.lu .stamp-teal{background:var(--teal);color:var(--cream);}
.lu .stamp-pink{background:var(--pink);color:var(--cream);}
.lu .card{background:var(--card);border:1.5px solid var(--line);border-radius:6px;position:relative;}
.lu .chip{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;padding:4px 9px;border-radius:20px;background:var(--paper);border:1.5px solid var(--line);display:inline-flex;align-items:center;gap:5px;color:var(--soft);}
.lu .btn{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;padding:13px 16px;border-radius:6px;border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:transform .1s,opacity .15s;}
.lu .btn:active{transform:scale(.97);}
.lu .btn-terra{background:var(--terra);color:var(--cream);}
.lu .btn-teal{background:var(--teal);color:var(--cream);}
.lu .btn-ghost{background:transparent;border:1.5px solid var(--ink);color:var(--ink);}

/* drop-pin floating action button on the map */
.lu .drop-fab{
  position:absolute;bottom:14px;right:14px;
  background:var(--pink);color:var(--cream);
  border:2.5px solid var(--cream);border-radius:30px;
  padding:9px 14px 9px 11px;
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;
  letter-spacing:1.2px;text-transform:uppercase;
  display:inline-flex;align-items:center;gap:6px;cursor:pointer;
  box-shadow:0 5px 14px -3px rgba(230,51,109,.55);
  z-index:5;transition:transform .12s;
}
.lu .drop-fab:active{transform:scale(.95);}

.lu .drop-overlay{
  position:absolute;inset:0;background:rgba(42,31,21,.32);
  z-index:6;cursor:crosshair;display:flex;flex-direction:column;
  align-items:center;justify-content:space-between;padding:14px;
  border-radius:6px;
}
.lu .drop-instruction{
  background:var(--ink);color:var(--cream);padding:7px 14px;border-radius:3px;
  font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;border:1.5px solid var(--cream);display:inline-flex;align-items:center;gap:7px;
}
.lu .drop-cancel{
  background:var(--cream);color:var(--ink);border:1.5px solid var(--ink);
  font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;padding:7px 14px;border-radius:3px;cursor:pointer;
}

@keyframes rise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.lu .rise{animation:rise .35s ease both;}
@keyframes pulse{0%,100%{opacity:.45;}50%{opacity:1;}}
@keyframes pinpulse{0%,100%{transform:translate(-50%,-50%) scale(1);box-shadow:0 0 0 0 rgba(230,51,109,.5);}50%{transform:translate(-50%,-50%) scale(1.08);box-shadow:0 0 0 10px rgba(230,51,109,0);}}
`;

const initials=(n)=>n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const condColor=(c)=>c==="firing"?"var(--mustard)":c==="fair"?"var(--teal)":"var(--faint)";
const condLabel=(c)=>c==="firing"?"FIRING":c==="fair"?"FAIR":"FLAT";
const condStampClass=(c)=>c==="firing"?"stamp":c==="fair"?"stamp stamp-teal":"";

const SPOTS=[
  {id:"trestles",name:"Trestles",type:"Point",x:60,y:20,secret:false,cond:"fair"},
  {id:"wedge",name:"The Wedge",type:"Beach",x:72,y:44,secret:false,cond:"firing"},
  {id:"blacks",name:"Blacks",type:"Beach",x:50,y:68,secret:false,cond:"flat"},
  {id:"ghost",name:"Ghost Reef",type:"Reef",x:40,y:32,secret:true,crew:"Dawn Patrol",by:"Maya R."},
  {id:"keyhole",name:"The Keyhole",type:"Reef",x:34,y:54,secret:true,crew:"Dawn Patrol",by:"You"},
  {id:"pole9",name:"Pole 9",type:"Beach",x:56,y:86,secret:true,crew:"South Swell",by:"Theo K."},
];
const seedCrews=[
  {id:"dawn",name:"Dawn Patrol",emblem:"◐",color:"var(--terra)",members:["You","Maya R.","Theo K.","Sol","Wren"],
    thread:[
      {id:"t1",type:"log",who:"Maya R.",spot:"Ghost Reef",ft:"4–5",wind:"Glassy",rating:5,note:"Empty lineup at first light. Best session in months.",t:"6:42a"},
      {id:"t2",type:"text",who:"Theo K.",text:"no wayyy you didn't tell anyone 😤",t:"7:10a"},
      {id:"t3",type:"text",who:"Maya R.",text:"you were asleep brother",t:"7:11a"},
      {id:"t4",type:"spot",who:"Sol",spot:"The Keyhole",note:"low tide only — sketchy paddle out but worth it",t:"Yest."},
    ]},
  {id:"south",name:"South Swell",emblem:"≈",color:"var(--teal)",members:["You","Theo K.","Nina","Cass","Beto","Jun"],
    thread:[
      {id:"s1",type:"text",who:"Nina",text:"south swell filling in friday, who's in",t:"2:03p"},
      {id:"s2",type:"log",who:"Beto",spot:"Pole 9",ft:"3",wind:"Light onshore",rating:3,note:"fun but crowded by 8",t:"Mon"},
    ]},
];
const seedCommunity=[
  {id:"c1",who:"kaimana_h",clip:true,mood:"firing",cap:"double overhead bomb at a spot I'll never name 🤐",likes:412,comments:38,liked:false},
  {id:"c2",who:"saltlines",clip:false,mood:"fair",cap:"dawn glass. no one out. this is the whole point.",likes:189,comments:11,liked:false},
  {id:"c3",who:"reefwitch",clip:true,mood:"firing",cap:"got pitched so hard my leash snapped lmao worth it",likes:902,comments:74,liked:true},
  {id:"c4",who:"tideandtype",clip:false,mood:"flat",cap:"flat day. logged it anyway. a journal is a journal.",likes:56,comments:4,liked:false},
];

export default function Lineup(){
  const[view,setView]=useState("crews");
  const[activeCrew,setActiveCrew]=useState(null);
  const[activeSpot,setActiveSpot]=useState(null);
  const[logging,setLogging]=useState(false);
  const[crews,setCrews]=useState(seedCrews);
  const[community,setCommunity]=useState(seedCommunity);
  const[mySessions,setMySessions]=useState([]);
  const[userPins,setUserPins]=useState([]);
  const[discovered,setDiscovered]=useState(["trestles","wedge","ghost","keyhole"]);
  const[draft,setDraft]=useState("");

  // drop-pin flow
  const[dropMode,setDropMode]=useState(false);
  const[pendingPin,setPendingPin]=useState(null);

  useEffect(()=>{
    (async()=>{try{const s=await window.storage.get("lineup-cat:state");if(s?.value){const d=JSON.parse(s.value);if(d.mySessions)setMySessions(d.mySessions);if(d.crews)setCrews(d.crews);if(d.community)setCommunity(d.community);if(d.userPins)setUserPins(d.userPins);if(d.discovered)setDiscovered(d.discovered);}}catch(e){}})();
  },[]);
  const persist=(patch)=>{const next={mySessions,crews,community,userPins,discovered,...patch};window.storage.set("lineup-cat:state",JSON.stringify(next)).catch(()=>{});};

  const streak=4+mySessions.length;
  const sessionCount=27+mySessions.length;
  const badges=[
    {id:"dawn",name:"Dawn Patrol",icon:Sunrise,got:true,color:"var(--terra)"},
    {id:"carto",name:"Cartographer",icon:Compass,got:userPins.length>0,color:"var(--teal)"},
    {id:"storm",name:"Storm Chaser",icon:Wind,got:mySessions.some(s=>s.rating>=4),color:"var(--mustard)"},
    {id:"local",name:"The Local",icon:MapPin,got:sessionCount>25,color:"var(--pink)"},
  ];

  const addLog=({spot,ft,wind,rating,note,visibility})=>{
    const entry={id:"m"+Date.now(),spot,ft,wind,rating,note,t:"Now"};
    const ms=[entry,...mySessions];
    let nc=crews,ncm=community;
    if(visibility.startsWith("crew:")){const cid=visibility.split(":")[1];nc=crews.map(c=>c.id===cid?{...c,thread:[...c.thread,{id:entry.id,type:"log",who:"You",spot,ft,wind,rating,note,t:"Now"}]}:c);}
    else if(visibility==="community"){ncm=[{id:entry.id,who:"you",clip:false,mood:rating>=4?"firing":rating>=3?"fair":"flat",cap:note||`${ft}ft at ${spot}`,likes:0,comments:0,liked:false},...community];}
    setMySessions(ms);setCrews(nc);setCommunity(ncm);
    persist({mySessions:ms,crews:nc,community:ncm});setLogging(false);
  };
  const sendMsg=(cid)=>{if(!draft.trim())return;const nc=crews.map(c=>c.id===cid?{...c,thread:[...c.thread,{id:"x"+Date.now(),type:"text",who:"You",text:draft,t:"Now"}]}:c);setCrews(nc);setDraft("");persist({crews:nc});};
  const toggleLike=(id)=>{const nc=community.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.likes+(p.liked?-1:1)}:p);setCommunity(nc);persist({community:nc});};
  const go=(v)=>{setActiveCrew(null);setActiveSpot(null);setView(v);};

  // ── drop-pin handlers ─────────────────────────────────────
  const startDrop=()=>{setDropMode(true);setPendingPin(null);};
  const placePin=(x,y)=>{setPendingPin({x,y});};
  const cancelDrop=()=>{setDropMode(false);setPendingPin(null);};
  const confirmPin=({name,type,visibility})=>{
    const newId="user-"+Date.now();
    let crewName=null;
    if(visibility.startsWith("crew:")){
      const cid=visibility.split(":")[1];
      crewName=crews.find(c=>c.id===cid)?.name||null;
    }
    const newSpot={
      id:newId, name, type, x:pendingPin.x, y:pendingPin.y,
      secret: visibility!=="community",
      cond:"fair", by:"You",
      crew:crewName, userDropped:true,
      visibility,
    };
    const up=[...userPins,newSpot];
    const dis=[...discovered,newId];
    setUserPins(up); setDiscovered(dis);

    // if shared to a crew, post a "pinned a spot" message in that crew thread
    let nc=crews;
    if(visibility.startsWith("crew:")){
      const cid=visibility.split(":")[1];
      nc=crews.map(c=>c.id===cid?{...c,thread:[...c.thread,{id:newId,type:"spot",who:"You",spot:name,note:`dropped a new ${type.toLowerCase()} spot`,t:"Now"}]}:c);
      setCrews(nc);
    }
    persist({userPins:up,discovered:dis,crews:nc});
    setDropMode(false); setPendingPin(null);
  };

  return(
    <div className="lu">
      <style>{CSS}</style>

      {!activeCrew&&!logging&&(
        <div className="top">
          <div>
            <div className="wordmark">lineup.</div>
            <div className="masthead-meta">A community surf journal · 1976</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div className="avatar" style={{width:36,height:36,fontSize:11,background:"var(--mustard)",color:"var(--ink)",border:"2px solid var(--cream)"}}>YO</div>
          </div>
        </div>
      )}

      {view==="crews"&&!activeCrew&&<CrewsList crews={crews} onOpen={c=>setActiveCrew(c)}/>}
      {view==="crews"&&activeCrew&&<CrewThread crew={crews.find(c=>c.id===activeCrew.id)} draft={draft} setDraft={setDraft} onSend={()=>sendMsg(activeCrew.id)} onBack={()=>setActiveCrew(null)}/>}
      {view==="map"&&<MapView
        discovered={discovered} userPins={userPins}
        dropMode={dropMode} pendingPin={pendingPin}
        onSpot={s=>!dropMode&&setActiveSpot(s)}
        onStartDrop={startDrop} onCancelDrop={cancelDrop} onPlacePin={placePin}/>}
      {view==="community"&&<Community posts={community} onLike={toggleLike}/>}
      {view==="profile"&&<Profile streak={streak} sessions={sessionCount} badges={badges} crews={crews} collected={discovered.length} total={SPOTS.length+userPins.length}/>}

      {activeSpot&&<SpotSheet spot={activeSpot} onClose={()=>setActiveSpot(null)} onLog={()=>{setActiveSpot(null);setLogging(true);}}/>}
      {logging&&<LogModal crews={crews} onClose={()=>setLogging(false)} onSubmit={addLog}/>}
      {dropMode&&pendingPin&&<NewPinSheet crews={crews} onCancel={cancelDrop} onConfirm={confirmPin}/>}

      <div className="nav">
        <NavBtn id="crews" label="Crews" icon={Users} view={view} go={go}/>
        <NavBtn id="map" label="Map" icon={MapIcon} view={view} go={go}/>
        <button className="logbtn" onClick={()=>setLogging(true)}>
          <Plus size={24} strokeWidth={2.8}/>
        </button>
        <NavBtn id="community" label="Feed" icon={Waves} view={view} go={go}/>
        <NavBtn id="profile" label="You" icon={User} view={view} go={go}/>
      </div>
    </div>
  );
}

function NavBtn({id,label,icon:Icon,view,go}){
  const on=view===id;
  return(
    <button className={"navbtn"+(on?" on":"")} onClick={()=>go(id)}>
      <Icon size={20} strokeWidth={on?2.4:1.8}/>
      {label}
    </button>
  );
}

/* ── CREWS LIST ── */
function CrewsList({crews,onOpen}){
  return(
    <div className="scroll" style={{padding:"22px 18px 24px"}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div className="kicker" style={{marginBottom:6}}>Group chats · private</div>
          <div className="h1">Your crews.</div>
        </div>
        <button className="icon-btn-dark"><Plus size={16}/></button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {crews.map((c,i)=>{
          const last=c.thread[c.thread.length-1];
          const preview=last.type==="text"?last.text:last.type==="log"?`${last.who} logged ${last.spot}`:`${last.who} pinned ${last.spot}`;
          return(
            <div key={c.id} className="card rise" onClick={()=>onOpen(c)}
              style={{display:"flex",cursor:"pointer",animationDelay:i*0.05+"s",overflow:"hidden"}}>
              <div style={{width:10,background:c.color,flex:"none"}}/>
              <div style={{flex:1,padding:"15px 15px",display:"flex",gap:13,minWidth:0}}>
                <div className="avatar disp" style={{width:46,height:46,fontSize:24,fontWeight:700,background:c.color,color:"var(--cream)"}}>{c.emblem}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                    <div className="h2">{c.name}</div>
                    <div className="mono" style={{fontSize:10,color:"var(--faint)",fontWeight:500}}>{last.t}</div>
                  </div>
                  <div style={{color:"var(--soft)",fontSize:14,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:3}}>{preview}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:9}}>
                    <div style={{display:"flex"}}>
                      {c.members.slice(0,4).map((m,j)=>(
                        <span key={j} className="avatar" style={{width:20,height:20,fontSize:8,fontWeight:700,background:j%2===0?"var(--terra)":"var(--teal)",color:"var(--cream)",marginLeft:j>0?-6:0,border:"2px solid var(--card)"}}>{initials(m)}</span>
                      ))}
                    </div>
                    <div className="mono" style={{fontSize:9.5,color:"var(--faint)",letterSpacing:1,fontWeight:500}}>{c.members.length} MEMBERS · {c.thread.length} ENTRIES</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn btn-ghost" style={{width:"100%",marginTop:18,borderStyle:"dashed"}}>
        <Plus size={14}/> Start a new crew
      </button>
    </div>
  );
}

/* ── CREW THREAD ── */
function CrewThread({crew,draft,setDraft,onSend,onBack}){
  const end=useRef(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[crew.thread.length]);
  return(
    <>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:crew.color,color:"var(--cream)",borderBottom:"4px solid var(--mustard)",flex:"none"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"var(--cream)"}}><ChevronLeft size={24}/></button>
        <div className="avatar disp" style={{width:34,height:34,fontSize:18,fontWeight:700,background:"var(--cream)",color:crew.color,border:"none"}}>{crew.emblem}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,letterSpacing:"-.3px"}}>{crew.name}</div>
          <div className="mono" style={{fontSize:9,color:"rgba(243,232,210,.7)",letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{crew.members.slice(0,4).join(" · ")}{crew.members.length>4?" …":""}</div>
        </div>
        <button className="icon-btn"><MoreHorizontal size={16}/></button>
      </div>

      <div className="scroll" style={{padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10,background:"var(--cream2)"}}>
        {crew.thread.map(m=><ThreadItem key={m.id} m={m} crewColor={crew.color}/>)}
        <div ref={end}/>
      </div>

      <div style={{display:"flex",gap:8,padding:"10px 12px",borderTop:"1.5px solid var(--line)",background:"var(--cream)",alignItems:"center",flex:"none"}}>
        <button style={{background:"var(--card)",border:"1.5px solid var(--line)",borderRadius:"50%",width:38,height:38,display:"grid",placeItems:"center",cursor:"pointer",color:"var(--terra)",flex:"none"}}><MapPin size={17}/></button>
        <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSend()} placeholder="Write something…"
          style={{flex:1,border:"1.5px solid var(--line)",borderRadius:22,padding:"10px 16px",fontFamily:"'Newsreader',serif",fontSize:15,background:"var(--card)",outline:"none",color:"var(--ink)"}}/>
        <button onClick={onSend} disabled={!draft.trim()} style={{background:draft.trim()?"var(--pink)":"var(--card)",border:draft.trim()?"none":"1.5px solid var(--line)",borderRadius:"50%",width:38,height:38,display:"grid",placeItems:"center",cursor:"pointer",color:draft.trim()?"var(--cream)":"var(--faint)",flex:"none",transition:"all .15s"}}><Send size={15}/></button>
      </div>
    </>
  );
}

function ThreadItem({m,crewColor}){
  const mine=m.who==="You";
  if(m.type==="text"){
    return(
      <div style={{alignSelf:mine?"flex-end":"flex-start",maxWidth:"78%"}}>
        {!mine&&<div className="mono" style={{fontSize:9,color:"var(--soft)",marginBottom:3,marginLeft:6,letterSpacing:.5,fontWeight:600}}>{m.who}</div>}
        <div style={{background:mine?crewColor:"var(--card)",color:mine?"var(--cream)":"var(--ink)",border:mine?"none":"1.5px solid var(--line)",padding:"10px 14px",borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px",fontSize:15,lineHeight:1.4}}>{m.text}</div>
      </div>
    );
  }
  if(m.type==="spot"){
    return(
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{height:5,background:"var(--teal)"}}/>
        <div style={{padding:14}}>
          <div className="mono" style={{fontSize:9.5,color:"var(--teal)",letterSpacing:1.5,display:"flex",alignItems:"center",gap:6,fontWeight:700}}><Navigation size={12}/> {m.who.toUpperCase()} PINNED A SPOT</div>
          <div className="h2" style={{margin:"6px 0 3px"}}>{m.spot}</div>
          <div style={{fontSize:14,fontStyle:"italic",color:"var(--soft)",lineHeight:1.45}}>{m.note}</div>
          <div className="mono" style={{fontSize:9,color:"var(--faint)",marginTop:10,display:"flex",alignItems:"center",gap:5,letterSpacing:1,fontWeight:500}}><Lock size={10}/> COORDS · CREW ONLY</div>
        </div>
      </div>
    );
  }
  const ratingColor=m.rating>=4?"var(--mustard)":m.rating>=3?"var(--teal)":"var(--faint)";
  return(
    <div className="card" style={{overflow:"hidden"}}>
      <div style={{height:5,background:ratingColor}}/>
      <div style={{padding:"12px 14px 8px",display:"flex",alignItems:"center",gap:8}}>
        <div className="avatar" style={{width:22,height:22,fontSize:8.5,background:"var(--terra)",color:"var(--cream)",flex:"none",fontWeight:700}}>{initials(m.who)}</div>
        <span style={{fontSize:13,fontWeight:600}}>{m.who}</span>
        <span style={{color:"var(--faint)",fontSize:12}}>logged a session</span>
        <span className="mono" style={{fontSize:9.5,color:"var(--faint)",marginLeft:"auto",fontWeight:500}}>{m.t}</span>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:14,padding:"2px 14px 10px"}}>
        <span className="disp" style={{fontSize:52,fontWeight:700,lineHeight:.85,letterSpacing:-1.5,color:"var(--ink)"}}>{m.ft}<span style={{fontSize:17,fontWeight:500,color:"var(--soft)"}}> ft</span></span>
        <div style={{flex:1,minWidth:0}}>
          <div className="disp" style={{fontSize:16,fontWeight:700,fontStyle:"italic"}}>{m.spot}</div>
          <div className="mono" style={{fontSize:10,color:"var(--soft)",letterSpacing:.5,marginTop:2,fontWeight:500}}>{m.wind.toUpperCase()}</div>
          <div style={{display:"flex",gap:2,marginTop:6}}>
            {[1,2,3,4,5].map(n=><Star key={n} size={12} fill={n<=m.rating?ratingColor:"none"} color={n<=m.rating?ratingColor:"var(--line2)"}/>)}
          </div>
        </div>
      </div>
      {m.note&&<div style={{padding:"0 14px 14px",fontSize:14,fontStyle:"italic",lineHeight:1.5,color:"var(--ink)",borderTop:"1px dashed var(--line)",marginTop:4,paddingTop:10}}>{m.note}</div>}
    </div>
  );
}

/* ── MAP — 70s travel poster (sun removed) ── */
function MapView({discovered,userPins,dropMode,pendingPin,onSpot,onStartDrop,onCancelDrop,onPlacePin}){
  const mapRef=useRef(null);

  const handleMapClick=(e)=>{
    if(!dropMode) return;
    const rect=mapRef.current.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width)*100;
    const y=((e.clientY-rect.top)/rect.height)*108;
    if(x<2||x>98||y<2||y>106) return;
    onPlacePin(x,y);
  };

  const allSpots=[...SPOTS,...userPins];

  return(
    <div className="scroll" style={{padding:"22px 18px 26px"}}>
      <div style={{marginBottom:18}}>
        <div className="kicker" style={{marginBottom:6}}>The break map · charted</div>
        <div className="h1">Your lineup.</div>
        <div style={{fontSize:14,color:"var(--soft)",marginTop:6,fontStyle:"italic",lineHeight:1.4}}>Public breaks for everyone — crew spots locked to your group.</div>
      </div>

      <div className="card" ref={mapRef} onClick={handleMapClick}
        style={{position:"relative",width:"100%",aspectRatio:"1/1.08",overflow:"hidden",padding:0,background:"var(--paper)",cursor:dropMode?"crosshair":"default"}}>
        <svg viewBox="0 0 100 108" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          {/* ocean contour lines — teal */}
          {[14,24,34,44,54].map((o,i)=>(
            <path key={i} d={`M ${o} 0 Q ${o+12} 36 ${o-4} 66 T ${o+6} 108`} fill="none" stroke="var(--teal)" strokeWidth="0.5" opacity={0.32-i*0.05}/>
          ))}
          {/* terracotta land mass */}
          <path d="M 64 0 Q 58 18 67 36 Q 77 50 62 68 Q 50 84 64 98 L 64 108 L 100 108 L 100 0 Z" fill="var(--terra)" stroke="var(--terra-deep)" strokeWidth="0.5"/>
          {/* land texture */}
          {[...Array(40)].map((_,i)=>(
            <circle key={i} cx={70+Math.random()*28} cy={Math.random()*108} r={0.4} fill="var(--terra-deep)" opacity={0.4}/>
          ))}
          <text x="82" y="56" fontFamily="JetBrains Mono" fontSize="3" fill="var(--cream)" letterSpacing="1.5" fontWeight="700" transform="rotate(90 82 56)">PACIFIC COAST</text>
          {/* compass — bottom-left */}
          <g transform="translate(8 95)">
            <circle r="3.5" fill="none" stroke="var(--soft)" strokeWidth="0.4"/>
            <path d="M 0 -3 L .8 0 L 0 3 L -.8 0 Z" fill="var(--terra)"/>
            <text x="0" y="-4.5" fontFamily="JetBrains Mono" fontSize="2" fill="var(--soft)" textAnchor="middle" fontWeight="700">N</text>
          </g>
        </svg>

        {allSpots.map(s=>{
          const known=discovered.includes(s.id);
          const firing=s.cond==="firing"&&!s.secret;
          const c=s.secret?"var(--ink)":condColor(s.cond);
          return(
            <button key={s.id} onClick={(e)=>{e.stopPropagation();onSpot(s);}}
              style={{position:"absolute",left:s.x+"%",top:(s.y/1.08)+"%",transform:"translate(-50%,-50%)",background:"none",border:"none",cursor:dropMode?"crosshair":"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,pointerEvents:dropMode?"none":"auto"}}>
              <span style={{width:14,height:14,borderRadius:"50%",background:known?c:"transparent",border:`2.5px solid ${c}`,boxShadow:firing?"0 0 0 4px rgba(217,168,71,.25)":s.secret?"0 0 0 3px rgba(42,31,21,.1)":"none",display:"grid",placeItems:"center"}}>
                {s.secret&&<Lock size={7} color="var(--cream)"/>}
                {firing&&<span style={{width:5,height:5,borderRadius:"50%",background:"var(--cream)"}}/>}
              </span>
              <span className="mono" style={{fontSize:8,color:"var(--ink)",background:"var(--cream)",padding:"2px 5px",borderRadius:3,whiteSpace:"nowrap",opacity:known?1:0.4,fontWeight:700,letterSpacing:.5,border:"1px solid var(--line)"}}>{known?s.name:"???"}</span>
            </button>
          );
        })}

        {/* pending pin (during drop confirmation) */}
        {pendingPin&&(
          <span style={{position:"absolute",left:pendingPin.x+"%",top:(pendingPin.y/1.08)+"%",
            width:18,height:18,borderRadius:"50%",background:"var(--pink)",border:"3px solid var(--cream)",
            animation:"pinpulse 1.4s ease infinite",zIndex:7,pointerEvents:"none"}}/>
        )}

        {/* drop-mode overlay (instructions + cancel) */}
        {dropMode&&!pendingPin&&(
          <div className="drop-overlay" onClick={(e)=>{/* clicks bubble to mapRef */}}>
            <span className="drop-instruction"><Crosshair size={12}/> Tap to drop a pin</span>
            <button className="drop-cancel" onClick={(e)=>{e.stopPropagation();onCancelDrop();}}>Cancel</button>
          </div>
        )}

        {/* drop-pin FAB */}
        {!dropMode&&(
          <button className="drop-fab" onClick={(e)=>{e.stopPropagation();onStartDrop();}}>
            <Crosshair size={13} strokeWidth={2.5}/> Drop a pin
          </button>
        )}
      </div>

      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:14}}>
        {[{c:"var(--mustard)",t:"Firing"},{c:"var(--teal)",t:"Fair"},{c:"var(--faint)",t:"Flat"},{c:"var(--ink)",t:"Crew secret",lock:true}].map(l=>(
          <span key={l.t} className="chip">
            <span style={{width:8,height:8,borderRadius:"50%",background:l.c,display:"grid",placeItems:"center"}}>{l.lock&&<Lock size={5} color="var(--cream)"/>}</span>{l.t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── NEW PIN SHEET — bottom sheet after dropping a pin ── */
function NewPinSheet({crews,onCancel,onConfirm}){
  const[name,setName]=useState("");
  const[type,setType]=useState("Beach");
  const[vis,setVis]=useState("crew:"+crews[0].id);

  return(
    <div onClick={onCancel} style={{position:"absolute",inset:0,background:"rgba(42,31,21,.55)",zIndex:50,display:"flex",alignItems:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} className="rise"
        style={{width:"100%",background:"var(--cream)",borderRadius:"20px 20px 0 0",overflow:"hidden",border:"1.5px solid var(--line)",borderBottom:"none"}}>
        <div style={{height:8,background:"var(--pink)"}}/>
        <div style={{padding:"18px 22px 24px"}}>
          <div style={{width:40,height:4,background:"var(--line2)",borderRadius:4,margin:"0 auto 18px"}}/>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
            <div>
              <span className="stamp stamp-pink"><Crosshair size={10} style={{marginRight:4,marginBottom:-1}}/>NEW SPOT</span>
              <div className="h1" style={{fontSize:28,marginTop:10}}>Name this spot.</div>
            </div>
            <button onClick={onCancel} className="icon-btn-dark"><X size={18}/></button>
          </div>

          <div style={{marginBottom:18}}>
            <div className="kicker" style={{marginBottom:9,color:"var(--teal)"}}>Spot name</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="What's it called?" autoFocus
              style={{width:"100%",border:"1.5px solid var(--line)",borderRadius:6,padding:"13px 15px",fontFamily:"'Newsreader',serif",fontStyle:"italic",fontSize:17,background:"var(--card)",outline:"none",color:"var(--ink)"}}/>
          </div>

          <div style={{marginBottom:18}}>
            <div className="kicker" style={{marginBottom:9,color:"var(--teal)"}}>Type</div>
            <div style={{display:"flex",gap:6}}>
              {["Beach","Reef","Point"].map(v=>(
                <button key={v} onClick={()=>setType(v)} className="mono"
                  style={{flex:1,padding:"10px 13px",borderRadius:5,fontSize:11,fontWeight:700,letterSpacing:1,cursor:"pointer",
                    border:`1.5px solid ${type===v?"var(--terra)":"var(--line)"}`,
                    background:type===v?"var(--terra)":"var(--card)",
                    color:type===v?"var(--cream)":"var(--ink)",transition:"all .12s"}}>
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:18}}>
            <div className="kicker" style={{marginBottom:9,color:"var(--teal)"}}>Share with</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <PinVis on={vis==="private"} onClick={()=>setVis("private")} icon={Lock} title="Just me" sub="Private — only you see this pin" color="var(--ink)"/>
              {crews.map(c=>(
                <PinVis key={c.id} on={vis==="crew:"+c.id} onClick={()=>setVis("crew:"+c.id)} icon={Users} title={c.name} sub={`Shared with ${c.members.length} crew members`} color={c.color}/>
              ))}
              <PinVis on={vis==="community"} onClick={()=>setVis("community")} icon={Waves} title="Community" sub="Public — anyone can see" color="var(--pink)"/>
            </div>
          </div>

          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" style={{flex:"none",padding:"13px 18px"}} onClick={onCancel}>Cancel</button>
            <button className="btn btn-terra" style={{flex:1}} disabled={!name.trim()}
              onClick={()=>onConfirm({name:name.trim(),type,visibility:vis})}>
              <Check size={15}/> Drop pin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function PinVis({on,onClick,icon:Icon,title,sub,color}){
  return(
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",borderRadius:6,cursor:"pointer",textAlign:"left",width:"100%",border:`1.5px solid ${on?color:"var(--line)"}`,background:on?"var(--paper)":"var(--card)",position:"relative",overflow:"hidden",transition:"all .12s"}}>
      {on&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:5,background:color}}/>}
      <div style={{width:34,height:34,borderRadius:6,background:color,display:"grid",placeItems:"center",flex:"none",marginLeft:on?5:0,transition:"margin .12s"}}><Icon size={16} color="var(--cream)"/></div>
      <span style={{flex:1}}>
        <div className="disp" style={{fontSize:15,fontWeight:700}}>{title}</div>
        <div className="mono" style={{fontSize:9.5,color:"var(--soft)",fontWeight:500}}>{sub}</div>
      </span>
      <span style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${on?color:"var(--line2)"}`,background:on?color:"transparent",display:"grid",placeItems:"center"}}>
        {on&&<Check size={11} color="var(--cream)" strokeWidth={3}/>}
      </span>
    </button>
  );
}

/* ── SPOT SHEET ── */
function SpotSheet({spot,onClose,onLog}){
  const stripeColor=spot.secret?"var(--ink)":condColor(spot.cond);
  return(
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(42,31,21,.5)",zIndex:30,display:"flex",alignItems:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} className="rise"
        style={{width:"100%",background:"var(--cream)",borderRadius:"20px 20px 0 0",overflow:"hidden",position:"relative",border:"1.5px solid var(--line)",borderBottom:"none"}}>
        <div style={{height:8,background:stripeColor}}/>
        <div style={{padding:"18px 22px 30px",position:"relative"}}>
          <div style={{width:40,height:4,background:"var(--line2)",borderRadius:4,margin:"0 auto 18px"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <span className={condStampClass(spot.cond)||"stamp"} style={spot.secret?{background:"var(--ink)",color:"var(--cream)"}:{}}>
                {spot.secret?`${spot.crew||"YOUR"} · SECRET`:condLabel(spot.cond)} · {spot.type}
              </span>
              <div className="h1" style={{fontSize:34,marginTop:10}}>{spot.name}</div>
            </div>
            <button onClick={onClose} className="icon-btn-dark"><X size={18}/></button>
          </div>

          {spot.secret?(
            <div className="card" style={{padding:14,margin:"18px 0",background:"var(--paper)",borderColor:"var(--ink)"}}>
              <div className="mono" style={{fontSize:10,color:"var(--ink)",letterSpacing:1.5,display:"flex",alignItems:"center",gap:6,fontWeight:700}}><Lock size={11}/> {spot.crew?`SHARED BY ${(spot.by||"").toUpperCase()}`:"PRIVATE PIN"}</div>
              <div style={{fontSize:14,fontStyle:"italic",color:"var(--soft)",marginTop:7,lineHeight:1.5}}>{spot.crew?<>Coordinates visible because you're in <b style={{color:"var(--ink)",fontStyle:"normal",fontWeight:700}}>{spot.crew}</b>. Outsiders see open water.</>:<>Only you can see this spot. Share to a crew anytime.</>}</div>
            </div>
          ):(
            <>
              <div style={{display:"flex",alignItems:"baseline",gap:10,margin:"20px 0 10px"}}>
                <span className="disp" style={{fontSize:70,fontWeight:700,lineHeight:.85,letterSpacing:-2,color:"var(--ink)"}}>3–4</span>
                <span className="disp" style={{fontSize:20,fontStyle:"italic",color:"var(--soft)"}}>ft @ 12s</span>
              </div>
              <div style={{display:"flex",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                <span className="chip"><Wind size={11}/> Light W · 4mph</span>
                <span className="chip">12 logs this week</span>
              </div>
            </>
          )}

          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button className="btn btn-terra" style={{flex:1}} onClick={onLog}><Plus size={15}/> Log session</button>
            <button className="btn btn-ghost"><Navigation size={15}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LOG MODAL ── */
function LogModal({crews,onClose,onSubmit}){
  const[spot,setSpot]=useState("");
  const[ft,setFt]=useState("3");
  const[wind,setWind]=useState("Glassy");
  const[rating,setRating]=useState(4);
  const[note,setNote]=useState("");
  const[vis,setVis]=useState("crew:"+crews[0].id);

  return(
    <div style={{position:"absolute",inset:0,background:"var(--cream)",zIndex:40,display:"flex",flexDirection:"column"}} className="rise">
      <div style={{background:"var(--pink)",color:"var(--cream)",padding:"15px 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"4px solid var(--mustard)",flex:"none"}}>
        <div>
          <div className="mono" style={{fontSize:9.5,letterSpacing:2.5,opacity:.8,fontWeight:600}}>NEW ENTRY</div>
          <div className="disp" style={{fontSize:24,fontWeight:700,marginTop:2,letterSpacing:"-.5px"}}>Log a session.</div>
        </div>
        <button onClick={onClose} className="icon-btn"><X size={18}/></button>
      </div>

      <div className="scroll" style={{padding:"22px 20px"}}>
        <Field label="Where">
          <input value={spot} onChange={e=>setSpot(e.target.value)} placeholder="Spot name…"
            style={{width:"100%",border:"1.5px solid var(--line)",borderRadius:6,padding:"13px 15px",fontFamily:"'Newsreader',serif",fontStyle:"italic",fontSize:17,background:"var(--card)",outline:"none",color:"var(--ink)"}}/>
        </Field>

        <Field label="Wave height">
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["1–2","2–3","3","4–5","6+"].map(v=><Pick key={v} on={ft===v} onClick={()=>setFt(v)}>{v}</Pick>)}
          </div>
        </Field>

        <Field label="Wind & surface">
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Glassy","Light onshore","Side-shore","Blown out"].map(v=><Pick key={v} on={wind===v} onClick={()=>setWind(v)}>{v}</Pick>)}
          </div>
        </Field>

        <Field label="How was it?">
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setRating(n)} style={{background:"none",border:"none",cursor:"pointer",padding:2}}>
                <Star size={32} fill={n<=rating?"var(--mustard)":"none"} color={n<=rating?"var(--mustard)":"var(--line2)"} strokeWidth={1.5}/>
              </button>))}
            <span className="disp" style={{marginLeft:10,fontSize:32,fontWeight:700,color:"var(--ink)",lineHeight:1}}>{rating}<span style={{fontSize:16,fontWeight:500,color:"var(--soft)"}}>/5</span></span>
          </div>
        </Field>

        <Field label="Field note">
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Glass at dawn, empty lineup, offshore till 9…"
            style={{width:"100%",border:"1.5px solid var(--line)",borderRadius:6,padding:"12px 15px",fontFamily:"'Newsreader',serif",fontStyle:"italic",fontSize:16,background:"var(--card)",outline:"none",color:"var(--ink)",resize:"none",lineHeight:1.5}}/>
        </Field>

        <Field label="Share with">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <VisRow on={vis==="private"} onClick={()=>setVis("private")} icon={Lock} title="Just me" sub="Stays in your journal" color="var(--ink)"/>
            {crews.map(c=><VisRow key={c.id} on={vis==="crew:"+c.id} onClick={()=>setVis("crew:"+c.id)} icon={Users} title={c.name} sub={`${c.members.length} crew members`} color={c.color}/>)}
            <VisRow on={vis==="community"} onClick={()=>setVis("community")} icon={Waves} title="Community" sub="Public feed" color="var(--pink)"/>
          </div>
        </Field>
        <div style={{height:8}}/>
      </div>

      <div style={{padding:"12px 20px max(14px,env(safe-area-inset-bottom))",borderTop:"1.5px solid var(--line)",background:"var(--cream2)",flex:"none"}}>
        <button className="btn btn-terra" style={{width:"100%",padding:15}} disabled={!spot.trim()}
          onClick={()=>onSubmit({spot:spot.trim(),ft,wind,rating,note:note.trim(),visibility:vis})}>
          <Check size={16}/> Save entry
        </button>
      </div>
    </div>
  );
}
function Field({label,children}){
  return(<div style={{marginBottom:22}}><div className="kicker" style={{marginBottom:9,color:"var(--teal)"}}>{label}</div>{children}</div>);
}
function Pick({on,onClick,children}){
  return(<button onClick={onClick} className="mono" style={{padding:"9px 13px",borderRadius:5,fontSize:11,fontWeight:700,letterSpacing:1,cursor:"pointer",border:`1.5px solid ${on?"var(--terra)":"var(--line)"}`,background:on?"var(--terra)":"var(--card)",color:on?"var(--cream)":"var(--ink)",transition:"all .12s"}}>{children}</button>);
}
function VisRow({on,onClick,icon:Icon,title,sub,color}){
  return(
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",borderRadius:6,cursor:"pointer",textAlign:"left",width:"100%",border:`1.5px solid ${on?color:"var(--line)"}`,background:on?"var(--paper)":"var(--card)",transition:"all .12s",position:"relative",overflow:"hidden"}}>
      {on&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:5,background:color}}/>}
      <div style={{width:34,height:34,borderRadius:6,background:color,display:"grid",placeItems:"center",flex:"none",marginLeft:on?5:0,transition:"margin .12s"}}><Icon size={16} color="var(--cream)"/></div>
      <span style={{flex:1}}>
        <div className="disp" style={{fontSize:15,fontWeight:700}}>{title}</div>
        <div className="mono" style={{fontSize:9.5,color:"var(--soft)",fontWeight:500}}>{sub}</div>
      </span>
      <span style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${on?color:"var(--line2)"}`,background:on?color:"transparent",display:"grid",placeItems:"center"}}>
        {on&&<Check size={11} color="var(--cream)" strokeWidth={3}/>}
      </span>
    </button>
  );
}

/* ── COMMUNITY ── */
function Community({posts,onLike}){
  return(
    <div className="scroll" style={{padding:"22px 0 26px"}}>
      <div style={{padding:"0 18px",marginBottom:20}}>
        <div className="kicker" style={{marginBottom:6,color:"var(--pink)"}}>The community · public</div>
        <div className="h1">What's out there.</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {posts.map((p,i)=>(
          <div key={p.id} className="rise" style={{animationDelay:i*0.05+"s",padding:"0 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
              <div className="avatar" style={{width:36,height:36,fontSize:12,fontWeight:700,background:i%2===0?"var(--terra)":"var(--teal)",color:"var(--cream)"}}>{initials(p.who)}</div>
              <div style={{flex:1}}>
                <div className="disp" style={{fontSize:15,fontWeight:700}}>@{p.who}</div>
                <div className="mono" style={{fontSize:9.5,color:"var(--faint)",letterSpacing:.5,marginTop:1,fontWeight:500}}>2h ago</div>
              </div>
              {p.mood==="firing"&&<span className="stamp">FIRING</span>}
              {p.mood==="fair"&&<span className="stamp stamp-teal">FAIR</span>}
              <button className="icon-btn-dark" style={{width:30,height:30}}><MoreHorizontal size={14}/></button>
            </div>

            {p.clip&&<ClipThumb mood={p.mood}/>}

            <div style={{padding:p.clip?"14px 2px 4px":"0 2px 4px",fontSize:15,lineHeight:1.5,color:"var(--ink)",fontStyle:p.clip?"normal":"italic"}}>{p.cap}</div>

            <div style={{display:"flex",alignItems:"center",gap:18,padding:"6px 2px 0"}}>
              <button onClick={()=>onLike(p.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:p.liked?"var(--pink)":"var(--soft)",padding:0}}>
                <Heart size={19} fill={p.liked?"var(--pink)":"none"} strokeWidth={2}/>
                <span className="mono" style={{fontSize:12,fontWeight:600}}>{p.likes}</span>
              </button>
              <span style={{display:"flex",alignItems:"center",gap:6,color:"var(--soft)"}}>
                <MessageCircle size={18} strokeWidth={1.8}/><span className="mono" style={{fontSize:12,fontWeight:600}}>{p.comments}</span>
              </span>
              <span style={{marginLeft:"auto",color:"var(--soft)"}}>
                <Share2 size={17} strokeWidth={1.8}/>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ClipThumb({mood}){
  const[playing,setPlaying]=useState(false);
  return(
    <div onClick={()=>setPlaying(v=>!v)} style={{position:"relative",aspectRatio:"4/5",cursor:"pointer",overflow:"hidden",borderRadius:8,background:"linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)",border:"2px solid var(--ink)"}}>
      <svg viewBox="0 0 100 125" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        {[0,1,2,3,4].map(n=>(
          <path key={n} d={`M 0 ${50+n*12} Q 25 ${36+n*12} 50 ${52+n*12} T 100 ${44+n*12}`} fill="none" stroke="rgba(243,232,210,.4)" strokeWidth="0.7"
            style={playing?{animation:"pulse 1.6s ease infinite",animationDelay:n*.2+"s"}:{}}/>
        ))}
      </svg>
      <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:"var(--cream)",display:"grid",placeItems:"center",boxShadow:"0 6px 20px rgba(0,0,0,.4)",border:"3px solid var(--ink)"}}>
          {playing?<span className="mono" style={{fontSize:9,color:"var(--ink)",fontWeight:700}}>LIVE</span>:<Play size={22} color="var(--ink)" fill="var(--ink)" style={{marginLeft:3}}/>}
        </div>
      </div>
      <span className="mono" style={{position:"absolute",top:12,right:12,fontSize:9.5,color:"var(--cream)",letterSpacing:1,background:"rgba(42,31,21,.7)",padding:"3px 8px",borderRadius:4,fontWeight:600}}>0:14</span>
    </div>
  );
}

/* ── PROFILE ── */
function Profile({streak,sessions,badges,crews,collected,total}){
  return(
    <div className="scroll" style={{padding:"22px 18px 28px"}}>
      <div className="card" style={{marginBottom:24,overflow:"hidden"}}>
        <div style={{height:8,background:"var(--terra)"}}/>
        <div style={{padding:"20px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:15}}>
            <div className="avatar disp" style={{width:62,height:62,fontSize:24,fontWeight:700,background:"var(--mustard)",color:"var(--ink)",border:"3px solid var(--ink)"}}>YO</div>
            <div>
              <div className="h1" style={{fontSize:26}}>You</div>
              <div style={{fontSize:14,color:"var(--soft)",fontStyle:"italic"}}>@localswell · Long Beach, CA</div>
              <div className="mono" style={{fontSize:9.5,color:"var(--faint)",letterSpacing:1,marginTop:3,fontWeight:500}}>MEMBER SINCE JAN '26</div>
            </div>
          </div>
          <div style={{borderTop:"1.5px dashed var(--line2)",margin:"18px 0"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,textAlign:"center"}}>
            <Stat n={sessions} l="Sessions" c="var(--terra)"/>
            <Stat n={<span style={{display:"inline-flex",alignItems:"center",gap:3}}>{streak}<Flame size={22} color="var(--pink)" fill="var(--pink)"/></span>} l="Wk streak" c="var(--pink)"/>
            <Stat n={<span>{collected}<span className="disp" style={{fontSize:17,fontWeight:500,color:"var(--faint)"}}>/{total}</span></span>} l="Spots" c="var(--teal)"/>
          </div>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:13}}>
        <div>
          <div className="kicker" style={{marginBottom:4,color:"var(--mustard-deep)"}}>Earned</div>
          <div className="h2">Patches.</div>
        </div>
        <div className="mono" style={{fontSize:10,color:"var(--faint)",letterSpacing:1,fontWeight:600}}>{badges.filter(b=>b.got).length}/{badges.length}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:26}}>
        {badges.map(b=>(
          <div key={b.id} className="card" style={{display:"flex",alignItems:"center",gap:11,padding:14,opacity:b.got?1:0.45,overflow:"hidden",position:"relative"}}>
            {b.got&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:5,background:b.color}}/>}
            <div style={{width:40,height:40,borderRadius:"50%",display:"grid",placeItems:"center",background:b.got?b.color:"var(--paper)",border:b.got?`2px solid ${b.color}`:"1.5px solid var(--line)",flex:"none",marginLeft:b.got?5:0}}>
              <b.icon size={18} color={b.got?"var(--cream)":"var(--faint)"} strokeWidth={2}/>
            </div>
            <div style={{minWidth:0}}>
              <div className="disp" style={{fontSize:14,fontWeight:700}}>{b.name}</div>
              <div className="mono" style={{fontSize:9,color:"var(--faint)",letterSpacing:1,marginTop:2,fontWeight:600}}>{b.got?"EARNED":"LOCKED"}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="kicker" style={{marginBottom:4,color:"var(--teal)"}}>Group chats</div>
      <div className="h2" style={{marginBottom:12}}>Your crews.</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {crews.map(c=>(
          <div key={c.id} className="card" style={{display:"flex",alignItems:"center",overflow:"hidden"}}>
            <div style={{width:6,alignSelf:"stretch",background:c.color}}/>
            <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,flex:1}}>
              <div className="avatar disp" style={{width:34,height:34,fontSize:16,fontWeight:700,background:c.color,color:"var(--cream)"}}>{c.emblem}</div>
              <div style={{flex:1}}>
                <div className="disp" style={{fontSize:14.5,fontWeight:700}}>{c.name}</div>
                <div className="mono" style={{fontSize:9.5,color:"var(--faint)",letterSpacing:.8,marginTop:1,fontWeight:500}}>{c.members.length} MEMBERS</div>
              </div>
              <ChevronRight size={16} color="var(--faint)"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Stat({n,l,c}){
  return(
    <div>
      <div className="disp" style={{fontSize:42,fontWeight:700,lineHeight:.9,letterSpacing:-1.5,color:"var(--ink)"}}>{n}</div>
      <div className="mono" style={{fontSize:9,color:c||"var(--faint)",letterSpacing:1.5,marginTop:6,textTransform:"uppercase",fontWeight:700}}>{l}</div>
    </div>
  );
}
