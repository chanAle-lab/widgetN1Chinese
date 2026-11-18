// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: book;

/**
 * Chinese Word of the Day (每日一词) - iOS Widget for Scriptable
 * Repository: https://github.com/chanAle-lab/widgetN1Chinese
 * 
 * Features:
 * - Beautiful Lock Screen widget support (accessoryRectangular, accessoryCircular, accessoryInline).
 * - Full Home Screen support (Small, Medium, Large).
 * - Dynamic daily rotation by day of year.
 * - Offline cache support: Works with or without network.
 * - Tap to inspect: Opens dictionary/translation.
 */

const CONFIG = {
  ALL_WORDS_URL: "https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/words.json",
  TODAY_URL: "https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json",
  
  // Home Screen Theme Colors
  BG_START: "#7A1C1C",     // Deep Imperial Crimson
  BG_END: "#141416",       // Deep Slate/Charcoal
  ACCENT_GOLD: "#E5C07B",  // Classical Gold
  TEXT_WHITE: "#FDFDFD",   // Clean White
  TEXT_MUTED: "#CCCCCC",   // Soft Grey
  TEXT_DIM: "#8E8E93",     // Subtle Grey
  
  CACHE_KEY: "chinese_wotd_cache"
};

// Built-in fallback
const OFFLINE_FALLBACK = {
  date: new Date().toISOString().slice(0, 10),
  hanzi: "沉淀",
  pinyin: "chén diàn",
  english: "to settle; accumulate deep experience",
  hsk_level: "HSK 6",
  example_cn: "时间能沉淀最真实的感情。",
  example_pinyin: "Shíjiān néng chéndiàn zuì zhēnshí de gǎnqíng.",
  example_en: "Time settles and reveals the most genuine emotions."
};

/**
 * Fetch word data with multi-layer fallback
 */
