const fakeDatabase = {
  ABC: { code: "ABC", value: 15 },
  SAVE: { code: "SAVE", value: 25 },
  SECRET: { code: "SECRET", value: 100 },
};

export async function fetchCouponFromDB(code) {
  await new Promise((res) => setTimeout(res, 15000));
  return fakeDatabase[code] || null;
}
