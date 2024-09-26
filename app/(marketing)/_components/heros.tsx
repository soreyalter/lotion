import React from 'react'
import Image from 'next/image'

export const Heros = () => {
  return (
    <div className='flex flex-col items-center justify-center max-w-5xl'>
        <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
            <div>
                <Image
                  src="/documents.png"
                  alt='Documents'
                  fill
                  // 保持内容比例，无裁剪，尽量贴合容器，但保证不会超出
                  className='object-contain'
                />
            </div>
        </div>
    </div>
  )
}
