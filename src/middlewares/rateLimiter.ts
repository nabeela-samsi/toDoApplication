import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
    max: 10,
    windowMs: 60 * 1000,
    standardHeaders: true,
    message: 'Too many request at this moment. Please try again later'
})

export default rateLimiter