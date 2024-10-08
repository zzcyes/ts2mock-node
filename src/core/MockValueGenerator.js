const { isBaseType, isComplexType } = require("./utils/helpers");
const baseMockGenerator = require("./baseMockGenerators");
const fs = require("fs");

const randomDataSource = (dataSource) => {
  if (dataSource?.length > 0) {
    const randomIndex = Math.floor(Math.random() * dataSource.length);
    return dataSource[randomIndex];
  }
  return;
};

function wf(name, content) {
  fs.writeFileSync(
    name ?? "./file.json",
    JSON.stringify(content ?? "", null, 2)
  );
}

class MockValueGenerator {
  tsInterfaceAstMap = new Map();
  deferredReferences = new Map();
  constructor(typeAnnotation, tsInterfaceAstMap, property, options) {
    this.typeAnnotation = typeAnnotation;
    this.tsInterfaceAstMap = tsInterfaceAstMap;
    this.visitedTypes = new Set(); // 新增
    this.property = property;
    this.mockKey = property?.key?.name ?? property?.key?.value;
    this.options = {
      maxDepth: options?.maxDepth ?? 2,
    };
    // this.mockValue = this.createMockValue(typeAnnotation);
    // console.debug(
    //   "【MockValueGenerator】",
    //   typeAnnotation.type
    //   // tsInterfaceAstMap
    // );
    // wf("tsInterfaceAstMap.json", tsInterfaceAstMap);
  }

  getMockValue() {
    const result = this.createMockValue(this.typeAnnotation);
    this.resolveDeferredReferences(result);
    return result;
  }

  resolveDeferredReferences(obj, depth = 0) {
    const maxDepth = this.options.maxDepth;
    if (typeof obj !== "object" || obj === null || depth > maxDepth) return;

    for (const [key, value] of Object.entries(obj)) {
      if (this.deferredReferences.has(value)) {
        const { typeName, typeAnnotation } = this.deferredReferences.get(value);
        this.visitedTypes.delete(typeName); // 临时移除，允许重新生成
        obj[key] = this.createMockValue(typeAnnotation);
        this.visitedTypes.add(typeName); // 重新添加
        // 递归解析新生成的值
        this.resolveDeferredReferences(obj[key], depth + 1, maxDepth);
      } else if (typeof value === "object" && value !== null) {
        // 递归解析嵌套对象
        this.resolveDeferredReferences(value, depth + 1, maxDepth);
      }
    }
  }

  // 主生成函数
  createMockValue(typeAnnotation) {
    const tsType = typeAnnotation.type;
    if (isBaseType(tsType)) {
      // console.debug(
      //   "【1 基础类型】",
      //   this.mockKey,
      //   "===>",
      //   tsType,
      //   baseMockGenerator(tsType)
      // );
      return baseMockGenerator(tsType);
    } else if (isComplexType(tsType)) {
      // console.debug(
      //   "【2 复杂类型】",
      //   this.mockKey,
      //   "===>",
      //   tsType,
      //   this.complexMockGenerator(typeAnnotation)
      // );
      return this.complexMockGenerator(typeAnnotation);
    } else {
      // console.debug(
      //   "【3 其他类型】",
      //   this.mockKey,
      //   "===>",
      //   tsType,
      //   false
      //   // this.complexMockGenerator(typeAnnotation)
      // );
      // TODO:其他类型暂时定义为 TSUnknownKeyword
      return this.otherMockGenerator(typeAnnotation);
    }
  }

  setTypeAnnotation(typeAnnotation) {
    this.typeAnnotation = typeAnnotation;
  }

  getTypeAnnotation() {
    return this.typeAnnotation;
  }

  // 复杂类型的生成逻辑
  complexMockGenerator(typeAnnotation) {
    switch (typeAnnotation.type) {
      case "TSArrayType":
        return this.generateTSArrayTypeMockValue(typeAnnotation);
      case "TSUnionType":
        return this.generateTSUnionTypeMockValue(typeAnnotation);
      case "TSIntersectionType":
        return this.generateTSIntersectionTypeMockValue(typeAnnotation);
      case "TSTypeReference":
        return this.generateTSTypeReferenceTypeMockValue(typeAnnotation);
      case "TSFunctionType":
        return this.generateTSFunctionTypeTypeMockValue(typeAnnotation);
      case "TSLiteralType":
        return this.generateTSLiteralTypeMockValue(typeAnnotation);
      case "TSTypeLiteral":
        return this.generateTSTypeLiteralTypeMockValue(typeAnnotation);
      case "TSTupleType":
        return this.generateTSTupleTypeTypeMockValue(typeAnnotation);
      default:
        // console.debug("【其他复杂类型】：", typeAnnotation.type);
        return "complexMockGenerator:unknown";
    }
  }

  otherMockGenerator(typeAnnotation) {
    switch (typeAnnotation.type) {
      case "TSParenthesizedType":
        return this.generateTSParenthesizedTypeMockValue(typeAnnotation);
      default:
        // TODO: 其他复杂类型
        // console.debug(
        //   "【other 复杂类型】：",
        //   this.mockKey,
        //   "===>",
        //   typeAnnotation.type
        // );
        return "TODO: otherMockGenerator: " + typeAnnotation.type;
    }
  }

