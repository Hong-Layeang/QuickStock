import Header from "../../components/admin/Header.jsx";
import SideBar from "../../components/admin/SideBar.jsx";
import React, { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import AdminLayout from "../../components/admin/AdminLayout.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "supplier",
};

export default function Users() {
  const { users, loading, error, fetchUsers, createUser, editUser, deleteUser } = useUserStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u =>
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase()))
  );

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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Users</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage all users here.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition-all">+ Add User</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        {loading && <div className="text-center py-8 text-orange-600 font-semibold">Loading...</div>}
        {error && <div className="text-center py-8 text-red-500 font-semibold">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-semibold">Name</th>
                  <th className="py-3 text-left font-semibold">Email</th>
                  <th className="py-3 text-left font-semibold">Role</th>
                  <th className="py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">No users found.</td></tr>
                ) : filtered.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-orange-50 dark:hover:bg-gray-800/40 transition">
                    <td className="py-3 font-medium">{u.name || '-'}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3 capitalize">{u.role}</td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => { setShowEdit(true); setEditId(u.id); setForm({ name: u.name, email: u.email, password: '', role: u.role }); }} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Edit</button>
                      <button onClick={() => setDeleteId(u.id)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
                      {/* <button className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">Assign Products</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleAdd} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold mb-2">Add User</h3>
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
              <option value="admin">Admin</option>
              <option value="supplier">Supplier</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowAdd(false); setForm(initialForm); }} className="px-4 py-2 rounded-xl bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-orange-600 text-white">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleEdit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold mb-2">Edit User</h3>
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            <input type="password" placeholder="Password (leave blank to keep)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
              <option value="admin">Admin</option>
              <option value="supplier">Supplier</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowEdit(false); setForm(initialForm); setEditId(null); }} className="px-4 py-2 rounded-xl bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Delete User</h3>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl bg-gray-200">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 