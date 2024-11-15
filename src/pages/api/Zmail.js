import { supabase } from "../../../client";

export default async function handler(req, res) {
  console.log("inco",req.body);
  
  if (req.method === 'POST') {
    const {
      OrderReceived,
      email,
      company,
      ContactName,
      ContractNumber,
      StartDate,
      EndDate,
      products
    } = req.body;
    const productList = JSON.parse(products)
    console.log(productList);
    
    // Validate that 'products' is an array
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid data: 'products' must be an array" });
    }

    // Prepare an array of records to insert
    const records = products.map(product => ({
      OrderReceived,
      email,
      company,
      ContactName,
      ContractNumber,
      StartDate,
      EndDate,
      ProductDescription: product.ProductDescription,
      NewRenewal: product.NewRenewal,
      Term: product.Term,
      Quantity: product.Quantity
    }));
    console.log("records", records);
    
    // Insert each product as a new row
    const { data, error } = await supabase
      .from('EmailTest') // Replace with your actual table name
      .insert(records);

    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Error saving data' });
    }

    res.status(200).json({ message: 'Data added successfully', data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
