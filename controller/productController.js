const Product = require("../model/Product");


const getProduct = async (req, res) => {
    try {
        const product = await Product.find().populate("category");
        if (!product) {
            res.status(500).json({
                error: true, message: "Something Went Wrong", product: product,
            });
        } else {
            res.json({
                error: false, message: "All Products are Fetched Successful!", product: product,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true, message: "Something Went Wrong", product: error,
        });
    }
}


const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params._id })
        if (!product) {
            res.status(500).json({
                error: true,
                message: "Something Went Wrong",
                product: product,
            });
        } else {
            res.json({
                error: false,
                message: "Product Fetched Successful!",
                product: product,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            product: error,
        });
    }
}


const addProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body
        });
        const response = await product.save();
        if (!response) {
            res.status(500).json({ error: true, message: "Something Went Wrong", response: response })
        } else {
            res.json({ error: false, message: "Product Added Successfully", response: response })
        }

    } catch (error) {
        res.status(500).json({ error: true, message: "Something Went Wrong", response: error })
    }
}

const editProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.body._id, req.body, {
            returnOriginal: false
        });
        if (!updatedProduct) {
            res.json({
                error: true,
                message: "Something Went Wrong",
                product: updatedProduct,
            });
        } else {
            res.json({
                error: false,
                message: "Product Updated Successful!",
                product: updatedProduct,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const response = await Product.findByIdAndDelete({ _id: req.params._id });
        if (!response) {
            res.status(500).json({
                error: true,
                message: "Something Went Wrong",
                product: response,
            });
        } else {
            res.json({
                error: false,
                message: "Product Deletd Successful!",
                product: response,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Something Went Wrong",
            product: error,
        });
    }
}





module.exports = { addProduct, editProduct, getProduct, getSingleProduct, deleteProduct }