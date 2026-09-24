// Utils/CucumberReporter.ts
import reporter from 'cucumber-html-reporter';
import * as fs from 'fs';
import * as path from 'path';

const reportJsonDir = path.resolve('reports/json');
const reportHtmlDir = path.resolve('reports/html');
const jsonFile = path.resolve(reportJsonDir, 'cucumber-report.json');
const outputFile = path.resolve(reportHtmlDir, 'cucumber-report.html');

export function generateHtmlReport(): void {
  if (!fs.existsSync(jsonFile)) {
    console.warn(`Cucumber JSON report not found, skipping HTML generation: ${jsonFile}`);
    return;
  }

  fs.mkdirSync(reportJsonDir, { recursive: true });
  fs.mkdirSync(reportHtmlDir, { recursive: true });

  reporter.generate({
    theme: 'bootstrap',
    jsonFile,
    output: outputFile,
    reportSuiteAsScenarios: true,
    launchReport: false,
    metadata: {
      Application: 'E-Com',
      Environment: 'QA',
      Browser: 'Chrome',
      Platform: process.platform,
    },
  });

  console.log(`Cucumber Report Generated: file://${outputFile}`);
}

if (require.main === module) {
  generateHtmlReport();
}
