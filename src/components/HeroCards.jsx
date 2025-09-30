import React from 'react'
import { Globe, Building2, Tags, ArrowUpDown } from 'lucide-react';

const HeroCards = () => {
    return (
        <div className='flex items-center justify-between gap-4 mt-10 px-5'>
            <div className='w-[32%] bg-purple-100 p-6 rounded-2xl shadow-inner border border-purple-200 cursor-pointer hover:shadow-sm transition duration-300'>
                <p className='flex justify-end text-green-500'><ArrowUpDown /></p>
                <div className='flex items-center gap-2 mt-2 p-semibold text-gray-700'>
                    <Globe size={25} className='text-[#5556cc]' />
                    <p className='text-2xl text-[#5556cc]'>Global</p>
                </div>
                <p className='text-xl p-bold text-gray-800 mt-2 ml-1'>$ 0.00</p>
            </div>
            <div className='w-[32%] bg-purple-100 p-6 rounded-2xl shadow-inner border border-purple-200 cursor-pointer hover:shadow-sm transition duration-300'>
                <p className='flex justify-end text-green-500'><ArrowUpDown /></p>
                <div className='flex items-center gap-2 mt-2 p-semibold text-gray-700'>
                    <Building2 size={25} className='text-[#5556cc]' />
                    <p className='text-2xl text-[#5556cc]'>Business</p>
                </div>
                <p className='text-xl p-bold text-gray-800 mt-2 ml-1'>$ 0.00</p>
            </div>
            <div className='w-[32%] bg-purple-100 p-6 rounded-2xl shadow-inner border border-purple-200 cursor-pointer hover:shadow-sm transition duration-300'>
                <p className='flex justify-end text-green-500'><ArrowUpDown /></p>
                <div className='flex items-center gap-2 mt-2 p-semibold text-gray-700'>
                    <Tags size={25} className='text-[#5556cc]' />
                    <p className='text-2xl text-[#5556cc]'>Sales</p>
                </div>
                <p className='text-xl p-bold text-gray-800 mt-2 ml-1'>$ 0.00</p>
            </div>
        </div>
    )
}

export default HeroCards;