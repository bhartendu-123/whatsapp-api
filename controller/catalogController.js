"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.addProduct = addProduct;exports.addProductImage = addProductImage;exports.changeProductImage = changeProductImage;exports.createCollection = createCollection;exports.delProducts = delProducts;exports.deleteCollection = deleteCollection;exports.editCollection = editCollection;exports.editProduct = editProduct;exports.getCollections = getCollections;exports.getProductById = getProductById;exports.getProducts = getProducts;exports.removeProductImage = removeProductImage;exports.sendLinkCatalog = sendLinkCatalog;exports.setProductVisibility = setProductVisibility;exports.updateCartEnabled = updateCartEnabled;
















var _functions = require("../util/functions"); /*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getProducts(req, res) {/**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      in: 'query',
      schema: '5521999999999',
     }
     #swagger.parameters["qnt"] = {
      in: 'query',
      schema: '10',
     }
   */const { phone, qnt } = req.query;if (!phone) return res.status(401).send({ message: 'Please send the contact number you wish to return the products.' });try {const result = await req.client?.getProducts(phone, qnt
    );
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on get products',
      error: error
    });
  }
}

async function getProductById(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      in: 'query',
      schema: '5521999999999',
     }
     #swagger.parameters["id"] = {
      in: 'query',
      schema: '10',
     }
   */
  const { phone, id } = req.query;
  if (!phone || !id)
  return res.status(401).send({
    message: 'Please send the contact number and productId.'
  });

  try {
    const result = await req.client.getProductById(
      phone,
      id
    );
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.
    status(500).
    json({ status: 'Error', message: 'Error on get product', error: error });
  }
}
async function editProduct(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
    #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        options: { type: "object" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                          options: {
                            name: 'New name for product',
                          }
                        }
                    },
                }
            }
        }
    }
   */
  const { id, options } = req.body;
  if (!id || !options)
  return res.status(401).send({
    message: 'productId or options was not informed'
  });

  try {
    const result = await req.client.editProduct(id, options);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on edit product.',
      error: error
    });
  }
}

async function delProducts(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                        }
                    },
                }
            }
        }
    }
   */
  const { id } = req.body;
  if (!id)
  return res.status(401).send({
    message: 'products Id was not informed'
  });

  try {
    const result = await req.client.delProducts(id);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on delete product.',
      error: error
    });
  }
}

async function changeProductImage(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        base64: { type: "string" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                          base64: '<base64_string>'
                        }
                    },
                }
            }
        }
    }
   */
  const { id, base64 } = req.body;
  if (!id || !base64)
  return res.status(401).send({
    message: 'productId and base64 was not informed'
  });

  try {
    const result = await req.client.changeProductImage(id, base64);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on change product image.',
      error: error
    });
  }
}

async function addProduct(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        image: { type: "string" },
                        description: { type: "string" },
                        price: { type: "string" },
                        url: { type: "string" },
                        retailerId: { type: "string" },
                        currency: { type: "string" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          name: 'Product name',
                          image: '<base64_string>',
                          description: 'Description for your product',
                          price: '8890',
                          url: 'http://link_for_your_product.com',
                          retailerId: 'SKU001',
                          currency: 'BRL',
                        }
                    },
                }
            }
        }
    }
   */
  const {
    name,
    image,
    description,
    price,
    url,
    retailerId,
    currency = 'BRL'
  } = req.body;
  if (!name || !image || !price)
  return res.status(401).send({
    message: 'name, price and image was not informed'
  });

  try {
    const result = await req.client.createProduct(
      name,
      image,
      description,
      price,
      false,
      url,
      retailerId,
      currency
    );
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'Error',
      message: 'Error on add product.',
      error: error
    });
  }
}

async function addProductImage(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        base64: { type: "string" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                          base64: '<base64_string>'
                        }
                    },
                }
            }
        }
    }
   */
  const { id, base64 } = req.body;
  if (!id || !base64)
  return res.status(401).send({
    message: 'productId and base64 was not informed'
  });

  try {
    const result = await req.client.addProductImage(id, base64);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on add product image.',
      error: error
    });
  }
}

