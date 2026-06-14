import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
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
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/student/application', label: 'Application Details', icon: DocumentTextIcon },
  { to: '/student/rooms', label: 'Room Details', icon: HomeIcon },
  { to: '/student/room-allotment', label: 'Room Allotment', icon: BuildingOffice2Icon },
  { to: '/student/outing-request', label: 'Outing Request', icon: ArrowRightOnRectangleIcon },
  { to: '/student/outing-reports', label: 'Outing Reports', icon: ClockIcon },
  { to: '/student/mess-bill', label: 'Mess Bill', icon: CurrencyDollarIcon },
  { to: '/student/mess-menu', label: 'Mess Menu', icon: CakeIcon },
  { to: '/student/doctor', label: "Doctor's Availability", icon: HeartIcon },
  { to: '/student/workers', label: "Worker's Details", icon: UserGroupIcon },
  { to: '/student/complaints', label: 'Complaints', icon: ChatBubbleLeftRightIcon },
  { to: '/student/change-password', label: 'Change Password', icon: LockClosedIcon },
];

const titleMap = {
  '/student/application': 'Application Details',
  '/student/rooms': 'Room Details',
  '/student/room-allotment': 'Room Allotment',
  '/student/outing-request': 'Outing Request',
  '/student/outing-reports': 'Outing Reports',
  '/student/mess-bill': 'Mess Bill',
  '/student/mess-menu': 'Mess Menu',
  '/student/doctor': "Doctor's Availability",
  '/student/workers': "Worker's Details",
  '/student/complaints': 'Complaints',
  '/student/change-password': 'Change Password',
};

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = titleMap[currentPath] || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-100">
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
              key={to}
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

      <div className="flex-1 flex flex-col min-w-0">
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
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {(user?.full_name || user?.regd_no || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-800">{user?.full_name || 'Student'}</p>
                    <p className="text-xs text-slate-500">{user?.regd_no || 'Student'}</p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </button>
                {userDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdown(false)} />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                      <p className="px-4 py-2 text-sm text-slate-600 border-b truncate">{user?.regd_no}</p>
                      <button
                        onClick={() => { setUserDropdown(false); navigate('/student/change-password'); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LockClosedIcon className="w-4 h-4" />
                        Change Password
                      </button>
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

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

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
