import React, { createContext, useContext, useState } from "react";

interface AuthContextProps {
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    if (!foundUser) throw new Error("Invalid credentials");
    setUser({ email: foundUser.email, role: foundUser.role });
    localStorage.setItem("user", JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
