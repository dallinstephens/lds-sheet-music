const mongoose = require('mongoose');

// The variable isValidObjectId is used to check if the id is a valid MongoDB ObjectId format
// and provides a quick 400 status code response if the id is not a valid MongoDB ObjectId format.
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// This provides access to the mongoose functions such as .find() and .get().. 
const Order = require('../models/order');

// GET: Retrieve all orders
const getOrders = async (req, res) => {
  /*  #swagger.tags = ['GET: Orders']
      #swagger.description = 'This is used to retrieve all the orders.'   
      #swagger.responses[200] = {
          description: 'All orders were sucessfully found.',
          schema: {
            type: 'array',
            items: { $ref: '#/definitions/Order' }
          }
      }
      #swagger.responses[500] = {
          description: 'Internal server error: no orders were retrieved.',
          schema: { message: 'An internal server error occurred while retrieving orders.' }
      }
  */

  try {
    // This pulls from the orders collection. 
    const orders = await Order.find({});

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred while retrieving orders.' });
  }
};

// GET: Retrieve one order by id
const getOrderById = async (req, res) => {
  /*  #swagger.tags = ['GET: Orders']
      #swagger.description = 'This is used to find a single order with an id.'
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
          description: 'This is the object id of the order to retrieve. Example id: 68e1a0b3ee5576c136630326',
          example: '68e1a0b3ee5576c136630326'
      }          
      #swagger.responses[200] = {
          description: 'A single order was successfully found with a specific id.',
          schema: { $ref: '#/definitions/Order' }
      }
      #swagger.responses[404] = {
          description: 'The order with the specifed id was not found.',
          schema: { message: 'The order with the given id was not found.' }
      }
      #swagger.responses[400] = {
          description: 'The order id format was not valid.',
          schema: { message: 'Invalid order id format.' }
      }          
      #swagger.responses[500] = {
          description: 'Internal server error: the order was not retrieved.',
          schema: { message: 'An internal server error occurred while retrieving the order with the given id.' }
      }                    
  */

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({message: 'Invalid order id format.'});
  }      

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({message: `The order with the given id: ${id} was not found.`});
    }

    res.status(200).json(order);
  } catch (error) {
    // if (error.kind === 'ObjectId') {
    //   return res.status(400).json({message: 'Invalid order id format.'});
    // }

    return res.status(500).json({ message: 'An internal server error occurred while retrieving the order with the given id.' });
  }
};

// POST: Create one order
const createOrder = async (req, res) => {
  /*  #swagger.tags = ['POST: Orders']
      #swagger.description = 'This is used to create a new order.'
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          description: 'This contains the order object that contains the data to create.',
          schema: { $ref: '#/definitions/Order' }
      }      
      #swagger.responses[201] = {
          description: 'A order was successfully created.',
          schema: { $ref: '#/definitions/Order' }
      }
      #swagger.responses[400] = {
          description: 'One or more required fields are missing from the request body or an email is being used that already exists.',
          schema: { message: 'One or more required fields are missing or an email was used that already exists.' }
      }
      #swagger.responses[500] = {
          description: 'An internal server error with creating a order.',
          schema: { message: 'Internal server error: the order failed to be added.' }
      }
  */

  try {
    const orderData = req.body;

    const newOrder = await Order.create(orderData);

    return res.status(201).json(newOrder);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate email. A order with this email already exists.' });
    }

    // error.message is used to give a simple string rather than the whole error object.
    // || 'There was an internal server error.' is so that there is a fallback message in case there was no error message.
    return res.status(500).json({
      message: error.message || 'Internal server error: the order failed to be added.' 
    });
  }
};

// PUT: Update one order by id
const updateOrderById = async (req, res) => {
  /*  #swagger.tags = ['PUT: Orders']
      #swagger.description = 'This is used to update a order by a the object id in the request.'
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
          description: 'This is the object id of the order to update. Example id: 68e1a0b3ee5576c136630326',
          example: '68e1a0b3ee5576c136630326'
      }
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          description: 'This contains the fields for the order object to update.',
          schema: { $ref: '#/definitions/Order' }
      }
      #swagger.responses[204] = {
          description: 'A status of 204 (No Content) indicates the order update was successful.',
      }                           
      // #swagger.responses[200] = {
      //     description: 'A order was updated by a id in the request. It returns the updated document.',
      //     schema: { $ref: '#/definitions/Order' }
      // }
      #swagger.responses[404] = {
          description: 'The order with the specified id was not found or there was not a change in the request body.',
          schema: { message: 'The order with the given id failed to update because that id was not found or there was no change in the body for that id.' }
      }
      #swagger.responses[400] = {
          description: 'One or more required fields are missing from the request body, an email is being used that already exists, or the order id format is not valid.',
          schema: { message: 'One or more required fields are missing, an email was used that already exists, or order id format is not valid.' }
      }          
      #swagger.responses[500] = {
        description: 'An internal server error occurred with updating a order with a given id.',
        schema: { message: 'Internal server error: the order with the given id was not updated.' }
      }       
  */

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({message: 'Invalid order id format.'});
  }      

  try {
    const orderData = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      orderData,
      {
        // new: true, // this returns the updated document
        new: false, // This is set to false because no content is returned with 204 status code response.
        runValidators: true // this re-runs all schema validators on the updated data
      }
    );

    if (!updatedOrder) {
      // A status of 404 means something is not found.
      return res.status(404).json({
        message: `The order with the given id ${id} failed to update because that id was not found.`,
      });    
    }

    // Return 204 (No Content)
    return res.status(204).send();
    // return res.status(200).json(updatedOrder);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate email. A order with this email already exists.' });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({message: 'Invalid order id format.'});
    }    

    return res.status(500).json({ 
      message: error.message || 'Internal server error: the order with the given id was not updated.'
    });
  }
};

// DELETE: Delete one order by id
const deleteOrderById = async (req, res) => {
  /*  #swagger.tags = ['DELETE: Orders']
      #swagger.description = 'This is used to delete a order with a specified id in the request.'
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
          description: 'This is the id of the order to delete. Example id: 68e1a0b3ee5576c136630326',
          example: '68e1a0b3ee5576c136630326'
      }
      #swagger.responses[404] = {
          description: 'The order with the specified id was not found.',
          schema: { message: 'The order with the given id failed to delete because the id was not found.' }
      }
      #swagger.responses[200] = {
          description: 'The order with the given id was successfully deleted.',
          schema: { message: 'The order with the given id was succesfully deleted.' }
      }           
      // #swagger.responses[204] = {
      //     description: 'The order with the given id was deleted. No content is returned.',
      // }
      #swagger.responses[400] = {
          description: 'The order id format is not valid.',
          schema: { message: 'Invalid order id format.' }
      }            
      #swagger.responses[500] = {
        description: 'An internal server error occurred with deleting a order with a given id.',
        schema: { message: 'Internal server error: the order with the given id was not deleted.' }
      } 
  */

  // Note: The request body is not needed to delete a document.

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({message: 'Invalid order id format.'});
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      // A status of 404 means something is not found.
      return res.status(404).json({
        message: `The order with the given id ${id} failed to delete because that id was not found.`,
      });    
    }
    
    // return res.status(204).send();
    return res.status(200).json({ message: 'The order with the given id was deleted successfully!'});

  } catch (error) {
    // if (error.kind === 'ObjectId') {
    //   return res.status(400).json({message: 'Invalid order id format.'});
    // }

    return res.status(500).json({
      message: error.message || 'Internal server error: the order with the given id was not deleted.'
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById
};