# upres.ai Batch Upscaler

AI image upscaling to 4x / 8K — powered by [upres.ai](https://upres.ai)

[![Fork on Replit](https://replit.com/badge/github/auroracapital/upres-replit-template)](https://replit.com/new/github/auroracapital/upres-replit-template)

## Quick start (3 steps)

1. **Get an API key** at [upres.ai/app/settings/api](https://upres.ai/app/settings/api)
2. **Set your key** in the Secrets tab: `UPRES_API_KEY = upres_your_key`
3. **Drop images** into the `inputs/` folder and click **Run**

Upscaled images appear in `outputs/` with `_4x` in the filename.

## Config (Replit Secrets or .env)

| Variable | Default | Options |
|---|---|---|
| `UPRES_API_KEY` | required | Get at upres.ai |
| `UPRES_SCALE` | `4` | `2`, `4`, `8` |
| `UPRES_MODEL` | `wavespeed-ai/real-esrgan` | See below |

## Models

| Model | Best for |
|---|---|
| `wavespeed-ai/real-esrgan` | Photos, faces (default) |
| `aura-sr` | High-detail artistic images |
| `clarity-upscaler` | Max quality (slower) |
| `esrgan-v1-x2plus` | 2x fast upscale |

## Local usage

```bash
git clone https://github.com/auroracapital/upres-replit-template
cd upres-replit-template
cp .env.example .env  # add your key
npm install
# drop images into inputs/
npm start
```

## API reference

Docs: [upres.ai/docs/api](https://upres.ai/docs/api) | OpenAPI: `https://api.upres.ai/v1/openapi.json`

```bash
# Submit a job
curl -X POST https://api.upres.ai/v1/jobs \
  -H "Authorization: Bearer $UPRES_API_KEY" \
  -F "image=@photo.jpg" \
  -F "model=wavespeed-ai/real-esrgan" \
  -F "scale=4"

# Poll for result
curl https://api.upres.ai/v1/jobs/{id} \
  -H "Authorization: Bearer $UPRES_API_KEY"
```

## Pricing

| Plan | Price | Ops/mo |
|---|---|---|
| BASIC | Free | 5 |
| PRO | $19/mo | 100 |
| BUSINESS | $49/mo | Unlimited |
