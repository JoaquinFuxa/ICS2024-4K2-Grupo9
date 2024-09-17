import React, { useState, useEffect } from 'react';
import QuoteDetails from './components/QuoteDetails';
import PaymentForm from './components/PaymentForm';
import Notification from './components/Notification';
import Confirmation from './components/Confirmation';
import { getQuoteDetails } from './services/quoteService';

const App = () => {
  const [quote, setQuote] = useState(null); // Iniciar vacío
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // Estado para notificación
  const [confirmationVisible, setConfirmationVisible] = useState(false); // Estado para modal

  useEffect(() => {
    const quoteData = getQuoteDetails();
    setQuote(quoteData);
  }, []);

  const [receiptNumber, setReceiptNumber] = useState(null); // Estado para el número de recibo

  const handlePayment = (paymentData, receiptNumber) => {
    if(receiptNumber){
      setReceiptNumber(receiptNumber); // Almacenar el número de recibo
    }
    setSelectedPaymentMethod();
    setConfirmationVisible(true);
    setPaymentStatus('success');  // Mostrar notificación de éxito
  };
  

  const handleCloseConfirmation = () => {
    setConfirmationVisible(false);  // Ocultar modal de confirmación
  };

  if (!quote) return <div>Loading...</div>; 

  return (
    <div className='container'>
      <QuoteDetails quote={quote} />
      <PaymentForm 
        paymentMethods={quote.formasPago} 
        onPayment={handlePayment} 
        transporterInfo={quote.email}
        setSelectedPaymentMethod={setSelectedPaymentMethod} 
        selectedPaymentMethod={selectedPaymentMethod}/>
    {paymentStatus && <Notification status={paymentStatus} paymentMethod={selectedPaymentMethod} />}
    </div>
  );
};

export default App;
