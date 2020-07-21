const express = require('express')
const routes = express.Router()
const multer = require('multer')
const multerConfig = require('../../config/multer')

const version = 'v1'

const authMiddleware = require('../../middleware/auth')

const SessionController = require('../../controllers/session.controller')
const OngController = require('../../controllers/ong.controller')
const IncidentController = require('../../controllers/incident.controller')
const FileController = require('../../controllers/file.controller')

// Rotas de sessão
routes.post(`/api/${version}/session`, SessionController.authenticate)
routes.post(`/api/${version}/revalidate`, SessionController.revalidateForAuthentication)

// Rotas de ONG
routes.get(`/api/${version}/ongs`, OngController.getOngs)
routes.post(`/api/${version}/ongs`, OngController.createOng)

routes.use(authMiddleware)

// Rotas de Incidentes
routes.get(`/api/${version}/incidents`, IncidentController.getAllIncidents)
routes.post(`/api/${version}/incidents`, IncidentController.createIncident)
routes.delete(`/api/${version}/incidents/:id`, IncidentController.deleteIncident)
routes.put(`/api/${version}/incidents/:id`, IncidentController.updateIncident)

// Rotas de Arquivos
routes.post(`/api/${version}/files`, multer(multerConfig).single('image'), FileController.createFile)
routes.delete(`/api/${version}/files/:id`, FileController.deleteFile)

module.exports = routes
