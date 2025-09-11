"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { FeedItem } from "@/features/feed/types"
import { MoreFromAuthor } from "./MoreFromAuthor"
import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface JournalRecommendationsDrawerProps {
  isOpen: boolean
  onClose: () => void
  post: FeedItem
}

export function JournalRecommendationsDrawer({ isOpen, onClose, post }: JournalRecommendationsDrawerProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 right-0 z-[201] w-full md:w-[450px] shadow-2xl flex flex-col",
              "bg-[#fdfcf8] text-[#1a1816] border-l border-[#2a2520]/10",
            )}
          >
            {/* Header / Controls */}
            <div className="flex items-center justify-end p-6 bg-transparent absolute top-0 right-0 z-50">
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#2a2520]/5 rounded-full transition-colors text-[#8B4513]/60 hover:text-[#8B4513]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#fdfcf8] pt-6">
              {/* Reusing existing MoreFromAuthor component but styled properly */}
              <MoreFromAuthor
                currentPostId={post.postId}
                authorName={post.authorName}
                tenantId={post.tenantId}
                tenantSlug={post.tenantSlug}
                hideHeader={false}
                compact={true}
                className="py-1 pt-4 border-none bg-transparent"
                gridClassName="grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 px-8"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
