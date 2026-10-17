import { useState } from 'react';
import { useNavigate } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { signIn } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn.email({
        email,
        password
      });
      if (result.error) {
        setError(result.error.message ?? 'Invalid credentials');
      } else {
        navigate('/admin');
      }
    } catch {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  return <>
      <Helmet>
        <title>Admin Login — The Token Game</title>
        <meta name="description" content="Admin login for The Token Game." />
        <link rel="canonical" href="https://thetokengame.xyz/admin/login" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/30">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground mt-1">The Token Game</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@thetokengame.xyz" className="pl-10 bg-background/50 border-border focus:border-primary/50" required autoComplete="email" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 bg-background/50 border-border focus:border-primary/50" required autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="rounded-lg px-4 py-3 text-sm text-destructive bg-destructive/10 border border-destructive/20">
                  {error}
                </div>}

              <Button type="submit" disabled={loading} className="w-full font-semibold h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Admin access only. Unauthorised access is prohibited.
          </p>
        </div>
      </div>
    </>;
}
