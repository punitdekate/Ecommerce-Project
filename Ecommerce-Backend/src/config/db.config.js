import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    console.log("Trying to connect to mongodb.");
    await mongoose.connect(process.env.DB_URL);
    console.log("Db connected successfully.");
  } catch (error) {
    console.log(error);
  }
};

export { connectToDb };
