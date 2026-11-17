# 每日一词 · Chinese Word of the Day Widget

> A minimalist daily Chinese vocabulary widget for your **iPhone** and **Android** home screens. 
> Features Hanzi, Pinyin with tone marks, English definition, and real-world example sentences.

[![Build Android APK](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/build-apk.yml/badge.svg)](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/build-apk.yml)
[![Daily Word Updater](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/daily-update.yml/badge.svg)](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/daily-update.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📲 Direct Downloads & Live Preview

* 🤖 **[Download Android APK (Direct)](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/build-apk.yml)** — Download the latest installable `.apk` from the latest Actions build!
* 📱 **[iOS Scriptable Code](./widget.js)** — 1-click script for iPhone/iPad users.
* 🌐 **[Live Web Companion & Audio](https://chanale-lab.github.io/widgetN1Chinese/)** — Interactive pronunciation & widget simulator.

---

## 🤖 Android Installation (.APK)

1. Go to the **[Build Android APK Actions](https://github.com/chanAle-lab/widgetN1Chinese/actions/workflows/build-apk.yml)** page.
2. Click on the latest green run with a checkmark (e.g. Run #7).
3. Scroll down to **Artifacts** and click **ChineseWordOfTheDay-APK** to download the zip file.
4. Unzip and tap the `.apk` on your Android phone to install.
5. On your Android home screen:
   * Long-press an empty space &rarr; Tap **Widgets**.
   * Find **每日一词 (Chinese WOTD)** and drag it onto your home screen!
   * *Tip: Open the app to preview the word and listen to pronunciation with the `🔊 Pronounce` button.*

*(Alternative for KWGT users: You can also use **[`kwgt-guide.md`](./kwgt-guide.md)**).*

---

## 📱 iOS Installation (iPhone / iPad)

Takes less than 2 minutes using the free **Scriptable** app:

1. Install **[Scriptable](https://apps.apple.com/app/scriptable/id1405459188)** from the App Store (Free).
2. Open Scriptable and tap **`+`** in the top right to create a new script.
3. Name it **Chinese Word of the Day**.
4. Copy the full content of [`widget.js`](./widget.js) and paste it into the editor.
5. Tap **Done** in the top left.

### Adding to Home Screen
* Long-press your home screen &rarr; Tap **`+`** in the top left.
* Select **Scriptable** &rarr; Choose **Small**, **Medium**, or **Large**.
* Tap the widget to edit: Set **Script** to `Chinese Word of the Day`.

### Adding to Lock Screen (iOS 16+)
* Long-press your Lock Screen &rarr; Tap **Customize** &rarr; Select **Lock Screen**.
* Tap the widget area under the clock.
* Select **Scriptable** &rarr; Choose the **Rectangular** widget (or Circular/Inline).
* Tap the widget to edit: Set **Script** to `Chinese Word of the Day`.
* *The script automatically formats with an optimized side-by-side layout: bold Hanzi on the left, Pinyin + English definition on the right!*

> **💡 Offline Support:** The widget automatically caches the word locally so you will still see it even without internet. Tapping the widget opens detailed translations!

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

## 📄 License
MIT License. Free to use, modify, and share!
