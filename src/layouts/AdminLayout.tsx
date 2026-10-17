import { Link, useLocation } from "react-router";
import { useState } from 'react';
import { ProtectedRoute, useSession, LogoutButton } from '@/lib/auth/auth-client';
import { LayoutDashboard, Coins, Upload, Users, Settings, Menu, X, ChevronRight, Shield, LogOut, Globe } from 'lucide-react';
const NAV_ITEMS = [{
  href: '/admin',
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  href: '/admin/pump-addresses',
  label: 'Coin Addresses',
  icon: Coins
}, {
  href: '/admin/upload-coins',
  label: 'Upload Coins',
  icon: Upload
}, {
  href: '/admin/global-upload',
  label: 'Global Upload',
  icon: Globe
}, {
  href: '/admin/whitelist',
  label: 'Whitelist',
  icon: Users
}, {
  href: '/admin/curator',
  label: 'Curator',
  icon: Settings
}];
function AdminSidebar({
  mobile,
  onClose
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const location = useLocation();
  const {
    user
  } = useSession();
  return <aside className={`flex flex-col h-full ${mobile ? 'w-72' : 'w-64'} border-r border-border bg-card/60 backdrop-blur-xl`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 border border-primary/30">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">Admin Panel</p>
          <p className="text-xs text-muted-foreground truncate">The Token Game</p>
        </div>
        {mobile && <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({
        href,
        label,
        icon: Icon
      }) => {
        const active = location.pathname === href;
        return <Link key={href} to={href} onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'text-primary bg-primary/10 border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>;
      })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-accent mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-primary/20 text-primary">
            {user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <LogoutButton className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </LogoutButton>
      </div>
    </aside>;
}
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}
function AdminLayoutInner({
  children,
  title
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <AdminSidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 md:px-6 h-14 border-b border-border bg-card/40 backdrop-blur-md shrink-0">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          {title && <h1 className="text-sm font-semibold text-foreground/80">{title}</h1>}
          <div className="ml-auto">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent">
              ← Back to site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>;
}
export default function AdminLayout({
  children,
  title
}: AdminLayoutProps) {
  return <ProtectedRoute redirectTo="/admin/login">
      <AdminLayoutInner title={title}>
        {children}
      </AdminLayoutInner>
    </ProtectedRoute>;
}
