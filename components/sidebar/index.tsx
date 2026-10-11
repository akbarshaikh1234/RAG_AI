import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useWindowSize } from "@/hooks/useWindowSize";
import { BsLayoutSidebar } from "react-icons/bs";
import { cn } from "@/lib/helpers/cn";
import { useSidebar } from "@/context/sidebar.provider";
import { FaRegEdit } from "react-icons/fa";

const SideBar = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const window = useWindowSize();

  return (
    <div className={cn("md:border-r border-r-[#ffffff2e] max-w-75 overflow-hidden")}>
      <header className={cn("flex items-center p-4 px-5 w-fit md:hidden")}>
        <button
          className="cursor-pointer flex items-center hover:bg-gray-300 focus:outline-none"
          onClick={toggleSidebar}
        >
          <BsLayoutSidebar className="w-4 h-4 text-gray-50" />
        </button>
      </header>
      <motion.aside
        id="sidebar"
        className={cn("flex flex-col gap-4 relative md:h-full max-md:border-r border-r-[#ffffff2e] bg-black", {
          ["absolute z-50 top-0 bottom-0"]: window?.width !== undefined && window.width < 768,
        })}
        initial={false}
        animate={{
          width: (window?.width !== undefined && window?.width >= 768) ? isExpanded ? "300px" : "56px" : "300px",
          translateX: (window?.width !== undefined && window?.width >= 768) ? "none" : isExpanded ? "0%": "-100%"
        }}
        transition={{
          duration: 0.18,
          ease: "easeInOut",
        }}
      >
        <header className={cn("flex items-center p-4 px-5 w-fit")}>
        <button
          className="cursor-pointer flex items-center hover:bg-gray-300 focus:outline-none"
          onClick={toggleSidebar}
        >
          <BsLayoutSidebar className="w-4 h-4 text-gray-50" />
        </button>
      </header>
      
      <SideBarItems items={[
        { icon: <FaRegEdit className="w-4 h-4 text-gray-50" />, label: "New Chat" },
      ]} />
    </motion.aside>

    </div>
    
  );
};

export default SideBar;

const SideBarItems = (props: { items: { icon: any; label: string }[] }) => {
  const { items } = props;
  return (<>
      {items.map((item, index) => (
        <SideBarItem key={index} icon={item.icon} label={item.label} />
      ))}
    </>
  )
};

const SideBarItem = ({ icon, label }: { icon: any; label: string }) => {
  const { isExpanded } = useSidebar();

  return (
    <div className="flex items-center px-5 py-4 rounded-md cursor-pointer hover:bg-gray-200 w-fit">
      <span className="shrink-0">{icon}</span>

      <motion.p
        className="text-gray-200 whitespace-nowrap"
        title={label}
        initial={false}
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? "auto" : 0,
          marginLeft: isExpanded ? 8 : 0,
        }}
        transition={{
          duration: 0.18,
          delay: isExpanded ? 0.18 : 0.1,
          ease: "easeInOut",
        }}
      >
        {label}
      </motion.p>
    </div>
  );
};