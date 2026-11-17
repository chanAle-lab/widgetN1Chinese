package com.chanale.chinesewidget

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import com.google.gson.JsonObject
import okhttp3.*
import java.io.IOException
import java.util.Locale

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var currentHanzi = "坚持"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tts = TextToSpeech(this, this)

        val btnSpeak = findViewById<Button>(R.id.btn_speak)
        btnSpeak.setOnClickListener {
            tts?.speak(currentHanzi, TextToSpeech.QUEUE_FLUSH, null, "HanziAudio")
        }

        loadTodayData()
    }

    private fun loadTodayData() {
        val client = OkHttpClient()
        val request = Request.Builder()
            .url("https://raw.githubusercontent.com/chanAle-lab/widgetN1Chinese/main/today.json")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}

            override fun onResponse(call: Call, response: Response) {
                response.body?.string()?.let { jsonStr ->
                    try {
                        val data = Gson().fromJson(jsonStr, JsonObject::class.java)
                        if (data.has("hanzi")) {
                            runOnUiThread {
                                currentHanzi = data.get("hanzi").asString
                                findViewById<TextView>(R.id.tv_hanzi).text = currentHanzi
                                findViewById<TextView>(R.id.tv_pinyin).text = data.get("pinyin").asString
                                findViewById<TextView>(R.id.tv_english).text = data.get("english").asString
                                if (data.has("hsk_level")) {
                                    findViewById<TextView>(R.id.tv_hsk).text = data.get("hsk_level").asString
                                }
                                if (data.has("example_cn")) {
                                    findViewById<TextView>(R.id.tv_example_cn).text = data.get("example_cn").asString
                                }
                                if (data.has("example_en")) {
                                    findViewById<TextView>(R.id.tv_example_en).text = data.get("example_en").asString
                                }
                            }
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        })
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.CHINESE
        }
    }

    override fun onDestroy() {
        tts?.stop()
        tts?.shutdown()
        super.onDestroy()
    }
}
