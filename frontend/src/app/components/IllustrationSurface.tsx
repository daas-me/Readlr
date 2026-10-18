/** A small cast shadow and top-edge highlight, without a sticker outline. */
export function IllustrationSurface({id}:{id:string}) {
  return <filter id={id} x="-15%" y="-15%" width="130%" height="140%" colorInterpolationFilters="sRGB">
    <feOffset in="SourceAlpha" dy="2" result="lower"/>
    <feComposite in="SourceAlpha" in2="lower" operator="out" result="rim"/>
    <feFlood floodColor="#ffffff" floodOpacity=".4"/>
    <feComposite in2="rim" operator="in" result="shine"/>
    <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shine"/></feMerge>
    <feDropShadow dx="0" dy="3" stdDeviation="1.2" floodColor="#38204f" floodOpacity=".18"/>
  </filter>;
}
