let serverPublicKey: string | null = null
let clientPrivateKey: string | null = null

async function loadKeys() {
  if (!serverPublicKey || !clientPrivateKey) {
    const keyData = await $fetch<{ serverPublicKey: string, clientPublicKey: string }>('/api/keys')
    serverPublicKey = keyData.serverPublicKey
    // For demo only: fetch client private key
    const privData = await $fetch<{ clientPrivateKey: string }>('/api/clientPrivateKey')
    clientPrivateKey = privData.clientPrivateKey
  }
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN [A-Z ]+-----/g, '')
    .replace(/-----END [A-Z ]+-----/g, '')
    .replace(/[\r\n\s]/g, '')
  const binary = atob(b64)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i)
  return buffer.buffer
}

export async function encryptClient(data: string) {
  await loadKeys()
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(serverPublicKey!),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  )
  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, encoder.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

export async function decryptClient(base64Data: string) {
  await loadKeys()
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(clientPrivateKey!),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  )
  const encryptedBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
  const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, encryptedBytes)
  return new TextDecoder().decode(decrypted)
}
