const defaultProduct = {
  title: 'Signature Layer Set',
  price: '₹1,499',
  description: 'Premium layering with a polished, effortless finish.',
  image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  tag: 'Best Seller'
};

const whatsappNumber = '916379537919';

function extractProductFromCard(card) {
  const title = card.querySelector('h3')?.textContent.trim() || defaultProduct.title;
  const description = card.querySelector('p')?.textContent.trim() || defaultProduct.description;
  const price = card.querySelector('.price')?.textContent.trim() || defaultProduct.price;
  const tag = card.querySelector('.pill')?.textContent.trim() || defaultProduct.tag;
  const image = defaultProduct.image;

  return { title, description, price, tag, image };
}

function buildWhatsAppUrl(product, details = {}) {
  const lines = [
    'New order from Ennaval by srivi',
    `Product: ${product.title}`,
    `Price: ${product.price}`,
    `Description: ${product.description}`
  ];

  if (details.name) lines.push(`Name: ${details.name}`);
  if (details.address) lines.push(`Address: ${details.address}`);
  if (details.phone) lines.push(`Phone: ${details.phone}`);
  if (details.size) lines.push(`Size: ${details.size}`);
  if (details.card) lines.push(`Card: ${details.card}`);
  if (details.expiry) lines.push(`Expiry: ${details.expiry}`);
  if (details.cvv) lines.push(`CVV: ${details.cvv}`);

  const message = lines.join('\n');
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function openWhatsAppOrder(product, details = {}) {
  const url = buildWhatsAppUrl(product, details);
  window.open(url, '_blank', 'noopener,noreferrer');
}

const form = document.getElementById('contactForm');
const message = document.getElementById('formMessage');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (form && message) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim() || 'there';

    message.textContent = `Thanks, ${name}! You're on the list for Ennaval by srivi.`;
    form.reset();
  });
}

document.querySelectorAll('.buy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const product = card ? extractProductFromCard(card) : defaultProduct;
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = 'product.html';
  });
});

const page = window.location.pathname.split('/').pop();

if (page === 'product.html') {
  const product = JSON.parse(localStorage.getItem('selectedProduct') || JSON.stringify(defaultProduct));
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailDesc').textContent = product.description;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailTag').textContent = product.tag;
  const image = document.getElementById('detailImage');
  if (image) image.src = product.image;

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn?.addEventListener('click', () => {
    localStorage.setItem('selectedProduct', JSON.stringify({ ...product, size: document.getElementById('sizeSelect').value }));
    window.location.href = 'checkout.html';
  });
}

function validateIndianPin(pin) {
  return /^[1-9][0-9]{5}$/.test(pin);
}

function validateIndianPhone(phone) {
  return /^[6-9][0-9]{9}$/.test(phone);
}

if (page === 'checkout.html') {
  const product = JSON.parse(localStorage.getItem('selectedProduct') || JSON.stringify(defaultProduct));
  document.getElementById('checkoutTitle').textContent = product.title;
  document.getElementById('checkoutPrice').textContent = product.price;
  document.getElementById('checkoutImage').src = product.image;
  document.getElementById('checkoutSummary').textContent = `${product.title} • ${product.description}`;

  document.getElementById('checkoutForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.querySelector('input[type="text"]').value.trim();
    const address = form.querySelector('textarea').value.trim();
    const state = form.querySelector('select')?.value || '';
    const pincode = form.querySelector('input[placeholder="Enter pin code"]')?.value.trim() || '';
    const phone = form.querySelector('input[type="tel"]')?.value.trim() || '';
    const size = document.getElementById('sizeSelect')?.value || 'M';

    if (!validateIndianPin(pincode)) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (!validateIndianPhone(phone)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }

    openWhatsAppOrder(product, { name, address, state, pincode, phone, size });
  });
}

if (page === 'payment.html') {
  const product = JSON.parse(localStorage.getItem('selectedProduct') || JSON.stringify(defaultProduct));
  document.getElementById('paymentTitle').textContent = product.title;
  document.getElementById('paymentPrice').textContent = product.price;
  document.getElementById('paymentImage').src = product.image;
  document.getElementById('paymentSummary').textContent = `${product.title} • ${product.description}`;

  document.getElementById('paymentForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = form.querySelectorAll('input[type="text"]');
    const card = inputs[0]?.value.trim() || '';
    const expiry = inputs[1]?.value.trim() || '';
    const cvv = inputs[2]?.value.trim() || '';

    openWhatsAppOrder(product, { card, expiry, cvv });
    document.getElementById('paymentMessage').textContent = 'Opening WhatsApp with your order details...';
  });
}
