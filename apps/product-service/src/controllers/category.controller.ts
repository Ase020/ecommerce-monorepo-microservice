import { prisma, Prisma } from "@repo/product-db";
import { Request, Response } from "express";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res
    .status(200)
    .json({ categories, message: "Categories fetched successfully." });
};

export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategoryCreateInput = req.body;

  const newCategory = await prisma.category.create({ data });
  res
    .status(201)
    .json({ category: newCategory, message: "Category created successfully." });
};

// TODO: Handle updating category in products when category name is changed
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.CategoryUpdateInput = req.body;

  const existingCategory = await prisma.category.findUnique({
    where: { id: parseInt(id as string, 10) },
  });

  if (!existingCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const updatedCategory = await prisma.category.update({
    where: { id: parseInt(id as string, 10) },
    data,
  });

  res.status(200).json({
    category: updatedCategory,
    message: "Category updated successfully.",
  });
};

// TODO: Handle deletion of products associated with the category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingCategory = await prisma.category.findUnique({
    where: { id: parseInt(id as string, 10) },
  });

  if (!existingCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  await prisma.category.delete({
    where: { id: parseInt(id as string, 10) },
  });

  res.status(200).json({ message: "Category deleted successfully." });
};
