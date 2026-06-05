import React, { useState } from "react";
import {
  Map as MapIcon, Users, Plus, Heart, MessageCircle, Lock, MapPin,
  Send, Play, ChevronRight, Star, Flame, Sunrise, Compass, X, Check,
  Navigation, Crosshair, Search, Bell, Waves, Wind, MoreHorizontal,
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

html,body{margin:0;padding:0;background:#ede0c5;}
.lu*{box-sizing:border-box;margin:0;padding:0;}
.lu{
  --cream:#f3e8d2; --cream2:#ede0c5; --card:#f9efd9; --paper:#fbf4e3;
  --terra:#c54f2d; --terra-deep:#9d3a1c;
  --mustard:#d9a847; --mustard-deep:#b08530;
  --teal:#1d5366; --teal-deep:#0e3947; --teal-soft:#a8c5cf;
  --pink:#e6336d; --pink-soft:#f7b6c8;
  --ink:#2a1f15; --soft:#7a6850; --faint:#a89880; --line:#d4c4a3; --line2:#c5b48f;
  font-family:'Newsreader',Georgia,serif; color:var(--ink);
  background:var(--cream); min-height:100vh;
  width:100%; -webkit-font-smoothing:antialiased;
}
.lu .mono{font-family:'JetBrains Mono',monospace;}
.lu .disp{font-family:'Fraunces',serif;}
.lu .serif-it{font-family:'Fraunces',serif;font-style:italic;}

/* ─── HEADER — slim cream-on-cream, top horizontal nav ─── */
.lu .header{
  position:sticky;top:0;z-index:20;
  background:var(--cream);
  border-bottom:1.5px solid var(--line);
  padding:14px 36px;display:flex;align-items:center;justify-content:space-between;
}
.lu .header-mustard{position:absolute;left:0;right:0;bottom:-3px;height:3px;background:var(--mustard);}
.lu .wordmark{font-family:'Bagel Fat One',sans-serif;font-size:30px;letter-spacing:-1px;color:var(--terra);line-height:.85;}
.lu .nav-links{display:flex;align-items:center;gap:6px;}
.lu .nav-link{
  font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;letter-spacing:1.5px;
  text-transform:uppercase;color:var(--soft);padding:8px 14px;border-radius:4px;cursor:pointer;
  background:none;border:none;transition:all .12s;
}
.lu .nav-link:hover{color:var(--ink);background:rgba(42,31,21,.05);}
.lu .nav-link.on{color:var(--cream);background:var(--ink);}
.lu .header-actions{display:flex;align-items:center;gap:10px;}
.lu .icon-btn{
  width:38px;height:38px;border-radius:50%;background:var(--card);border:1.5px solid var(--line);
  display:grid;place-items:center;cursor:pointer;color:var(--ink);transition:background .12s;
}
.lu .icon-btn:hover{background:var(--paper);}
.lu .cta-log{
  background:var(--pink);color:var(--cream);border:none;
  padding:10px 16px;border-radius:6px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1.2px;
  text-transform:uppercase;display:inline-flex;align-items:center;gap:6px;
  box-shadow:0 3px 10px -2px rgba(230,51,109,.4);transition:transform .1s;
}
.lu .cta-log:active{transform:scale(.97);}
.lu .avatar{
  border-radius:50%;display:grid;place-items:center;
  font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--cream);flex:none;
}

/* ─── MAIN CONTAINER ─── */
.lu .main{max-width:1280px;margin:0 auto;padding:48px 36px 80px;}

/* ─── TYPE SYSTEM ─── */
.lu .kicker{
  font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:3px;
  text-transform:uppercase;color:var(--terra);font-weight:700;
}
.lu .h-display{
  font-family:'Fraunces',serif;font-style:italic;font-weight:500;
  font-size:64px;letter-spacing:-2px;line-height:1.02;color:var(--ink);
}
.lu .h-section{font-family:'Fraunces',serif;font-weight:700;font-size:36px;letter-spacing:-1px;line-height:1;}
.lu .h-card{font-family:'Fraunces',serif;font-weight:700;font-size:22px;letter-spacing:-.4px;}
.lu .label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--faint);font-weight:600;}
.lu .stamp{
  font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:1.5px;
  text-transform:uppercase;font-weight:700;
  background:var(--mustard);color:var(--ink);padding:4px 10px;border-radius:3px;display:inline-block;
}
.lu .stamp-teal{background:var(--teal);color:var(--cream);}
.lu .stamp-pink{background:var(--pink);color:var(--cream);}
.lu .stamp-terra{background:var(--terra);color:var(--cream);}

