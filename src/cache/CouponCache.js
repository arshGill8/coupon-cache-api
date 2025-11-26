class CouponCache {
  constructor(TTL = 10000) {
    this.TTL = TTL;
    this.store = new Map();
  }

  add(coupon) {
    this.store.set(coupon.code, {
      value: coupon,
      expiry: Date.now() + this.TTL,
    });
  }
  get(code) {
    const entry = this.store.get(code);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(code);
      return null;
    }
    return entry.value;
  }
}

export default CouponCache;

// 1. class named CouponCache, constructor has default TTL
// and 2 instance properties this.ttl & this.store
// 2. add/set method(create/set object with 2 properties value and expiry)
// 3. get method, check if it exists, check expiry, return value if all cleared
