import React, { useState } from "react";
import { BellIcon, SearchIcon, XIcon, LayoutDashboardIcon } from "lucide-react";

interface Notification {
  id: string | number;
  message: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
  lu: boolean;
}

interface DashboardHeaderProps {
  nomProgramme?: string;
  notifications?: Notification[];
  onSearchProject?: (query: string) => void;
}

// const notifStyle: Record<Notification["type"], string> = {
//   info:    "bg-blue-50 border-blue-200 text-blue-800",
//   warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
//   success: "bg-green-50 border-green-200 text-green-800",
//   error:   "bg-red-50 border-red-200 text-red-800",
// };

const notifDot: Record<Notification["type"], string> = {
  info: "bg-blue-500",
  warning: "bg-yellow-500",
  success: "bg-green-500",
  error: "bg-red-500",
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  nomProgramme,
  notifications = [],
  onSearchProject,
}) => {
  const [showNotif, setShowNotif] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const nonLus = notifications.filter((n) => !n.lu).length;

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchProject) {
      onSearchProject(searchVal);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Titre */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <LayoutDashboardIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-gray-500">
            Vue d'ensemble — Exécution PTBA
            {nomProgramme && (
              <span className="ml-1 text-blue-600 font-medium">
                · {nomProgramme}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Barre de recherche rapide */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet…"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchKey}
            className="pl-9 pr-10 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 shadow-sm"
          />
          {searchVal && (
            <button
              onClick={() => {
                setSearchVal("");
                onSearchProject?.("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Cloche notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition"
          >
            <BellIcon className="w-4.5 h-4.5 text-gray-600 w-5 h-5" />
            {nonLus > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
                {nonLus > 9 ? "9+" : nonLus}
              </span>
            )}
          </button>

          {/* Dropdown notifications */}
          {showNotif && (
            <div className="absolute right-0 top-11 z-50 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">
                  Notifications
                </span>
                <span className="text-xs text-gray-400">
                  {nonLus} non lu{nonLus !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400 italic">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                        !n.lu ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notifDot[n.type]}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100">
                <button className="text-xs text-blue-600 font-medium hover:underline">
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;