# ngrok-proxy

A lightweight utility for spinning up a **local authenticated proxy server** that is publicly reachable via **Ngrok TCP
tunneling**. 

Useful for testing **local IP vs third-party proxy** behaviour, browser automation, or tunneling internal services
securely.

---

## Features

- Creates a local **HTTP proxy** secured with username & password
- Exposes it publicly through an **Ngrok TCP tunnel**
- Returns a fully-qualified proxy URL (`http://user:pass@host:port`)
- Provides a clean `close()` method to tear down both the proxy and tunnel
- Lightweight, depends only on `ngrok` and `proxy-chain`

---

## Installation

```bash
npm install ngrok proxy-chain dotenv
````

Make sure your **Ngrok auth token** is set in the environment:

```bash
export NGROK_AUTHTOKEN=your_token_here
```

You can obtain your token at [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).

---

## 📦 Usage

```ts
import { useLocalProxy } from "./service"

async function main() {
	const { url, close } = await useLocalProxy({
		port: 8000,
		region: "us",
		username: "foo",
		password: "bar",
		verbose: true
	})

	console.log(`Proxy available at: ${url}`)

	// Example: use with Playwright or Puppeteer
	// browser.launch({ proxy: { server: url } })

	// When finished
	await close()
}

main().catch(console.error)
```

---

## API

### `useLocalProxy(options: LocalProxyOptions): Promise<{ url: string; close: () => Promise<void> }>`

Starts a local authenticated proxy and Ngrok tunnel.

| Option     | Type          | Default               | Description                                                                 |
|------------|---------------|-----------------------|-----------------------------------------------------------------------------|
| `port`     | `number`      | `8000`                | Local port for the proxy server                                             |
| `region`   | `ProxyRegion` | *(required)*          | Ngrok region, one of `"us"`, `"eu"`, `"au"`, `"ap"`, `"sa"`, `"jp"`, `"in"` |
| `username` | `string`      | random UUID fragment  | Proxy auth username                                                         |
| `password` | `string`      | random UUID fragment  | Proxy auth password                                                         |
| `verbose`  | `boolean`     | `false`               | Enables proxy-chain verbose logging                                         |

### Returns

| Property | Type                  | Description                                                                             |
|----------|-----------------------|-----------------------------------------------------------------------------------------|
| `url`    | `string`              | The full HTTP proxy URL (e.g. `http://{random}:{random}@0.tcp.{region}.ngrok.io:12345`) |
| `close`  | `() => Promise<void>` | Shuts down the local proxy and disconnects the Ngrok tunnel                             |

---

## Example Output

```
Starting ngrok TCP tunnel on port 8000…
Starting proxy-chain server on port 8000…
Proxy server is running at http://{random}:{random}@0.tcp.{region}.ngrok.io:12345
```

---

## Error Types

| Error                | Description                                       |
|----------------------|---------------------------------------------------|
| `NgrokAuthError`     | Missing or invalid `NGROK_AUTHTOKEN`              |
| `InvalidOptionError` | Thrown when an invalid port or region is provided |

---

## Cleanup

Always call `await close()` when done.
If the process crashes, Ngrok may leave tunnels open, you can clean them manually with:

```bash
ngrok kill
```

 