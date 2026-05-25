import { motion } from "motion/react";
import { Home, BarChart3, Users, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface TeacherNavigationHeaderProps {
  teacherName?: string;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
}

export function TeacherNavigationHeader({
  teacherName,
  currentScreen,
  onNavigate,
  onLogout,
}: TeacherNavigationHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { id: "teacher-dashboard", label: "Overview", icon: Home },
    { id: "teacher-students", label: "Students", icon: Users },
    { id: "teacher-analytics", label: "Analytics", icon: BarChart3 },
    { id: "teacher-reports", label: "Reports", icon: FileText },
    { id: "teacher-settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#1F243014] sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ y: -1 }}
              onClick={() => onNavigate("teacher-dashboard")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 bg-[#1F2430] rounded-lg flex items-center justify-center">
                <span className="text-lg text-white font-bold">R</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="text-lg text-[#1F2430]">Readlr</h1>
                <p className="text-[10px] uppercase tracking-wider text-[#8A91A3]">Teacher Hub</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      active
                        ? "bg-white text-[#1F2430] border border-[#1F243014]"
                        : "text-[#4B5266] hover:bg-white hover:text-[#1F2430]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 md:gap-4">
              {teacherName && (
                <div className="hidden sm:block text-right leading-tight">
                  <p className="text-sm text-[#1F2430]">{teacherName}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#8A91A3]">Educator</p>
                </div>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-[#8A91A3] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-[#4B5266] hover:bg-white rounded-lg transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#1F243014] bg-white"
            >
              <div className="px-4 py-3 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        active
                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                          : "text-[#4B5266] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>
    </>
  );
}
