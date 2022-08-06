import express from "express"
import morgan from "morgan"
import mongoose from "mongoose"
import path from "path"
import dotenv from "dotenv"

import * as url from "url"
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

import routes from "./routes.js"

dotenv.config()

const app = express()

/**
 * Database setup
 */
mongoose.connect(process.env.MONGO_URL)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")))

app.use(routes)

app.listen(3333, () => console.log("Server running on port", 3333))
