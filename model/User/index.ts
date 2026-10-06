import { Schema, model, models, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String, required: false },
    provider: { type: String, default: "google" },
    providerId: { type: String, default: null },
  },
  { timestamps: true },
);

const User = models.user || model("User", userSchema);

export default User;

export type UserType = InferSchemaType<typeof userSchema>;
