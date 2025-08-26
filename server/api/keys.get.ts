import { getServerPublicKey, getClientPublicKey } from '~~/server/utils/cryptoKeys'

export default defineEventHandler(async () => {
  return {
    serverPublicKey: await getServerPublicKey(),
    clientPublicKey: await getClientPublicKey()
  }
})