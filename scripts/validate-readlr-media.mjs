import { access, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const packages = [
  { curriculum: 'mat-curriculum-review.json', manifest: 'mat-media-manifest.json' },
  { curriculum: 'eng02-curriculum-review.json', manifest: 'eng02-media-manifest.json' },
];
const readJson = async file => JSON.parse(await readFile(path.join(root, 'docs/refactoring', file), 'utf8'));
const allErrors = [];
const summaries = [];

for (const packageFiles of packages) {
  const [manifest, curriculum] = await Promise.all([
    readJson(packageFiles.manifest),
    readJson(packageFiles.curriculum),
  ]);
  const errors = [];
  const fail = message => errors.push(message);
  const unique = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item)) fail(`Duplicate ${label}: ${item}`);
      seen.add(item);
    }
  };

  if (manifest.schemaVersion !== 1) fail('Unsupported media manifest schemaVersion.');
  if (manifest.curriculumVersion !== curriculum.curriculumVersion) fail('Manifest curriculumVersion does not match the curriculum draft.');
  if (manifest.runtimeAvailable !== false) fail('Provisional manifest must not be runtime available.');
  if (manifest.policies.allowInstructionalTts !== false) fail('Instructional TTS must be disabled.');
  if (manifest.policies.allowLegacyInstructionalSubstitution !== false) fail('Legacy instructional substitution must be disabled.');

  unique(manifest.assets.map(asset => asset.assetId), 'assetId');
  unique(manifest.assets.map(asset => `${asset.contentId}:${asset.kind}`), 'content/kind requirement');

  const contentIds = new Set(curriculum.content.map(item => item.id));
  const manifestRequirements = new Set(manifest.assets.map(asset => `${asset.contentId}:${asset.kind}`));
  for (const requirement of curriculum.mediaRequirements) {
    for (const kind of requirement.kinds) {
      const key = `${requirement.target}:${kind}`;
      if (!manifestRequirements.has(key)) fail(`Missing curriculum media requirement: ${key}`);
    }
  }

  let approved = 0;
  for (const asset of manifest.assets) {
    if (!contentIds.has(asset.contentId)) fail(`${asset.assetId} references unknown content ${asset.contentId}.`);
    if (!asset.required) fail(`${asset.assetId} is a curriculum requirement and must remain required.`);
    const approval = asset.approval ?? {};
    const rights = asset.rights ?? {};
    if (approval.status === 'approved') {
      approved += 1;
      if (!asset.revision) fail(`${asset.assetId} is approved without a revision.`);
      if (!approval.reviewer || !approval.role || !approval.date || !approval.approvalVersion) {
        fail(`${asset.assetId} has incomplete educator approval metadata.`);
      }
      if (rights.status !== 'cleared' || !rights.source) fail(`${asset.assetId} is approved without cleared rights provenance.`);
    }
    if (asset.revision?.type === 'audio_file' || asset.revision?.type === 'image_file') {
      const relativePath = asset.revision.path?.replaceAll('/', path.sep);
      if (!relativePath) {
        fail(`${asset.assetId} revision has no path.`);
        continue;
      }
      const absolutePath = path.resolve(root, relativePath);
      const publicRoot = path.resolve(root, 'frontend/public') + path.sep;
      if (!absolutePath.startsWith(publicRoot)) {
        fail(`${asset.assetId} points outside frontend/public.`);
        continue;
      }
      try {
        await access(absolutePath);
        const bytes = await readFile(absolutePath);
        const hash = createHash('sha256').update(bytes).digest('hex');
        if (bytes.length !== asset.revision.bytes) fail(`${asset.assetId} byte count does not match its revision.`);
        if (hash !== asset.revision.sha256) fail(`${asset.assetId} SHA-256 does not match its revision.`);
      } catch (error) {
        fail(`${asset.assetId} file is unavailable: ${error.message}`);
      }
    }
  }

  const required = manifest.assets.filter(asset => asset.required);
  const eligible = required.every(asset => asset.approval?.status === 'approved');
  if (eligible !== (manifest.releaseStatus === 'eligible')) {
    fail(`releaseStatus must be ${eligible ? 'eligible' : 'blocked'} for the current approval set.`);
  }
  if (eligible !== manifest.runtimeAvailable) {
    fail(`runtimeAvailable must be ${eligible} for the current approval set.`);
  }

  if (errors.length) allErrors.push(...errors.map(error => `${manifest.manifestVersion}: ${error}`));
  summaries.push(`${manifest.manifestVersion}: ${approved}/${required.length} required assets approved; release ${manifest.releaseStatus}`);
}

if (allErrors.length) {
  console.error('Readlr media validation failed:');
  for (const error of allErrors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Readlr media manifests valid:\n- ${summaries.join('\n- ')}`);
}
