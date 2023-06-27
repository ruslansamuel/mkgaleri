const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const {
  loadContacts,
  findContact,
  addContact,
  updateContacts,
  deleteContact,
  removeContacts,
  cekDblNama,
  cekDblNohp,
  cekDblEmail,
} = require("./modules/contacts.js");
const {
  dataTahun,
  cariTahun,
  tambahTahun,
  ubahTahun,
  hapusTahun,
  hapusSemuaTahun,
  cekDblTahun,
} = require("./modules/kas.js");
const app = express();
const port = 3000;

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));

// Flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  const contacts = loadContacts();
  res.render("index", {
    layout: "layouts/main-layouts",
    judul: "Beranda",
    contacts,
  });
});

// KONTAK
app.get("/kontak", (req, res) => {
  const contacts = loadContacts();
  res.render("kontak/index", {
    layout: "layouts/main-layouts",
    judul: "Kontak",
    contacts,
    info: req.flash("info"),
  });
});

app.post(
  "/kontak",
  [
    body("nama").custom((value) => {
      const duplikat = cekDblNama(value);
      if (duplikat) {
        throw new Error("Nama sudah ada!");
      }
      return true;
    }),
    check("nohp", "No. HP / WA tidak valid!").isMobilePhone("id-ID"),
    body("nohp").custom((value) => {
      const duplikat = cekDblNohp(value);
      if (duplikat) {
        throw new Error("No. HP / WA sudah ada!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    body("email").custom((value) => {
      const duplikat = cekDblEmail(value);
      if (duplikat) {
        throw new Error("Email sudah ada!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const contacts = loadContacts();
      res.render("kontak/index", {
        layout: "layouts/main-layouts",
        judul: "Kontak",
        contacts,
        info: [],
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash("info", "Kontak telah ditambahkan");
      res.redirect("/kontak");
    }
  }
);

app.get("/kontak/hapus/:id", (req, res) => {
  const contact = findContact(req.params.id);
  if (!contact) {
    res.redirect("/kontak");
  } else {
    deleteContact(req.params.id);
    req.flash("info", "Kontak telah dihapus");
    res.redirect("/kontak");
  }
});

app.get("/kontak/remove", (req, res) => {
  removeContacts();
  req.flash("info", "Semua kontak telah dihapus");
  res.redirect("/kontak");
});

app.post(
  "/kontak/:id",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDblNama(value);
      if (value !== req.body.namalama && duplikat) {
        throw new Error("Nama sudah ada!");
      }
      return true;
    }),
    check("nohp", "No. HP / WA tidak valid!").isMobilePhone("id-ID"),
    body("nohp").custom((value, { req }) => {
      const duplikat = cekDblNohp(value);
      if (value !== req.body.nohplama && duplikat) {
        throw new Error("No. HP / WA sudah ada!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    body("email").custom((value, { req }) => {
      const duplikat = cekDblEmail(value);
      if (value !== req.body.emaillama && duplikat) {
        throw new Error("Email sudah ada!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const contact = findContact(req.params.id);
      res.render("kontak/detail", {
        layout: "layouts/main-layouts",
        judul: "Kontak",
        contact,
        info: [],
        errors: errors.array(),
      });
    } else {
      updateContacts(req.body);
      req.flash("info", "Kontak telah diubah");
      res.redirect("/kontak/" + req.params.id);
    }
  }
);

app.get("/kontak/:id", (req, res) => {
  const contact = findContact(req.params.id);
  res.render("kontak/detail", {
    layout: "layouts/main-layouts",
    judul: "Kontak",
    contact,
    info: req.flash("info"),
  });
});
// AKHIR KONTAK

// KAS
app.get("/kas", (req, res) => {
  const kasTahun = dataTahun();
  res.render("kas/index", {
    layout: "layouts/main-layouts",
    judul: "Uang Kas",
    kasTahun,
    info: req.flash("info"),
  });
});

app.post(
  "/kas",
  [
    body("tahun").custom((value) => {
      const duplikat = cekDblTahun(value);
      if (duplikat) {
        throw new Error("Tahun Kas sudah ada!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const kasTahun = dataTahun();
      res.render("kas/index", {
        layout: "layouts/main-layouts",
        judul: "Uang Kas",
        kasTahun,
        info: [],
        errors: errors.array(),
      });
    } else {
      tambahTahun(req.body);
      req.flash("info", "Tahun Kas telah ditambahkan");
      res.redirect("/kas");
    }
  }
);

app.get("/kontak/hapus/:id", (req, res) => {
  const contact = findContact(req.params.id);
  if (!contact) {
    res.redirect("/kontak");
  } else {
    deleteContact(req.params.id);
    req.flash("info", "Kontak telah dihapus");
    res.redirect("/kontak");
  }
});

app.get("/kas/remove", (req, res) => {
  hapusSemuaTahun();
  req.flash("info", "Semua tahun kas telah dihapus");
  res.redirect("/kas");
});

app.post(
  "/kontak/:id",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDblNama(value);
      if (value !== req.body.namalama && duplikat) {
        throw new Error("Nama sudah ada!");
      }
      return true;
    }),
    check("nohp", "No. HP / WA tidak valid!").isMobilePhone("id-ID"),
    body("nohp").custom((value, { req }) => {
      const duplikat = cekDblNohp(value);
      if (value !== req.body.nohplama && duplikat) {
        throw new Error("No. HP / WA sudah ada!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    body("email").custom((value, { req }) => {
      const duplikat = cekDblEmail(value);
      if (value !== req.body.emaillama && duplikat) {
        throw new Error("Email sudah ada!");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const contact = findContact(req.params.id);
      res.render("kontak/detail", {
        layout: "layouts/main-layouts",
        judul: "Kontak",
        contact,
        info: [],
        errors: errors.array(),
      });
    } else {
      updateContacts(req.body);
      req.flash("info", "Kontak telah diubah");
      res.redirect("/kontak/" + req.params.id);
    }
  }
);

app.get("/kas/:id", (req, res) => {
  const kasTahun = cariTahun(req.params.id);
  res.render("kas/detail", {
    layout: "layouts/main-layouts",
    judul: "Uang Kas",
    kasTahun,
    info: req.flash("info"),
  });
});
// AKHIR KAS

app.use("/", (req, res) => {
  res.status(404);
  res.render("404", {
    layout: "layouts/clean-layouts",
    judul: "404 File Not Found!",
  });
});

app.listen(port, () => {
  console.log(`Server app listening @ http://localhost:${port}`);
});
