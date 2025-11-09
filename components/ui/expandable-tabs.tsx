"use client";

import { motion } from "framer-motion";
import { Calendar, Home, User, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const tabs: Tab[] = [
  {
    id: "home",
    label: "Início",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "events",
    label: "Eventos",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: "cupons",
    label: "Cupons",
    icon: <Ticket className="h-5 w-5" />,
    requiresAuth: true,
  },
  {
    id: "profile",
    label: "Perfil",
    icon: <User className="h-5 w-5" />,
    requiresAuth: true,
  },
];

export function ExpandableTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      console.log('📱 Mobile Nav - User authenticated:', !!user);
      setIsAuthenticated(!!user);
    };
    
    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('📱 Mobile Nav - Auth state changed:', _event, !!session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (tab: Tab) => {
    setActiveTab(tab.id);
    
    // Check if requires auth and user is not authenticated
    if (tab.requiresAuth && !isAuthenticated) {
      console.log('📱 Mobile Nav - Redirecting to login, tab requires auth');
      window.location.href = "/login";
      return;
    }
    
    // Navigate to the correct page
    if (tab.id === "home") window.location.href = "/";
    if (tab.id === "events") window.location.href = "/"; // Home page shows events
    if (tab.id === "cupons") window.location.href = "/perfil/cupons";
    if (tab.id === "profile") window.location.href = "/perfil";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800" />
      
      {/* Navigation */}
      <nav className="relative mx-auto max-w-md px-2 py-2">
        <div className="flex items-center justify-around rounded-full bg-white px-2 py-1.5 shadow-xl ring-1 ring-gray-200 backdrop-blur dark:bg-gray-800 dark:ring-gray-700">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigation(tab)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                aria-label={tab.label}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[48px] p-2 transition-all duration-200",
                  isActive ? "text-primary" : "text-gray-600 dark:text-gray-400"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive || isHovered ? 1.1 : 1,
                    rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {tab.icon}
                </motion.div>
                
                {/* Label - only show when active */}
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.8,
                    height: isActive ? "auto" : 0,
                  }}
                  className="relative z-10 overflow-hidden text-xs font-baloo2 font-semibold"
                >
                  {tab.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Safe area for iPhone notch */}
      <div className="h-safe-bottom bg-white dark:bg-gray-900" />
    </div>
  );
}
