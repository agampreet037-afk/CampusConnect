import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, Conversation, ChatMessage } from '../types';
import { ProfileDetailModal } from '../components/profiles/ProfileDetailModal';
import {
  Send,
  Search,
  MessageSquare,
  Sparkles,
  Info,
  CheckCheck,
  Eye,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const {
    currentUser,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    getStudentById,
    getStudentCompatibility,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectStudent, setInspectStudent] = useState<StudentProfile | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation
  const activeConv = conversations.find((c: Conversation) => c.id === activeConversationId) || conversations[0];
  const participant = activeConv ? getStudentById(activeConv.participantId) : null;
  const compatibility = participant ? getStudentCompatibility(participant) : null;

  // Filter conversations
  const filteredConversations = conversations.filter((c: Conversation) => {
    if (!searchQuery.trim()) return true;
    const student = getStudentById(c.participantId);
    if (!student) return false;
    return (
      student.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !participant) return;
    sendMessage(participant.id, inputText.trim());
    setInputText('');
  };

  const handleIcebreaker = (starter: string) => {
    if (!participant) return;
    sendMessage(participant.id, starter);
  };

  const icebreakers = [
    `Hey ${participant ? participant.name.split(' ')[0] : 'there'}! Saw we share common campus interests, would love to connect.`,
    `Are you looking for teammates for the upcoming HackSprint?`,
    `Would you be up for a study / coffee chat this week?`,
    `Saw your profile on CampusConnect! Always looking for collaborative peers.`,
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col pb-4">
      
      {/* Notice Banner */}
      <div className="px-4 py-1.5 rounded-xl bg-violet-50 text-violet-800 border border-violet-100 text-xs flex items-center justify-between mb-3 shrink-0">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span>Local Simulation: Messages persist in your browser for demo and feature testing.</span>
        </span>
        <span className="text-[11px] text-violet-600 font-semibold hidden sm:inline">
          Auto-simulates responses from peers
        </span>
      </div>

      {/* Main Split Chat Layout */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Pane: Conversation List */}
        <div className="w-full md:w-80 border-r border-slate-200/80 flex flex-col bg-slate-50/50 shrink-0">
          
          {/* Search bar */}
          <div className="p-3.5 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* List of chats */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv: Conversation) => {
                const peer = getStudentById(conv.participantId);
                if (!peer) return null;
                const isSelected = activeConv?.id === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-violet-50/90 border-r-2 border-violet-600'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {peer.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{peer.name}</p>
                        <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Window */}
        {activeConv && participant ? (
          <div className="flex-1 flex flex-col bg-white">
            
            {/* Chat Header */}
            <div className="p-3.5 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setInspectStudent(participant)}
              >
                <div className="relative">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 font-heading hover:text-violet-600 transition-colors">
                      {participant.name}
                    </h4>
                    {compatibility && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">
                        {compatibility.overallScore}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {participant.department} • {participant.academicYear}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectStudent(participant)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Profile</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/40">
              
              {/* Mutual Passions Card inside Chat */}
              {compatibility && compatibility.sharedInterests.length > 0 && (
                <div className="max-w-md mx-auto p-3 rounded-2xl bg-violet-50/70 border border-violet-100 text-center text-xs text-violet-900 shadow-2xs">
                  <p className="font-bold flex items-center justify-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    Mutual Passions: {compatibility.sharedInterests.join(', ')}
                  </p>
                  <p className="text-[10px] text-violet-700 mt-0.5">
                    Break the ice with one of the quick suggestions below!
                  </p>
                </div>
              )}

              {/* Message Bubbles */}
              {activeConv.messages.map((msg: ChatMessage) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-violet-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-violet-400" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Icebreaker suggestions */}
            {activeConv.messages.length <= 3 && (
              <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">
                  Icebreakers:
                </span>
                {icebreakers.slice(0, 2).map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleIcebreaker(starter)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-slate-600 text-[11px] truncate max-w-xs shrink-0 transition-colors border border-slate-200/60"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${participant.name.split(' ')[0]}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
            <h4 className="text-base font-bold text-slate-700">Select a Conversation</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Choose a connection from the list on the left or click "Chat" on any student profile.
            </p>
          </div>
        )}

      </div>

      {/* Inspect Student Modal */}
      <ProfileDetailModal
        student={inspectStudent}
        isOpen={!!inspectStudent}
        onClose={() => setInspectStudent(null)}
      />

    </div>
  );
};
