const Category = require("../model/Category");


const getcategory = async (req, res) => {
    try {
        const category = await Category.find();
        if (!category) {
            res.status(500).json({
                error: true, message: "Something Went Wrong", category: category,
            });
        } else {
            res.json({
                error: false, message: "All categorys are Fetched Successful!", category: category,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true, message: "Something Went Wrong", category: error,
        });
    }
}


const addCategory = async (req, res) => {
    try {
        const isPresent = await Category.findOne({ category_name: req.body.category_name })
        if (isPresent) {
            res.status(500).json({ error: true, message: "Category Already Exist" })
        } else {
            const category = new Category(
                req.body
            )
            const response = await category.save();
            // const allCategory = await Category.find()
            if (!response) {
                res.status(500).json({ error: true, message: "Something Went Wrong", response: response })
            } else {

                res.json({ error: false, message: "Category Created Successfully", response: response })
            }
        }

    } catch (error) {
        res.status(500).json({ error: true, message: "Something Went Wrong", response: error })

    }

}

const editCategory = async (req, res) => {
    console.log(req.body)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.body._id, { category_name: req.body.category_name }, {
            returnOriginal: false
        });
        if (!updatedCategory) {
            res.status(500).json({
                error: true,
                message: "Something Went Wrong",
            });
        } else {
            res.json({
                error: false,
                message: "Category Updated Successful!",
                category: updatedCategory,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

module.exports = { addCategory, editCategory, getcategory }