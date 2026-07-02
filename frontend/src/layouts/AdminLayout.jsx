import { NavLink, Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import adminNavLinks from '../utils/adminNavLinks';

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <div className="border-b border-gray-200 bg-white md:hidden">
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {adminNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
