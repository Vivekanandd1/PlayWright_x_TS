module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      "steps/**/*.ts"
    ],
    format: [
      "progress",
      "json:reports/json/cucumber-report.json"
    ]
  }
};
