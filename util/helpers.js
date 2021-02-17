const nodeMailer = require('nodemailer')
const multer = require('multer')

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
})

exports.sendMail = (to, subject = '', html = '') =>
  transporter.sendMail({
    to,
    from: '',
    subject,
    html,
  })

const fileStorage = multer.diskStorage({
  destination: (_, _2, cb) => {
    cb(null, './uploads')
  },
  filename: (_, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname.replace(/ /g, ''))
  },
})

const filterFiles = (_, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

exports.fileSystem = {
  fileStorage,
  filterFiles,
}
