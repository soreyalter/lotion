import React from 'react'
import Image from 'next/image'

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div
          className="relative w-[300px]
                    h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]"
        >
          <Image
            src="/documents.png"
            alt="Documents"
            fill
            // 保持内容比例，无裁剪，尽量贴合容器，但保证不会超出
            className="object-contain dark:hidden"
          />
          <Image
            src="/documents-dark.png"
            alt="Documents"
            fill
            // 保持内容比例，无裁剪，尽量贴合容器，但保证不会超出
            className="object-contain hidden dark:block"
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden md:block">
          <Image
            src="/reading.png"
            alt="Reading"
            fill
            className="object-contain"
          ></Image>
          <Image
            src="/reading-dark.png"
            alt="Reading"
            fill
            className="object-contain hidden dark:block"
          ></Image>
        </div>
      </div>
    </div>
  )
}
