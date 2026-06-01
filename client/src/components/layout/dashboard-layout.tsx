import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, Role } from "@/lib/mock-data";
import { LogOut, Bell, Search, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@assets/images/IIT_Logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [location] = useLocation();
  const navItems = NAV_ITEMS[role];
  const { studentName } = useUser();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-20 flex items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary">
          <div className="p-1.5 bg-primary/5 rounded-lg">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-display">
            Guidance
            <span className="text-foreground font-sans font-normal">
              Portal
            </span>
          </span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-1.5">
        <div className="px-3 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-muted-foreground",
                    )}
                  />
                )}
                {item.label}
              </a>
            </Link>
          );
        })}

      </div>

      <div className="p-4 border-t border-border/40">
        <Link href="/">
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </a>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="w-72 border-r border-border/40 bg-sidebar hidden md:flex flex-col shadow-sm z-20">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header */}
        <header className="h-20 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div className="font-bold text-lg text-primary font-display md:hidden">
              GuidancePortal
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search for students, records, or services..."
                className="w-full pl-10 bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 h-10 rounded-full transition-all shadow-xs focus:shadow-md"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary relative rounded-full w-10 h-10"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>

            <div className="h-8 w-px bg-border/60 mx-1 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent"
                >
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback className="bg-linear-to-br from-primary to-red-800 text-white">
                      {role.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-primary">
                      {role === "student" 
                        ? studentName 
                        : role === "counselor" 
                        ? localStorage.getItem("counselor_username") || "Counselor"
                        : "Current User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {role === "counselor" ? "Counselor Account" : "student@msumain.edu.ph"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-md cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive rounded-md cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => {
                    if (role === "counselor") {
                      localStorage.removeItem("counselor_id");
                      localStorage.removeItem("counselor_username");
                    }
                  }}
                >
                  <Link href="/" className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-10 overflow-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
