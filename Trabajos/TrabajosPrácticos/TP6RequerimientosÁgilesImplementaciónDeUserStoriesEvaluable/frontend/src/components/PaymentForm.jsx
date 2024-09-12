import React, { useState } from 'react';
import '../styles/styles.css';
import { Card, Button } from 'react-bootstrap';
import CardImage from '../assets/images/tarjeta.png';
import AlContadoEntregaImage from '../assets/images/contado contra entrega.png';
import AlContadoRetirarImage from '../assets/images/contado al retirar.png';
import Notification from './Notification';
import { createPreference, openCheckout } from '../services/mercadoPagoService';

const PaymentForm = ({ paymentMethods, onPayment }) => {
  const imageMethods = {
    'Tarjeta': CardImage,
    'Contado contra entrega': AlContadoEntregaImage,
    'Contado al retirar': AlContadoRetirarImage
  };

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentData, setPaymentData] = useState({
    nombre: '',
    direccion: ''
  });
  const [status, setStatus] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState(null);

  const handleCardClick = (method) => {
    setSelectedMethod(method);
    setStatus(null);
  };

  const handleInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedMethod === 'Tarjeta' && !paymentData.nombre) {
      setStatus('error');
      return;
    }

    if (selectedMethod === 'Tarjeta') {
      try {
        const preferenceId = await createPreference({
          nombre: paymentData.nombre,
          monto: 100 
        });

        openCheckout(preferenceId);

        setStatus('success');
        setReceiptNumber('123456789');
        onPayment(paymentData);

      } catch (error) {
        setStatus('error');
      }
    } else {
      setReceiptNumber(null);
      onPayment(paymentData);
      setStatus('success');
    }
  };

  return (
    <div className="container payment-form">
      <h2>Forma de Pago</h2>
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ padding: '2rem' }}>
          {paymentMethods.map((method) => (
            <div className="col-md-4 mb-4" key={method}>
              <Card
                className={`cursor-pointer ${selectedMethod === method ? 'border-primary' : 'border-secondary'}`}
                onClick={() => handleCardClick(method)}
              >
                <Card.Img 
                  variant="top" 
                  src={imageMethods[method]} 
                  alt={method}
                  style={{ height: '200px', objectFit: 'contain' }} 
                />
                <Card.Body>
                  <Card.Title>{method}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {selectedMethod === 'Tarjeta' && (
          <div className="payment-fields">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={paymentData.nombre}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        )}

        <Button type="submit" variant="primary" disabled={!selectedMethod}>
          Confirmar
        </Button>
      </form>

      {status && <Notification status={status} receiptNumber={receiptNumber} />}
    </div>
  );
};

export default PaymentForm;
