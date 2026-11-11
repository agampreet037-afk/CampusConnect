import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CommunityCategory } from '../../types';
import { Check } from 'lucide-react';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COVER_OPTIONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
];

const CATEGORIES: CommunityCategory[] = [
  'Technology',
  'Sports & Fitness',
  'Creative Arts',
  'Business & Startups',
  'Lifestyle & Hobbies',
  'Academics & Research',
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ isOpen, onClose }) => {
  const { createCommunity } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('Technology');
  const [coverImage, setCoverImage] = useState(COVER_OPTIONS[0]);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagline.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    createCommunity({
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim() || tagline.trim(),
      category,
      coverImage,
      avatarImage: coverImage,
      tags: tags.length > 0 ? tags : [category.split(' ')[0], 'Campus'],
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Campus Community" subtitle="Build a hub for like-minded students to gather and collaborate" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Community Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. NextGen Web Developers, Badminton League"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Tagline *</label>
          <input
            type="text"
            required
            placeholder="A single catchy sentence defining your community's purpose"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommunityCategory)}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Python, Hackathons, AI"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">About & Purpose</label>
          <textarea
            rows={3}
            placeholder="What activities will your community organize? Who should join?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Cover selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Choose Cover Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {COVER_OPTIONS.map((imgUrl) => (
              <button
                type="button"
                key={imgUrl}
                onClick={() => setCoverImage(imgUrl)}
                className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  coverImage === imgUrl ? 'border-violet-600 ring-2 ring-violet-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="Cover preview" className="w-full h-full object-cover" />
                {coverImage === imgUrl && (
                  <span className="absolute top-1 right-1 bg-violet-600 text-white p-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
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
            Launch Community
          </button>
        </div>
      </form>
    </Modal>
  );
};