async function getWordData() {
  const fm = FileManager.local();
  const cachePath = fm.joinPath(fm.documentsDirectory(), CONFIG.CACHE_KEY + ".json");

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // 1. Fetch full words list
  try {
    const req = new Request(CONFIG.ALL_WORDS_URL);
    req.timeoutInterval = 6;
    const words = await req.loadJSON();
    if (Array.isArray(words) && words.length > 0) {
      const selected = words[(dayOfYear - 1) % words.length];
      fm.writeString(cachePath, JSON.stringify(selected));
      return selected;
    }
  } catch (e) {
    console.log("Could not load words.json: " + e);
  }

  // 2. Try today.json
  try {
    const reqToday = new Request(CONFIG.TODAY_URL);
    reqToday.timeoutInterval = 6;
    const data = await reqToday.loadJSON();
    if (data && data.hanzi) {
      fm.writeString(cachePath, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.log("Could not load today.json: " + e);
  }

  // 3. Try local cache
  if (fm.fileExists(cachePath)) {
    try {
      const cached = JSON.parse(fm.readString(cachePath));
      if (cached && cached.hanzi) {
        return cached;
      }
    } catch (e) {
      console.log("Cache read error: " + e);
    }
  }

  return OFFLINE_FALLBACK;
}

/**
 * Lock Screen Rectangular Widget Layout (Side-by-side, perfectly fits iOS lock screen)
 */
function buildLockScreenRectangular(widget, data) {
  widget.setPadding(0, 0, 0, 0);

  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();

  // --- LEFT: Large Hanzi ---
  const leftStack = row.addStack();
  leftStack.layoutVertically();
  leftStack.centerAlignContent();

  const hanziText = leftStack.addText(data.hanzi);
  hanziText.font = Font.boldSystemFont(data.hanzi.length > 2 ? 21 : 25);
  hanziText.textColor = Color.white();
  hanziText.lineLimit = 1;

  row.addSpacer(8);

  // --- RIGHT: Pinyin + English + HSK ---
  const rightStack = row.addStack();
  rightStack.layoutVertically();

  // Pinyin
  const pinyinText = rightStack.addText(data.pinyin);
  pinyinText.font = Font.semiboldSystemFont(12);
  pinyinText.textColor = Color.white();
  pinyinText.lineLimit = 1;

  rightStack.addSpacer(2);

  // English Definition
  const englishText = rightStack.addText(data.english);
  englishText.font = Font.systemFont(10);
  englishText.textColor = new Color("#FFFFFF", 0.88);
  englishText.lineLimit = 2;

  if (data.hsk_level) {
    rightStack.addSpacer(2);
    const hskText = rightStack.addText(data.hsk_level);
    hskText.font = Font.systemFont(8);
    hskText.textColor = new Color("#FFFFFF", 0.6);
  }
}

/**
 * Lock Screen Circular Widget Layout
 */
function buildLockScreenCircular(widget, data) {
  widget.setPadding(0, 0, 0, 0);

  const col = widget.addStack();
  col.layoutVertically();
  col.centerAlignContent();

  const hanziText = col.addText(data.hanzi);
  hanziText.font = Font.boldSystemFont(18);
  hanziText.textColor = Color.white();

  const pinyinText = col.addText(data.pinyin);
  pinyinText.font = Font.systemFont(9);
  pinyinText.textColor = new Color("#FFFFFF", 0.8);
}

/**
 * Lock Screen Inline Text Layout (Above Clock)
 */
function buildLockScreenInline(widget, data) {
  const line = widget.addText(`${data.hanzi} (${data.pinyin}) · ${data.english}`);
  line.font = Font.systemFont(12);
  line.textColor = Color.white();
}

/**
 * Home Screen Widget Layout (Small, Medium, Large)
 */
function buildHomeScreenWidget(widget, data, family) {
  // Gradient background
  const gradient = new LinearGradient();
  gradient.locations = [0.0, 1.0];
  gradient.colors = [new Color(CONFIG.BG_START), new Color(CONFIG.BG_END)];
  widget.backgroundGradient = gradient;
  widget.setPadding(16, 16, 16, 16);

  // --- HEADER ROW ---
  const header = widget.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();

  const title = header.addText("每日一词");
  title.font = Font.boldSystemFont(family === "small" ? 10 : 11);
  title.textColor = new Color(CONFIG.ACCENT_GOLD);

  header.addSpacer();

  if (data.hsk_level) {
    const badgeStack = header.addStack();
    badgeStack.backgroundColor = new Color("#000000", 0.35);
    badgeStack.cornerRadius = 4;
    badgeStack.setPadding(2, 6, 2, 6);
    const badgeText = badgeStack.addText(data.hsk_level);
    badgeText.font = Font.semiboldSystemFont(family === "small" ? 9 : 10);
    badgeText.textColor = new Color(CONFIG.ACCENT_GOLD);
  }

  widget.addSpacer(family === "small" ? 4 : 8);

  // --- MAIN HANZI & PINYIN ---
  const hanziText = widget.addText(data.hanzi);
  hanziText.font = Font.boldSystemFont(family === "small" ? 28 : (family === "large" ? 42 : 34));
  hanziText.textColor = new Color(CONFIG.TEXT_WHITE);

  widget.addSpacer(2);

  const pinyinText = widget.addText(data.pinyin);
  pinyinText.font = Font.mediumSystemFont(family === "small" ? 13 : 15);
  pinyinText.textColor = new Color(CONFIG.ACCENT_GOLD);

  widget.addSpacer(4);

  // --- ENGLISH DEFINITION ---
  const englishText = widget.addText(data.english);
  englishText.font = Font.systemFont(family === "small" ? 11 : 12);
  englishText.textColor = new Color(CONFIG.TEXT_MUTED);
  englishText.lineLimit = family === "small" ? 2 : 3;

  // --- EXAMPLE SENTENCES (Medium & Large) ---
  if (family !== "small" && data.example_cn) {
    widget.addSpacer(8);

    const divider = widget.addStack();
    divider.backgroundColor = new Color("#FFFFFF", 0.12);
    divider.size = new Size(0, 1);

    widget.addSpacer(8);

    const exCn = widget.addText(data.example_cn);
    exCn.font = Font.systemFont(family === "large" ? 14 : 12);
    exCn.textColor = new Color(CONFIG.TEXT_WHITE, 0.9);
    exCn.lineLimit = 2;

    if (family === "large" && data.example_pinyin) {
      widget.addSpacer(2);
      const exPy = widget.addText(data.example_pinyin);
      exPy.font = Font.italicSystemFont(11);
      exPy.textColor = new Color(CONFIG.ACCENT_GOLD, 0.85);
    }

    widget.addSpacer(2);

    const exEn = widget.addText(data.example_en);
    exEn.font = Font.systemFont(family === "large" ? 12 : 11);
    exEn.textColor = new Color(CONFIG.TEXT_DIM);
    exEn.lineLimit = 2;
  }

  widget.addSpacer();
}

/**
 * Main widget builder
 */
async function createWidget(data) {
  const widget = new ListWidget();
  const family = config.widgetFamily || "medium";

  // Tap to open on N1Mandarin
  const query = encodeURIComponent(data.hanzi);
  widget.url = `https://chanale-lab.github.io/N1Mandarin/#/words?q=${query}`;

  // Detect widget placement
  if (family === "accessoryRectangular") {
    buildLockScreenRectangular(widget, data);
  } else if (family === "accessoryCircular") {
    buildLockScreenCircular(widget, data);
  } else if (family === "accessoryInline") {
    buildLockScreenInline(widget, data);
  } else {
    buildHomeScreenWidget(widget, data, family);
  }

  // Next refresh at midnight
  const nextRefresh = new Date();
  nextRefresh.setDate(nextRefresh.getDate() + 1);
  nextRefresh.setHours(0, 2, 0, 0);
  widget.refreshAfterDate = nextRefresh;

  return widget;
}

// Execution
const data = await getWordData();
const widget = await createWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  // In Scriptable preview mode:
  // Toggle between previewing as Lock Screen or Home Screen:
  await widget.presentAccessoryRectangular();
}
Script.complete();
