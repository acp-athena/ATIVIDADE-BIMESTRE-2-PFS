const express = require('express');
const PedidoController = require('../controllers/pedidoController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const pedidoRouter = express.Router();

let ctrl = new PedidoController();
let auth = new AuthMiddleware();
pedidoRouter.post('/gravar', ctrl.gravar);
pedidoRouter.get('/listar', auth.verificarUsuarioLogado, ctrl.listar);
pedidoRouter.get('/filtrar/:termo/:filtro', auth.verificarUsuarioLogado, ctrl.filtrar);

module.exports = pedidoRouter;