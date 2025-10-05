import "dotenv/config"

import { randomUUID } from "node:crypto"

import { connect, disconnect } from "ngrok"
import { Server } from "proxy-chain"

import { InvalidOptionError, NgrokAuthError } from "./errors"
import type { LocalProxyOptions } from "./types"
import { REGIONS } from "./types"

/**
 * Start a local HTTP proxy that is reachable via an ngrok TCP tunnel.
 *
 * @remarks
 * Useful for A/B testing your local IP vs a third-party proxy.
 *
 * @example
 * const { url, close } = await useLocalProxy({ port: 8000, region: "au" })
 * // ...use `url` as your HTTP proxy...
 * await close()
 */
export async function useLocalProxy({
  port = 8000,
  region,
  username = randomString(),
  password = randomString(),
  verbose = false,
  logger = console
}: LocalProxyOptions): Promise<{ url: string; close: () => Promise<void> }> {
  validateOptions({ port, region })

  const { NGROK_AUTHTOKEN } = process.env
  if (!NGROK_AUTHTOKEN) {
    throw new NgrokAuthError("NGROK_AUTHTOKEN")
  }

  logger.debug(`Starting ngrok TCP tunnel on port :${port}`)
  const tcpUrl = await connect({
    proto: "tcp",
    addr: port,
    region
  })

  // ngrok returns e.g. "tcp://0.tcp.{region}.ngrok.io:12345"
  const host = tcpUrl.replace("tcp://", "")

  // Use a fully-qualified HTTP proxy URL (proxy-chain serves HTTP CONNECT)
  const url = `http://${username}:${password}@${host}`

  logger.debug(`Starting proxy-chain server on port ${port}`)
  const server = new Server({
    port,
    verbose,
    prepareRequestFunction(request) {
      const ok = request.username === username && request.password === password
      return ok
        ? { requestAuthentication: false }
        : { requestAuthentication: true, failMsg: `Invalid credentials` }
    }
  })

  // proxy-chain's listen uses a callback; wrap as a Promise for await-ability
  await new Promise((resolve) => server.listen(resolve))
  logger.info(`Proxy server is running at ${url}`)

  async function close(): Promise<void> {
    // Close proxy server first, then tear down ngrok
    await new Promise((resolve) => server.close(true, resolve))
    await disconnect(tcpUrl)
    logger.info(`Proxy server closed and ngrok tunnel disconnected`)
  }

  return { url, close }
}

function randomString(): string {
  return randomUUID().split(`-`)[0] ?? ``
}

function validateOptions({ port, region }: Pick<LocalProxyOptions, "port" | "region">): void {
  if (!port || !Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new InvalidOptionError(`"port" must be an integer between 1 and 65535`)
  }
  // Extra guard if options get cast loosely
  if (!REGIONS.includes(region)) {
    throw new InvalidOptionError(`"region" must be one of: ${REGIONS.join(`, `)}`)
  }
}
