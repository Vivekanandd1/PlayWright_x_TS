import { config } from 'dotenv';
import { loadConfiguration, runCucumber } from '@cucumber/cucumber/api';
import { generateHtmlReport } from '../Utils/CucumberReporter';

config();

(async () => {
  const { runConfiguration } = await loadConfiguration({
    provided: {
      paths: ['feature/*.feature'],
      require: ['steps/**/*.ts'],
      format: ['pretty', 'json:reports/json/cucumber-report.json'],
      /* Add test tag here to run the Script*/
      tags: '@smoke',
    },
  });

  const { success } = await runCucumber(runConfiguration);
  generateHtmlReport();
  process.exit(success ? 0 : 1);
})();

