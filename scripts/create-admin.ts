import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
  const email = "admin@orouba.com"; // Change this to your desired admin email
  const password = "orouba@123"; // Change this to your desired password

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: "Admin",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Admin user created successfully:", user.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
