/**
 * Build-Metadaten des laufenden Artefakts.
 *
 * Die Werte werden von der CI/CD-Pipeline als Docker-Build-Args gesetzt
 * (siehe Dockerfile und .github/workflows/pipeline.yml). Läuft die App
 * lokal ohne Pipeline, erscheinen die "dev"-Fallbacks – so erkennt man
 * sofort, ob man ein Pipeline-Artefakt oder einen lokalen Build ansieht.
 */
export function buildInfo(env = process.env) {
  return {
    name: 'clean-infrastructure-demo',
    version: env.APP_VERSION || 'dev',
    commit: env.GIT_SHA || 'local',
    builtAt: env.BUILD_TIME || null,
    node: process.version,
  };
}
