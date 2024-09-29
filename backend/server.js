const dotenv = require("dotenv");
dotenv.config();
const app = require('./app');
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
