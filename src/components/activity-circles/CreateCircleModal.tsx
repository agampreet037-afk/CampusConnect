import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Hackathons', 'Sports', 'Creative', 'Study', 'Startups', 'Gaming', 'Other'];

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({ isOpen, onClose }) => {
  const { createCircle } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hackathons');
  const [maxMembers, setMaxMembers] = useState(4);
  const [date, setDate] = useState('This Weekend');
  const [time, setTime] = useState('5:00 PM - 7:00 PM');
  const [location, setLocation] = useState('Student Center / Innovation Lab');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    createCircle({
      title: title.trim(),
      description: description.trim(),
      category,
      maxMembers,
      date,
      time,
      location,
      tags: tags.length > 0 ? tags : [category, 'Campus'],
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start an Activity Circle" subtitle="Gather a small group of students around a specific activity or project" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Circle Title / Question *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Looking for 2 devs for HackSprint '26, Anyone up for badminton?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Group Size</label>
            <input
              type="number"
              min={2}
              max={12}
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value) || 4)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Details & What You Need *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Describe what you plan to do, who you are looking for, and what experience is required (if any)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="text"
              placeholder="e.g. Friday, Nov 15"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
            <input
              type="text"
              placeholder="e.g. 5:30 PM - 7:30 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Turf ground / Library"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. Hackathon, React, Beginners, Football"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
          >
            Publish Circle
          </button>
        </div>
      </form>
    </Modal>
  );
};
