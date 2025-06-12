import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

async function getAccessToken(){
  const creds = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token',{
    method:'POST',
    headers:{'Authorization':`Basic ${creds}`,'Content-Type':'application/x-www-form-urlencoded'},
    body:'grant_type=client_credentials'
  }).then(r=>r.json());
  return tokenRes.access_token;
}

router.post('/create-order', async (_, res)=>{
  const access = await getAccessToken();
  const order = await fetch('https://api-m.paypal.com/v2/checkout/orders',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${access}`},
    body:JSON.stringify({
      intent:'CAPTURE',
      purchase_units:[{amount:{currency_code:'EUR',value:'279.00'},
        payee:{email_address:'FLORISVDOEVER@hotmail.com'}}]
    })
  }).then(r=>r.json());
  res.json({id:order.id});
});
export default router;
