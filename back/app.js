const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const util = requrie("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("./s3");
app.use(cors());
app.use(express.json());

http.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file;

  const result = await uploadFile(file);
  await unlinkFile(file.path);

  res.send({ imagePath: `$/images/${result.Key}` });
});

app.get("/images/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});
