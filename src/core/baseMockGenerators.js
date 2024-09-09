const { baseTypeTypescriptWord } = require("./utils/types");
const Mock = require("mockjs");

function randomBaseMockGenerators() {
  return baseMockGenerators(
    baseTypeTypescriptWord[
      Math.floor(Math.random() * baseTypeTypescriptWord.length)
    ]
  );
}

function generateRandomObject() {
  // TODO:动态？？？
  const randomObject = {};

  // 随机生成对象的键值对数量
  const numberOfKeys = Mock.mock("@integer(1, 5)");

  for (let i = 0; i < numberOfKeys; i++) {
    // 随机生成 key 和 value
    const randomKey = Mock.mock("@string(5)"); // 生成长度为 5 的随机字符串作为 key
    const randomValue = randomBaseMockGenerators(); // 可以改成任何 Mock.js 提供的随机生成器

    randomObject[randomKey] = randomValue;
  }
  return randomObject;
}

// 基础类型到 Mock 数据的映射
const typeToMockMap = {
  TSStringKeyword: "@string",
  TSNumberKeyword: "@integer",
  TSBooleanKeyword: "@boolean",
  TSNullKeyword: null,
  TSVoidKeyword: null,
  TSUndefinedKeyword: undefined,
  TSUnknownKeyword: null,
  TSObjectKeyword: generateRandomObject,
  TSAnyKeyword: randomBaseMockGenerators,
};

// 生成基础类型的 mock 数据
const baseMockGenerators = (type) => {
  if (typeToMockMap.hasOwnProperty(type)) {
    const mockValue = typeToMockMap[type];
    // 如果映射值是函数，则调用它，否则直接返回值
    return typeof mockValue === "function" ? mockValue() : mockValue;
  }
  return null;
};

module.exports = baseMockGenerators;
