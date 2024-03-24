const Customer = require("../model/Customer")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const saltRounds = 10

const handleSignup = async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        const customer = new Customer({
            ...req.body, password: hashPassword
        });
        const response = await customer.save();
        if (response) {
            res.json({ error: false, message: "Your Accounted Created Successfully", response: response })

        } else {
            res.status(500).json({ error: true, message: "Something Went Wrong", response: response })
        }
    } catch (error) {
        res.status(500).json({ error: true, message: "Something Went Wrong", response: error })
    }
}

const handleSignin = async (req, res) => {
    try {
        const customer = await Customer.findOne({ email: req.body.email });
        if (!customer) {
            res.status(500).json({ error: true, message: "User Doesn't exsit", response: customer })
        } else {
            try {
                if (await bcrypt.compare(req.body.password, customer.password)) {
                    const token = jwt.sign({ role: customer.role, _id: customer._id }, process.env.SECRET_KEY)
                    res.json({ error: false, message: "You have Signin Successfully", response: token })
                } else {
                    res.status(500).json({ error: true, message: "Token Problem" })
                }
            } catch (error) {
                res.status(500).json({ error: true, message: "Something Went Wrong", response: error })
            }
        }
    } catch (error) {
        res.status(500).json({ error: true, message: "Something Went Wrong", response: error })
    }
}

const updateProfile = async (req, res) => {
    try {
        const updatedProfile = await Customer.findByIdAndUpdate(req.customer._id, req.body, {
            returnOriginal: false
        });
        if (!updatedProfile) {
            res.status(500).json({
                error: true,
                message: "Something Went Wrong",
                product: updatedProfile,
            });
        } else {
            res.json({
                error: false,
                message: "Product Updated Successful!",
                product: updatedProfile,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }

}

const getAllCustomers = async (req, res) => {
    try {
        const customer = await Customer.find();
        if (!customer) {
            res.status(500).json({
                error: true, message: "Something Went Wrong", customer: customer,
            });
        } else {
            res.json({
                error: false, message: "All customers are Fetched Successful!", customer: customer,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true, message: "Something Went Wrong", customer: error,
        });
    }
}


const getCustomer = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.customer._id }, { password: 0 })
        if (!customer) {
            res.status(500).json({
                error: true,
                message: "Something Went Wrong",
                customer: customer,
            });
        } else {
            res.json({
                error: false,
                message: "customer Fetched Successful!",
                customer: customer,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            customer: error,
        });
    }
}


module.exports = { handleSignin, handleSignup, updateProfile, getAllCustomers, getCustomer }