export const READING_STOPS: Record<string, string[]> = Object.fromEntries(Object.entries({
  gate: ['mango','apple','top'], lanterns: ['sun','egg','log','insect'], market: ['pen','fan','net'],
  garden: ['octopus','bag','hat'], bridge: ['umbrella','goat','dog'], hall: ['rug','cup'], keys: ['web','kite'],
  library: ['van','yam','box','jet','zip'], tower: ['cape','tree','kite','hope','cube'], crown: [],
}).map(([chapter, sounds]) => [chapter, [...sounds, 'blend', 'games', 'check']]));

export function validReadingStop(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const [chapter, stop, extra] = value.split(':');
  return !extra && value === `${chapter}:${stop}` && Object.prototype.hasOwnProperty.call(READING_STOPS, chapter) && READING_STOPS[chapter].includes(stop);
}
