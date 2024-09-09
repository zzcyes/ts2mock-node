// 定义基础类型
// •	TSStringKeyword: string
// •	TSNumberKeyword: number
// •	TSBooleanKeyword: boolean
// •	TSNullKeyword: null
// •	TSUndefinedKeyword: undefined
// •	TSVoidKeyword: void
// •	TSUnknownKeyword: unknown
// •	TSObjectKeyword: 对象类型（表示任意对象）

const baseTypeTypescriptWord = [
  "TSStringKeyword",
  "TSNumberKeyword",
  "TSBooleanKeyword",
  "TSNullKeyword",
  "TSUndefinedKeyword",
  "TSVoidKeyword",
  "TSUnknownKeyword",
  "TSAnyKeyword",
  "TSObjectKeyword",
];
// 定义复杂类型
// •	TSArrayType: 数组类型，例如 string[]
// •	TSUnionType: 联合类型，例如 string | number
// •	TSIntersectionType: 交集类型，例如 A & B
// •	TSTypeReference: 类型引用，例如 User
// •	TSTypeLiteral: 类型字面量（具体的对象类型结构）
// •	TSFunctionType: 函数类型，例如 (x: number) => string
const complexTypeTypeScriptKeywords = [
  "TSArrayType",
  "TSUnionType",
  "TSIntersectionType",
  "TSTypeReference",
  "TSFunctionType",
  "TSLiteralType",
  "TSTypeLiteral",
  "TSTupleType",
];

module.exports = {
  baseTypeTypescriptWord,
  complexTypeTypeScriptKeywords,
};
