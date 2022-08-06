import mongoose from "mongoose"
import aws from 'aws-sdk'
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { promisify } from "util"

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

dotenv.config()

const s3 = new aws.S3()

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

PostSchema.pre("save", function() {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`
  }
})

PostSchema.pre("deleteOne", { document: true }, function() {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: this.key
    }).promise()
  }
  else {
    return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key))
  }
})

export default mongoose.model("Post", PostSchema)
