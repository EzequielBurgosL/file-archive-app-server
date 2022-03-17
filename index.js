const express = require('express');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(fileupload());
app.use(express.static('files'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const FILES_PATH = __dirname + '/files/';

app.post('/upload', (req, res) => {
  const file = req.files.file;
  const filename = file.name;
  const filePath = `${FILES_PATH}${filename}`;

  file.mv(filePath, (err) => {
    console.log('Saved new file: ', filePath);

    if (err) {
      res.send({ message: 'File upload failed', code: 200 });
    } else {
      res.send({ message: 'File Uploaded', code: 200 });
    }
  });
});

app.get('/get', (req, res) => {
  const fileNames = fs.readdirSync(FILES_PATH);
  const data = [];

  fileNames.forEach(fileName => {
    const stats = fs.statSync(`${FILES_PATH}${fileName}`);
    const [name, extension] = fileName.split('.') || '';

    const fileData = {
      dateCreation: stats.birthtime,
      dateLastModification: stats.mtime,
      fileName,
      extension,
      name
    };

    data.push(fileData);
    console.log('fileData: ', fileData);
  });

  res.send(data);
});

app.post('/delete', (req, res) => {
  const fileName = req.body && req.body.fileName;

  if (fileName) {
    fs.unlinkSync(`${FILES_PATH}${fileName}`)
    res.send({ message: 'File removed', code: 200 });
  } else {
    res.send({ message: 'Could not remove file', code: 200 });
  }
});

app.listen(4000, () => {
  console.log('Server running successfully on 4000');
});