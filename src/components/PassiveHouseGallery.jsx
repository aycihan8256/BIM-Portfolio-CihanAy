import { useState } from "react";

const BASE_PATH = "/documents/passive-house-ankara";

const drawingGroups = [
  {
    id: "architectural",
    number: "01",
    title: "Architectural Drawings",
    subtitle: "Spatial organisation & architectural layout",
    description:
      "Architectural plans and site documentation illustrating the spatial organisation and overall layout of the residential project.",
    folder: "01-architectural-drawings",
    drawings: [
      {
        name: "Ground Floor Plan",
        file: "01-ground-floor-plan.pdf",
        type: "Floor Plan",
      },
      {
        name: "Mezzanine Floor Plan",
        file: "02-mezzanine-floor-plan.pdf",
        type: "Floor Plan",
      },
      {
        name: "Site Plan",
        file: "03-site-plan.pdf",
        type: "Site Documentation",
      },
    ],
  },

  {
    id: "sections",
    number: "02",
    title: "Sections & Elevations",
    subtitle: "Building form, levels & vertical organisation",
    description:
      "Building sections and elevations illustrating architectural composition, spatial relationships and the building envelope.",
    folder: "02-building-sections",
    drawings: [
      {
        name: "Section AA'",
        file: "04-section-aa.pdf",
        type: "Building Section",
      },
      {
        name: "Section BB'",
        file: "05-section-bb.pdf",
        type: "Building Section",
      },
      {
        name: "South Elevation",
        file: "06-south-elevation.pdf",
        type: "Elevation",
      },
      {
        name: "West Elevation",
        file: "07-west-elevation.pdf",
        type: "Elevation",
      },
      {
        name: "System Section",
        file: "08-system-section.pdf",
        type: "Building System",
      },
    ],
  },

  {
    id: "details",
    number: "03",
    title: "Construction Details",
    subtitle: "Building assemblies & junction resolution",
    description:
      "Detailed architectural studies of building components, material layers and construction junctions.",
    folder: "03-construction-details",
    drawings: [
      {
        name: "Foundation–Wall–Floor Detail",
        file: "09-foundation-wall-floor-detail.pdf",
        type: "Detail 01",
      },
      {
        name: "Window Detail",
        file: "10-window-detail.pdf",
        type: "Detail 02",
      },
      {
        name: "Mezzanine & Staircase Detail",
        file: "11-mezzanine-staircase-detail.pdf",
        type: "Detail 03",
      },
      {
        name: "Roof Detail",
        file: "12-roof-detail.pdf",
        type: "Detail 04",
      },
      {
        name: "Wet Space Detail",
        file: "13-wet-space-detail.pdf",
        type: "Detail 05",
      },
    ],
  },

  {
    id: "sustainable",
    number: "04",
    title: "Sustainable Design & Building Systems",
    subtitle: "Passive House principles & material strategies",
    description:
      "Design strategies, material selection and building assembly concepts explored through the Passive House design approach.",
    image: "/images/passive-house-ankara/passive-house-strategy.jpg",
      folder: "04-sustainable-design",
    drawings: [
      {
        name: "Passive House Design Strategy",
        file: "14-passive-house-design-strategy.pdf",
        type: "Design Strategy",
      },
    ],
  },
];

