require("dotenv").config();
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/user.model")

const PORT = process.env.PORT || 5000
const app = express()
const dbURL = process.env.MONGO_URL

mongoose.connect(dbURL)
    .then(() => {
        console.log('mongoose atlas connected')
    })
    .catch((error) => {
        console.log(error);
        process.exit(1)
    });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/./views/index.html")
});

app.post("/register", async (req, res) => {

    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json(error.message)
    }
});

//authentication
//CQbG6hIiykktt2cN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user && user.password === password) {
            res.status(200).json({ status: 'valid user' })
        }
        else {
            res.status(404).json({ status: 'not valid user' })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.post("/momin", (req, res) => {
    res.status(200).json({
        message: "momin tumi account ti open korecho",
        momin: "tomar vaigo khub valo good luck",
        address: "chomohopur"
    })
})



// rout not found error
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found"
    });
});

//handling server error

app.use((err, req, res, next) => {
    res.status(500).json({
        message: "something broke"
    });
});


app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})
