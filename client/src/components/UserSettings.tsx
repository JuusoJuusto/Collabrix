import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../lib/api';
import { 
  UserCircleIcon, PaintBrushIcon, ShieldCheckIcon, BellIcon,
  MicrophoneIcon, VideoCameraIcon, CheckCircleIcon, XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

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
  
  // Permissions state
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check microphone
    try {
      const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setMicPermission(micResult.state as any);
      micResult.onchange = () => setMicPermission(micResult.state as any);
    } catch (e) {
      // Permission API not supported
    }

    // Check camera
    try {
      const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(cameraResult.state as any);
      cameraResult.onchange = () => setCameraPermission(cameraResult.state as any);
    } catch (e) {
      // Permission API not supported
    }

    // Check notifications
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      await checkPermissions();
    } catch (e) {
      setMicPermission('denied');
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      await checkPermissions();
    } catch (e) {
      setCameraPermission('denied');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

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
    { id: 'permissions', name: 'Permissions', icon: ShieldCheckIcon },
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

  const getPermissionIcon = (permission: string) => {
    if (permission === 'granted') return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    if (permission === 'denied') return <XCircleIcon className="w-5 h-5 text-red-500" />;
    return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
  };

  const getPermissionText = (permission: string) => {
    if (permission === 'granted') return 'Granted';
    if (permission === 'denied') return 'Denied';
    return 'Not Requested';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex border border-slate-700" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 p-4 overflow-y-auto border-r border-slate-700">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">User Settings</h2>
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
                  <div className={`p-4 rounded-lg border ${message.includes('success') ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                    <p className={message.includes('success') ? 'text-green-200' : 'text-red-200'}>{message}</p>
                  </div>
                )}

                {/* Avatar */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-4">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
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
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    maxLength={32}
                  />
                  <p className="text-xs text-gray-500 mt-1">{displayName.length}/32 characters</p>
                </div>

                {/* Username & Email */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800/50 text-gray-500 rounded-lg border border-slate-700 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800/50 text-gray-500 rounded-lg border border-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    About Me
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={4}
                    maxLength={190}
                  />
                  <p className="text-xs text-gray-500 mt-1">{bio.length}/190 characters</p>
                </div>

                {/* Status */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
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
                            : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                        <span className="text-white font-medium text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Note:</strong> Permissions are required for voice chat, video calls, and notifications. You can manage these at any time.
                  </p>
                </div>

                {/* Microphone Permission */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <MicrophoneIcon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Microphone Access</h3>
                        <p className="text-sm text-gray-400 mb-3">Required for voice chat and voice channels</p>
                        <div className="flex items-center gap-2">
                          {getPermissionIcon(micPermission)}
                          <span className={`text-sm font-medium ${
                            micPermission === 'granted' ? 'text-green-400' :
                            micPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {getPermissionText(micPermission)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={requestMicPermission}
                      disabled={micPermission === 'granted'}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        micPermission === 'granted'
                          ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {micPermission === 'granted' ? 'Granted' : micPermission === 'denied' ? 'Retry' : 'Grant Access'}
                    </button>
                  </div>
                  {micPermission === 'denied' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                      <p className="text-red-200 text-sm">
                        Microphone access was denied. Please enable it in your browser settings to use voice features.
                      </p>
                    </div>
                  )}
                </div>

                {/* Camera Permission */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <VideoCameraIcon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Camera Access</h3>
                        <p className="text-sm text-gray-400 mb-3">Required for video calls and streaming</p>
                        <div className="flex items-center gap-2">
                          {getPermissionIcon(cameraPermission)}
                          <span className={`text-sm font-medium ${
                            cameraPermission === 'granted' ? 'text-green-400' :
                            cameraPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {getPermissionText(cameraPermission)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={requestCameraPermission}
                      disabled={cameraPermission === 'granted'}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        cameraPermission === 'granted'
                          ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {cameraPermission === 'granted' ? 'Granted' : cameraPermission === 'denied' ? 'Retry' : 'Grant Access'}
                    </button>
                  </div>
                  {cameraPermission === 'denied' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                      <p className="text-red-200 text-sm">
                        Camera access was denied. Please enable it in your browser settings to use video features.
                      </p>
                    </div>
                  )}
                </div>

                {/* Notification Permission */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <BellIcon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Desktop Notifications</h3>
                        <p className="text-sm text-gray-400 mb-3">Get notified about new messages and mentions</p>
                        <div className="flex items-center gap-2">
                          {getPermissionIcon(notificationPermission)}
                          <span className={`text-sm font-medium ${
                            notificationPermission === 'granted' ? 'text-green-400' :
                            notificationPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {getPermissionText(notificationPermission)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={requestNotificationPermission}
                      disabled={notificationPermission === 'granted'}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        notificationPermission === 'granted'
                          ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {notificationPermission === 'granted' ? 'Granted' : notificationPermission === 'denied' ? 'Retry' : 'Grant Access'}
                    </button>
                  </div>
                  {notificationPermission === 'denied' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                      <p className="text-red-200 text-sm">
                        Notification access was denied. Please enable it in your browser settings to receive notifications.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Dark Mode</h3>
                      <p className="text-sm text-gray-400">Always enabled for the best gaming experience</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-white font-semibold mb-4">Accent Color</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { name: 'Indigo', color: 'bg-indigo-600' },
                      { name: 'Purple', color: 'bg-purple-600' },
                      { name: 'Pink', color: 'bg-pink-600' },
                      { name: 'Blue', color: 'bg-blue-600' },
                      { name: 'Cyan', color: 'bg-cyan-600' },
                      { name: 'Green', color: 'bg-green-600' },
                      { name: 'Red', color: 'bg-red-600' },
                      { name: 'Orange', color: 'bg-orange-600' },
                      { name: 'Yellow', color: 'bg-yellow-600' },
                      { name: 'Slate', color: 'bg-slate-600' }
                    ].map((color) => (
                      <button
                        key={color.name}
                        className={`aspect-square rounded-lg ${color.color} hover:scale-110 transition border-2 border-transparent hover:border-white`}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Coming soon: Customize your accent color</p>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Compact Mode</h3>
                      <p className="text-sm text-gray-400">Reduce spacing for more content</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email Verified</h3>
                      <p className="text-sm text-gray-400">Your email address is verified</p>
                    </div>
                    <span className="text-green-400 font-medium flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Direct Messages</h3>
                      <p className="text-sm text-gray-400">Allow direct messages from server members</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Friend Requests</h3>
                      <p className="text-sm text-gray-400">Allow friend requests from anyone</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Activity Status</h3>
                      <p className="text-sm text-gray-400">Display current activity to others</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Desktop Notifications</h3>
                      <p className="text-sm text-gray-400">Get notified about new messages</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Sound Notifications</h3>
                      <p className="text-sm text-gray-400">Play a sound when you receive a message</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Mention Notifications</h3>
                      <p className="text-sm text-gray-400">Get notified when someone mentions you</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-lg"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Voice Channel Notifications</h3>
                      <p className="text-sm text-gray-400">Notify when someone joins your voice channel</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
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
