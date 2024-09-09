import { describe, it, expect, test, vi, beforeEach, afterEach } from "vitest";
import MockDataGenerator from "./MockDataGenerator";

describe("MockDataGenerator", () => {
  it("should generate mock data for a simple interface", () => {
    const input = `
        interface User {
          id: number;
          name: string;
          isActive: boolean;
        }
      `;
    const generator = new MockDataGenerator(input);
    const result = generator.buildMockResult();
    expect(result).toHaveProperty("User");
    expect(result.User).toHaveProperty("id");
    expect(result.User).toHaveProperty("name");
    expect(result.User).toHaveProperty("isActive");
    expect(typeof result.User.id).toBe("number");
    expect(typeof result.User.name).toBe("string");
    expect(typeof result.User.isActive).toBe("boolean");
  });

  it("should handle complex interfaces with various types", () => {
    const input = String.raw`
      export interface User {
        name: string;
        isActive: boolean;
        age: number;
        nullableValue: null;
        undefinedValue: undefined;
        unknownValue: unknown;
        anyValue: any;
        voidValue: void;
        baseUnionType:
          | string
          | number
          | boolean
          | null
          | undefined
          | unknown
          | any
          | void;
        stringList: string[];
        unionArray: (string | number)[];
        multiArray: string[] | number[];
        intersectionAB: A & B;
        intersectionMsgUser: Msg & User;
        userList: User[];
        message: Msg;
        partialMessage: Partial<Msg>;
        unionABCList: (A | B | C)[];
        intersectionWithUnion: A & (B | C);
        intersectionOrUnion: (A & B) | C;
        tsObject: object;
        typeLiteral: {
          name: string,
          age: number,
          phone?: number | string,
        };
        tupleExample: [number, string];
        omitMessageList: Omit<Msg, "list"> & { list?: string };
        omitAProperty: Omit<A, "a">;
      }

      export interface Msg {
        type: string | number;
        content: string[];
        list: (A | B | C)[];
      }

      export interface A {
        a: string;
      }

      export interface B {
        b: number;
      }

      export interface C {
        c: number;
      }
    `;

    const generator = new MockDataGenerator(input);
    const result = generator.buildMockResult();

    // 测试基础类型
    expect(typeof result.User.name).toBe("string");
    expect(typeof result.User.isActive).toBe("boolean");
    expect(typeof result.User.age).toBe("number");
    expect(result.User.nullableValue).toBeNull();
    expect(result.User.undefinedValue).toBeUndefined();
    expect(result.User.unknownValue).toBeDefined();
    expect(result.User).toHaveProperty("anyValue"); // `any` 可以是任何类型
    expect(result.User.voidValue).toBeNull();

    // 测试联合类型
    expect(["string", "number", "boolean", "object", "undefined"]).toContain(
      typeof result.User.baseUnionType
    );

    // 测试数组类型
    expect(Array.isArray(result.User.stringList)).toBe(true);
    result.User.stringList.forEach((item) => {
      expect(typeof item).toBe("string");
    });

    expect(Array.isArray(result.User.unionArray)).toBe(true);
    result.User.unionArray.forEach((item) => {
      expect(["string", "number"]).toContain(typeof item);
    });

    expect(["string", "number"]).toContain(typeof result.User.multiArray[0]);

    // 测试交集类型
    expect(result.User).toHaveProperty("intersectionAB");

    expect(result.User).toHaveProperty("intersectionMsgUser");

    // 测试嵌套类型
    expect(Array.isArray(result.User.userList)).toBe(true);
    expect(result.User.userList[0]).toHaveProperty("name");

    expect(result.User.message).toHaveProperty("type");
    expect(result.User.message).toHaveProperty("content");

    // 测试部分类型
    expect(result.User.partialMessage).toBeDefined();
    expect(result.User.partialMessage).toHaveProperty("type");

    // 测试联合类型数组
    expect(Array.isArray(result.User.unionABCList)).toBe(true);

    // 测试交集和联合类型的组合
    expect(result.User).toHaveProperty("intersectionWithUnion");

    // 测试元组类型
    expect(Array.isArray(result.User.tupleExample)).toBe(true);
    expect(result.User.tupleExample).toHaveLength(2);
    expect(typeof result.User.tupleExample[0]).toBe("number");
    expect(typeof result.User.tupleExample[1]).toBe("string");

    // 测试 Omit 类型
    expect(result.User).toHaveProperty("omitMessageList");
    expect(result.User).toHaveProperty("omitAProperty");

    // 测试对象类型和字面量
    expect(result.User.tsObject).toBeDefined();
    expect(result.User.typeLiteral).toHaveProperty("name");
    expect(result.User.typeLiteral).toHaveProperty("age");
  });

  // it("should throw an error for invalid TypeScript", () => {
  //   const input = `
  //       interface1 InvalidInterface {
  //         id: number;
  //         name: string;
  //       }
  //     `;

  //   expect(() => {
  //     new MockDataGenerator(input);
  //   }).toThrow();
  // });
});
