import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.set('strictQuery',false)

const uri = process.env.MONGODB_URI
if (!uri) {
    console.log("MongoDB URI not found.")
    process.exit(1)
}

mongoose.connect(uri)
.then(result => console.log("Database connected."))
.catch(err => {console.error(`Database failed to connect: ${err.message}`)})

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

export default Note
