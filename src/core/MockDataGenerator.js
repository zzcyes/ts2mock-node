const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generateMockCode = require("./generateMockCode");
const generateMockFromInterface = require("./generateMockFromInterface");
const Mock = require("mockjs");

class MockDataGenerator {
  constructor(input) {
    this.input = input;
    this.interfaceAstList = [];
    this.interfaceAstMap = new Map();
    this.run(input);
  }

  run(input) {
    try {
      const ast = parse(input, {
        sourceType: "module",
        plugins: ["typescript"],
      });

      this.parseInterfaceAst(ast);
      const mockTemplate = this.generateMockData();

      this.setMockTemplate(mockTemplate);
    } catch (error) {
      console.error("解析错误:", error);
      throw new Error("解析失败");
    }
  }

  setMockTemplate(result) {
    this.mockTemplate = result;
  }

  getMockTemplate() {
    return this.mockTemplate;
  }

  buildMockFuncition() {
    const result = {};
    Object.entries(this.mockTemplate).map(([key, value]) => {
      result[key] = generateMockCode({ mockData: value });
      // return {
      //   url: `/api/v1/${key.toLowerCase()}`,
      //   method: "get",
      //   mockData: value,
      // };
    });
    return result;
    // return generateMockCode({ mockData: this.mockTemplate });
  }

  buildMockResult() {
    return Mock.mock(this.mockTemplate);
  }

  setMockResult(result) {
    this.mockResult = Mock.mock(result);
  }

  getMockResult() {
    return this.mockResult;
  }

  parseInterfaceAst(ast) {
    traverse(ast, {
      TSInterfaceDeclaration: (path) => {
        const interfaceName = path.node.id.name;
        this.interfaceAstMap.set(interfaceName, path.node);
        this.interfaceAstList.push(path.node);
      },
    });
    return this;
  }

  generateMockData() {
    const mockDataMap = new Map();

    this.interfaceAstList.forEach((item) => {
      const interfaceName = item.id.name;
      const interfaceBody = item.body.body;
      const mockData = {};
      interfaceBody.forEach((property) => {
        const key = property.key.name ?? property.key.value;
        mockData[key] = generateMockFromInterface(
          property,
          this.interfaceAstMap
        );
      });
      mockDataMap.set(interfaceName, mockData);
    });

    return Object.fromEntries(mockDataMap);
  }
}

module.exports = MockDataGenerator;
