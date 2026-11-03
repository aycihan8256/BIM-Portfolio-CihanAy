import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

const EXCEL_URL =
  "/documents/construction-management/GR4-CM-WBS%20-%20FINAL.xlsx";

const worksheets = [
  {
    group: "WORK BREAKDOWN STRUCTURE",
    match: "ANALYTIC WBS A",
    label: "Analytic WBS",
    headerRow: 6,
    freezeColumns: 4,
    description: "Analytical Work Breakdown Structure, linking activity codes and descriptions with resource-analysis references, quantities, direct costs and duration information.",
  },
  {
    group: "WORK BREAKDOWN STRUCTURE",
    match: "OBS FINAL_december",
    label: "Operational WBS / OBS",
    headerRow: 6,
    freezeColumns: 3,
    description: "Operative Work Breakdown Structure, showing activities, operative codes and base-scheduling cost and duration information.",
  },
  {
    group: "WORK BREAKDOWN STRUCTURE",
    match: "General WBS F",
    label: "General WBS",
    headerRow: 6,
    freezeColumns: 8,
    description: "Hierarchical WBS organised into Phase, Work, Task and Activity levels, each with its corresponding code.",
  },
  {
    group: "RESOURCE ANALYSIS",
    match: "RASTR 1",
    label: "Resource Analysis — STR 1",
    headerRow: 8,
    freezeColumns: 3,
    description: "Structural Resource Analysis worksheet. Kept separate from the second structural analysis sheet.",
  },
  {
    group: "RESOURCE ANALYSIS",
    match: "RA STR",
    label: "Resource Analysis — STR",
    headerRow: 11,
    freezeColumns: 2,
    description: "Structural Resource Analysis worksheet with activity codes, descriptions, units and resource-cost information.",
  },
  {
    group: "RESOURCE ANALYSIS",
    match: "RA_ARC",
    label: "Resource Analysis — ARCH",
    headerRow: 8,
    freezeColumns: 3,
    description: "Architectural Resource Analysis, organised by architectural work packages and their associated resources.",
  },
  {
    group: "RESOURCE ANALYSIS",
    match: "RA-CSW",
    label: "Resource Analysis — CSW",
    headerRow: 8,
    freezeColumns: 3,
    description: "Construction Site Work Resource Analysis, organised by site-work activity and associated resources.",
  },
  {
    group: "COST PLANNING",
    match: "K parameter",
    label: "K Parameter",
    headerRow: 2,
    freezeColumns: 1,
    description: "Scenario comparison of project duration, direct costs, indirect costs and the K parameter.",
  },
  {
    group: "COST PLANNING",
    match: "IND.COST",
    label: "Indirect Costs",
    headerRow: 5,
    freezeColumns: 3,
    description: "Indirect-cost register, including cost descriptions, notes and fixed or variable cost classification.",
  },
  {
    group: "COST PLANNING",
    match: "Site Layout Indirect costs WBS",
    label: "Site Layout Indirect Costs WBS",
    headerRow: 1,
    freezeColumns: 8,
    description: "WBS breakdown of site-layout activities and tasks related to indirect costs.",
  },
  {
    group: "PROJECT PERFORMANCE",
    match: "EV1",
    label: "Earned Value — EV1",
    headerRow: 3,
    freezeColumns: 4,
    description: "Earned Value worksheet with activity status, duration, planned and actual dates, cost and schedule performance indicators.",
  },
];

const groups = [
  "WORK BREAKDOWN STRUCTURE",
  "RESOURCE ANALYSIS",
  "COST PLANNING",
  "PROJECT PERFORMANCE",
];

const normalise = (value) =>
  String(value ?? "").trim().toLowerCase();

function findSheetName(sheetNames, target) {
  return sheetNames.find(
    (name) => normalise(name) === normalise(target)
  );
}

function cellText(value) {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value ?? "");
}

