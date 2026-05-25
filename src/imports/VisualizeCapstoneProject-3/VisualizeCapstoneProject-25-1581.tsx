import svgPaths from "./svg-he295jtbmr";

function Text() {
  return (
    <div className="h-[28px] relative shrink-0 w-[10.771px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-0 not-italic text-[18px] text-white top-[-1px] whitespace-nowrap">R</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#4f46e5] relative rounded-[16px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12.615px] relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#1f2430] text-[18px] top-[-1px] whitespace-nowrap">Readlr</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] left-0 not-italic text-[#8a91a3] text-[10px] top-[-0.67px] tracking-[0.5px] uppercase whitespace-nowrap">Learn to Read</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] h-[40.5px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[40.5px] relative shrink-0 w-[124.479px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[36px] relative rounded-[16px] shrink-0 w-[86.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[55px] not-italic text-[#4b5266] text-[14px] text-center top-[7.67px] whitespace-nowrap">Home</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[36px] relative rounded-[16px] shrink-0 w-[102.615px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[63px] not-italic text-[#4b5266] text-[14px] text-center top-[7.67px] whitespace-nowrap">Progress</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[36px] relative rounded-[16px] shrink-0 w-[99.479px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[62px] not-italic text-[#4b5266] text-[14px] text-center top-[7.67px] whitespace-nowrap">Settings</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_24_642)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11f26280} id="Vector_2" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #4B5266)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_24_642">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[36px] relative rounded-[16px] shrink-0 w-[77.833px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[51.5px] not-italic text-[#4b5266] text-[14px] text-center top-[7.67px] whitespace-nowrap">Help</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[36px] relative shrink-0 w-[378.427px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button />
        <Button1 />
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[43.19px] not-italic text-[#1f2430] text-[14px] text-right top-[-0.33px] whitespace-nowrap">adwsf</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[12.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] left-[43px] not-italic text-[#8a91a3] text-[10px] text-right top-[-0.67px] tracking-[0.5px] uppercase whitespace-nowrap">Grade 1</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] h-[32.5px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white relative rounded-[22369600px] shrink-0 size-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(31,36,48,0.08)] border-solid inset-0 pointer-events-none rounded-[22369600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[0.667px] relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[28px] not-italic relative shrink-0 text-[#1f2430] text-[20px] whitespace-nowrap">🦊</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%_62.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 13.3333">
            <path d={svgPaths.pfe4e500} id="Vector" stroke="var(--stroke-0, #8A91A3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_12.5%_29.17%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-10%_-20%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 8">
            <path d={svgPaths.p1e2f6dbe} id="Vector" stroke="var(--stroke-0, #8A91A3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[37.5%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 1.33333">
            <path d="M8.66667 0.666667H0.666667" id="Vector" stroke="var(--stroke-0, #8A91A3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[40px] relative shrink-0 w-[139px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container5 />
        <Container6 />
        <Button4 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[64px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Container">
      <Container1 />
      <Navigation />
      <Container4 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[rgba(250,247,242,0.85)] content-stretch flex flex-col h-[64.667px] items-start left-0 pb-[0.667px] px-[43.667px] top-0 w-[1367.333px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[rgba(31,36,48,0.08)] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] h-[40px] relative rounded-[22369600px] shrink-0 w-[95.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon5 />
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[62.5px] not-italic text-[#9810fa] text-[16px] text-center top-[6.33px] whitespace-nowrap">Back</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] h-[48px] relative rounded-[22369600px] shrink-0 w-[188.802px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon6 />
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[52px] not-italic text-[#9810fa] text-[16px] top-[10.33px] whitespace-nowrap">Phoneme Bank</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-between left-[32px] top-[32px] w-[1288px]" data-name="Container">
      <Button5 />
      <Container10 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[644.99px] not-italic text-[48px] text-center text-white top-[-3px] whitespace-nowrap">Sound Library</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[644.59px] not-italic text-[20px] text-[rgba(255,255,255,0.9)] text-center top-[-1.33px] whitespace-nowrap">Practice any sound or word anytime!</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[32px] top-[112px] w-[1288px]" data-name="Container">
      <Heading1 />
      <Paragraph3 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-gradient-to-r drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] from-[#fdc700] h-[56px] relative rounded-[22369600px] shrink-0 text-white to-[#ff8904] w-[141.302px]" data-name="Button">
      <p className="-translate-x-1/2 absolute leading-[32px] left-[40.48px] text-[24px] top-[12px] w-[32.958px]">🔤</p>
      <p className="-translate-x-1/2 absolute leading-[24px] left-[91.46px] text-[16px] top-[14.33px] whitespace-nowrap">Vowels</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] h-[56px] relative rounded-[22369600px] shrink-0 text-[#364153] w-[139.052px]" data-name="Button">
      <p className="-translate-x-1/2 absolute leading-[32px] left-[40.48px] text-[24px] top-[12px] w-[32.958px]">🔗</p>
      <p className="-translate-x-1/2 absolute leading-[24px] left-[89.96px] text-[16px] top-[14.33px] whitespace-nowrap">Blends</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] h-[56px] relative rounded-[22369600px] shrink-0 text-[#364153] w-[172.375px]" data-name="Button">
      <p className="-translate-x-1/2 absolute leading-[32px] left-[40.48px] text-[24px] top-[12px] w-[32.958px]">📚</p>
      <p className="-translate-x-1/2 absolute leading-[24px] left-[106.96px] text-[16px] top-[14.33px] whitespace-nowrap">CVC Words</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[16px] h-[56px] items-start justify-center left-[164px] not-italic px-[269.635px] text-center top-[228px] w-[1024px]" data-name="Container">
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[97.333px] left-0 rounded-[16px] top-0 w-[320px]" style={{ backgroundImage: "linear-gradient(163.082deg, rgb(219, 234, 254) 0%, rgb(243, 232, 255) 100%)" }} data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[160.13px] not-italic text-[#9810fa] text-[48px] text-center top-[21px] whitespace-nowrap">A</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[20px] left-0 top-[113.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[159.65px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.33px] whitespace-nowrap">Valley of Vowels</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[28px] left-0 top-[137.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[159.78px] not-italic text-[#1e2939] text-[18px] text-center top-[-1px] whitespace-nowrap">Example: apple</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p19cded00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ed10d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1e708580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-gradient-to-r drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] from-[#2b7fff] h-[48px] left-[77.83px] rounded-[22369600px] to-[#00b8db] top-[177.33px] w-[164.323px]" data-name="Button">
      <Icon7 />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[96px] not-italic text-[16px] text-center text-white top-[10.33px] whitespace-nowrap">Hear Sound</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[225.333px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Paragraph4 />
      <Paragraph5 />
      <Button9 />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#eff6ff] h-[44px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[12.333px] pt-[11.667px] px-[12px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#1447e6] text-[0px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">Phonetic:</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` /a/`}</span>
        </p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[16px] h-[333.333px] items-start left-0 pt-[24px] px-[24px] rounded-[24px] top-0 w-[368px]" data-name="Container">
      <Container15 />
      <Container17 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[97.333px] left-0 rounded-[16px] top-0 w-[320px]" style={{ backgroundImage: "linear-gradient(163.082deg, rgb(219, 234, 254) 0%, rgb(243, 232, 255) 100%)" }} data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[160.22px] not-italic text-[#9810fa] text-[48px] text-center top-[21px] whitespace-nowrap">E</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[20px] left-0 top-[113.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[159.65px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.33px] whitespace-nowrap">Valley of Vowels</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[28px] left-0 top-[137.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[160.7px] not-italic text-[#1e2939] text-[18px] text-center top-[-1px] whitespace-nowrap">Example: egg</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p19cded00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ed10d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1e708580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-gradient-to-r drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] from-[#2b7fff] h-[48px] left-[77.83px] rounded-[22369600px] to-[#00b8db] top-[177.33px] w-[164.323px]" data-name="Button">
      <Icon8 />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[96px] not-italic text-[16px] text-center text-white top-[10.33px] whitespace-nowrap">Hear Sound</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[225.333px] relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Paragraph6 />
      <Paragraph7 />
      <Button10 />
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-[#eff6ff] h-[44px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[12.333px] pt-[11.667px] px-[12px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#1447e6] text-[0px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">Phonetic:</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` /e/`}</span>
        </p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[16px] h-[333.333px] items-start left-[392px] pt-[24px] px-[24px] rounded-[24px] top-0 w-[368px]" data-name="Container">
      <Container19 />
      <Container21 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[97.333px] left-0 rounded-[16px] top-0 w-[320px]" style={{ backgroundImage: "linear-gradient(163.082deg, rgb(219, 234, 254) 0%, rgb(243, 232, 255) 100%)" }} data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[160.39px] not-italic text-[#9810fa] text-[48px] text-center top-[21px] whitespace-nowrap">I</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[20px] left-0 top-[113.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[159.65px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.33px] whitespace-nowrap">Valley of Vowels</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[28px] left-0 top-[137.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[160.02px] not-italic text-[#1e2939] text-[18px] text-center top-[-1px] whitespace-nowrap">Example: igloo</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p19cded00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ed10d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1e708580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-gradient-to-r drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] from-[#2b7fff] h-[48px] left-[77.83px] rounded-[22369600px] to-[#00b8db] top-[177.33px] w-[164.323px]" data-name="Button">
      <Icon9 />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[96px] not-italic text-[16px] text-center text-white top-[10.33px] whitespace-nowrap">Hear Sound</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[225.333px] relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Paragraph8 />
      <Paragraph9 />
      <Button11 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[#eff6ff] h-[44px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[12.333px] pt-[11.667px] px-[12px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#1447e6] text-[0px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">Phonetic:</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` /i/`}</span>
        </p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[16px] h-[333.333px] items-start left-[784px] pt-[24px] px-[24px] rounded-[24px] top-0 w-[368px]" data-name="Container">
      <Container23 />
      <Container25 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[97.333px] left-0 rounded-[16px] top-0 w-[320px]" style={{ backgroundImage: "linear-gradient(163.082deg, rgb(219, 234, 254) 0%, rgb(243, 232, 255) 100%)" }} data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[159.79px] not-italic text-[#9810fa] text-[48px] text-center top-[21px] whitespace-nowrap">O</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[20px] left-0 top-[113.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[159.65px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.33px] whitespace-nowrap">Valley of Vowels</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute h-[28px] left-0 top-[137.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[160.94px] not-italic text-[#1e2939] text-[18px] text-center top-[-1px] whitespace-nowrap">Example: octopus</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p19cded00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ed10d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1e708580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-gradient-to-r drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] from-[#2b7fff] h-[48px] left-[77.83px] rounded-[22369600px] to-[#00b8db] top-[177.33px] w-[164.323px]" data-name="Button">
      <Icon10 />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[96px] not-italic text-[16px] text-center text-white top-[10.33px] whitespace-nowrap">Hear Sound</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[225.333px] relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Paragraph10 />
      <Paragraph11 />
      <Button12 />
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-[#eff6ff] h-[44px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[12.333px] pt-[11.667px] px-[12px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#1447e6] text-[0px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">Phonetic:</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` /o/`}</span>
        </p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[16px] h-[333.333px] items-start left-0 pt-[24px] px-[24px] rounded-[24px] top-[357.33px] w-[368px]" data-name="Container">
      <Container27 />
      <Container29 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute h-[97.333px] left-0 rounded-[16px] top-0 w-[320px]" style={{ backgroundImage: "linear-gradient(163.082deg, rgb(219, 234, 254) 0%, rgb(243, 232, 255) 100%)" }} data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[159.64px] not-italic text-[#9810fa] text-[48px] text-center top-[21px] whitespace-nowrap">U</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute h-[20px] left-0 top-[113.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[159.65px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.33px] whitespace-nowrap">Valley of Vowels</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute h-[28px] left-0 top-[137.33px] w-[320px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[159.57px] not-italic text-[#1e2939] text-[18px] text-center top-[-1px] whitespace-nowrap">Example: umbrella</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p19cded00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ed10d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1e708580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-gradient-to-r drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] from-[#2b7fff] h-[48px] left-[77.83px] rounded-[22369600px] to-[#00b8db] top-[177.33px] w-[164.323px]" data-name="Button">
      <Icon11 />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[96px] not-italic text-[16px] text-center text-white top-[10.33px] whitespace-nowrap">Hear Sound</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[225.333px] relative shrink-0 w-full" data-name="Container">
      <Container32 />
      <Paragraph12 />
      <Paragraph13 />
      <Button13 />
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-[#eff6ff] h-[44px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[12.333px] pt-[11.667px] px-[12px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[#1447e6] text-[0px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">Phonetic:</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` /u/`}</span>
        </p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[16px] h-[333.333px] items-start left-[392px] pt-[24px] px-[24px] rounded-[24px] top-[357.33px] w-[368px]" data-name="Container">
      <Container31 />
      <Container33 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[690.667px] left-[100px] top-[316px] w-[1152px]" data-name="Container">
      <Container14 />
      <Container18 />
      <Container22 />
      <Container26 />
      <Container30 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#1e2939] text-[20px] top-[-1.33px] whitespace-nowrap">💡 How to Use the Sound Library</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.67px] whitespace-nowrap">{`• Click any sound card to hear how it's pronounced`}</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.67px] whitespace-nowrap">• Practice saying the sound along with the audio</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.67px] whitespace-nowrap">• Check the example words to hear the sound in context</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-1.67px] whitespace-nowrap">• Use this library anytime you want to review!</p>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[120px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[12px] h-[208px] items-start left-[292px] pt-[24px] px-[24px] rounded-[24px] top-[1054.67px] w-[768px]" data-name="Container">
      <Heading2 />
      <List />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[1294.667px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container11 />
      <Container12 />
      <Container13 />
      <Container34 />
    </div>
  );
}

function PhonemeBank() {
  return (
    <div className="h-[784.667px] relative shrink-0 w-full" style={{ backgroundImage: "linear-gradient(150.15deg, rgb(0, 213, 190) 0%, rgb(81, 162, 255) 50%, rgb(124, 134, 255) 100%)" }} data-name="PhonemeBank">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[15.333px] relative size-full">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[784.667px] items-start left-0 overflow-clip top-[64.67px] w-[1367.333px]" data-name="Container">
      <PhonemeBank />
    </div>
  );
}

export default function VisualizeCapstoneProject() {
  return (
    <div className="bg-[#faf7f2] relative size-full" data-name="Visualize Capstone Project">
      <Header />
      <Container7 />
    </div>
  );
}