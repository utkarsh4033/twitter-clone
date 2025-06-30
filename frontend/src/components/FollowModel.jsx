import React from "react";
import { useSelector } from "react-redux";
import { useAllUsers } from "../query/useUsers";

function Sidebar() {
  const { user, token } = useSelector((state) => state.auth);
  const { data: users, isLoading, error } = useAllUsers(token);

  return (
    <div className="hidden lg:block w-80 p-4">
      <div className="bg-gray-50 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Who to follow</h2>
        <div className="space-y-3">
          {isLoading && <div>Loading users...</div>}
          {error && <div className="text-red-500">Error loading users</div>}
          {users && users.filter(u => u.users_id !== user?.users_id).map((u) => (
            <div className="flex items-center justify-between" key={u.users_id}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-lg text-white bg-blue-500">
                  {u.users_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{u.users_name}</p>
                  <p className="text-gray-500 text-sm">@{u.users_name.toLowerCase().replace(/\s+/g, "")}</p>
                </div>
              </div>
              <button className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-gray-800">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;