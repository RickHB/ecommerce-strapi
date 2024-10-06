'use strict';

/** * order controller */

const Stripe = require('stripe');
// @ts-ignore
const stripe = new Stripe('sk_test_51P6kxa2NqddGkUxvR85RwOg6g4PblKv3KBlXql6wD5o7qQZWdDSHS5DkDGKin5P7eSxa3aajrJdBkAgIi35GjKKq00lFZwuUMi');

function calculateDiscountPrice(price, discount) {
  if (!discount) return price;
  const discountAmount = (price * discount) / 100;
  const result = price - discountAmount;
  return result.toFixed(2);
}

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async paymentOrder(ctx) {
    try {
        
      // @ts-ignore 
      const { token, products, idUser, addressShipping } = ctx.request.body;

      // Validar datos
      if (!token || !products || !idUser || !addressShipping) {
        return ctx.badRequest('Datos incompletos');
      }

      let totalPayment = 0;
      products.forEach((product) => {
        const price = parseFloat(product.attributes.price);
        const discount = parseFloat(product.attributes.discount) || 0;
        const priceTemp = calculateDiscountPrice(price, discount);
        totalPayment += priceTemp * product.quantity;
      });

      const charge = await stripe.charges.create({
        amount: Math.round(totalPayment * 100),
        currency: 'mxn',
        source: token.id,
        description: `User ID: ${idUser}`,
      });

      const data = {
        user: idUser,
        totalPayment: totalPayment,
        idPayment: charge.id,
        adressShipping: addressShipping,
        products: products,
      };

      const entry = await strapi.entityService.create('api::order.order', { data });
      return entry;
    } catch (err) {
      console.error(err);
      return ctx.badRequest('Error al procesar el pago');
    }
  },
}));

 