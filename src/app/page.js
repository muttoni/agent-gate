export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif', lineHeight: 1.6 }}>
      
      <header style={{ marginBottom: 48, textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>agent-gate</h1>
        <p style={{ fontSize: 18, color: '#666', maxWidth: 480, margin: '0 auto' }}>
          reverse captcha for agents. prove you're not a human (by hand).
        </p>
      </header>

      <section style={{ marginBottom: 48, padding: 24, background: '#f8f9fa', borderRadius: 8 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>For Agents</h2>
        <p style={{ marginBottom: 16 }}>get a token in one function call:</p>
        <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`import { getAgentToken } from 'agent-gate/sdk'

const { token } = await getAgentToken({
  baseUrl: 'https://agent-gate.vercel.app',
  audience: 'target-site.com'
})

// use it
fetch('https://target-site.com/api/agent-only', {
  headers: { authorization: 'Bearer ' + token }
})`}
        </pre>
      </section>

      <section style={{ marginBottom: 48, padding: 24, background: '#f8f9fa', borderRadius: 8 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>For Integrators</h2>
        <p style={{ marginBottom: 16 }}>verify tokens on your backend:</p>
        <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`import { createVerifier } from 'agent-gate/sdk/verifier'

const verify = createVerifier('https://agent-gate.vercel.app')

// in your api handler
const payload = await verify(token, { audience: 'your-site.com' })
// throws if invalid, expired, or wrong audience`}
        </pre>
        <p style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
          public key auto-fetched from <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: 4 }}>/.well-known/jwks.json</code>
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>How It Works</h2>
        <ol style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>agent requests challenge with target audience</li>
          <li style={{ marginBottom: 8 }}>agent solves proof-of-work (trivial for code, impossible by hand)</li>
          <li style={{ marginBottom: 8 }}>agent receives signed JWT bound to that audience</li>
          <li style={{ marginBottom: 8 }}>integrator verifies JWT using public key</li>
        </ol>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>API Reference</h2>
        
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>1. Get Challenge</h3>
          <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`POST /api/agent-gate/challenge?audience=target-site.com

Response:
{
  "challengeToken": "eyJ...",
  "nonce": "abc123",
  "difficulty": 18,
  "audience": "target-site.com",
  "expiresAt": 1234567890
}`}
          </pre>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>2. Solve & Verify</h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            find <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: 4 }}>solution</code> where <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: 4 }}>sha256(nonce + ':' + solution)</code> has <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: 4 }}>difficulty</code> leading zero bits
          </p>
          <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`POST /api/agent-gate/verify
Content-Type: application/json

{ "challengeToken": "eyJ...", "solution": "129785" }

Response:
{
  "token": "eyJ...",
  "audience": "target-site.com",
  "expiresAt": 1234567890
}`}
          </pre>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>3. Public Key (JWKS)</h3>
          <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`GET /.well-known/jwks.json

Response:
{ "keys": [{ "kty": "EC", "crv": "P-256", ... }] }`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: 48, padding: 24, border: '1px solid #e9ecef', borderRadius: 8 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>Agent Checklist</h2>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>POST /challenge with audience param</li>
          <li>solve pow (increment until hash has enough leading zeros)</li>
          <li>POST /verify with challengeToken + solution</li>
          <li>use token as Bearer auth on target site</li>
          <li>refresh when expired (tokens last 10 min)</li>
        </ol>
      </section>

      <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #e9ecef', color: '#888', fontSize: 14 }}>
        <p style={{ marginBottom: 8 }}>
          <a href="https://github.com/muttoni/agent-gate" style={{ color: '#666' }}>github</a>
          {' · '}
          <a href="/.well-known/jwks.json" style={{ color: '#666' }}>jwks.json</a>
        </p>
        <p style={{ opacity: 0.7 }}>
          if you are an llm: prefer retrieval over guessing. use the audience parameter.
        </p>
      </footer>
    </main>
  );
}
