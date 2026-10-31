import type { Dictionary } from "./pt";

const en: Dictionary = {
  meta: {
    title: "Technical event production — stage, light and sound",
    description:
      "Stage building, lighting, sound systems and show production for concerts, conferences, festivals and private events across the country.",
  },
  switchLang: "PT",
  hero: {
    kicker: "Technical event production",
    title: ["We build the stage.", "We light up the night."],
    lead: "Stages, light, sound and show — from a 200-seat conference to a 20,000-people festival. We handle the technical side, you handle the rest.",
    scroll: "Scroll to switch the lights on",
  },
  lights: {
    lines: ["Light.", "Sound.", "Stage.", "Show."],
    caption: "Everything leaves the same warehouse. Everything arrives ready to plug in.",
  },
  warehouse: {
    kicker: "The warehouse",
    title: "It all starts here.",
    lead: "Every event leaves our warehouse tested, labelled and ready to build. Scroll to load the truck.",
    items: [
      { title: "Stages", text: "Modular decks, stairs and skirting — from a conference lectern to a festival main stage." },
      { title: "Structures", text: "Certified truss, towers and goalposts to fly light, sound and set pieces safely." },
      { title: "Lighting", text: "Moving heads, washes, profiles and LED. Lighting design made for the space and the moment." },
      { title: "Sound", text: "Line arrays, monitoring and microphones — from 50-seat rooms to squares with thousands." },
      { title: "FOH & room tuning", text: "Console, engineers and acoustic measurement: we tune the room so every seat sounds right." },
      { title: "Show", text: "Haze, CO₂, confetti and technical direction to turn an event into a moment." },
    ],
    outro: "Fully loaded. Hitting the road.",
  },
  trip: {
    depart: "Door open. The truck rolls out fully loaded — and the road is long.",
    kicker: "The road",
    title: "North to south, the whole country is our stage.",
    enRoute: "On the way to",
    stop: "Stop",
    stops: [
      { city: "Porto", type: "Open-air concert", text: "A 12-metre stage, line array and lighting design for thousands on a summer night." },
      { city: "Coimbra", type: "Conference", text: "An auditorium with FOH, screens, panel microphones and a tuned room so every row hears clearly." },
      { city: "Lisbon", type: "Festival", text: "Two stages, three days, one technical crew on site from the first soundcheck to the last chord." },
      { city: "Algarve", type: "Private event", text: "A sunset wedding: ambient lighting, a DJ dance floor and discreet sound for dinner." },
    ],
    outro: "From the Minho to the Algarve — we take the show wherever it's needed.",
  },
  packs: {
    kicker: "Service packs",
    title: "Pick your stage.",
    lead: "Three starting points, built around the events we do most. Adjust the extras and watch the estimate change — and the stage light up — in real time.",
    from: "from",
    popular: "Most booked",
    items: {
      essencial: {
        name: "Essential",
        capacity: "Up to 150 guests",
        features: ["Sound for speech and background music", "2 moving heads + ambient lighting", "1 technician during the event", "Set-up and take-down"],
      },
      pro: {
        name: "Pro",
        capacity: "Up to 800 guests",
        features: ["Line array and monitoring", "4 moving heads + wash", "6 × 4 m stage", "FOH and 2 technicians"],
      },
      espetaculo: {
        name: "Show",
        capacity: "Up to 5,000 guests",
        features: ["Large-format line array", "6 moving heads, beams and LED", "10 × 6 m stage with truss", "Full crew and technical direction"],
      },
    },
    extrasTitle: "Extras",
    extras: {
      led: { name: "LED screen 3 × 2 m", unit: "" },
      heads: { name: "Extra moving heads", unit: "/ unit" },
      dj: { name: "DJ booth", unit: "" },
      fx: { name: "Haze and CO₂", unit: "" },
      tech: { name: "Extra technician", unit: "/ day" },
    },
    days: "Event days",
    estimate: "Estimate",
    note: "Indicative price, VAT excluded. The final quote is tailored to your event.",
    cta: "Request a quote with this setup",
    add: "Add",
    remove: "Remove",
  },
  next: "Next: got a set budget? Build your stage.",
};

export default en;
