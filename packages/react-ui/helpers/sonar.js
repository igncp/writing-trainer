const { exec } = require('child_process')
const { join } = require('path')

const pjson = require('../package.json')

const getIgnoredRulesCommandOpts = ignoredRules => {
  if (ignoredRules.length === 0) {
    return ''
  }

  // the first option is a list of the number of ignored rules, e.g: e1,e2,e3
  const firstOptValue = ignoredRules.map((i, idx) => `e${idx + 1}`).join(',')
  const firstOpt = `-Dsonar.issue.ignore.multicriteria="${firstOptValue}"`

  // for each ignored rule, the command requires a pair of options
  const restOpts = ignoredRules
    .map((item, idx) => {
      const num = idx + 1

      return (
        `-Dsonar.issue.ignore.multicriteria.e${num}.resourceKey="${item.resourceKeyValue}" ` +
        `-Dsonar.issue.ignore.multicriteria.e${num}.ruleKey="${item.ruleKeyValue}"`
      )
    })
    .join(' ')

  return `${firstOpt} ${restOpts}`
}

if (!process.env.SONAR_TOKEN) {
  console.log('SONAR_TOKEN env variable missing')
  process.exit(1)
}

const sonarSources = ['src'].join(',')
const sonarExclusions = ['**/*.test.tsx', '**/*.stories.tsx'].join(',')

const sonarHost = 'http://localhost:9002'
const sonarProjectKey = 'writing-trainer'
const sonarProjectName = 'Writing Trainer'
const sonarToken = process.env.SONAR_TOKEN

const javascriptGlobals = [].join(',')

const sonarJavascriptReportPath = join('coverage', 'lcov.info')
const sonarCoverageExclusions = [].join(',')

const ignoredRulesOpts = getIgnoredRulesCommandOpts([
  {
    resourceKeyValue: '**/*.tsx',
    ruleKeyValue: 'typescript:S1116',
  },
])

/* eslint-disable prefer-template */
const command =
  `${join('node_modules', '.bin', 'sonar-scanner')} ` +
  `-Dsonar.projectVersion="${pjson.version}" ` +
  `-Dsonar.login="${sonarToken}" ` +
  `-Dsonar.projectKey="${sonarProjectKey}" ` +
  `-Dsonar.projectName="${sonarProjectName}" ` +
  `-Dsonar.sources="${sonarSources}" ` +
  `-Dsonar.javascript.lcov.reportPath="${sonarJavascriptReportPath}" ` +
  (sonarExclusions ? `-Dsonar.exclusions="${sonarExclusions}" ` : '') +
  (javascriptGlobals
    ? `-Dsonar.javascript.globals="${javascriptGlobals}" `
    : '') +
  (sonarCoverageExclusions
    ? `-Dsonar.coverage.exclusions="${sonarCoverageExclusions}" `
    : '') +
  `${ignoredRulesOpts} ` +
  `-Dsonar.host.url="${sonarHost}"`
/* eslint-enable prefer-template */

console.log('Parsing the project with Sonar')

console.log(`Sonar command:\n${command}\n`)

const sonar = exec(command)

sonar.on('close', code => {
  console.log(`sonar ended with: ${code}`)
})

sonar.on('error', err => {
  console.log(`sonar errd with: ${err}`)
  process.exit(1)
})

sonar.stdout.on('data', d => {
  console.log(`sonar: ${d}`)
})
