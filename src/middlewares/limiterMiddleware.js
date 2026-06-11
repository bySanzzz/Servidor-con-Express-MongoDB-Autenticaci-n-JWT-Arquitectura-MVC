import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 22222222222222222222222222222222222222222222,

  handler: (req, res) => {
    res.status(429).json({ error: "Too many requests, please try again later." })
  }
})

export { limiter }