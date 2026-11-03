import { useState } from "react";

const projects = [
  {
    number: "01",
    title: "Architectural BIM Modelling",
    category: "REVIT · ARCHITECTURE",
    year: "2025",
    image: "/images/project-01.jpg",
    description: "Architectural model development, views and technical documentation.",
    size: "large",
  },
  {
    number: "02",
    title: "BIM Coordination",
    category: "NAVISWORKS · CLASH DETECTION",
    year: "2025",
    image: "/images/project-02.jpg",
    description: "Federated model review, clash identification and issue reporting.",
    size: "tall",
  },
  {
    number: "03",
    title: "Technical Documentation",
    category: "REVIT · DRAWING SET",
    year: "2024",
    image: "/images/project-03.jpg",
    description: "Plans, sections, elevations, details and coordinated sheets.",
    size: "tall",
  },
  {
    number: "04",
    title: "Model & Information Workflow",
    category: "BIM · IFC · DATA",
    year: "2026",
    image: "/images/project-04.jpg",
    description: "Structured model information, schedules and exchange workflows.",
    size: "large",
  },
];

function ArrowUpRight() {
  return <span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>;
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  return (
    <main className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#f3f4f2] text-[#17232b] transition-colors duration-500 dark:bg-[#0b1115] dark:text-[#eef2f3]">
        {/* Navigation */}
        <header className="relative z-20 flex items-center justify-between border-b border-black/10 px-5 py-5 dark:border-white/10 md:px-10 lg:px-14">
          <a href="#" className="font-bold tracking-[-0.06em] text-lg">
            YOUR NAME<span className="text-[#5ba8c5]">.</span>
          </a>

          <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.16em] text-black/60 dark:text-white/60 md:flex">
            <a className="transition hover:text-[#5ba8c5]" href="#work">Selected work</a>
            <a className="transition hover:text-[#5ba8c5]" href="#about">About</a>
            <a className="transition hover:text-[#5ba8c5]" href="#contact">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDark(!dark)}
              className="rounded-full border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition hover:border-[#5ba8c5] dark:border-white/20"
              aria-label="Toggle light and dark mode"
            >
              {dark ? "Light mode" : "Dark mode"}
            </button>
            <a href="#contact" className="hidden rounded-full bg-[#5ba8c5] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#071116] transition hover:bg-[#83c5dc] sm:inline-flex">
              Let’s talk <ArrowUpRight />
            </a>
          </div>
        </header>

        {/* Intro */}
        <section className="px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#4d9ab8]">
                BIM · Architecture · Digital Construction
              </p>
              <h1 className="max-w-5xl text-[clamp(3.2rem,8.3vw,8.2rem)] font-medium leading-[0.88] tracking-[-0.075em]">
                Designing clarity<br />
                <span className="text-[#5ba8c5]">through BIM.</span>
              </h1>
            </div>
            <div className="max-w-md lg:justify-self-end">
              <p className="text-sm leading-7 text-black/65 dark:text-white/65 md:text-base">
                I am an architectural designer focused on BIM modelling,
                technical documentation and model coordination. I turn
                complex project information into clear, coordinated outputs.
              </p>
              <a href="#work" className="mt-6 inline-flex items-center gap-3 border-b border-[#5ba8c5] pb-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                Explore selected work <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="work" className="px-3 pb-20 md:px-6 lg:px-10">
          <div className="mb-5 flex items-end justify-between px-2 md:px-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d9ab8]">01 / Portfolio</p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.05em] md:text-3xl">Selected projects</h2>
            </div>
            <p className="hidden text-[10px] uppercase tracking-[0.16em] text-black/45 dark:text-white/45 sm:block">
              2024 — 2026&nbsp;&nbsp; / &nbsp;&nbsp;04 projects
            </p>
          </div>

          <div className="grid auto-rows-[minmax(280px,42vw)] grid-cols-1 gap-3 sm:grid-cols-2 lg:auto-rows-[minmax(340px,38vw)] lg:gap-4">
            {projects.map((project, index) => (
              <button
                key={project.number}
                onClick={() => setActiveProject(project)}
                className={`group relative isolate overflow-hidden bg-[#d7e0e4] text-left ${project.size === "large" ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <img
                  src={project.image}
                  alt={`${project.title} project visual`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-0 -z-0 bg-gradient-to-t from-[#061016]/90 via-[#061016]/10 to-transparent" />
                <div className="absolute inset-0 -z-10 flex items-center justify-center bg-[#dce8ed] text-[#527080] dark:bg-[#1b2b34] dark:text-[#a9c2ce]">
                  <span className="text-xs uppercase tracking-[0.2em]">Add project image {project.number}</span>
                </div>

                <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-white/80">
                  <span>{project.number}</span><span className="h-px w-7 bg-white/50" /><span>{project.year}</span>
                </div>

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 text-white md:inset-x-7 md:bottom-7">
                  <div>
                    <p className="mb-2 text-[9px] font-bold tracking-[0.18em] text-[#91d2e7]">{project.category}</p>
                    <h3 className="max-w-xl text-2xl font-medium leading-tight tracking-[-0.05em] md:text-4xl">{project.title}</h3>
                    <p className="mt-2 max-w-lg text-xs leading-5 text-white/70 md:text-sm">{project.description}</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/50 transition duration-300 group-hover:border-[#5ba8c5] group-hover:bg-[#5ba8c5] group-hover:text-[#071116]">
                    <ArrowUpRight />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* About strip */}
        <section id="about" className="border-y border-black/10 px-5 py-16 dark:border-white/10 md:px-10 md:py-20 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d9ab8]">02 / Approach</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.06em] md:text-5xl">From model<br />to meaning.</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                ["01", "Model", "Revit modelling, families, views and model structure."],
                ["02", "Document", "Plans, sections, details, schedules and drawing sets."],
                ["03", "Coordinate", "Navisworks federation, clash review and issue reporting."],
              ].map(([n, title, copy]) => (
                <div key={n} className="border-t border-[#5ba8c5] pt-4">
                  <p className="text-[10px] tracking-[0.16em] text-[#4d9ab8]">{n}</p>
                  <h3 className="mt-4 text-xl font-medium tracking-[-0.04em]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/55 dark:text-white/55">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <footer id="contact" className="px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d9ab8]">03 / Contact</p>
          <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.07em] md:text-7xl">
              Have a project<br />in mind<span className="text-[#5ba8c5]">?</span>
            </h2>
            <div className="text-sm leading-7 text-black/60 dark:text-white/60">
              <a className="block text-base text-current underline decoration-[#5ba8c5] underline-offset-4" href="mailto:your.email@example.com">your.email@example.com</a>
              <p className="mt-2">LinkedIn · Italy</p>
            </div>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-[9px] uppercase tracking-[0.16em] text-black/40 dark:border-white/10 dark:text-white/40 sm:flex-row">
            <span>© 2026 YOUR NAME — BIM PORTFOLIO</span>
            <span>Designed with clarity · Built with React & Tailwind</span>
          </div>
        </footer>

        {/* Project detail overlay */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05090c]/90 p-4 backdrop-blur-sm" onClick={() => setActiveProject(null)}>
            <div className="relative w-full max-w-3xl border border-white/15 bg-[#101a20] p-6 text-white md:p-10" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setActiveProject(null)} className="absolute right-5 top-5 text-xs uppercase tracking-widest text-white/60 hover:text-white">Close ×</button>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#91d2e7]">{activeProject.number} / {activeProject.category}</p>
              <h3 className="mt-5 max-w-2xl text-3xl font-medium tracking-[-0.05em] md:text-5xl">{activeProject.title}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">{activeProject.description}</p>
              <div className="mt-8 grid gap-3 border-t border-white/15 pt-5 text-xs text-white/60 sm:grid-cols-3">
                <p><b className="block text-white">Problem</b>[Add the project challenge]</p>
                <p><b className="block text-white">My contribution</b>[Describe your exact role]</p>
                <p><b className="block text-white">Result</b>[Add a verified outcome]</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
