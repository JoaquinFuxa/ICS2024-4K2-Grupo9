import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/styles.css'; 

const Confirmation = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>¡Cotización Confirmada!</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      La cotización ha sido confirmada.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);

export default Confirmation;