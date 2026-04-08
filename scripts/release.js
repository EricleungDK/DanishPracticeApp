#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const PACKAGE_JSON = path.join(ROOT, 'package.json')
const BUILD_GRADLE = path.join(ROOT, 'android', 'app', 'build.gradle')
const AAB_PATH = path.join(ROOT, 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab')
const EXE_DIR = path.join(ROOT, 'out', 'make')

// --- Pure functions ---

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number)
  switch (type) {
    case 'major': return `${major + 1}.0.0`
    case 'minor': return `${major}.${minor + 1}.0`
    case 'patch': return `${major}.${minor}.${patch + 1}`
    default: throw new Error(`Invalid bump type: ${type}`)
  }
}

function updateGradleVersion(content, newVersionCode, newVersionName) {
  return content
    .replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`)
    .replace(/versionName\s+"[^"]+"/, `versionName "${newVersionName}"`)
}

function updatePackageVersion(content, newVersion) {
  const pkg = JSON.parse(content)
  pkg.version = newVersion
  return JSON.stringify(pkg, null, 2) + '\n'
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// --- Orchestration ---

function run(label, command, opts = {}) {
  console.log(`\n>>> ${label}`)
  console.log(`    $ ${command}\n`)
  try {
    execSync(command, { stdio: 'inherit', cwd: ROOT, ...opts })
  } catch {
    console.error(`\n!!! RELEASE FAILED at: ${label}`)
    console.error('    Version files were already bumped. To revert:')
    console.error('    git checkout -- package.json android/app/build.gradle')
    process.exit(1)
  }
}

function main() {
  const bumpType = process.argv[2] || 'patch'
  if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error('Usage: npm run release [-- patch|minor|major]')
    process.exit(1)
  }

  // Read current versions
  const pkgRaw = fs.readFileSync(PACKAGE_JSON, 'utf-8')
  const gradleRaw = fs.readFileSync(BUILD_GRADLE, 'utf-8')
  const currentVersion = JSON.parse(pkgRaw).version
  const currentVersionCode = parseInt(gradleRaw.match(/versionCode\s+(\d+)/)[1], 10)

  const newVersion = bumpVersion(currentVersion, bumpType)
  const newVersionCode = currentVersionCode + 1

  console.log('\n=== Dansk Praksis Release Build ===')
  console.log(`Bump: ${bumpType}`)
  console.log(`Version: ${currentVersion} -> ${newVersion}`)
  console.log(`versionCode: ${currentVersionCode} -> ${newVersionCode}`)

  // Step 1: Bump versions
  fs.writeFileSync(PACKAGE_JSON, updatePackageVersion(pkgRaw, newVersion))
  fs.writeFileSync(BUILD_GRADLE, updateGradleVersion(gradleRaw, newVersionCode, newVersion))
  console.log('Version files updated.')

  // Step 2: Tests
  run('Running tests', 'npm test')

  // Step 3: Android AAB
  run('Building web assets', 'npm run build:web')
  run('Syncing Capacitor Android', 'npx cap sync android')
  const gradleCmd = process.platform === 'win32'
    ? 'cmd /c ".\\gradlew.bat" bundleRelease'
    : './gradlew bundleRelease'
  run('Building Android AAB', gradleCmd, { cwd: path.join(ROOT, 'android') })

  // Step 4: Windows exe
  run('Building Windows installer', 'npm run make:win')

  // Step 5: Summary
  const aabSize = fs.existsSync(AAB_PATH) ? formatBytes(fs.statSync(AAB_PATH).size) : '?'

  console.log('\n========================================')
  console.log('  RELEASE BUILD COMPLETE')
  console.log('========================================')
  console.log(`  Version: ${newVersion} (versionCode ${newVersionCode})`)
  console.log('')
  console.log('  Android AAB:')
  console.log(`    ${AAB_PATH}`)
  console.log(`    Size: ${aabSize}`)
  console.log('')
  console.log('  Windows EXE:')
  console.log(`    ${EXE_DIR}`)
  console.log('')
  console.log('  Next steps:')
  console.log(`    git add package.json android/app/build.gradle`)
  console.log(`    git commit -m "bump v${newVersion}"`)
  console.log('========================================')
}

if (require.main === module) {
  main()
} else {
  module.exports = { bumpVersion, updateGradleVersion, updatePackageVersion, formatBytes }
}
