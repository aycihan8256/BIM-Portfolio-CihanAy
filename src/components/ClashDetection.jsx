const BASE = "/images/construction-management/clash-detection";

const summary = [
  { label: "Total Detected", value: "360", detail: "Hard clashes identified" },
  { label: "Resolved", value: "239", detail: "Architectural & structural" },
  { label: "Approved", value: "121", detail: "MEP issues retained" },
  { label: "Resolution Rate", value: "66.4%", detail: "Of all detected clashes" },
];

const structuralResults = [
  {
    test: "STR Floors – ARCH Walls",
    detected: 31,
    resolved: 31,
  },
  {
    test: "STR Columns – ARCH Floors",
    detected: 32,
    resolved: 32,
  },
  {
    test: "STR Walls – ARCH Floors",
    detected: 61,
    resolved: 61,
  },
];

const mepResults = [
  { test: "STR Floors – Mechanical", detected: 40, approved: 40 },
  { test: "ARCH Floors – Mechanical", detected: 39, approved: 39 },
  { test: "STR Floors – Plumbing", detected: 2, approved: 2 },
  { test: "ARCH Walls – Plumbing", detected: 40, approved: 40 },
];

function SectionHeading({ number, title, description }) {
  return (
    <div className="mb-6 border-b border-white/15 pb-4">
      <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#91d2e7]">
        {number} / Clash Analysis
      </p>
      <h4 className="mt-2 text-xl font-medium text-white md:text-2xl">
        {title}
      </h4>
      <p className="mt-2 max-w-3xl text-xs leading-6 text-white/55">
        {description}
      </p>
    </div>
  );
}

