import Heading from "./_components/heading";
import { Heros } from "./_components/heros";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      {/* md:justify-start：在中等及以上屏幕尺寸时，
      子元素在垂直方向上从顶部开始排列。 */}
      <div
        className="flex flex-col items-center
          justify-center md:justify-start text-center gap-y-8
          flex-1 px-6 pb-10"
      >
        <Heading></Heading>
        <Heros></Heros>
      </div>
    </div>
  );
};

export default MarketingPage;
