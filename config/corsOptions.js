import { allowedOrigins } from "./allowedOrigins.js";

// The `cors` middleware is used to enable CORS (Cross-Origin Resource Sharing) for the API.
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}

export default corsOptions