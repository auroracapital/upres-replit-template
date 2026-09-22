/**
 * upres.ai Batch Image Upscaler
 * Drop images into ./inputs, get upscaled results in ./outputs
 * Docs: https://upres.ai/docs/api
 */
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.UPRES_API_KEY;
const SCALE = parseInt(process.env.UPRES_SCALE || '4');
const MODEL = process.env.UPRES_MODEL || 'flare';
const API_BASE = 'https://api.upres.ai/v1';
const POLL_MS = 3000;
const TIMEOUT_MS = 300000;

if (!API_KEY) {
  console.error('ERROR: Set UPRES_API_KEY in Secrets (Replit) or .env file');
  console.error('Get a key: https://upres.ai/app/settings/api');
  process.exit(1);
}

const inputDir = path.join(__dirname, 'inputs');
const outputDir = path.join(__dirname, 'outputs');
[inputDir, outputDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff']);

async function submitJob(filePath) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath), path.basename(filePath));
  form.append('model', MODEL);
  form.append('scale', String(SCALE));
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, ...form.getHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error(`Submit failed ${res.status}: ${await res.text()}`);
  return res.json();
}

async function pollJob(jobId) {
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) throw new Error(`Poll failed ${res.status}`);
    const job = await res.json();
    if (job.status === 'completed') return job.result_url;
    if (job.status === 'failed') throw new Error(`Job failed: ${job.error}`);
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, POLL_MS));
  }
  throw new Error('Timed out');
}

async function downloadResult(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function processImage(filePath) {
  const base = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);
  const outPath = path.join(outputDir, `${base}_${SCALE}x${ext}`);
  process.stdout.write(`  ${path.basename(filePath)} `);
  const job = await submitJob(filePath);
  const url = await pollJob(job.id);
  await downloadResult(url, outPath);
  console.log(` -> outputs/${path.basename(outPath)}`);
}

async function main() {
  const images = fs.readdirSync(inputDir)
    .filter(f => SUPPORTED.has(path.extname(f).toLowerCase()))
    .map(f => path.join(inputDir, f));

  if (!images.length) {
    console.log('No images in ./inputs/');
    console.log('Add .jpg/.png/.webp files and click Run.');
    return;
  }

  console.log(`Upscaling ${images.length} image(s) at ${SCALE}x using ${MODEL}...`);
  let ok = 0, fail = 0;
  for (const img of images) {
    try { await processImage(img); ok++; }
    catch (e) { console.error(`\n  FAIL: ${path.basename(img)} - ${e.message}`); fail++; }
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed. Results in ./outputs/`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
