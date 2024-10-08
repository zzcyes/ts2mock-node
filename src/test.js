const MockDataGenerator = require("./core/MockDataGenerator");
const fs = require("fs");

const input = `
        interface Student {
            name:string;
            age:number;
        }
        interface User {
            id: number;
            name: string;
            isActive: boolean;
            msg: User[];
            children: Student[];
          }
      `;
try {
  const generator = new MockDataGenerator(input);
  const result = generator.buildMockResult();
  fs.writeFileSync("mockData.json", JSON.stringify(result, null, 2));
  console.debug("result", result);
} catch (error) {
  console.error(error);
}
