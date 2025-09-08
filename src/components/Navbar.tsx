import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Menu, LogOut, User } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <QrCode className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">lnkzip-QR Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#features';
                    }
                  }}
                >
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById('qr-generator-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  URL Shortener
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing">
                  <NavigationMenuLink className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Analytics
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email?.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/pricing')}>
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn}>Sign In</Button>
              <Button variant="hero" onClick={handleGetStarted}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <NavigationMenuLink 
                  className="text-lg font-medium hover:text-primary transition-colors cursor-pointer block py-2"
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#features';
                    }
                  }}
                >
                  Features
                </NavigationMenuLink>
                <NavigationMenuLink 
                  className="text-lg font-medium hover:text-primary transition-colors cursor-pointer block py-2"
                  onClick={() => document.getElementById('qr-generator-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  URL Shortener
                </NavigationMenuLink>
                <Link to="/pricing">
                  <NavigationMenuLink className="text-lg font-medium hover:text-primary transition-colors cursor-pointer block py-2">
                    Pricing
                  </NavigationMenuLink>
                </Link>
                <NavigationMenuLink 
                  className="text-lg font-medium hover:text-primary transition-colors cursor-pointer block py-2"
                  onClick={() => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Analytics
                </NavigationMenuLink>
                <div className="pt-4 space-y-3">
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => navigate('/dashboard')}
                      >
                        Dashboard
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleSignIn}>
                        Sign In
                      </Button>
                      <Button variant="hero" className="w-full" onClick={handleGetStarted}>
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};