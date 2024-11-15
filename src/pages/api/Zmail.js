import { supabase } from "../../../client"; // Import Supabase client

export default async function handler(req, res) {
  // Log incoming request for debugging
  console.log("Incoming response:", req.body);

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

    // Validate that 'products' is an array
    if (!Array.isArray(products)) {
      console.error("Invalid data: 'products' must be an array");
      return res.status(400).json({ error: "Invalid data: 'products' must be an array" });
    }

    // Log products array to ensure it's structured correctly
    console.log("Products array:", products);

    // Prepare an array of records to insert into Supabase
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

    // Log the records to ensure they are formatted correctly
    console.log("Prepared records for insertion:", records);

    // Insert each product as a new row in the 'EmailTest' table
    const { data, error } = await supabase
      .from('EmailTest') // Replace with your actual table name
      .insert(records);

    // If there's an error, log and return a response with the error
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Error saving data', details: error });
    }

    // Log the inserted data for confirmation
    console.log("Inserted data:", data);

    // Send success response with inserted data
    res.status(200).json({ message: 'Data added successfully', data });
  } else {
    // If the method is not POST, return a 405 error
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
