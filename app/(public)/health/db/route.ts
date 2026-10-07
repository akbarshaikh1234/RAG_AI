import dbConnect from "@/lib/db/mongoose";


export const GET = async () => {
    const headers = { "Cache-Control": "no-store" };
  try {
    const mongoose = await dbConnect();

    const db = mongoose.connection.db;

    if(!db) {
      throw new Error("Database connection is not established");
    }

    await db.command({ ping: 1 });

    return Response.json(
      { status: "ok", message: "Database is reachable" },
      { status: 200, headers },
    );
  } catch (error) {
    return Response.json({ message: "Failed to connect to the database", status: "error" }, { status: 503, headers });
  }
}