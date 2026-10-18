import { LandmarkArt } from './AdventureArt';
import { CHRONICLES } from './chronicleContent';
import type { TrailPoint } from './chronicleRoute';

type TrailArtProps={page:number;chapter:number;points:TrailPoint[];restored:boolean[];celebrating:number};

const areaClass=(restored:boolean,celebrating:boolean)=>`trail-story-area ${restored?'is-restored':'is-waiting'} ${celebrating?'is-celebrating':''}`;

/** Book-specific, top-down terrain. Coordinates share the lesson trail's viewBox. */
export function ChronicleTrailArt({page,chapter,points,restored,celebrating}:TrailArtProps) {
  const orchard=page===0;
  const theme=CHRONICLES[chapter]??CHRONICLES[0];
  const gardens=[0,3,4].includes(chapter);
  if(chapter===1)return <svg className="chronicle-trail-art lantern-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id={`lantern-sky-${page}`} cx="50%" cy="0%" r="100%"><stop offset="0" stopColor="#6f5b96"/><stop offset="1" stopColor="#332d57"/></radialGradient><radialGradient id={`lantern-glow-${page}`}><stop offset="0" stopColor="#fff8a8" stopOpacity=".95"/><stop offset="1" stopColor="#ffc44d" stopOpacity="0"/></radialGradient></defs>
    <rect width="900" height="360" fill={`url(#lantern-sky-${page})`}/>
    <path d="M0 285Q120 228 250 286T500 280T720 260T900 295V360H0Z" fill="#46566c"/>
    <path d="M0 330Q145 276 275 328T545 322T735 307T900 330V360H0Z" fill="#35495b"/>
    <g opacity=".72" fill="#fff8c7">{[[62,42],[170,70],[278,36],[392,62],[520,32],[630,69],[758,42],[850,74]].map(([x,y])=><circle key={x} cx={x} cy={y} r="2.5"/>)}</g>
    {points.map((point,index)=><ellipse key={`lantern-restore-${index}`} className={`trail-restoration-patch lantern-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx={page===2?220:150} ry="115" fill="#ffd76a"/>) }
    {page===0&&<>
      {[160,450,740].map((x,index)=><g key={x} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${x} ${[200,155,200][index]})`}>
        <ellipse className="lantern-map-glow" rx="72" ry="64" fill={`url(#lantern-glow-${page})`}/><path d="M0 68V-3" stroke="#b99a59" strokeWidth="9"/><path d="M-28-12 0-35 28-12 20 28H-20Z" fill="#594d78" stroke="#efb53c" strokeWidth="5"/><rect className="lantern-map-light" x="-13" y="-7" width="26" height="24" rx="4" fill="#7a6b92"/><path d="M-21 30H21" stroke="#efb53c" strokeWidth="6"/>
        {index===0&&<g className="lantern-awaken-detail"><circle cy="-58" r="17" fill="#ffd45d"/><g stroke="#ffd45d" strokeWidth="4">{[-28,28].map(dx=><path key={dx} d={`M${dx}-58h${dx<0?-12:12}`}/>)}</g></g>}
        {index===1&&<g className="lantern-awaken-detail"><ellipse cx="-38" cy="44" rx="13" ry="17" fill="#ffefb0"/><ellipse cx="38" cy="44" rx="13" ry="17" fill="#ffefb0"/></g>}
        {index===2&&<g className="lantern-awaken-detail"><path d="M-49 54h98" stroke="#96704d" strokeWidth="12"/><path d="M-38 54v-26m76 26v-26" stroke="#96704d" strokeWidth="8"/></g>}
      </g>)}
    </>}
    {page===1&&<>
      <g className={areaClass(Boolean(restored[0]),celebrating===0)}>{[120,145,173,198].map((x,i)=><circle className="lantern-firefly" key={x} cx={x} cy={175+(i%2)*29} r="5" fill="#ffe56e"/>)}</g>
      <g className={areaClass(Boolean(restored[1]),celebrating===1)} transform="translate(450 166)"><ellipse cy="86" rx="95" ry="17" fill="#15263855"/><path d="M-78 70V-8L0-54 78-8V70Z" fill="#69557f" stroke="#f3bf4d" strokeWidth="5"/><path d="M-47 70V10H47V70" fill="#3d315a"/><g className="lantern-workshop-windows" fill="#796989"><rect x="-57" y="-21" width="29" height="25"/><rect x="28" y="-21" width="29" height="25"/></g></g>
      <g className={areaClass(Boolean(restored[2]),celebrating===2)} transform="translate(750 176)">{[-42,0,42].map((x,i)=><g key={x} transform={`translate(${x} ${i===1?-24:0})`}><path d="M0 64V10" stroke="#b99a59" strokeWidth="7"/><path d="M-18 7 0-10 18 7 13 36H-13Z" fill="#5b4e77" stroke="#efb53c" strokeWidth="4"/><rect className="lantern-map-light" x="-8" y="7" width="16" height="15" rx="3" fill="#7a6b92"/></g>)}</g>
    </>}
    {page>=2&&<g className={areaClass(Boolean(restored[0]),celebrating===0)} transform="translate(730 130)"><ellipse className="lantern-map-glow" rx="150" ry="125" fill={`url(#lantern-glow-${page})`}/><path d="M-82 125V20L0-45 82 20V125Z" fill="#5e5279" stroke="#f3bf4d" strokeWidth="7"/><path d="M-35 124V45Q0 8 35 45V124Z" fill="#332d57"/><path d="M0-46V-90" stroke="#f3bf4d" strokeWidth="8"/><path d="m0-105 17 24H-17Z" fill="#ffd45e"/><g className="lantern-tower-windows" fill="#7b6a91"><rect x="-57" y="24" width="20" height="28"/><rect x="37" y="24" width="20" height="28"/></g></g>}
    {[90,280,580,845].map((x,i)=><g key={x} transform={`translate(${x} ${300-(i%2)*20})`}><path d="M0 25V0" stroke="#273d45" strokeWidth="7"/><circle r="25" fill="#314d55"/></g>)}
  </svg>;
  if(chapter===2)return <svg className="chronicle-trail-art market-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <rect width="900" height="360" fill="#d9f4f7"/>
    <path d="M0 92Q150 38 300 93T600 78T900 90V0H0Z" fill="#80cfce"/>
    <path d="M0 286Q130 238 278 292T565 278T900 292V360H0Z" fill="#b5dba2"/>
    <path d="M0 329Q190 286 365 326T720 316T900 328V360H0Z" fill="#8bcf91"/>
    <g opacity=".5" fill="#fff">{[[80,42],[225,63],[405,37],[610,56],[790,32]].map(([x,y])=><path key={x} d={`M${x} ${y}h38l-9 9H${x+9}Z`}/>)}</g>
    {points.map((point,index)=><ellipse key={`market-restore-${index}`} className={`trail-restoration-patch market-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="145" ry="110" fill={['#ffe48a','#ffc7d8','#8ee5d1'][index%3]}/>) }
    {points.map((point,index)=><g key={`market-stall-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(275,point.y+65)})`}>
      <ellipse cy="44" rx="70" ry="13" fill="#53766d33"/>
      <path d="M-55 40V-18H55V40" fill="#fff9df" stroke="#8f785a" strokeWidth="4"/>
      <path className="market-map-awning" d="M-68-18h136L53-54H-53Z" fill="#9aa6a4" stroke="#fff4d6" strokeWidth="4"/>
      <path className="market-map-stripe" d="M-42-52v34M0-54v36M42-52v34" stroke="#d5dcda" strokeWidth="14"/>
      <rect className="market-map-label" x="-30" y="2" width="60" height="22" rx="4" fill="#ddd7c7"/>
      <g className="market-map-goods">{index===0?<><circle cx="-31" cy="30" r="9" fill="#ef6b7b"/><circle cx="-8" cy="30" r="9" fill="#ffd45e"/><circle cx="17" cy="30" r="9" fill="#69c68c"/></>:index===1?<><path d="M-40 35h25V7h-25Z" fill="#67d5e7"/><path d="M-2 34 12 7l14 27Z" fill="#a78bfa"/><rect x="34" y="10" width="15" height="25" fill="#f3a650"/></>:<><rect x="-43" y="10" width="28" height="25" fill="#ef6b7b"/><rect x="-5" y="4" width="28" height="31" fill="#60b9dd"/><rect x="33" y="13" width="18" height="22" fill="#ffd45e"/></>}</g>
      <text className="market-map-word" x="0" y="18" textAnchor="middle" fontSize="13" fontWeight="700" fill="#175862">{page===0?['p','f','n'][index]:page===1?['pin','fin','tin'][index]:['net','pen','map'][index]}</text>
    </g>)}
    {[95,305,585,830].map((x,i)=><g key={x} transform={`translate(${x} ${310-(i%2)*18})`}><rect x="-4" y="0" width="8" height="28" fill="#927051"/><circle cy="-4" r="22" fill="#42bd84"/></g>)}
  </svg>;
  if(chapter===4)return <svg className="chronicle-trail-art drawbridge-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`bridge-sky-${page}`} x2="0" y2="1"><stop stopColor="#bee5ed"/><stop offset="1" stopColor="#f4dfa7"/></linearGradient><linearGradient id={`bridge-river-${page}`} x2="1"><stop stopColor="#278ead"/><stop offset=".5" stopColor="#55bed5"/><stop offset="1" stopColor="#278ead"/></linearGradient></defs>
    <rect width="900" height="360" fill={`url(#bridge-sky-${page})`}/>
    <path d="M0 236Q130 184 260 230T515 222T745 205T900 232V360H0Z" fill="#91b36e"/>
    <path d="M0 302Q135 260 286 302T568 290T900 308V360H0Z" fill="#658f5e"/>
    <path d="M0 332Q170 260 320 329T620 316T900 326V360H0Z" fill={`url(#bridge-river-${page})`}/>
    <path d="M0 342Q160 280 320 343T620 330T900 340" fill="none" stroke="#a8e3ec" strokeWidth="5" strokeDasharray="38 28" opacity=".75"/>
    {points.map((point,index)=><ellipse key={`bridge-restore-${index}`} className={`trail-restoration-patch drawbridge-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="150" ry="112" fill={index%2?'#ffd67f':'#b9df83'}/>) }
    {points.map((point,index)=><g key={`bridge-marker-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(278,point.y+72)})`}>
      <path d="M-68 34Q0 9 68 34" stroke="#5d4733" strokeWidth="10" fill="none"/>
      {[-48,-24,0,24,48].map(x=><rect className="drawbridge-map-plank" key={x} x={x-10} y="5" width="20" height="55" rx="3" fill="#9d9488" stroke="#6e685f" strokeWidth="3" transform={`rotate(${x/18} ${x} 33)`}/>) }
      <g className="drawbridge-map-flag"><path d="M0-6v-46" stroke="#79512f" strokeWidth="5"/><path d="M3-51h38l-9 14 9 14H3Z" fill={index%2?'#ef6d79':'#f2ba45'}/></g>
      <text className="drawbridge-map-word" x="0" y="87" textAnchor="middle" fontSize="14" fontWeight="750" fill="#563a22">{page===0?['u','g','d'][index]:['join','build','read'][index]}</text>
    </g>)}
    {page>=1&&<g className={areaClass(Boolean(restored.at(-1)),celebrating===restored.length-1)} transform="translate(790 130)"><ellipse cy="109" rx="108" ry="20" fill="#34544533"/><path d="M-98 104V-8H-43V104M43 104V-8H98V104" fill="#c9b783" stroke="#826b4f" strokeWidth="7"/><path d="M-105-8h69v-29h-17v-20h-17v20h-18v-20h-17Z" fill="#b5a476"/><path d="M36-8h69v-49H88v20H70v-20H53v20H36Z" fill="#b5a476"/><path className="drawbridge-map-gate" d="M-47 104V28Q0-32 47 28V104Z" fill="#5f5549"/><path className="drawbridge-map-door" d="M-34 104V34Q0-10 34 34V104Z" fill="#96704a"/><path d="M-30 100 0 70l30 30" stroke="#e9bd64" strokeWidth="6" fill="none"/></g>}
    {[82,290,560,846].map((x,index)=><g key={x} transform={`translate(${x} ${300-(index%2)*18})`}><path d="M0 25V0" stroke="#6d553b" strokeWidth="7"/><circle r="24" fill="#567f50"/></g>)}
  </svg>;
  if(chapter===5)return <svg className="chronicle-trail-art hall-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`hall-wall-${page}`} x2="0" y2="1"><stop stopColor="#55436f"/><stop offset="1" stopColor="#2d243f"/></linearGradient><radialGradient id={`hall-glow-${page}`}><stop stopColor="#ffe58c" stopOpacity=".9"/><stop offset="1" stopColor="#ba8cff" stopOpacity="0"/></radialGradient></defs>
    <rect width="900" height="360" fill={`url(#hall-wall-${page})`}/>
    <path d="M0 302 118 262 228 302 350 257 480 301 612 259 748 302 900 261V360H0Z" fill="#211b30"/>
    {[55,225,395,565,735].map(x=><g key={x} opacity=".38"><rect x={x} y="35" width="105" height="255" rx="50" fill="#7c6a92"/><rect x={x+16} y="55" width="73" height="235" rx="38" fill="#312740"/><path d={`M${x-12} 294h129`} stroke="#9480aa" strokeWidth="14"/></g>)}
    <g opacity=".55" fill="#fff4b5">{[[70,42],[178,87],[318,48],[480,78],[632,39],[790,72],[858,35]].map(([x,y])=><path key={x} d={`m${x} ${y}-3 7-7 3 7 3 3 7 3-7 7-3-7-3Z`}/>)}</g>
    {points.map((point,index)=><ellipse key={`hall-restore-${index}`} className={`trail-restoration-patch hall-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="145" ry="108" fill={`url(#hall-glow-${page})`}/>) }
    {points.map((point,index)=><g key={`hall-mirror-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(268,point.y+58)})`}>
      <ellipse cy="52" rx="62" ry="12" fill="#160f2455"/>
      <path className="hall-map-frame" d="M-47 43V-21Q0-82 47-21V43Z" fill="#6d6177" stroke="#a28eb3" strokeWidth="7"/>
      <path className="hall-map-mirror" d="M-34 37V-17Q0-60 34-17V37Z" fill="#8f879a"/>
      <g className="hall-map-rune"><path d="m0-28 5 12 13 5-13 5-5 13-5-13-13-5 13-5Z" fill="#ffe47b"/><text x="0" y="31" textAnchor="middle" fontSize="14" fontWeight="750" fill="#fff6bd">{page===0?['r','c','swap'][index]:['change','read'][index]}</text></g>
    </g>)}
    {page===1&&<g className={areaClass(Boolean(restored.at(-1)),celebrating===restored.length-1)} transform="translate(790 132)"><ellipse cy="113" rx="98" ry="18" fill="#160f2444"/><path d="M-86 105V-4Q0-104 86-4V105Z" fill="#4b3b62" stroke="#b89455" strokeWidth="9"/><path className="hall-map-door" d="M-59 104V4Q0-69 59 4V104Z" fill="#292139" stroke="#8064a6" strokeWidth="6"/><path className="hall-map-door-rune" d="m0-19 10 23 24 10-24 9-10 24-10-24-24-9 24-10Z" fill="#80748b"/></g>}
  </svg>;
  if(chapter===6)return <svg className="chronicle-trail-art keeper-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`keeper-wall-${page}`} x2="0" y2="1"><stop stopColor="#754657"/><stop offset="1" stopColor="#3d2834"/></linearGradient><radialGradient id={`keeper-glow-${page}`}><stop stopColor="#ffe791" stopOpacity=".92"/><stop offset="1" stopColor="#e68b79" stopOpacity="0"/></radialGradient></defs>
    <rect width="900" height="360" fill={`url(#keeper-wall-${page})`}/>
    <path d="M0 300Q145 270 286 302T570 292T900 304V360H0Z" fill="#2f2229"/>
    <path d="M0 326Q160 301 320 326T640 318T900 329" fill="none" stroke="#8e624d" strokeWidth="20" opacity=".5"/>
    {[35,215,395,575,755].map(x=><g key={x} opacity=".42"><path d={`M${x} 290V100Q${x+52} 25 ${x+104} 100V290`} fill="#4a303d" stroke="#a27661" strokeWidth="12"/><path d={`M${x+20} 289V112Q${x+52} 62 ${x+84} 112V289`} fill="#291d26"/></g>)}
    <g fill="#f8d88b" opacity=".58">{[[72,47],[164,82],[290,42],[430,69],[562,39],[686,78],[816,45]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3"/>)}</g>
    {points.map((point,index)=><ellipse key={`keeper-restore-${index}`} className={`trail-restoration-patch keeper-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="148" ry="112" fill={`url(#keeper-glow-${page})`}/>) }
    {points.map((point,index)=><g key={`keeper-door-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(270,point.y+62)})`}>
      <ellipse cy="56" rx="67" ry="13" fill="#1c111855"/>
      <path className="keeper-map-frame" d="M-52 45V-18Q0-83 52-18V45Z" fill="#74515b" stroke="#9c8072" strokeWidth="8"/>
      <path className="keeper-map-door" d="M-37 40V-14Q0-59 37-14V40Z" fill="#4a303a"/>
      <g className="keeper-map-key"><circle cx="-12" cy="-6" r="13" fill="none" stroke="#a99a82" strokeWidth="7"/><path d="M1-6h35m-13 0v12m12-12v9" stroke="#a99a82" strokeWidth="7" fill="none" strokeLinecap="round"/><text x="0" y="32" textAnchor="middle" fontSize="14" fontWeight="750" fill="#fff0be">{page===0?['w','k','forge'][index]:['fit','read'][index]}</text></g>
    </g>)}
    {page===1&&<g className={areaClass(Boolean(restored.at(-1)),celebrating===restored.length-1)} transform="translate(790 128)"><ellipse cy="118" rx="105" ry="20" fill="#1d121944"/><path d="M-92 110V-3Q0-112 92-3V110Z" fill="#6c4655" stroke="#d2a54d" strokeWidth="10"/><path className="keeper-map-final-door" d="M-63 108V4Q0-73 63 4V108Z" fill="#3a2731" stroke="#916073" strokeWidth="6"/><g className="keeper-map-final-key"><circle cx="-17" cy="22" r="20" fill="none" stroke="#9b8875" strokeWidth="9"/><path d="M3 22h48m-17 0v17m15-17v12" stroke="#9b8875" strokeWidth="9" fill="none" strokeLinecap="round"/></g></g>}
  </svg>;
  if(chapter===7)return <svg className="chronicle-trail-art library-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`library-wall-${page}`} x2="0" y2="1"><stop stopColor="#326c78"/><stop offset="1" stopColor="#183e48"/></linearGradient><radialGradient id={`library-glow-${page}`}><stop stopColor="#fff1a6" stopOpacity=".88"/><stop offset="1" stopColor="#83e4db" stopOpacity="0"/></radialGradient></defs>
    <rect width="900" height="360" fill={`url(#library-wall-${page})`}/>
    <path d="M0 303Q160 282 320 303T640 295T900 307V360H0Z" fill="#23363a"/>
    <path d="M0 334H900" stroke="#8c6a4e" strokeWidth="34"/><path d="M0 324H900" stroke="#d1ad72" strokeWidth="5"/>
    {[18,195,372,549,726].map(x=><g key={x} opacity=".48"><rect x={x} y="35" width="150" height="245" rx="5" fill="#274f58" stroke="#c3a16f" strokeWidth="9"/><path d={`M${x+10} 102h130M${x+10} 176h130M${x+10} 250h130`} stroke="#c3a16f" strokeWidth="8"/><g stroke="#82999a" strokeWidth="11">{[28,49,72,98,119].map(dx=><path key={dx} d={`M${x+dx} 46v46`}/>)}</g></g>)}
    {points.map((point,index)=><ellipse key={`library-restore-${index}`} className={`trail-restoration-patch library-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="150" ry="112" fill={`url(#library-glow-${page})`}/>) }
    {points.map((point,index)=><g key={`library-shelf-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(268,point.y+58)})`}>
      <ellipse cy="60" rx="69" ry="12" fill="#10272d55"/>
      <rect className="library-map-shelf" x="-61" y="-43" width="122" height="94" rx="4" fill="#5f5047" stroke="#98806a" strokeWidth="7"/>
      <path d="M-53 8H53" stroke="#c7a66f" strokeWidth="7"/>
      {[-43,-20,5,30].map((x,book)=><rect className={`library-map-book book-${book}`} key={x} x={x} y={book%2?-31:-37} width="18" height={book%2?36:42} rx="2" fill="#718487"/>)}
      <g className="library-map-label"><path d="M-28 19h56v28h-56Z" fill="#e5d9ba"/><text x="0" y="38" textAnchor="middle" fontSize="14" fontWeight="750" fill="#255763">{page===0?['v','y','x'][index]:page===1?['j','z','words'][index]:['mend','read'][index]}</text></g>
    </g>)}
    {page===2&&<g className={areaClass(Boolean(restored.at(-1)),celebrating===restored.length-1)} transform="translate(785 150)"><ellipse cy="101" rx="112" ry="18" fill="#10272d55"/><path className="library-map-desk" d="M-95 35H95L78 98H-78Z" fill="#6f523c" stroke="#bd9661" strokeWidth="8"/><path d="M-64 96v38m128-38v38" stroke="#5b4233" strokeWidth="12"/><path className="library-map-open-book" d="M0 31Q-41 7-77 21v45Q-39 54 0 76 39 54 77 66V21Q41 7 0 31Z" fill="#9ba7a4" stroke="#d7c99f" strokeWidth="5"/><path d="M0 31v45" stroke="#b5a680" strokeWidth="3"/><path className="library-map-quill" d="M44 34Q58-21 96-30 85 18 44 34Zm0 0 49-60" fill="#738d91" stroke="#738d91" strokeWidth="5"/></g>}
  </svg>;
  if(chapter===8)return <svg className="chronicle-trail-art tower-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`tower-sky-${page}`} x2="0" y2="1"><stop stopColor="#34275f"/><stop offset="1" stopColor="#7463a1"/></linearGradient><radialGradient id={`tower-glow-${page}`}><stop stopColor="#ffe789" stopOpacity=".92"/><stop offset="1" stopColor="#b998ff" stopOpacity="0"/></radialGradient></defs>
    <rect width="900" height="360" fill={`url(#tower-sky-${page})`}/>
    <path d="M0 302Q150 260 300 307T590 292T900 308V360H0Z" fill="#28223f"/>
    <path d="M0 328Q170 299 335 330T660 319T900 331" fill="none" stroke="#655783" strokeWidth="25" opacity=".7"/>
    <g fill="#fff2a9">{[[62,40],[150,83],[260,35],[390,74],[515,42],[650,88],[770,34],[852,69]].map(([x,y],index)=><path key={x} opacity={index%2?.45:.8} d={`m${x} ${y}-2 5-5 2 5 2 2 5 2-5 5-2-5-2Z`}/>)}</g>
    {points.map((point,index)=><ellipse key={`tower-restore-${index}`} className={`trail-restoration-patch tower-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="150" ry="112" fill={`url(#tower-glow-${page})`}/>) }
    {points.map((point,index)=><g key={`tower-floor-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(270,point.y+62)})`}>
      <ellipse cy="60" rx="68" ry="13" fill="#17122b77"/>
      <path className="tower-map-floor" d="M-50 48V-18L0-63 50-18V48Z" fill="#52486c" stroke="#9d8cbc" strokeWidth="7"/>
      <path className="tower-map-window" d="M-23 32V-10Q0-39 23-10V32Z" fill="#2c263d" stroke="#82769a" strokeWidth="5"/>
      <path d="M-37 47H37" stroke="#d2bc6d" strokeWidth="7"/>
      <text x="0" y="16" textAnchor="middle" fontSize="14" fontWeight="800" fill="#6e6679">{page===0?['long a','long e','long i'][index]:page===1?['long o','long u','compare'][index]:['words','read'][index]}</text>
    </g>)}
    {page===2&&<g className={areaClass(Boolean(restored.at(-1)),celebrating===restored.length-1)} transform="translate(787 145)"><ellipse cy="111" rx="108" ry="19" fill="#17122b66"/><path d="M-82 103V8H82V103Z" fill="#55496f" stroke="#ad96cf" strokeWidth="8"/><path className="tower-observatory-dome" d="M-72 8Q0-86 72 8Z" fill="#766596" stroke="#c6b1e2" strokeWidth="7"/><path d="M-15-25 57-67" stroke="#8f83ab" strokeWidth="20"/><path d="M50-74h44v18H50Z" fill="#bbb0cd"/><circle className="tower-observatory-star" cy="-42" r="8" fill="#8b809e"/><rect x="-17" y="52" width="34" height="51" fill="#302940"/></g>}
  </svg>;
  if(chapter===9)return <svg className="chronicle-trail-art crown-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="crown-wall" x2="0" y2="1"><stop stopColor="#692f4c"/><stop offset="1" stopColor="#351f36"/></linearGradient><radialGradient id="crown-glow"><stop stopColor="#ffe99b" stopOpacity=".95"/><stop offset="1" stopColor="#ef8cac" stopOpacity="0"/></radialGradient></defs>
    <rect width="900" height="360" fill="url(#crown-wall)"/>
    <path d="M0 297H900V360H0Z" fill="#39252c"/><path d="M0 307H900" stroke="#c08b40" strokeWidth="7"/>
    {[12,190,368,546,724].map((x,index)=><g key={x} opacity=".48"><rect x={x} y="24" width="150" height="248" rx="75" fill={index%2?'#704868':'#60415f'} stroke="#bd8a44" strokeWidth="9"/><path d={`M${x+75} 34v228M${x+9} 147h132`} stroke="#e9bd63" strokeWidth="4"/><path d={`M${x+18} 50  ${x+132} 247M${x+132} 50 ${x+18} 247`} stroke="#d46e8d" strokeWidth="9" opacity=".7"/></g>)}
    {points.map((point,index)=><ellipse key={`crown-restore-${index}`} className={`trail-restoration-patch crown-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="158" ry="118" fill="url(#crown-glow)"/>)}
    <g className={areaClass(Boolean(restored[0]),celebrating===0)} transform={`translate(${points[0]?.x??155} ${Math.min(270,(points[0]?.y??155)+62)})`}><ellipse cy="57" rx="70" ry="13" fill="#1e132055"/><path className="crown-map-chest" d="M-58-7Q0-59 58-7V47H-58Z" fill="#6d513c" stroke="#af8e57" strokeWidth="7"/><path d="M-53 3H53M0-34V45" stroke="#caa25b" strokeWidth="6"/><circle cx="0" cy="11" r="11" fill="#88745d"/></g>
    <g className={areaClass(Boolean(restored[1]),celebrating===1)} transform={`translate(${points[1]?.x??450} ${Math.min(270,(points[1]?.y??155)+62)})`}><ellipse cy="60" rx="76" ry="13" fill="#1e132055"/><path className="crown-map-crown" d="M-63 26-72-39l39 27L0-58l33 46 39-27-9 65Z" fill="#9a825b" stroke="#d8ba73" strokeWidth="6"/><rect x="-63" y="23" width="126" height="25" rx="5" fill="#8a704f"/>{[-35,0,35].map(x=><path key={x} d={`m${x} 4 9 9-9 10-9-10Z`} fill="#836a6c"/>)}</g>
    <g className={areaClass(Boolean(restored[2]),celebrating===2)} transform={`translate(${points[2]?.x??745} ${Math.min(266,(points[2]?.y??155)+58)})`}><ellipse cy="65" rx="92" ry="15" fill="#1e132055"/><path className="crown-map-throne" d="M-55 52V-34Q0-83 55-34V52Z" fill="#6f5260" stroke="#c49a4c" strokeWidth="8"/><path d="M-39 48V-18Q0-49 39-18V48Z" fill="#4c3547"/><path d="M-75 42h24v33h-24Zm126 0h24v33H51Z" fill="#9d733d"/><path className="crown-throne-star" d="m0-21 7 15 16 6-16 7-7 16-7-16-16-7 16-6Z" fill="#88735d"/></g>
  </svg>;
  if(chapter===3)return <svg className="chronicle-trail-art garden-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`garden-sky-${page}`} x2="0" y2="1"><stop stopColor="#ccebed"/><stop offset="1" stopColor="#edf3cf"/></linearGradient></defs>
    <rect width="900" height="360" fill={`url(#garden-sky-${page})`}/>
    <path d="M0 118Q145 64 288 125T585 104T900 122V0H0Z" fill="#a8d5b0" opacity=".68"/>
    <path d="M0 278Q135 226 292 281T590 271T900 282V360H0Z" fill="#b8d99e"/>
    <path d="M0 326Q170 279 342 326T680 313T900 327V360H0Z" fill="#8ebe7f"/>
    {points.map((point,index)=><ellipse key={`garden-restore-${index}`} className={`trail-restoration-patch garden-restoration ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="150" ry="112" fill={index%2?'#f7d78c':'#a5e39b'}/>) }
    {points.map((point,index)=><g key={`garden-bed-${index}`} className={areaClass(Boolean(restored[index]),celebrating===index)} transform={`translate(${point.x} ${Math.min(292,point.y+73)})`}>
      <ellipse cy="29" rx="74" ry="22" fill="#765b42" opacity=".72"/>
      <path d="M-67 23Q0-2 67 23" stroke="#aa8a61" strokeWidth="24" fill="none" strokeLinecap="round"/>
      {[-43,0,43].map((x,plant)=><g key={x} className="garden-map-plant" transform={`translate(${x} ${17-(plant%2)*7})`}>
        <path d="M0 12V-13M0-2q-12-10-15 1M0-7q11-11 15-2" stroke="#477f4d" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <g className="garden-map-bloom" transform="translate(0 -18)" fill={(index+plant)%2?'#ef79a3':'#f4c755'}><circle cx="-6" r="6"/><circle cx="6" r="6"/><circle cy="-6" r="6"/><circle cy="6" r="6"/><circle r="4" fill="#fff5c7"/></g>
      </g>)}
      <rect className="garden-map-sign" x="-32" y="37" width="64" height="25" rx="4" fill="#d5c6a7"/>
      <text className="garden-map-word" x="0" y="55" textAnchor="middle" fontSize="14" fontWeight="700" fill="#315c42">{page===0?['o','b','h'][index]:['blend','words','read'][index]}</text>
    </g>)}
    {page===1&&<g className={areaClass(Boolean(restored[2]),celebrating===2)} transform="translate(790 175)"><path d="M-70 81V2H-42V81M42 81V2H70V81" fill="#8aa58d"/><path d="M-47 81V11Q0-57 47 11V81" fill="#edf1c7" stroke="#75956f" strokeWidth="8"/><path className="garden-map-gate" d="M-31 80V15Q0-28 31 15V80Z" fill="#8b9275"/><path d="M-21 78V13M0 78V-3M21 78V13" stroke="#ddbd68" strokeWidth="5"/></g>}
    {[75,330,570,845].map((x,index)=><g key={x} transform={`translate(${x} ${318-(index%2)*18})`}><path d="M0 18V-4" stroke="#527a4c" strokeWidth="6"/><circle cy="-12" r="20" fill="#5fa86a"/></g>)}
  </svg>;
  return <svg className="chronicle-trail-art" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
    <rect width="900" height="360" fill={gardens?'#c9f3b5':theme.light}/>
    <path d="M0 40Q140 5 230 65T470 30T720 52T900 12V0H0Z" fill={gardens?'#8edc9c':theme.color} opacity={gardens?1:.22}/>
    <path d="M0 310Q110 260 220 320T460 315T690 300T900 330V360H0Z" fill="#a7e892"/>
    <path d="M20 360Q65 295 29 242T57 122T25 0" stroke="#38bdf8" strokeWidth="39" fill="none"/>
    <path className="trail-water" d="M20 360Q65 295 29 242T57 122T25 0" stroke="#ecfeff" strokeWidth="3" strokeDasharray="12 28" fill="none"/>
    {[[90,25],[240,15],[365,30],[565,12],[710,22],[862,38],[93,325],[285,340],[520,330],[760,330],[870,270]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>
      <ellipse cy="11" rx="32" ry="19" fill="#507b6430"/>
      <path d="M0 18V-15" stroke="#8d7050" strokeWidth="9"/>
      <path d="M0-47C-30-47-38-19-22-7-44 15-8 33 0 17 23 36 43 7 23-8 40-27 22-49 0-47" fill={i%2?'#34c98a':'#4ade80'} stroke="#dcfce7" strokeWidth="2"/>
      <path d="M-17-17Q-19-29-5-32" stroke="#bbf7d0" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </g>)}
    <ellipse cx="190" cy="195" rx="116" ry="100" fill="#e5fac5"/>
    <ellipse cx="450" cy="170" rx="120" ry="105" fill="#e9fbd2"/>
    <ellipse cx="755" cy="100" rx="115" ry="90" fill="#dcf8c1"/>
    {points.map((point,index)=><ellipse key={`restore-${index}`} className={`trail-restoration-patch ${restored[index]?'is-restored':''} ${celebrating===index?'is-celebrating':''}`} cx={point.x} cy={point.y} rx="155" ry="118" fill={index===0?'#baf09b':index===1?'#a7ebaa':'#d2f39d'}/>)}
    {chapter!==0?<>
      <g className={areaClass(restored[0],celebrating===0)}><svg x="110" y="15" width="105" height="88" viewBox="0 0 220 190"><LandmarkArt kind={theme.emblem}/></svg></g>
      <g className={areaClass(restored[1],celebrating===1)}><svg x="385" y="10" width="110" height="88" viewBox="0 0 220 190"><LandmarkArt kind={page===0?theme.emblem:'library'}/></svg></g>
      <g className={areaClass(restored[2],celebrating===2)}><svg x="765" y="162" width="115" height="110" viewBox="0 0 220 190"><LandmarkArt kind={theme.emblem}/></svg></g>
      {chapter===1&&<path d="M100 40Q450 0 850 45" stroke="#ac467d" strokeWidth="2" fill="none"/>}
      {[2,5,6,7,8,9].includes(chapter)&&<g fill="#ffffff" opacity=".35">{[120,330,540,750].map(x=><path key={x} d={`M${x} 300l36-18 36 18-36 18Z`}/>)}</g>}
    </>:orchard?<>
      <g className={areaClass(restored[0],celebrating===0)}>{[110,165,220].map((x,i)=><g key={x} transform={`translate(${x} ${97-i%2*22})`}>
        <path d="M0 27V0" stroke="#a17b4b" strokeWidth="8"/>
        <ellipse rx="29" ry="27" fill="#729e57" stroke="#f4edb9" strokeWidth="2"/>
        <g className="orchard-fruit" fill="#ffcd63"><ellipse cx="-12" cy="2" rx="6" ry="9" transform="rotate(20)"/><ellipse cx="10" cy="-9" rx="6" ry="9"/><ellipse cx="13" cy="12" rx="6" ry="9"/></g>
      </g>)}</g>
      <g className={areaClass(restored[1],celebrating===1)}>{[386,442,498].map((x,i)=><g key={x} transform={`translate(${x} ${67-i%2*16})`}><path d="M0 25V0" stroke="#a17b4b" strokeWidth="7"/><circle r="26" fill="#90b86c" stroke="#f4edb9" strokeWidth="2"/><g className="orchard-fruit" fill="#e97a73"><circle cx="-12" cy="0" r="6"/><circle cx="11" cy="-10" r="6"/><circle cx="8" cy="12" r="6"/></g></g>)}</g>
      <g className={areaClass(restored[2],celebrating===2)} transform="translate(785 160)"><ellipse cy="54" rx="62" ry="12" fill="#69805b30"/><path d="M-47 7H47V50H-47Z" fill="#f5e4bd" stroke="#a98461" strokeWidth="3"/><path d="M-59 8-35-26H36L59 8Z" fill="#82a5ae" stroke="#537b8a" strokeWidth="3"/><path d="M-24-23-35 6M0-23V6M25-23 35 6" stroke="#cad9cf" strokeWidth="3"/><path d="M-13 50V24H10V50" fill="#827b67"/><rect className="workshop-light" x="22" y="22" width="15" height="16" fill="#a8d4cc"/><g fill="#b5c8c7" stroke="#688e94" strokeWidth="2"><path d="M-65 25H-48V49H-65Z"/><ellipse cx="-56.5" cy="25" rx="8.5" ry="3"/></g></g>
    </>:<>
      <g className={areaClass(restored[0],celebrating===0)} transform="translate(190 95)"><ellipse rx="75" ry="35" fill="#b6cf8f" stroke="#f5edbe" strokeWidth="6"/>{[-45,0,45].map((x,i)=><g key={x} transform={`translate(${x} 0)`}><rect x="-17" y="-18" width="34" height="36" rx="6" fill="#fff6ce" stroke="#ba9b66" strokeWidth="2"/><text textAnchor="middle" y="9" fontSize="25" fill="#507a69">{['m','a','t'][i]}</text></g>)}</g>
      <g className={areaClass(restored[1],celebrating===1)} transform="translate(465 66)">{[-50,-15,20,55].map((x,i)=><g className="story-flower" key={x} transform={`translate(${x} ${i%2*13})`}><path d="M0 25V0" stroke="#72976b" strokeWidth="4"/><path d="M-13 0Q-25-19 0-13 22-22 14 0 22 20 0 13-22 22-13 0" fill={i%2?'#dba2bd':'#f6d178'}/><circle r="6" fill="#fff7d7"/></g>)}</g>
      <g className={areaClass(restored[2],celebrating===2)} transform="translate(770 195)"><ellipse cy="35" rx="76" ry="17" fill="#69805b30"/><path d="M-72 34V-26H-39V34M40 34V-26H73V34" fill="#b5c5ad" stroke="#7f998b" strokeWidth="3"/><path d="M-42 34V-12Q0-75 42-12V34" fill="#f8edc4" stroke="#9aaf8e" strokeWidth="9"/><path className="restored-gate" d="M-28 34V-8Q0-48 28-8V34Z" fill="#768e79"/><path d="M-20 31V-7M0 32V-20M20 31V-7" stroke="#e7c47c" strokeWidth="5"/><path d="M-76-29H-36M37-29H78" stroke="#e3e8c7" strokeWidth="8"/></g>
    </>}
    {[[310,285],[620,285],[340,40],[670,45],[130,300]].map(([x,y],i)=><g key={x} transform={`translate(${x} ${y})`}>
      <path d="M0 16V0M0 10Q-12 0-13 8M0 12Q13 0 14 8" stroke="#16a34a" strokeWidth="3" fill="none"/>
      <g fill={i%2?'#f472b6':'#a78bfa'}><circle cx="-6" r="6"/><circle cx="6" r="6"/><circle cy="-6" r="6"/><circle cy="6" r="6"/></g><circle r="4" fill="#fef08a"/>
    </g>)}
  </svg>;
}
