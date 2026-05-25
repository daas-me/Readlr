import svgPaths from "./svg-8dlvfn3942";

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
    <div className="absolute left-[12.67px] size-[16px] top-[10.67px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #4F46E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #4F46E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[37.333px] relative rounded-[16px] shrink-0 w-[103.948px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(31,36,48,0.08)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[63.67px] not-italic text-[#4f46e5] text-[14px] text-center top-[8.33px] whitespace-nowrap">Progress</p>
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
    <div className="h-[37.333px] relative shrink-0 w-[379.76px]" data-name="Navigation">
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
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[43.69px] not-italic text-[#1f2430] text-[14px] text-right top-[-0.33px] whitespace-nowrap">ads</p>
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

function Container10() {
  return (
    <div className="bg-white drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] h-[48px] relative rounded-[22369600px] shrink-0 w-[199.531px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[24px] not-italic text-[#9810fa] text-[16px] top-[10.33px] whitespace-nowrap">Learning Dashboard</p>
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
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[644.2px] not-italic text-[48px] text-center text-white top-[-3px] whitespace-nowrap">My Progress</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[28px] left-[644.27px] not-italic text-[20px] text-[rgba(255,255,255,0.9)] text-center top-[-1.33px] whitespace-nowrap">Keep up the great work!</p>
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

function Icon6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3f521e00} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p203c5100} id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M4 22H20" id="Vector_3" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p20590f00} id="Vector_4" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p74ec0e0} id="Vector_5" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p374bec80} id="Vector_6" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[67.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Total Score</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text1 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#1e2939] text-[30px] top-[-2px] whitespace-nowrap">1500</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[8px] h-[116px] items-start left-0 pt-[24px] px-[24px] rounded-[24px] top-0 w-[276px]" data-name="Container">
      <Container15 />
      <Paragraph4 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pace200} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3c6311f0} id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3d728000} id="Vector_3" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[55.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Accuracy</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <Text2 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#1e2939] text-[30px] top-[-2px] whitespace-nowrap">82%</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[8px] h-[116px] items-start left-[292px] pt-[24px] px-[24px] rounded-[24px] top-0 w-[276px]" data-name="Container">
      <Container17 />
      <Paragraph5 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3eeeaa80} id="Vector" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2f14bd80} id="Vector_2" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[37.271px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Levels</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Text3 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#1e2939] text-[30px] top-[-2px] whitespace-nowrap">8/23</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[8px] h-[116px] items-start left-[584px] pt-[24px] px-[24px] rounded-[24px] top-0 w-[276px]" data-name="Container">
      <Container19 />
      <Paragraph6 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M8 2V6" id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 2V6" id="Vector_2" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p32f12c00} id="Vector_3" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3 10H21" id="Vector_4" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[38.01px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Streak</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text4 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#1e2939] text-[30px] top-[-2px] whitespace-nowrap">5 days</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] flex flex-col gap-[8px] h-[116px] items-start left-[876px] pt-[24px] px-[24px] rounded-[24px] top-0 w-[276px]" data-name="Container">
      <Container21 />
      <Paragraph7 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[116px] relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container16 />
      <Container18 />
      <Container20 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p13253c0} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 7H22V13" id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[32px] relative shrink-0 w-[175.854px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#1e2939] text-[24px] whitespace-nowrap">Weekly Activity</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[12px] h-[32px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon10 />
      <Heading2 />
    </div>
  );
}

function Container26() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text5() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[30.427px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Mon</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[16.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">8m</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container26 />
        <Text5 />
        <Text6 />
      </div>
    </div>
  );
}

function Container28() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text7() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[23.292px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Tue</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[23.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">12m</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container28 />
        <Text7 />
        <Text8 />
      </div>
    </div>
  );
}

function Container30() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text9() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[29.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Wed</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[23.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">10m</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container30 />
        <Text9 />
        <Text10 />
      </div>
    </div>
  );
}

function Container32() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text11() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[25.104px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Thu</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[23.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">15m</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container32 />
        <Text11 />
        <Text12 />
      </div>
    </div>
  );
}

