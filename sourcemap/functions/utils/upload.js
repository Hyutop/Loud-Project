const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function uploadFile(filePath) {
  const url = "https://bashupload.com/";

  const formData = new FormData();
  formData.append("file_1", fs.createReadStream(filePath));

  try {
    const response = await axios.post(url, formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.status === 200 && response.data) {
      const match = response.data.match(/https:\/\/bashupload\.com\/[^\/]+\/([^\/\s]+\.\w+)/);
      if (match && match[0]) {
        return match[0] + "?download=1";
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function upload(filePath) {
  try {
    let link = await uploadFile(filePath);
    return link;
  } catch (error) {
  }
}

module.exports = upload;