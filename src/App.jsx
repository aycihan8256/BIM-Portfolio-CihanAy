import IfcViewer from "./components/IfcViewer";
import { useMemo, useState } from "react";
import PassiveHouseGallery from "./components/PassiveHouseGallery";
import ClashDetection from "./components/ClashDetection";
import QuantityTakeoff from "./components/QuantityTakeoff";
import ScheduleViewer from "./components/ScheduleViewer";
import PlanningVisualizer from "./components/PlanningVisualizer";

// PROJECT CONTENT: replace image paths with your curated screenshots.
// Add new objects to this array whenever you want to include another project.
const projects = [
  {
    id: "integrated-bim-construction-management",
    number: "01",
    title: "Integrated BIM & Construction Project Management",
    category: "Construction Management",
    year: "2026",
    context: "Academic team project | Politecnico di Milano",
    tools: "Revit · Navisworks · Primavera P6 · MS Project · Excel",
    image: "/images/construction-management/cover.jpg",
    summary: "An integrated academic case study connecting multidisciplinary BIM modelling with quantity take-off, clash detection, 4D planning, construction scheduling and cost/performance analysis.",
    problem: "The project required building information from multidisciplinary models to be connected with construction planning and project-control activities, rather than treating the 3D model and the construction programme as separate outputs.",
    contribution: "Team project. Replace this text with your exact individual responsibilities: identify which model elements, quantity take-offs, clash reviews, WBS activities, schedule tasks, cost analyses or performance calculations you personally completed.",
    workflow: "Describe the actual sequence used by your team: model preparation and federation; quantity extraction; work breakdown and activity definition; schedule development in Primavera P6 or MS Project; 4D linkage; cost and performance analysis. Keep only the steps you personally performed.",
    result: "The academic work produced an integrated BIM and construction-management case study. State the specific deliverables you completed and how they were checked. Do not claim real project savings, approved construction documents or site implementation unless you have evidence.",
    status: "Academic project — not a record of live construction delivery.",
    evidence: ["Multidisciplinary model views", "Quantity take-off tables", "Clash review evidence", "WBS / schedule extracts", "4D simulation frames", "Cost and performance analysis"],
  },
  {
    id: "bim-information-openbim",
    number: "02",
    title: "BIM Information Management & OpenBIM Workflow",
    category: "OpenBIM",
    year: "2025",
    context: "BIM Information Management Specialist certification project | Individual project | METU",
    tools: "Autodesk Revit · Navisworks · Excel · IFC",
    image: "/images/integrated-bim/cover.jpg",
    summary: "An individual BIM information-management exercise exploring how parametric model content can be structured, classified, exchanged and checked for asset-information purposes.",
    problem: "The task was to organise model information so that geometric model content could support structured asset information and information exchange, rather than relying on geometry alone.",
    contribution: "The project record identifies work involving parametric BIM content, Uniclass classification, IFC, model QA/QC, COBie and asset information. Expand this with the exact Revit families, parameters, classification fields, exports and checks you personally created.",
    workflow: "Show the real workflow you followed: family or object preparation; parameter assignment; classification; IFC export or exchange; information review; and any COBie or asset-information mapping. Distinguish completed steps from topics only studied.",
    result: "Present the model, information structure and validation evidence that you actually produced. Do not imply that the model was fully compliant with a client exchange requirement unless it was tested against a stated requirement.",
    status: "Certification project — demonstrate the scope and checks actually completed.",
    evidence: ["Revit model and family views", "Parameter/property screenshots", "Uniclass mapping", "IFC export and inspection", "COBie / asset information table", "QA/QC evidence"],
  },
  {
    id: "multidisciplinary-bim-4d",
    number: "03",
    title: "Multidisciplinary BIM Modelling & 4D Simulation",
    category: "BIM Modelling & 4D",
    year: "2023",
    context: "Building Information Modelling Professional Specialist certification project | METU",
    tools: "Autodesk Revit · Autodesk Navisworks",
    image: "/images/parametric-wall-panel/cover.jpg",
    summary: "A multidisciplinary BIM exercise integrating architectural, structural and building-services models for coordination, quantity take-off and construction-sequence simulation.",
    problem: "The exercise focused on bringing discipline-specific models into a coordinated BIM environment and exploring how model information could support coordination and construction sequencing.",
    contribution: "The project record lists BIM modelling, model federation, multidisciplinary coordination, clash detection, quantity take-off and 4D simulation. Specify which models and tasks you personally handled, and which were completed by other team members.",
    workflow: "Document the actual process: model inputs; model federation and alignment; clash test setup and review; quantity extraction; activity or selection-set organisation; and 4D simulation. Include the software version and test settings if known.",
    result: "Show the resulting coordinated model views, clash review outputs, quantity information and simulation frames that are available. Report clash counts or resolved issues only if you have the original reports and can explain the criteria.",
    status: "Certification project — not a claim of construction-site coordination.",
    evidence: ["Architectural / structural / MEP model views", "Federated Navisworks model", "Clash Detective screenshots", "Quantity take-off", "Timeliner / 4D simulation frames"],
  },
 {
  id: "architectural-technical-documentation",
  number: "04",
  title: "Architectural Documentation & Technical Drawings",
  category: "Technical Documentation",
  year: "Bachelor studies",
  context: "Academic architectural documentation project",
  tools: "Autodesk Revit",
  image: "/images/passive-house-ankara/cover.jpg",

  summary:
    "An architectural documentation study focused on producing detailed technical drawings in Autodesk Revit. The objective was to translate architectural design information into clear, structured and construction-oriented drawing outputs.",

  problem:
    "The main challenge was to communicate architectural design decisions through accurate technical drawings. The focus was on architectural documentation and the preparation of drawings rather than an integrated multidisciplinary BIM model.",

  contribution:
    "Preparation of architectural technical drawings in Revit, including plans, sections, elevations and construction details. The work focused on dimensions, annotations, graphical representation and documentation quality.",

  workflow:
    "The workflow involved developing architectural views in Revit, preparing plans, sections and elevations, adding dimensions and annotations, detailing building components, and organising drawing sheets for technical presentation.",

  result:
    "A collection of architectural technical drawings exported as PDF documents, demonstrating the use of Revit for architectural documentation and construction-oriented drawing production.",

  status:
    "Academic project — architectural technical documentation. Original Revit project file is currently unavailable; PDF drawing outputs are available.",

  evidence: [
    "Architectural floor plans",
    "Building sections",
    "Exterior elevations",
    "Construction details",
    "Dimensions and annotations",
    "Revit drawing sheets",
    "PDF technical documentation"
  ],
},
];

