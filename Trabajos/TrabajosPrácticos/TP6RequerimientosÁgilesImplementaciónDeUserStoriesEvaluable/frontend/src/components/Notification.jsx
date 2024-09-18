import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import '../styles/styles.css';

const Notification = ({ status, paymentMethod, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status) {
      setShow(true);
    }
  }, [status]);

  const message = status === 'success'
    ? `Se ha informado al transportista el estado de la cotización.Metodo de Pago :${paymentMethod}`
    : 'Error en el procesamiento del pago.';

  return (
    <div className='notification-container'>
      <Toast
        className={`bg-${status === 'success' ? 'success' : 'danger'} text-white`}
        show={show}
        autohide
        onClose={onClose}
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Notification;