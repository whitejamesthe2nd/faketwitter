const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the express-sequelize-starter!");
    res.json({
        message: "test tweet index"
    })
});




module.exports = router
