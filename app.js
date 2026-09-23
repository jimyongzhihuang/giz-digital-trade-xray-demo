async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

async function loadMeasurements() {
  const itiElement = document.getElementById("iti-value");
  const gitiElement = document.getElementById("giti-value");
  const idiElement = document.getElementById("idi-value");
  const alignmentElement = document.getElementById("alignment-status");

  try {
    const [itiData, gitiData, idiData] = await Promise.all([
      loadJson("trade-iti-001.json"),
      loadJson("trade-giti-001.json"),
      loadJson("trade-idi-001.json")
    ]);

    const iti = itiData?.result?.iti;
    const giti = gitiData?.result?.giti;
    const idi = idiData?.idi;
    const direction = idiData?.direction;

    itiElement.textContent =
      typeof iti === "number" ? iti.toFixed(4) : "N/A";

    gitiElement.textContent =
      typeof giti === "number" ? giti.toFixed(4) : "N/A";

    idiElement.textContent =
      typeof idi === "number" ? idi.toFixed(4) : "N/A";

    if (direction === "aligned") {
      alignmentElement.textContent =
        "Baseline result: ITI and gITI are aligned for this reconstructed event.";
    } else if (direction === "geometric-above-arithmetic") {
      alignmentElement.textContent =
        "Relational tension exceeds observable arithmetic tension.";
    } else if (direction === "arithmetic-above-geometric") {
      alignmentElement.textContent =
        "Observable arithmetic tension exceeds relational tension.";
    } else {
      alignmentElement.textContent =
        "Measurement alignment status unavailable.";
    }

  } catch (error) {
    console.error(error);

    itiElement.textContent = "N/A";
    gitiElement.textContent = "N/A";
    idiElement.textContent = "N/A";

    alignmentElement.textContent =
      "Measurement output could not be loaded.";
  }
}

document.addEventListener("DOMContentLoaded", loadMeasurements);
