// pages/api/email.js

import { supabase } from "../../../client";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract parsed data from the request body
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

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('your_table_name') // Replace with your actual table name
      .insert([{
        OrderReceived,
        email,
        company,
        ContactName,
        ContractNumber,
        StartDate,
        EndDate,
        products
      }]);

    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Error saving data' });
    }

    // Success response
    res.status(200).json({ message: 'Data added successfully', data });
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
