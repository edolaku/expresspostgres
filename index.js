import express from "express";
import "dotenv/config.js"
import cors from "cors";
import cookieParser from 'cookie-parser';
import registerRouter from "./routes/register.js";
import { notFound } from "./controllers/notFound.js";
import authRouter from "./routes/auth.js"
import usersRouter from "./routes/users.js"
import pegawaiRouter from "./routes/pegawai.js"
import { verifyJWT } from "./middleware/verifyJWT.js";
import { PrismaClient } from '@prisma/client';
import { credentials } from "./middleware/credentials.js";
import corsOptions from "./config/corsOptions.js";
import refreshTokenRouter from "./routes/refreshTokenRouter.js";
import logoutRouter from "./routes/logout.js";

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient()


const app = express();


// meggunakan cors yg sudah disetting
// ambil cookies credentials
app.use(credentials);

app.use(cors(corsOptions))
app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());
app.use(cookieParser());


app.use("/reg", registerRouter)
app.use("/auth", authRouter)
app.use("/logout", logoutRouter)
app.use("/refresh", refreshTokenRouter)
app.use(verifyJWT)
app.use('/pgw', pegawaiRouter)
app.use("/users", usersRouter)

// 404 handling
// jika api yg dihit selain api diatas, maka akan diarahkan ke 404
app.all('*', notFound)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))