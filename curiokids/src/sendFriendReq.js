import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function FriendRequest() {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/search-users?query=${search}`);
        const data = await response.json();
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [search]);

  const sendRequest = (id) => {
    setSentRequests(new Set([...sentRequests, id]));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        <input
          className="pl-10 w-full p-2 border rounded-md"
          type="text"
          placeholder="Search for a user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mt-4 space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-3 flex justify-between items-center border rounded-md">
            <span>{user.username}</span>
            <button
              onClick={() => sendRequest(user.id)}
              disabled={sentRequests.has(user.id)}
              className={`ml-2 px-4 py-2 rounded-md text-white ${sentRequests.has(user.id) ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {sentRequests.has(user.id) ? "Request Sent" : "Send Request"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
