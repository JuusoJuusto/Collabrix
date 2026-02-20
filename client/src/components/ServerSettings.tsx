import { useState } from 'react';
import { 
  Cog6ToothIcon, UserGroupIcon, ShieldCheckIcon, 
  TrashIcon, PencilIcon, XMarkIcon, CheckIcon
} from '@heroicons/react/24/solid';

interface ServerSettingsProps {
  server: any;
  onClose: () => void;
  onUpdate?: (data: any) => void;
  onDelete?: () => void;
}

export default function ServerSettings({ server, onClose, onUpdate, onDelete }: ServerSettingsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [serverName, setServerName] = useState(server?.name || '');
  const [serverDescription, setServerDescription] = useState(server?.description || '');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Cog6ToothIcon },
    { id: 'roles', name: 'Roles', icon: ShieldCheckIcon },
    { id: 'members', name: 'Members', icon: UserGroupIcon },
    { id: 'moderation', name: 'Moderation', icon: ShieldCheckIcon }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onUpdate) {
        await onUpdate({
          name: serverName,
          description: serverDescription
        });
      }
      setTimeout(() => setSaving(false), 500);
    } catch (error) {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex border border-slate-700" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 p-4 overflow-y-auto border-r border-slate-700">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {server?.name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{server?.name}</h3>
                <p className="text-xs text-gray-500">Server Settings</p>
              </div>
            </div>
            
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg'
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
              className="w-full px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition text-left flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-slate-800">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-slate-700 rounded-lg"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Server Icon */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-4">Server Icon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                      {serverName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                        Change Icon
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Recommended: 512x512px, PNG or JPG</p>
                    </div>
                  </div>
                </div>

                {/* Server Name */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Server Name
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="Enter server name"
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{serverName.length}/100 characters</p>
                </div>

                {/* Server Description */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Server Description
                  </label>
                  <textarea
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                    placeholder="What's your server about?"
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{serverDescription.length}/500 characters</p>
                </div>

                {/* Server Region */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Server Region
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>Automatic</option>
                    <option>US East</option>
                    <option>US West</option>
                    <option>Europe</option>
                    <option>Asia</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Choose the region closest to your members</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
                  <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Once you delete a server, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete Server
                  </button>
                </div>
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Roles</strong> allow you to organize your server members and customize their permissions.
                  </p>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-700">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Server Roles</h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                      Create Role
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {['Admin', 'Moderator', 'Member'].map((role, index) => (
                      <div key={role} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                          <span className="text-white font-medium">{role}</span>
                        </div>
                        <button className="text-gray-400 hover:text-white transition">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg border border-slate-700">
                  <div className="p-4 border-b border-slate-700">
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-center py-8">No members to display</p>
                  </div>
                </div>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Explicit Content Filter</h3>
                      <p className="text-sm text-gray-400">Automatically scan and delete messages with explicit content</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Verification Level</h3>
                      <p className="text-sm text-gray-400">Require members to verify before chatting</p>
                    </div>
                    <select className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>None</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Spam Protection</h3>
                      <p className="text-sm text-gray-400">Automatically detect and remove spam messages</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-md border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">Delete '{server?.name}'?</h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. All channels, messages, and settings will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete Server
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
