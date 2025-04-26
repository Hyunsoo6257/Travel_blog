const UserTable = ({ users, onDelete }) => {
  return (
    <div>
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
      <th className="text-left py-6 text-xs tracking-[0.2em] font-light text-gray-500">
        ACTIONS
      </th>
    </tr>
  </thead>
);

const TableRow = ({ user, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="py-5 text-sm font-light">
      <div className="flex items-center gap-3">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-500">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {user.username}
      </div>
    </td>
    <td className="py-5 text-sm font-light text-gray-600">{user.email}</td>
    <td className="py-5 text-sm font-light">
      {user.isAdmin ? (
        <span className="text-xs tracking-wider bg-black text-white px-2 py-1">
          ADMIN
        </span>
      ) : (
        <span className="text-xs tracking-wider text-gray-500">USER</span>
      )}
    </td>
    <td className="py-5">
      {user.isAdmin ? (
        <button
          disabled
          className="text-gray-400 text-xs tracking-wider cursor-not-allowed"
        >
          PROTECTED
        </button>
      ) : (
        <button
          onClick={() => onDelete(user._id)}
          className="text-red-500 hover:text-red-700 text-xs tracking-wider"
        >
          DELETE
        </button>
      )}
    </td>
  </tr>
);

export default UserTable;
