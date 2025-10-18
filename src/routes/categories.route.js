const express = require('express')
const { createCategories } = require('../controllers/categories.auth.controller')

const router = express.Router()

router.post('/create', createCategories)

module.exports = router;