// @ts-ignore
import jwt from "jsonwebtoken";
import { H3Event, readBody } from "h3";

export default async (event: H3Event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET || "secret";

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email, role: "admin" }, jwtSecret, {
      expiresIn: "1h",
    });
    return { success: true, token };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
};
