const ongService = require('../services/db_bethehero/ong.service')

const getOngs = (req, res) => {
  ongService.index()
    .then((response) => {
      return res.status(200).json({ results: response })
    })
    .catch((e) => {
      return res.status(404).json({ error: e })
    })
}

const createOng = async (req, res) => {
  const { name, email, whatsapp, city, uf } = req.body

  ongService.create({ name, email, whatsapp, city, uf })
    .then((response) => {

      return res.status(201).json({
        message: 'ONG cadastrada com sucesso!',
        id: response.idong
      })
    })
    .catch((e) => {
      console.log(e)
      return res.status(200).json({ message: e.message })
    })
}

module.exports = {
  getOngs,
  createOng
}
