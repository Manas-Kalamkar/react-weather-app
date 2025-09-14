import Search from "./Search";

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import logo from '../assets/logo.png'
import hamburger from '../assets/hamburger.svg'
import search from '../assets/search.svg'
import close from '../assets/close.svg'


import Lottie from 'lottie-react';
import loadingAnimation from '../assets/animations/loading.json'

const Header = ({ searchTerm,setSearchTerm, isLoading, errorMessage }) => {
    const [isSearch, setIsSearch] = useState(false);
    const [isOptions, setIsOptions] = useState(false);

    const typeRef = useRef(null);
    

    return (

        <header className="bg-white block relative">
            <nav className="relative flex items-center p-1 justify-between mx-3 mt-4  h-16 md:py-14 xl:gap-10 xl:py-14 xl:px-10">
                <NavLink to='/' className="hover:cursor-pointer">
                    <div className="flex items-center gap-4 xl:gap-8">
                        <img src={logo} alt="logo" className="object-contain p-4 xl:p-0" />
                        <h1 className="text-6xl tracking-widest font-bold hidden lg:block xl:ml-5 xl:text-[3.4rem] ">
                            Weather
                        </h1>
                    </div>
                </NavLink>
                <div className="m-0" >

                {isLoading && <div className="flex items-center justify-center bg-white z-50 mt-10 absolute top-0 bottom-0"><Lottie 
                    renderer="svg"
                    animationData={loadingAnimation}
                    background="transparent"
                    speed="0.5"
                    autoPlay=""
                    loop=""
                    className="w-[100px] h-[100px] md:w-fit" /></div>
                }

                {
                    errorMessage && <div className="flex items-center justify-center bg-white z-50 mt-10 text-red-500">{errorMessage}</div>
                }
                </div>

                <div className="flex items-center gap-4 xl:gap-8">
                    {isSearch ? (
                        
                        <>
                        <Search  searchTerm={searchTerm} setSearchTerm={setSearchTerm} typeRef={typeRef} />
                        
                        <img src={close} alt="close" className="w-10 h-10 cursor-pointer" onClick={()=>{setIsSearch(false);setSearchTerm('')}} />

                        </>

                    ):(
                        <img src={search} alt="search" className="w-10 h-10 cursor-pointer" onClick={()=>{setIsSearch(true);setIsOptions(false);setTimeout(() => {
      typeRef.current?.focus();  // Focus after UI updates
    }, 0);}} />
                    )}
                    <img src={hamburger} alt="hamburger" className="w-10 h-10 cursor-pointer block lg:hidden" onClick={()=>setIsOptions(!isOptions)} />
                    <ul className={`hidden z-50 flex-col gap-2 top-[24px] items-end lg:flex lg:flex-row xl:gap-8`}>

                    <NavLink to='/' className={({isActive})=>`p-3 text-xl px-4 font-bold  m-2 border-2 rounded cursor-pointer ${isActive ? "bg-[#B9FF66] ":""} `}>
                            <span >Home</span>
                    </NavLink>

                    <NavLink to='/about' className={({isActive})=>`p-3 text-xl px-4 font-bold  m-2 border-2 rounded cursor-pointer ${isActive ? "bg-[#B9FF66] ":""} `}>
                            <span >About</span>
                    </NavLink>

                    <NavLink to='/contact' className={({isActive})=>`p-3 text-xl px-4 font-bold  m-2 border-2 rounded cursor-pointer ${isActive ? "bg-[#B9FF66] ":""} `}>
                            <span >Contact</span>
                    </NavLink>

                    </ul>
                
                </div>
            </nav>
                    <ul className={`${isOptions? "flex":"hidden"} z-50 flex-col gap-6 top-full items-end `}>
                        <NavLink to='/' className={({isActive})=>`p-3 text-xl px-4 font-bold  m-2 border-2 rounded cursor-pointer ${isActive ? "bg-[#B9FF66] ":""} `}>
                                <span >Home</span>
                        </NavLink>

                        <NavLink to='/about' className={({isActive})=>`p-3 text-xl px-4 font-bold  m-2 border-2 rounded cursor-pointer ${isActive ? "bg-[#B9FF66] ":""} `}>
                                <span >About</span>
                        </NavLink>

                        <NavLink to='/contact' className={({isActive})=>`p-3 text-xl px-4 font-bold  m-2 border-2 rounded cursor-pointer ${isActive ? "bg-[#B9FF66] ":""} `}>
                                <span >Contact</span>
                        </NavLink>
                    </ul>
            
                
           
        </header>


    )
}

export default Header;
