// pages/api/zohoWebhook.js
// import { saveProductDetailsToDatabase } from 'path-to-your-database-function';
import { saveProductDetailsToDatabase } from "./database";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const emailBody = req.body.emailBody;

      // Extracting order details using regex
      const orderReceivedMatch = emailBody.match(/Sent: (\d{1,2} \w+ \d{4})/);
      const contractNumberMatch = emailBody.match(/Contract # (\d+)/);
      const startDateMatch = emailBody.match(/Term Start Date:\s*([\w\s,]+)/);
      const endDateMatch = emailBody.match(/End Date:\s*([\w\s,]+)/);
      const companyNameMatch = emailBody.match(/Company Name: (.+)/);
      const contactNameMatch = emailBody.match(/Hello (\w+\s\w+)/);
      

      const products = [];
      // Regex to find product names and quantities
      const productMatches = emailBody.matchAll(/([A-Za-z\s\&]+) Commercial Product Subscription Renewal .+Qty:\s*(\d+)/g);

      for (const match of productMatches) {
        const productDescription = match[1].trim();
        const quantity = parseInt(match[2], 10);
        
        // Create a product entry
        products.push({
          OrderReceived: orderReceivedMatch ? orderReceivedMatch[1].trim() : '',
          email: req.body.email,
          ContractNumber: contractNumberMatch ? contractNumberMatch[1].trim() : '',
          StartDate: startDateMatch ? startDateMatch[1].trim() : '',
          EndDate: endDateMatch ? endDateMatch[1].trim() : '',
          company: companyNameMatch ? companyNameMatch[1].trim() : '',
          ContactName: contactNameMatch ? contactNameMatch[1].trim() : '',
          ProductDescription: productDescription,
          NewRenewal: 'Renewal',
          Quantity: quantity,
          Term: 'Annual', // You can adjust this depending on how you want to handle the term
        });
      }

      // Save all products to Supabase
      for (const product of products) {
        await saveProductDetailsToDatabase(product);
      }

      // Respond with success
      res.status(200).json({ success: true, message: 'Product details saved successfully' });
    } catch (error) {
      console.error('Error saving product details:', error);
      res.status(500).json({ success: false, message: 'Error saving product details' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
