const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Cambia esto por la URL de tu frontend
  methods: ['GET', 'POST'],  // Métodos permitidos
  allowedHeaders: ['Content-Type'],  // Headers permitidos
}));

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de envío de correos.');
});
// Ruta para enviar el correo
app.post('/send-email', async (req, res) => {
  const { recipientEmail, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dadordecarga1@gmail.com',  
      pass: 'qogd ebly cvdz nmqr',  // Contraseña de aplicaciones de Google
    },
  });

  const mailOptions = {
    from: 'dadordecarga1@gmail.com',
    to: recipientEmail,  
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo', error });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
