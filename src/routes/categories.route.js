const express = require('express')
const { createCategories, getAllCategories, deleteCategories, createSubCategory } = require('../controllers/categories.auth.controller')

const router = express.Router()

router.post('/create', createCategories)
router.get('/', getAllCategories)
router.post('/', deleteCategories)

router.post('/sub', createSubCategory)

module.exports = router;