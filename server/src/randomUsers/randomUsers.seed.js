import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // Import bcryptjs.
config();

// Array containing random user data to seed the database.
const randomUsers = [
  {
    email: "boss@gmail.com",
    fullName: "Boss",
    password: "boss1234",
    profilePic: "/boss_640.png" || "",
    isAdmin: true, // Grant admin privileges.
  },
  {
    email: "tom@gmail.com",
    fullName: "Tom Boysen",
    password: "35rtuf32",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "jerry@gmail.com",
    fullName: "Jerry Clancy",
    password: "dsg45345s",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "mike88@gmail.com",
    fullName: "Mike Harrington",
    password: "x4v29dks",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "david.smith@gmail.com",
    fullName: "David Smith",
    password: "d4vidSm1th!",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "ronnie.b@gmail.com",
    fullName: "Ronnie Blake",
    password: "ronnieB99",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "leo.carter@gmail.com",
    fullName: "Leo Carter",
    password: "le0ctpass",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "brad.martin@gmail.com",
    fullName: "Brad Martin",
    password: "brad1234",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    email: "ryan.james@gmail.com",
    fullName: "Ryan James",
    password: "rYJamz77",
    profilePic: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    email: "samuel.d@gmail.com",
    fullName: "Samuel Donovan",
    password: "samD0n@van",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    email: "nate.williams@gmail.com",
    fullName: "Nate Williams",
    password: "willnate2025",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

//Function to add the Random users to the MongoDB database.
const randomUserSeedDatabase = async () => {
  try {
    await connectDB();

    // Hash passwords before inserting.
    const usersWithHashedPasswords = await Promise.all(
      randomUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10); // Generate salt.
        const hashedPassword = await bcrypt.hash(user.password, salt); // Hash password.
        return { ...user, password: hashedPassword }; // Replace plaintext with hash.
      })
    );

    // Clear existing users.
    // await User.deleteMany({});.

    await User.insertMany(usersWithHashedPasswords); // Insert seed data.
    console.log("Random User Database Added with hashed passwords");
  } catch (error) {
    console.log("Error Adding Random User Database:", error);
  }
  process.exit();
};

randomUserSeedDatabase();

/* 
How to use seed Database:

cd server
node src/randomUsers/randomUsers.seed.js
*/
