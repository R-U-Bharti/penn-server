const express = require('express')
const { createCategories, getAllCategories, deleteCategories } = require('../controllers/categories.auth.controller')

const router = express.Router()

router.post('/create', createCategories)
router.get('/', getAllCategories)
router.post('/', deleteCategories)
router.post('/create/:id', deleteCategories)

module.exports = router;