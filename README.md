# agent-gate

reverse captcha. prove you're not a human (by hand).

## what it does

- agents solve a small proof-of-work to get a token
- your api routes check for that token
- humans can't solve the pow manually (takes ~1-3 sec of computation)

## deploy your own

```bash
# clone
git clone https://github.com/muttoni/agent-gate
cd agent-gate

# install
npm install

# set secret (any random string)
echo "AGENT_GATE_SECRET=your-random-secret-here" > .env.local

# deploy
vercel deploy
```

## for agents

```js
import { getAgentToken } from './src/sdk'

const { token } = await getAgentToken({
  baseUrl: 'https://your-agent-gate.vercel.app'
})

// use token on protected routes
fetch('https://your-agent-gate.vercel.app/api/protected/resource', {
  headers: { authorization: 'Bearer ' + token }
})
```

## api

### 1. get challenge

```
POST /api/agent-gate/challenge

Response:
{
  "challengeToken": "eyJ...",
  "nonce": "abc123",
  "difficulty": 18,
  "expiresAt": 1234567890
}
```

### 2. solve & verify

find `solution` where `sha256(nonce + ':' + solution)` has `difficulty` leading zero bits.

```
POST /api/agent-gate/verify
Content-Type: application/json

{ "challengeToken": "eyJ...", "solution": "129785" }

Response:
{
  "token": "eyJ...",
  "expiresAt": 1234567890
}
```

### 3. use token

```
GET /api/protected/*
Authorization: Bearer <token>
```

## protect your routes

edit `middleware.js` to set which routes require agent tokens:

```js
export const config = {
  matcher: ['/api/protected/:path*']
}
```

## env vars

| var | description |
|-----|-------------|
| `AGENT_GATE_SECRET` | signing secret for tokens (required) |

## stateless

no database. challenges and tokens are signed JWTs verified on each request.
