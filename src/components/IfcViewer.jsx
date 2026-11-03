import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";

// All project disciplines are defined here.
// Add new IFC models to this array without changing the viewer logic.

const PROJECT_MODELS_BY_PROJECT = {
  "integrated-bim": [
    {
      id: "ARCH",
      name: "Architecture",
      file: "/models/integrated-bim/ARCH.ifc",
      required: true,
    },
    {
      id: "STR",
      name: "Structure",
      file: "/models/integrated-bim/STR.ifc",
      required: true,
    },
    {
      id: "HVAC",
      name: "HVAC",
      file: "/models/integrated-bim/HVAC.ifc",
      required: false,
    },
    {
      id: "Electrical",
      name: "Electrical",
      file: "/models/integrated-bim/Electrical.ifc",
      required: false,
    },
    {
      id: "Plumbing",
      name: "Plumbing",
      file: "/models/integrated-bim/Plumbing.ifc",
      required: false,
    },
  ],

  "construction-management": [
    {
      id: "ARCH",
      name: "Architecture",
      file: "/models/construction-management/ARCH.ifc",
      required: true,
    },
    {
      id: "STR",
      name: "Structure",
      file: "/models/construction-management/STR.ifc",
      required: true,
    },
    {
      id: "HVAC",
      name: "Mechanical / HVAC",
      file: "/models/construction-management/HVAC.ifc",
      required: false,
    },
    {
      id: "Electrical",
      name: "Electrical",
      file: "/models/construction-management/Electrical.ifc",
      required: false,
    },
    {
      id: "Plumbing",
      name: "Plumbing",
      file: "/models/construction-management/Plumbing.ifc",
      required: false,
    },
  ],

  "parametric-wall-panel": [
    {
      id: "WallPanel",
      name: "Parametric Wall Panel",
      file: "/models/parametric-wall-panel/WallPanel.ifc",
      required: true,
    },
  ],
};

export default function IfcViewer({ projectId = "integrated-bim" }) {
  const PROJECT_MODELS =
    PROJECT_MODELS_BY_PROJECT[projectId] ||
    PROJECT_MODELS_BY_PROJECT["integrated-bim"];
 
    const hostRef = useRef(null);
const componentsRef = useRef(null);
const initializationPromiseRef = useRef(null);
const modelObjectsRef = useRef({});

  const [loadedModels, setLoadedModels] = useState([]);
  const [missingModels, setMissingModels] = useState([]);
  const [status, setStatus] = useState("Preparing BIM viewer...");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [visibleModels, setVisibleModels] = useState({
    ARCH: true,
    STR: true,
    HVAC: true,
    Electrical: true,
    Plumbing: true,
    WallPanel: true,
  });

  // --------------------------------------------------
  // INITIALIZE VIEWER
  // --------------------------------------------------

  async function initializeViewer() {
if (componentsRef.current) {
return componentsRef.current;
}

if (initializationPromiseRef.current) {
return initializationPromiseRef.current;
}

initializationPromiseRef.current = (async () => {
console.log("INITIALIZING SINGLE BIM VIEWER...");

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

world.renderer = new OBC.SimpleRenderer(
  components,
  hostRef.current
);

world.camera = new OBC.OrthoPerspectiveCamera(components);

await world.camera.controls.setLookAt(
  18, 14, 18,
  0, 0, 0
);

components.init();

components.get(OBC.Grids).create(world);

const workerUrl = await OBC.FragmentsManager.getWorker();
const fragments = components.get(OBC.FragmentsManager);

await fragments.init(workerUrl);

world.camera.controls.addEventListener("update", () => {
  fragments.core.update();
});

fragments.list.onItemSet.add(({ value: model }) => {
  console.log("FRAGMENT MODEL ADDED:", model.modelId);

  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);

  modelObjectsRef.current[model.modelId] = model.object;

  fragments.core.update(true);
});

const ifcLoader = components.get(OBC.IfcLoader);

await ifcLoader.setup({
  autoSetWasm: false,
  wasm: {
    path: "/wasm/",
    absolute: false,
  },
});

componentsRef.current = {
  components,
  world,
  ifcLoader,
  fragments,
};

console.log("SINGLE BIM VIEWER INITIALIZED.");

return componentsRef.current;

})();

return initializationPromiseRef.current;
}



  // --------------------------------------------------
  // LOAD ONE IFC MODEL
  // --------------------------------------------------

  async function loadIfcModel(modelInfo) {
    const response = await fetch(modelInfo.file);

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }

      throw new Error(
        `Unable to access ${modelInfo.name} IFC file.`
      );
    }

    const blob = await response.blob();

    const data = new Uint8Array(
      await blob.arrayBuffer()
    );

    const { ifcLoader } = componentsRef.current;

   console.log("STARTING IFC CONVERSION:", modelInfo.id);

