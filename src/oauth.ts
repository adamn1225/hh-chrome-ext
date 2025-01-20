function loginWithGoogle(): void {
    chrome.identity.launchWebAuthFlow(
        {
            url: `https://accounts.google.com/o/oauth2/auth?client_id=358507295534-4eorpm3t6jlrmrs9hlj1fcaa4srh3mgb.apps.googleusercontent.com&response_type=token&redirect_uri=https://${chrome.runtime.id}.chromiumapp.org/&scope=openid email profile`,
            interactive: true
        },
        function (redirectUrl?: string) {
            if (chrome.runtime.lastError || (redirectUrl && redirectUrl.includes('error'))) {
                console.error('Error during OAuth flow:', chrome.runtime.lastError);
                return;
            }

            if (redirectUrl) {
                const urlParams = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
                const accessToken = urlParams.get('access_token');
                console.log('Access Token:', accessToken);

                // Use the access token to make authenticated requests
            }
        }
    );
}

export { loginWithGoogle };