const fs = require('fs');
const uploadFile = require('../utils/upload');

const baseUrl = 'http://localhost:3000/files/';

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).json({ message: 'please upload a file' });
    }
    res.status(200).json({
      message: `uploaded the file successfully ${req.file.originalname}`,
    });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(500)
        .json({ message: 'file size cannot be larger than 2MB' });
    }

    res.status(500).json({ message: `could not upload the file` });
  }

  return null;
};

const getListFiles = (req, res) => {
  const directoryPath = `${__basedir}/resources/static/assets/uploads`;
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).json({ message: 'unable to scan files!' });
    }

    const fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).json(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = `${__basedir}/resources/static/assets/uploads/`;
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).json({ message: `could not download the file ${err}` });
    }
  });
};

module.exports = { upload, getListFiles, download };