  /**
   *
   *  complexMockGenerator => generateMockValue
   *  【复杂类型】的生成逻辑
   *
   */

  generateTSArrayTypeMockValue(typeAnnotation) {
    const elementType = typeAnnotation.elementType;
    return [this.createMockValue(elementType)];
  }

  // 联合类型，拿 types 数组中的随机一个类型生成 mock 值
  generateTSUnionTypeMockValue(typeAnnotation) {
    const types = typeAnnotation.types;
    return this.createMockValue(randomDataSource(types));
  }

  // 交集类型， types 数组中的随机一个类型生成 mock 值
  generateTSIntersectionTypeMockValue(typeAnnotation) {
    // console.debug(
    //   "【TSIntersectionType】：",
    //   this.mockKey,
    //   "===>",
    //   typeAnnotation.type
    // );
    // wf("./TSIntersectionType.json", typeAnnotation);
    const types = typeAnnotation.types;
    const mocks = types.map((node) => this.createMockValue(node));
    return randomDataSource(mocks) ?? "ERROR: TSIntersectionType";
  }

  // 类型引用，根据类型名称生成对应的 mock 值
  generateTSTypeReferenceTypeMockValue(typeAnnotation) {
    const typeName = typeAnnotation.typeName.name;
    // 可选
    if (typeName === "Partial") {
      return this.createMockValue(typeAnnotation.typeParameters.params?.[0]);
    }
    if (typeName === "Omit") {
      // console.debug(
      //   "typeName>>>",
      //   typeName,
      //   this.mockKey,
      //   typeAnnotation.typeParameters.params[0].typeName.name
      // );
      // wf("./TSTypeReference.Omit.json", typeAnnotation);
      return (
        this.createMockValue(typeAnnotation.typeParameters.params?.[0]) ??
        "ERROR: Omit"
      );
    }

    // TODO: 目前处理循环引用是给出最大层级，已经够用了，后续看是否还需要优化
    if (this.visitedTypes.has(typeName)) {
      const placeholder = {};
      this.deferredReferences.set(placeholder, { typeName, typeAnnotation });
      return placeholder;
    }

    this.visitedTypes.add(typeName); // 标记为已处理
    // wf("./TSTypeReference.json", typeAnnotation);
    // NOTE:这里需要从 ast 树中查找到该类型，然后生成对应的 mock 值，如果找不到，则返回 undefined
    const matchAst = this.tsInterfaceAstMap.get(typeName);
    if (matchAst) {
      const matchObj = {};
      // wf("./TSTypeReference.matchAst.json", matchAst);
      const body = matchAst.body.body;
      body.forEach((item) => {
        const itemTypeAnnotation = item.typeAnnotation?.typeAnnotation;
        const key = item.key.name;
        const value = this.createMockValue(itemTypeAnnotation);
        matchObj[key] = value;
      });
      return matchObj;
    }
    return "failed to match" + typeName;
  }

  generateTSFunctionTypeTypeMockValue(typeAnnotation) {
    const returnTypeAnnotation = typeAnnotation?.typeAnnotation.typeAnnotation;
    if (returnTypeAnnotation.type === "TSVoidKeyword") {
      return `@function(){}`;
    }
    const mockValue = this.createMockValue(returnTypeAnnotation);
    if (mockValue) {
      return `@function(){return Mock.mock('${mockValue}')}`;
    }
    return "ERROR: TSFunctionType";
  }

  generateTSLiteralTypeMockValue(typeAnnotation) {
    // TODO: TSLiteralType
    // console.debug("【TSLiteralType】：", typeAnnotation.type);
    return "ERROR:TSLiteralType";
  }

  generateTSTypeLiteralTypeMockValue(typeAnnotation) {
    const members = typeAnnotation.members;
    const mockValue = {};
    members.map(
      (item) =>
        (mockValue[item.key.name] = this.createMockValue(
          item.typeAnnotation?.typeAnnotation
        ))
    );
    // wf("./TSTypeLiteral.json", typeAnnotation);
    return mockValue ?? "ERROR: TSTypeLiteral";
  }

  generateTSTupleTypeTypeMockValue(typeAnnotation) {
    const elementTypes = typeAnnotation.elementTypes;
    return elementTypes.map((node) => this.createMockValue(node));
  }

  /**
   *
   *  otherMockGenerator => generateMockValue
   *  【其他类型】的生成逻辑
   *
   */

  generateTSParenthesizedTypeMockValue(typeAnnotation) {
    const subTypeAnnotation = typeAnnotation.typeAnnotation;
    const value = this.createMockValue(subTypeAnnotation);
    // console.debug(
    //   "【TSParenthesizedType】：",
    //   typeAnnotation.type,
    //   this.mockKey,
    //   value
    // );
    // wf("./TSParenthesizedType.json", typeAnnotation);
    // wf("./TSParenthesizedType.property.json", this.property);
    return value ?? "ERROR: TSParenthesizedType";
  }
}

module.exports = MockValueGenerator;
