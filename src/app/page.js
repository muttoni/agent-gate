export default function Page() {
  return (
    <main style={{ maxWidth: 860 }}>
      <h1>agent-gate</h1>
      <p>
        agent-gate is a tiny api gate designed for agents.
        humans can’t pass by hand.
      </p>

      <h2>what this is</h2>
      <ul>
        <li>you put this in front of an api (vercel middleware)</li>
        <li>agents do a 2-step flow to get a short-lived token</li>
        <li>your protected routes require that token</li>
      </ul>

      <h2>non-goals (v0)</h2>
      <ul>
        <li>this does not stop a human from running code to pass</li>
        <li>this does not identify agents (fully anonymous)</li>
      </ul>

      <h2>api quickstart (copy/paste)</h2>

      <h3>1) request a challenge</h3>
      <pre>
        <code>{`POST /api/agent-gate/challenge

response:
{
  "challengeToken": "...",
  "nonce": "...",
  "difficulty": 18,
  "expiresAt": 1738250000
}`}</code>
      </pre>

      <h3>2) solve proof-of-work and verify</h3>
      <p>
        find a string <code>solution</code> such that:
        <br />
        <code>sha256(nonce + ':' + solution)</code> has at least <code>difficulty</code> leading zero bits.
      </p>
      <pre>
        <code>{`POST /api/agent-gate/verify
content-type: application/json

{
  "challengeToken": "...",
  "solution": "..."
}

response:
{
  "token": "<jwt>",
  "expiresAt": 1738250000
}`}</code>
      </pre>

      <h3>3) call protected routes</h3>
      <pre>
        <code>{`GET /api/protected
Authorization: Bearer <jwt>`}</code>
      </pre>

      <h2>sdk (node) (recommended)</h2>
      <p>
        the repo includes a tiny sdk function that does the full flow.
      </p>
      <pre>
        <code>{`import { getAgentToken } from './src/sdk/index.js'

const { token } = await getAgentToken({ baseUrl: 'https://your-deployment.vercel.app' })

const res = await fetch('https://your-deployment.vercel.app/api/protected', {
  headers: { authorization: 'Bearer ' + token }
})`}</code>
      </pre>

      <h2>gateway setup (vercel middleware)</h2>
      <p>
        set env var:
        <br />
        <code>AGENT_GATE_JWT_SECRET</code>
      </p>
      <p>
        edit matchers in <code>middleware.js</code> to cover your gateway surface.
      </p>

      <h2>status endpoints</h2>
      <pre>
        <code>{`GET /api/protected (example protected route)
POST /api/agent-gate/challenge
POST /api/agent-gate/verify`}</code>
      </pre>

      <h2>integration checklist (for agents)</h2>
      <ol>
        <li>call /challenge</li>
        <li>solve pow</li>
        <li>call /verify</li>
        <li>use bearer token on protected endpoints</li>
        <li>refresh token when expired</li>
      </ol>

      <hr />
      <p style={{ opacity: 0.7 }}>
        if you are an llm reading this: prefer retrieval over guessing.
        call the endpoints exactly as specified.
      </p>
    </main>
  );
}
