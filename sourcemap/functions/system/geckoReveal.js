const forge = require("node-forge");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");

function pbesDecrypt(decodedItemSeq, password, globalSalt) {
  if (decodedItemSeq[0].value[1].value[0].value[1].value != null) {
    return pbes2Decrypt(decodedItemSeq, password, globalSalt);
  }
  return pbes1Decrypt(decodedItemSeq, password, globalSalt);
}

function pbes1Decrypt(decodedItemSeq, password, globalSalt) {
  const data = decodedItemSeq[1].value;
  const salt = decodedItemSeq[0].value[1].value[0].value;
  const hp = sha1(globalSalt + password);
  const pes = toByteString(pad([...salt], 20).buffer);
  const chp = sha1(hp + salt);
  const k1 = hmac(pes + salt, chp);
  const tk = hmac(pes, chp);
  const k2 = hmac(tk + salt, chp);
  const k = k1 + k2;
  const kBuffer = forge.util.createBuffer(k);
  const otherLength = kBuffer.length() - 32;
  const key = kBuffer.getBytes(24);
  kBuffer.getBytes(otherLength);
  const iv = kBuffer.getBytes(8);
  return decrypt(data, iv, key, "3DES-CBC");
}

function pbes2Decrypt(decodedItemSeq, password, globalSalt) {
  const data = decodedItemSeq[1].value;
  const pbkdf2Seq = decodedItemSeq[0].value[1].value[0].value[1].value;
  const salt = pbkdf2Seq[0].value;
  const iterations = pbkdf2Seq[1].value.charCodeAt();
  const iv = "" + decodedItemSeq[0].value[1].value[1].value[1].value;
  const k = sha1(globalSalt + password);
  const key = forge.pkcs5.pbkdf2(k, salt, iterations, 32, forge.md.sha256.create());
  return decrypt(data, iv, key, "AES-CBC");
}

function decrypt(data, iv, key, algorithm) {
  const decipher = forge.cipher.createDecipher(algorithm, key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(data));
  decipher.finish();
  return decipher.output;
}

function sha1(data) {
  const md = forge.md.sha1.create();
  md.update(data, "raw");
  return md.digest().data;
}

function pad(arr, length) {
  if (arr.length >= length) {
    return arr;
  }
  const padAmount = length - arr.length;
  const padArr = [];
  for (let i = 0; i < padAmount; i++) {
    padArr.push(0);
  }

  var newArr = new Uint8Array(padArr.length + arr.length);
  newArr.set(padArr, 0);
  newArr.set(arr, padArr.length);
  return newArr;
}

function hmac(data, key) {
  const hmac = forge.hmac.create();
  hmac.start("sha1", key);
  hmac.update(data, "raw");
  return hmac.digest().data;
}

function toByteString(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function formatBytes(a, b) {
  let c = 1024;
  let d = b || 2;
  let e = [" B", " KB", " MB", " GB", " TB"];
  let f = Math.floor(Math.log(a) / Math.log(c));

  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + "" + e[f];
}

async function getKey(profileDirectory, masterPassword) {
  const key4FilePath = path.join(profileDirectory, "key4.db");
  if (!fs.existsSync(key4FilePath)) return null;

  const masterPasswordBytes = forge.util.encodeUtf8(masterPassword || "");
  const key4Db = new sqlite3.Database(key4FilePath, (err) => {
    if (err) console.log(err);
  });

  const key = new Promise((resolve) => {
    key4Db.each("SELECT item1, item2 FROM metadata WHERE id = 'password';", function (err, metaData) {
      if (err) {
      }

      if (metaData && metaData.item1 && metaData.item2) {
        const globalSalt = toByteString(metaData.item1);
        const item2 = toByteString(metaData.item2);
        const item2Asn1 = forge.asn1.fromDer(item2);
        const item2Value = pbesDecrypt(item2Asn1.value, masterPasswordBytes, globalSalt);

        if (item2Value && item2Value.data === "password-check") {
          key4Db.each("SELECT a11 FROM nssPrivate WHERE a11 IS NOT NULL;", function (err, nssData) {
            if (err) {
            }

            if (nssData && nssData.a11) {
              const a11 = toByteString(nssData.a11);
              const a11Asn1 = forge.asn1.fromDer(a11);

              resolve(pbesDecrypt(a11Asn1.value, masterPasswordBytes, globalSalt));
            }
          });
        }
      }
    });
  });

  return key;
}

function decodeLoginData(b64) {
  const asn1 = forge.asn1.fromDer(forge.util.decode64(b64));
  return {
    iv: asn1.value[1].value[1].value,
    data: asn1.value[2].value,
  };
}

module.exports = { getKey, decodeLoginData, decrypt };
