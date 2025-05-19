import express from "express";
import {
  FishCalculator,
  SuitsCalculator,
  FlowerCalculator,
} from "toonapi-calculator";
import fetch from "node-fetch";
import { LRUCache } from "lru-cache";

const router = express.Router();

router.post("/get-fish", async (req, res) => {
  const { toonData } = req.body;

  if (!toonData) {
    return res.status(400).json({ message: "Toon data is required" });
  }

  const calc = new FishCalculator(JSON.stringify(toonData.data.fish));

  try {
    const rarity = calc.sortBestRarity();
    const caught = calc.getCaught();
    const catchable = calc.getCatchable();
    const fishData = { rarity, caught, catchable };

    if (fishData) {
      return res.status(200).json(fishData);
    } else {
      return res
        .status(404)
        .json({ message: "Fish data not found for this toon" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/get-promo", async (req, res) => {
  const { toonData, dept } = req.body;

  if (!toonData || !dept) {
    return res.status(400).json({ message: "Toon data and dept is required" });
  }

  const calc = new SuitsCalculator(JSON.stringify(toonData.data.cogsuits));

  try {
    const promoData = calc.getBestPathWeighted(dept);
    if (promoData) {
      return res.status(200).json(promoData);
    } else {
      return res
        .status(404)
        .json({ message: "Suit data not found for this toon" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/get-garden", async (req, res) => {
  const { toonData } = req.body;

  const calc = new FlowerCalculator(JSON.stringify(toonData.data.flowers));

  try {
    const upgrade = calc.getDaysToUpgrade();
    const plantable = calc.getPlantableFlowers();
    const progress = calc.getProgressFlowers();
    const missing = calc.getMissingFlowers();
    const maxCombo = calc.getComboLevel();
    const flowers = { maxCombo, upgrade, plantable, progress, missing };

    if (flowers) {
      return res.status(200).json(flowers);
    } else {
      return res
        .status(404)
        .json({ message: "Flower data not found for this toon" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Proxy TTR invasions API with in-memory caching and CORS
let getCachedInvasions;
(async () => {
  const invasionHelpers = await import("./invasionHelpers.js");
  getCachedInvasions = invasionHelpers.getCachedInvasions;
})();

router.get("/get-invasions", async (req, res) => {
  res.set("Cache-Control", "public, max-age=60");
  if (!getCachedInvasions) {
    // If not loaded yet, wait for import
    const invasionHelpers = await import("./invasionHelpers.js");
    getCachedInvasions = invasionHelpers.getCachedInvasions;
  }
  const apiResponse = await getCachedInvasions();
  if (apiResponse.error) {
    // 502 for fetch error, 500 for other errors
    const status = apiResponse.error.includes("fetch") ? 502 : 500;
    return res.status(status).json(apiResponse);
  }
  return res.status(200).json(apiResponse);
});

// LRU cache for renditions: 1 day TTL, max 500 items (adjust as needed)
// Each cached item is an image buffer (typically ~5KB per image).
// With 500 items, this is roughly 2.5MB of memory (500 * 5KB).
// The cache evicts the least recently used or expired (not accessed in 24h) images automatically.
// This prevents unbounded memory growth and stale data accumulation, which is important for long-running servers.
const rendition_cache = new LRUCache({
  max: 500,
  ttl: 24 * 60 * 60 * 1000, // 1 day in ms
});

router.get("/get-rendition", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (rendition_cache.has(url)) {
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
    return res.send(rendition_cache.get(url));
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": process.env.USER_AGENT,
      },
    });
    if (!response.ok) {
      return res.status(502).json({ error: "TTR failed to fetch rendition" });
    }
    const buffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    rendition_cache.set(url, imageBuffer);

    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
    return res.send(imageBuffer);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch rendition" });
  }
});

export default router;
