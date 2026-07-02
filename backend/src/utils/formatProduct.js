const formatProduct = (product) => ({
  ...product,
  price: Number(product.price),
});

const formatProducts = (products) => products.map(formatProduct);

export { formatProduct, formatProducts };
