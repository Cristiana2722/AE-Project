const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const { User } = require('./database/models');

// routes
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7778; //fallback if doesn't find key

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' });
})
// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}!`);
})