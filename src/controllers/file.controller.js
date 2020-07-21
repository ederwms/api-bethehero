const fileService = require('../services/db_bethehero/file.service')

const createFile = (req, res) => {
  const { originalname: name, size, key, location: url } = req.file

  fileService.create({ name, size, key, url })
    .then((response) => {
      return res.status(200).json({
        message: 'Imagem enviada com sucesso!',
        file: response
      })
    })
    .catch((e) => {
      return res.status(500).json({
        message: 'Não foi possível fazer o upload do arquivo.'
      })
    })
}

const deleteFile = (req, res) => {
  const { id } = req.params

  fileService.deleteById(id)
    .then((response) => {
      return res.status(200).json(response)
    })
    .catch((e) => {
      return res.status(500).json({ message: e.message })
    })
}

module.exports = {
  createFile,
  deleteFile
}
