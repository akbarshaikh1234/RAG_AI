import { SidebarProvider } from "@/context/sidebar.provider";
import SideBar from "../sidebar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    return (
    <section className="h-screen grid grid-cols-1 md:grid-cols-[auto_1fr] max-md:grid-rows-[auto_1fr] bg-black">
      <SidebarProvider>
        <SideBar />
        <main  className="flex">
          {children}
        </main>
      </SidebarProvider>
    </section>
  );
}

export default ChatLayout;