// Remove attachments that no published page references, so images that are
// only used by draft notes are not deployed.
// Usage: node prune-attachments.mjs <public dir>
import fs from "node:fs"
import path from "node:path"

const publicDir = path.resolve(process.argv[2] ?? "public")
const attachmentDir = path.join(publicDir, "attachment")
if (!fs.existsSync(attachmentDir)) process.exit(0)

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })

const used = new Set()
for (const file of walk(publicDir).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8")
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"#?]+)/g)) {
    if (/^[a-z]+:/i.test(ref)) continue
    let target
    try {
      target = path.resolve(path.dirname(file), decodeURIComponent(ref))
    } catch {
      continue
    }
    used.add(target)
  }
}

let removed = 0
for (const file of walk(attachmentDir)) {
  if (!used.has(file)) {
    fs.rmSync(file)
    removed++
  }
}
console.log(`Pruned ${removed} unreferenced attachment(s) from ${attachmentDir}`)
