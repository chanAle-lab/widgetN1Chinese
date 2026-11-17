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
            val views = RemoteViews(context.packageName, R.layout.widget_chinese)

            // Default fallback
            var hanzi = "坚持"
            var pinyin = "jiān chí"
            var english = "to persist; to persevere; to keep up"
            var hsk = "HSK 4"
            var exampleCn = "只要坚持下去，就一定会成功。"
            var exampleEn = "As long as you persist, you will definitely succeed."

            // Tap action: Open translation / dictionary
            val initialUri = Uri.parse("https://translate.google.com/?sl=zh-CN&tl=en&text=$hanzi&op=translate")
            val intent = Intent(Intent.ACTION_VIEW, initialUri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)

            // Asynchronously fetch current today.json
            val client = OkHttpClient()
            val request = Request.Builder().url(TODAY_URL).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    // Retain offline values
                }

                override fun onResponse(call: Call, response: Response) {
                    response.body?.string()?.let { jsonStr ->
                        try {
                            val jsonObject = Gson().fromJson(jsonStr, JsonObject::class.java)
                            if (jsonObject.has("hanzi")) {
                                hanzi = jsonObject.get("hanzi").asString
                                pinyin = jsonObject.get("pinyin").asString
                                english = jsonObject.get("english").asString
                                if (jsonObject.has("hsk_level")) hsk = jsonObject.get("hsk_level").asString
                                if (jsonObject.has("example_cn")) exampleCn = jsonObject.get("example_cn").asString
                                if (jsonObject.has("example_en")) exampleEn = jsonObject.get("example_en").asString

                                views.setTextViewText(R.id.tv_hanzi, hanzi)
                                views.setTextViewText(R.id.tv_pinyin, pinyin)
                                views.setTextViewText(R.id.tv_english, english)
                                views.setTextViewText(R.id.tv_hsk, hsk)
                                views.setTextViewText(R.id.tv_example_cn, exampleCn)
                                views.setTextViewText(R.id.tv_example_en, exampleEn)

                                val updatedUri = Uri.parse("https://translate.google.com/?sl=zh-CN&tl=en&text=$hanzi&op=translate")
                                val tapIntent = Intent(Intent.ACTION_VIEW, updatedUri).apply {
                                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                                }
                                val tapPending = PendingIntent.getActivity(
                                    context, 0, tapIntent,
                                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                                )
                                views.setOnClickPendingIntent(R.id.widget_root, tapPending)

                                appWidgetManager.updateAppWidget(appWidgetId, views)
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                }
            })
        }
    }
}
