import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
});

export default class ProductsRepo {
  constructor() {
    this.lambda = new AWS.Lambda({ region: "us-east-1" });
  }

  async createProduct(product) {
    const params = {
      FunctionName: "Create_Product_Prisma",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
      }),
    };
    const response = await this.lambda.invoke(params).promise();
    
    return JSON.parse(response.Payload);
  }

  async getProducts() {
    const params = {
      FunctionName: "Read_Product_Prisma",
      InvocationType: "RequestResponse",
    };

    const response = await this.lambda.invoke(params).promise();
    
    const products = JSON.parse(response.Payload);

    return products;
  }

  async updateProduct(product) {
    const params = {
      FunctionName: "update_product_prisma",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(Object.fromEntries(Object.entries(product))),
    };

    const response = await this.lambda.invoke(params).promise();

    return JSON.parse(response.Payload);
  }

  async deleteProduct(productID) {
    const params = {
      FunctionName: "delete_product_prisma",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(productID),
    };

    const response = await this.lambda.invoke(params).promise();

    return JSON.parse(response.Payload);
  }
}
