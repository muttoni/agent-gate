# agent-gate (v0)

A minimal **agent-only gate** for an API gateway.

Goal (v0): humans **cannot pass by hand**.
Non-goal (v0): prevent a human from running code/agents to pass.

Constraints from Andrea:
- cloud only
- fully anonymous
- node + vercel
- intended as an API gateway primitive

## ELI5
It’s a captcha where the “puzzle” is annoying/impossible to do manually, but trivial to automate.

We use a small proof-of-work (PoW) challenge + short-lived signed token.

## API (v0)
### 1) Create challenge
`POST /api/agent-gate/challenge`

Response:
```json
{
  "challengeToken": "...",
  "nonce": "...",
  "difficulty": 18,
  "expiresAt": 1738250000
}
```

### 2) Solve challenge + verify
Client finds a `solution` such that:

`sha256(nonce + ":" + solution)` has `difficulty` leading zero **bits**.

`POST /api/agent-gate/verify`

Request:
```json
{ "challengeToken": "...", "solution": "..." }
```

Response:
```json
{ "token": "<jwt>", "expiresAt": 1738250000 }
```

### 3) Use token
Call protected APIs with:

`Authorization: Bearer <jwt>`

Gateway middleware verifies signature + expiry.

## Why PoW?
- Humans can’t do it by hand.
- Agents can do it in milliseconds/seconds.
- No identity needed.
- Easy to integrate (single function).

## Threat model (v0)
Stops:
- manual humans

Does NOT stop:
- humans running scripts/agents
- token sharing (we keep it anonymous)

Hardening later:
- replay protection (challenge consume-once)
- rate limiting per IP
- optional binding tokens to gateway audience
- Vercel KV store for challenges

## Files
- `src/server/` API handlers
- `src/sdk/` tiny TS client (`getAgentToken()`)
- `src/gateway/` example middleware
