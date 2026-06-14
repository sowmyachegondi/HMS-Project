import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  UserPlusIcon,
  BuildingOffice2Icon,
  ClockIcon,
  CakeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  MoonIcon,
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/admin/application', label: 'Application Details', icon: DocumentTextIcon },
  { to: '/admin/registration', label: 'Registration', icon: UserPlusIcon },
  { to: '/admin/rooms', label: 'Room Details', icon: HomeIcon },
  { to: '/admin/room-allotment', label: 'Room Allotment', icon: BuildingOffice2Icon },
  { to: '/admin/outing-requests', label: 'Outing Requests', icon: ArrowRightOnRectangleIcon },
  { to: '/admin/outing-reports', label: 'Outing Reports', icon: ClockIcon },
  { to: '/admin/mess-menu', label: 'Mess Timetable', icon: CakeIcon },
  { to: '/admin/mess-bill', label: 'Mess Bill Details', icon: CurrencyDollarIcon },
  { to: '/admin/workers', label: 'Workers Details', icon: UserGroupIcon },
  { to: '/admin/doctor', label: 'Doctor Availability', icon: HeartIcon },
  { to: '/admin/complaints', label: 'Complaints', icon: ChatBubbleLeftRightIcon },
];

const titleMap = {
  '/admin/application': 'Application Details',
  '/admin/registration': 'Registration',
  '/admin/rooms': 'Room Details',
  '/admin/room-allotment': 'Room Allotment',
  '/admin/outing-requests': 'Outing Requests',
  '/admin/outing-reports': 'Outing Reports',
  '/admin/mess-bill': 'Mess Bill Details',
  '/admin/mess-menu': 'Mess Timetable',
  '/admin/doctor': 'Doctor Availability',
  '/admin/workers': 'Workers Details',
  '/admin/complaints': 'Complaints',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = titleMap[currentPath] || 'Application Details';

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar - dark blue to teal gradient, logo in rounded square, pill active state */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 flex flex-col bg-gradient-to-b from-[#1e3a5f] via-[#1d4ed8] to-[#0ea5e9] text-white transition-all duration-300 overflow-hidden shadow-xl`}
      >
        <div className="p-5 border-b border-white/10 flex items-center gap-3 min-w-[16rem]">
          <div className="w-12 h-12 rounded-xl bg-blue-400/90 flex items-center justify-center flex-shrink-0 shadow-inner">
            <HomeIcon className="w-7 h-7 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-lg tracking-tight text-white">HMS</h1>
            <p className="text-xs text-white/90">Hostel System</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 min-w-[16rem]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to + label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-400/90 text-white shadow-md' : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0 opacity-90" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 min-w-[16rem]">
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Hostel Management System</h2>
              <p className="text-sm text-slate-500 mt-0.5">{pageTitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Dark mode">
                <MoonIcon className="w-5 h-5" />
              </button>
              <button type="button" className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Notifications">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-800">Admin User</p>
                    <p className="text-xs text-slate-500">Admin</p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </button>
                {userDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdown(false)} />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                      <p className="px-4 py-2 text-sm text-slate-600 border-b truncate">{user?.email}</p>
                      <button
                        onClick={() => { setUserDropdown(false); logout(); navigate('/login'); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Reopen sidebar when closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-[#2563eb] text-white rounded-r-lg shadow-lg flex items-center justify-center"
          aria-label="Open sidebar"
        >
          <ChevronDownIcon className="w-5 h-5 rotate-[-90deg]" />
        </button>
      )}
    </div>
  );
}
