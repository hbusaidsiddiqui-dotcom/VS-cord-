const products = [
  // Notebooks
  {id:1, name:'Classic Ruled Notebook A5 (200 pages)', price:350, type:'notebook', img:'https://www.hamdam.net/wp-content/uploads/2018/03/NB01.jpg'},
  {id:2, name:'Hardbound Notebook A4 (300 pages)', price:690, type:'notebook', img:'https://www.hamdam.net/wp-content/uploads/2018/03/NB02.jpg'},
  {id:3, name:'Spiral Notebook B5', price:520, type:'notebook', img:'https://www.hamdam.net/wp-content/uploads/2018/03/NB03.jpg'},

  // Registers
  {id:4, name:'Cash Register (2 Quire)', price:780, type:'register', img:'https://www.hamdam.net/wp-content/uploads/2018/03/WR01.jpg'},
  {id:5, name:'Attendance Register (4 Quire)', price:1150, type:'register', img:'https://www.hamdam.net/wp-content/uploads/2018/03/WR02.jpg'},
  {id:6, name:'Sales Register Ledger (A4)', price:990, type:'register', img:'https://www.hamdam.net/wp-content/uploads/2018/03/WR03.jpg'},
  {id:7, name:'Accounts Register (8 Quire)', price:1600, type:'register', img:'https://www.hamdam.net/wp-content/uploads/2018/03/WR04.jpg'},

  // Bill Books
{id:8, name:'Bill Book 3-ply (Carbonless) 50 sets', price:850, type:'bill', 
 img:'https://www.hamdam.net/wp-content/uploads/2018/03/WR05.jpg'},
  {id:9, name:'Bill Book 2-ply (Perforated) 50 sets', price:640, type:'bill', img:'https://www.hamdam.net/wp-content/uploads/2018/03/BB02.jpg'},
  {id:10, name:'Duplicate Bill Book Large (100 sets)', price:1200, type:'bill', img:'https://www.hamdam.net/wp-content/uploads/2018/03/BB03.jpg'}
];

// ---------------- Core Functions ----------------
const placeholder = (w=300,h=220,text='Product') => `https://via.placeholder.com/${w}x${h}?text=${encodeURIComponent(text)}`;
const fmt = n => `Rs ${n.toLocaleString()}`;
const grid = document.getElementById('productGrid');
const chips = document.getElementById('chips');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

function render(list){
  grid.innerHTML = list.map(p=>`
    <article class="product" data-type="${p.type}">
      <div class="thumb">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='${placeholder(380,260,p.type)}'">
      </div>
      <div class="body">
        <h3>${p.name}</h3>
        <div class="price-row">
          <div class="price">${fmt(p.price)}</div>
          <button class="add" onclick="addToCart(${p.id})"><i class='fa-solid fa-plus'></i> Add</button>
        </div>
      </div>
    </article>`).join('');
}

function currentFiltered(){
  const active = chips.querySelector('.chip.active')?.dataset.filter || 'all';
  const q = (searchInput?.value || '').trim().toLowerCase();
  let list = products.filter(p => (active==='all' || p.type===active) && (!q || p.name.toLowerCase().includes(q)) );
  switch(sortSelect?.value){
    case 'price-asc': list = list.slice().sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list = list.slice().sort((a,b)=>b.price-a.price); break;
    case 'name': list = list.slice().sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  return list;
}

chips?.addEventListener('click', e=>{
  if(e.target.classList.contains('chip')){
    chips.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    e.target.classList.add('active');
    render(currentFiltered());
  }
});
sortSelect?.addEventListener('change', ()=>render(currentFiltered()));
searchInput?.addEventListener('input', ()=>render(currentFiltered()));

// ---------------- Cart ----------------
const drawer = document.getElementById('drawer');
const openCart = document.getElementById('openCart');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cart = JSON.parse(localStorage.getItem('cart')||'{}');

function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); }
function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  updateCartUI(); saveCart();
  drawer.classList.add('open');
}
function changeQty(id, delta){
  cart[id] = (cart[id]||0) + delta;
  if(cart[id] <= 0) delete cart[id];
  updateCartUI(); saveCart();
}
function updateCartUI(){
  const entries = Object.entries(cart);
  cartCount.textContent = entries.reduce((a,[id,q])=>a+q,0);
  const rows = entries.map(([id,qty])=>{
    const p = products.find(x=>x.id==id);
    return `<div class='cart-item'>
      <img alt='${p.name}' src='${p.img}' onerror="this.src='${placeholder(56,56,'')}'">
      <div>
        <div class='cart-name'>${p.name}</div>
        <div class='qty'>
          <button onclick='changeQty(${id},-1)'>–</button>
          <span>${qty}</span>
          <button onclick='changeQty(${id},1)'>+</button>
        </div>
      </div>
      <div class='cart-price'>${fmt(p.price*qty)}</div>
    </div>`;
  }).join('');
  cartItems.innerHTML = rows || '<p class="muted">Your cart is empty.</p>';
  const total = entries.reduce((sum,[id,qty])=>{
    const p = products.find(x=>x.id==id); return sum + p.price*qty;
  },0);
  cartTotal.textContent = fmt(total);
}

openCart?.addEventListener('click', ()=>drawer.classList.add('open'));
closeCart?.addEventListener('click', ()=>drawer.classList.remove('open'));

document.getElementById('year').textContent = new Date().getFullYear();
render(products);
updateCartUI();

document.getElementById('contactForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  alert('Thanks! Message submitted (demo).');
  e.target.reset();
});
