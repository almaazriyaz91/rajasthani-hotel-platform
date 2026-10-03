// Placeholder prices/phone: edit here
const PHONE='+91XXXXXXXXXX';
const MENU=[
{id:1,cat:'Starters',name:'Paneer Tikka',price:360,img:'img/paneer-tikka.jpg'},
{id:2,cat:'Starters',name:'Veg Manchurian',price:300,img:'img/veg-manchurian.jpg'},
{id:3,cat:'Pizza',name:'Farm House Pizza (Medium, 8 inch)',price:310,img:'img/farmhouse-pizza.jpg'},
{id:4,cat:'Beverages',name:'Chocolate Shake',price:120,img:'img/chocolate-shake.jpg'}];
const ROOMS=[
{id:'r1',name:'Deluxe Marble Room',price:1499,img:'img/room-marble.jpg',size:'Double bed',desc:'Black-gold marble feature wall, warm cove lighting and a spotless attached bathroom.',fac:['AC','Attached bathroom','Free Wi-Fi','TV','24x7 hot water','Room service']},
{id:'r2',name:'Premium Wooden Room',price:1999,img:'img/room-premium.jpg',size:'Double bed',desc:'Warm wood-panelled walls, a carved jaali ceiling light and extra floor space.',fac:['AC','Attached bathroom','Free Wi-Fi','TV','24x7 hot water','Room service']}];
const $=s=>document.querySelector(s),inr=n=>'₹'+n.toLocaleString('en-IN');
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2600)}
$('#burger')?.addEventListener('click',()=>$('.links').classList.toggle('open'));
let cart=JSON.parse(localStorage.getItem('cart')||'{}');
const save=()=>localStorage.setItem('cart',JSON.stringify(cart));
const total=()=>Object.entries(cart).reduce((s,[id,q])=>s+MENU.find(m=>m.id==id).price*q,0);
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function renderMenu(cat='All'){
 const cats=['All',...new Set(MENU.map(m=>m.cat))];
 $('#chips').innerHTML=cats.map(c=>`<button class="chip ${c==cat?'on':''}" data-c="${c}">${c}</button>`).join('');
 $('#items').innerHTML=MENU.filter(m=>cat=='All'||m.cat==cat).map(m=>`<article class="card"><img src="${m.img}" alt="${m.name}" loading="lazy"><div class="b"><h3><span class="veg"></span>${m.name}</h3><p class="price">${inr(m.price)}</p><button class="btn" style="margin-top:.6rem;width:100%" data-add="${m.id}">Add to cart</button></div></article>`).join('');
}
function renderCart(){
 $('#cartbtn').textContent=`Cart (${count()}) · ${inr(total())}`;
 const ids=Object.keys(cart);
 $('#lines').innerHTML=ids.length?ids.map(id=>{const m=MENU.find(x=>x.id==id);return `<div class="line-i"><div><b>${m.name}</b><br><span class="price">${inr(m.price*cart[id])}</span></div><div class="qty"><button data-q="${id}" data-d="-1" aria-label="Remove one">−</button><b>${cart[id]}</b><button data-q="${id}" data-d="1" aria-label="Add one">+</button></div></div>`}).join(''):'<p style="padding:1rem 0;color:var(--mute)">Your cart is empty. Add a dish from the menu.</p>';
 const sub=total(),gst=Math.round(sub*.05),del=sub?40:0;
 $('#sum').innerHTML=`<div class="sum"><span>Subtotal</span><span>${inr(sub)}</span></div><div class="sum"><span>GST (5%)</span><span>${inr(gst)}</span></div><div class="sum"><span>Delivery</span><span>${inr(del)}</span></div><div class="sum t"><span>Total</span><span>${inr(sub+gst+del)}</span></div>`;
 $('#checkout').classList.toggle('hide',!ids.length);
}
document.addEventListener('click',e=>{
 const t=e.target;
 if(t.dataset.c){renderMenu(t.dataset.c)}
 if(t.dataset.add){cart[t.dataset.add]=(cart[t.dataset.add]||0)+1;save();renderCart();toast('Added to cart')}
 if(t.dataset.q){const id=t.dataset.q;cart[id]+=+t.dataset.d;if(cart[id]<1)delete cart[id];save();renderCart()}
 if(t.id=='cartbtn')$('#drawer').classList.add('open');
 if(t.id=='drawer'||t.dataset.close)$('#drawer').classList.remove('open');
 if(t.dataset.book){const r=ROOMS.find(x=>x.id==t.dataset.book);$('#room').value=r.id;calc();$('#book').scrollIntoView()}
});
function calc(){const a=$('#in').value,b=$('#out').value,r=ROOMS.find(x=>x.id==$('#room').value);const n=a&&b?Math.round((new Date(b)-new Date(a))/864e5):0;$('#bsum').textContent=n>0?`${n} night${n>1?'s':''} × ${inr(r.price)} = ${inr(n*r.price)}`:'Pick valid dates to see the total';return n}
