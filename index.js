const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json({extenderd: true}))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))




async function start() {
	try {
		await mongoose.connect('mongodb+srv://admin:admin@cluster0.kfwd9.mongodb.net/todo?retryWrites=true&w=majority', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: true
		})

		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`)
		})
	} catch (err) {console.error(err);}
}
start()