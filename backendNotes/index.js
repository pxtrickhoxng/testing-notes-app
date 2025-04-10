import express from 'express'
import cors from 'cors'
import Note from './models/note.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findById(id).then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      response.status(500).json({error: "Fetching note failed"})
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id).then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({error: "Note not found"})
      }
    }).catch(error => {
      response.status(500).json({error: "Deleting note failed"})
    })
})
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    }).catch(err => {
      console.log(err)
      response.status(500).json({error: "Saving note failed."})
    })
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  Note.findByIdAndUpdate(id, {
    content: body.content,
    important: typeof body.important === 'boolean' ? body.important : undefined
  }, {new: true})
  .then(updatedNote => {
    if (updatedNote) {
      response.json(updatedNote)
    } else {
      response.status(404).json({error: "Note not found"})
    }
  }).catch(err => {
    response.status(500).json({error: "Updating note failed."})
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})



