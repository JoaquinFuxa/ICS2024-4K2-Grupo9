import React, { useState } from 'react';
import QuoteDetails from './components/QuoteDetails';
import PaymentForm from './components/PaymentForm';
import Notification from './components/Notification';
import Confirmation from './components/Confirmation';

const App = () => { 
  const [quote, setQuote] = useState({
    transportista: "Transportista A",
    calificacion: 4,
    fechaRetiro: "15-09-2024",
    fechaEntrega: "20-09-2024",
    importe: 100,
    formasPago: ["Tarjeta", "Contado al retirar", "Contado contra entrega"],
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // Estado para notificación
  const [confirmationVisible, setConfirmationVisible] = useState(false); // Estado para modal

  const handlePayment = (paymentData) => {
    setPaymentStatus('success');  // Mostrar notificación de éxito
    setConfirmationVisible(true); // Mostrar modal de confirmación
  };

  const handleCloseConfirmation = () => {
    setConfirmationVisible(false);  // Ocultar modal de confirmación
  };

  return (
    <div className='container'>
      <QuoteDetails quote={quote} />
      <PaymentForm 
        paymentMethods={quote.formasPago} 
        onPayment={handlePayment} 
        setSelectedPaymentMethod={setSelectedPaymentMethod} 
      />
      {paymentStatus && <Notification status={paymentStatus} receiptNumber={123} />}
      <Confirmation 
        show={confirmationVisible} 
        handleClose={handleCloseConfirmation} 
      />
    </div>
  );
};

export default App;
