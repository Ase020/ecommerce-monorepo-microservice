import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";
import { producer } from "../utils/kafka";
import { StripeProductType } from "@repo/types";

export const getProducts = async (req: Request, res: Response) => {
  const { category, limit, search, sort } = req.query;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
      case "desc":
        return { price: Prisma.SortOrder.desc };
      case "newest":
        return { createdAt: Prisma.SortOrder.desc };
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
        break;

      default:
        return { createdAt: Prisma.SortOrder.desc };
        break;
    }
  })();

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category as string,
      },
      name: {
        contains: search as string,
        mode: "insensitive",
      },
    },
    orderBy: orderBy,
    take: limit ? parseInt(limit as string, 10) : undefined,
  });
  res.status(200).json({ message: "Product fetched successfully.", products });
};

export const createProduct = async (req: Request, res: Response) => {
  const data: Prisma.ProductCreateInput = req.body;
  const { colors, images } = data;
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return res
      .status(400)
      .json({ message: "Product must have at least one color" });
  }

  if (
    !images ||
    typeof images !== "object" ||
    Object.keys(images).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Product must have at least one image" });
  }

  const missingColors = colors.filter((color) => !(color in images));
  if (missingColors.length > 0) {
    return res.status(400).json({
      message: `Missing images for colors: ${missingColors.join(", ")}`,
    });
  }

  const newProduct = await prisma.product.create({ data });

  const stripeProduct: StripeProductType = {
    id: newProduct.id.toString(),
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
  };

  producer.send("product.created", {
    value: stripeProduct,
  });

  res
    .status(201)
    .json({ product: newProduct, message: "Product created successfully." });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id as string, 10) },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ product, message: "Product fetched successfully." });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.ProductUpdateInput = req.body;

  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(id as string, 10) },
  });

  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id as string, 10) },
    data,
  });

  res.status(200).json({
    product: updatedProduct,
    message: "Product updated successfully.",
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(id as string, 10) },
  });

  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  await prisma.product.delete({
    where: { id: parseInt(id as string, 10) },
  });

  producer.send("product.deleted", {
    value: {
      id: existingProduct.id.toString(),
    },
  });

  res.status(200).json({ message: "Product deleted successfully." });
};