export default function PlanningVisualizer() {
  const [workbook, setWorkbook] = useState(null);
  const [activeSheet, setActiveSheet] = useState("ANALYTIC WBS A");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState({
    column: null,
    direction: "asc",
  });
  const [page, setPage] = useState(0);

  const pageSize = 50;

  useEffect(() => {
    let cancelled = false;

    async function loadWorkbook() {
      try {
        const response = await fetch(EXCEL_URL);

        if (!response.ok) {
          throw new Error(
            "Workbook not found. Check the Excel file name and location."
          );
        }

        const buffer = await response.arrayBuffer();

        const parsedWorkbook = XLSX.read(
          new Uint8Array(buffer),
          {
            type: "array",
            cellDates: true,
          }
        );

        if (!cancelled) {
          setWorkbook(parsedWorkbook);

          const firstSheet = findSheetName(
            parsedWorkbook.SheetNames,
            "ANALYTIC WBS A"
          );

          setActiveSheet(
            firstSheet || parsedWorkbook.SheetNames[0] || ""
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load workbook.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWorkbook();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeInfo =
    worksheets.find(
      (item) => normalise(item.match) === normalise(activeSheet)
    ) || worksheets[0];

  const actualSheetName = workbook
    ? findSheetName(workbook.SheetNames, activeSheet)
    : "";

  const rawRows = useMemo(() => {
    if (!workbook || !actualSheetName) return [];

    return XLSX.utils.sheet_to_json(
      workbook.Sheets[actualSheetName],
      {
        header: 1,
        defval: "",
        raw: false,
        blankrows: true,
      }
    );
  }, [workbook, actualSheetName]);

  const headerIndex = Math.max(
    0,
    Math.min(activeInfo.headerRow - 1, rawRows.length - 1)
  );

  const headerRow = rawRows[headerIndex] || [];

  const dataRows = rawRows
    .slice(headerIndex + 1)
    .filter((row) =>
      row.some((cell) => String(cell).trim() !== "")
    );

  const filteredRows = useMemo(() => {
    let result = dataRows;

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((row) =>
        row.some((cell) =>
          cellText(cell).toLowerCase().includes(query)
        )
      );
    }

    if (sort.column !== null) {
      result = [...result].sort((a, b) => {
        const first = cellText(a[sort.column]);
        const second = cellText(b[sort.column]);

        const comparison = first.localeCompare(
          second,
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        );

        return sort.direction === "asc"
          ? comparison
          : -comparison;
      });
    }

    return result;
  }, [dataRows, search, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  const safePage = Math.min(page, totalPages - 1);

  const visibleRows = filteredRows.slice(
    safePage * pageSize,
    (safePage + 1) * pageSize
  );

  const columnCount = Math.max(
    headerRow.length,
    ...dataRows.map((row) => row.length),
    0
  );

  const columns = Array.from(
    { length: columnCount },
    (_, index) => index
  );

  const nonEmptyColumns = columns.filter(
    (column) =>
      String(headerRow[column] ?? "").trim() ||
      dataRows.some(
        (row) => String(row[column] ?? "").trim()
      )
  );

  const freezeCount = Math.min(
    activeInfo.freezeColumns,
    columnCount
  );

  function selectWorksheet(sheet) {
    setActiveSheet(sheet.match);
    setSearch("");
    setSort({ column: null, direction: "asc" });
    setPage(0);
  }

  function sortByColumn(column) {
    setSort((current) => ({
      column,
      direction:
        current.column === column &&
        current.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(0);
  }

  return (
    <section className="mt-14 space-y-8">

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Project 01 / Construction Management
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          WBS & Resource / Cost Planning
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          Explore the project breakdown, discipline-based resource
          analyses, indirect-cost planning and earned-value data.
          Each button below opens its corresponding original Excel
          worksheet.
        </p>
      </div>

      {/* PLANNING WORKFLOW */}

      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 md:p-6">

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79c9eb]">
          Planning workflow
        </p>

        <h3 className="mt-1 text-lg font-semibold text-white">
          From model information to project control
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">

          {[
            "BIM Model",
            "Quantity Take-Off",
            "WBS",
            "Resource Analysis",
            "Cost Planning",
            "Project Performance",
          ].map((label, index) => (
            <div
              key={label}
              className="min-h-[62px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-3"
            >
              <span className="text-[10px] text-[#79c9eb]">
                0{index + 1}
              </span>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-200">
                {label}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* EXCEL WORKBOOK */}

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white">

        <div className="border-b border-slate-700 px-5 py-5 md:px-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79c9eb]">
            Interactive planning workbook
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            GR4-CM-WBS - FINAL
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            11 worksheets · Select any worksheet to view its data
          </p>

        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-slate-300">
            Loading planning workbook...
          </p>
        ) : error ? (
          <div className="p-6 text-sm leading-6 text-red-300">
            {error}
          </div>
        ) : (
          <>

            {/* ALL 11 WORKSHEET BUTTONS */}

            <div className="space-y-4 border-b border-slate-800 px-4 py-5">

              {groups.map((group) => {
                const groupSheets = worksheets.filter(
                  (sheet) => sheet.group === group
                );

                return (
                  <div key={group}>

                    <p className="mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {group}
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {groupSheets.map((sheet) => {
                        const exists = Boolean(
                          findSheetName(
                            workbook.SheetNames,
                            sheet.match
                          )
                        );

                        const selected =
                          normalise(activeSheet) ===
                          normalise(sheet.match);

                        return (
                          <button
                            key={sheet.match}
                            type="button"
                            disabled={!exists}
                            onClick={() =>
                              selectWorksheet(sheet)
                            }
                            className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                              selected
                                ? "border-blue-400 bg-blue-600 text-white"
                                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                            }`}
                          >
                            {sheet.label}
                          </button>
                        );
                      })}

                    </div>
                  </div>
                );
              })}

            </div>

            {/* ACTIVE WORKSHEET */}

            <div className="border-b border-slate-800 bg-[#0b1622] px-5 py-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#79c9eb]">
                {activeInfo.group}
              </p>

              <h4 className="mt-1 text-base font-semibold text-white">
                {activeInfo.label}
              </h4>

              <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-400">
                {activeInfo.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">

                <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Data rows
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {filteredRows.length.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Columns
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {nonEmptyColumns.length}
                  </p>
                </div>

                <div className="col-span-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-1">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Frozen key columns
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {freezeCount}
                  </p>
                </div>

              </div>
            </div>

            {/* SEARCH */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
                placeholder="Search this worksheet..."
                aria-label="Search worksheet"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 sm:max-w-sm"
              />

              <p className="text-xs text-slate-500">
                Select a column heading to sort
              </p>

            </div>

            {/* TABLE */}

            <div className="max-h-[620px] overflow-auto">

              {visibleRows.length > 0 ? (

                <table className="w-max min-w-full border-separate border-spacing-0 text-left text-xs">

                  <thead>
                    <tr>

                      {columns.map((columnIndex) => {
                        const heading =
                          cellText(headerRow[columnIndex]) ||
                          `Column ${columnIndex + 1}`;

                        const frozen =
                          columnIndex < freezeCount;

                        return (
                          <th
                            key={columnIndex}
                            className={`sticky top-0 z-20 min-w-[150px] border-b border-r border-[#31516b] bg-[#183b56] px-3 py-3 text-left font-semibold text-[#d8efff] ${
                              frozen ? "planning-frozen-column" : ""
                            }`}
                            style={
                              frozen
                                ? {
                                    left: `${columnIndex * 150}px`,
                                    zIndex: 40,
                                  }
                                : undefined
                            }
                          >

                            <button
                              type="button"
                              onClick={() =>
                                sortByColumn(columnIndex)
                              }
                              className="flex min-h-8 items-center gap-2 text-left hover:text-white"
                            >
                              <span>{heading}</span>

                              <span className="text-[9px] text-[#8fc9e8]">
                                {sort.column === columnIndex
                                  ? sort.direction === "asc"
                                    ? "↑"
                                    : "↓"
                                  : "↕"}
                              </span>
                            </button>

                          </th>
                        );
                      })}

                    </tr>
                  </thead>

                  <tbody>

                    {visibleRows.map((row, rowIndex) => (
                      <tr
                        key={`${safePage}-${rowIndex}`}
                        className="group"
                      >

                        {columns.map((columnIndex) => {
                          const frozen =
                            columnIndex < freezeCount;

                          return (
                            <td
                              key={columnIndex}
                              className={`border-b border-r border-slate-800 px-3 py-3 align-top leading-5 group-hover:bg-slate-800 ${
                                frozen
                                  ? "planning-frozen-column bg-[#10283a] font-medium text-slate-100"
                                  : "bg-slate-950 text-slate-300"
                              }`}
                              style={
                                frozen
                                  ? {
                                      left: `${columnIndex * 150}px`,
                                      zIndex: 10,
                                    }
                                  : undefined
                              }
                            >
                              {cellText(row[columnIndex])}
                            </td>
                          );
                        })}

                      </tr>
                    ))}

                  </tbody>

                </table>

              ) : (

                <p className="p-8 text-center text-sm text-slate-500">
                  No matching records in this worksheet.
                </p>

              )}

            </div>

            {/* PAGINATION */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-5 py-4">

              <p className="text-xs text-slate-500">
                Showing{" "}
                {filteredRows.length
                  ? safePage * pageSize + 1
                  : 0}
                {" – "}
                {Math.min(
                  (safePage + 1) * pageSize,
                  filteredRows.length
                )}{" "}
                of {filteredRows.length} rows
              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={safePage === 0}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(0, current - 1)
                    )
                  }
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="min-w-[76px] text-center text-xs text-slate-400">
                  Page {safePage + 1} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safePage >= totalPages - 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages - 1,
                        current + 1
                      )
                    )
                  }
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                >
                  Next
                </button>

              </div>
            </div>

          </>
        )}

        <div className="border-t border-slate-800 px-5 py-3 text-[10px] text-slate-500">
          Source: GR4-CM-WBS - FINAL.xlsx · Original worksheet data.
        </div>

      </div>

      <style>{`
        .planning-frozen-column {
          position: sticky;
        }

        @media (max-width: 640px) {
          .planning-frozen-column {
            position: static;
          }
        }
      `}</style>

    </section>
  );
}