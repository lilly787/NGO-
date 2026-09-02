"use server";
import { prisma } from "@/lib/prisma";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const message = String(formData.get("message"));

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  try {
    await prisma.message.create({
      data: {
        name,
        email,
        message,
        type: "General"
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save message:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}
