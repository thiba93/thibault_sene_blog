// src/pages/users/[userId].jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

const UserPage = () => {
  const {
    query: { userId },
  } = useRouter();

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw new Error("Failed to fetch user data");
    }
  };

  const {
    isLoading,
    isError,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user: {error.message}</div>;
  }

  if (!user || Object.keys(user).length === 0) {
    return <div>No user data available.</div>;
  }

  return (
    <article>
      <h1 className="text-2xl">
        {user.result[0].name} (#{userId})
      </h1>
      <p>{user.result[0].email}</p>
      {/* Add more user details here */}
    </article>
  );
};

export default UserPage;