async function removeProductImage(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        index: { type: "number" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                          index: 1
                        }
                    },
                }
            }
        }
    }
   */
  const { id, index } = req.body;
  if (!id || !index)
  return res.status(401).send({
    message: 'productId and index image was not informed'
  });

  try {
    const result = await req.client.removeProductImage(id, index);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on remove product image.',
      error: error
    });
  }
}

async function getCollections(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["phone"] = {
      schema: '5521999999999'
     }
     #swagger.parameters["qnt"] = {
      schema: '10'
     }
     #swagger.parameters["max"] = {
      schema: '10'
     }
   */
  const { phone, qnt, max } = req.query;
  if (!phone)
  return res.status(401).send({
    message: 'phone was not informed'
  });

  try {
    const result = await req.client.getCollections(
      phone,
      qnt,
      max
    );
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on get collections.',
      error: error
    });
  }
}

async function createCollection(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        products: { type: "array" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          name: 'Collection name',
                          products: ['<id_product1>', '<id_product2>'],
                        }
                    },
                }
            }
        }
    }
   */
  const { name, products } = req.body;
  if (!name || !products)
  return res.status(401).send({
    message: 'name or products was not informed'
  });

  try {
    const result = await req.client.createCollection(name, products);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on create collection.',
      error: error
    });
  }
}

async function editCollection(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        products: { type: "array" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                          options: {
                            name: 'New name for collection',
                          }
                        }
                    },
                }
            }
        }
    }
   */
  const { id, options } = req.body;
  if (!id || !options)
  return res.status(401).send({
    message: 'id or options was not informed'
  });

  try {
    const result = await req.client.editCollection(id, options);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on edit collection.',
      error: error
    });
  }
}

async function deleteCollection(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                        }
                    },
                }
            }
        }
    }
   */
  const { id } = req.body;
  if (!id)
  return res.status(401).send({
    message: 'id was not informed'
  });

  try {
    const result = await req.client.deleteCollection(id);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on delete collection.',
      error: error
    });
  }
}

async function setProductVisibility(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
     #swagger.parameters["obj"] = {
      in: 'body',
      schema: {
        $id: '<id_product>',
        $value: false,
      }
     }
     #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        value: { type: "boolean" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          id: '<product_id>',
                          value: false,
                        }
                    },
                }
            }
        }
    }
   */
  const { id, value } = req.body;
  if (!id || !value)
  return res.status(401).send({
    message: 'product id or value (false, true) was not informed'
  });

  try {
    const result = await req.client.setProductVisibility(id, value);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on set product visibility.',
      error: error
    });
  }
}

async function updateCartEnabled(req, res) {
  /**
   * #swagger.tags = ["Catalog & Bussiness"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
      #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          enabled: true,
                        }
                    },
                }
            }
        }
    }
   */
  const { enabled } = req.body;
  if (!enabled)
  return res.status(401).send({
    message: 'enabled (false, true) was not informed'
  });

  try {
    const result = await req.client.updateCartEnabled(enabled);
    res.status(201).json({ status: 'success', response: result });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on set enabled cart.',
      error: error
    });
  }
}

