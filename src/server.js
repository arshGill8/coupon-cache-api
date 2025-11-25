import express from "express";
import CouponCache from "./cache/CouponCache";
import { fetchCouponFromDB } from "./api/fakeCouponService";

const app = express();
app.use(express.json());

const cache = new CouponCache(15000); // 15-sec TTL

app.get("/coupon/:code", async (req, res) => {
  const { code } = req.params;

  // 1. Check cache
  const cached = cache.get(code);
  if (cached) {
    return res.json({
      source: "cache",
      coupon: cached,
    });
  }

  // 2. fetch from fake DB
  const coupon = await fetchCouponFromDB(code);
  if (!coupon) {
    return res.status(404).json({ message: "Not found" });
  }

  // 3. Add to cache
  cache.add(coupon);

  // 4. Return from database
  res.json({
    source: "database",
    coupon,
  });
});

// start server
app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
