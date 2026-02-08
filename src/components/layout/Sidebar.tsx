'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, toggleTheme } = useUser();
  const theme = typeof window !== 'undefined' ? localStorage.getItem('slooze_theme') : 'dark';

  if (!user) return null;

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['manager'],
    },
    {
      href: '/products',
      label: 'Products',
      icon: Package,
      roles: ['manager', 'store_keeper'],
    },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b px-6 justify-center">
        <img src="/sloozecms.png" alt="Slooze Logo" className="h-8 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          if (!link.roles.includes(user.role)) return null;
          
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 space-y-2">
        <div className="px-2 py-1.5">
           <p className="text-sm font-medium leading-none">{user.name}</p>
           <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-9"
          onClick={toggleTheme}
        >
           <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
           <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
           <span className="ml-2">Theme</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
