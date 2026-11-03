import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

const EXCEL_URL =
  "/documents/construction-management/Quantity%20Report.xlsx";

const IMAGE_PATH = "/images/construction-management/quantity-takeoff/";

const calculationImages = [
  {
    title: "Architectural Item Catalog",
    description:
      "Architectural work packages organised within the Navisworks Item Catalog.",
    image: "01-architectural-item-catalog.jpg",
  },
  {
    title: "Structural Item Catalog",
    description:
      "Structural elements classified and mapped to their corresponding work breakdown structure.",
    image: "02-structural-item-catalog.jpg",
  },
  {
    title: "Reinforcement Calculation",
    description:
      "Custom calculation rules for estimating reinforcement quantities based on model volumes.",
    image: "03-rebar-calculation.jpg",
  },
  {
    title: "Concrete Pouring Calculation",
    description:
      "Concrete quantities calculated from model volumes, including a 5% allowance.",
    image: "04-concrete-calculation.jpg",
  },
  {
    title: "Concrete Shuttering Calculation",
    description:
      "Formwork quantities derived from the geometric properties of structural elements.",
    image: "05-shuttering-calculation.jpg",
  },
];

export default function QuantityTakeoff() {
  const [workbook, setWorkbook] = useState(null);
  const [activeSheet, setActiveSheet] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExcel() {
      try {
        const response = await fetch(EXCEL_URL);

        if (!response.ok) {
          throw new Error("Excel file could not be found.");
        }

        const buffer = await response.arrayBuffer();
        const file = XLSX.read(new Uint8Array(buffer), {
          type: "array",
        });

        setWorkbook(file);
        setActiveSheet(file.SheetNames[0]);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadExcel();
  }, []);

  const rows = useMemo(() => {
    if (!workbook || !activeSheet) return [];

    return XLSX.utils.sheet_to_json(
      workbook.Sheets[activeSheet],
      {
        header: 1,
        defval: "",
        raw: false,
      }
    );
  }, [workbook, activeSheet]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    const query = search.toLowerCase();

    return rows.filter((row) =>
      row.some((cell) =>
        String(cell).toLowerCase().includes(query)
      )
    );
  }, [rows, search]);

  return (
    <section className="mt-14 space-y-10">

      {/* Methodology */}
      <div>
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Project 01 / Quantity Management
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Quantity Take-Off & Model-Based Quantification
          </h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
          <h3 className="mb-3 text-lg font-semibold text-white">
            Methodology
          </h3>

          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p>
              Navisworks Manage was used to develop the Item Catalog
              and extract model-based quantities from the federated
              BIM model. Custom Item Calculation formulas and Item
              Map Rules were defined to retrieve geometric properties
              such as volume, area, length and height directly from
              Revit elements.
            </p>

            <p>
              Model elements were organised into selection sets and
              mapped to the corresponding Work Breakdown Structure
              (WBS), enabling structured quantity take-off and
              resource mapping.
            </p>

            <p>
              The quantification process covered three main
              structural work categories: reinforcement, concrete
              pouring and concrete shuttering. Architectural
              quantities, including wall finishes, insulation,
              flooring, doors and windows, were also measured using
              model properties and predefined calculation rules.
            </p>

            <p>
              The resulting quantities were consolidated into an
              Excel workbook to support resource planning, cost
              estimation and construction scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Calculation Screenshots */}
      <div>
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-white">
            Quantity Calculation Workflow
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Navisworks Item Catalog, mapping rules and custom
            calculation settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {calculationImages.map((item, index) => (
            <div
              key={item.image}
              className={`overflow-hidden rounded-xl border border-slate-700 bg-slate-900 ${
                index === 4 ? "md:col-span-2" : ""
              }`}
            >
              <div className="bg-slate-800">
                <img
                  src={`${IMAGE_PATH}${item.image}`}
                  alt={item.title}
                  className="h-auto w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="p-4">
                <h4 className="font-medium text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Excel Visualiser */}
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white">

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Project 01 / Construction Management
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Quantity Report
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Interactive Excel Workbook Viewer
            </p>
          </div>

          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            EXCEL DATA
          </span>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-300">
            Loading Quantity Report...
          </p>
        ) : error ? (
          <p className="p-8 text-red-300">
            Unable to load Quantity Report: {error}
          </p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto border-b border-slate-700 px-4 py-3">
              {workbook.SheetNames.map((sheetName) => (
                <button
                  key={sheetName}
                  onClick={() => {
                    setActiveSheet(sheetName);
                    setSearch("");
                  }}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm transition ${
                    activeSheet === sheetName
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {sheetName}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <p className="font-medium text-slate-200">
                  {activeSheet}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredRows.length} rows displayed
                </p>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search in this sheet..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 sm:w-72"
              />
            </div>

            <div className="max-h-[650px] overflow-auto">
              {filteredRows.length > 0 ? (
                <table className="min-w-max border-collapse text-left text-xs">
                  <tbody>
                    {filteredRows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          rowIndex === 0
                            ? "sticky top-0 z-10 bg-slate-800 font-semibold text-blue-200"
                            : "border-t border-slate-800 text-slate-300 hover:bg-slate-800/70"
                        }
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="whitespace-nowrap border-r border-slate-800 px-4 py-3"
                          >
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-8 text-center text-sm text-slate-500">
                  No data available in this sheet.
                </p>
              )}
            </div>
          </>
        )}

        <div className="border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
          Source: Quantity Report.xlsx
        </div>
      </div>
    </section>
  );
}