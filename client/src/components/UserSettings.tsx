import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../lib/api';
import { UserCircleIcon, PaintBrushIcon, ShieldCheckIcon, BellIcon } from '@heroicons/react/24/solid';

interface UserSettingsProps {
  onClose: () => void;
}

export default function UserSettings({ onClose }: UserSettingsProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState(user?.status || 'online');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      await userAPI.updateProfile({
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        status
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'My Profile', icon: UserCircleIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ];

  const statusOptions = [
    { value: 'online', label: 'Online', color: 'bg-green-500' },
    { value: 'idle', label: 'Idle', color: 'bg-yellow-500' },
    { value: 'dnd', label: 'Do Not Disturb', color: 'bg-red-500' },
    { value: 'invisible', label: 'Invisible', color: 'bg-gray-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">User Settings</h2>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition text-left"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/10 border border-green-500/50' : 'bg-red-500/10 border border-red-500/50'}`}>
                    <p className={message.includes('success') ? 'text-green-200' : 'text-red-200'}>{message}</p>
                  </div>
                )}

                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {displayName?.substring(0, 2).toUpperCase() || user?.displayName?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                        Change Avatar
                      </button>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={32}
                  />
                  <p className="text-xs text-gray-500 mt-1">{displayName.length}/32 characters</p>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-900/50 text-gray-500 rounded-lg border border-slate-700 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-900/50 text-gray-500 rounded-lg border border-slate-700 cursor-not-allowed"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    About Me
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={4}
                    maxLength={190}
                  />
                  <p className="text-xs text-gray-500 mt-1">{bio.length}/190 characters</p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStatus(option.value)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition ${
                          status === option.value
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                        <span className="text-white font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-slate-700">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Dark Mode</h3>
                      <p className="text-sm text-gray-400">Always enabled for the best experience</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Theme Color</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {['indigo', 'purple', 'pink', 'blue', 'green', 'red', 'orange', 'yellow'].map((color) => (
                      <button
                        key={color}
                        className={`w-full aspect-square rounded-lg bg-${color}-600 hover:scale-110 transition`}
                        title={color}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Coming soon: Customize your theme color</p>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email Verified</h3>
                      <p className="text-sm text-gray-400">Your email address is verified</p>
                    </div>
                    <span className="text-green-400 font-medium">✓ Verified</span>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Direct Messages</h3>
                      <p className="text-sm text-gray-400">Allow direct messages from server members</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Desktop Notifications</h3>
                      <p className="text-sm text-gray-400">Get notified about new messages</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Sound Notifications</h3>
                      <p className="text-sm text-gray-400">Play a sound when you receive a message</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
