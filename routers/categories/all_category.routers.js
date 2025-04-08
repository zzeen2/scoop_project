const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/categoryController');

// 전체 동호회 보기
router.get('/', categoryCtrl.getAllCategories);

// 세부 카테고리 보기
router.get('/:categoryName', categoryCtrl.getDetailCategory);

module.exports = router;