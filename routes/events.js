const { Router } = require('express')
const { check } = require('express-validator')
const { getEventos, createEvento, updateEvento, deleteEvento } = require('../controllers/events')
const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar.jwt')
const router = Router()

// Para que todas las rutas tengan el middleware de validación del JWT
router.use(validarJWT)

// Endpoints

router.get('/', getEventos)

router.post('/',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
], createEvento)

router.put('/:id',[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
], updateEvento)

router.delete('/:id', deleteEvento)

module.exports = router