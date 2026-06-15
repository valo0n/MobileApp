// Funksione te pastra per llogaritjet kryesore te biznesit (te testueshme me Jest)

const COMMISSION_RATE = 0.1; // 10% komision sherbimi
const VAT_RATE = 0.18; // 18% TVSH

/**
 * Llogarit ndarjen e cmimit per nje rezervim.
 * @param {number} pricePerDay - cmimi per dite
 * @param {number} days - numri i diteve
 * @returns {{days:number, base:number, commission:number, vat:number, total:number}}
 */
function computeBreakdown(pricePerDay, days) {
  const d = Math.max(1, Math.floor(days || 0));
  const perDay = Number(pricePerDay) || 0;
  const base = perDay * d;
  const commission = +(base * COMMISSION_RATE).toFixed(2);
  const vat = +(base * VAT_RATE).toFixed(2);
  const total = +(base + commission + vat).toFixed(2);
  return { days: d, base: +base.toFixed(2), commission, vat, total };
}

/**
 * Perqindja e rimbursimit sipas oreve deri ne marrje.
 * >= 48 ore => 100% (i plote), ndryshe 0%.
 * @param {number} hoursUntilPickup
 * @returns {number} 100 ose 0
 */
function refundPercent(hoursUntilPickup) {
  return Number(hoursUntilPickup) >= 48 ? 100 : 0;
}

/**
 * A mbivendosen dy intervale datash (rezervime).
 * @returns {boolean} true nese kane konflikt
 */
function datesOverlap(startA, endA, startB, endB) {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();
  return aStart <= bEnd && bStart <= aEnd;
}

module.exports = {
  COMMISSION_RATE,
  VAT_RATE,
  computeBreakdown,
  refundPercent,
  datesOverlap,
};
