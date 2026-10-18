/** Decorative scenery never contains the answer to an activity. */
export function ActivityScene(){return <svg className="activity-scene" viewBox="0 0 1000 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <path d="M0 0H1000V480H0Z" fill="#a5edff"/>
  <g fill="#fff" opacity=".8"><path d="M100 80q-10-24 20-30 15-28 43-10 35-15 43 12 33 0 34 28Z"/><path d="M720 55q0-25 30-23 23-35 52-9 35-8 45 32Z"/></g>
  <path d="M0 250Q180 100 390 240T750 210T1000 240V480H0" fill="#6edb9b"/>
  <path d="M0 330Q250 190 500 300T1000 270V480H0" fill="#a3e76d"/>
  <ellipse cx="500" cy="460" rx="420" ry="130" fill="#d8f69c"/>
  {[[-30,120],[860,90]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M75 210V70" stroke="#ad8056" strokeWidth="22"/><path d="M75 0C0-6-22 63 18 99-13 160 62 185 78 150 145 186 192 127 149 93 182 26 121-5 75 0" fill={i?'#34b987':'#4ccb8b'}/><path d="M34 52Q36 22 69 20" stroke="#a7efb4" strokeWidth="9" fill="none" strokeLinecap="round"/></g>)}
  {[80,185,810,920].map((x,i)=><g key={x} transform={`translate(${x} ${418+i%2*22})`}><path d="M0 20V0" stroke="#339c68" strokeWidth="4"/><g fill={i%2?'#f49ac2':'#fbd56b'}><circle cx="-8" r="9"/><circle cx="8" r="9"/><circle cy="-8" r="9"/><circle cy="8" r="9"/></g><circle r="5" fill="#fff9dc"/></g>)}
</svg>}
