import 'server-only';
export const isLive=()=>process.env.LIVE_MODE==='true';
export function siteUrl(){const value=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const url=new URL(value);if(isLive()&&url.protocol!=='https:')throw new Error('A secure site URL is required in live mode.');return url.origin;}

