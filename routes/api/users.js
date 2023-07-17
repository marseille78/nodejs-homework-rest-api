const {Router} = require('express');
const {validateBody, authenticate} = require('../../middlewares');
const {schemas} = require('../../models/user');
const {registerUser, loginUser, getCurrentUser, logoutUser} = require('../../controllers/users');

const router = Router();

router.post('/register', validateBody(schemas.registerSchema), registerUser);

router.post('/login', validateBody(schemas.loginSchema), loginUser);

router.get('/current', authenticate, getCurrentUser);

router.post('/logout', authenticate, logoutUser);

module.exports = router;