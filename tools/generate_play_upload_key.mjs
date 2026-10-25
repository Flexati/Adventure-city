import { randomBytes } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname);
const outputDir = resolve(process.env.PLAY_KEY_OUTPUT_DIR || join(root, 'dist', 'play-upload'));
const packageName = 'JaguarZcreatorZ13.app';
const alias = 'chronos-upload';
const keystore = join(outputDir, 'JaguarZcreatorZ13-upload-key.jks');
const certificate = join(outputDir, 'JaguarZcreatorZ13-upload-certificate.pem');
const credentials = join(outputDir, 'UPLOAD_KEY_CREDENTIALS.txt');

for (const path of [keystore, certificate, credentials]) {
  if (existsSync(path)) throw new Error(`Refusing to overwrite existing upload-key material: ${path}`);
}

mkdirSync(outputDir, { recursive: true, mode: 0o700 });
chmodSync(outputDir, 0o700);
const storePassword = randomBytes(24).toString('base64url');
const keyPassword = randomBytes(24).toString('base64url');

function run(args) {
  const result = spawnSync('keytool', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `keytool exited ${result.status}`);
  return result.stdout;
}

run([
  '-genkeypair', '-storetype', 'JKS', '-keystore', keystore,
  '-storepass', storePassword, '-keypass', keyPassword, '-alias', alias,
  '-keyalg', 'RSA', '-keysize', '2048', '-sigalg', 'SHA256withRSA',
  '-validity', '10000',
  '-dname', 'CN=Chronos Adventure Upload,OU=Play Upload,O=JaguarZcreatorZ13,C=IT',
]);
run([
  '-exportcert', '-rfc', '-keystore', keystore, '-storepass', storePassword,
  '-alias', alias, '-file', certificate,
]);
const inspection = run(['-printcert', '-file', certificate]);
const sha256 = inspection.match(/SHA256:\s*([^\r\n]+)/)?.[1]?.trim();
if (!sha256) throw new Error('Unable to read the upload certificate SHA-256 fingerprint.');

const generatedAt = new Date().toISOString();
writeFileSync(credentials, [
  'CHRONOS ADVENTURE — PLAY UPLOAD KEY',
  `Generated: ${generatedAt}`,
  `Application ID: ${packageName}`,
  `Keystore file: ${keystore.split('/').pop()}`,
  'Keystore type: JKS',
  `Alias: ${alias}`,
  `Keystore password: ${storePassword}`,
  `Private key password: ${keyPassword}`,
  `Upload certificate SHA-256: ${sha256}`,
  '',
  'KEEP THIS FILE AND THE JKS PRIVATE. Make at least two encrypted backups.',
  'Register the PEM certificate as the Play Console upload-key certificate if requested.',
  'The Google Play app-signing/deployment key remains separate and is not stored here.',
  '',
].join('\n'), { mode: 0o600 });

chmodSync(keystore, 0o600);
chmodSync(certificate, 0o644);
chmodSync(credentials, 0o600);
console.log(JSON.stringify({
  result: 'PASS',
  packageName,
  alias,
  keystore,
  certificate,
  credentials,
  uploadCertificateSha256: sha256,
}, null, 2));