function DrawingCard({ drawing, path, index, onPreview }) {
  return (
    <article className="group overflow-hidden border border-white/10 bg-[#142129] transition-all duration-300 hover:-translate-y-1 hover:border-[#5ba8c5]">

      {/* PDF Preview */}
      <div
        onClick={() => onPreview(drawing, path)}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden bg-white"
      >
        <iframe
          src={`${path}#toolbar=0&navpanes=0&scrollbar=0`}
          title={`${drawing.name} preview`}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
        />

        <div className="pointer-events-none absolute inset-0 transition group-hover:bg-[#5ba8c5]/10" />

        <div className="pointer-events-none absolute bottom-3 left-3 flex gap-2">
          <span className="bg-[#101a20]/90 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-white">
            PDF
          </span>

          <span className="bg-[#101a20]/90 px-2 py-1 text-[8px] text-white">
            Drawing {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#101a20]/90 text-white opacity-0 transition group-hover:opacity-100">
          ↗
        </span>
      </div>

      {/* Drawing Information */}
      <div className="p-4 md:p-5">

        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#91d2e7]">
          {drawing.type}
        </p>

        <h5 className="mt-2 min-h-10 text-sm font-medium leading-5 text-white">
          {drawing.name}
        </h5>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">

          <button
            type="button"
            onClick={() => onPreview(drawing, path)}
            className="text-[9px] font-bold uppercase tracking-widest text-[#91d2e7] transition hover:text-white"
          >
            Preview drawing ↗
          </button>

          <a
            href={path}
            download
            className="grid h-8 w-8 place-items-center border border-white/15 text-sm text-white/65 transition hover:border-[#5ba8c5] hover:text-[#91d2e7]"
            title="Download PDF"
          >
            ↓
          </a>

        </div>
      </div>

    </article>
  );
}

export default function PassiveHouseGallery() {
  const [selected, setSelected] = useState(null);

  const totalDrawings = drawingGroups.reduce(
    (total, group) => total + group.drawings.length,
    0
  );

  const getPath = (group, drawing) =>
    `${BASE_PATH}/${group.folder}/${drawing.file}`;

  return (
    <section className="mt-12 border-t border-white/15 pt-10">

      {/* Gallery header */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#91d2e7]">
            Project Documentation / Drawing Archive
          </p>

          <h3 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
            Technical Drawing Archive
          </h3>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Explore the architectural drawings and technical documentation
            developed throughout the project, from architectural layouts
            to detailed building assemblies.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-2xl font-light text-[#91d2e7]">
              {totalDrawings}
            </p>

            <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/45">
              Drawing Sheets
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-2xl font-light text-[#91d2e7]">
              04
            </p>

            <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/45">
              Categories
            </p>
          </div>

        </div>
      </div>

      {/* Drawing groups */}
      <div className="mt-12 space-y-14">

        {drawingGroups.map((group) => (
          <div key={group.id}>

            <div className="mb-6 flex flex-col justify-between gap-3 border-b border-white/15 pb-4 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#91d2e7]">
                  {group.number} / Documentation Category
                </p>

                <h4 className="mt-2 text-xl font-medium text-white md:text-2xl">
                  {group.title}
                </h4>

                <p className="mt-1 text-xs text-white/40">
                  {group.subtitle}
                </p>

                <p className="mt-3 max-w-2xl text-xs leading-6 text-white/55">
                  {group.description}
                </p>

              </div>

              <span className="text-[10px] uppercase tracking-widest text-white/40">
                {group.drawings.length} Sheets
              </span>

            </div>

            {group.image ? (
  <div className="w-full overflow-hidden border border-white/15 bg-[#142129]">

    <a
      href={group.image}
      target="_blank"
      rel="noreferrer"
      className="group relative block w-full overflow-hidden bg-[#101a20]"
    >
      <img
        src={group.image}
        alt={group.title}
        className="block h-auto max-h-[850px] w-full object-contain transition duration-500 group-hover:scale-[1.01]"
      />

      <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-[#101a20]/90 text-xl text-white opacity-0 transition group-hover:opacity-100">
        ↗
      </span>
    </a>

    <div className="flex flex-col justify-between gap-4 border-t border-white/10 p-5 sm:flex-row sm:items-center">

      <div>
        <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#91d2e7]">
          Design Strategy
        </p>

        <h5 className="mt-2 text-lg font-medium text-white">
          Passive House Design Strategy
        </h5>
      </div>

      <div className="flex gap-3">

        <a
          href={getPath(group, group.drawings[0])}
          target="_blank"
          rel="noreferrer"
          className="border border-white/20 px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition hover:border-[#5ba8c5]"
        >
          View PDF ↗
        </a>

        <a
          href={getPath(group, group.drawings[0])}
          download
          className="border border-white/20 px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition hover:border-[#5ba8c5]"
        >
          Download ↓
        </a>

      </div>
    </div>

  </div>
) : (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

    {group.drawings.map((drawing, index) => (
      <DrawingCard
        key={drawing.file}
        drawing={drawing}
        path={getPath(group, drawing)}
        index={index}
        onPreview={(item, path) =>
          setSelected({ ...item, path })
        }
      />
    ))}

  </div>
)}
          </div>
        ))}

      </div>

      {/* PDF preview modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-3 md:p-7"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >

          <div
            className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden border border-white/15 bg-[#101a20]"
            role="dialog"
            aria-modal="true"
          >

            <div className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-4 md:px-6">

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-widest text-[#91d2e7]">
                  Technical Drawing / PDF Preview
                </p>

                <h4 className="mt-1 truncate text-sm font-medium text-white md:text-base">
                  {selected.name}
                </h4>

              </div>

              <div className="flex shrink-0 items-center gap-3">

                <a
                  href={selected.path}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden text-[9px] font-bold uppercase tracking-widest text-[#91d2e7] hover:text-white sm:block"
                >
                  Open in new tab ↗
                </a>

                <a
                  href={selected.path}
                  download
                  className="hidden border border-white/20 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-white hover:border-[#5ba8c5] sm:block"
                >
                  Download ↓
                </a>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="border border-white/20 px-3 py-2 text-xs text-white hover:border-[#5ba8c5]"
                >
                  Close ×
                </button>

              </div>
            </div>

            <iframe
              src={`${selected.path}#toolbar=1&navpanes=0`}
              title={selected.name}
              className="min-h-0 flex-1 bg-white"
            />

          </div>
        </div>
      )}

    </section>
  );
}