function ResultTable({ columns, rows, total, statusLabel }) {
  return (
    <div className="mt-5 overflow-x-auto border border-white/10">
      <table className="w-full min-w-[480px] text-left text-xs">
        <thead className="bg-white/[0.04] text-[9px] uppercase tracking-widest text-white/45">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-4 font-bold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.test} className="border-t border-white/10 text-white/75">
              <td className="px-4 py-4">{row.test}</td>
              <td className="px-4 py-4">{row.detected}</td>
              <td className="px-4 py-4 text-[#91d2e7]">
                {row[statusLabel]}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="border-t border-white/20 bg-white/[0.04] font-bold text-white">
          <tr>
            <td className="px-4 py-4">Total</td>
            <td className="px-4 py-4">{total.detected}</td>
            <td className="px-4 py-4 text-[#91d2e7]">
              {total.status}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function EvidenceImage({ src, alt, caption, wide = false }) {
  return (
    <figure className="overflow-hidden border border-white/10 bg-[#142129]">
      <a href={`${BASE}/${src}`} target="_blank" rel="noreferrer">
        <img
          src={`${BASE}/${src}`}
          alt={alt}
          loading="lazy"
          className={`block w-full object-contain transition duration-500 hover:scale-[1.015] ${
            wide ? "max-h-[650px]" : "max-h-[480px]"
          }`}
        />
      </a>
      <figcaption className="border-t border-white/10 px-4 py-3 text-[10px] leading-5 text-white/50">
        {caption}
        <span className="ml-2 text-[#91d2e7]">↗ Enlarge</span>
      </figcaption>
    </figure>
  );
}

export default function ClashDetection() {
  return (
    <section className="mt-12 border-t border-white/15 pt-10">

      {/* HEADER */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#91d2e7]">
          BIM Coordination / Navisworks Manage
        </p>

        <h3 className="mt-3 text-3xl font-medium tracking-[-.05em] text-white md:text-5xl">
          Clash Detection & Coordination
        </h3>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
          A structured clash detection process was carried out in
          Autodesk Navisworks Manage to evaluate geometric consistency
          between architectural and structural BIM models. Additional
          MEP interactions were identified and documented for future
          coordination phases.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="border border-white/10 bg-[#142129] p-4 md:p-5"
          >
            <p className="text-2xl font-light text-[#91d2e7] md:text-3xl">
              {item.value}
            </p>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-white">
              {item.label}
            </p>
            <p className="mt-1 text-[10px] text-white/40">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      {/* METHODOLOGY */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="border border-white/10 p-5">
          <p className="text-[9px] uppercase tracking-widest text-[#91d2e7]">
            Clash Type
          </p>
          <p className="mt-2 text-sm font-medium text-white">Hard Clash</p>
          <p className="mt-2 text-xs leading-6 text-white/50">
            Direct geometric intersections between model elements.
          </p>
        </div>

        <div className="border border-white/10 p-5">
          <p className="text-[9px] uppercase tracking-widest text-[#91d2e7]">
            Tolerance
          </p>
          <p className="mt-2 text-sm font-medium text-white">Zero Tolerance</p>
          <p className="mt-2 text-xs leading-6 text-white/50">
            Any detected geometric overlap was flagged for review.
          </p>
        </div>

        <div className="border border-white/10 p-5">
          <p className="text-[9px] uppercase tracking-widest text-[#91d2e7]">
            Software
          </p>
          <p className="mt-2 text-sm font-medium text-white">
            Autodesk Navisworks Manage
          </p>
          <p className="mt-2 text-xs leading-6 text-white/50">
            Federated model review and Clash Detective workflow.
          </p>
        </div>
      </div>

      {/* CLASH MATRIX */}
      <div className="mt-14">
        <SectionHeading
          number="01"
          title="Clash Detection Matrix"
          description="The matrix structured the model coordination tests by defining the element groups and discipline relationships to be examined."
        />

        <EvidenceImage
          src="04-clash-detection-matrix.jpg"
          alt="Navisworks clash detection matrix"
          caption="Navisworks Clash Detective — test matrix and coordination status overview."
          wide
        />
      </div>

      {/* ARCHITECTURAL */}
      <div className="mt-14">
        <SectionHeading
          number="02"
          title="Architectural Coordination"
          description="The ARCH Floors–ARCH Walls test identified overlapping floor and wall elements, particularly around the building perimeter, stair cores and internal partition junctions."
        />

        <EvidenceImage
          src="03-architectural-floor-wall-clashes.jpg"
          alt="Architectural floor and wall clashes"
          caption="Architectural Floors–Architectural Walls — Navisworks clash results."
        />

        <ResultTable
          columns={[
            { key: "test", label: "Clash Test" },
            { key: "detected", label: "Detected" },
            { key: "resolved", label: "Resolved" },
          ]}
          rows={[
            {
              test: "ARCH Floors – ARCH Walls",
              detected: 115,
              resolved: 115,
            },
          ]}
          total={{ detected: 115, status: 115 }}
          statusLabel="resolved"
        />

        <div className="mt-5 border-l-2 border-[#5ba8c5] bg-white/[0.03] p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#91d2e7]">
            Resolution Strategy
          </p>
          <p className="mt-2 text-xs leading-6 text-white/60">
            Floor boundaries and finish layers were adjusted in Revit
            while maintaining wall alignment and thickness. The modified
            model was re-exported and re-tested in Navisworks until the
            clash set reached Resolved status.
          </p>
        </div>
      </div>

      {/* STRUCTURAL */}
      <div className="mt-14">
        <SectionHeading
          number="03"
          title="Structural–Architectural Coordination"
          description="Three main conflict zones were examined at the interfaces between structural slabs, columns, walls and architectural floor or wall elements."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <EvidenceImage
            src="01-structural-floor-wall-clashes.jpg"
            alt="Structural floors and architectural walls clashes"
            caption="Structural Floors–Architectural Walls — detected hard clashes."
          />

          <EvidenceImage
            src="05-structural-columns-floor-clashes.jpg"
            alt="Structural columns and architectural floors clashes"
            caption="Structural Pillars–Architectural Floors — detected hard clashes."
          />
        </div>

        <ResultTable
          columns={[
            { key: "test", label: "Clash Test" },
            { key: "detected", label: "Detected" },
            { key: "resolved", label: "Resolved" },
          ]}
          rows={structuralResults}
          total={{ detected: 124, status: 124 }}
          statusLabel="resolved"
        />

        <div className="mt-5 border-l-2 border-[#5ba8c5] bg-white/[0.03] p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#91d2e7]">
            Resolution Strategy
          </p>
          <p className="mt-2 text-xs leading-6 text-white/60">
            Structural slab boundaries, architectural wall alignment
            and floor finish elements were coordinated. Openings and
            adjusted floor boundaries were introduced around vertical
            structural elements to eliminate geometric overlaps.
          </p>
        </div>
      </div>

      {/* MEP */}
      <div className="mt-14">
        <SectionHeading
          number="04"
          title="MEP Clash Review"
          description="Mechanical and plumbing interactions were identified and documented. Detailed MEP clash resolution was outside the scope of this project phase."
        />

        <ResultTable
          columns={[
            { key: "test", label: "Clash Test" },
            { key: "detected", label: "Detected" },
            { key: "approved", label: "Approved" },
          ]}
          rows={mepResults}
          total={{ detected: 121, status: 121 }}
          statusLabel="approved"
        />

        <div className="mt-5 border-l-2 border-amber-400 bg-white/[0.03] p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-amber-300">
            Scope Limitation
          </p>
          <p className="mt-2 text-xs leading-6 text-white/60">
            The identified MEP clashes were reviewed and marked as
            Approved for reference in future design phases. They were
            not treated as resolved clashes.
          </p>
        </div>
      </div>


      {/* CONCLUSION */}
      <div className="mt-10 border border-white/10 bg-[#142129] p-6 md:p-8">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#91d2e7]">
          Coordination Outcome
        </p>

        <h4 className="mt-3 text-2xl font-medium text-white">
          From geometric conflict detection to coordinated model review.
        </h4>

        <p className="mt-4 max-w-3xl text-xs leading-7 text-white/55">
          The process addressed architectural and structural geometric
          conflicts through model adjustments and iterative validation.
          MEP-related issues were documented separately, providing a
          transparent basis for subsequent coordination activities.
        </p>
      </div>

    </section>
  );
}