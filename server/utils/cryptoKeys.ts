import { promises as fs } from 'fs'
import path from 'path'
import { generateKeyPairSync, publicEncrypt, privateDecrypt, constants } from 'crypto'

const keysDir = path.join(process.cwd(), 'server', 'keys')

// Server keys
const serverPubPath = path.join(keysDir, 'server_pub.pem')
const serverPrivPath = path.join(keysDir, 'server_priv.pem')

// Client keys (server stores copy so it can encrypt)
const clientPubPath = path.join(keysDir, 'client_pub.pem')
const clientPrivPath = path.join(keysDir, 'client_priv.pem')

let serverPublicKey: string
let serverPrivateKey: string
let clientPublicKey: string
let clientPrivateKey: string

async function loadOrGenerateKeys() {
  await fs.mkdir(keysDir, { recursive: true })

  // Helper to load or make a keypair
  async function ensureKeypair(pubPath: string, privPath: string) {
    const pubExists = await fs.stat(pubPath).catch(() => null)
    const privExists = await fs.stat(privPath).catch(() => null)
    if (!pubExists || !privExists) {
      const { publicKey: pub, privateKey: priv } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      })
      await fs.writeFile(pubPath, pub)
      await fs.writeFile(privPath, priv)
      return { pub, priv }
    } else {
      return {
        pub: await fs.readFile(pubPath, 'utf8'),
        priv: await fs.readFile(privPath, 'utf8')
      }
    }
  }

  ;({ pub: serverPublicKey, priv: serverPrivateKey } = await ensureKeypair(serverPubPath, serverPrivPath))
  ;({ pub: clientPublicKey, priv: clientPrivateKey } = await ensureKeypair(clientPubPath, clientPrivPath))
}

export async function getServerPublicKey() {
  if (!serverPublicKey) await loadOrGenerateKeys()
  return serverPublicKey
}

export async function getClientPublicKey() {
  if (!clientPublicKey) await loadOrGenerateKeys()
  return clientPublicKey
}

// Decrypt on server (from client)
export async function decryptServer(data: string) {
  if (!serverPrivateKey) await loadOrGenerateKeys()
  const buffer = Buffer.from(data, 'base64')
  const decrypted = privateDecrypt(
    { key: serverPrivateKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    buffer
  )
  return decrypted.toString('utf8')
}

// Encrypt on server (for client)
export async function encryptServer(data: string) {
  if (!clientPublicKey) await loadOrGenerateKeys()
  const buffer = Buffer.from(data, 'utf8')
  const encrypted = publicEncrypt(
    { key: clientPublicKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    buffer
  )
  return encrypted.toString('base64')
}

// Give private key to client for decryption (normally, you'd secure this!)
export async function getClientPrivateKey() {
  if (!clientPrivateKey) await loadOrGenerateKeys()
  return clientPrivateKey
}

export { loadOrGenerateKeys }
