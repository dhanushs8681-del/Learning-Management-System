import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  User,
  CreditCard,
  Menu,
  X,
  Search,
  BookOpen,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  // Role-aware primary navigation
  const getLinks = () => {
    const base = [{ to: '/', label: 'Home', icon: GraduationCap }];
    if (!user) {
      // Visitors can explore tutors before signing up
      return [...base, { to: '/tutors', label: 'Find Tutors', icon: Search }];
    }
    if (user.role === 'student') {
      return [
        ...base,
        { to: '/tutors', label: 'Find Tutors', icon: Search },
        { to: '/student/dashboard', label: 'My Lessons', icon: BookOpen },
      ];
    }
    if (user.role === 'tutor') {
      return [
        ...base,
        { to: '/tutor/dashboard', label: 'Tutor Hub', icon: BookOpen },
      ];
    }
    if (user.role === 'admin') {
      return [
        ...base,
        { to: '/admin', label: 'Admin Console', icon: Shield },
      ];
    }
    return base;
  };

  const links = getLinks();

  const roleBadge = {
    student: { label: 'Student', cls: 'border-brand-400/30 text-brand-300 bg-brand-500/10' },
    tutor: { label: 'Tutor', cls: 'border-purple-400/30 text-purple-300 bg-purple-500/10' },
    admin: { label: 'Admin', cls: 'border-emerald-400/30 text-emerald-300 bg-emerald-500/10' },
  };

  return (
    <header className="sticky top-0 z-40">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 grid place-items-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight">EduMeet</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm transition ${
                    isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {roleBadge[user.role] && (
                  <span className={`chip border ${roleBadge[user.role].cls}`}>
                    {roleBadge[user.role].label}
                  </span>
                )}
                <Link to="/profile" className="btn-ghost text-sm">
                  <User className="w-4 h-4" /> {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="btn-outline text-sm">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg bg-white/5" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden border-t border-white/5 px-4 py-3 space-y-2"
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/80 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {roleBadge[user.role] && (
                  <div className="px-3 py-2">
                    <span className={`chip border ${roleBadge[user.role].cls}`}>
                      {roleBadge[user.role].label} account
                    </span>
                  </div>
                )}
                <Link to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:bg-white/5">Profile</Link>
                <Link to="/payments" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:bg-white/5">Payments</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-white/80 hover:bg-white/5">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:bg-white/5">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-purple-500 text-white">Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}
