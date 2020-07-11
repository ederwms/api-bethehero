const incidentService = require('../services/db_bethehero/incident.service')
const jwt = require('jsonwebtoken')

const getAllIncidents = (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const { idong } = decoded

  incidentService.index(idong)
    .then((response) => {
      return res.status(200).json({ results: response })
    })
    .catch((e) => {
      return res.status(404).json({ error: e.message })
    })
}

const createIncident = (req, res) => {
  const { title, description, value, idong } = req.body
  incidentService.create({ title, description, value, idong })
    .then((response) => {
      return res.status(201).json({
        message: 'Caso cadastrado com sucesso!',
        results: response
      })
    })
    .catch((e) => {
      return res.status(500).json({ message: e.message })
    })
}

const updateIncident = (req, res) => {
  const { id } = req.params
  const { title, description, value } = req.body

  incidentService.updateById({ id, title, description, value })
    .then((response) => {
      return res.status(200).json({
        message: 'Caso atualizado com sucesso!',
        results: response
      })
    })
    .catch((e) => {
      return res.status(404).json({ message: e.message })
    })
}

const deleteIncident = (req, res) => {
  const { id } = req.params

  incidentService.deleteById(id)
    .then((response) => {
      return res.status(200).json(response)
    })
    .catch((e) => {
      return res.status(500).json({ message: e.message })
    })
}

module.exports = {
  getAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident
}
