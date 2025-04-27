const UserTable = ({ users, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <TableHeader />
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <TableRow key={user._id} user={user} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHeader = () => (
  <thead>
    <tr className="border-b border-gray-200">
      <th className="text-left py-6 text-xs tracking-[0.2em] font-light text-gray-500">
        USERNAME
      </th>
      <th className="text-left py-6 text-xs tracking-[0.2em] font-light text-gray-500">
        EMAIL
      </th>
      <th className="text-left py-6 text-xs tracking-[0.2em] font-light text-gray-500">
        ROLE
      </th>
      <th className="text-right py-6 text-xs tracking-[0.2em] font-light text-gray-500">
        ACTIONS
      </th>
    </tr>
  </thead>
);

const TableRow = ({ user, onDelete }) => (
  <tr className="hover:bg-[#F7F3EE] transition-colors">
    <td className="py-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-serif text-gray-500">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-sm font-light">{user.username}</span>
      </div>
    </td>
    <td className="py-5 text-sm font-light text-gray-600">{user.email}</td>
    <td className="py-5">
      {user.isAdmin ? (
        <span className="text-xs tracking-[0.2em] bg-black text-white px-3 py-1 rounded-full">
          ADMIN
        </span>
      ) : (
        <span className="text-xs tracking-[0.2em] text-gray-500 font-light">
          USER
        </span>
      )}
    </td>
    <td className="py-5 text-right">
      {user.isAdmin ? (
        <span className="text-xs tracking-[0.2em] text-gray-400 font-light">
          PROTECTED
        </span>
      ) : (
        <button
          onClick={() => onDelete(user._id)}
          className="text-xs tracking-[0.2em] text-red-500 hover:text-red-700 font-light transition-colors"
        >
          DELETE
        </button>
      )}
    </td>
  </tr>
);

export default UserTable;