const filters = ["All", "Construction Management", "OpenBIM", "BIM Modelling & 4D", "Technical Documentation"];

const services = [
  ["01", "Architectural BIM Modelling", "Revit modelling, model development, families and architectural building elements.", "REVIT"],
  ["02", "Technical Documentation", "Plans, sections, elevations, details, annotations, sheets and schedules.", "REVIT · DOCUMENTATION"],
  ["03", "BIM Coordination Support", "Federated model review, clash detection, viewpoints and coordination reporting.", "NAVISWORKS"],
  ["04", "BIM Information Workflows", "IFC exchange, classification, model properties and information-quality checks.", "OPENBIM"],
];

function ProjectCard({ project, onOpen }) {
  const [failed, setFailed] = useState(false);
  return (
    <button type="button" onClick={() => onOpen(project)} className="group relative min-h-[340px] overflow-hidden bg-[#dce7eb] text-left sm:min-h-[400px]">
      {!failed && (
  <img
    src={project.image}
    alt={`${project.title} project preview`}
    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
    loading="lazy"
    onError={() => setFailed(true)}
  />
)}
      {!failed && <img src={project.image} alt={`${project.title} project preview`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" onError={() => setFailed(true)} />}
      {failed && <div className="absolute inset-0 flex items-center justify-center bg-[#dce7eb] text-[#526d7a] dark:bg-[#1a2a33] dark:text-[#b5cbd4]"><div className="text-center"><div className="text-5xl font-light">{project.number}</div><p className="mt-3 text-[9px] font-bold uppercase tracking-[0.2em]">Project image to be added</p><p className="mt-1 text-[9px]">{project.image}</p></div></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061016]/95 via-[#061016]/20 to-transparent" />
      <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-white"><span>{project.number}</span><span className="h-px w-6 bg-white/60" /><span>{project.year}</span></div>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white md:inset-x-7 md:bottom-7">
        <div><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#91d2e7]">{project.category}</p><h3 className="max-w-xl text-2xl font-medium leading-tight tracking-[-0.05em] md:text-3xl">{project.title}</h3><p className="mt-2 line-clamp-2 max-w-xl text-xs leading-5 text-white/75">{project.summary}</p></div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/55 transition group-hover:border-[#5ba8c5] group-hover:bg-[#5ba8c5] group-hover:text-[#071116]">↗</span>
      </div>
    </button>
  );
}

function ProjectDetail({ project, onClose }) {
  if (!project) return null;
  const blocks = [["The challenge", project.problem], ["My contribution", project.contribution], ["Workflow & methodology", project.workflow], ["Result & verification", project.result]];
  return (
    <div
  className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#05090c]/90 p-3 backdrop-blur-sm md:p-5"
  onMouseDown={e => {
    if (e.target === e.currentTarget) onClose();
  }}
>
      <section
  className="relative my-2 max-h-[calc(100vh-1.5rem)] w-full max-w-5xl overflow-y-auto border border-white/15 bg-[#101a20] p-5 text-white md:my-0 md:max-h-[calc(100vh-2.5rem)] md:p-8"
  role="dialog"
  aria-modal="true"
>
        <button onClick={onClose} className="absolute right-5 top-5 border border-white/25 px-3 py-2 text-[10px] uppercase tracking-widest">Close ×</button>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#91d2e7]">{project.number} / {project.category} / {project.year}</p>
        <h2 className="mt-5 max-w-3xl pr-16 text-3xl font-medium tracking-[-0.055em] md:text-5xl">{project.title}</h2>
        <p className="mt-3 text-xs text-white/45">{project.context}</p>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70">{project.summary}</p>
        {/* IFC Viewer - Projects 01, 02 and 03 */}
{["01", "02", "03"].includes(project.number) && (
  <IfcViewer
    key={project.id}
    projectId={
      project.number === "01"
        ? "construction-management"
        : project.number === "02"
          ? "integrated-bim"
          : "parametric-wall-panel"
    }
  />
)}
{/* Clash Detection - Project 01 only */}
{project.number === "01" && (
  <ClashDetection />
)}
{project.number === "01" && <QuantityTakeoff />}
{/* PDF Gallery - Project 04 */}
{/* WBS & Resource / Cost Planning - Project 01 only */}
{project.number === "01" && <PlanningVisualizer />}
{/* Schedule Viewer - Project 01 only */}
{project.number === "01" && <ScheduleViewer />}

{project.number === "04" && (
  <PassiveHouseGallery />
)}
  
        <div className="mt-7 border-y border-white/15 py-4"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#91d2e7]">Software / tools</p><p className="mt-2 text-sm text-white/75">{project.tools}</p></div>
        <div className="mt-7 grid gap-6 md:grid-cols-2">{blocks.map(([heading, text]) => <div key={heading}><h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#91d2e7]">{heading}</h3><p className="mt-2 text-sm leading-6 text-white/70">{text}</p></div>)}</div>
        <div className="mt-7 border-t border-white/15 pt-5"><h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#91d2e7]">Suggested evidence</h3><div className="mt-3 flex flex-wrap gap-2">{project.evidence.map(x => <span key={x} className="border border-white/20 px-3 py-2 text-xs text-white/70">{x}</span>)}</div></div>
        <p className="mt-6 border-l-2 border-[#5ba8c5] pl-3 text-xs leading-5 text-white/55">{project.status}</p>
      </section>
    </div>
  );
}
export default function App() {
  const [dark, setDark] = useState(true);
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  const shown = useMemo(() => filter === "All" ? projects : projects.filter(p => p.category === filter), [filter]);

  return <main className={dark ? "dark" : ""}>
    <div className="min-h-screen bg-[#f3f4f2] text-[#17232b] transition-colors dark:bg-[#0b1115] dark:text-[#eef2f3]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-[#f3f4f2]/90 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-[#0b1115]/90 md:px-10 lg:px-14">
        <a href="#top" className="text-lg font-bold tracking-[-0.06em]">
  Cihan Ay<span className="text-[#5ba8c5]">.</span>
</a>
        <nav className="hidden gap-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60 dark:text-white/60 md:flex"><a href="#services">Services</a><a href="#work">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="flex gap-2"><button onClick={() => setDark(!dark)} className="rounded-full border border-black/15 px-3 py-2 text-[9px] font-bold uppercase dark:border-white/20">{dark ? "Light mode" : "Dark mode"}</button><a href="#contact" className="hidden rounded-full bg-[#5ba8c5] px-4 py-3 text-[9px] font-bold uppercase text-[#071116] sm:inline-flex">Let’s talk ↗</a></div>
      </header>

      <section id="top" className="px-5 pb-16 pt-16 md:px-10 md:py-24 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end"><div><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#4d9ab8]">BIM · Architecture · Digital Construction</p><h1 className="text-[clamp(3.2rem,8.3vw,8.2rem)] font-medium leading-[.88] tracking-[-.075em]">BIM expertise.<br/><span className="text-[#5ba8c5]">Clear outcomes.</span></h1></div><div className="max-w-md lg:justify-self-end"><p className="text-sm leading-7 text-black/65 dark:text-white/65">Architectural BIM modelling, technical documentation, model coordination and information workflows. Explore academic and certification projects, with individual contributions and evidence clearly identified.</p><a href="#work" className="mt-6 inline-flex border-b border-[#5ba8c5] pb-2 text-[10px] font-bold uppercase tracking-[.18em]">Explore projects ↗</a></div></div>
        <div className="mt-12 grid grid-cols-2 gap-3 border-t border-black/10 pt-5 dark:border-white/10 sm:grid-cols-4">{["Architectural modelling","Technical documentation","BIM coordination","Information workflows"].map((x,i)=><div key={x}><p className="text-[9px] font-bold text-[#4d9ab8]">0{i+1}</p><p className="mt-2 text-xs font-medium">{x}</p></div>)}</div>
      </section>

      <section id="services" className="border-y border-black/10 px-5 py-16 dark:border-white/10 md:px-10 lg:px-14"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4d9ab8]">01 / What I can support</p><h2 className="mt-2 text-3xl font-medium tracking-[-.06em] md:text-5xl">BIM services</h2><div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4">{services.map(([n,t,d,tag])=><article key={n} className="border-t border-black/15 py-5 pr-5 dark:border-white/15 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"><p className="text-[10px] text-[#4d9ab8]">{n}</p><h3 className="mt-5 text-xl font-medium">{t}</h3><p className="mt-3 text-xs leading-6 text-black/60 dark:text-white/60">{d}</p><p className="mt-5 text-[8px] font-bold tracking-[.16em] text-[#4d9ab8]">{tag}</p></article>)}</div></section>

      <section id="work" className="px-3 py-16 md:px-6 lg:px-10"><div className="flex flex-col justify-between gap-4 px-2 md:flex-row md:items-end md:px-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4d9ab8]">02 / Portfolio</p><h2 className="mt-2 text-3xl font-medium tracking-[-.06em] md:text-5xl">Projects & selected work</h2><p className="mt-3 max-w-xl text-xs leading-6 text-black/55 dark:text-white/55"></p></div><p className="text-[9px] uppercase tracking-[.16em] text-black/45 dark:text-white/45">{projects.length} project groups</p></div>
        <div className="mb-5 mt-6 flex flex-wrap gap-2 px-2 md:px-4">{filters.map(x=><button key={x} onClick={()=>setFilter(x)} className={`rounded-full border px-4 py-2.5 text-[9px] font-bold uppercase tracking-[.1em] ${filter===x?"border-[#5ba8c5] bg-[#5ba8c5] text-[#071116]":"border-black/15 text-black/60 dark:border-white/20 dark:text-white/65"}`}>{x}</button>)}</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">{shown.map(p=><ProjectCard key={p.id} project={p} onOpen={setActive}/>)}</div>
      </section>
<section
  id="about"
  className="border-y border-white/10 bg-[#0e171d] px-5 py-16 text-white md:px-10 md:py-20 lg:px-14"
>
  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#5ba8c5]">
    03 / About Me
  </p>

  <div className="mt-8 grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-16">

    {/* Profile Photo */}
    <div className="mx-auto w-full max-w-sm">
      <div className="overflow-hidden border border-white/15">
        <img
  src="/images/profile/cihan-ay.jpg"
  alt="Cihan Ay - Architectural and BIM Profile"
  className="h-full w-full object-cover"
/>
      </div>
      <h3 className="mt-5 text-2xl font-medium tracking-tight">
        Cihan Ay
      </h3>
      <p className="mt-1 text-xs uppercase tracking-[.15em] text-[#5ba8c5]">
        Architecture · BIM · Digital Construction
      </p>
    </div>

    {/* About Text */}
    <div>
      <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-[-.05em] md:text-5xl">
        Bridging architectural design and digital construction.
      </h2>

      <p className="mt-7 max-w-2xl text-sm leading-8 text-white/65">
        Architecture graduate and MSc candidate in Management of the Built
        Environment at Politecnico di Milano, with a practical foundation
        in AutoCAD, Revit, technical drawing production, BIM-based
        documentation, and project information coordination. Interested
        in supporting coordinated design delivery, integrating client BIM
        models, managing drawing programmes, and collaborating with
        multidisciplinary project teams.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/15 pt-6 sm:grid-cols-2">

  <div>
    <p className="text-[9px] uppercase tracking-widest text-[#5ba8c5]">
      Bachelor's Degree
    </p>
    <p className="mt-2 text-sm font-medium">
      Architecture
    </p>
    <p className="text-xs text-white/50">
      Middle East Technical University
    </p>
  </div>

  <div>
    <p className="text-[9px] uppercase tracking-widest text-[#5ba8c5]">
      Master's Degree
    </p>
    <p className="mt-2 text-sm font-medium">
      Management of the Built Environment
    </p>
    <p className="text-xs text-white/50">
      Politecnico di Milano
    </p>
  </div>


        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#5ba8c5]">
            Focus Areas
          </p>
          <p className="mt-2 text-sm">BIM & Digital Construction</p>
          <p className="text-xs text-white/50">Technical Documentation</p>
        </div>
      </div>
    </div>

  </div>
</section>

<footer id="contact" className="bg-[#e7eef0] px-5 py-16 text-[#17232b] dark:bg-[#111d24] dark:text-[#eef2f3] md:px-10 lg:px-14">

  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4d9ab8]">
    04 / Contact
  </p>

  <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">

    <h2 className="text-5xl font-medium leading-[.95] tracking-[-.07em] md:text-7xl">
      Let’s build<br />
      better BIM<span className="text-[#5ba8c5]">.</span>
    </h2>

    <div className="text-sm leading-7">
      <a className="underline decoration-[#5ba8c5] underline-offset-4"
         href="mailto:aycihann8256@gmail.com">
        aycihann8256@gmail.com
      </a>

      <a className="mt-3 block underline decoration-[#5ba8c5] underline-offset-4"
         href="https://www.linkedin.com/in/cihanay/"
         target="_blank"
         rel="noreferrer">
        LinkedIn ↗
      </a>

      <p className="mt-3 text-xs opacity-50">
        Italy · Open to professional opportunities
      </p>
    </div>

  </div>

  <div className="mt-16 border-t border-black/10 pt-5 text-[9px] uppercase tracking-[.16em] opacity-45 dark:border-white/10">
    © 2026 CIHAN AY — BIM PORTFOLIO
  </div>

</footer>
      <ProjectDetail project={active} onClose={()=>setActive(null)}/>
    </div>
  </main>;
}
