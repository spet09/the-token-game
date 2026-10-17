import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from "react-router";
import AdminLayout from '@/layouts/AdminLayout';
import { Coins, Upload, Users, Settings, Globe, ArrowRight, Activity } from 'lucide-react';
const TOOLS = [{
  href: '/admin/pump-addresses',
  icon: Coins,
  label: 'Coin Addresses',
  description: 'Enter Raydium mint addresses to activate buy buttons for all 212 coins.',
  badge: 'Primary'
}, {
  href: '/admin/upload-coins',
  icon: Upload,
  label: 'Upload Coins',
  description: 'Upload coin images for edition pages.'
}, {
  href: '/admin/global-upload',
  icon: Globe,
  label: 'Global Upload',
  description: 'Upload images for the global coin collection.'
}, {
  href: '/admin/whitelist',
  icon: Users,
  label: 'Whitelist',
  description: 'Manage wallet whitelist registrations — approve or reject applicants.'
}, {
  href: '/admin/curator',
  icon: Settings,
  label: 'Curator',
  description: 'Manage The Curator page content and settings.'
}];
const STATS = [{
  label: 'Total Coins',
  value: '212',
  sub: 'across all editions'
}, {
  label: 'Live Coins',
  value: '0',
  sub: 'with Raydium address'
}, {
  label: 'Whitelisted',
  value: '—',
  sub: 'approved wallets'
}];
export default function AdminDashboardPage() {
  return <AdminLayout title="Dashboard">
      <Helmet>
        <title>Admin Dashboard — The Token Game</title>
        <meta name="description" content="Admin dashboard for The Token Game." />
        <link rel="canonical" href="https://thetokengame.xyz/admin" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <h1 className="sr-only">Admin Dashboard</h1>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Manage The Token Game from one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STATS.map(stat => <div key={stat.label} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>)}
        </div>

        {/* Tools grid */}
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Admin Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map(tool => {
          const Icon = tool.icon;
          return <Link key={tool.href} to={tool.href} className="group flex items-start gap-4 rounded-xl border border-border bg-card/60 p-5 transition-all hover:bg-accent hover:border-primary/30">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 border border-primary/20">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{tool.label}</span>
                    {tool.badge && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary border border-primary/20">
                        {tool.badge}
                      </span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
              </Link>;
        })}
        </div>
      </div>
    </AdminLayout>;
}
