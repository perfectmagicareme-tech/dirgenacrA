import React, { useState } from 'react';
import { MessageSquare, ArrowBigUp, ArrowBigDown, CornerDownRight } from 'lucide-react';
import { ParcelComment } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface ParcelCommentsProps {
  comments: ParcelComment[];
  onAddComment: (content: string) => void;
}

export function ParcelComments({ comments, onAddComment }: ParcelCommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d10] font-mono border-t border-[#222]">
      <div className="p-3 border-b border-[#222]">
        <div className="text-[10px] text-[#00ff9f] font-black uppercase tracking-widest flex items-center gap-2">
          <MessageSquare size={12} /> Matrix Discussion
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Transmit data to the grid..."
            className="w-full bg-[#16161c] border border-[#333] p-2 text-[10px] text-[#aaa] outline-none h-20 focus:border-[#00ff9f] transition-colors"
          />
          <button 
            type="submit"
            className="mt-2 w-full py-2 bg-[#00ff9f] text-black text-[9px] font-black uppercase hover:bg-white transition-all"
          >
            Deploy Thread
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentNode key={comment.id} comment={comment} depth={0} />
          ))}
          {comments.length === 0 && (
            <div className="text-center py-8 text-[9px] text-[#444] italic">
              No signal found in this sector.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentNode({ comment, depth }: { comment: ParcelComment, depth: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative ${depth > 0 ? 'ml-4 mt-2 border-l border-[#222] pl-3' : ''}`}
    >
      <div className="bg-[#16161c]/50 p-2 rounded">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-bold text-[#00ff9f]">u/{comment.author}</span>
          <span className="text-[7px] text-[#666]">{comment.timestamp}</span>
        </div>
        <p className="text-[10px] text-[#ccc] leading-relaxed">{comment.content}</p>
        <div className="mt-2 flex items-center gap-4 text-[8px] text-[#666]">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#00ff9f]">
            <ArrowBigUp size={12} /> {comment.votes}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#ff3e00]">
            <ArrowBigDown size={12} />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            Reply
          </div>
        </div>
      </div>
      {comment.replies?.map(reply => (
        <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </motion.div>
  );
}
