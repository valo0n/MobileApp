const {
  computeBreakdown,
  refundPercent,
  datesOverlap,
} = require("../src/utils/pricing");

describe("computeBreakdown (ndarja e cmimit)", () => {
  test("llogarit bazen, komisionin 10% dhe TVSH 18%", () => {
    const r = computeBreakdown(100, 3); // 100/dite x 3 dite = 300 baze
    expect(r.days).toBe(3);
    expect(r.base).toBe(300);
    expect(r.commission).toBe(30); // 10%
    expect(r.vat).toBe(54); // 18%
    expect(r.total).toBe(384); // 300 + 30 + 54
  });

  test("te pakten 1 dite edhe nese jepet 0", () => {
    const r = computeBreakdown(50, 0);
    expect(r.days).toBe(1);
    expect(r.base).toBe(50);
  });

  test("trajton vlera te pavlefshme pa u rrezuar", () => {
    const r = computeBreakdown(undefined, undefined);
    expect(r.total).toBe(0);
  });
});

describe("refundPercent (rimbursimi sipas kohes)", () => {
  test("100% nese >= 48 ore para marrjes", () => {
    expect(refundPercent(48)).toBe(100);
    expect(refundPercent(72)).toBe(100);
  });

  test("0% nese < 48 ore", () => {
    expect(refundPercent(47)).toBe(0);
    expect(refundPercent(2)).toBe(0);
  });
});

describe("datesOverlap (konflikt datash)", () => {
  test("kthen true kur intervalet mbivendosen", () => {
    expect(
      datesOverlap("2026-06-10", "2026-06-15", "2026-06-12", "2026-06-18"),
    ).toBe(true);
  });

  test("kthen false kur s'ka mbivendosje", () => {
    expect(
      datesOverlap("2026-06-10", "2026-06-12", "2026-06-13", "2026-06-15"),
    ).toBe(false);
  });
});
