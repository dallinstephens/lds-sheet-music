const mongoose = require('mongoose');

// The variable isValidObjectId is used to check if the id is a valid MongoDB ObjectId format
// and provides a quick 400 status code response if the id is not a valid MongoDB ObjectId format.
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// This provides access to the mongoose functions such as .find() and .get().. 
const Customer = require('../models/customer');

// GET: Retrieve all customers
const getCustomers = async (req, res) => {
  /*  #swagger.tags = ['GET: Customers']
      #swagger.description = 'This is used to retrieve all the customers.'   
      #swagger.responses[200] = {
          description: 'All customers were sucessfully found.',
          schema: {
            type: 'array',
            items: { $ref: '#/definitions/Customer' }
          }
      }
      #swagger.responses[500] = {
          description: 'Internal server error: no customers were retrieved.',
          schema: { message: 'An internal server error occurred while retrieving customers.' }
      }
  */

  try {
    // This pulls from the customers collection. 
    const customers = await Customer.find({});

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred while retrieving customers.' });
  }
};

// GET: Retrieve one customer by id
const getCustomerById = async (req, res) => {
  /*  #swagger.tags = ['GET: Customers']
      #swagger.description = 'This is used to find a single customer with an id.'
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
          description: 'This is the object id of the customer to retrieve. Example id: 68e1a0b3ee5576c136630326',
          example: '68e1a0b3ee5576c136630326'
      }          
      #swagger.responses[200] = {
          description: 'A single customer was successfully found with a specific id.',
          schema: { $ref: '#/definitions/Customer' }
      }
      #swagger.responses[404] = {
          description: 'The customer with the specifed id was not found.',
          schema: { message: 'The customer with the given id was not found.' }
      }
      #swagger.responses[400] = {
          description: 'The customer id format was not valid.',
          schema: { message: 'Invalid customer id format.' }
      }          
      #swagger.responses[500] = {
          description: 'Internal server error: the customer was not retrieved.',
          schema: { message: 'An internal server error occurred while retrieving the customer with the given id.' }
      }                    
  */

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({message: 'Invalid customer id format.'});
  }      

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({message: `The customer with the given id: ${id} was not found.`});
    }

    res.status(200).json(customer);
  } catch (error) {
    // if (error.kind === 'ObjectId') {
    //   return res.status(400).json({message: 'Invalid customer id format.'});
    // }

    return res.status(500).json({ message: 'An internal server error occurred while retrieving the customer with the given id.' });
  }
};

// POST: Create one customer
const createCustomer = async (req, res) => {
  /*  #swagger.tags = ['POST: Customers']
      #swagger.description = 'This is used to create a new customer.'
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          description: 'This contains the customer object that contains the data to create.',
          schema: { $ref: '#/definitions/Customer' }
      }      
      #swagger.responses[201] = {
          description: 'A customer was successfully created.',
          schema: { $ref: '#/definitions/Customer' }
      }
      #swagger.responses[400] = {
          description: 'One or more required fields are missing from the request body or an email is being used that already exists.',
          schema: { message: 'One or more required fields are missing or an email was used that already exists.' }
      }
      #swagger.responses[500] = {
          description: 'An internal server error with creating a customer.',
          schema: { message: 'Internal server error: the customer failed to be added.' }
      }
  */

  try {
    const customerData = req.body;

    const newCustomer = await Customer.create(customerData);

    return res.status(201).json(newCustomer);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate email. A customer with this email already exists.' });
    }

    // error.message is used to give a simple string rather than the whole error object.
    // || 'There was an internal server error.' is so that there is a fallback message in case there was no error message.
    return res.status(500).json({
      message: error.message || 'Internal server error: the customer failed to be added.' 
    });
  }
};

