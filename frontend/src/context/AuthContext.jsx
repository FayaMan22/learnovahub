import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    sessionStorage.getItem("token")
  );

  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  function loginUser(tokenValue, userData) {
    sessionStorage.setItem("token", tokenValue);

    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(tokenValue);
    setUser(userData);
  }

  function logoutUser() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}