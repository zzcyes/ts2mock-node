const MockValueGenerator = require("./MockValueGenerator");

// 生成 Mock 数据的函数
const generateMockFromInterface = (property, tsInterfaceAstMap) => {
  let mockValue;
  if (
    property.type === "TSPropertySignature" &&
    ["StringLiteral", "Identifier"].includes(property.key.type)
  ) {
    const typeAnnotation = property.typeAnnotation?.typeAnnotation;
    if (!typeAnnotation) return;

    const mockValueGenerator = new MockValueGenerator(
      typeAnnotation,
      tsInterfaceAstMap,
      property
    );
    mockValue = mockValueGenerator.getMockValue();
  }
  return mockValue;
};

module.exports = generateMockFromInterface;
