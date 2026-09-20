// Utils/CucumberReporter.ts
import reporter from 'cucumber-html-reporter';
import * as fs from 'fs';
import * as path from 'path';

const reportJsonDir = path.resolve('reports/json');
const reportHtmlDir = path.resolve('reports/html');

fs.mkdirSync(reportJsonDir, { recursive: true });
fs.mkdirSync(reportHtmlDir, { recursive: true });

reporter.generate({
  theme: 'bootstrap',
  jsonFile: path.resolve(reportJsonDir, 'cucumber-report.json'),
  output: path.resolve(reportHtmlDir, 'cucumber-report.html'),
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: {
    Application: 'E-Com',
    Environment: 'QA',
    Browser: 'Chrome',
    Platform: process.platform,
  },
});

console.log(`Cucumber Report Generated: file://${path.resolve(reportHtmlDir, 'cucumber-report.html')}`);
