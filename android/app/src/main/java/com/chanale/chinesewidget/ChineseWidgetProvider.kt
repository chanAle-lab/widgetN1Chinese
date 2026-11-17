package com.chanale.chinesewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.google.gson.Gson
import com.google.gson.JsonObject
import okhttp3.*
import java.io.IOException

class ChineseWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        private const val TODAY_URL =
            "https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json"

        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            // Build initial fallback view
            val views = createRemoteViews(
                context,
                hanzi = "坚持",
                pinyin = "jiān chí",
                english = "to persist; to persevere; to keep up",
                hsk = "HSK 4",
                exampleCn = "只要坚持下去，就一定会成功。",
                exampleEn = "As long as you persist, you will definitely succeed."
            )
            appWidgetManager.updateAppWidget(appWidgetId, views)

            // Asynchronously fetch current today.json
            val client = OkHttpClient()
            val request = Request.Builder().url(TODAY_URL).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    // Retain offline fallback
                }

                override fun onResponse(call: Call, response: Response) {
                    response.body?.string()?.let { jsonStr ->
                        try {
                            val jsonObject = Gson().fromJson(jsonStr, JsonObject::class.java)
                            if (jsonObject != null && jsonObject.has("hanzi")) {
                                val hanzi = jsonObject.get("hanzi").asString
                                val pinyin = jsonObject.get("pinyin").asString
                                val english = jsonObject.get("english").asString
                                val hsk = if (jsonObject.has("hsk_level")) jsonObject.get("hsk_level").asString else "HSK"
                                val exampleCn = if (jsonObject.has("example_cn")) jsonObject.get("example_cn").asString else ""
                                val exampleEn = if (jsonObject.has("example_en")) jsonObject.get("example_en").asString else ""

                                val updatedViews = createRemoteViews(
                                    context,
                                    hanzi = hanzi,
                                    pinyin = pinyin,
                                    english = english,
                                    hsk = hsk,
                                    exampleCn = exampleCn,
                                    exampleEn = exampleEn
                                )
                                appWidgetManager.updateAppWidget(appWidgetId, updatedViews)
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                }
            })
        }

        private fun createRemoteViews(
            context: Context,
            hanzi: String,
            pinyin: String,
            english: String,
            hsk: String,
            exampleCn: String,
            exampleEn: String
        ): RemoteViews {
            val views = RemoteViews(context.packageName, R.layout.widget_chinese)
            views.setTextViewText(R.id.tv_hanzi, hanzi)
            views.setTextViewText(R.id.tv_pinyin, pinyin)
            views.setTextViewText(R.id.tv_english, english)
            views.setTextViewText(R.id.tv_hsk, hsk)
            views.setTextViewText(R.id.tv_example_cn, exampleCn)
            views.setTextViewText(R.id.tv_example_en, exampleEn)

            val uri = Uri.parse("https://translate.google.com/?sl=zh-CN&tl=en&text=$hanzi&op=translate")
            val intent = Intent(Intent.ACTION_VIEW, uri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)
            return views
        }
    }
}
