const {Router} = require('express');
const router = Router();
const User = require ('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/registration', 
[
	check('email', 'El correo electrónico está incorecto.').isEmail(),
	check('password', 'La contraseña está incorecta.').isLength({ min: 6 })
] , 
async (req, res) => {
	try {

		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Dentro el registro los datos son incorrectos.'
			})
		}

		const { email, password } = req.body

		const isUsed = await User.findOne({ email })

		if(isUsed) {
			return res.status(300).json({message: 'Este correo electrónico ya está registrado, prueba el otro.'})
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = new User ({
			email, password: hashedPassword
		})

		await user.save()

		res.status(201).json({message: 'El usuario está creado.'})

	} catch (error) {
		console.log(error)
	}
})

router.post('/login', 
[
	check('email', 'El correo electrónico es incorecto.').isEmail(),
	check('password', 'La contraseña está incorecta.').exists()
] , 
async (req, res) => {
	try {

		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Dentro el registro los datos son incorrectos.'
			})
		}

		const { email, password } = req.body

		const user = await User.findOne({email})

		if(!user) {
			return res.status(400).json({message: 'En la base de datos no existe este correo electrónico.'})
		}

		const isMatch = bcrypt.compare(password, user.password)

		if(!isMatch) {
			return res.status(400).json({message: 'La contarseña no coincide.'})
		}

		const jwtSecret = 'sdhfshdkjksjfgkj656457svsfbkjgh576457skjhj4745shdjb457457vksfjsl'

		const token = jwt.sign(
			{userId: user.id},
			jwtSecret,
			{expiresIn: '1h'} 
			)

			res.json({token, userId: user.id})

	} catch (error) {
		console.log(error)
	}
})

module.exports = router;