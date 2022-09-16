import { Response } from "express";
import { HLTVError } from '../error/HLTVError';

export async function handleRoute(
  callback: () => Promise<any>,
  res: Response<any, Record<string, any>>
) {
  try {
    await callback();
  } catch (error) {
    if (error instanceof HLTVError) {
      res.status(error.status).json({ error });
    }

    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
}
