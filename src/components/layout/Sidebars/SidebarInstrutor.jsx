// @ts-nocheck
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Menu,
  Calendar,
  LogOut,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckSquare,
  FileText,
} from "lucide-react";

const ICON_SIZE = "h-6 w-6";
const TEXT_SIZE = "text-base";
const TITLE_SIZE = "text-xl";

const SidebarInstrutor = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      title: "Minha Agenda",
      icon: Calendar,
      path: "/instrutor/agenda",
    },
    {
      title: "Meus Alunos",
      icon: Users,
      path: "/instrutor/alunos",
    },
    {
      title: "Registro de Faltas / Presenças",
      icon: CheckSquare,
      path: "/instrutor/registro",
    },
    {
      title: "Fichas de Evolução",
      icon: FileText,
      path: "/instrutor/fichas",
    },
  ];

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 text-white shadow-lg h-10 w-10"
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: "#406882" }}
      >
        <Menu className="h-7 w-7" />
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
        <nav className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <h2 className={`font-semibold text-white ${TITLE_SIZE}`}>Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-10 w-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 py-2 overflow-y-auto px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#1A5276] text-white"
                        : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <div className={isActive ? "opacity-100" : "opacity-60"}>
                        <Icon className={ICON_SIZE} />
                      </div>
                      <span
                        className={`font-normal max-w-full break-words ${TEXT_SIZE}`}
                      >
                        {item.title}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center gap-4 px-3 py-3 rounded-lg bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-white ${TEXT_SIZE}`}>
                  Instrutor
                </p>
                <p className="text-sm text-white/50 truncate">
                  instrutor@email.com
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start text-white/60 hover:text-white hover:bg-white/5 h-auto py-3 ${TEXT_SIZE}`}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-normal">Sair</span>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  const DesktopSidebar = () => (
    <div className="relative overflow-x-hidden">
      <aside
        className={`
          flex flex-col
          fixed top-0 left-0 h-screen
          shadow-xl
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-[280px]" : "w-[72px]"}
          z-40
        `}
        style={{
          backgroundColor: "#406882",
        }}
      >
        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
          {isExpanded && (
            <h2 className={`font-semibold text-white ${TITLE_SIZE}`}>Menu</h2>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#1A5276] text-white"
                      : "text-white/60 hover:text-white/90 hover:bg-white/5"
                  }
                  ${!isExpanded && "justify-center px-2"}
                `}
                title={!isExpanded ? item.title : ""}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex items-center justify-center ${
                        isActive ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <Icon className={ICON_SIZE} />
                    </div>
                    {isExpanded && (
                      <span
                        className={`font-normal max-w-full break-words ${TEXT_SIZE}`}
                      >
                        {item.title}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {isExpanded && (
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center gap-4 px-3 py-3 rounded-lg bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-white ${TEXT_SIZE}`}>
                  Instrutor
                </p>
                <p className="text-sm text-white/50 truncate">
                  instrutor@email.com
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start text-white/60 hover:text-white hover:bg-white/5 h-auto py-3 ${TEXT_SIZE}`}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-normal">Sair</span>
            </Button>
          </div>
        )}

        {!isExpanded && (
          <div className="p-4 border-t border-white/10 flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10 h-10 w-10"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </aside>

      <div
        className={`
          fixed top-0 h-screen
          transition-all duration-300 ease-in-out
          z-50
          ${isExpanded ? "left-[280px]" : "left-[72px]"}
        `}
        style={{
          width: "20px",
          backgroundColor: "#A5C7CB",
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
        }}
      >
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            absolute top-1/2 -translate-y-1/2 -left-5 rounded-full h-10 w-10 
            transition-all duration-300 ease-in-out
          `}
          style={{
            backgroundColor: "#A5C7CB",
            color: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
          title={isExpanded ? "Recolher menu" : "Expandir menu"}
          aria-label={isExpanded ? "Recolher menu" : "Expandir menu"}
        >
          {isExpanded ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );

  return <>{isMobile ? <MobileMenu /> : <DesktopSidebar />}</>;
};

export default SidebarInstrutor;
