const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const product = {
  title: 'Signature Layer Set',
  price: '₹1,499',
  description: 'Premium layering with a polished, effortless finish.',
  image: 'Image/Scanner.jpeg',
  tag: 'Best Seller'
};

const orders = [];

app.get('/api/product', (req, res) => {
  res.json(product);
});

app.post('/api/checkout', (req, res) => {
  const order = req.body;
  const id = `ORD-${Date.now()}`;
  const savedOrder = { id, createdAt: new Date().toISOString(), ...order };
  orders.push(savedOrder);

  res.json({ success: true, orderId: id, order: savedOrder });
});

app.post('/api/payment/verify', (req, res) => {
  const { orderId, transactionId } = req.body;
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.payment = {
    transactionId,
    status: 'success',
    verifiedAt: new Date().toISOString()
  };

  res.json({ success: true, order });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

const port = process.env.PORT || 8000;
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
