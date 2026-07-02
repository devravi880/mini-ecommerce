import { Link } from 'react-router-dom';
import getImageUrl from '../utils/getImageUrl';

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-primary">{product.category.name}</p>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
          <span className="text-xs text-gray-500">{product.stock} in stock</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
