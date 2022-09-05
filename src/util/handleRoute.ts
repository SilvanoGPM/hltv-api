import { Response } from "express";

export async function handleRoute(
  callback: () => Promise<any>,
  res: Response<any, Record<string, any>>
) {
  try {
    await callback();
  } catch (error) {
    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
}
