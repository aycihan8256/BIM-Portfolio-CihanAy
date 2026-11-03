import { useState } from "react";

const schedules = [
  {
    id: "base",
    name: "Base Schedule",
    file: "/documents/construction-management/scheduling/BASE.pdf",
  },
  {
    id: "ev",
    name: "Earned Value Schedule",
    file: "/documents/construction-management/scheduling/EV.pdf",
  },
  {
    id: "accelerated",
    name: "Accelerated Schedule",
    file: "/documents/construction-management/scheduling/ACCELERATED.pdf",
  },
];

export default function ScheduleViewer() {
  const [activeSchedule, setActiveSchedule] = useState(schedules[0]);

  return (
    <section className="mt-14 space-y-6">
      {/* Section heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Project 01 / Project Planning
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          WBS-Based Planning & Project Scheduling
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Project activities were structured through a Work Breakdown
          Structure (WBS) and developed into a time-based construction
          programme using Primavera P6. The schedules illustrate the
          planned sequencing of structural, architectural and finishing
          works, providing a framework for project duration and progress
          monitoring.
        </p>
      </div>

      {/* PDF Viewer */}
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 px-5 py-4">
          <div>
            <h3 className="font-semibold text-white">
              Primavera P6 Schedule Viewer
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Interactive PDF document viewer
            </p>
          </div>

          <a
            href={activeSchedule.file}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800"
          >
            Open Full Screen ↗
          </a>
        </div>

        {/* Schedule tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-700 p-3">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => setActiveSchedule(schedule)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm transition ${
                activeSchedule.id === schedule.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {schedule.name}
            </button>
          ))}
        </div>

        {/* PDF frame */}
        <div className="h-[750px] bg-slate-800">
          <iframe
            key={activeSchedule.id}
            src={`${activeSchedule.file}#toolbar=1&navpanes=0&view=FitH`}
            title={activeSchedule.name}
            className="h-full w-full border-0"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 px-5 py-3 text-xs text-slate-500">
          Currently viewing: {activeSchedule.name}
        </div>
      </div>
    </section>
  );
}