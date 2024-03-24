const Admin = require("../model/Admin")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const saltRounds = 10

const registerAdmin = async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        const admin = new Admin({
            ...req.body, password: hashPassword
        });
        const response = await admin.save();
        if (response) {
            res.json({ error: false, message: "Admin Created Successfully", response: response })

        } else {
            res.json({ error: true, message: "Something Went Wrong", response: response })
        }
    } catch (error) {
        res.json({ error: true, message: "Something Went Wrong", response: error })
    }
}

const signinAdmin = async (req, res) => {
    try {
        const user = await Admin.findOne({ email: req.body.email });
        if (!user) {
            res.json({ error: true, message: "User Doesn't exsit", response: user })
        } else {
            try {
                if (await bcrypt.compare(req.body.password, user.password)) {
                    const token = jwt.sign({ role: user.role }, process.env.SECRET_KEY)
                    res.json({ error: false, message: "Admin Signin Successfully", response: token })
                } else {
                    res.json({ error: true, message: "Something Went Wrong" })
                }
            } catch (error) {
                res.json({ error: true, message: "Something Went Wrong", response: error })
            }
        }
    } catch (error) {
        res.json({ error: true, message: "Something Went Wrong", response: error })
    }
}


module.exports = { registerAdmin, signinAdmin }