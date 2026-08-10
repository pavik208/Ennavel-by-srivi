const defaultProduct = {
  title: 'Signature Layer Set',
  price: '₹1,499',
  description: 'Premium layering with a polished, effortless finish.',
  image: 'Image/Scanner.jpeg',
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

function buildProductQuery(product) {
  const params = new URLSearchParams();
  params.set('title', product.title);
  params.set('price', product.price);
  params.set('description', product.description);
  params.set('tag', product.tag);
  params.set('image', product.image);
  return params.toString();
}

function parseProductFromQuery() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('title')) return null;

  return {
    title: params.get('title') || defaultProduct.title,
    price: params.get('price') || defaultProduct.price,
    description: params.get('description') || defaultProduct.description,
    tag: params.get('tag') || defaultProduct.tag,
    image: params.get('image') || defaultProduct.image
  };
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
  if (details.state) lines.push(`State: ${details.state}`);
  if (details.pincode) lines.push(`Pincode: ${details.pincode}`);
  if (details.phone) lines.push(`Phone: ${details.phone}`);
  if (details.size) lines.push(`Size: ${details.size}`);
  if (details.shippingCharge) lines.push(`Shipping: ₹${details.shippingCharge}`);
  if (details.totalAmount) lines.push(`Total amount: ₹${details.totalAmount}`);
  if (details.transactionId) lines.push(`Transaction ID: ${details.transactionId}`);
  if (details.card) lines.push(`Card: ${details.card}`);
  if (details.expiry) lines.push(`Expiry: ${details.expiry}`);
  if (details.cvv) lines.push(`CVV: ${details.cvv}`);

  const message = lines.join('\n');
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function parseIndianPrice(price) {
  return Number(price.replace(/[^0-9]/g, '')) || 0;
}

function formatIndianPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function openWhatsAppOrder(product, details = {}) {
  const url = buildWhatsAppUrl(product, details);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function saveCheckoutOrder(order) {
  localStorage.setItem('checkoutOrder', JSON.stringify(order));
}

function loadCheckoutOrder() {
  const raw = localStorage.getItem('checkoutOrder');
  return raw ? JSON.parse(raw) : null;
}

function validateIndianPin(pin) {
  return /^[1-9][0-9]{5}$/.test(pin);
}

function validateIndianPhone(phone) {
  return /^[6-9][0-9]{9}$/.test(phone);
}

function attachEventHandlers() {
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
      const productQuery = buildProductQuery(product);
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      window.location.href = `product.html?${productQuery}`;
    });
  });

  const queryProduct = parseProductFromQuery();
  const storedProduct = JSON.parse(localStorage.getItem('selectedProduct') || JSON.stringify(defaultProduct));
  const product = queryProduct || storedProduct;

  if (queryProduct) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  }

  let page = window.location.pathname.split('/').pop();
  if (!page) page = 'index.html';

  if (page === 'product.html' || page === 'product') {
    document.getElementById('detailTitle').textContent = product.title;
    document.getElementById('detailDesc').textContent = product.description;
    document.getElementById('detailPrice').textContent = product.price;
    document.getElementById('detailTag').textContent = product.tag;
    const image = document.getElementById('detailImage');
    if (image) {
      image.src = product.image || defaultProduct.image;
      image.alt = product.title;
      image.onerror = () => { image.src = defaultProduct.image; };
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn?.addEventListener('click', () => {
      const size = document.getElementById('sizeSelect')?.value || 'M';
      localStorage.setItem('selectedProduct', JSON.stringify({ ...product, size }));
      window.location.href = 'checkout.html';
    });
  }

  if (page === 'checkout.html' || page === 'checkout') {
    const shippingCharge = 60;
    const productAmount = parseIndianPrice(product.price);
    const totalAmount = productAmount + shippingCharge;

    document.getElementById('checkoutTitle').textContent = product.title;
    document.getElementById('checkoutPrice').textContent = product.price;
    document.getElementById('checkoutShipping').textContent = formatIndianPrice(shippingCharge);
    document.getElementById('checkoutTotal').textContent = formatIndianPrice(totalAmount);
    const checkoutImg = document.getElementById('checkoutImage');
    if (checkoutImg) {
      checkoutImg.src = product.image || defaultProduct.image;
      checkoutImg.alt = product.title;
      checkoutImg.onerror = () => { checkoutImg.src = defaultProduct.image; };
    }
    document.getElementById('checkoutSummary').textContent = `${product.title} • ${product.description}`;

    document.getElementById('checkoutForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const formElement = event.currentTarget;
      const name = formElement.querySelector('input[type="text"]').value.trim();
      const address = formElement.querySelector('textarea').value.trim();
      const state = formElement.querySelector('select')?.value || '';
      const pincode = formElement.querySelector('input[placeholder="Enter pin code"]')?.value.trim() || '';
      const phone = formElement.querySelector('input[type="tel"]')?.value.trim() || '';
      const size = document.getElementById('sizeSelect')?.value || 'M';

      if (!validateIndianPin(pincode)) {
        alert('Please enter a valid 6-digit Indian PIN code.');
        return;
      }

      if (!validateIndianPhone(phone)) {
        alert('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
        return;
      }

      const order = { product, name, address, state, pincode, phone, size, shippingCharge, totalAmount };
      saveCheckoutOrder(order);
      localStorage.setItem('checkoutTotal', totalAmount);
      window.location.href = 'payment.html?test=true';
    });
  }

  if (page === 'payment.html' || page === 'payment') {
    const checkoutOrder = loadCheckoutOrder();
    const totalAmount = checkoutOrder?.totalAmount || localStorage.getItem('checkoutTotal') || '';
    const shippingCharge = checkoutOrder?.shippingCharge || 60;

    document.getElementById('paymentTitle').textContent = product.title;
    document.getElementById('paymentPrice').textContent = product.price;
    document.getElementById('paymentShipping').textContent = formatIndianPrice(shippingCharge);
    document.getElementById('paymentTotal').textContent = formatIndianPrice(Number(totalAmount) || 0);
    const payImg = document.getElementById('paymentImage');
    if (payImg) {
      payImg.src = product.image || defaultProduct.image;
      payImg.alt = product.title;
      payImg.onerror = () => { payImg.src = defaultProduct.image; };
    }
    document.getElementById('paymentSummary').textContent = `${product.title} • ${product.description}`;

    document.getElementById('paymentForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const transactionId = document.getElementById('transactionId')?.value.trim();
      if (!transactionId) {
        alert('Please enter the UPI transaction ID.');
        return;
      }

      const checkoutOrder = loadCheckoutOrder();
      openWhatsAppOrder(product, {
        name: checkoutOrder?.name,
        address: checkoutOrder?.address,
        state: checkoutOrder?.state,
        pincode: checkoutOrder?.pincode,
        phone: checkoutOrder?.phone,
        size: checkoutOrder?.size,
        shippingCharge: checkoutOrder?.shippingCharge,
        totalAmount: checkoutOrder?.totalAmount || totalAmount,
        transactionId
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', attachEventHandlers);
