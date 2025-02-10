import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProduct = async (event) => {
  try {
    let { name, description, price, stock_quantity } = event;
    price = parseFloat(price);
    stock_quantity = parseInt(stock_quantity, 10);
    
    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        stock_quantity, 
      },
    });

    newProduct.stock_quantity = newProduct.stock_quantity.toString();

    return {
      body:{ success: true, data: newProduct }, 
    };

  } catch (err) {
    throw new Error(`Error creating product: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export const handler = async (event) => {
  try {
    const result = await createProduct(event);
    return result;
  } catch (err) {
    console.error("Error:", err);

    return {
      statusCode: 500,
      body: {
        success: false,
        error: err.message,
        stack: err.stack,
      },
    };
  }
};
