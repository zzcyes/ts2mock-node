const {
  baseTypeTypescriptWord,
  complexTypeTypeScriptKeywords,
} = require("./types");

const isBaseType = (type) => baseTypeTypescriptWord.includes(type);

const isComplexType = (type) => complexTypeTypeScriptKeywords.includes(type);

module.exports = {
  isBaseType,
  isComplexType,
};
