import { beforeEach, describe, expect, it } from "vitest";
import {
  ApiError,
  dedupeRequest,
  unwrapApiResponse,
  __testClearCaches,
} from "../src/services/api";

beforeEach(() => {
  __testClearCaches();
});

describe("unwrapApiResponse", () => {
  it("returns data when success is true", () => {
    expect(unwrapApiResponse({ success: true, data: { x: 1 } })).toEqual({
      x: 1,
    });
  });

  it("throws ApiError when success is false", () => {
    expect(() =>
      unwrapApiResponse({ success: false, message: "bad" })
    ).toThrow(ApiError);
  });

  it("throws ApiError for invalid envelope", () => {
    expect(() => unwrapApiResponse({ foo: 1 })).toThrow(ApiError);
  });
});

describe("dedupeRequest", () => {
  it("reuses a single in-flight promise for the same key", async () => {
    let runs = 0;
    const factory = () =>
      new Promise<number>((resolve) => {
        runs += 1;
        setTimeout(() => resolve(runs), 25);
      });
    const a = dedupeRequest("unit-key", factory);
    const b = dedupeRequest("unit-key", factory);
    expect(a).toBe(b);
    const v = await a;
    expect(v).toBe(1);
    expect(runs).toBe(1);
  });
});
