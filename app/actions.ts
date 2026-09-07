"use server";
import { prisma } from "@/lib/prisma";

export async function submitContact(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

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