async function sendLinkCatalog(req, res) {
  /**
   * #swagger.tags = ["Messages"]
     #swagger.autoBody=false
     #swagger.security = [{
            "bearerAuth": []
     }]
     #swagger.parameters["session"] = {
      schema: 'NERDWHATS_AMERICA'
     }
      #swagger.requestBody = {
        required: true,
        "@content": {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                      phones: { type: "array" },
                      message: { type: "string" }
                    }
                },
                examples: {
                    "Default": {
                        value: {
                          phones: ['<array_phone_id'],
                          message: 'Message',
                        }
                    },
                }
            }
        }
    }
   */
  const { phones, message } = req.body;
  if (!phones)
  return res.status(401).send({
    message: 'phones was not informed'
  });
  const results = [];
  try {
    const session = await req.client.getWid();
    const catalogLink = (0, _functions.createCatalogLink)(session);
    for (const phone of phones) {
      const result = await req.client.sendText(
        phone,
        `${message} ${catalogLink}`,
        {
          useTemplateButtons: true,
          buttons: [
          {
            url: catalogLink,
            text: 'Abrir catálogo'
          }]

        }
      );
      results.push({ phone, status: result.id });
    }
    return res.status(200).json({ status: 'success', response: results });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error on set enabled cart.',
      error: error
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnVuY3Rpb25zIiwicmVxdWlyZSIsImdldFByb2R1Y3RzIiwicmVxIiwicmVzIiwicGhvbmUiLCJxbnQiLCJxdWVyeSIsInN0YXR1cyIsInNlbmQiLCJtZXNzYWdlIiwicmVzdWx0IiwiY2xpZW50IiwianNvbiIsInJlc3BvbnNlIiwiZXJyb3IiLCJnZXRQcm9kdWN0QnlJZCIsImlkIiwiZWRpdFByb2R1Y3QiLCJvcHRpb25zIiwiYm9keSIsImRlbFByb2R1Y3RzIiwiY2hhbmdlUHJvZHVjdEltYWdlIiwiYmFzZTY0IiwiYWRkUHJvZHVjdCIsIm5hbWUiLCJpbWFnZSIsImRlc2NyaXB0aW9uIiwicHJpY2UiLCJ1cmwiLCJyZXRhaWxlcklkIiwiY3VycmVuY3kiLCJjcmVhdGVQcm9kdWN0IiwiY29uc29sZSIsImxvZyIsImFkZFByb2R1Y3RJbWFnZSIsInJlbW92ZVByb2R1Y3RJbWFnZSIsImluZGV4IiwiZ2V0Q29sbGVjdGlvbnMiLCJtYXgiLCJjcmVhdGVDb2xsZWN0aW9uIiwicHJvZHVjdHMiLCJlZGl0Q29sbGVjdGlvbiIsImRlbGV0ZUNvbGxlY3Rpb24iLCJzZXRQcm9kdWN0VmlzaWJpbGl0eSIsInZhbHVlIiwidXBkYXRlQ2FydEVuYWJsZWQiLCJlbmFibGVkIiwic2VuZExpbmtDYXRhbG9nIiwicGhvbmVzIiwicmVzdWx0cyIsInNlc3Npb24iLCJnZXRXaWQiLCJjYXRhbG9nTGluayIsImNyZWF0ZUNhdGFsb2dMaW5rIiwic2VuZFRleHQiLCJ1c2VUZW1wbGF0ZUJ1dHRvbnMiLCJidXR0b25zIiwidGV4dCIsInB1c2giXSwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlci9jYXRhbG9nQ29udHJvbGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMjEgV1BQQ29ubmVjdCBUZWFtXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuXG5pbXBvcnQgeyBjcmVhdGVDYXRhbG9nTGluayB9IGZyb20gJy4uL3V0aWwvZnVuY3Rpb25zJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFByb2R1Y3RzKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNhdGFsb2cgJiBCdXNzaW5lc3NcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInBob25lXCJdID0ge1xuICAgICAgaW46ICdxdWVyeScsXG4gICAgICBzY2hlbWE6ICc1NTIxOTk5OTk5OTk5JyxcbiAgICAgfVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wicW50XCJdID0ge1xuICAgICAgaW46ICdxdWVyeScsXG4gICAgICBzY2hlbWE6ICcxMCcsXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIHFudCB9ID0gcmVxLnF1ZXJ5O1xuICBpZiAoIXBob25lKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOlxuICAgICAgICAnUGxlYXNlIHNlbmQgdGhlIGNvbnRhY3QgbnVtYmVyIHlvdSB3aXNoIHRvIHJldHVybiB0aGUgcHJvZHVjdHMuJyxcbiAgICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQ/LmdldFByb2R1Y3RzKFxuICAgICAgcGhvbmUgYXMgc3RyaW5nLFxuICAgICAgcW50IGFzIHVua25vd24gYXMgbnVtYmVyXG4gICAgKTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBnZXQgcHJvZHVjdHMnLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQcm9kdWN0QnlJZChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDYXRhbG9nICYgQnVzc2luZXNzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJwaG9uZVwiXSA9IHtcbiAgICAgIGluOiAncXVlcnknLFxuICAgICAgc2NoZW1hOiAnNTUyMTk5OTk5OTk5OScsXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcImlkXCJdID0ge1xuICAgICAgaW46ICdxdWVyeScsXG4gICAgICBzY2hlbWE6ICcxMCcsXG4gICAgIH1cbiAgICovXG4gIGNvbnN0IHsgcGhvbmUsIGlkIH0gPSByZXEucXVlcnk7XG4gIGlmICghcGhvbmUgfHwgIWlkKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAnUGxlYXNlIHNlbmQgdGhlIGNvbnRhY3QgbnVtYmVyIGFuZCBwcm9kdWN0SWQuJyxcbiAgICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQuZ2V0UHJvZHVjdEJ5SWQoXG4gICAgICBwaG9uZSBhcyBzdHJpbmcsXG4gICAgICBpZCBhcyBzdHJpbmdcbiAgICApO1xuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXN1bHQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzXG4gICAgICAuc3RhdHVzKDUwMClcbiAgICAgIC5qc29uKHsgc3RhdHVzOiAnRXJyb3InLCBtZXNzYWdlOiAnRXJyb3Igb24gZ2V0IHByb2R1Y3QnLCBlcnJvcjogZXJyb3IgfSk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlZGl0UHJvZHVjdChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDYXRhbG9nICYgQnVzc2luZXNzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHsgdHlwZTogXCJvYmplY3RcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICc8cHJvZHVjdF9pZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ05ldyBuYW1lIGZvciBwcm9kdWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgaWQsIG9wdGlvbnMgfSA9IHJlcS5ib2R5O1xuICBpZiAoIWlkIHx8ICFvcHRpb25zKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAncHJvZHVjdElkIG9yIG9wdGlvbnMgd2FzIG5vdCBpbmZvcm1lZCcsXG4gICAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmVkaXRQcm9kdWN0KGlkLCBvcHRpb25zKTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBlZGl0IHByb2R1Y3QuJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsUHJvZHVjdHMocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2F0YWxvZyAmIEJ1c3NpbmVzc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICc8cHJvZHVjdF9pZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgaWQgfSA9IHJlcS5ib2R5O1xuICBpZiAoIWlkKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAncHJvZHVjdHMgSWQgd2FzIG5vdCBpbmZvcm1lZCcsXG4gICAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmRlbFByb2R1Y3RzKGlkKTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBkZWxldGUgcHJvZHVjdC4nLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGFuZ2VQcm9kdWN0SW1hZ2UocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2F0YWxvZyAmIEJ1c3NpbmVzc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICBcbiAgICAgI3N3YWdnZXIucmVxdWVzdEJvZHkgPSB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBcIkBjb250ZW50XCI6IHtcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiB7XG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2U2NDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJzxwcm9kdWN0X2lkPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2U2NDogJzxiYXNlNjRfc3RyaW5nPidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGlkLCBiYXNlNjQgfSA9IHJlcS5ib2R5O1xuICBpZiAoIWlkIHx8ICFiYXNlNjQpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdwcm9kdWN0SWQgYW5kIGJhc2U2NCB3YXMgbm90IGluZm9ybWVkJyxcbiAgICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQuY2hhbmdlUHJvZHVjdEltYWdlKGlkLCBiYXNlNjQpO1xuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXN1bHQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnRXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGNoYW5nZSBwcm9kdWN0IGltYWdlLicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFByb2R1Y3QocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2F0YWxvZyAmIEJ1c3NpbmVzc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0YWlsZXJJZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeTogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUHJvZHVjdCBuYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6ICc8YmFzZTY0X3N0cmluZz4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIGZvciB5b3VyIHByb2R1Y3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogJzg4OTAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vbGlua19mb3JfeW91cl9wcm9kdWN0LmNvbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldGFpbGVySWQ6ICdTS1UwMDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeTogJ0JSTCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3Qge1xuICAgIG5hbWUsXG4gICAgaW1hZ2UsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgcHJpY2UsXG4gICAgdXJsLFxuICAgIHJldGFpbGVySWQsXG4gICAgY3VycmVuY3kgPSAnQlJMJyxcbiAgfSA9IHJlcS5ib2R5O1xuICBpZiAoIW5hbWUgfHwgIWltYWdlIHx8ICFwcmljZSlcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgbWVzc2FnZTogJ25hbWUsIHByaWNlIGFuZCBpbWFnZSB3YXMgbm90IGluZm9ybWVkJyxcbiAgICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQuY3JlYXRlUHJvZHVjdChcbiAgICAgIG5hbWUsXG4gICAgICBpbWFnZSxcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgcHJpY2UsXG4gICAgICBmYWxzZSxcbiAgICAgIHVybCxcbiAgICAgIHJldGFpbGVySWQsXG4gICAgICBjdXJyZW5jeVxuICAgICk7XG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3VsdCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnRXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGFkZCBwcm9kdWN0LicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZFByb2R1Y3RJbWFnZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDYXRhbG9nICYgQnVzc2luZXNzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlNjQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICc8cHJvZHVjdF9pZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlNjQ6ICc8YmFzZTY0X3N0cmluZz4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBpZCwgYmFzZTY0IH0gPSByZXEuYm9keTtcbiAgaWYgKCFpZCB8fCAhYmFzZTY0KVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAncHJvZHVjdElkIGFuZCBiYXNlNjQgd2FzIG5vdCBpbmZvcm1lZCcsXG4gICAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmFkZFByb2R1Y3RJbWFnZShpZCwgYmFzZTY0KTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBhZGQgcHJvZHVjdCBpbWFnZS4nLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVQcm9kdWN0SW1hZ2UocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2F0YWxvZyAmIEJ1c3NpbmVzc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHsgdHlwZTogXCJudW1iZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICc8cHJvZHVjdF9pZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgaWQsIGluZGV4IH0gPSByZXEuYm9keTtcbiAgaWYgKCFpZCB8fCAhaW5kZXgpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdwcm9kdWN0SWQgYW5kIGluZGV4IGltYWdlIHdhcyBub3QgaW5mb3JtZWQnLFxuICAgIH0pO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVxLmNsaWVudC5yZW1vdmVQcm9kdWN0SW1hZ2UoaWQsIGluZGV4KTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiByZW1vdmUgcHJvZHVjdCBpbWFnZS4nLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb2xsZWN0aW9ucyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDYXRhbG9nICYgQnVzc2luZXNzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJwaG9uZVwiXSA9IHtcbiAgICAgIHNjaGVtYTogJzU1MjE5OTk5OTk5OTknXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInFudFwiXSA9IHtcbiAgICAgIHNjaGVtYTogJzEwJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJtYXhcIl0gPSB7XG4gICAgICBzY2hlbWE6ICcxMCdcbiAgICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZSwgcW50LCBtYXggfSA9IHJlcS5xdWVyeTtcbiAgaWYgKCFwaG9uZSlcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgbWVzc2FnZTogJ3Bob25lIHdhcyBub3QgaW5mb3JtZWQnLFxuICAgIH0pO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVxLmNsaWVudC5nZXRDb2xsZWN0aW9ucyhcbiAgICAgIHBob25lIGFzIHN0cmluZyxcbiAgICAgIHFudCBhcyBzdHJpbmcsXG4gICAgICBtYXggYXMgc3RyaW5nXG4gICAgKTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN0YXR1czogJ3N1Y2Nlc3MnLCByZXNwb25zZTogcmVzdWx0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBnZXQgY29sbGVjdGlvbnMuJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbihyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDYXRhbG9nICYgQnVzc2luZXNzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICNzd2FnZ2VyLnJlcXVlc3RCb2R5ID0ge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgXCJAY29udGVudFwiOiB7XG4gICAgICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjoge1xuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzOiB7IHR5cGU6IFwiYXJyYXlcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NvbGxlY3Rpb24gbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbJzxpZF9wcm9kdWN0MT4nLCAnPGlkX3Byb2R1Y3QyPiddLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgbmFtZSwgcHJvZHVjdHMgfSA9IHJlcS5ib2R5O1xuICBpZiAoIW5hbWUgfHwgIXByb2R1Y3RzKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAnbmFtZSBvciBwcm9kdWN0cyB3YXMgbm90IGluZm9ybWVkJyxcbiAgICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQuY3JlYXRlQ29sbGVjdGlvbihuYW1lLCBwcm9kdWN0cyk7XG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3VsdCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdFcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gY3JlYXRlIGNvbGxlY3Rpb24uJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZWRpdENvbGxlY3Rpb24ocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2F0YWxvZyAmIEJ1c3NpbmVzc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHM6IHsgdHlwZTogXCJhcnJheVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJzxwcm9kdWN0X2lkPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTmV3IG5hbWUgZm9yIGNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBpZCwgb3B0aW9ucyB9ID0gcmVxLmJvZHk7XG4gIGlmICghaWQgfHwgIW9wdGlvbnMpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdpZCBvciBvcHRpb25zIHdhcyBub3QgaW5mb3JtZWQnLFxuICAgIH0pO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVxLmNsaWVudC5lZGl0Q29sbGVjdGlvbihpZCwgb3B0aW9ucyk7XG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3VsdCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdFcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gZWRpdCBjb2xsZWN0aW9uLicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNvbGxlY3Rpb24ocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gIC8qKlxuICAgKiAjc3dhZ2dlci50YWdzID0gW1wiQ2F0YWxvZyAmIEJ1c3NpbmVzc1wiXVxuICAgICAjc3dhZ2dlci5hdXRvQm9keT1mYWxzZVxuICAgICAjc3dhZ2dlci5zZWN1cml0eSA9IFt7XG4gICAgICAgICAgICBcImJlYXJlckF1dGhcIjogW11cbiAgICAgfV1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcInNlc3Npb25cIl0gPSB7XG4gICAgICBzY2hlbWE6ICdORVJEV0hBVFNfQU1FUklDQSdcbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICc8cHJvZHVjdF9pZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgaWQgfSA9IHJlcS5ib2R5O1xuICBpZiAoIWlkKVxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XG4gICAgICBtZXNzYWdlOiAnaWQgd2FzIG5vdCBpbmZvcm1lZCcsXG4gICAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LmRlbGV0ZUNvbGxlY3Rpb24oaWQpO1xuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXN1bHQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnRXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIGRlbGV0ZSBjb2xsZWN0aW9uLicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFByb2R1Y3RWaXNpYmlsaXR5KHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIkNhdGFsb2cgJiBCdXNzaW5lc3NcIl1cbiAgICAgI3N3YWdnZXIuYXV0b0JvZHk9ZmFsc2VcbiAgICAgI3N3YWdnZXIuc2VjdXJpdHkgPSBbe1xuICAgICAgICAgICAgXCJiZWFyZXJBdXRoXCI6IFtdXG4gICAgIH1dXG4gICAgICNzd2FnZ2VyLnBhcmFtZXRlcnNbXCJzZXNzaW9uXCJdID0ge1xuICAgICAgc2NoZW1hOiAnTkVSRFdIQVRTX0FNRVJJQ0EnXG4gICAgIH1cbiAgICAgI3N3YWdnZXIucGFyYW1ldGVyc1tcIm9ialwiXSA9IHtcbiAgICAgIGluOiAnYm9keScsXG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgJGlkOiAnPGlkX3Byb2R1Y3Q+JyxcbiAgICAgICAgJHZhbHVlOiBmYWxzZSxcbiAgICAgIH1cbiAgICAgfVxuICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHsgdHlwZTogXCJib29sZWFuXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJEZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnPHByb2R1Y3RfaWQ+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICovXG4gIGNvbnN0IHsgaWQsIHZhbHVlIH0gPSByZXEuYm9keTtcbiAgaWYgKCFpZCB8fCAhdmFsdWUpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdwcm9kdWN0IGlkIG9yIHZhbHVlIChmYWxzZSwgdHJ1ZSkgd2FzIG5vdCBpbmZvcm1lZCcsXG4gICAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LnNldFByb2R1Y3RWaXNpYmlsaXR5KGlkLCB2YWx1ZSk7XG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJywgcmVzcG9uc2U6IHJlc3VsdCB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdGF0dXM6ICdFcnJvcicsXG4gICAgICBtZXNzYWdlOiAnRXJyb3Igb24gc2V0IHByb2R1Y3QgdmlzaWJpbGl0eS4nLFxuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYXJ0RW5hYmxlZChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgLyoqXG4gICAqICNzd2FnZ2VyLnRhZ3MgPSBbXCJDYXRhbG9nICYgQnVzc2luZXNzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAqL1xuICBjb25zdCB7IGVuYWJsZWQgfSA9IHJlcS5ib2R5O1xuICBpZiAoIWVuYWJsZWQpXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgIG1lc3NhZ2U6ICdlbmFibGVkIChmYWxzZSwgdHJ1ZSkgd2FzIG5vdCBpbmZvcm1lZCcsXG4gICAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXEuY2xpZW50LnVwZGF0ZUNhcnRFbmFibGVkKGVuYWJsZWQpO1xuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXN1bHQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3RhdHVzOiAnRXJyb3InLFxuICAgICAgbWVzc2FnZTogJ0Vycm9yIG9uIHNldCBlbmFibGVkIGNhcnQuJyxcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZExpbmtDYXRhbG9nKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAvKipcbiAgICogI3N3YWdnZXIudGFncyA9IFtcIk1lc3NhZ2VzXCJdXG4gICAgICNzd2FnZ2VyLmF1dG9Cb2R5PWZhbHNlXG4gICAgICNzd2FnZ2VyLnNlY3VyaXR5ID0gW3tcbiAgICAgICAgICAgIFwiYmVhcmVyQXV0aFwiOiBbXVxuICAgICB9XVxuICAgICAjc3dhZ2dlci5wYXJhbWV0ZXJzW1wic2Vzc2lvblwiXSA9IHtcbiAgICAgIHNjaGVtYTogJ05FUkRXSEFUU19BTUVSSUNBJ1xuICAgICB9XG4gICAgICAjc3dhZ2dlci5yZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIFwiQGNvbnRlbnRcIjoge1xuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6IHtcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAgIHBob25lczogeyB0eXBlOiBcImFycmF5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGFtcGxlczoge1xuICAgICAgICAgICAgICAgICAgICBcIkRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmVzOiBbJzxhcnJheV9waG9uZV9pZCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTWVzc2FnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgKi9cbiAgY29uc3QgeyBwaG9uZXMsIG1lc3NhZ2UgfSA9IHJlcS5ib2R5O1xuICBpZiAoIXBob25lcylcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgbWVzc2FnZTogJ3Bob25lcyB3YXMgbm90IGluZm9ybWVkJyxcbiAgICB9KTtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCByZXEuY2xpZW50LmdldFdpZCgpO1xuICAgIGNvbnN0IGNhdGFsb2dMaW5rID0gY3JlYXRlQ2F0YWxvZ0xpbmsoc2Vzc2lvbik7XG4gICAgZm9yIChjb25zdCBwaG9uZSBvZiBwaG9uZXMpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcS5jbGllbnQuc2VuZFRleHQoXG4gICAgICAgIHBob25lLFxuICAgICAgICBgJHttZXNzYWdlfSAke2NhdGFsb2dMaW5rfWAsXG4gICAgICAgIHtcbiAgICAgICAgICB1c2VUZW1wbGF0ZUJ1dHRvbnM6IHRydWUsXG4gICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1cmw6IGNhdGFsb2dMaW5rLFxuICAgICAgICAgICAgICB0ZXh0OiAnQWJyaXIgY2F0w6Fsb2dvJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIChyZXN1bHRzIGFzIGFueSkucHVzaCh7IHBob25lLCBzdGF0dXM6IHJlc3VsdC5pZCB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzOiAnc3VjY2VzcycsIHJlc3BvbnNlOiByZXN1bHRzIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ0Vycm9yJyxcbiAgICAgIG1lc3NhZ2U6ICdFcnJvciBvbiBzZXQgZW5hYmxlZCBjYXJ0LicsXG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBQUEsVUFBQSxHQUFBQyxPQUFBLHNCQUFzRCxDQWpCdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBS08sZUFBZUMsV0FBV0EsQ0FBQ0MsR0FBWSxFQUFFQyxHQUFhLEVBQUUsQ0FDN0Q7QUFDRjtBQUNBO0FBQ0E7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