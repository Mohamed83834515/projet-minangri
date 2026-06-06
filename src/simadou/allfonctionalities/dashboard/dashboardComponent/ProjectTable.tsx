import React, { useState, useMemo } from "react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  // TrendingUpIcon,
  ExternalLinkIcon,
} from "lucide-react";

export interface ProjetRow {
  id: string | number;
  sigle: string;
  nom_projet: string;
  logo?: string;
  date_demarrage: string;
  date_cloture: string;
  budget_prevu: number;
  montant_decaisse: number;
  taux_decaissement: number;
  taux_avancement_technique: number;
  statut: "actif" | "clôturé" | "suspendu";
  bailleur?: string;
  delai_consomme?: number; // en %
}

interface ProjectTableProps {
  projets: ProjetRow[];
  onProjetClick?: (projet: ProjetRow) => void;
  pageSize?: number;
}

const statutStyle: Record<
  ProjetRow["statut"],
  { label: string; cls: string }
> = {
  actif:     { label: "Actif",     cls: "bg-green-100 text-green-700" },
  clôturé:   { label: "Clôturé",   cls: "bg-gray-100 text-gray-600" },
  suspendu:  { label: "Suspendu",  cls: "bg-orange-100 text-orange-700" },
};

const ProgressBar: React.FC<{ value: number; color?: string }> = ({
  value,
  // color = "bg-blue-500",
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const barColor =
    clamped >= 75
      ? "bg-green-500"
      : clamped >= 40
      ? "bg-yellow-400"
      : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 min-w-[36px] text-right">
        {clamped.toFixed(0)}%
      </span>
    </div>
  );
};

const formatMontant = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("fr-FR");
};

const ProjectTable: React.FC<ProjectTableProps> = ({
  projets,
  onProjetClick,
  pageSize = 10,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return projets;
    return projets.filter(
      (p) =>
        p.sigle.toLowerCase().includes(q) ||
        p.nom_projet.toLowerCase().includes(q) ||
        (p.bailleur && p.bailleur.toLowerCase().includes(q))
    );
  }, [projets, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Avancement technique et financier par projet
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {filtered.length} projet{filtered.length !== 1 ? "s" : ""} actif
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Recherche */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet, bailleur…"
            value={search}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Sigle / Projet
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Bailleur
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Démarrage
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Clôture
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Consommé (%)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                Prévu (GNF)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                Décaissé (GNF)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Taux Décais.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Avancement Tech.
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-6 py-12 text-center text-gray-400 text-sm italic"
                >
                  Aucun projet trouvé
                </td>
              </tr>
            ) : (
              pageData.map((projet, idx) => {
                const s = statutStyle[projet.statut];
                return (
                  <tr
                    key={projet.id}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                    onClick={() => onProjetClick?.(projet)}
                  >
                    {/* Sigle */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold uppercase">
                          {projet.logo ? (
                            <img
                              src={projet.logo}
                              alt={projet.sigle}
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                          ) : (
                            projet.sigle.slice(0, 2)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {projet.sigle}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">
                            {projet.nom_projet}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 font-medium">
                      {projet.bailleur ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      {new Date(projet.date_demarrage).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      {new Date(projet.date_cloture).toLocaleDateString("fr-FR")}
                    </td>
                    {/* Délai consommé */}
                    <td className="px-4 py-4 min-w-[120px]">
                      <ProgressBar value={projet.delai_consomme ?? 0} />
                    </td>
                    {/* Montants */}
                    <td className="px-4 py-4 text-right font-semibold text-gray-800 text-sm">
                      {formatMontant(projet.budget_prevu)}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-blue-700 text-sm">
                      {formatMontant(projet.montant_decaisse)}
                    </td>
                    {/* Taux décaissement */}
                    <td className="px-4 py-4 min-w-[120px]">
                      <ProgressBar value={projet.taux_decaissement} />
                    </td>
                    {/* Avancement technique */}
                    <td className="px-4 py-4 min-w-[130px]">
                      <ProgressBar value={projet.taux_avancement_technique} />
                    </td>
                    {/* Statut */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}
                      >
                        {s.label}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="px-4 py-4 text-center">
                      <button className="text-gray-300 hover:text-blue-500 transition-colors">
                        <ExternalLinkIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-500">
          Page {page} sur {totalPages} — {filtered.length} résultat
          {filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pg =
              totalPages <= 5
                ? i + 1
                : Math.min(Math.max(page - 2 + i, 1), totalPages);
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`w-7 h-7 text-xs rounded-lg font-medium transition ${
                  pg === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
              >
                {pg}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;