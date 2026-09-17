'use client';
import {motion,useReducedMotion} from 'motion/react';
export function Reveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}){const reduced=useReducedMotion();return <motion.div className={className} initial={false} whileInView={reduced?{}:{opacity:[.65,1],y:[18,0]}} viewport={{once:true,amount:.12}} transition={{duration:.55,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}

