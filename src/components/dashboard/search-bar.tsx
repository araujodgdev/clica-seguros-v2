'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

export function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="rounded-full p-2 text-neutral-medium-gray transition-colors hover:bg-neutral-light-gray hover:text-neutral-charcoal"
      >
        <Search className="h-5 w-5" />
      </button>
      
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 240 }}
            exit={{ opacity: 0, width: 0 }}
            className="absolute right-0 top-0 overflow-hidden z-50"
          >
            <div className="flex items-center rounded-full bg-white shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-4 py-2 text-sm outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-neutral-medium-gray hover:text-neutral-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}