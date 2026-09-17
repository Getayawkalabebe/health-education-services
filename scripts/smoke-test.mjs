import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
const origin=process.env.TEST_ORIGIN||'http://localhost:3000';
for(const path of ['/','/shop','/book','/donate','/privacy','/terms','/accessibility','/checkout/success','/robots.txt','/sitemap.xml']){const res=await fetch(origin+path);assert.equal(res.status,200,path);console.log('PASS GET '+path);}
const post=async(path,body,headers={})=>fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','Idempotency-Key':randomUUID(),...headers},body:JSON.stringify(body)});
for(const [path,body] of [['/api/checkout',{items:[{id:'coaching',quantity:1}]}],['/api/donations',{amount:5000}],['/api/bookings',{service:'discovery',start:new Date(Date.now()+2*86400000).toISOString(),name:'Sample Person',email:'sample@example.com',timeZone:'UTC',consent:true}]]){const res=await post(path,body);assert.equal(res.status,200);assert.equal((await res.json()).demo,true);console.log('PASS preview '+path);}
assert.equal((await post('/api/checkout',{items:[{id:'coaching',quantity:1,price:1}]})).status,400);
assert.equal((await post('/api/donations',{amount:1})).status,400);
assert.equal((await post('/api/donations',{amount:500},{Origin:'https://attacker.example'})).status,403);
assert.equal((await post('/api/bookings',{consent:false})).status,400);
assert.equal((await post('/api/checkout',{items:[{id:'cgm',quantity:1}]},{'Idempotency-Key':'bad'})).status,400);
const start=new Date().toISOString().slice(0,10),end=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
const slots=await fetch(origin+'/api/availability?'+new URLSearchParams({service:'discovery',start,end,timeZone:'UTC'}));assert.equal(slots.status,200);assert.ok((await slots.json()).slots.length>0);
console.log('PASS validation, origin protection, request keys and calendar availability');
