"use client";

import { format, parseISO } from 'date-fns';
import { History } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChangelogEntry {
  date: string;
  changes: string[];
}

const ChangelogSection: React.FC<{ changelog?: ChangelogEntry[] }> = ({ changelog = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-12 rounded-3xl bg-white"
    >
      <motion.div 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 shadow-lg">
          <History className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Changelog
        </h2>
      </motion.div>

      <div className="space-y-8">
        {changelog.length > 0 ? (
          changelog.map((entry, index) => (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6 transition-transform duration-300 hover:translate-x-1"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full opacity-30" />
              <div className="absolute -left-2 top-2 h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg animate-pulse" />
              
              <time className="block text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {format(parseISO(entry.date), 'MMMM d, yyyy')}
              </time>
              
              <ul className="mt-3 space-y-2">
                {entry.changes.map((change, changeIndex) => (
                  <motion.li
                    key={changeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index * 0.1) + (changeIndex * 0.05) }}
                    className="text-gray-600 hover:text-purple-700 transition-colors duration-300 backdrop-blur-sm rounded-lg p-2 hover:bg-purple-50/50"
                  >
                    {change}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No changelog entries available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ChangelogSection;