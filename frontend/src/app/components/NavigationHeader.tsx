import { motion } from "motion/react";
import { Home, Settings, HelpCircle, User, LogOut, Menu, X, FileText } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface NavigationHeaderProps {
  userName?: string;
  userAvatar?: string;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
}

export function NavigationHeader({
  userName,
  userAvatar,
  currentScreen,
  onNavigate,
  onLogout,
}: NavigationHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { id: "stage-selection", label: "Home", icon: Home },
    { id: "dashboard", label: "Progress", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
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
              onClick={() => onNavigate("stage-selection")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                <span className="text-lg text-white">R</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="text-lg text-[#1F2430]">Readlr</h1>
                <p className="text-[10px] uppercase tracking-wider text-[#8A91A3]">Learn to Read</p>
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
                        ? "bg-white text-[#4F46E5] border border-[#1F243014]"
                        : "text-[#4B5266] hover:bg-white hover:text-[#1F2430]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            {userName && (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right leading-tight">
                  <p className="text-sm text-[#1F2430]">{userName}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#8A91A3]">Grade 1</p>
                </div>
                <button
                  onClick={() => onNavigate("profile")}
                  className="w-10 h-10 bg-white border border-[#1F243014] rounded-full flex items-center justify-center text-xl hover:ring-2 hover:ring-[#4F46E5] transition-all"
                  title="My Profile"
                >
                  {userAvatar}
                </button>
                {onLogout && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-2 text-[#8A91A3] hover:text-[#DC2626] hover:bg-white rounded-lg transition-colors"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white rounded-2xl border border-[#1F243014]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#1F2430] text-xl">
                          Leaving so soon? 👋
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[#4B5266]">
                          Are you sure you want to log out? Your progress is saved!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border border-[#1F243014] text-[#4B5266] hover:bg-[#FAF7F2]">
                          Stay
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onLogout}
                          className="rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                        >
                          Yes, log out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#1F2430] hover:bg-white rounded-lg"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed inset-0 z-40 bg-[#FAF7F2] md:hidden"
        >
          <div className="p-6 space-y-2">
            {userName && (
              <div className="flex items-center gap-3 pb-6 mb-2 border-b border-[#1F243014]">
                <div className="w-14 h-14 bg-white border border-[#1F243014] rounded-full flex items-center justify-center text-2xl">
                  {userAvatar}
                </div>
                <div>
                  <p className="text-lg text-[#1F2430]">{userName}</p>
                  <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Grade 1 Learner</p>
                </div>
              </div>
            )}

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
                  className={`w-full px-4 py-3.5 rounded-xl flex items-center gap-3 text-left transition-colors ${
                    active
                      ? "bg-white border border-[#1F243014] text-[#4F46E5]"
                      : "text-[#4B5266] hover:bg-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}

            {onLogout && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full px-4 py-3.5 rounded-xl flex items-center gap-3 text-left text-[#DC2626] hover:bg-white transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-2xl border border-[#1F243014]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#1F2430] text-xl">
                      Leaving so soon? 👋
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#4B5266]">
                      Are you sure you want to log out? Your progress is saved!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border border-[#1F243014] text-[#4B5266] hover:bg-[#FAF7F2]">
                      Stay
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => { onLogout(); setMenuOpen(false); }}
                      className="rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                    >
                      Yes, log out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
