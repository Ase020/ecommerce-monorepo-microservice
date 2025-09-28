import { Request, Response } from "express";

export const getCategories = async (req: Request, res: Response) => {
  res.json({ message: "Categories fetched successfully." });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  res.status(201).json({
    message: "Category created successfully",
    category: { name, price },
  });
};

export const updateCategory = async (req: Request, res: Response) => {};
export const deleteCategory = async (req: Request, res: Response) => {};
