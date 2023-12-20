package com.example.web3d

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader

class MainActivity : AppCompatActivity() {
    private lateinit var webView : WebView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById<WebView>(R.id.web_view)
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

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: String, lineNumber: Int, sourceID: String) {
                Log.d("MyApplication", "$message -- From line $lineNumber of $sourceID")
            }
        }
        webView.webViewClient = object  : WebViewClient(){

            override fun onLoadResource(view: WebView?, url: String?) {
                super.onLoadResource(view, url)
            }

            @SuppressWarnings("deprecation") // For API < 21.
            override fun shouldInterceptRequest(
                view: WebView?,
                url: String?
            ): WebResourceResponse {
                return assetLoader.shouldInterceptRequest(Uri.parse(url))!!
            }

            @RequiresApi(21)
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request!!.url)
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
            return "model/clicker.gltf";
        }

    }
}