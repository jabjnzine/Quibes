import * as crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'

/**
 * Returns a 32-byte Buffer from the ENCRYPTION_KEY env var (64-char hex string).
 * Throws at module load time if the key is missing or invalid length — fail fast.
 */
function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY ?? ''
  if (hex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ' +
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    )
  }
  return Buffer.from(hex, 'hex')
}

// Lazily resolved so tests can set env before import
let _key: Buffer | null = null
const key = () => {
  if (!_key) _key = getKey()
  return _key
}

// ─── Encrypt ──────────────────────────────────────────────────────────────────
// Output format: <iv-hex>:<ciphertext-hex>  (stored in DB)

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key(), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

// ─── Decrypt ──────────────────────────────────────────────────────────────────

export function decrypt(ciphertext: string): string {
  const [ivHex, dataHex] = ciphertext.split(':')
  if (!ivHex || !dataHex) throw new Error('Invalid ciphertext format')
  const iv   = Buffer.from(ivHex,  'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key(), iv)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

// ─── Mask ─────────────────────────────────────────────────────────────────────
// Always returns Thai ID card mask format: X-XXXX-XXXXX-XX-X (13 digits → masked)

export function maskNationalId(): string {
  return 'X-XXXX-XXXXX-XX-X'
}

// ─── Safe decrypt (never throws — returns null on failure) ────────────────────

export function safeDecrypt(ciphertext: string | null | undefined): string | null {
  if (!ciphertext) return null
  try {
    return decrypt(ciphertext)
  } catch {
    return null
  }
}
