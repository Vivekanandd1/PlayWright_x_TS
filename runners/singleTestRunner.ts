import { config } from 'dotenv';
import { loadConfiguration, runCucumber } from '@cucumber/cucumber/api';

config();

(async () => {
  const { runConfiguration } = await loadConfiguration({
    provided: {
      paths: ['feature/*.feature'],
      require: ['steps/**/*.ts'],
      format: ['pretty', 'json:reports/json/cucumber-report.json', 'html:reports/html/cucumber-report.html'],
      /* Add test tag here to run the Script*/
      tags: '@Filters',
    },
  });

  const { success } = await runCucumber(runConfiguration);
  console.log()
  console.log(`Report generated at: file://${process.cwd()}/reports/html/cucumber-report.html`);
  process.exit(success ? 0 : 1);
})();

