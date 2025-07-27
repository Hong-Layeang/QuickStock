import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx"
import useThemeStore from "../../stores/useThemeStore.js";
import useUserStore from "../../stores/useUserStore.js";
import useAuthStore from "../../stores/useAuthStore.js";
import maleImg from "../../assets/male.png";
import femaleImg from "../../assets/female.png";
import otherImg from "../../assets/other.png";
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield } from "react-icons/fi";

const genderImages = {
  male: maleImg,
  female: femaleImg,
  other: otherImg,
};

export default function Settings() {
  const { isDark } = useThemeStore();
  const { users, editUser, fetchUsers, fetchCurrentUser } = useUserStore();
  const { user: authUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "other",
    birthdate: ""
  });

  // Get current user from fetched data or auth store
  const currentUser = useMemo(() => {
    return currentUserData || authUser || users.find(u => u.id === authUser?.id) || {};
  }, [currentUserData, authUser, users]);

  // Fetch users and current user profile on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      const userData = await fetchCurrentUser();
      if (userData) {
        setCurrentUserData(userData);
      }
    };
    loadData();
  }, [fetchUsers, fetchCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || currentUser.username || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        gender: currentUser.gender || "other",
        birthdate: currentUser.birthdate || ""
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (currentUser.id) {
      const result = await editUser(currentUser.id, form);
      if (result.success) {
        // Refresh current user data after successful edit
        const updatedUserData = await fetchCurrentUser();
        if (updatedUserData) {
          setCurrentUserData(updatedUserData);
        }
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (currentUser) {
      setForm({
        name: currentUser.name || currentUser.username || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        gender: currentUser.gender || "other",
        birthdate: currentUser.birthdate || ""
      });
    }
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-2xl font-extrabold mb-1 tracking-tight ${
              isDark ? 'text-yellow-300 drop-shadow' : 'text-orange-600 drop-shadow'
            }`}>Settings</h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Manage your profile and account settings.</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition-all cursor-pointer flex items-center gap-2"
            >
              <FiEdit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-xl shadow transition-all cursor-pointer flex items-center gap-2"
              >
                <FiX className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition-all cursor-pointer flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className={`rounded-2xl p-6 shadow-md border ${
            isDark ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white via-orange-50 to-white border-orange-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Picture</h3>
            <div className="flex flex-col items-center">
              <img
                src={genderImages[currentUser.gender?.toLowerCase()] || genderImages.other}
                alt={currentUser.gender || 'profile'}
                className={`w-32 h-32 rounded-full object-cover mb-4 border-4 ${currentUser.role === 'admin' ? 'border-blue-400' : 'border-orange-400'} shadow-lg`}
                style={{ background: isDark ? '#222' : '#eee' }}
              />
              <div className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.name || currentUser.username || 'User'}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold shadow ${
                currentUser.role === 'admin' 
                  ? (isDark ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-700')
                  : (isDark ? 'bg-orange-900 text-orange-100' : 'bg-orange-200 text-orange-700')
              }`}>
                {currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={`lg:col-span-2 rounded-2xl p-6 shadow-md border ${
            isDark ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white via-orange-50 to-white border-orange-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <FiUser className="w-4 h-4" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    {currentUser.name || currentUser.username || 'Not set'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <FiMail className="w-4 h-4" /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    {currentUser.email || 'Not set'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <FiPhone className="w-4 h-4" /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    {currentUser.phone || 'Not set'}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <FiMapPin className="w-4 h-4" /> Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    {currentUser.address || 'Not set'}
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <FiUser className="w-4 h-4" /> Gender
                </label>
                {isEditing ? (
                  <select
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer ${
                      isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    {currentUser.gender?.charAt(0).toUpperCase() + currentUser.gender?.slice(1) || 'Not set'}
                  </div>
                )}
              </div>

              {/* Birthdate */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <FiCalendar className="w-4 h-4" /> Birth Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={form.birthdate}
                    onChange={e => setForm({ ...form, birthdate: e.target.value })}
                    className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    {currentUser.birthdate ? new Date(currentUser.birthdate).toLocaleDateString() : 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className={`mt-6 rounded-2xl p-6 shadow-md border ${
          isDark ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-white via-orange-50 to-white border-orange-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FiShield className="w-5 h-5" /> Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Account Type</label>
              <div className={`px-4 py-2 rounded-xl border ${
                isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
              }`}>
                {currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1) || 'User'}
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Member Since</label>
              <div className={`px-4 py-2 rounded-xl border ${
                isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
              }`}>
                {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Last Updated</label>
              <div className={`px-4 py-2 rounded-xl border ${
                isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'
              }`}>
                {currentUser.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 