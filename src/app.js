const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');


require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.post('/checkout', async (req, res) => {
    try {

        let snap = new midtransClient.Snap({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
        });
    
        let parameter = {
            "transaction_details": {
                "order_id": uuidv4(),
                "gross_amount": Number(req.body.totalPrice),
            },
            "credit_card":{
                "secure" : true
            },
            // HARDCODED <-- ini harusnya dari database
            "customer_details": {
                "first_name": "budi",
                "last_name": "pratama",
                "email": "budi.pra@example.com",
                "phone": "08111222333"
            }
        };

        const transaction = await snap.createTransaction(parameter)

        res.json({ error:false, transaction})
        
    } catch (error) {
        res.json({ error:true, message: 'checkout error' })
    }

})

const port = process.env.PORT || 3300

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});