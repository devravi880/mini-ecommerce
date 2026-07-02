import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AdminHeader({ title }) {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          View Store
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
