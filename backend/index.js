const { app } = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const startApp = async () => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT} port`);
    });
};

startApp();