// PUT: Update one customer by id
const updateCustomerById = async (req, res) => {
  /*  #swagger.tags = ['PUT: Customers']
      #swagger.description = 'This is used to update a customer by a the object id in the request.'
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
          description: 'This is the object id of the customer to update. Example id: 68e1a0b3ee5576c136630326',
          example: '68e1a0b3ee5576c136630326'
      }
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          description: 'This contains the fields for the customer object to update.',
          schema: { $ref: '#/definitions/Customer' }
      }
      #swagger.responses[204] = {
          description: 'A status of 204 (No Content) indicates the customer update was successful.',
      }                           
      // #swagger.responses[200] = {
      //     description: 'A customer was updated by a id in the request. It returns the updated document.',
      //     schema: { $ref: '#/definitions/Customer' }
      // }
      #swagger.responses[404] = {
          description: 'The customer with the specified id was not found or there was not a change in the request body.',
          schema: { message: 'The customer with the given id failed to update because that id was not found or there was no change in the body for that id.' }
      }
      #swagger.responses[400] = {
          description: 'One or more required fields are missing from the request body, an email is being used that already exists, or the customer id format is not valid.',
          schema: { message: 'One or more required fields are missing, an email was used that already exists, or customer id format is not valid.' }
      }          
      #swagger.responses[500] = {
        description: 'An internal server error occurred with updating a customer with a given id.',
        schema: { message: 'Internal server error: the customer with the given id was not updated.' }
      }       
  */

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({message: 'Invalid customer id format.'});
  }      

  try {
    const customerData = req.body;

    const currentCustomer = await Customer.findById(id);

    const updateData = { ...customerData }; // dots are used so that customerData is not manipulated

    if (updateData.email && updateData.email === currentCustomer.email) {
      delete updateData.email;
    }
    
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id },
      { $set: updateData},
      {
        // new: true, // this returns the updated document
        new: false, // This is set to false because no content is returned with 204 status code response.
        runValidators: true, // this re-runs all schema validators on the updated data
        context: 'query' // This bypasses unique email error when updating.
      }
    );

    if (!updatedCustomer) {
      // A status of 404 means something is not found.
      return res.status(404).json({
        message: `The customer with the given id ${id} failed to update because that id was not found.`,
      });    
    }

    // Return 204 (No Content)
    return res.status(204).send();
    // return res.status(200).json(updatedCustomer);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate email. A customer with this email already exists.' });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({message: 'Invalid customer id format.'});
    }    

    return res.status(500).json({ 
      message: error.message || 'Internal server error: the customer with the given id was not updated.'
    });
  }
};

// DELETE: Delete one customer by id
const deleteCustomerById = async (req, res) => {
  /*  #swagger.tags = ['DELETE: Customers']
      #swagger.description = 'This is used to delete a customer with a specified id in the request.'
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
          description: 'This is the id of the customer to delete. Example id: 68e1a0b3ee5576c136630326',
          example: '68e1a0b3ee5576c136630326'
      }
      #swagger.responses[404] = {
          description: 'The customer with the specified id was not found.',
          schema: { message: 'The customer with the given id failed to delete because the id was not found.' }
      }
      #swagger.responses[200] = {
          description: 'The customer with the given id was successfully deleted.',
          schema: { message: 'The customer with the given id was succesfully deleted.' }
      }           
      // #swagger.responses[204] = {
      //     description: 'The customer with the given id was deleted. No content is returned.',
      // }
      #swagger.responses[400] = {
          description: 'The customer id format is not valid.',
          schema: { message: 'Invalid customer id format.' }
      }            
      #swagger.responses[500] = {
        description: 'An internal server error occurred with deleting a customer with a given id.',
        schema: { message: 'Internal server error: the customer with the given id was not deleted.' }
      } 
  */

  // Note: The request body is not needed to delete a document.

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({message: 'Invalid customer id format.'});
  }

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      // A status of 404 means something is not found.
      return res.status(404).json({
        message: `The customer with the given id ${id} failed to delete because that id was not found.`,
      });    
    }
    
    // return res.status(204).send();
    return res.status(200).json({ message: 'The customer with the given id was deleted successfully!'});

  } catch (error) {
    // if (error.kind === 'ObjectId') {
    //   return res.status(400).json({message: 'Invalid customer id format.'});
    // }

    return res.status(500).json({
      message: error.message || 'Internal server error: the customer with the given id was not deleted.'
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById
};