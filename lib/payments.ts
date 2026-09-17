import 'server-only';
import Stripe from 'stripe';import {ApiError} from './security';import {siteUrl} from './config';
let client:Stripe|undefined;
export function stripe(){if(!process.env.STRIPE_SECRET_KEY)throw new ApiError(503,'Secure payments are not available yet.');return client??=new Stripe(process.env.STRIPE_SECRET_KEY,{maxNetworkRetries:2,timeout:20000});}
export const priceKeys={cgm:'STRIPE_PRICE_CGM',coaching:'STRIPE_PRICE_COACHING',bundle:'STRIPE_PRICE_BUNDLE'} as const;
export function assertPaymentsReady(){siteUrl();if(!process.env.DATABASE_URL||!process.env.STRIPE_WEBHOOK_SECRET||!process.env.STRIPE_SECRET_KEY||!process.env.RATE_LIMIT_SALT)throw new ApiError(503,'Secure payments are not available yet.');}

