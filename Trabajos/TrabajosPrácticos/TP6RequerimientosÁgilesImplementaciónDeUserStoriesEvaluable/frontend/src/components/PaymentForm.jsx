import React, { useState } from 'react';
import '../styles/styles.css';
import { Card, Button, Alert } from 'react-bootstrap';
import CardImage from '../assets/images/tarjeta.png';
import AlContadoEntregaImage from '../assets/images/contado contra entrega.png';
import AlContadoRetirarImage from '../assets/images/contado al retirar.png';
import Notification from './Notification';
import mockTarjetas from '../services/cardService.js';

// Función de validación de tarjeta
const validarTarjeta = (numeroTarjeta) => {
  const regexTarjeta = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
  return regexTarjeta.test(numeroTarjeta.replace(/\s+/g, '')); // Elimina espacios y verifica
};

const PaymentForm = ({ paymentMethods, onPayment, transporterInfo }) => {
  const imageMethods = {
    'Tarjeta': CardImage,
    'Contado contra entrega': AlContadoEntregaImage,
    'Contado al retirar': AlContadoRetirarImage
  };

  const tipoDocumentos = [
    'DNI',
    'Pasaporte',
    'CUIT',
    'LE',
    'LC'
  ];

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentData, setPaymentData] = useState({
    nombre: '',
    numeroTarjeta: '',
    pin: '',
    numeroDocumento: '',
    tipoDocumento: ''
  });
  const [status, setStatus] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleCardClick = (method) => {
    if (isConfirmed) return;
    setSelectedMethod(method);
    setStatus(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validarTarjetaMockeada = (numeroTarjeta) => {
    const tarjetaEncontrada = mockTarjetas.find(tarjeta => tarjeta.numeroTarjeta === numeroTarjeta);
    if (!tarjetaEncontrada) {
      return { esValida: false, mensaje: 'Tarjeta no encontrada.' };
    }
  
    if (tarjetaEncontrada.estado !== 'vigente') {
      return { esValida: false, mensaje: 'Tarjeta no válida.' };
    }
  
    if (tarjetaEncontrada.saldo === 0) {
      return { esValida: false, mensaje: 'Saldo insuficiente.' };
    }
  
    return { esValida: true, mensaje: 'Tarjeta válida.' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isConfirmed) return;
  
    let formErrors = {};
  
    if (!selectedMethod) {
      setErrors({ metodoPago: 'Debes seleccionar un método de pago.' });
      return;
    }
  
    if (selectedMethod === 'Tarjeta') {
      const { nombre, numeroTarjeta, pin, numeroDocumento, tipoDocumento } = paymentData;
  
      if (!nombre) formErrors.nombre = 'El nombre es requerido.';
      if (!numeroTarjeta) formErrors.numeroTarjeta = 'El número de tarjeta es requerido.';
      if (!pin) formErrors.pin = 'El PIN es requerido.';
      if (!numeroDocumento) formErrors.numeroDocumento = 'El número de documento es requerido.';
      if (!tipoDocumento) formErrors.tipoDocumento = 'El tipo de documento es requerido.';
  
      const validacionMock = validarTarjetaMockeada(numeroTarjeta);
      if (!validacionMock.esValida) {
        formErrors.numeroTarjeta = validacionMock.mensaje;
      }
      if (!validarTarjeta(numeroTarjeta)) {
        formErrors.numeroTarjeta = 'Número de tarjeta inválido.';
      }
    }
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setStatus('error');
      setNotificationVisible(true);
      return;
    }
  
    try {
      if (selectedMethod === 'Tarjeta') {
        setStatus('success');
        setReceiptNumber(Math.floor(Math.random() * 1000) + 1);
      } else {
        setReceiptNumber(null);
      }
  
      fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: `${transporterInfo}`,
          subject: 'Confirmación de Cotización',
          text: `Tu cotización ha sido confirmada. Método de pago: ${selectedMethod}${receiptNumber ? `. Número de recibo: ${receiptNumber}` : ''}.`,
        }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
  
      onPayment(paymentData, receiptNumber);
      setIsConfirmed(true);
      setNotificationVisible(true);
    } catch (error) {
      console.error('Error en la solicitud fetch:', error);
      setStatus('error');
      setNotificationVisible(true);
    }
  };
  

  const handleNotificationClose = () => {
    setNotificationVisible(false);
  };

  return (
    <div className="container payment-form">
      <h2 style={{ color: '#0077B6' }}>Forma de Pago</h2>
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ padding: '2rem' }}>
          {paymentMethods.map((method) => (
            <div className="col-md-4 mb-4" key={method}>
              <Card
                className={`cursor-pointer ${selectedMethod === method ? 'border-primary' : 'border-secondary'}`}
                onClick={() => handleCardClick(method)}
                style={{ borderColor: selectedMethod === method ? '#0077B6' : '#CAF0F8' }}
              >
                <Card.Img 
                  variant="top" 
                  src={imageMethods[method]} 
                  alt={method}
                  style={{ height: '200px', objectFit: 'contain' }} 
                />
                <Card.Body>
                  <Card.Title style={{ color: '#0077B6' }}>{method}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {selectedMethod === 'Tarjeta' && (
          <div className="payment-fields" style={{ backgroundColor: '#EAF6FF', padding: '1rem', borderRadius: '5px' }}>
            <div className="mb-2">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre Completo" 
                value={paymentData.nombre}
                onChange={handleInputChange}
                className="form-control"
                style={{ borderColor: '#0077B6' }}
              />
              {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
            </div>
            <div className="mb-2">
              <input
                type="text"
                name="numeroTarjeta"
                placeholder="Número de Tarjeta"
                value={paymentData.numeroTarjeta}
                onChange={handleInputChange}
                className="form-control"
                style={{ borderColor: '#0077B6' }}
              />
              {errors.numeroTarjeta && <small className="text-danger">{errors.numeroTarjeta}</small>}
            </div>
            <div className="mb-2">
              <input
                type="password"
                name="pin"
                placeholder="PIN"
                value={paymentData.pin}
                onChange={handleInputChange}
                className="form-control"
                style={{ borderColor: '#0077B6' }}
              />
              {errors.pin && <small className="text-danger">{errors.pin}</small>}
            </div>
            <div className="mb-2">
              <select
                name="tipoDocumento"
                value={paymentData.tipoDocumento}
                onChange={handleInputChange}
                className="form-control"
                style={{ borderColor: '#0077B6' }}
              >
                <option value="">Seleccione un tipo de documento</option>
                {tipoDocumentos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              {errors.tipoDocumento && <small className="text-danger">{errors.tipoDocumento}</small>}
            </div>
            <div className="mb-2">
              <input
                type="text"
                name="numeroDocumento"
                placeholder="Número de Documento"
                value={paymentData.numeroDocumento}
                onChange={handleInputChange}
                className="form-control"
                style={{ borderColor: '#0077B6' }}
              />
              {errors.numeroDocumento && <small className="text-danger">{errors.numeroDocumento}</small>}
            </div>
          </div>
        )}

      <Button
        type="submit"
        variant="primary"
        style={{
          backgroundColor: isConfirmed ? '#B0B0B0' : '#0077B6', // Gris si está deshabilitado, azul si no lo está
          borderColor: isConfirmed ? '#B0B0B0' : '#0077B6',
          marginTop: '1rem',
          cursor: isConfirmed ? 'not-allowed' : 'pointer', // Cambia el cursor si está deshabilitado
        }}
        disabled={isConfirmed}
      >
        {isConfirmed ? 'Confirmado' : 'Confirmar'}
      </Button>
      </form>

      {notificationVisible && (
        <Notification 
          status={status} 
          receiptNumber={receiptNumber} 
          onClose={handleNotificationClose}
        />
      )}
      {errors.metodoPago && (
      <Alert variant="danger" className="mt-3">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {errors.metodoPago}
      </Alert>
      )}
    </div>
  );
};

export default PaymentForm;

