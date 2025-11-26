import express from "express";
import CouponCache from "./cache/CouponCache.js";
import { fetchCouponFromDB } from "./api/fakeCouponService.js";
//benefit of cache: allows for faster fetching vs DB

//setup express server
const app = express();
app.use(express.json());

//make new cache class instance with 15 sec TTL
const cache = new CouponCache(15000);

// setup get end point at coupon/:code,
app.get("/coupon/:code", async (req, res) => {
  const { code } = req.params;

  // 1. check cache, return if found
  const cached = cache.get(code);
  if (cached) {
    return res.json({
      source: "cache",
      coupon: cached,
    });
  }

  // 2. fetch coupon from fake db
  const coupon = await fetchCouponFromDB(code);
  if (!coupon) {
    return res.status(404).json({ message: "Not Found" });
  }

  // 3. if coupon found in fake db add to cache
  cache.add(coupon);

  // 4. return coupon from db
  return res.json({
    source: "database",
    coupon: coupon,
  });
});

// start server
app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
