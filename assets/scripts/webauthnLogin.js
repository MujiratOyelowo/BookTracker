// webauthnLogin.js
async function authenticate() {
    // 1. Fetch authentication options from your server endpoint
    const response = await fetch('/webauthn/authenticate-options', { method: 'POST' });
    const options = await response.json();
  
    // 2. Convert the challenge and allowed credential IDs from base64 to Uint8Array
    options.challenge = Uint8Array.from(window.atob(options.challenge), c => c.charCodeAt(0));
    if (options.allowCredentials) {
      options.allowCredentials = options.allowCredentials.map(cred => ({
        ...cred,
        id: Uint8Array.from(window.atob(cred.id), c => c.charCodeAt(0))
      }));
    }
  
    // 3. Request an assertion from the browser
    const assertion = await navigator.credentials.get({ publicKey: options });
  
    // 4. Convert the ArrayBuffer properties of the assertion to base64 strings
    const assertionResponse = {
      id: assertion.id,
      rawId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))),
      response: {
        authenticatorData: btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))),
        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON))),
        signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
        userHandle: assertion.response.userHandle ? btoa(String.fromCharCode(...new Uint8Array(assertion.response.userHandle))) : null
      },
      type: assertion.type,
    };
  
    // 5. Send the assertion response to your server for verification
    const verifyResponse = await fetch('/webauthn/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assertionResponse)
    });
    
    if (verifyResponse.ok) {
      alert("Biometric authentication successful!");
      // Redirect to the main app page upon successful authentication
      window.location.href = "main.html";
    } else {
      alert("Biometric authentication failed.");
    }
  }
  
  document.getElementById("loginBiometricsBtn").addEventListener("click", authenticate);
  