const result = await ifcLoader.load(
  data,
  true,
  modelInfo.id,
  {
    processData: {
      progressCallback: (progress) => {
        console.log(
          `IFC PROGRESS ${modelInfo.id}:`,
          progress
        );
      },
    },
  }
);
console.log("IFC CONVERSION COMPLETED:", modelInfo.id);
console.log("IFC LOAD RESULT:", result);
console.log(
  "FRAGMENTS LIST:",
  [...componentsRef.current.fragments.list]
);

    setLoadedModels((previous) => {
      if (previous.some((item) => item.id === modelInfo.id)) {
        return previous;
      }

      return [...previous, modelInfo];
    });

    return true;
  }

  // --------------------------------------------------
  // LOAD ALL PROJECT DISCIPLINES
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadProjectModels() {
      setBusy(true);
      setError("");

      try {
        setStatus("Initializing 3D BIM viewer...");

        await initializeViewer();
        console.log("STEP 5: Starting IFC loading loop...");

        const missing = [];

        for (const model of PROJECT_MODELS) {
          if (cancelled) return;

          setStatus(`Loading ${model.name} model...`);

          try {
            const loaded = await loadIfcModel(model);

            if (!loaded) {
              missing.push(model);

              if (model.required) {
                throw new Error(
                  `Required IFC model not found: ${model.name}`
                );
              }
            }
          } catch (modelError) {
            console.error(
              `Error loading ${model.name}:`,
              modelError
            );

            if (model.required) {
              throw modelError;
            }

            missing.push(model);
          }
        }
const bounds = new THREE.Box3();
console.log("========== MODEL DIAGNOSTICS ==========");

Object.entries(modelObjectsRef.current).forEach(([id, object]) => {
  console.log("MODEL:", id);
  console.log("VISIBLE:", object.visible);
  console.log("POSITION:", object.position);
  console.log("CHILDREN:", object.children.length);
  console.log("WORLD POSITION:", object.getWorldPosition(new THREE.Vector3()));
});

console.log("=======================================");

Object.values(modelObjectsRef.current).forEach((object) => {
  bounds.expandByObject(object);
});

console.log("BOUNDING BOX EMPTY:", bounds.isEmpty());
console.log("BOUNDING BOX MIN:", bounds.min);
console.log("BOUNDING BOX MAX:", bounds.max);
console.log("BOUNDING BOX SIZE:", bounds.getSize(new THREE.Vector3()));
if (!bounds.isEmpty()) {
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  bounds.getCenter(center);
  bounds.getSize(size);

  const maxDimension = Math.max(
    size.x,
    size.y,
    size.z
  );

  const distance = maxDimension * 1.8;

  const { world, fragments } = componentsRef.current;

  await world.camera.controls.setLookAt(
    center.x + distance,
    center.y + distance * 0.7,
    center.z + distance,
    center.x,
    center.y,
    center.z,
    true
  );

  await fragments.core.update(true);
}
        if (!cancelled) {
          setMissingModels(missing);

          setStatus(
            "BIM model loading completed. Available disciplines are ready to explore."
          );
        }

      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err.message || "BIM model loading failed."
          );

          setStatus("Model loading failed.");
        }

      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    }

    loadProjectModels();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------
  // CONTROL MODEL VISIBILITY
  // --------------------------------------------------

  useEffect(() => {
    Object.entries(visibleModels).forEach(
      ([id, visible]) => {
        const object = modelObjectsRef.current[id];

        if (object) {
          object.visible = visible;
        }
      }
    );
  }, [visibleModels, loadedModels]);

  function toggleModel(id) {
    setVisibleModels((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  }

  // --------------------------------------------------
  // USER INTERFACE
  // --------------------------------------------------

  return (
    <div className="mt-8 border border-white/15 bg-[#0a1217] p-3 md:p-5">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#91d2e7]">
            Interactive BIM Model
          </p>

          <p className="mt-1 text-xs text-white/55">
            Federated IFC Viewer · Rotate · Zoom · Pan
          </p>
        </div>

        <div className="text-[10px] text-[#91d2e7]">
          {loadedModels.length} / {PROJECT_MODELS.length} DISCIPLINES
        </div>

      </div>

      {/* DISCIPLINE CONTROLS */}

      <div className="mt-5">

        <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-white/45">
          Model Visibility
        </p>

        <div className="flex flex-wrap gap-2">

          {PROJECT_MODELS.map((model) => {
            const isLoaded = loadedModels.some(
              (item) => item.id === model.id
            );

            const isVisible = visibleModels[model.id];

            return (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                disabled={!isLoaded}
                className={`border px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition ${
                  !isLoaded
                    ? "cursor-not-allowed border-white/10 text-white/25"
                    : isVisible
                    ? "border-[#5ba8c5] bg-[#5ba8c5]/10 text-[#bce9f7]"
                    : "border-white/20 text-white/45"
                }`}
              >
                {isLoaded
                  ? isVisible
                    ? "● "
                    : "○ "
                  : "– "}

                {model.name}
              </button>
            );
          })}

        </div>

      </div>

      {/* 3D VIEWER */}

      <div className="relative mt-4 h-[420px] overflow-hidden border border-white/10 bg-[#111c23] md:h-[540px]">

        <div
          ref={hostRef}
          className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
        />

        {busy && (
          <div className="absolute inset-x-0 bottom-0 bg-[#071116]/90 p-4">

            <p className="text-[10px] text-white/75">
              {status}
            </p>

          </div>
        )}

      </div>

      {/* STATUS */}

      <div className="mt-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

        <p className="text-[10px] leading-5 text-white/50">
          {status}
        </p>

        <p className="text-[10px] text-[#91d2e7]">
          {loadedModels.length} IFC MODELS LOADED
        </p>

      </div>

      {/* MISSING MODELS */}

      {missingModels.length > 0 && (
        <div className="mt-3 border-l-2 border-[#5ba8c5] pl-3">

          <p className="text-[9px] font-bold uppercase tracking-wider text-[#91d2e7]">
            Pending IFC Models
          </p>

          <p className="mt-1 text-[10px] leading-5 text-white/45">
            {missingModels.map((model) => model.name).join(", ")}
          </p>

        </div>
      )}

      {/* ERRORS */}

      {error && (
        <p
          role="alert"
          className="mt-3 border-l-2 border-red-400 pl-3 text-xs leading-5 text-red-200"
        >
          {error}
        </p>
      )}

    </div>
  );
}