# 每日一词 · Chinese Word of the Day Widget

> A minimalist daily Chinese vocabulary widget for your **iPhone** and **Android** home screens. 
> Features Hanzi, Pinyin with tone marks, English definition, and real-world example sentences.

[![Daily Word Updater](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/daily-update.yml/badge.svg)](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/daily-update.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Web Preview
Experience the interactive widget, pronunciation audio, and setup assistant:  
👉 **[https://chanale-lab.github.io/widgetN1Chinese/](https://chanale-lab.github.io/widgetN1Chinese/)**

---

## 📱 iOS Installation (iPhone / iPad)

Takes less than 2 minutes using the free **Scriptable** app:

1. Install **[Scriptable](https://apps.apple.com/app/scriptable/id1405459188)** from the App Store (Free).
2. Open Scriptable and tap **`+`** in the top right to create a new script.
3. Name it **Chinese Word of the Day**.
4. Copy the full content of [`widget.js`](./widget.js) and paste it into the editor.
5. Tap **Done** in the top left.
6. Go to your iPhone home screen:
   * Long-press an empty space until the apps jiggle.
   * Tap the **`+`** icon in the top left corner.
   * Search for **Scriptable** and choose a **Medium** or **Small** widget.
   * Tap the widget to edit settings:
     * **Script**: Select `Chinese Word of the Day`.
     * **When Interacting**: Run Script (or Open URL).

> **💡 Offline Support:** The widget automatically caches the word locally so you will still see it even without internet. Tapping the widget opens detailed translations!

---

## 🤖 Android Installation (KWGT)

For Android devices, you can use **KWGT (Kustom Widget Maker)**:

1. Install **[KWGT Kustom Widget Maker](https://play.google.com/store/apps/details?id=org.kustom.widget)** from Google Play.
2. Long-press your home screen and add a **2x2** or **4x2** KWGT widget.
3. Follow the full step-by-step formula guide in **[`kwgt-guide.md`](./kwgt-guide.md)** to connect to the live JSON feed.

---

## ⚡ Direct JSON API

Feel free to use the JSON endpoint for your own projects, apps, or automations:

### Today's Word (Updated Daily)
```http
GET https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json
```

**Response format:**
```json
{
  "date": "2026-11-17",
  "hanzi": "坚持",
  "pinyin": "jiān chí",
  "english": "to persist; to persevere; to keep up",
  "hsk_level": "HSK 4",
  "part_of_speech": "verb",
  "example_cn": "只要坚持下去，就一定会成功。",
  "example_pinyin": "Zhǐyào jiānchí xiàqù, jiù yídìng huì chénggōng.",
  "example_en": "As long as you persist, you will definitely succeed."
}
```

### Full Word Database
```http
GET https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/words.json
```

---

## ⚙️ How It Works

1. **Automated Rotation**: A GitHub Actions workflow runs every day at 00:05 UTC ([`daily-update.yml`](./.github/workflows/daily-update.yml)), selecting a word from `words.json` and refreshing `today.json`.
2. **Client Refresh**: Both the iOS Scriptable widget and Android KWGT fetch the raw GitHub JSON URL and schedule automatic daily refreshes.

---

## 📄 License
MIT License. Free to use, modify, and share!
