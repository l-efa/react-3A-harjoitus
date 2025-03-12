import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const password = process.argv[2];
const url = process.env.MONGODB_URL;
mongoose.set("strictQuery", false);

console.log("Connecting to url", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("Error connecting to mongodb", error.message);
  });

const noteSchema = new mongoose.Schema({
  id: Number,
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Note", noteSchema);
