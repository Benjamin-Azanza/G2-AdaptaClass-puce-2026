import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildGameHTML } from '../../game/gameHtmlBuilder';

export function GameWebView() {
    const htmlContent = buildGameHTML();

    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <iframe
                    srcDoc={htmlContent}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ html: htmlContent }}
                style={styles.webview}
                scrollEnabled={false}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
