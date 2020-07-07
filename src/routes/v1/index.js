const express = require('express')
const routes = express.Router()

const version = 'v1'

const authMiddleware = require('../../middleware/auth')

const SessionController = require('../../controllers/session.controller')
const OngController = require('../../controllers/ong.controller')
const IncidentController = require('../../controllers/incident.controller')

// Rotas de sessão
routes.post(`/api/${version}/session`, SessionController.authenticate)

// Rotas de ONG
routes.get(`/api/${version}/ongs`, OngController.getOngs)
routes.post(`/api/${version}/ongs`, OngController.createOng)

routes.use(authMiddleware)

// Rotas de Incidentes
routes.get(`/api/${version}/incidents`, IncidentController.getAllIncidents)
routes.post(`/api/${version}/incidents`, IncidentController.createIncident)
routes.delete(`/api/${version}/incidents/:id`, IncidentController.deleteIncident)
routes.put(`/api/${version}/incidents/:id`, IncidentController.updateIncident)

module.exports = routes
