const router = require("express").Router();
const fs = require('fs')
const multer = require('multer');
const { google } = require('googleapis');
const apikeys = require('../apikey.json');
const { Readable } = require('stream');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SCOPE = ['https://www.googleapis.com/auth/drive'];

router.post('/upload-file', upload.single('file'), async (req, res) => {
  // await new Promise(resolve => setTimeout(resolve, 3000));
  try {
    const authClient = await authorize();
    const fileId = await uploadFile(authClient, req.file);
    res.json({ fileId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFile(authClient, file) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const fileMetadata = {
    name: 'test.txt',
    parents: ['1X1bFupMyaaPhmBLxPH-mKvNUIAexs4me']
  };
  const media = {
    mimeType: 'text/plain',
    body: Readable.from(file.buffer)
  };

  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  });

  return uploadedFile.data.id;
}


module.exports = router;