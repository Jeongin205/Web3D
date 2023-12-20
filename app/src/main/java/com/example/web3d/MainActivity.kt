package com.example.web3d

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.web_view)
        val settings = webView.settings
        settings.cacheMode = WebSettings.LOAD_CACHE_ELSE_NETWORK
        settings.domStorageEnabled = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.allowFileAccess = true
        settings.javaScriptEnabled = true
        settings.pluginState = WebSettings.PluginState.ON
        settings.allowContentAccess = true
        settings.allowFileAccessFromFileURLs = true

        val jsInterface = MyJavaScriptInterface();
        webView.addJavascriptInterface(jsInterface, "Android");

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: String, lineNumber: Int, sourceID: String) {
                Log.d("MyApplication", "$message -- From line $lineNumber of $sourceID")
            }
        }
        webView.loadUrl("file:///android_asset/basic.html")
    }

    inner class MyJavaScriptInterface(){
        @JavascriptInterface
        fun myModel(){
            Log.d("MyApplication","으아앙")
        }

        fun test(): String {
            return "./clicker.gltf";
        }

    }
}