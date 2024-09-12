// Importa el paquete MercadoPago si usas algún módulo

// Esta función crea una preferencia en el backend y devuelve el ID de la preferencia
export const createPreference = async (data) => {
    try {
      const response = await fetch('/crear-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      throw error;
    }
  };
  
  // Esta función inicializa MercadoPago y abre el checkout
  export const openCheckout = (preferenceId) => {
    const mp = new window.MercadoPago('APP_USR-59626067-7a8f-4df4-943f-ba46c2d238d4', {
      locale: 'es-AR'
    });
  
    mp.checkout({
      preference: {
        id: preferenceId
      },
      autoOpen: true
    });
  };
  