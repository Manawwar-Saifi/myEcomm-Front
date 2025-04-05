import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const url = `${backend_url}/user/all`;

  useEffect(() => {
    const users = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setUsers(result.Users);
      } catch (error) {
        console.log("Fetching User in admin Error::", error);
      }
    };
    users();
  }, [url]);

  const toggleUserRole = async (userId) => {
    try {
      const response = await fetch(
        `${backend_url}/user/toggle-role/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`User role updated to ${data.user.role}`);
        // Update local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: data.user.role } : user
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="container bg-light rounded">
        <div className="row fw-bold py-3 bg-dark text-light rounded mb-2">
          <div className="col-3">Photo</div>
          <div className="col-3">Name</div>
          <div className="col-2">Email</div>
          <div className="col-2">Phone</div>
          <div className="col-2">User</div>
        </div>

        {users &&
          users.map((user, index) => (
            <div className="row py-2" key={index}>
              <div className="col-3">
                <span className="mx-2">{index + 1}.</span>
                <img
                  src={`${user.photo}`}
                  alt={user.name}
                  className="w-25"
                />
              </div>
              <div className="col-2">{user.name}</div>
              <div className="col-3">{user.email}</div>
              <div className="col-2">{user.phone}</div>
              <div className="col-2">
                <button
                  onClick={() => toggleUserRole(user._id)}
                  className="btn btn-outline-danger"
                >
                  {user.role}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Users;
