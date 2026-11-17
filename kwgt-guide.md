# Android KWGT Setup Guide (Chinese Word of the Day)

This guide shows how to set up the **Chinese Word of the Day** widget on any Android phone using **KWGT (Kustom Widget Maker)**.

---

## 🚀 Quick Setup (3 Minutes)

### Step 1: Install KWGT
1. Open Google Play Store and install **[KWGT Kustom Widget Maker](https://play.google.com/store/apps/details?id=org.kustom.widget)** (Free).

### Step 2: Add a Widget to Your Home Screen
1. Long-press an empty space on your Android home screen.
2. Select **Widgets** > Scroll down to **KWGT** > Choose a **2x2** (Small) or **4x2** (Medium) widget.
3. Tap on the blank widget container to open the KWGT editor.

### Step 3: Configure the Widget
In KWGT, tap **Create / Blank Canvas**:

1. **Background Shape:**
   - Tap `+` (top right) > **Shape** > Select `Rectangle`.
   - Set Width and Height to match the container.
   - Go to `Paint` > Color: `#1E1E24` (or deep crimson `#5E1111`).
   - Corner Radius: `24` for modern rounded corners.

2. **Add Header Text ("每日一词 · HSK"):**
   - Tap `+` > **Text**.
   - Tap `Text formula` and enter:
     ```text
     每日一词  •  $wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .hsk_level)$
     ```
   - Color: `#E5C07B` (Gold), Size: `12`, Style: `Bold`.

3. **Add Hanzi (Chinese Characters):**
   - Tap `+` > **Text**.
   - Formula:
     ```text
     $wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .hanzi)$
     ```
   - Color: `#FFFFFF` (White), Size: `38`, Style: `Bold`.

4. **Add Pinyin:**
   - Tap `+` > **Text**.
   - Formula:
     ```text
     $wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .pinyin)$
     ```
   - Color: `#E5C07B` (Gold), Size: `16`.

5. **Add English Meaning:**
   - Tap `+` > **Text**.
   - Formula:
     ```text
     $wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .english)$
     ```
   - Color: `#CCCCCC`, Size: `13`.

6. **Add Example Sentence (Optional for 4x2 widgets):**
   - Chinese sentence:
     ```text
     $wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .example_cn)$
     ```
   - English translation:
     ```text
     $wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .example_en)$
     ```

7. **Tap Action (Opens Dictionary/Translation):**
   - Select the root container or background shape.
   - Go to **Touch** tab > Tap `+` > Action: `Open Link`.
   - URL:
     ```text
     https://translate.google.com/?sl=zh-CN&tl=en&text=$tc(url, wg("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json", json, .hanzi))$&op=translate
     ```

### Step 4: Save
Tap the **Save (floppy disk icon)** in the top right. Go back to your home screen!

---

## 🔄 Refresh Rate in KWGT
To ensure KWGT checks for daily updates:
1. Open KWGT Settings (`☰` menu > `Settings`).
2. Go to **Widget Refresh**.
3. Set update mode to **Default** or **Fast** (fetches automatically whenever connected to network).
