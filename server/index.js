// doteve require so its available inside the process.env
require('dotenv').config();

const PORT =  4000;

const app = require("./app");

// run the server 
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})
