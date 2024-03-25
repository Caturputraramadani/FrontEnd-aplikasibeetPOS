const combineAllSales = (data) => {
  if (!data.length) {
    return [0];
  }

  return data.map((item) => item.Payment.payment_total);
};

module.exports = combineAllSales;
