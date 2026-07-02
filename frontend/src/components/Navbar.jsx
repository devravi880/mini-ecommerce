import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

function Navbar() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass =
    'block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-primary';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-primary" onClick={closeMenu}>
          ShopSphere
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary">
            Products
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/wishlist" className="relative text-sm font-medium text-gray-600 hover:text-primary">
                Wishlist
                {wishlistCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-sm font-medium text-gray-600 hover:text-primary">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-primary">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-primary">
                {user?.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg border border-gray-300 p-2 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 bg-gray-700" />
          <span className="mt-1 block h-0.5 w-5 bg-gray-700" />
          <span className="mt-1 block h-0.5 w-5 bg-gray-700" />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="space-y-1">
            <Link to="/products" className={navLinkClass} onClick={closeMenu}>
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/wishlist" className={navLinkClass} onClick={closeMenu}>
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link to="/cart" className={navLinkClass} onClick={closeMenu}>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link to="/orders" className={navLinkClass} onClick={closeMenu}>
                  Orders
                </Link>
                <Link to="/profile" className={navLinkClass} onClick={closeMenu}>
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className={navLinkClass} onClick={closeMenu}>
                    Admin Panel
                  </Link>
                )}
                <button type="button" className={`${navLinkClass} w-full text-left`} onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className={navLinkClass} onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className={navLinkClass} onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
