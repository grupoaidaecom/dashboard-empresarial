const { Client, Databases } = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67eabefb000d884cf001')
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  const {
    paymentId,
    status,
    paymentMethod,
    totalValue,
    customer,
    offer,
    product,
    createdAt,
    approvedAt
  } = req.body;

  const formattedData = {
    paymentId,
    status,
    paymentMethod,
    amount: totalValue / 100,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    offerTitle: offer.title,
    productName: product.name,
    createdAt,
    approvedAt,
    metadata: {
      cpf: customer.cpf,
      utm_source: req.body.utm_source
    }
  };

  try {
    await databases.createDocument(
      'main',
      'transactions',
      paymentId,
      formattedData
    );
    return res.json({ success: true });
  } catch (error) {
    return res.json({ error: error.message }, 500);
  }
};
