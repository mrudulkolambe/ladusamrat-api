const { v4: uuidv4 } = require('uuid');
const uniqid = require("uniqid");
const axios = require("axios");
const sha256 = require("sha256");
const Customer = require('../model/Customer');
const Order = require('../model/Order');



const createOrder = async (req, res) => {
	try {
		let data = {
			"email": process.env.DASHBOARD_USER_EMAIL,
			"password": process.env.DASHBOARD_USER_PASSWORD
		};

		axios('https://apiv2.shiprocket.in/v1/external/auth/login', {
			method: "POST",
			data: data,
		})
			.then(async (authResponse) => {
				const user = await Customer.findById(req.customer._id);
				if (user) {
					let dateObj = new Date();
					let orderID = uuidv4()

					let date = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`
					let order = {
						"order_id": orderID,
						"order_date": date,
						"comment": user._id,
						"pickup_location": "Primary",
						"billing_customer_name": req.body.name,
						"billing_address": req.body.billing_address,
						"billing_city": req.body.billing_city,
						"billing_pincode": req.body.billing_pincode,
						"billing_state": req.body.billing_state,
						"billing_country": "india",
						"billing_email": req.body.billing_email,
						"billing_phone": req.body.billing_phone,
						"billing_alternate_phone": req.body.billing_alternate_phone,
						"shipping_is_billing": true,
						"order_items": req.body.order_items,
						"payment_method": "cod",
						"shipping_charges": "30",
						"sub_total": req.body.sub_total,
						"length": "25",
						"breadth": "25",
						"height": "8",
						"weight": req.body.weight,
						"invoice_number": orderID,
						"order_type": "ESSENTIALS",
						"billing_last_name": "",
					}

					axios('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
						method: "POST",
						data: order,
						maxBodyLength: Infinity,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${authResponse.data.token}`
						},
					})
						.then((response) => {
							return res.status(200).json({
								error: false,
								message: "Order placed Successfully",
								data: order
							});
						})
						.catch((error) => {
							return res.status(500).json({
								error: true,
								message: error,
								data: order
							});
						});

				} else {
					return res.status(403).json({
						error: true,
						message: "Unauthorized",
						customer: undefined,
					});
				}
			})
			.catch((error) => {
				return res.status(500).json({
					error: true,
					message: error.message,
					data: ""
				});
			});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: error,
			customer: "",
		});
	}
}

const createPrepaidOrder = async (req, res) => {
	try {
		let dateObj = new Date();
		let orderID = uuidv4()
		const user = await Customer.findById(req.customer._id);
		let date = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`
		let order = {
			"order_id": orderID,
			"order_date": date,
			"comment": user._id,
			"pickup_location": "Primary",
			"billing_customer_name": req.body.name,
			"billing_address": req.body.billing_address,
			"billing_city": req.body.billing_city,
			"billing_pincode": req.body.billing_pincode,
			"billing_state": req.body.billing_state,
			"billing_country": "india",
			"billing_email": req.body.billing_email,
			"billing_phone": req.body.billing_phone,
			"billing_alternate_phone": req.body.billing_alternate_phone,
			"shipping_is_billing": true,
			"order_items": req.body.order_items,
			"payment_method": "prepaid",
			"shipping_charges": "30",
			"sub_total": req.body.sub_total,
			"length": "25",
			"breadth": "25",
			"height": "8",
			"weight": req.body.weight,
			"invoice_number": orderID,
			"order_type": "ESSENTIALS",
			"billing_last_name": "",
		}

		let orderData = JSON.stringify(order);
		const dbOrder = new Order({
			customer: req.customer._id,
			orderID: orderID,
			data: orderData
		})
		const savedOrder = await dbOrder.save();

		if (savedOrder) {
			const amount = req.body.sub_total + 30;

			let userId = "MUID123";
			let SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
			let SALT_INDEX = 1;

			PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"
			let normalPayLoad = {
				merchantId: "PGTESTPAYUAT",
				merchantTransactionId: orderID,
				merchantUserId: userId,
				amount: amount * 100,
				redirectUrl: `https://ladusamrat-api.vercel.app/${orderID}`,
				"redirectMode": "REDIRECT",
				mobileNumber: "9999999999",
				paymentInstrument: {
					type: "PAY_PAGE",
				},
			};

			let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
			let base64EncodedPayload = bufferObj.toString("base64");

			let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
			let sha256_val = sha256(string);
			let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

			axios
				.post(
					`${PHONE_PE_HOST_URL}/pg/v1/pay`,
					{
						request: base64EncodedPayload,
					},
					{
						headers: {
							"Content-Type": "application/json",
							"X-VERIFY": xVerifyChecksum,
							accept: "application/json",
						},
					}
				)
				.then(function (response) {
					res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
				})
				.catch(function (error) {
					res.send(error);
				});
		}
	} catch (error) {
		return res.json(error);
	}
}

const getAllOrders = (req, res) => {
	try {
		let data = {
			"email": process.env.DASHBOARD_USER_EMAIL,
			"password": process.env.DASHBOARD_USER_PASSWORD
		};

		axios('https://apiv2.shiprocket.in/v1/external/auth/login', {
			method: "POST",
			data: data,
		})
			.then(async (authResponse) => {
				axios('https://apiv2.shiprocket.in/v1/external/orders', {
					method: "GET",
					maxBodyLength: Infinity,
					headers: {
						"Authorization": `Bearer ${authResponse.data.token}`
					}
				})
					.then((response) => {
						return res.json({error:false, ...response.data, message: "Fetched successfully"})
					})
			}).catch((err) => {
				return res.json(err)
			})
	}
	catch (error) {
		return res.json(error);
	}
}

module.exports = { createOrder, createPrepaidOrder, getAllOrders }