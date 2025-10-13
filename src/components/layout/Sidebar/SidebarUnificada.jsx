// SidebarUnificada.jsx
// @ts-nocheck
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Sidebar/button";
import { Sheet, SheetContent } from "@/components/ui/Sidebar/sheet";
import { Menu, LogOut, User, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";

const ICON_SIZE = "h-6 w-6";
const TEXT_SIZE = "text-base";
const TITLE_SIZE = "text-xl";

const SidebarUnificada = ({ menuItems, userInfo, isOpen, onOpenChange }) => {
  const { isExpanded, isMobile, toggleSidebar } = useSidebar();

  const UserProfile = ({ isCollapsed = false }) => (
    <div className="p-4 border-t border-white/10 flex-shrink-0">
      {!isCollapsed ? (
        <div className="space-y-2">
          <div className="flex items-center gap-4 px-3 py-3 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium text-white ${TEXT_SIZE} transition-colors duration-300`}
              >
                {userInfo.name}
              </p>
              <p className="text-sm text-white/50 truncate transition-colors duration-300">
                {userInfo.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white/60 hover:text-white hover:bg-white/5 h-auto py-3 ${TEXT_SIZE} transition-all duration-300 hover:translate-x-1`}
          >
            <LogOut className="h-5 w-5 mr-3 transition-transform duration-300" />
            <span className="font-normal">Sair</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12">
            <User className="h-6 w-6 text-white" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10 h-10 w-10 transition-all duration-300 hover:scale-110"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );

  const MenuItems = ({ onItemClick = () => {}, collapsed = false }) => (
    <nav className="flex-1 py-2 overflow-y-auto px-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg
              transition-all duration-300 ease-out
              ${
                isActive
                  ? "bg-[#1A5276] text-white shadow-lg scale-[1.02]"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5 hover:scale-[1.01] hover:shadow-md"
              }
              ${collapsed && "justify-center px-2"}
            `}
            title={collapsed ? item.title : ""}
            onClick={onItemClick}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "opacity-100 scale-110"
                      : "opacity-60 hover:scale-105"
                  }`}
                >
                  <Icon className={ICON_SIZE} />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`font-normal max-w-full break-words ${TEXT_SIZE}`}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        onClick={() => onOpenChange(true)}
        style={{ backgroundColor: "#406882" }}
      >
        <Menu className="h-6 w-6" />
        <span className="font-semibold text-white text-base leading-none">
          Menu
        </span>
      </Button>

      <SheetContent
        side="left"
        className="w-[280px] p-0 border-none"
        style={{
          backgroundColor: "#406882",
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <h2 className={`font-semibold text-white ${TITLE_SIZE}`}>Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-10 w-10 transition-all duration-300 hover:rotate-90"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <MenuItems onItemClick={() => onOpenChange(false)} />
          <UserProfile />
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopSidebar = () => (
    <div className="relative overflow-x-hidden">
      <motion.aside
        animate={{ width: isExpanded ? 280 : 72 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col fixed top-0 left-0 h-screen shadow-xl z-40"
        style={{ backgroundColor: "#406882" }}
      >
        <div className="px-6 pt-6 pb-4 flex justify-between items-center overflow-hidden">
          <AnimatePresence>
            {isExpanded && (
              <motion.h2
                key="title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`font-semibold text-white ${TITLE_SIZE}`}
              >
                Menu
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        <MenuItems collapsed={!isExpanded} />
        <UserProfile isCollapsed={!isExpanded} />
      </motion.aside>

      <div
        className={`fixed top-0 h-screen z-50 transition-all duration-500 ease-in-out pointer-events-none`}
        style={{
          width: "20px",
          backgroundColor: "#A5C7CB",
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
          left: isExpanded ? 280 : 72,
        }}
      >
        <Button
          variant="default"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-1/2 -translate-y-1/2 -left-5 rounded-full h-10 w-10 pointer-events-auto"
          style={{
            backgroundColor: "#A5C7CB",
            color: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
          title={isExpanded ? "Recolher menu" : "Expandir menu"}
          aria-label={isExpanded ? "Recolher menu" : "Expandir menu"}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            whileHover={{ rotate: isExpanded ? 180 : 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {isExpanded ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </motion.div>
        </Button>
      </div>
    </div>
  );

  return <>{isMobile ? <MobileMenu /> : <DesktopSidebar />}</>;
};

export default SidebarUnificada;
