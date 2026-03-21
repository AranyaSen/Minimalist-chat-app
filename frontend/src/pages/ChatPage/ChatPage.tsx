import { useState, useEffect } from "react";
import { Loader } from "@/components/Loader/Loader";
import Nav from "@/components/Nav/Nav";
import Texting from "@/components/Texting/Texting";
import { User } from "@/pages/ChatPage/Chat.types";
import { getUsers } from "@/services/userService/userService";

export const ChatPage = () => {
  // STATE VARIABLES
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const handleUser = (user: User) => {
    setUserId(user._id);
  };

  const getUsersList = async () => {
    try {
      const res = await getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsersList();
  }, []);

  if (users.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <Nav />
      <div className="w-full flex justify-center">
        <div className="flex rounded-md w-[95%] h-[80vh] gap-20 max-md:w-[90%] max-md:px-4 max-md:py-8">
          <div className="relative w-1/5 h-full flex justify-center items-center shadow-[0_10px_20px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-center w-full h-full overflow-y-auto bg-primary rounded-[20px] [&::-webkit-scrollbar]:w-0 max-md:h-full max-md:gap-[15px] max-md:rounded-lg">
              {users.map((user, index) => (
                <div
                  className="w-full cursor-pointer h-[90px] border-b border-[#878296] last:border-b-0 hover:bg-primary-hover transition-colors duration-300 max-md:w-[80%] max-md:h-auto"
                  key={index}
                  onClick={() => handleUser(user)}
                >
                  <div className="flex gap-3 px-5 py-2">
                    <div className="w-[65px] h-[65px]">
                      <img
                        className="w-full h-full rounded-full"
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}/image`}
                        alt={user.name}
                      />
                    </div>
                    {/* <div className="flex h-full items-center">
                      {user._id === loginId ? (
                        <span className="font-medium">You</span>
                      ) : (
                        <span className="font-medium">{user.name}</span>
                      )}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-4/5 h-full shadow-[0_10px_20px_rgba(0,0,0,0.25)]">
            <Texting receiverId={userId || ""} />
          </div>
        </div>
      </div>
    </>
  );
};
