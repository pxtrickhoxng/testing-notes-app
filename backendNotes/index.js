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
    const note = notes.find(note => note.id === id)
    
  
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body
  console.log(body)

  const noteIndex = notes.findIndex(note => note.id === id)

  if (noteIndex === -1) {
    return response.status(404).json({ error: 'note not found' })
  }

  const updatedNote = {
    id: notes[noteIndex].id,
    content: body.content ?? notes[noteIndex].content,
    important: typeof body.important === 'boolean' ? body.important : notes[noteIndex].important,
  }

  notes[noteIndex] = updatedNote

  response.json(updatedNote)
})


const PORT = process.env.PORT

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})



