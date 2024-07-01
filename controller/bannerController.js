const BannerModel = require("../model/Banner");


const createBanner = async (req, res) => {
	try {
		const newBanner = new BannerModel(req.body);
		const savedBanner = await newBanner.save()
		res.status(200).json({
			error: false, message: "Fetched", banner: savedBanner,
		});
	} catch (error) {
		res.status(500).json({
			error: true, message: "Something Went Wrong", banner: null,
		});
	}
}

const getBanners = async (req, res) => {
	try {
		const banners = await BannerModel.find()
		res.status(200).json({
			error: false, message: "Fetched", banners: banners,
		});
	} catch (error) {
		res.status(500).json({
			error: true, message: "Something Went Wrong", banners: [],
		});
	}
}

const deleteBanners = async (req, res) => {
	try {
		await BannerModel.findByIdAndDelete(req.params._id)
		res.status(200).json({
			error: false, message: "Deleted"
		});
	} catch (error) {
		res.status(500).json({
			error: true, message: "Something Went Wrong", banners: [],
		});
	}
}
const updateBanners = async (req, res) => {
	try {
		await BannerModel.findByIdAndUpdate(req.params._id, {
			...req.body
		})
		res.status(200).json({
			error: false, message: "Updated"
		});
	} catch (error) {
		res.status(500).json({
			error: true, message: "Something Went Wrong", banners: [],
		});
	}
}


module.exports = {
	createBanner,
	getBanners,
	deleteBanners,
	updateBanners
}