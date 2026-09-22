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
| `UPRES_MODEL` | `flare` | See below |

## Models

Public aliases only. `hush`, `keen`, and `visage` ignore `UPRES_SCALE`.

| Alias | Best for |
|---|---|
| `flare` | Everyday photos (default) |
| `prism` | Text, logos, product shots |
| `lumen` | Print detail, up to 8× |
| `mirage` | Invented detail, art only |
| `hush` | Denoise, same size |
| `keen` | Deblur and sharpen, same size |
| `visage` | Faces, does not enlarge |
| `atelier` | Hush, Visage if a portrait, then Lumen |

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
  -F "model=flare" \
  -F "scale=4"

# Poll for result
curl https://api.upres.ai/v1/jobs/{id} \
  -H "Authorization: Bearer $UPRES_API_KEY"
```

## Pricing

| Plan | Price | Stills / mo | 4K video |
|---|---|---|---|
| Free | $0 | 3 | 1 clip |
| Creator | $9/mo | 50 | 20 min |
| Pro | $19/mo | 100 | 30 min |
| Studio | $39/mo | 250 | 90 min, API |
| Business | $99/mo | 500 | 150 min |
