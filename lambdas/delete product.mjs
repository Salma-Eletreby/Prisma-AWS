import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteProduct = async (event) => {
  try {
    const { product_id } = event;

    if (!product_id) {
      throw new Error("Product ID is required for deletion.");
    }

    const existingProduct = await prisma.products.findUnique({
      where: {
        product_id: product_id,
      },
    });

    if (!existingProduct) {
      throw new Error(`Product with ID ${product_id} not found.`);
    }

    const deletedProduct = await prisma.products.delete({
      where: {
        product_id: product_id,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: deletedProduct }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack,
      }),
    };
  } finally {
    await prisma.$disconnect();
  }
};

export const handler = async (event) => {
  try {
    const result = await deleteProduct(event);
    return result;
  } catch (err) {
    console.error("Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack,
      }),
    };
  }
};
