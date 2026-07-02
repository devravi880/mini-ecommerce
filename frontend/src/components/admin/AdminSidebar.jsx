import { NavLink } from 'react-router-dom';
import adminNavLinks from '../../utils/adminNavLinks';

function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
        <p className="text-xs text-gray-500">ShopSphere Management</p>
      </div>

      <nav className="space-y-1 p-4">
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
