"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home as HomeIcon,
  Rocket as RocketIcon,
  Mail as MailIcon, 
  FileText as FileTextIcon,
  BarChart as BarChartIcon,
  File as FileIcon,
  MessageCircle as MessageCircleIcon,
  Settings as SettingsIcon
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: SidebarItem[] = [
  { id: 1, name: "Dashboard", icon: <HomeIcon className="w-5 h-5 text-blue-500" />, path: "/dashboard" },
  { id: 2, name: "YouTube to Blog⚡️", icon: <RocketIcon className="w-5 h-5 text-yellow-500" />, path: "/dashboard/youtube-blogs" },
  { id: 3, name: "Email Marketing", icon: <MailIcon className="w-5 h-5 text-green-500" />, path: "/dashboard/email-marketing" },
  { id: 4, name: "AI Files", icon: <FileTextIcon className="w-5 h-5 text-purple-500" />, path: "/dashboard/ai-files" },
  { id: 5, name: "Data Extraction", icon: <BarChartIcon className="w-5 h-5 text-red-500" />, path: "/dashboard/data-extraction" },
  { id: 6, name: "Blogs", icon: <FileIcon className="w-5 h-5 text-orange-500" />, path: "/posts" },
  { id: 7, name: "Feedback", icon: <MessageCircleIcon className="w-5 h-5 text-teal-500" />, path: "/dashboard/feedback" },
  { id: 8, name: "Settings", icon: <SettingsIcon className="w-5 h-5 text-gray-500" />, path: "/settings" }
];

const ModernSidebar: FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard") return pathname.startsWith(path);
    return false;
  };

  return (
    <div className="flex h-screen ">
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-64 h-screen bg-white/70 border-r border-blue-800 shadow-lg backdrop-blur-xl z-50"
      >
        {/* Logo */}
        <div className="p-6 flex items-center">
          <motion.img 
            src="/icons/logo.png" 
            alt="Logo" 
            className="w-8 h-8 mr-2 drop-shadow-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          <motion.div 
            className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            simplify.AI
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-2 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {menuItems.map((item) => (
              <Link href={item.path} key={item.id}>
                <motion.div
                  whileHover={{ scale: 1.05, x: 8 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`
                    w-full px-4 py-3.5 rounded-xl flex items-center gap-3 cursor-pointer
                    transition-all duration-300 ease-in-out backdrop-blur-xl
                    ${isActive(item.path)
                      ? "bg-gradient-to-r from-pink-500/80 via-purple-400/80 to-cyan-400/80 text-purple-600 shadow-xl shadow-purple-200/50 backdrop-blur-2xl border border-white/40"
                      : "hover:bg-gradient-to-r hover:from-pink-300/70 hover:via-blue-300/70 hover:to-cyan-300/70 text-gray-600 hover:text-purple-500 hover:shadow-lg hover:shadow-purple-100/40 hover:backdrop-blur-xl hover:border hover:border-white/30"
                    }
                    group relative
                  `}
                >
                  <motion.span 
                    className={`
                      relative z-10 transition-all duration-300
                      ${isActive(item.path) ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-500"}
                    `}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.span>
                  
                  <span className={`
                    text-sm font-medium tracking-wide transition-all duration-300
                    ${isActive(item.path) ? "text-indigo-600" : "text-gray-600 group-hover:text-indigo-500"}
                  `}>
                    {item.name}
                  </span>

                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-200"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </nav>

        {/* Upgrade Button */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full p-3 bg-white/90 backdrop-blur-xl border-t border-gray-50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="p-6 rounded-xl bg-gradient-to-r from-violet-50/90 to-blue-50/90 border border-blue-800"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <div className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Pro Features
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Unlock premium capabilities
            </div>
            <Link href="/pricing" className="block mt-3">
              <motion.button 
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Upgrade Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6 bg-gradient-to-br from-slate-50 to-white">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default ModernSidebar;