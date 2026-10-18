import { useId } from 'react';
import { ReadingWorldBackdrop } from './ReadingWorldBackdrop';
import { RewardStickerArt, type RewardStickerDesign } from './RewardStickerArt';
import { IllustrationSurface } from './IllustrationSurface';

export function LandmarkArt({kind}:{kind:string}) {
  const id=`landmark-${useId().replace(/:/g,'')}`;
  const designs:Partial<Record<string,RewardStickerDesign>>={gate:'gate',bridge:'bridge',lantern:'lantern',market:'market',key:'keyring',magic:'wand',crown:'crown',library:'books',tower:'tower'};
  const design=designs[kind];
  return <svg viewBox="0 0 220 190" aria-hidden="true" className={`landmark-art illustrated-landmark ${kind==='dojo'?'dojo-landmark':''}`}>
    <ellipse cx="110" cy="179" rx="72" ry="8" fill="#51318a" opacity=".12"/>
    {design?<svg x="10" y="0" width="200" height="180" viewBox="0 0 192 176"><RewardStickerArt design={design} finish="object"/></svg>:<><defs><IllustrationSurface id={id}/></defs><g filter={`url(#${id})`}><OriginalLandmarkArt kind={kind}/></g></>}
  </svg>;
}

function OriginalLandmarkArt({kind}:{kind:string}) {
  if(kind==='dojo')return <svg viewBox="0 0 220 190" aria-hidden="true" className="landmark-art dojo-landmark"><ellipse cx="110" cy="175" rx="100" ry="11" fill="#559572" opacity=".2"/><path d="M35 160V82h150v78" fill="#fff9e6" stroke="#8050bc" strokeWidth="5"/><path d="M18 86q30-5 32-26h120q2 21 32 26Z" fill="#8b5cf6" stroke="#fff4d7" strokeWidth="4"/><path d="M44 59q28-7 31-24h70q3 17 31 24Z" fill="#c4a4ff" stroke="#fff4d7" strokeWidth="4"/><path d="M60 160V99m100 61V99" stroke="#7c3aed" strokeWidth="7"/><path d="M81 162V119q29-35 58 0v43" fill="#73b5a0"/><path d="M21 162h178v12H21Z" fill="#a779f2"/><g className="dojo-lantern"><path d="M41 87v13" stroke="#ab8a49" strokeWidth="3"/><rect x="30" y="99" width="23" height="28" rx="8" fill="#ffd966" stroke="#fff4bd" strokeWidth="3"/></g><g className="dojo-lantern"><path d="M179 87v13" stroke="#ab8a49" strokeWidth="3"/><rect x="168" y="99" width="23" height="28" rx="8" fill="#ffd966" stroke="#fff4bd" strokeWidth="3"/></g><path d="m110 48 18 9v17q-1 14-18 22-17-8-18-22V57Z" fill="#ffe596" stroke="#fff" strokeWidth="3"/><text x="110" y="79" textAnchor="middle" fontSize="25" fill="#986825">a</text></svg>;
  return <svg viewBox="0 0 220 190" aria-hidden="true" className="landmark-art">
    <ellipse cx="110" cy="171" rx="88" ry="12" fill="#296859" opacity=".13"/>
    {kind==='camp'?<><path d="M23 151 101 40l95 111Z" fill="#ffbc36" stroke="#fff8da" strokeWidth="5"/><path d="m101 40 16 111H23Z" fill="#ff9d16"/><path d="m101 77 40 74H69Z" fill="#44685c"/><path d="M101 40V16m0 0 42 12-42 12" fill="#fa658e" stroke="#9363b9" strokeWidth="4"/><path d="m160 155 19-13 18 13m-31-8 29 16" stroke="#b17b50" strokeWidth="8" strokeLinecap="round"/><path d="M179 149q-24-17 0-40-3 17 12 23 7 15-12 17" fill="#ffcf48"/><path d="M39 50V31m-13 12h26" stroke="#fff4ad" strokeWidth="4"/><path d="M21 164V91m-18 35 18-35 18 35m-37 18 19-35 20 35" stroke="#4d9b69" strokeWidth="9" fill="#86cb89"/></>:
    kind==='progress'?<><path d="M77 157h68M94 157v-36m31 0v36" stroke="#b58944" strokeWidth="10"/><path d="M65 41h89l-8 54q-8 32-37 32T72 95Z" fill="#fbc956" stroke="#fff1b0" strokeWidth="5"/><path d="M68 55H43q0 56 35 44m75-44h24q0 56-35 44" fill="none" stroke="#e9a539" strokeWidth="9"/><path d="m109 57 9 18 20 3-15 14 4 20-18-10-18 10 4-20-15-14 20-3Z" fill="#fff4bf"/></>:
    kind==='stickers'?<><g transform="rotate(-9 110 100)"><rect x="43" y="27" width="137" height="135" rx="9" fill="#fa658e" stroke="#fff5df" strokeWidth="5"/><path d="M60 29v132" stroke="#b25380" strokeWidth="5"/><rect x="78" y="46" width="76" height="91" rx="6" fill="#fff9e2"/><path d="m116 61 10 21 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3Z" fill="#f5bf44"/><circle cx="109" cy="94" r="3" fill="#81506c"/><circle cx="124" cy="94" r="3" fill="#81506c"/><path d="M110 105q7 7 14 0" fill="none" stroke="#81506c" strokeWidth="3"/></g></>:
    kind==='sound'?<><path d="M39 164V71h143v93" fill="#fff5d7" stroke="#5c9c8e" strokeWidth="5"/><path d="m25 74 85-48 85 48Z" fill="#5dbfb1" stroke="#fff" strokeWidth="4"/><path d="M91 164v-48q19-31 38 0v48" fill="#f1b643"/><path d="M54 96h23v36H54m93-36h23v36h-23" fill="#b8def0"/><path d="M106 25v-8l22-5v19m-22-14 22-5" stroke="#af6899" strokeWidth="4"/><ellipse cx="100" cy="26" rx="7" ry="5" fill="#af6899"/><ellipse cx="122" cy="32" rx="7" ry="5" fill="#af6899"/></>:
    kind==='bridge'?<><path d="M5 150q80-29 210 0v22H5Z" fill="#63c9e9"/><path d="M16 136Q111 35 204 136" fill="none" stroke="#c99560" strokeWidth="28"/><path d="M16 125Q111 24 204 125" fill="none" stroke="#ffe4ab" strokeWidth="10"/><path d="M25 131V95m43 3V67m43 16V50m43 48V67m43 64V95" stroke="#ae77bc" strokeWidth="7"/></>:
    kind==='garden'?<><path d="M33 162q7-77 77-88 69 11 77 88" fill="#a8d795"/><path d="M67 139V77m84 64V65m-42 79V43" stroke="#389875" strokeWidth="6"/>{[[67,73,'#fa658e'],[151,61,'#f9c651'],[109,39,'#a779f2']].map(([x,y,c])=><g key={x} transform={`translate(${x} ${y})`}><path d="M0-22C24-30 26-3 12 2 36 18 7 34 0 16-15 41-35 9-15 2-36-14-12-34 0-22" fill={String(c)}/><circle r="10" fill="#fff4b8"/></g>)}</>:
    kind==='lantern'?<><path d="M110 27V13m-22 14h44" stroke="#876394" strokeWidth="6"/><path d="m68 55 21-28h42l21 28-10 79H78Z" fill="#ffc85c" stroke="#7045ac" strokeWidth="6"/><path d="M68 55h84m-65 2 7 75m39-75-7 75" stroke="#fff2b8" strokeWidth="5"/><path d="M77 139h67" stroke="#7045ac" strokeWidth="9"/><path d="m111 69 8 18 19 3-14 14 4 19-17-10-18 10 4-19-14-14 20-3Z" fill="#fff6c9"/></>:
    kind==='key'?<><g transform="rotate(30 110 90)"><circle cx="110" cy="57" r="33" fill="#fac65c" stroke="#fff2bb" strokeWidth="5"/><circle cx="110" cy="57" r="14" fill="#b4e9de"/><path d="M110 89v68h25v-14h-25m0-20h20" stroke="#e8a63c" strokeWidth="15" fill="none"/></g></>:
    kind==='magic'?<><path d="m60 155 86-105" stroke="#8961b3" strokeWidth="15" strokeLinecap="round"/><path d="m151 23 10 22 24 4-18 16 5 25-22-13-22 13 5-25-18-16 24-4Z" fill="#ffcf57" stroke="#fff6d8" strokeWidth="3"/><path d="M48 57v27m-13-13h27m117 47v24m-12-12h24" stroke="#e5a9d1" strokeWidth="5"/></>:
    kind==='crown'?<><path d="m40 135-15-79 49 29 36-54 36 54 49-29-15 79Z" fill="#f6bf43" stroke="#fff0af" strokeWidth="5"/><rect x="40" y="132" width="140" height="25" rx="7" fill="#ffdf7a"/><path d="m74 99 10 13-10 13-10-13Zm36-14 12 16-12 16-12-16Zm36 14 10 13-10 13-10-13Z" fill="#d97cac"/></>:
    kind==='library'?<><path d="M24 51q44-20 86 3 42-23 86-3v103q-44-20-86 3-42-23-86-3Z" fill="#fff8df" stroke="#77aab4" strokeWidth="5"/><path d="M110 54v103M40 79h49M40 98h49M40 117h32m46-38h49m-49 19h49m-49 19h32" stroke="#c8b8d8" strokeWidth="4"/><path d="M150 44v58l13-10 13 10V43" fill="#ed98b3"/></>:
    kind==='market'?<><path d="M41 151V76h138v75" fill="#fff3d5" stroke="#b88269" strokeWidth="5"/><path d="m32 79 19-37h118l19 37" fill="#e890ac"/><path d="M52 42 45 79m34-37-3 37m32-37v37m30-37 4 37m24-37 9 37" stroke="#fff6e8" strokeWidth="16"/><path d="M55 151v-44h110v44" fill="#8ccbb0"/><path d="M47 109h126" stroke="#bd8b6c" strokeWidth="7"/><circle cx="80" cy="96" r="12" fill="#f0c34f"/><circle cx="106" cy="96" r="12" fill="#e994aa"/><circle cx="132" cy="96" r="12" fill="#bbabdf"/></>:
    <><path d="M37 161V66h42V41h62v25h42v95Z" fill="#f5f0ff" stroke="#ac90db" strokeWidth="5"/><path d="m26 66 32-43 32 43m40 0 32-43 32 43m-122-25 38-32 38 32" fill="#b99bdf" stroke="#fff5e3" strokeWidth="3"/><path d="M90 161v-48q20-30 40 0v48" fill="#f5c04d"/><path d="M48 93h18v25H48m106-25h18v25h-18" fill="#92d8e9"/><path d="M110 12V0l29 5-29 8" fill="#ef9cbb"/></>}
  </svg>;
}

