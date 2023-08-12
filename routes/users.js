const router = require('express').Router();
const { updateProfileValidator } = require('../validators/users');
const { getCurrentUser, updateProfile } = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', updateProfileValidator, updateProfile);

module.exports = router;
