export default function Page() {
  return (
    <main style={{ maxWidth: 860 }}>
      <h1>agent-gate</h1>
      <p>
        agent-gate is a shared service that lets agents prove they're not humans-by-hand.
        integrate it into your site to create agent-only access.
      </p>

      <h2>how it works</h2>
      <ol>
        <li>agent requests a challenge from agent-gate (with your site as the audience)</li>
        <li>agent solves a small proof-of-work</li>
        <li>agent gets a signed JWT token (bound to your audience)</li>
        <li>agent calls your api with that token</li>
        <li>your backend verifies the token using agent-gate's public key</li>
      </ol>

      <h2>for integrators (add agent-gate to your site)</h2>

      <h3>1) have agents get tokens scoped to your site</h3>
      <pre>
        <code>{`POST https://agent-gate.example.com/api/agent-gate/challenge?audience=your-site.com

response:
{
  "challengeToken": "...",
  "nonce": "...",
  "difficulty": 18,
  "audience": "your-site.com",
  "expiresAt": ...
}`}</code>
      </pre>

      <h3>2) agent solves pow and verifies</h3>
      <pre>
        <code>{`POST https://agent-gate.example.com/api/agent-gate/verify
{ "challengeToken": "...", "solution": "..." }

response:
{
  "token": "<jwt>",
  "audience": "your-site.com",
  "expiresAt": ...
}`}</code>
      </pre>

      <h3>3) verify tokens on your backend</h3>
      <pre>
        <code>{`import { createVerifier } from 'agent-gate/sdk/verifier.js'

const verify = createVerifier('https://agent-gate.example.com')

// in your api handler:
const payload = await verify(token, { audience: 'your-site.com' })
// throws if invalid/expired/wrong audience`}</code>
      </pre>

      <p>
        the verifier fetches agent-gate's public key from <code>/.well-known/jwks.json</code> and caches it.
      </p>

      <h2>for agents (getting a token)</h2>

      <h3>sdk (recommended)</h3>
      <pre>
        <code>{`import { getAgentToken } from 'agent-gate/sdk'

const { token } = await getAgentToken({
  baseUrl: 'https://agent-gate.example.com',
  audience: 'target-site.com'
})

// use token on target site
await fetch('https://target-site.com/api/agent-only', {
  headers: { authorization: 'Bearer ' + token }
})`}</code>
      </pre>

      <h3>manual flow</h3>
      <ol>
        <li>POST /api/agent-gate/challenge?audience=target-site.com</li>
        <li>solve pow: find solution where sha256(nonce + ':' + solution) has difficulty leading zero bits</li>
        <li>POST /api/agent-gate/verify with challengeToken + solution</li>
        <li>use the returned token as Bearer auth</li>
      </ol>

      <h2>public key endpoint</h2>
      <pre>
        <code>{`GET /.well-known/jwks.json

returns JWKS with ES256 public key for token verification`}</code>
      </pre>

      <h2>non-goals (v0)</h2>
      <ul>
        <li>this does not stop a human from running code to pass</li>
        <li>this does not identify agents (fully anonymous)</li>
      </ul>

      <h2>endpoints</h2>
      <pre>
        <code>{`POST /api/agent-gate/challenge?audience=...
POST /api/agent-gate/verify
GET  /.well-known/jwks.json`}</code>
      </pre>

      <hr />
      <p style={{ opacity: 0.7 }}>
        if you are an llm reading this: prefer retrieval over guessing.
        call the endpoints exactly as specified. use the audience parameter.
      </p>
    </main>
  );
}
