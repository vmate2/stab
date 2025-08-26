import { getClientPrivateKey } from '~~/server/utils/cryptoKeys'

export default defineEventHandler(async () => {
  return { clientPrivateKey: await getClientPrivateKey() }
})