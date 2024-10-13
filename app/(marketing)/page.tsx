import { Footer } from './_components/footer'
import Heading from './_components/heading'
import { Heroes } from './_components/heroes'

const MarketingPage = () => {
  return (
    // INFO: 这里加了个dark:bg-[#1f1f1f]，否则只加在布局那里会有不同的颜色
    <div className="min-h-full flex flex-col dark:bg-[#1f1f1f]">
      {/* md:justify-start：在中等及以上屏幕尺寸时，
      子元素在垂直方向上从顶部开始排列。 */}
      <div
        className="flex flex-col items-center
          justify-center md:justify-start text-center gap-y-8
          flex-1 px-6 pb-10"
      >
        <Heading></Heading>
        <Heroes></Heroes>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default MarketingPage
