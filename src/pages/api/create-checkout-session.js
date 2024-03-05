// pages/api/create-checkout-session.js
import { useAppContext } from '../../context/AppContext';
import { stripe } from '../../utils/initStripe';
import Cors from 'micro-cors';
const YOUR_DOMAIN = 'http://localhost:3001';

const cors = Cors({
    allowedMethods: ['POST'],
});

export default cors(async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: 'price_1OkPihKKgBAGSCieN0lXjEky',
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${YOUR_DOMAIN}/assignmentPlan/success`,
                cancel_url: `${YOUR_DOMAIN}/assignmentPlan`,
            });

            res.redirect(303, session.url);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
})
