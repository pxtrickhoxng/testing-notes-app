import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('Give a password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://pxtrickhoxng:${password}@cluster0.9gmgdhc.mongodb.net/note-app?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

Note.find({}).then(result => {
  result.forEach(note  => {
    console.log(note)
  })
  mongoose.connection.close()
})