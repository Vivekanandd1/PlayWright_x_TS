module.exports = {
  default: {
    require: [
      "steps/**/*.ts"
    ],
    format: [
      "progress",
      "json:reports/json/cucumber-report.json"
    ]
  }
};