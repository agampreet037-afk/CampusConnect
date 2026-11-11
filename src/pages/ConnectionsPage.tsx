import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, ConnectionRecord } from '../types';
import { ProfileDetailModal } from '../components/profiles/ProfileDetailModal';
import {
  UserPlus,
  Users,
  Clock,
  Bookmark,
  Check,
  MessageSquare,
  Trash2,
  Eye,
} from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  const {
    currentUser,
    connections,
    savedStudentIds,
    getStudentById,
    getStudentCompatibility,
    acceptConnectionRequest,
    declineConnectionRequest,
    cancelConnectionRequest,
    removeConnection,
    toggleSaveStudent,
    openChatWithStudent,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'connected' | 'received' | 'sent' | 'saved'>('connected');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Group connections
  const connectedRecords = connections.filter((c: ConnectionRecord) => c.status === 'connected');
  const receivedRecords = connections.filter((c: ConnectionRecord) => c.status === 'pending_received');
  const sentRecords = connections.filter((c: ConnectionRecord) => c.status === 'pending_sent');

  // Saved students list
  const savedStudents = savedStudentIds
    .map((id: string) => getStudentById(id))
    .filter((s): s is StudentProfile => s !== undefined && s.id !== currentUser.id);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Network & Connections
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
            {connectedRecords.length} Active Peers
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Manage your campus connections, outgoing invites, incoming requests, and bookmarked peer profiles.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'connected'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Connections ({connectedRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'received'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Received ({receivedRecords.length})</span>
          {receivedRecords.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'sent'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Sent Invites ({sentRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'bg-violet-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Profiles ({savedStudents.length})</span>
        </button>
      </div>

      {/* TAB 1: Connected Students */}
      {activeTab === 'connected' && (
        <div>
          {connectedRecords.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                No connections yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the discover directory to find students who share your passions and build your campus circle.
              </p>
              <button
                onClick={() => setActiveView('discover')}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
              >
                Discover Campus Peers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedRecords.map((record: ConnectionRecord) => {
                const student = getStudentById(record.studentId);
                if (!student) return null;
                const compat = getStudentCompatibility(student);

                return (
                  <div
                    key={record.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-violet-300 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/20"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 font-heading hover:text-violet-600 transition-colors">
                              {student.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">{student.department.split('&')[0]}</p>
                            <p className="text-[10px] text-slate-400">{record.timestamp}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                          {compat.overallScore}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{student.bio}</p>

                      {/* Shared Interests */}
                      {compat.sharedInterests.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {compat.sharedInterests.slice(0, 3).map((item: string) => (
                            <span
                              key={item}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700"
                            >
                              ★ {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => removeConnection(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Remove connection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openChatWithStudent(student.id)}
                          className="py-1.5 px-3.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Received Requests */}
      {activeTab === 'received' && (
        <div>
          {receivedRecords.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                No pending requests
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                When other students send you a connection request, you can review their shared passions and accept here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receivedRecords.map((record: ConnectionRecord) => {
                const student = getStudentById(record.studentId);
                if (!student) return null;
                const compat = getStudentCompatibility(student);

                return (
                  <div
                    key={record.id}
                    className="p-5 bg-white rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-300/40"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 font-heading">
                              {student.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">{student.department}</p>
                            <p className="text-[10px] text-amber-700 font-medium">{record.timestamp}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {compat.overallScore}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{student.bio}</p>

                      <div className="mt-3 p-2 bg-slate-50 rounded-xl text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Looking for: </span>
                        <span>{student.lookingFor || 'Study partners & collaborators'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                      >
                        View Profile
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => declineConnectionRequest(student.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => acceptConnectionRequest(student.id)}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Sent Requests */}
      {activeTab === 'sent' && (
        <div>
          {sentRecords.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                No outgoing invites pending
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                When you click "Connect" on student profiles, you can monitor and manage pending invites here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentRecords.map((record: ConnectionRecord) => {
                const student = getStudentById(record.studentId);
                if (!student) return null;
                const compat = getStudentCompatibility(student);

                return (
                  <div
                    key={record.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 font-heading">
                            {student.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">{student.department.split('&')[0]}</p>
                          <p className="text-[10px] text-slate-400">{record.timestamp}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                        {compat.overallScore}%
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                        Waiting for response
                      </span>
                      <button
                        onClick={() => cancelConnectionRequest(student.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Saved Profiles */}
      {activeTab === 'saved' && (
        <div>
          {savedStudents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                No saved student bookmarks
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bookmark interesting profiles while browsing Discover to easily find them later for collaborations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedStudents.map((student: StudentProfile) => {
                const compat = getStudentCompatibility(student);

                return (
                  <div
                    key={student.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 font-heading hover:text-violet-600 transition-colors">
                              {student.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">{student.department.split('&')[0]}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSaveStudent(student.id)}
                          className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-xl"
                          title="Remove bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-amber-500" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">{student.bio}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => openChatWithStudent(student.id)}
                        className="py-1.5 px-3.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-2xs flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

    </div>
  );
};
