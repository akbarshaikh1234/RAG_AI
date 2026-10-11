import { createContext, useContext, useState } from "react";


const SidebarContext = createContext<{
  isExpanded: boolean;
  toggleSidebar: () => void;
} | undefined>(undefined);


const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const providerValue = {
    isExpanded,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={providerValue}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

export { SidebarProvider, useSidebar };