export default defineEventHandler(async (event) => {
  const body = await readBody<{ data: string }>(event)
  const decrypted = await decryptServer(body.data)
  console.log('Decrypted message:', decrypted)
  const encrypted = await encryptServer(decrypted + 'kys')
  return encrypted
})