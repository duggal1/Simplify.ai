"use client";

import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { FileIcon, BotIcon, Sparkle, CheckCircle, Inbox, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: SidebarItem[] = [
  { id: 1, name: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/dashboard' },
  { id: 2, name: 'YouTube to Blog⚡️', icon: <BotIcon className="w-6 h-6" />, path: '/dashboard/youtube-blogs' },
  { id: 3, name: 'Email Marketing', icon: <Inbox className="w-6 h-6" />, path: '/dashboard/email-marketing' },
  { id: 4, name: 'AI Files', icon: <Sparkle className="w-6 h-6" />, path: '/dashboard/ai-files' },
  { id: 5, name: 'Data Extraction', icon: <FileIcon className="w-6 h-6" />, path: '/dashboard/data-extraction' },
  { id: 6, name: 'Blogs', icon: <DocumentIcon className="w-6 h-6" />, path: '/posts' },
  { id: 7, name: 'Feedback', icon: <CheckCircle className="w-6 h-6" />, path: '/dashboard/feedback' },
  { id: 8, name: 'Settings', icon: <Settings className="w-6 h-6" />, path: '/settings' }
];

const Sidebar: FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path !== '/dashboard') return pathname.startsWith(path);
    return false;
  };

  return (
    <div className="flex h-screen">
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-80 h-screen bg-white/80 backdrop-blur-lg border-r border-gray-100 shadow-lg"
      >
        {/* Logo */}
        <div className="p-8">
          <motion.div 
            className="text-3xl font-black"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              simplify.AI
            </span>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-2 h-[calc(100vh-240px)] overflow-y-auto">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.id}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full px-6 py-4 rounded-xl flex items-center gap-4 cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${isActive(item.path)
                    ? 'bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-cyan-500/10 text-indigo-700 shadow-lg shadow-indigo-700/5'
                    : 'hover:bg-gradient-to-r hover:from-violet-500/5 hover:via-indigo-500/5 hover:to-cyan-500/5 text-gray-600 hover:text-indigo-600'
                  }
                  group relative
                `}
              >
                <span className={`
                  relative z-10 transition-all duration-300
                  ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-500'}
                `}>
                  {item.icon}
                </span>
                
                <span className={`
                  font-medium tracking-wide transition-all duration-300
                  ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-600 group-hover:text-indigo-500'}
                `}>
                  {item.name}
                </span>

                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-2 h-2 rounded-full bg-indigo-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Upgrade Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-r from-violet-50/90 to-indigo-50/90 border border-indigo-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="text-base font-semibold text-indigo-700">
              Pro Features
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Unlock premium capabilities
            </div>
            <Link href="/pricing" className="block mt-3">
              <motion.button 
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upgrade Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-80 p-8">
        {/* Content will be injected here */}
      </div>
    </div>
  );
};

export default Sidebar;