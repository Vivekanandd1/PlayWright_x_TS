module.exports = {
  default: {
    require: ["steps/**/*.ts"],
    requireModule: ["ts-node/register"],
    paths: ["features/**/*.feature"],
    format: ["progress-bar"]
  }
};
