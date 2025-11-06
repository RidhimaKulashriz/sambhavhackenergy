import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Search, 
  User, 
  LogOut, 
  Settings as SettingsIcon,
  Trophy,
  Calendar,
  Users,
  LayoutDashboard,
  Gavel,
  UserCog
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
// Custom badge-like component used instead of Badge for more control

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut, role: userRole } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(userRole || null);

  useEffect(() => {
    if (authUser) {
      loadProfileAndRole();
    }
  }, [authUser]);

  const loadProfileAndRole = async () => {
    if (!authUser) return;

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
    }

    // Load role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (roleData) {
      setRole(roleData.role);
    }
  };

  const handleDashboardNavigation = () => {
    if (!authUser) return '/auth';
    
    switch(role) {
      case 'admin':
        return '/admin';
      case 'judge':
        return '/judge';
      case 'participant':
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            to="/events"
            className={`flex items-center gap-1.5 transition-colors hover:text-foreground/80 ${
              location.pathname === '/events' ? 'text-foreground' : 'text-foreground/60'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </Link>
          
          {authUser && (
            <Link
              to={handleDashboardNavigation()}
              className={`flex items-center gap-1.5 transition-colors hover:text-foreground/80 ${
                location.pathname === '/dashboard' || 
                location.pathname === '/admin' || 
                location.pathname === '/judge' 
                  ? 'text-foreground' 
                  : 'text-foreground/60'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{
                role === 'admin' ? 'Admin Dashboard' : 
                role === 'judge' ? 'Judge Panel' : 'My Dashboard'
              }</span>
            </Link>
          )}
          
          {role === 'admin' && (
            <Link
              to="/admin/judges"
              className={`flex items-center gap-1.5 transition-colors hover:text-foreground/80 ${
                location.pathname.startsWith('/admin/judges') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <Gavel className="h-4 w-4" />
              <span>Manage Judges</span>
            </Link>
          )}
          
          <Link
            to="/showcase"
            className={`flex items-center gap-1.5 transition-colors hover:text-foreground/80 ${
              location.pathname === '/showcase' ? 'text-foreground' : 'text-foreground/60'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Showcase</span>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {authUser && <NotificationBell />}
          
          {/* Settings Panel */}
          <SettingsPanel />

          {/* Search */}
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Search"
            className="hidden sm:flex"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            
            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                        {profile?.full_name
                          ? profile.full_name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')
                              .toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                            {profile?.full_name
                              ? profile.full_name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                                  .toUpperCase()
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {profile?.email || ''}
                          </p>
                        </div>
                      </div>
                      {role && (
                        <div className="mt-1">
                          <div 
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                          >
                            {role === 'admin' && <UserCog className="mr-1 h-3 w-3" />}
                            {role === 'judge' && <Gavel className="mr-1 h-3 w-3" />}
                            {role === 'participant' && <Users className="mr-1 h-3 w-3" />}
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </div>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" className="hidden sm:flex border-primary/20 hover:bg-primary/10">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
