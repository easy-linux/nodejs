const express = require("express");
const path = require("path");
const multiparty = require("connect-multiparty");
const middleware = multiparty();

const fs = require("fs");

const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/main.html"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./css/styles.css"));
});

app.get("/user/:userId", (req, res) => {
  res.send(`userId = ${req.params.userId}`);
});

app.get("/data", (req, res) => {
  res.json(req.query);
});

app.get("/images/pages/page1.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/withImage.html"));
});

app.get("/imageURL.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./img/img.jpg"));
});

app.get("/video.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/video.html"));
});

app.get("/uploadform.php", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/form.html"));
});

app.post("/handleForm", middleware, (req, res) => {
  console.log(req.files);
  fs.copyFileSync(req.files.file.path, path.join(__dirname, "./upload/" + req.files.file.originalFilename));
  fs.unlink(req.files.file.path, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <img width="300" src="/image.png?name=${req.files.file.originalFilename}" />
</body>
</html>
    `);
});

app.get("/image.png", (req, res) => {
  if (req.query.name) {
    res.sendFile(path.join(__dirname, `./upload/${req.query.name}`));
  } else {
    res.send(`I can't see any file name...`);
  }
});

app.listen(port, () => {
  console.log(`App is working on ${port} port`);
});
