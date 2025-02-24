// webauthnRegister.js
async function registerCredential() {
    // 1. Fetch registration options from your server endpoint
    const response = await fetch('/webauthn/register-options', { method: 'POST' });
    const options = await response.json();
  
    // 2. Convert the challenge and user id from base64 to Uint8Array
    options.challenge = Uint8Array.from(window.atob(options.challenge), c => c.charCodeAt(0));
    options.user.id = Uint8Array.from(window.atob(options.user.id), c => c.charCodeAt(0));
  
    // 3. Create a new credential using the WebAuthn API
    const credential = await navigator.credentials.create({ publicKey: options });
  
    // 4. Prepare the credential response to send to your server (convert ArrayBuffer to base64)
    const credentialResponse = {
      id: credential.id,
      rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
      response: {
        attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)))
      },
      type: credential.type
    };
  
    // 5. Send the credential response to your server for verification
    const verifyResponse = await fetch('/webauthn/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentialResponse)
    });
    
    if (verifyResponse.ok) {
      alert("Biometric registration successful!");
      // Optionally, redirect or update UI here
    } else {
      alert("Biometric registration failed.");
    }
  }
  
  document.getElementById("registerBiometricsBtn").addEventListener("click", registerCredential);
  