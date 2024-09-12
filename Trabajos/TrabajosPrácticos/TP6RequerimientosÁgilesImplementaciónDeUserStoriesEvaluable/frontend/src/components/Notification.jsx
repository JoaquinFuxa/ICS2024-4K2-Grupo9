import React, { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';
import '../styles/styles.css';

const Notification = ({ status, receiptNumber }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const message = status === 'success'
    ? receiptNumber 
      ? `Pago procesado correctamente. Número de comprobante: ${receiptNumber}` 
      : 'Pago procesado correctamente.'
    : 'Error en el procesamiento del pago.';

  return (
    <div className="notification-container">
      <Toast className={`bg-${status === 'success' ? 'success' : 'danger'} text-white`} show={show} autohide>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Notification;
