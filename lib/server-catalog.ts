import 'server-only';
import {products} from './catalog';
import {isLive} from './config';
import {stripe,priceKeys} from './payments';
import {cache} from 'react';
export const getCatalog=cache(async()=>{if(!isLive())return products;return Promise.all(products.map(async p=>{try{const id=process.env[priceKeys[p.id]];if(!id)return {...p,available:false,amount:0};const price=await stripe().prices.retrieve(id,{expand:['product']});const active=price.active&&price.currency==='usd'&&price.type==='one_time'&&!!price.unit_amount&&typeof price.product!=='string'&&!price.product.deleted&&price.product.active;return {...p,amount:price.unit_amount||0,available:!!active&&(!p.physical||process.env.CGM_SALES_ENABLED==='true')};}catch{return {...p,available:false,amount:0}}}));});
