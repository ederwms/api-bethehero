const ongService = require('../services/db_bethehero/ong.service')
const jwt = require('jsonwebtoken')

const authenticate = (req, res) => {
  const { idong } = req.body

  ongService.findForAuthentication(idong)
    .then((response) => {
      const { idong, name, email, whatsapp, city, uf } = response
      const token = jwt.sign(
        { idong, name, email, whatsapp, city, uf },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION_TIME
        }
      )

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        token
      })
    })
    .catch((e) => {
      return res.status(401).json({ message: e.message })
    })
}

const revalidateForAuthentication = (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    ignoreExpiration: true
  })

  const { idong } = decoded

  ongService.findForAuthentication(idong)
    .then((response) => {
      const { idong, name, email, whatsapp, city, uf } = response
      const token = jwt.sign(
        { idong, name, email, whatsapp, city, uf },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION_TIME
        }
      )

      return res.status(200).json({ token })
    })
    .catch(() => {
      return res.status(401).json({
        message: 'Não foi possível revalidar. ONG não encontrada.'
      })
    })
}

module.exports = {
  authenticate,
  revalidateForAuthentication
}