export function AdventureBackdrop({theme='home'}:{theme?:string}) {
  return <ReadingWorldBackdrop theme={theme}/>;
}

export function LegacyAdventureBackdrop({theme='home'}:{theme?:string}) {
  const id=useId().replace(/:/g,'');
  const evening=['lantern','magic','library','tower'].includes(theme);
  return <svg className={`adventure-backdrop theme-${theme}`} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id={id} x2="0" y2="1"><stop stopColor={evening?'#e9dff8':'#c7eef5'}/><stop offset="1" stopColor="#f1fbdf"/></linearGradient></defs>
    <rect width="1440" height="900" fill={`url(#${id})`}/>
    <g className="adventure-clouds" fill="#fff" opacity=".8"><path d="M30 128q0-30 45-30 18-55 66-22 45-23 56 15 60-1 50 37Z"/><path d="M1000 115q-12-35 40-38 27-50 65-16 52-17 60 23 70 7 50 31Z"/><path d="M510 75q-10-23 21-29 17-25 42-4 41-10 44 33Z"/></g>
    <circle cx="1260" cy="120" r="48" fill={evening?'#fff7cd':'#ffe894'}/>
    <path d="M0 355Q160 193 376 354 600 216 800 351 1100 172 1440 340V900H0Z" fill="#9dd3be"/>
    <path d="M0 470Q220 311 457 446 690 355 930 454 1160 293 1440 435V900H0Z" fill="#bde4ad"/>
    <path d="M1440 417Q1160 444 1246 582T1220 900H960Q1220 713 1126 601T1440 388" fill="#76cee1"/>
    <path d="M1440 427Q1182 449 1261 580" stroke="#d8f6ef" strokeWidth="6" fill="none"/>
    <path d="M0 700Q225 599 450 701T910 686 1440 740V900H0Z" fill="#96cfa1"/>
    {theme==='home'&&<><path d="M80 900Q650 680 565 552T920 333" stroke="#fff5d5" strokeWidth="68" fill="none"/><path d="M73 900Q650 680 565 552T920 333" stroke="#e9d8aa" strokeWidth="3" fill="none" strokeDasharray="4 20"/></>}
    <g className="river-shimmer" stroke="#e5ffff" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M1260 515h50m-100 160h48m-100 115h55"/></g>
    <g className="ambient-leaves" fill="#f5d780"><path d="M200 340q20-15 30 0-20 18-30 0"/><path d="M1120 530q20-15 30 0-20 18-30 0"/></g>
    {[[-30,410,1.2],[1300,430,1.1],[1160,240,.65],[70,220,.65],[250,320,.5],[1350,700,.8]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`}><path d="M55 155V74" stroke="#a47f57" strokeWidth="18"/><path d="M55 9Q-10 12 8 67-23 109 27 119q31 33 57 0 65 1 35-56Q116 4 55 9" fill={i%2?'#4caa82':'#6fba8b'}/><path d="M35 35q-18 2-18 25" fill="none" stroke="#a6d89c" strokeWidth="7" strokeLinecap="round"/></g>)}
    <g fill="#f8e7a4">{[120,350,950,1310,870,460].map((x,i)=><g key={x} transform={`translate(${x} ${770+i%3*36})`}><path d="M0 15V0" stroke="#479d78" strokeWidth="3"/><circle r="6"/><circle cx="7" cy="-4" r="5"/><circle cx="-6" cy="-4" r="5"/></g>)}</g>
    <g transform="translate(1000 502) rotate(-12)"><path d="M0 45Q88-4 176 45" fill="none" stroke="#b18160" strokeWidth="35"/><path d="M0 20Q88-29 176 20" fill="none" stroke="#f5dab5" strokeWidth="7"/><path d="M5 40V15m40 7V0m43 15V-9m43 31V0m40 40V15" stroke="#c99d77" strokeWidth="6"/></g>
  </svg>;
}
