import multer from "multer"
import path from "path"
import crypto from "crypto"
import aws from "aws-sdk"
import multerS3 from "multer-s3"
import dotenv from "dotenv"

dotenv.config()

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) {
          callback(error, "")
        }
        file.key = `${hash.toString("hex")}-${file.originalname}`

        callback(null, file.key)
      })
    },
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: "uploadexamplexander",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, callback) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) {
          callback(error, "")
        }
        const fileName = `${hash.toString("hex")}-${file.originalname}`

        callback(null, fileName)
      })
    },
  })
}

export default {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ]

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true)
    }
    else {
      callback(new Error("Invalid file type."))
    }
  }
}
