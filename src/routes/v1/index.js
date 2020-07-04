const express = require('express')
const routes = express.Router()

const version = 'v1'

const SessionController = require('../../controllers/session.controller')
const OngController = require('../../controllers/ong.controller')
const IncidentController = require('../../controllers/incident.controller')

// Rotas de sessão
routes.get(`/api/${version}/session`, SessionController.login)

// Rotas de ONG
routes.post(`/api/${version}/ongs`, OngController.ong)

// Rotas de Incidentes
routes.get(`/api/${version}/incidents`, IncidentController.incident)

module.exports = routes
