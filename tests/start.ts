import "dotenv/config"

import { useLocalProxy } from "../src"

async function main() {
  console.log("Testing ngrok setup...")

  const { url, close } = await useLocalProxy({ region: "us" })
  console.log(`Proxy server URL: ${url}`)

  await close()
  console.log(`Proxy server closed`)

  console.log("Done")
  process.exit(0)
}

main().catch(console.error)
