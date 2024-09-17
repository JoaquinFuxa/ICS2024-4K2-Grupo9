import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Confirmation = ({ show, handleClose, receiptNumber }) => {
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      className='modal-cotizacion'
    >
      <Modal.Header 
        closeButton 
        className='modal-header-custom'
      >
        <Modal.Title className='modal-title-custom'>
          Confirmación de Pago
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tu cotización ha sido confirmada.</p>
        {receiptNumber && (
          <p>
            <strong>Número de Pago:</strong> {receiptNumber}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer className='modal-footer-custom'>
        <Button 
          variant='secondary' 
          onClick={handleClose} 
          className='btn-custom-close'
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Confirmation;
