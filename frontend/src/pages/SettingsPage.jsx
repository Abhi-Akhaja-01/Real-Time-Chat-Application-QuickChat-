import { useThemeStore } from "../store/useThemeStore";
import { Bell, ChevronRight, Info, Lock, Moon, Sun, User, X } from "lucide-react";
import { Link } from "react-router-dom";

const THEMES = [
  { id: "light", name: "Classic Light", icon: <Sun size={20} className="text-zinc-400" /> },
  { id: "dark", name: "Dark", icon: <Moon size={20} className="text-zinc-400" /> },
  { id: "cupcake", name: "Default", icon: <Sun size={20} className="text-primary" /> },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8 relative">
        <Link
          to="/"
          className="absolute right-4 top-8 p-2 rounded-full hover:bg-base-200 transition-colors"
        >
          <X className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-8">
          {/* Appearance Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary" /> Appearance
            </h2>
            <div className="bg-base-200 rounded-2xl p-6">
              <p className="text-sm text-base-content/70 mb-6">Choose your preferred interface style</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all border-2 ${
                      theme === t.id 
                        ? "bg-primary/10 border-primary shadow-sm" 
                        : "bg-base-100 border-transparent hover:border-base-content/20"
                    }`}
                    onClick={() => setTheme(t.id)}
                  >
                    <div className={`p-2 rounded-lg ${theme === t.id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/70"}`}>
                      {t.icon}
                    </div>
                    <div className="text-left">
                      <span className="font-bold block">{t.name}</span>
                      <span className="text-[10px] opacity-60">Click to apply</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>


        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
