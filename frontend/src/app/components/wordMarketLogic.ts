export const MARKET_WORDS=['pin','fin','tin','net','pen','map'] as const;
export type MarketWord=typeof MARKET_WORDS[number];

export function isMarketWord(word:string):word is MarketWord {
  return MARKET_WORDS.includes(word as MarketWord);
}

export function marketLetterFits(word:string,letter:string,slot:number) {
  return isMarketWord(word)&&slot>=0&&slot<word.length&&word[slot]===letter;
}

export function addStockedLabel(words:string[],word:string,status:string) {
  if(status!=='matched'||!isMarketWord(word)||words.includes(word))return words;
  return [...words,word];
}

const marketStepKey=(learnerId:number)=>`readlr_aral_market_builder_v1_${learnerId}`;

export function readMarketBuilderStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(marketStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=MARKET_WORDS.length?value:0;
  } catch { return 0; }
}

export function saveMarketBuilderStep(learnerId:number,step:number) {
  localStorage.setItem(marketStepKey(learnerId),String(Math.max(0,Math.min(MARKET_WORDS.length,Math.floor(step)))));
}

export function clearMarketBuilderStep(learnerId:number) {
  localStorage.removeItem(marketStepKey(learnerId));
}
