import React, { useState } from 'react';
import '../styles/styles.css';
import { Card, Button, Alert } from 'react-bootstrap';
import CardImage from '../assets/images/tarjeta.png';
import AlContadoEntregaImage from '../assets/images/contado contra entrega.png';
import AlContadoRetirarImage from '../assets/images/contado al retirar.png';
import Notification from './Notification';
import mockTarjetas from '../services/cardService.js';
import Confirmation from './Confirmation.jsx';

const validarTarjeta = (numeroTarjeta) => {
  const regexTarjeta = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
  return regexTarjeta.test(numeroTarjeta.replace(/\s+/g, ''));
};

const PaymentForm = ({ paymentMethods, onPayment, transporterInfo,setSelectedPaymentMethod,selectedPaymentMethod}) => {
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

  // const [selectedPaymentMethod, setselectedPaymentMethod] = useState(null);
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
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [isClickedOtherPayment, setIsClickedOtherPayment] = useState(false);
  const handleCardClick = (method) => {
    if (isConfirmed) setIsClickedOtherPayment(true);
    setSelectedPaymentMethod(method);
    setStatus(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    const filteredValue = name === 'pin' ? value.replace(/\D/g, '') : value;
  
    const finalValue = name === 'pin' && filteredValue.length > 3
      ? filteredValue.slice(0, 3) 
      : filteredValue;
  
    setPaymentData(prevData => ({
      ...prevData,
      [name]: finalValue
    }));
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
  
    if (!selectedPaymentMethod) {
      setErrors({ metodoPago: 'Debes seleccionar un método de pago.' });
      return;
    }
  
    if (selectedPaymentMethod === 'Tarjeta') {
      const { nombre, numeroTarjeta, pin, numeroDocumento, tipoDocumento } = paymentData;
  
      if (!nombre) formErrors.nombre = 'El nombre es requerido.';
      if (!numeroTarjeta) formErrors.numeroTarjeta = 'El número de tarjeta es requerido.';
      if (!pin) formErrors.pin = 'El PIN es requerido.';
      if (pin.length !== 3) formErrors.pin = 'El PIN debe ser de exactamente 3 dígitos.';
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
      if (selectedPaymentMethod === 'Tarjeta') {
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
          text: `Tu cotización ha sido confirmada. Método de pago: ${selectedPaymentMethod}${receiptNumber ? `. Número de recibo: ${receiptNumber}` : ''}.`,
        }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
  
      onPayment(paymentData, receiptNumber);
      setSelectedPaymentMethod(selectedPaymentMethod);
      setIsConfirmed(true);
      setNotificationVisible(true);
      setShowModal(true);

    } catch (error) {
      console.error('Error en la solicitud fetch:', error);
      setStatus('error');
      setNotificationVisible(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleNotificationClose = () => {
    setNotificationVisible(false);
  };

  return (
    <div className='container payment-form'>
      <h2 style={{ color: '#0077B6' }}>Forma de Pago</h2>
      <form onSubmit={handleSubmit}>
        <div className='row' style={{ padding: '2rem' }}>
          {paymentMethods.map((method) => (
            <div className='col-md-4 mb-4' key={method}>
              <Card
                className={`cursor-pointer ${selectedPaymentMethod === method ? 'border-primary' : 'border-secondary'} card`}
                onClick={() => handleCardClick(method)}
                style={{ borderColor: selectedPaymentMethod === method ? '#0077B6' : '#CAF0F8', borderWidth: selectedPaymentMethod === method ? '3px' : '0px'}}
              >
                <Card.Img 
                  variant='top' 
                  src={imageMethods[method]}  
                  alt={method}
                  className='card'
                  style={{ height: '200px', objectFit: 'contain' }} 
                />
                <Card.Body>
                  <Card.Title style={{ color: '#0077B6' }}>{method}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {selectedPaymentMethod === 'Tarjeta' && (
          <div className='' style={{ backgroundColor: '#EAF6FF', padding: '1rem', borderRadius: '5px' }}>
            <div className='mb-2'>
              <input
                type='text'
                name='nombre'
                placeholder='Nombre Completo' 
                value={paymentData.nombre}
                onChange={handleInputChange}
                className='form-control '
                style={{ borderColor: '#0077B6' }}
              />
              {errors.nombre && <small className='text-danger'>{errors.nombre}</small>}
            </div>
            <div className='mb-2'>
            <input
                type='text'
                name='numeroTarjeta'
                placeholder='Numero de tarjeta' 
                value={paymentData.numeroTarjeta}
                onChange={(e) => {
                  const filteredInput = e.target.value.replace(/\D/g, ''); 
                  setPaymentData({ ...paymentData, numeroTarjeta: filteredInput });
                }}
                className='form-control '
                style={{ borderColor: '#0077B6' }}
              />
              {errors.numeroTarjeta && <small className='text-danger'>{errors.numeroTarjeta}</small>}
            </div>

            <div className='mb-2'>
              <input
                type='password'
                name='pin'
                placeholder='PIN'
                value={paymentData.pin}
                onChange={handleInputChange}
                className='form-control'
                style={{ borderColor: '#0077B6' }}
                maxLength={3}
                
              />
              {errors.pin && <small className='text-danger'>{errors.pin}</small>}
            </div>
            <div className='mb-2'>
              <select
                name='tipoDocumento'
                value={paymentData.tipoDocumento}
                onChange={handleInputChange}
                className='form-control payment-fields'
                style={{ borderColor: '#0077B6' }}
              >
                <option value=''>Seleccione un tipo de documento</option>
                {tipoDocumentos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              {errors.tipoDocumento && <small className='text-danger'>{errors.tipoDocumento}</small>}
            </div>
            <div className='mb-2'>
              <input
                type='text'
                name='numeroDocumento'
                placeholder='Número de Documento'
                value={paymentData.numeroDocumento}
                onChange={handleInputChange}
                className='form-control '
                style={{ borderColor: '#0077B6' }}
              />
              {errors.numeroDocumento && <small className='text-danger'>{errors.numeroDocumento}</small>}
            </div>
          </div>
        )}

      <Button
        type='submit'
        variant='primary'
        style={{
          backgroundColor: isConfirmed ? '#B0B0B0' : '#0077B6',
          borderColor: isConfirmed ? '#B0B0B0' : '#0077B6',
          marginTop: '1rem',
          cursor: isConfirmed ? 'not-allowed' : 'pointer',
        }}
        disabled={isConfirmed}
      >
        {isConfirmed ? 'Confirmado' : 'Confirmar'}
      </Button>
      
      </form>

      {notificationVisible && selectedPaymentMethod &&(
        <Notification 
          status={status} 
          paymentMethod={selectedPaymentMethod} 
          onClose={handleNotificationClose}
        />
      )}
      
      {errors.metodoPago && (
      <Alert variant='danger' className='mt-3'>
        <i className='bi bi-exclamation-triangle-fill me-2'></i>
        {errors.metodoPago}
      </Alert>
      )}
      <Confirmation show={showModal} handleClose={handleCloseModal} receiptNumber={receiptNumber} />
      {isClickedOtherPayment && (
        <Alert variant='danger' className='mt-3' >
          {'La cotizacion ya ha sido confirmada.'}
        </Alert>
      )}
    </div>
    
  );
};

export default PaymentForm;

