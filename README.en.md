# 🌺 Mālama Map

**A citizen-science map to protect Hawaiʻi's native plants**

*Mālama = "to care for, to protect" in Hawaiian*

🌐 [日本語](README.md) | **English**

---

## What is this?

**Mālama Map** is a web app where citizens report and share sightings of Hawaiʻi's plants.

An **AI model (BioCLIP)** identifies the species from a photo you take, and distinguishes **native plants** (endemic to Hawaiʻi) from **invasive plants** (those threatening the forests). As sightings accumulate, the goal is to catch the spread of invasive species — and **ROD (Rapid ʻŌhiʻa Death)** — early.

> 🎯 Mission: record Hawaiʻi's vanishing native plants and spot invasive encroachment through the power of citizens.

---

## Features

### 🗺️ Map
Reported plants appear as pins. Tap a pin to see the photo, species name, and the AI's confidence score.

| Pin color | Meaning |
|---|---|
| 🟢 Green | Native |
| 🔴 Red | Invasive |
| ⚪ White | Suspected ROD (ʻŌhiʻa death) |
| ⚫ Gray | Unconfirmed |

### 📖 Plant Dex
A Pokédex-style field guide that fills in as you find plants.

- 🔓 **Discovered** (reported species) / 🔒 **Undiscovered**
- Shows the **completion rate (%)** for native and invasive plants separately
- Tap a card for detailed info and a map of that species' sightings

### 📷 Report
Record a plant you found with a photo, and add it to the map and the dex.

---

## How to use (3 steps)

### ① Take or choose a photo 📷
On the "Report" page, take or pick a photo of a plant.
The AI suggests candidate species — pick one from the list. Not sure? **"Unconfirmed" is fine.**

> ✂️ **When multiple plants are in the frame**, use "Select area" to crop the **whole single plant** you want identified (include its leaves and overall form). This improves accuracy.

### ② Choose the location 📍
Tap the spot on the map where you saw it.
If the photo has GPS data, the app **suggests it automatically ("Is this the spot?")**. You can also use the "Use current location" button.

### ③ Submit ✅
Confirm the species, location, and note, then submit.
Finding a new species triggers a **"Ta-da!" discovery moment** — the dex fills in and a new pin appears on the map.

---

## Good to know

- BioCLIP 2.5 identifies Hawaiʻi's endemic plants using knowledge learned from ~200 million biological images — **with no additional training**.
- A close-up of just the flower is easy to confuse with related species, so it helps to **include the leaves and the whole plant** in the shot.
- When confidence is low, the app doesn't force a guess — it routes the sighting to "Unconfirmed" for community review (i.e., it avoids confident-but-wrong answers by design).

---

## Notes

- This is **Phase 1 (a demo)**.
- Reports are stored **on your device (localStorage)** — there is no shared server yet.
- AI identification requires the local BioCLIP server (you can still submit as "Unconfirmed" without it).

---

*🌺 Protecting Hawaiʻi's forests through citizen science.*
