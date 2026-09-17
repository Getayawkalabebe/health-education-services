import type {Metadata} from 'next';
import Link from 'next/link';
import {CheckCircle2,Clock3} from 'lucide-react';
import {stripe} from '@/lib/payments';
import {isLive} from '@/lib/config';
import {money} from '@/lib/catalog';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Payment status',robots:{index:false,follow:false}};
export default async function Receipt({searchParams}:{searchParams:Promise<{session_id?:string}>}){
 const {session_id}=await searchParams;let paid=false,amount=0,donation=false;
 if(isLive()&&session_id&&/^cs_[a-zA-Z0-9_]{10,200}$/.test(session_id)){try{const session=await stripe().checkout.sessions.retrieve(session_id);paid=session.payment_status==='paid'&&['order','donation'].includes(session.metadata?.kind||'');amount=session.amount_total||0;donation=session.metadata?.kind==='donation';}catch{}}
 return <main id="main-content" className="shell"><section className="receipt">{paid?<CheckCircle2 size={56}/>:<Clock3 size={56}/>}<p className="eyebrow">HEALTH EDUCATION SERVICES</p><h1>{paid?donation?'Thank you for helping health education reach further.':'Your next step is on its way.':'Let’s check your payment.'}</h1><p>{paid?`${money(amount)} payment confirmed. ${donation?'Your contribution supports community health education.':'Your order will be reviewed by HES before fulfillment. Coaching scheduling is arranged separately.'}`:isLive()?'We cannot confirm a completed payment from this link. A payment may still be processing. Check your payment email before trying again.':'This is a preview. No payment has been processed.'}</p><Link className="button button-primary" href="/">Return home</Link></section></main>
}
