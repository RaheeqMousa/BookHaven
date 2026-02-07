export const calculateTotalPrice = (items = []) => {
  return items.reduce((total, item) => {
    const price = item.saleInfo?.price || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);
};
