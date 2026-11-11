import React, { useState } from 'react';
import { Community } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Users,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Send,
  MapPin,
  Clock,
  CheckCircle,
  Tag,
} from 'lucide-react';

interface CommunityDetailModalProps {
  community: Community | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  community,
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    joinCommunity,
    leaveCommunity,
    addCommunityPost,
    likeCommunityPost,
    toggleRsvpCommunityEvent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'about'>('posts');
  const [postContent, setPostContent] = useState('');

  if (!community) return null;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    addCommunityPost(community.id, postContent.trim());
    setPostContent('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      <div className="space-y-6">
        
        {/* Cover Banner */}
        <div className="relative -mt-6 -mx-6 h-48 sm:h-56 overflow-hidden">
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-black/20" />

          {/* Banner Content */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-600 text-white uppercase tracking-wider">
                {community.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-1.5 leading-tight">
                {community.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1">
                {community.tagline}
              </p>
            </div>

            {/* Join / Leave toggle button */}
            <div className="shrink-0">
              {community.isJoined ? (
                <button
                  onClick={() => leaveCommunity(community.id)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white/20 hover:bg-rose-600 text-white backdrop-blur-md border border-white/30 transition-all"
                >
                  Joined Club
                </button>
              ) : (
                <button
                  onClick={() => joinCommunity(community.id)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Join Community</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Community Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'posts'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Discussions & Posts ({community.posts.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Upcoming Activities ({community.events.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            About & Members ({community.membersCount})
          </button>
        </div>

        {/* Tab 1: Posts & Feed */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            
            {/* Create Post Form */}
            {community.isJoined ? (
              <form onSubmit={handleCreatePost} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={`Share an announcement, question, or idea in ${community.name}...`}
                      className="w-full text-xs bg-white rounded-xl p-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-slate-400">Post visible to all community members</span>
                      <button
                        type="submit"
                        disabled={!postContent.trim()}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-3 text-center bg-violet-50/70 border border-violet-100 rounded-xl">
                <p className="text-xs text-violet-800 font-medium">
                  Join this community to post updates, participate in discussions, and RSVP for events!
                </p>
              </div>
            )}

            {/* Posts List */}
            {community.posts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">No discussions yet.</p>
                <p className="text-xs mt-1">Be the first to start a conversation in this club!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {community.posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {post.authorName}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {post.authorDept} • {post.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Actions: Likes & Comments */}
                    <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                      <button
                        onClick={() => likeCommunityPost(community.id, post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          post.likedByMe ? 'text-rose-600 font-bold' : 'hover:text-slate-800'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                        <span>{post.likes}</span>
                      </button>

                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length} comments</span>
                      </span>
                    </div>

                    {/* Comment preview */}
                    {post.comments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2 text-xs bg-slate-50 p-2 rounded-xl">
                            <img
                              src={comment.authorAvatar}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div>
                              <span className="font-bold text-slate-800 mr-1.5">{comment.authorName}:</span>
                              <span className="text-slate-600">{comment.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Events */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {community.events.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">No upcoming events scheduled right now.</p>
                <p className="text-xs mt-1">Check back soon or create an activity circle!</p>
              </div>
            ) : (
              community.events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-900 font-heading">{event.title}</h5>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-violet-700 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-xs text-slate-500 font-medium">
                      {event.attendeesCount} attending
                    </span>
                    <button
                      onClick={() => toggleRsvpCommunityEvent(community.id, event.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        event.isAttending
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }`}
                    >
                      {event.isAttending ? '✓ RSVP Attending' : 'RSVP'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: About */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {community.description}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Community Tags
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {community.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Founded by {community.creatorName}</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Users className="w-3.5 h-3.5 text-violet-600" />
                {community.membersCount} Active Campus Members
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
