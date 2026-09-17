import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
export function ActionLink({href,children,secondary=false,className=''}:{href:string;children:React.ReactNode;secondary?:boolean;className?:string}){return <Link className={'button '+(secondary?'button-secondary ':'button-primary ')+className} href={href}>{children}<ArrowUpRight size={21} aria-hidden="true"/></Link>}
export function Eyebrow({children}:{children:React.ReactNode}){return <p className="eyebrow">{children}</p>}

