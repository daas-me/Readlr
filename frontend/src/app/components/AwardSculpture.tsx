import { useId } from 'react';
import { RewardStickerArt, type RewardStickerDesign } from './RewardStickerArt';
import { IllustrationSurface } from './IllustrationSurface';

/** Enamel illustrations set into metal trophies, not paper stickers. */
export function AwardSculpture({design,variant=0}:{design:RewardStickerDesign;variant?:number}) {
  const id=`award-${useId().replace(/:/g,'')}`;
  const ribbon=['#7c3aed','#f59a00','#ec4899','#0ea5c9'][variant%4];
  return <svg className="award-sculpture" viewBox="0 0 200 210" aria-hidden="true">
    <defs><linearGradient id={`${id}-metal`} x1="0" x2="1"><stop stopColor="#dc9019"/><stop offset=".3" stopColor="#ffe8a1"/><stop offset=".55" stopColor="#ffcf4a"/><stop offset="1" stopColor="#e69b1d"/></linearGradient><IllustrationSurface id={id}/></defs>
    <g filter={`url(#${id})`} strokeLinejoin="round">
      {variant%3===0?<path d="M46 51H23q-3 56 40 56m91-56h23q3 56-40 56" fill="none" stroke="#eaa629" strokeWidth="10"/>:variant%3===1?<path d="m56 119-8 48 25-10 15 18 10-48m4 0 10 48 15-18 25 10-8-48" fill={ribbon}/>:<path d="M47 94q-32-24-14-57 29 18 24 48m96 9q32-24 14-57-29 18-24 48" fill="#eab83e"/>}
      <path d={variant%3===2?'M100 19 159 50v42q0 44-59 62-59-18-59-62V50Z':'M46 31h108v62q0 48-54 56-54-8-54-56Z'} fill={`url(#${id}-metal)`} stroke="#c6821a" strokeWidth="3"/>
      <path d="M57 43h86v49q0 34-43 43-43-9-43-43Z" fill="#fff8e5"/>
      <svg x="58" y="38" width="84" height="95" style={{width:84,height:95}} viewBox="0 0 192 176"><RewardStickerArt design={design} finish="object"/></svg>
      <path d="M89 148h22v22H89Z" fill={`url(#${id}-metal)`}/><path d="M67 168h66l9 14H58Z" fill={ribbon}/>
      <rect x="49" y="181" width="102" height="20" rx="5" fill="#51318a"/>
      <rect x="77" y="185" width="46" height="11" rx="3" fill="#ffdb70"/>
      <path d="M52 47v42" stroke="#fff5cd" strokeWidth="4" strokeLinecap="round"/>
    </g>
  </svg>;
}
