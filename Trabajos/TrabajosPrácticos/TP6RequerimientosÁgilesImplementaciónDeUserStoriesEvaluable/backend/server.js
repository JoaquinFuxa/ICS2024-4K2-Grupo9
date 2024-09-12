const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

app.post('/crear-preferencia', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'Producto de ejemplo',
          unit_price: 100,
          quantity: 1,
        },
      ],
      back_urls: {
        success: 'https://www.your-site/success',
        failure: 'https://www.your-site/failure',
        pending: 'https://www.your-site/pending',
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
