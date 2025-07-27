import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/useUserStore.js";
import useAuthStore from "../../stores/useAuthStore.js";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import useThemeStore from "../../stores/useThemeStore.js";
import maleImg from "../../assets/male.png";
import femaleImg from "../../assets/female.png";
import otherImg from "../../assets/other.png";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "supplier",
  gender: "other",
  phone: "",
  address: "",
};

const genderImages = {
  male: maleImg,
  female: femaleImg,
  other: otherImg,
};

export default function Users() {
  const { isDark } = useThemeStore();
  const { users, fetchUsers, createUser, editUser, deleteUser } = useUserStore();
  const { user: currentAuthUser } = useAuthStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Filter and sort users: newest first (matches dashboard logic)
  const filtered = users
    .filter(u =>
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Admin deletion safety
  const adminCount = users.filter(u => u.role === 'admin').length;
  const isCurrentUser = (userId) => currentAuthUser && currentAuthUser.id === userId;
  const canDeleteUser = (user) => {
    // Can't delete yourself
    if (isCurrentUser(user.id)) return false;
    // Can't delete the last admin
    if (user.role === 'admin' && adminCount <= 1) return false;
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await createUser(form);
    setShowAdd(false);
    setForm(initialForm);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    await editUser(editId, form);
    setShowEdit(false);
    setForm(initialForm);
    setEditId(null);
  };
  const handleDelete = async () => {
    await deleteUser(deleteId);
    setDeleteId(null);
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
            }`}>Users</h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Manage all users here.</p>
            {/* Badges for total suppliers and admins */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-orange-900 text-orange-100' : 'bg-orange-200 text-orange-700'
              }`}>
                Suppliers: {users.filter(u => u.role === 'supplier').length}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-700'
              }`}>
                Admins: {users.filter(u => u.role === 'admin').length}
              </span>
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition-all cursor-pointer">+ Add User</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full sm:w-64 px-4 py-2 rounded-xl font-semibold bg-transparent border-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder:font-semibold ${
                isDark 
                  ? 'border-gray-700 bg-gray-900 text-white placeholder:text-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
              }`}
              style={{ minWidth: 0 }}
            />
            <select
              value={search === 'admin' || search === 'supplier' ? search : ''}
              onChange={e => setSearch(e.target.value)}
              className={`w-full sm:w-40 pl-4 pr-4 py-2 rounded-2xl border font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${
                isDark ? 'bg-gray-700 text-white border-orange-400' : 'bg-white text-gray-900 border-orange-400'
              }`} 
              style={{ minWidth: 0, borderWidth: 2, fontWeight: 600, fontSize: '1rem' }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
        </div>
        {/* User List Rendering */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">No users found.</div>
          ) : filtered.map(u => {
            const imgSrc = genderImages[u.gender?.toLowerCase()] || genderImages.other;
            return (
              <div
                key={u.id}
                className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center transition-all hover:shadow-xl cursor-pointer group ${
                  isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200'
                }`}
                onClick={() => setSelectedUser(u)}
                title={u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                style={{ transition: 'box-shadow 0.2s, border-color 0.2s' }}
              >
                <img
                  src={imgSrc}
                  alt={u.gender || 'profile'}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3 sm:mb-4 border-4 ${u.role === 'admin' ? 'border-blue-400' : 'border-orange-400'} shadow`}
                  style={{ background: isDark ? '#222' : '#eee' }}
                />
                <div className={`text-base sm:text-lg font-bold mb-1 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{u.username || u.name}</div>
                <div className={`text-xs sm:text-sm mb-1 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{u.email}</div>
                <div className={`text-xs mb-2 capitalize ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{u.role}</div>
                {u.phone && (
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{u.phone}</div>
                )}
                {/* Quick badges for user info */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 justify-center">
                  {u.createdAt && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-yellow-700 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>
                      Joined: {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3 w-full">
                  <button
                    onClick={e => { e.stopPropagation(); setShowEdit(true); setEditId(u.id); setForm({ name: u.name || u.username, email: u.email, password: '', role: u.role, gender: u.gender, phone: u.phone, address: u.address }); }}
                    className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer
                      ${isDark 
                        ? 'bg-gray-700 text-blue-400 hover:bg-gray-600 hover:text-blue-300 border border-gray-600' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      }`}
                  >
                    <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteId(u.id); }}
                    className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer
                      ${isDark 
                        ? 'bg-gray-700 text-red-400 hover:bg-gray-600 hover:text-red-300 border border-gray-600' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      }`}
                    disabled={!canDeleteUser(u)}
                    title={isCurrentUser(u.id) ? 'You cannot delete yourself' : (u.role === 'admin' && adminCount <= 1 ? 'At least one admin required' : 'Delete')}
                    style={!canDeleteUser(u) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div
            className={`p-8 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 relative border-2 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 via-white to-orange-100 border-orange-300'}`}
            onClick={e => e.stopPropagation()}
            style={{ transition: 'background 0.3s, border-color 0.3s' }}
          >
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold cursor-pointer transition-colors" onClick={() => setSelectedUser(null)}>&times;</button>
            <div className="flex flex-col items-center">
              <img
                src={genderImages[selectedUser.gender?.toLowerCase()] || genderImages.other}
                alt={selectedUser.gender || 'profile'}
                className={`w-24 h-24 rounded-full object-cover mb-4 border-4 ${selectedUser.role === 'admin' ? 'border-blue-400' : 'border-orange-400'} shadow`}
                style={{ background: isDark ? '#222' : '#eee', borderWidth: 5, borderStyle: 'solid' }}
              />
              <div className={`text-2xl font-extrabold mb-1 tracking-tight ${isDark ? 'text-white' : 'text-orange-700'}`}>{selectedUser.username || selectedUser.name}</div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center w-full">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-orange-900 text-orange-100' : 'bg-orange-200 text-orange-700'}`}>{selectedUser.role?.charAt(0).toUpperCase() + selectedUser.role?.slice(1)}</span>
                {selectedUser.gender && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-700'}`}>{selectedUser.gender?.charAt(0).toUpperCase() + selectedUser.gender?.slice(1)}</span>
                )}
              </div>
              <div className={`text-base mt-2 mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>{selectedUser.email}</div>
              {selectedUser.phone && (
                <div className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>📞 {selectedUser.phone}</div>
              )}
              {selectedUser.address && (
                <div className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>🏠 {selectedUser.address}</div>
              )}
              {/* Show more info if available */}
              {selectedUser.position && (
                <div className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>Position: {selectedUser.position}</div>
              )}
              {selectedUser.department && (
                <div className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>Department: {selectedUser.department}</div>
              )}
              {selectedUser.status && (
                <div className={`text-base mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>Status: {selectedUser.status}</div>
              )}
              <div className="flex flex-wrap gap-2 mt-2 justify-center w-full">
                {selectedUser.createdAt && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-yellow-700 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                )}
                {selectedUser.lastActivity && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-yellow-700 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>Last Active: {new Date(selectedUser.lastActivity).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAdd} className={`p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 border-2 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 via-white to-orange-100 border-orange-300'}`}> 
            <h3 className={`text-xl sm:text-2xl font-extrabold mb-4 tracking-tight text-center ${isDark ? 'text-yellow-200' : 'text-orange-700'}`}>Add User</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} style={{ minWidth: 0 }}>
                <option value="admin">Admin</option>
                <option value="supplier">Supplier</option>
              </select>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} style={{ minWidth: 0 }}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <input type="text" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
              <button type="button" onClick={() => { setShowAdd(false); setForm(initialForm); }} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer transition-all">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow cursor-pointer transition-all">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleEdit} className={`p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 border-2 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 via-white to-orange-100 border-orange-300'}`}> 
            <h3 className={`text-xl sm:text-2xl font-extrabold mb-4 tracking-tight text-center ${isDark ? 'text-yellow-200' : 'text-orange-700'}`}>Edit User</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <input type="password" placeholder="Password (leave blank to keep)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} style={{ minWidth: 0 }}>
                <option value="admin">Admin</option>
                <option value="supplier">Supplier</option>
              </select>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} style={{ minWidth: 0 }}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
              <input type="text" placeholder="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className={`w-full pl-4 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'}`} style={{ minWidth: 0 }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
              <button type="button" onClick={() => { setShowEdit(false); setForm(initialForm); setEditId(null); }} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer transition-all">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow cursor-pointer transition-all">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className={`p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm border-2 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 via-white to-orange-100 border-orange-300'}`}> 
            <h3 className={`text-xl sm:text-2xl font-extrabold mb-4 tracking-tight text-center ${isDark ? 'text-yellow-200' : 'text-orange-700'}`}>Delete User</h3>
            <p className={`mb-6 text-center ${isDark ? 'text-yellow-100' : 'text-orange-700'}`}>Are you sure you want to delete this user?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold cursor-pointer transition-all">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow cursor-pointer transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}