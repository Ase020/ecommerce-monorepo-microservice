import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  res.json({ message: "Product fetched successfully." });
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  res.status(201).json({
    message: "Product created successfully",
    product: { name, price },
  });
};

export const getProductById = async (req: Request, res: Response) => {};
export const updateProduct = async (req: Request, res: Response) => {};
export const deleteProduct = async (req: Request, res: Response) => {};
