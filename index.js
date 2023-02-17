const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const chunkSize = 5 * 1024 * 1024; // 5 MB

app.get('/video', async (req, res) => {
  const videoPath = path.join(__dirname, './video1.mp4');
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = (end - start) + 1;
    const file =  fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);

    let start = 0;
    let end = chunkSize - 1;

    const sendChunk = () => {
      if (start >= fileSize) {
        return;
      }

      if (end >= fileSize) {
        end = fileSize - 1;
      }

      const chunk = fs.createReadStream(videoPath, { start, end });
      chunk.pipe(res, { end: false });
      chunk.on("end", () => {
        start = end + 1;
        end = start + chunkSize - 1;
        sendChunk();
      });
    };

    sendChunk();
  }
});

app.listen(port, () => {
  console.log(`Video streaming server is listening on port ${port}`);
});
