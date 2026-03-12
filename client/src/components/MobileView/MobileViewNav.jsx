// components/MobileView.jsx
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import { X, LogIn } from 'lucide-react';

import ActionButton from '../ActionButton/ActionButton';
import { useLogout } from '../../hooks/auth/auth.hooks';
import { useAuthContext } from '../../contexts/AuthContext/AuthContext';

export default function MobileViewNav({ isOpen, toggleMenu }) {

  const {logout, loading: logoutLoading} = useLogout();

  const {user} = useAuthContext();

  if (!isOpen) return null;

  const handleLogout = async () => {
    console.log("Handle logout called.")
    const res =await logout();
    if( res.success){
      toast.success(res.message, {duration: 800});
    } else {
      toast.error(res.message, {duration: 800});
    }
  }

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Background with theme color and box structure */}
      <div className="absolute inset-0 bg-[var(--bg-canvas)]">

        {/* Box grid structure  */}
        <div className="absolute inset-0">
          {/* Outer frame border */}
          <div className="absolute inset-6 border border-[var(--border-subtle)]" />
          
          {/*VERTICAL LINES CREATING COLUMNS STARTS HERE */}
          <div className="absolute inset-6 flex justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-px h-full bg-[var(--border-subtle)]" />
            ))}
          </div>
          {/*VERTICAL LINES CREATING COLUMNS ENDS HERE */}
          
          {/* Horizontal lines - creating rows */}
          <div className="absolute inset-6 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-px w-full bg-[var(--border-subtle)]" />
            ))}
          </div>

          {/* Additional smaller squares for detail */}
          <div className="absolute inset-12 opacity-30">
            <div className="grid grid-cols-3 h-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-r border-[var(--border-subtle)] last:border-r-0" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-[var(--border-subtle)] last:border-b-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-canvas)]/50 to-[var(--bg-canvas)] pointer-events-none" />
      </div>

      {/* Mobile Menu Content */}
      <div className="relative h-full overflow-y-auto p-6 z-10">
        {/* Close button and VIDEOSTACK headline - sitting on border */}
        <div className="relative mb-12">

          <div className="flex items-center justify-between border-b border-(--border-subtle) pb-4">
            {/* BUTTON FOR X STARTS HERE */}
            <button
              onClick={toggleMenu}
              className="text-[var(--text-secondary)] hover:text-white transition-colors bg-[var(--bg-canvas)] px-2 -ml-2 relative z-10"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {/* BUTTON FOR X ENDS HERE */}

            {/* HEADING STARTS HERE */}
            <Link to="/">
              <h2 className="text-xl tracking-tight font-light text-(--text-secondary) absolute left-1/2 transform -translate-x-1/2 bg-(--bg-canvas) px-4">
              VIDEOSTACK
            </h2>
            </Link>
            
            {/* HEADING ENDS HERE */}

            <div className="w-5" /> {/* Spacer */}
          </div>

          {/* Small border continuation lines */}
          <div className="absolute left-0 bottom-0 w-2 h-px bg-[var(--border-subtle)]" />
          <div className="absolute right-0 bottom-0 w-2 h-px bg-[var(--border-subtle)]" />

        </div>

        {/* Menu items with border integration */}
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100%-160px)]">
          {/* Top border line with label */}
          <div className="absolute top-0 left-6 right-6 flex items-center justify-center">
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)] px-4 bg-[var(--bg-canvas)]">
              NAVIGATION
            </span>
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          </div>

          {
            user ? 
            (
              <div className="w-full space-y-6 py-12">
                {/* Each menu item sits on a border line */}
                {[
                  { to: "/", label: "HOME" },
                  { to: "/manage", label: "MANAGE" },
                  { to: "/upload", label: "UPLOAD" },
                  { to: "/profile", label: "PROFILE" }
                ].map((item) => (
                  <div key={item.to} className="relative flex items-center justify-center group">
                    {/* Border line through the item */}
                    <div className="absolute left-0 right-0 h-px bg-[var(--border-subtle)]" />
                    
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => `
                        relative z-10
                        text-[clamp(1.25rem,4vw,1.75rem)]
                        font-light tracking-[0.15em]
                        px-6 py-2
                        bg-[var(--bg-canvas)]
                        transition-all duration-300
                        hover:text-white hover:tracking-[0.2em]
                        ${isActive 
                          ? 'text-white border border-white/20' 
                          : 'text-[var(--text-secondary)] border border-transparent'
                        }
                      `}
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </NavLink>
                    
                    {/* Small border markers */}
                    <div className="absolute left-0 top-1/2 w-2 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
                    <div className="absolute right-0 top-1/2 w-2 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
                  </div>
                ))}

                {/* Logout button with same styling */}
                <div className="relative flex items-center justify-center group mt-8">
                  <div className="absolute left-0 right-0 h-px bg-[var(--border-subtle)]" />
                  <button
                    onClick={() => {
                      // Add your logout logic here
                      handleLogout();
                    }}
                    className={`
                      relative z-10
                      text-[clamp(1.1rem,4vw,1.5rem)]
                      font-light tracking-[0.15em]
                      px-6 py-2
                      bg-(--bg-canvas)
                      ${logoutLoading ? "" : "text-(--text-muted)"}
                      transition-all duration-300
                      hover:text-white hover:tracking-[0.2em]
                      border border-transparent hover:border-white/10
                    `}
                  >
                    {logoutLoading ? "Logging out...." : "LOGOUT"}
                  </button>
                  <div className="absolute left-0 top-1/2 w-2 h-px bg-(--border-subtle) -translate-y-1/2" />
                  <div className="absolute right-0 top-1/2 w-2 h-px bg-(--border-subtle) -translate-y-1/2" />
                </div>
              </div>
            ) : (
              <div className="relative py-12">
                {/* Border line through login button */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--border-subtle)]" />
                
                <Link to="/auth" onClick={toggleMenu}>
                  <ActionButton
                    buttonName="LOGIN / SIGNUP"
                    icon={<LogIn />}
                    iconPosition="left"
                    cssClass="relative z-10 bg-[var(--bg-canvas)] border border-[var(--border-visible)] hover:border-white hover:bg-[var(--bg-hover)] text-white px-8 py-4 text-sm tracking-wider"
                  />
                </Link>
                
                {/* Border continuation lines */}
                <div className="absolute left-0 top-1/2 w-4 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-4 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
              </div>
            )
          }

          {/* Bottom border with label */}
          <div className="absolute bottom-0 left-6 right-6 flex items-center justify-center">
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)] px-4 bg-[var(--bg-canvas)]">
              {new Date().getFullYear()}
            </span>
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          </div>
        </div>

        {/* Bottom bar with VIDEOSTACK . MONOCHROME - integrated with borders */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <div className="relative inline-block">
            <p className="text-sm tracking-[0.2em] text-[var(--text-secondary)] bg-[var(--bg-canvas)] px-6 py-1 relative z-10 font-light">
              VIDEOSTACK . MONOCHROME
            </p>
            <div className="absolute left-0 top-1/2 w-4 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-4 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
          </div>
        </div>

      </div>

    </div>
  );
}