/**
 * RoleToggle - Toggle buttons for selecting user role
 * @param {string} selectedRole - Currently selected role
 * @param {Function} onRoleChange - Callback when role changes
 */
export const RoleToggle = ({ selectedRole, onRoleChange }) => {
  const roles = [
    { id: "admin", label: "Admin" },
    { id: "employee", label: "Employee" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Login as
      </label>
      <div className="flex gap-3">
        {roles.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onRoleChange(id)}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              selectedRole === id
                ? "bg-silver text-black font-semibold"
                : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
