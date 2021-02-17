const Stripe = require('stripe')

const stripe = Stripe(
  'sk_test_51I4PzJJ8OW7bT8ScxJ2LC8V5fVTx2qjWpBCQRTIobVnKaBRp4UgbB0ViOG5DVRuDcp76PN3df2bOoXOw46pPZtfa00nYAlfTNV'
)

exports.createSession = async () => {
  try {
    const sessionID = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3001/success',
      cancel_url: 'http://localhost:3001/error',
    })
    if (sessionID) {
      return sessionID
    }
    return null
  } catch (error) {
    return null
  }
}
