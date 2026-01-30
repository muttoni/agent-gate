export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif', lineHeight: 1.6 }}>
      
      <header style={{ marginBottom: 48, textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>agent-gate</h1>
        <p style={{ fontSize: 18, color: '#666', maxWidth: 480, margin: '0 auto' }}>
          reverse captcha. prove you're not a human (by hand).
        </p>
        <p style={{ fontSize: 14, color: '#888', marginTop: 12 }}>
          clone → deploy → protect your api
        </p>
      </header>

      <section style={{ marginBottom: 48, padding: 24, background: '#f8f9fa', borderRadius: 8 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>Deploy Your Own</h2>
        <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`# 1. clone
git clone https://github.com/muttoni/agent-gate
cd agent-gate

# 2. set secret
echo "AGENT_GATE_SECRET=your-random-secret-here" > .env.local

# 3. deploy
vercel deploy`}
        </pre>
      </section>

      <section style={{ marginBottom: 48, padding: 24, background: '#f8f9fa', borderRadius: 8 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>For Agents</h2>
        <p style={{ marginBottom: 16 }}>get a token:</p>
        <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`import { getAgentToken } from './sdk'

const { token } = await getAgentToken({
  baseUrl: 'https://your-agent-gate.vercel.app'
})

// call protected endpoints
fetch('/api/protected/resource', {
  headers: { authorization: 'Bearer ' + token }
})`}
        </pre>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>How It Works</h2>
        <ol style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>agent requests a challenge</li>
          <li style={{ marginBottom: 8 }}>agent solves proof-of-work (~1-3 sec for code, impossible by hand)</li>
          <li style={{ marginBottom: 8 }}>agent receives signed JWT (valid 10 min)</li>
          <li style={{ marginBottom: 8 }}>middleware verifies token on protected routes</li>
        </ol>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>API</h2>
        
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>1. Get Challenge</h3>
          <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`POST /api/agent-gate/challenge

→ { challengeToken, nonce, difficulty, expiresAt }`}
          </pre>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>2. Solve & Verify</h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            find <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: 4 }}>solution</code> where 
            sha256(nonce:solution) has {`{difficulty}`} leading zero bits
          </p>
          <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`POST /api/agent-gate/verify
{ "challengeToken": "...", "solution": "..." }

→ { token, expiresAt }`}
          </pre>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>3. Use Token</h3>
          <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`GET /api/protected/*
Authorization: Bearer <token>`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: 48, padding: 24, border: '1px solid #e9ecef', borderRadius: 8 }}>
        <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>Protect Your Routes</h2>
        <p style={{ marginBottom: 16 }}>edit <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: 4 }}>middleware.js</code> to set which routes require agent tokens:</p>
        <pre style={{ background: '#1a1a1a', color: '#fff', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 14 }}>
{`export const config = {
  matcher: ['/api/protected/:path*']
}`}
        </pre>
      </section>

      <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #e9ecef', color: '#888', fontSize: 14 }}>
        <p style={{ marginBottom: 8 }}>
          <a href="https://github.com/muttoni/agent-gate" style={{ color: '#666' }}>github</a>
        </p>
        <p style={{ opacity: 0.7 }}>
          stateless · one env var · clone and deploy
        </p>
      </footer>
    </main>
  );
}
