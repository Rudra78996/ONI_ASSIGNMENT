import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Users, User, BarChart, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { cn } from '../lib/utils';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center gap-2 mr-8">
            <div className="flex items-center justify-center size-8 rounded-md bg-black">
              <BookOpen className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">Library System</span>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/books"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/books') && "bg-accent"
                    )}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Books
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/authors"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/authors') && "bg-accent"
                    )}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Authors
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/users"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/users') && "bg-accent"
                    )}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Users
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/borrowed"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/borrowed') && "bg-accent"
                    )}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Borrowed Books
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden sm:block text-sm font-medium text-muted-foreground">
              Welcome, <span className="text-foreground">{user?.name}</span>
            </span>
            <Button 
              onClick={handleLogout}
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
