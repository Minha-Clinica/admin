// utils/initStripe.js
import Stripe from 'stripe';

export const stripe = new Stripe('sk_test_51OhxFfKKgBAGSCiesXAPem6dXqNPHiq1M24mkvUbIuojYS7ptJ9T6kcLYXJhhhNRdDBuIiPRUkvT6ImOZKEaRlIn00Y0ZsLiks', {
  apiVersion: '2020-08-27', // Use the latest Stripe API version
});
