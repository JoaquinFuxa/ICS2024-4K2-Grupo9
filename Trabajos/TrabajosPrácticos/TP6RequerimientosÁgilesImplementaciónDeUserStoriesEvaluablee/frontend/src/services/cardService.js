const mockTarjetas = [
  {
    numeroTarjeta: '4111111111111111', // Visa válida
    tipo: 'credito',
    saldo: 1000, // Vigente con saldo
    estado: 'vigente'
  },
  {
    numeroTarjeta: '5500000000000004', // MasterCard válida
    tipo: 'credito',
    saldo: 0, // Vigente sin saldo
    estado: 'vigente'
  },
  {
    numeroTarjeta: '378282246310005', // Amex válida
    tipo: 'credito',
    saldo: 500, // Vigente con saldo
    estado: 'vigente'
  },
  {
    numeroTarjeta: '4111111111111112', // Número inválido
    tipo: 'credito',
    saldo: 0,
    estado: 'no_valida'
  },
  {
    numeroTarjeta: '6011111111111117', // Discover válida pero sin saldo
    tipo: 'debito',
    saldo: 0, // Vigente sin saldo
    estado: 'vigente'
  },
  {
    numeroTarjeta: '3530111333300000', // JCB válida pero datos no válidos
    tipo: 'debito',
    saldo: 100, // Vigente con saldo
    estado: 'no_valida'
  }
];

export default mockTarjetas;
