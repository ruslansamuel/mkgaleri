const { rejects } = require("assert");
const { resolve } = require("path");
const fs = require("fs");

// Buat Folder
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Buat file
const fileEncode = "utf-8";
const filePathKas = dirPath + "/kas.json";
if (!fs.existsSync(filePathKas)) {
  fs.writeFileSync(filePathKas, "[]", fileEncode);
}

const filePathBulan = dirPath + "/kas-bulan.json";
if (!fs.existsSync(filePathBulan)) {
  fs.writeFileSync(filePathBulan, "[]", fileEncode);
}

const filePathTahun = dirPath + "/kas-tahun.json";
if (!fs.existsSync(filePathTahun)) {
  fs.writeFileSync(filePathTahun, "[]", fileEncode);
}

const dataTahun = () => {
  const fileBufferTahun = fs.readFileSync(filePathTahun, fileEncode);
  const dataKasTahun = JSON.parse(fileBufferTahun);

  return dataKasTahun;
};

const cariTahun = (id) => {
  const kasTahun = dataTahun();
  const kt = kasTahun.find((kt) => kt.id === id);
  return kt;
};

const simpanTahun = (kasTahun) => {
  fs.writeFileSync(filePathTahun, JSON.stringify(kasTahun));
};

const tambahTahun = (kt) => {
  const kasTahun = dataTahun();
  kasTahun.push(kt);
  simpanTahun(kasTahun);
};

const ubahTahun = (kasTahunBaru) => {
  const kasTahun = dataTahun();
  const filteredTahun = kasTahun.filter((kt) => kt.id !== kasTahunBaru.id);
  filteredTahun.push(kasTahunBaru);
  simpanTahun(filteredTahun);
};

const hapusTahun = (id) => {
  const kasTahun = dataTahun();
  const filteredTahun = kasTahun.filter((kt) => kt.id !== id);
  simpanTahun(filteredTahun);
};

const hapusSemuaTahun = () => {
  simpanTahun([]);
};

const cekDblTahun = (tahun) => {
  const kasTahun = dataTahun();
  return kasTahun.find((kt) => kt.tahun === tahun);
};

module.exports = {
  dataTahun,
  cariTahun,
  tambahTahun,
  ubahTahun,
  hapusTahun,
  hapusSemuaTahun,
  cekDblTahun,
};