function Container34() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text13() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[16.885px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Fri</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[16.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">0m</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container34 />
        <Text13 />
        <Text14 />
      </div>
    </div>
  );
}

function Container36() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text15() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[20.833px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Sat</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[16.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">0m</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container36 />
        <Text15 />
        <Text16 />
      </div>
    </div>
  );
}

function Container38() {
  return <div className="bg-gradient-to-t from-[#2b7fff] h-[4px] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 to-[#00d3f3] w-[144px]" data-name="Container" />;
}

function Text17() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[24.792px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Sun</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[16.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">0m</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[56px] relative shrink-0 w-[144px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container38 />
        <Text17 />
        <Text18 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[192px] items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container27 />
      <Container29 />
      <Container31 />
      <Container33 />
      <Container35 />
      <Container37 />
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-white drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] h-[296px] relative rounded-[24px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[24px] px-[24px] relative size-full">
        <Container23 />
        <Container24 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="Heading 2">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[32px] min-w-px not-italic relative text-[#1e2939] text-[24px]">Recent Activity</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#1e2939] text-[16px] top-[-1.67px] whitespace-nowrap">Valley of Vowels - I</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Today</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[44px] relative shrink-0 w-[141.646px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph8 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[84.07px] not-italic text-[#155dfc] text-[16px] text-right top-[-1.67px] whitespace-nowrap">+100 pts</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[84px] not-italic text-[#4a5565] text-[14px] text-right top-[-0.33px] whitespace-nowrap">85% accuracy</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[44px] relative shrink-0 w-[83.604px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph10 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-gradient-to-r from-[#eff6ff] h-[76px] relative rounded-[16px] shrink-0 to-[#faf5ff] w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container42 />
          <Container43 />
        </div>
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#1e2939] text-[16px] top-[-1.67px] whitespace-nowrap">Valley of Vowels - E</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Today</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[44px] relative shrink-0 w-[145.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph12 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[84.07px] not-italic text-[#155dfc] text-[16px] text-right top-[-1.67px] whitespace-nowrap">+100 pts</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[84px] not-italic text-[#4a5565] text-[14px] text-right top-[-0.33px] whitespace-nowrap">90% accuracy</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[44px] relative shrink-0 w-[83.604px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph14 />
        <Paragraph15 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-gradient-to-r from-[#eff6ff] h-[76px] relative rounded-[16px] shrink-0 to-[#faf5ff] w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container45 />
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#1e2939] text-[16px] top-[-1.67px] whitespace-nowrap">Valley of Vowels - A</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.33px] whitespace-nowrap">Yesterday</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[44px] relative shrink-0 w-[147.823px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph16 />
        <Paragraph17 />
      </div>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[84.07px] not-italic text-[#155dfc] text-[16px] text-right top-[-1.67px] whitespace-nowrap">+100 pts</p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[84px] not-italic text-[#4a5565] text-[14px] text-right top-[-0.33px] whitespace-nowrap">75% accuracy</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[44px] relative shrink-0 w-[83.604px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph18 />
        <Paragraph19 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-gradient-to-r from-[#eff6ff] h-[76px] relative rounded-[16px] shrink-0 to-[#faf5ff] w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container48 />
          <Container49 />
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[252px] items-start relative shrink-0 w-full" data-name="Container">
      <Container41 />
      <Container44 />
      <Container47 />
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-white drop-shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] h-[348px] relative rounded-[24px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading3 />
        <Container40 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[824px] items-start left-[100px] top-[228px] w-[1152px]" data-name="Container">
      <Container13 />
      <Container22 />
      <Container39 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[1116px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container11 />
      <Container12 />
    </div>
  );
}

function ProgressDashboard() {
  return (
    <div className="h-[784.667px] relative shrink-0 w-full" style={{ backgroundImage: "linear-gradient(150.15deg, rgb(0, 211, 243) 0%, rgb(81, 162, 255) 50%, rgb(124, 134, 255) 100%)" }} data-name="ProgressDashboard">
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
      <ProgressDashboard />
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