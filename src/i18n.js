import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Home
import homeEN from "./locales/en/Home.json";
import homeHI from "./locales/hi/Home.json";
import homeKN from "./locales/kn/Home.json";

// Awareness
import awarenessEN from "./locales/en/Awareness.json";
import awarenessHI from "./locales/hi/Awareness.json";
import awarenessKN from "./locales/kn/Awareness.json";

// Layout
import layoutEN from "./locales/en/Layout.json";
import layoutHI from "./locales/hi/Layout.json";
import layoutKN from "./locales/kn/Layout.json";

// Preparedness
import preparednessEN from "./locales/en/Preparedness.json";
import preparednessHI from "./locales/hi/Preparedness.json";
import preparednessKN from "./locales/kn/Preparedness.json";

// Response
import responseEN from "./locales/en/Response.json";
import responseHI from "./locales/hi/Response.json";
import responseKN from "./locales/kn/Response.json";

// Recovery
import recoveryEN from "./locales/en/Recovery.json";
import recoveryHI from "./locales/hi/Recovery.json";
import recoveryKN from "./locales/kn/Recovery.json";

// Earthquake
import earthquakeEN from "./locales/en/Earthquake.json";
import earthquakeHI from "./locales/hi/Earthquake.json";
import earthquakeKN from "./locales/kn/Earthquake.json";

// Landslide
import landslideEN from "./locales/en/Landslide.json";
import landslideHI from "./locales/hi/Landslide.json";
import landslideKN from "./locales/kn/Landslide.json";

import floodEN from "./locales/en/Flood.json";
import floodHI from "./locales/hi/Flood.json";
import floodKN from "./locales/kn/Flood.json";

import forestfiringEN from "./locales/en/Forestfiring.json";
import forestfiringHI from "./locales/hi/Forestfiring.json";
import forestfiringKN from "./locales/kn/Forestfiring.json";

// Earthquake MCQ
import earthquakemcqEN from "./locales/en/Earthquakemcq.json";
import earthquakemcqHI from "./locales/hi/Earthquakemcq.json";
import earthquakemcqKN from "./locales/kn/Earthquakemcq.json";

// Earthquake Scenario
import earthquakescenarioEN from "./locales/en/Earthquakescenario.json";
import earthquakescenarioHI from "./locales/hi/Earthquakescenario.json";
import earthquakescenarioKN from "./locales/kn/Earthquakescenario.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: homeEN,
      awareness: awarenessEN,
      layout: layoutEN,
      preparedness: preparednessEN,
      response: responseEN,
      recovery: recoveryEN,
      earthquake: earthquakeEN,
      landslide: landslideEN,
      flood:floodEN,
      forestfiring:forestfiringEN,
      earthquakemcq: earthquakemcqEN,
      earthquakescenario: earthquakescenarioEN,
    },
    hi: {
      home: homeHI,
      awareness: awarenessHI,
      layout: layoutHI,
      preparedness: preparednessHI,
      response: responseHI,
      recovery: recoveryHI,
      earthquake: earthquakeHI,
      landslide: landslideHI,
      flood:floodHI,
      forestfiring:forestfiringHI,
      earthquakemcq: earthquakemcqHI,
      earthquakescenario: earthquakescenarioHI,
    },
    kn: {
      home: homeKN,
      awareness: awarenessKN,
      layout: layoutKN,
      preparedness: preparednessKN,
      response: responseKN,
      recovery: recoveryKN,
      earthquake: earthquakeKN,
      landslide: landslideKN,
      flood:floodKN,
      forestfiring:forestfiringKN,
      earthquakemcq: earthquakemcqKN,
      earthquakescenario: earthquakescenarioKN,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