/* ─── CARD ─── */
.lu .card{background:var(--card);border:1.5px solid var(--line);border-radius:8px;position:relative;}

/* ─── BTN ─── */
.lu .btn{
  font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;
  padding:11px 16px;border-radius:6px;border:none;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:transform .1s;
}
.lu .btn:active{transform:scale(.98);}
.lu .btn-ink{background:var(--ink);color:var(--cream);}
.lu .btn-terra{background:var(--terra);color:var(--cream);}
.lu .btn-ghost{background:transparent;border:1.5px solid var(--ink);color:var(--ink);}

.lu .chip{
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;
  padding:5px 10px;border-radius:20px;background:var(--paper);border:1.5px solid var(--line);
  display:inline-flex;align-items:center;gap:5px;color:var(--soft);
}

@keyframes rise{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.lu .rise{animation:rise .4s ease both;}
@keyframes pulse{0%,100%{opacity:.45;}50%{opacity:1;}}
`;

const initials=(n)=>n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const condColor=(c)=>c==="firing"?"var(--mustard)":c==="fair"?"var(--teal)":"var(--faint)";
const condLabel=(c)=>c==="firing"?"FIRING":c==="fair"?"FAIR":"FLAT";

const SPOTS=[
  {id:"trestles",name:"Trestles",type:"Point",x:60,y:20,secret:false,cond:"fair"},
  {id:"wedge",name:"The Wedge",type:"Beach",x:72,y:44,secret:false,cond:"firing"},
  {id:"blacks",name:"Blacks",type:"Beach",x:50,y:68,secret:false,cond:"flat"},
  {id:"ghost",name:"Ghost Reef",type:"Reef",x:40,y:32,secret:true,crew:"Dawn Patrol",by:"Maya R."},
  {id:"keyhole",name:"The Keyhole",type:"Reef",x:34,y:54,secret:true,crew:"Dawn Patrol",by:"You"},
  {id:"pole9",name:"Pole 9",type:"Beach",x:56,y:86,secret:true,crew:"South Swell",by:"Theo K."},
];

const CREWS=[
  {id:"dawn",name:"Dawn Patrol",emblem:"◐",color:"var(--terra)",members:["You","Maya R.","Theo K.","Sol","Wren"],
    recent:[
      {who:"Maya R.",text:"Ghost Reef was 5-foot glass this morning. Empty.",t:"6:42a",kind:"text"},
      {who:"Theo K.",text:"no wayyy you didn't tell anyone 😤",t:"7:10a",kind:"text"},
      {who:"Sol",text:"dropped a new pin: The Keyhole — low tide only",t:"Yest",kind:"spot"},
    ]},
  {id:"south",name:"South Swell",emblem:"≈",color:"var(--teal)",members:["You","Theo K.","Nina","Cass","Beto","Jun"],
    recent:[
      {who:"Nina",text:"south swell filling in friday — who's in?",t:"2:03p",kind:"text"},
      {who:"Beto",text:"logged Pole 9 — 3ft, light onshore, fun til 8",t:"Mon",kind:"log"},
    ]},
];

const COMMUNITY=[
  {id:"c1",who:"kaimana_h",clip:true,mood:"firing",cap:"double overhead bomb at a spot I'll never name 🤐",likes:412,comments:38,liked:false},
  {id:"c3",who:"reefwitch",clip:true,mood:"firing",cap:"got pitched so hard my leash snapped lmao worth it",likes:902,comments:74,liked:true},
  {id:"c2",who:"saltlines",clip:false,mood:"fair",cap:"dawn glass. no one out. this is the whole point.",likes:189,comments:11,liked:false},
];

const MY_LOGS=[
  {id:1,date:"Jun 1",spot:"Trestles",ft:"3–4",wind:"Glassy",rating:4,note:"Solid morning. Long rights, light crowd, ankle held up.",crew:"Dawn Patrol",crewColor:"var(--terra)"},
  {id:2,date:"May 29",spot:"The Wedge",ft:"5",wind:"Side-shore",rating:5,note:"Heaviest day in months. Got cleaned up on a closeout but caught two bombs.",crew:"Community",crewColor:"var(--pink)"},
  {id:3,date:"May 27",spot:"Pole 9",ft:"2–3",wind:"Light onshore",rating:3,note:"Fun longboard day. Glassy 'til 9, then onshore.",crew:"South Swell",crewColor:"var(--teal)"},
  {id:4,date:"May 24",spot:"Blacks",ft:"2",wind:"Glassy",rating:3,note:"Soft but consistent. Worked on cutbacks.",crew:"Just me",crewColor:"var(--ink)"},
];

export default function LineupDesktop(){
  const[view,setView]=useState("home");
  const[activeSpot,setActiveSpot]=useState(null);

  return(
    <div className="lu">
      <style>{CSS}</style>

      {/* ─── HEADER ─── */}
      <header className="header">
        <div className="header-mustard"/>
        <div style={{display:"flex",alignItems:"center",gap:36}}>
          <div className="wordmark">lineup.</div>
          <nav className="nav-links">
            <button className={"nav-link"+(view==="home"?" on":"")} onClick={()=>setView("home")}>Home</button>
            <button className={"nav-link"+(view==="crews"?" on":"")} onClick={()=>setView("crews")}>Crews</button>
            <button className={"nav-link"+(view==="map"?" on":"")} onClick={()=>setView("map")}>Map</button>
            <button className={"nav-link"+(view==="feed"?" on":"")} onClick={()=>setView("feed")}>Feed</button>
            <button className={"nav-link"+(view==="journal"?" on":"")} onClick={()=>setView("journal")}>Journal</button>
          </nav>
        </div>
        <div className="header-actions">
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",background:"var(--card)",border:"1.5px solid var(--line)",borderRadius:6,color:"var(--faint)",fontSize:13,minWidth:200}}>
            <Search size={15}/> <span className="mono" style={{fontSize:11,letterSpacing:.5}}>Search spots, crews…</span>
          </div>
          <button className="icon-btn"><Bell size={16}/></button>
          <button className="cta-log"><Plus size={14}/> Log session</button>
          <div className="avatar" style={{width:38,height:38,fontSize:12,background:"var(--mustard)",color:"var(--ink)",border:"2px solid var(--ink)"}}>YO</div>
        </div>
      </header>

      {/* ─── MAIN — single dashboard view following Sandbar's editorial flow ─── */}
      <main className="main">

        {/* HERO */}
        <section style={{marginBottom:56,display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:48,alignItems:"flex-end"}}>
          <div className="rise">
            <div className="kicker" style={{marginBottom:14}}>Dashboard · Wednesday, June 3</div>
            <h1 className="h-display">
              Welcome back,
              <br/>
              <span className="serif-it" style={{color:"var(--terra)"}}>Luke.</span>
            </h1>
            <p style={{fontSize:18,color:"var(--soft)",lineHeight:1.5,marginTop:18,maxWidth:480,fontStyle:"italic"}}>
              Three crewmates posted this week. The Wedge is firing, and you've got a spot waiting at Ghost Reef.
            </p>
          </div>

          {/* current conditions snapshot — Sandbar-flavored */}
          <div className="card rise" style={{padding:"24px 26px",animationDelay:".05s",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"var(--mustard)"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,marginTop:8}}>
              <span className="stamp">FIRING TODAY</span>
              <span className="mono" style={{fontSize:10,color:"var(--faint)",letterSpacing:1.5}}>NEAR YOU · 12MI</span>
            </div>
            <div className="disp" style={{fontSize:24,fontWeight:700,letterSpacing:"-.4px",marginBottom:6}}>The Wedge</div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:14}}>
              <span className="disp" style={{fontSize:72,fontWeight:700,letterSpacing:-3,lineHeight:.85,color:"var(--ink)"}}>4–5</span>
              <span className="serif-it" style={{fontSize:20,color:"var(--soft)"}}>ft @ 11s</span>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              <span className="chip"><Wind size={11}/> Light W · 4mph</span>
              <span className="chip">12 logs this week</span>
            </div>
          </div>
        </section>

        {/* STAT ROW */}
        <section style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:64}}>
          <StatBlock label="Sessions" value="27" sub="this year" accent="var(--terra)"/>
          <StatBlock label="Streak" value={<>5 <Flame size={36} color="var(--pink)" fill="var(--pink)"/></>} sub="weeks in a row" accent="var(--pink)"/>
          <StatBlock label="Spots collected" value={<>4<span style={{fontSize:38,fontWeight:500,color:"var(--faint)"}}>/6</span></>} sub="discovered" accent="var(--teal)"/>
        </section>

        {/* TWO-COLUMN: CREW ACTIVITY + RIGHT RAIL (map + community) */}
        <section style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:32,marginBottom:64}}>

          {/* LEFT: crew activity */}
          <div>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:20}}>
              <div>
                <div className="kicker" style={{marginBottom:8}}>Group chats · 2 crews</div>
                <div className="h-section">Crew activity.</div>
              </div>
              <button className="btn btn-ghost">See all →</button>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {CREWS.map(c=>(
                <div key={c.id} className="card" style={{overflow:"hidden"}}>
                  {/* header — crew color band */}
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:c.color,color:"var(--cream)"}}>
                    <div className="disp" style={{width:36,height:36,borderRadius:5,background:"var(--cream)",color:c.color,display:"grid",placeItems:"center",fontSize:18,fontWeight:700}}>{c.emblem}</div>
                    <div style={{flex:1}}>
                      <div className="disp" style={{fontSize:17,fontWeight:700}}>{c.name}</div>
                      <div className="mono" style={{fontSize:9.5,letterSpacing:1,opacity:.8}}>{c.members.length} MEMBERS · {c.recent.length} NEW</div>
                    </div>
                    <button style={{background:"rgba(243,232,210,.18)",border:"1px solid rgba(243,232,210,.4)",color:"var(--cream)",padding:"6px 12px",borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:1,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>OPEN →</button>
                  </div>
                  {/* recent messages */}
                  <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:10}}>
                    {c.recent.map((m,i)=>(
                      <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                        <div className="avatar" style={{width:24,height:24,fontSize:8,background:i%2===0?"var(--terra)":"var(--teal)",color:"var(--cream)",flex:"none",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{initials(m.who)}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                            <span style={{fontSize:13,fontWeight:600}}>{m.who}</span>
                            {m.kind==="spot"&&<span className="stamp stamp-teal" style={{fontSize:8}}>PINNED</span>}
                            {m.kind==="log"&&<span className="stamp" style={{fontSize:8}}>LOGGED</span>}
                            <span className="mono" style={{fontSize:9,color:"var(--faint)",marginLeft:"auto"}}>{m.t}</span>
                          </div>
                          <div style={{fontSize:14,color:"var(--soft)",fontStyle:"italic",lineHeight:1.4,marginTop:2}}>{m.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div style={{display:"flex",flexDirection:"column",gap:24}}>

            {/* MAP PREVIEW */}
            <div>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div className="kicker" style={{marginBottom:6,color:"var(--teal)"}}>Charted</div>
                  <div className="h-section" style={{fontSize:28}}>The map.</div>
                </div>
                <button className="btn btn-ghost" style={{padding:"8px 12px",fontSize:10}}>Open →</button>
              </div>

              <div className="card" style={{position:"relative",aspectRatio:"1/1",overflow:"hidden",padding:0,background:"var(--paper)"}}>
                <svg viewBox="0 0 100 100" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
                  {[14,24,34,44,54].map((o,i)=>(
                    <path key={i} d={`M ${o} 0 Q ${o+12} 33 ${o-4} 60 T ${o+6} 100`} fill="none" stroke="var(--teal)" strokeWidth="0.5" opacity={0.32-i*0.05}/>
                  ))}
                  <path d="M 64 0 Q 58 16 67 33 Q 77 47 62 62 Q 50 78 64 92 L 64 100 L 100 100 L 100 0 Z" fill="var(--terra)" stroke="var(--terra-deep)" strokeWidth="0.5"/>
                  {[...Array(30)].map((_,i)=>(
                    <circle key={i} cx={70+Math.random()*28} cy={Math.random()*100} r={0.4} fill="var(--terra-deep)" opacity={0.4}/>
                  ))}
                  <g transform="translate(8 88)">
                    <circle r="3" fill="none" stroke="var(--soft)" strokeWidth="0.4"/>
                    <path d="M 0 -2.6 L .7 0 L 0 2.6 L -.7 0 Z" fill="var(--terra)"/>
                    <text x="0" y="-4" fontFamily="JetBrains Mono" fontSize="1.8" fill="var(--soft)" textAnchor="middle" fontWeight="700">N</text>
                  </g>
                </svg>
                {SPOTS.map(s=>{
                  const firing=s.cond==="firing"&&!s.secret;
                  const c=s.secret?"var(--ink)":condColor(s.cond);
                  return(
                    <button key={s.id} onClick={()=>setActiveSpot(s)}
                      style={{position:"absolute",left:s.x+"%",top:s.y+"%",transform:"translate(-50%,-50%)",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <span style={{width:12,height:12,borderRadius:"50%",background:c,border:`2px solid ${c}`,boxShadow:firing?"0 0 0 3px rgba(217,168,71,.3)":s.secret?"0 0 0 2px rgba(42,31,21,.1)":"none",display:"grid",placeItems:"center"}}>
                        {s.secret&&<Lock size={6} color="var(--cream)"/>}
                        {firing&&<span style={{width:4,height:4,borderRadius:"50%",background:"var(--cream)"}}/>}
                      </span>
                      <span className="mono" style={{fontSize:7,color:"var(--ink)",background:"var(--cream)",padding:"1px 4px",borderRadius:2,whiteSpace:"nowrap",fontWeight:700,border:"1px solid var(--line)"}}>{s.name}</span>
                    </button>
                  );
                })}
                <button style={{position:"absolute",bottom:12,right:12,background:"var(--pink)",color:"var(--cream)",border:"2px solid var(--cream)",borderRadius:24,padding:"8px 12px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,letterSpacing:1,display:"inline-flex",alignItems:"center",gap:5,boxShadow:"0 4px 10px -2px rgba(230,51,109,.4)"}}>
                  <Crosshair size={12}/> Drop pin
                </button>
              </div>
            </div>

            {/* COMMUNITY HIGHLIGHTS */}
            <div>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div className="kicker" style={{marginBottom:6,color:"var(--pink)"}}>Public · this week</div>
                  <div className="h-section" style={{fontSize:28}}>Trending.</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {COMMUNITY.slice(0,3).map((p,i)=>(
                  <div key={p.id} className="card" style={{padding:"12px 14px",display:"flex",gap:12,alignItems:"center"}}>
                    {p.clip?(
                      <div style={{width:60,height:60,borderRadius:5,background:"linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)",border:"1.5px solid var(--ink)",flex:"none",display:"grid",placeItems:"center"}}>
                        <Play size={18} fill="var(--cream)" color="var(--cream)" style={{marginLeft:2}}/>
                      </div>
                    ):(
                      <div style={{width:60,height:60,borderRadius:5,background:"var(--paper)",border:"1.5px dashed var(--line)",flex:"none",display:"grid",placeItems:"center"}}>
                        <MessageCircle size={20} color="var(--faint)"/>
                      </div>
                    )}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        <span className="disp" style={{fontSize:13,fontWeight:700}}>@{p.who}</span>
                        {p.mood==="firing"&&<span className="stamp" style={{fontSize:7.5,padding:"2px 5px"}}>FIRING</span>}
                      </div>
                      <div style={{fontSize:13,color:"var(--soft)",fontStyle:"italic",lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.cap}</div>
                      <div style={{display:"flex",gap:12,marginTop:6}}>
                        <span style={{display:"flex",alignItems:"center",gap:4,color:p.liked?"var(--pink)":"var(--faint)"}}>
                          <Heart size={12} fill={p.liked?"var(--pink)":"none"}/>
                          <span className="mono" style={{fontSize:10,fontWeight:600}}>{p.likes}</span>
                        </span>
                        <span style={{display:"flex",alignItems:"center",gap:4,color:"var(--faint)"}}>
                          <MessageCircle size={12}/>
                          <span className="mono" style={{fontSize:10,fontWeight:600}}>{p.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* JOURNAL — recent personal logs */}
        <section>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:24}}>
            <div>
              <div className="kicker" style={{marginBottom:8,color:"var(--mustard-deep)"}}>Field log · 4 most recent</div>
              <div className="h-section">Your journal.</div>
            </div>
            <button className="btn btn-ghost">All entries →</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {MY_LOGS.map(l=>{
              const stripe=l.rating>=4?"var(--mustard)":l.rating>=3?"var(--teal)":"var(--faint)";
              return(
                <div key={l.id} className="card" style={{overflow:"hidden",display:"flex"}}>
                  <div style={{width:6,background:stripe}}/>
                  <div style={{padding:"18px 20px",flex:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <div className="mono" style={{fontSize:10,letterSpacing:1.5,color:"var(--faint)",fontWeight:600}}>{l.date.toUpperCase()}</div>
                      <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:20,background:l.crewColor,color:l.crewColor==="var(--ink)"?"var(--cream)":"var(--cream)"}} className="mono">
                        <span style={{fontSize:8.5,fontWeight:700,letterSpacing:1}}>{l.crew.toUpperCase()}</span>
                      </span>
                    </div>
                    <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
                      <span className="disp" style={{fontSize:44,fontWeight:700,lineHeight:.85,letterSpacing:-1.5}}>{l.ft}<span style={{fontSize:15,color:"var(--soft)"}}> ft</span></span>
                      <div style={{flex:1}}>
                        <div className="disp" style={{fontSize:18,fontStyle:"italic",fontWeight:700}}>{l.spot}</div>
                        <div className="mono" style={{fontSize:9.5,color:"var(--soft)",letterSpacing:.5,marginTop:1,fontWeight:500}}>{l.wind.toUpperCase()}</div>
                      </div>
                      <div style={{display:"flex",gap:2}}>
                        {[1,2,3,4,5].map(n=><Star key={n} size={13} fill={n<=l.rating?stripe:"none"} color={n<=l.rating?stripe:"var(--line2)"}/>)}
                      </div>
                    </div>
                    <div style={{fontSize:14,fontStyle:"italic",color:"var(--ink)",lineHeight:1.5,borderTop:"1px dashed var(--line)",marginTop:10,paddingTop:10}}>{l.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{marginTop:80,paddingTop:36,borderTop:"1.5px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="wordmark" style={{fontSize:22}}>lineup.</div>
          <div className="mono" style={{fontSize:10,color:"var(--faint)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:600}}>A community surf journal · est. '26 · long beach, ca</div>
          <div style={{display:"flex",gap:18}}>
            <span className="mono" style={{fontSize:10,color:"var(--soft)",letterSpacing:1.5,cursor:"pointer",fontWeight:600}}>ABOUT</span>
            <span className="mono" style={{fontSize:10,color:"var(--soft)",letterSpacing:1.5,cursor:"pointer",fontWeight:600}}>PRIVACY</span>
            <span className="mono" style={{fontSize:10,color:"var(--soft)",letterSpacing:1.5,cursor:"pointer",fontWeight:600}}>SUPPORT</span>
          </div>
        </footer>
      </main>

      {/* SPOT SHEET (modal on map click) */}
      {activeSpot&&(
        <div onClick={()=>setActiveSpot(null)} style={{position:"fixed",inset:0,background:"rgba(42,31,21,.5)",zIndex:50,display:"grid",placeItems:"center"}}>
          <div onClick={e=>e.stopPropagation()} className="rise" style={{background:"var(--cream)",borderRadius:10,overflow:"hidden",width:480,maxWidth:"90vw",border:"1.5px solid var(--line)"}}>
            <div style={{height:8,background:activeSpot.secret?"var(--ink)":condColor(activeSpot.cond)}}/>
            <div style={{padding:"24px 26px 26px",position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <span className="stamp" style={activeSpot.secret?{background:"var(--ink)",color:"var(--cream)"}:{}}>
                    {activeSpot.secret?`${activeSpot.crew} · SECRET`:condLabel(activeSpot.cond)} · {activeSpot.type}
                  </span>
                  <div className="disp" style={{fontSize:36,fontWeight:700,marginTop:10,letterSpacing:-1}}>{activeSpot.name}</div>
                </div>
                <button onClick={()=>setActiveSpot(null)} className="icon-btn"><X size={16}/></button>
              </div>
              {activeSpot.secret?(
                <div className="card" style={{padding:14,margin:"16px 0",background:"var(--paper)",borderColor:"var(--ink)"}}>
                  <div className="mono" style={{fontSize:10,color:"var(--ink)",letterSpacing:1.5,display:"flex",alignItems:"center",gap:6,fontWeight:700}}><Lock size={11}/> SHARED BY {(activeSpot.by||"").toUpperCase()}</div>
                  <div style={{fontSize:14,fontStyle:"italic",color:"var(--soft)",marginTop:7,lineHeight:1.5}}>Coordinates visible because you're in <b style={{color:"var(--ink)",fontStyle:"normal",fontWeight:700}}>{activeSpot.crew}</b>. Outsiders see open water.</div>
                </div>
              ):(
                <>
                  <div style={{display:"flex",alignItems:"baseline",gap:10,margin:"18px 0 10px"}}>
                    <span className="disp" style={{fontSize:64,fontWeight:700,lineHeight:.85,letterSpacing:-2}}>3–4</span>
                    <span className="serif-it" style={{fontSize:18,color:"var(--soft)"}}>ft @ 12s</span>
                  </div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    <span className="chip"><Wind size={11}/> Light W · 4mph</span>
                    <span className="chip">12 logs this week</span>
                  </div>
                </>
              )}
              <div style={{display:"flex",gap:10,marginTop:18}}>
                <button className="btn btn-terra" style={{flex:1}}><Plus size={13}/> Log a session</button>
                <button className="btn btn-ghost"><Navigation size={13}/> Directions</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBlock({label,value,sub,accent}){
  return(
    <div className="card rise" style={{padding:"24px 26px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:5,background:accent}}/>
      <div className="label" style={{marginBottom:14,paddingLeft:5}}>{label}</div>
      <div className="disp" style={{fontSize:64,fontWeight:700,letterSpacing:-2.5,lineHeight:.85,display:"flex",alignItems:"center",gap:8,paddingLeft:5}}>{value}</div>
      <div className="mono" style={{fontSize:10,color:"var(--faint)",letterSpacing:1.5,marginTop:10,fontWeight:600,paddingLeft:5}}>{sub.toUpperCase()}</div>
    </div>
  );
}
