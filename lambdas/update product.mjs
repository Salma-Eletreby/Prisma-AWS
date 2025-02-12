import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updateProduct = async (event) => {
  try {
    const { product_id, ...newProduct } = event;

    if (!product_id) {
      throw new Error("Product ID is required for updating.");
    }

    const updateData = {};

    Object.keys(newProduct).forEach((key) => {
      if (key === 'stock_quantity') {
        updateData[key] = BigInt(newProduct[key]);
      } else if (key === 'price') {
        updateData[key] = parseFloat(newProduct[key]);
      } else if (newProduct[key]) {
        updateData[key] = newProduct[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      throw new Error("At least one field must be provided for an update.");
    }

    const updatedProduct = await prisma.products.update({
      where: {
        product_id: product_id, 
      },
      data: updateData,
    });

    const updatedProductData = JSON.parse(JSON.stringify(updatedProduct, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: updatedProductData }),
    };

  } catch (err) {
    console.error("Error updating product:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message, stack: err.stack }),
    };
  } finally {
    await prisma.$disconnect();
  }
};

export const handler = async (event) => {
  try {
    return await updateProduct(event);
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message, stack: err.stack }),
    };
  }
};
