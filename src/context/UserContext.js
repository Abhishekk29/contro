import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // all users including friends
  const [currentUser, setCurrentUser] = useState(null); // logged-in user

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  const addFriend = (friendId) => {
    if (!currentUser.friends.includes(friendId)) {
      setCurrentUser({
        ...currentUser,
        friends: [...currentUser.friends, friendId],
      });
    }
  };

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser, addUser, addFriend }}>
      {children}
    </UserContext.Provider>
  );
};
