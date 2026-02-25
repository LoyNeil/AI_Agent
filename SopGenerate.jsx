import React from 'react'
import { useState } from "react";

const SopGenerate = ({sopText}) => {
  return (
    <div>
        <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00FF66]"></div>
                <p className="font-bold text-[#00FF66] text-2xl whitespace-nowrap drop-shadow-[0_0_8px_#00FF66]">Generated SOP</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00FF66]"></div>
        </div>
        <div className='p-4 flex box-border h-100 w-200 border-2 border-neon-green border-double justify-center items-center mx-auto overflow-y-auto'>
            {sopText ? (
          <pre className="text-[#39FF14] whitespace-pre-wrap leading-relaxed">
            {sopText}
          </pre>
        ) : (
          <p className="text-neon-green-content">Generated SOP placeholder</p>
        )}
        </div>
    </div>
  )
}
export default SopGenerate
