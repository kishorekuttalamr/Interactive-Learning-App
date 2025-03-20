import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Cookies from "js-cookie";

export default function FriendRequest() {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());

  const userSubjects = document.cookie
    .split("; ")
    .find((row) => row.startsWith("selectedSubjects="))
    ?.split("=")[1]
    ?.split(",") || [];

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const usertype = document.cookie
          .split("; ")
          .find((row) => row.startsWith("usertype="))
          ?.split("=")[1];

        const response = await fetch(
          `http://localhost:5000/search-users?query=${search}`,
          { credentials: "include" }
        );
        const data = await response.json();

        const updatedUsers = data.map((user) => ({
          ...user,
          commonSubjects: user.selectedSubjects?.filter((subject) =>
            userSubjects.includes(subject)
          ) || [],
        }));

        setFilteredUsers(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [search]);

  const sendRequest = async (id) => {
    try{
        const sid = Cookies.get("userId");
        const response = await fetch(`http://localhost:5000/send-request?senderId=${sid}&receiverId=${id}`, {
            method: "POST",  // Specify the HTTP method
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
        const data = await response.json();
        console.log(data);
        setSentRequests((prev) => new Set(prev).add(id));

    }catch(error){
        console.log("Error in sending request:", error.message)
    }
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
          <div key={user._id} className="p-3 border rounded-md">
            <span>{user.childUsername}</span>
            <span className="font-medium">{user.username}</span>
            {user.commonSubjects.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                You have {user.commonSubjects.length} subject
                {user.commonSubjects.length > 1 ? "s" : ""} in common:{" "}
                {user.commonSubjects.join(", ")}
              </p>
            )}
            <button
              onClick={() => sendRequest(user._id)}
              disabled={sentRequests.has(user._id)}
              className={`ml-2 px-4 py-2 rounded-md text-white ${
                sentRequests.has(user._id)
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {sentRequests.has(user._id) ? "Request Sent" : "Send Request"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
