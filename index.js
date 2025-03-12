import dotenv, { parse } from "dotenv";
dotenv.config();
import express, { response } from "express";
import Note from "./src/models/note.js";

const app = express();
app.use(express.json());
app.use(express.static("dist"));
const PORT = process.env.PORT;
/*
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];*/

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  let intId = parseInt(id);
  Note.find({ id: intId }).then((note) => {
    response.json(note);
  });
});

app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const obj = request.body;
  console.log(obj);

  obj.content = "123";

  response.send(obj);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = async () => {
  try {
    const notes = await Note.find({});
    const maxId = notes.length; // Use the length to determine the new ID
    return String(maxId + 1); // Return the next available ID as a string
  } catch (error) {
    console.log("Error generating ID:", error);
    return "1"; // Return a default ID if there's an error
  }
};

app.post("/api/notes", async (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const id = await generateId();

  const note = new Note({
    id: id,
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => {
      console.error("Error saving note:", error);
      response.status(500).json({ error: "Failed to save note" });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
