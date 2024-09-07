const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const app = express();

const stripe = Stripe('sk_test_51Po971ITVrX9SRphiv7ajEuBlOCoA1vun24y7bbl76ctCwNbV7zFZCEIZXiUbwVvK6Z49kHyeodj2PSRSfN4jRKH00IlcxE4jX');
const webhookSecret = 'whsec_c8887b66c288d75a6fb2410fc6d1a83eec01e2ca6ba749a91a1cf3d90938fec9';

// Middleware to parse raw body for Stripe webhook verification
app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!');
    }

    res.status(200).send({ received: true });
});

app.get('/', (req, res) => {
    res.send('Stripe Webhook Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
