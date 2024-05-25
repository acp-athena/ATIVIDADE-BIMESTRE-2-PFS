const express = require('express');
const VitrineController = require('../controllers/vitrineController');

const router = express.Router();

let controller = new VitrineController();
router.get("/", controller.vitrineView);

module.exports = router;