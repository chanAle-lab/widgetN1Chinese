// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: book;

/**
 * Chinese Word of the Day (每日一词) - iOS Widget for Scriptable
 * Repository: https://github.com/chanAle-lab/widgetN1Chinese
 * 
 * Features:
 * - Displays daily Hanzi, Pinyin with tone marks, English definition, and example sentence.
 * - Supports Small, Medium, and Large iOS home screen widgets.
 * - Automatic dynamic daily rotation (synchronizes automatically by day of year).
 * - Offline cache support: Works even without internet.
 * - Tap to inspect: Tapping the widget opens detailed translation/dictionary.
 */

const CONFIG = {
  // Remote URLs
  ALL_WORDS_URL: "https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/words.json",
  TODAY_URL: "https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json",
  
  // Theme colors
  BG_START: "#7A1C1C",     // Deep Imperial Crimson
  BG_END: "#141416",       // Deep Slate/Charcoal
  ACCENT_GOLD: "#E5C07B",  // Classical Gold
  TEXT_WHITE: "#FDFDFD",   // Clean White
  TEXT_MUTED: "#CCCCCC",   // Soft Grey
  TEXT_DIM: "#8E8E93",     // Subtle Grey
  
  // Cache key
  CACHE_KEY: "chinese_wotd_cache"
};

// Built-in offline fallback in case of no network on first launch
const OFFLINE_FALLBACK = {
  date: new Date().toISOString().slice(0, 10),
  hanzi: "坚持",
  pinyin: "jiān chí",
  english: "to persist; to persevere; to keep up",
  hsk_level: "HSK 4",
  example_cn: "只要坚持下去，就一定会成功。",
  example_pinyin: "Zhǐyào jiānchí xiàqù, jiù yídìng huì chénggōng.",
  example_en: "As long as you persist, you will definitely succeed."
};

/**
 * Fetch word data:
 * 1. Calculate day of year (1..365)
 * 2. Fetch words.json to pick the exact word for today (automatically updates every day!)
 * 3. Fallback to today.json
 * 4. Fallback to local cache
 * 5. Fallback to built-in default
 */
async function getWordData() {
  const fm = FileManager.local();
  const cachePath = fm.joinPath(fm.documentsDirectory(), CONFIG.CACHE_KEY + ".json");

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // 1. Fetch full words list and select based on day of year
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

  // 4. Default fallback
  return OFFLINE_FALLBACK;
}

/**
 * Build the widget UI
 */
async function createWidget(data) {
  const widget = new ListWidget();
  const family = config.widgetFamily || "medium";

  // Gradient background
  const gradient = new LinearGradient();
  gradient.locations = [0.0, 1.0];
  gradient.colors = [new Color(CONFIG.BG_START), new Color(CONFIG.BG_END)];
  widget.backgroundGradient = gradient;

  // Tap action: Open translation / dictionary
  const query = encodeURIComponent(data.hanzi);
  widget.url = `https://translate.google.com/?sl=zh-CN&tl=en&text=${query}&op=translate`;

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

  // --- EXAMPLE SENTENCES (Medium & Large widgets) ---
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

  // Schedule next refresh at next midnight
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
  // When run inside the Scriptable editor app, show interactive preview
  await widget.presentMedium();
}
Script.complete();
