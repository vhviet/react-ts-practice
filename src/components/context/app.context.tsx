import { createContext, useContext, useState } from "react";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: IUser | null;
  setUser: (value: IUser) => void;
}

type TProps = {
  children: React.ReactNode;
};

const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      {props.children}
    </CurrentAppContext.Provider>
  );
};

// Custom hook
export const useCurrentApp = () => {
  const currentAppContext = useContext(CurrentAppContext);

  if (!currentAppContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentAppContext.Provider>"
    );
  }

  return currentAppContext;
};