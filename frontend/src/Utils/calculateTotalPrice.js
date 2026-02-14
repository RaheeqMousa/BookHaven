export const calculateTotalPrice = (items = []) => {
  return items.reduce((total, item) => {
    const price = item.book.saleInfo?.price || 0;
    const quantity = item.book.quantity || 1;
    return total + price * quantity;
  }, 0);
};
