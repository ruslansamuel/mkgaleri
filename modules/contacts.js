const { rejects } = require("assert");
const { resolve } = require("path");
const fs = require("fs");

// Buat Folder
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Buat file
const filePath = dirPath + "/contacts.json";
const fileEncode = "utf-8";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", fileEncode);
}

const loadContacts = () => {
  const fileBuffer = fs.readFileSync(filePath, fileEncode);
  const contacts = JSON.parse(fileBuffer);

  return contacts;
};

const findContact = (id) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact) => contact.id === id);
  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync(filePath, JSON.stringify(contacts));
};

const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

const updateContacts = (newContact) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== newContact.id
  );
  delete newContact.namalama;
  delete newContact.nohplama;
  delete newContact.emaillama;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

const deleteContact = (id) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.id !== id);
  saveContacts(filteredContacts);
};

const removeContacts = () => {
  saveContacts([]);
};

const cekDblNama = (nama) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.nama === nama);
};

const cekDblNohp = (nohp) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.nohp === nohp);
};

const cekDblEmail = (email) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.email === email);
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  updateContacts,
  deleteContact,
  removeContacts,
  cekDblNama,
  cekDblNohp,
  cekDblEmail,
};
