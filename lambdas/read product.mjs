import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProducts = async () => {
  try {
    const products = await prisma.products.findMany();

    const serializedProducts = products.map((product) => ({
      ...product,
      stock_quantity: product.stock_quantity.toString(), 
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: serializedProducts }),
    };
  } catch (err) {
    console.error("Error fetching products:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  } finally {
    await prisma.$disconnect();
  }
};

export const handler = async (event) => {
  try {
    const result = await getProducts();
    return result;
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
