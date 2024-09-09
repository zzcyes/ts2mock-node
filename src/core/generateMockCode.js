const stringFunctionToObject = (jsonStr) => {
  return jsonStr.replace(/"@function\s*\(.*?\)\s*{[^}]*}"/g, (match) => {
    // 去掉双引号和 '@'
    return match.slice(1, -1).replace(/^@/, "");
  });
};

// 生成 Mock 代码
const generateMockCode = ({ url, method, mockData }) => {
  const stringifyMockData = stringFunctionToObject(
    JSON.stringify(mockData, null, 2)
  );

  if (!url || !method) {
    return (
      "const Mock = require('mockjs');" +
      "\n" +
      `Mock.mock(${stringifyMockData});`
    );
  }
  return (
    "const Mock = require('mockjs');" +
    "\n" +
    `Mock.mock('${url}', '${method}', ${stringifyMockData});`
  );
};

module.exports = generateMockCode;
