require('dotenv').config();
const express = require("express");
var bodyParser = require('body-parser')
const mongoose = require("mongoose");
const cors = require('cors')
const crypto = require("crypto")
const axios = require('axios');


const app = express();
app.use(cors({
    origin: ["*", "http://localhost:3000", "http://localhost:3001", "https://ladusamrat-store.vercel.app"]
}))
app.use(bodyParser.json());
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true })
    .then(() => { console.log("Database is Connected") })
    .catch((err) => { console.log("Database is not Connected ", err) })

//Admin Router
const adminRouter = require("./routes/adminRoutes")
app.use("/admin", adminRouter)

//Customer Router
const customrRouter = require("./routes/customerRoutes")
app.use("/customer", customrRouter)

//Product Router
const productRouter = require("./routes/productRoutes")
app.use("/product", productRouter)

//Category Router
const categoryRouter = require("./routes/categoryRoutes");
app.use("/category", categoryRouter)

// Order Router
const orderRouter = require("./routes/orderRoutes");
const Order = require('./model/Order');
app.use("/order", orderRouter)

const checkStatus = async (req, res) => {
    const merchantTransactionId = req.params.id
    const merchantId = "PGTESTPAYUAT"
    let salt_key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    axios(`https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`, {
        method: "GET",
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    }).then(async (response) => {
        if (response.data.success === true) {
            const order = await Order.findOne({
                orderID: merchantTransactionId,
            });
            if (order) {
                let data = {
                    "email": process.env.DASHBOARD_USER_EMAIL,
                    "password": process.env.DASHBOARD_USER_PASSWORD
                };
                axios('https://apiv2.shiprocket.in/v1/external/auth/login', {
                    method: "POST",
                    data: data,
                })
                    .then((authResponse) => {
                        axios('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
                            method: "POST",
                            data: JSON.parse(order.data),
                            maxBodyLength: Infinity,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${authResponse.data.token}`
                            },
                        })
                            .then((shiprocketResponse) => {
                                return res.redirect("https://ladusamrat-store.vercel.app?clear=yes")
                            })
                    })
            }
        } else {
            const url = `http://localhost:3000/fail`
            return res.send("order not found")
            // return res.send(response.data)
        }
    })
        .catch((error) => {
            console.error(error);
        });
};
app.get("/:id", checkStatus)

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Ladu-Samrat Server is Live on " + PORT)
    } else {
        console.log("Ladu-Samrat Server is facing error", error)

    }
})