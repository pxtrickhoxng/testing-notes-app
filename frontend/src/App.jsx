import Note from './components/Note.jsx'
import { useState, useEffect } from 'react'
import noteService from './services/notes.js'
import Alert from './components/Alert.jsx'
import Footer from './components/Footer.jsx'

const App = () => {
  const [notesState, setNotesState] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    noteService
    .getAll()
    .then(res => {
      setNotesState(res.data)
      console.log(res.data)
    })
  }, [])

  const addNote = (e) => {
    e.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      
    }

    noteService
    .create(noteObject)
    .then(res => {
      setNotesState(notesState.concat(res.data))
      setNewNote('') 
    })
    console.log(noteObject)
  }

  const handleNoteChange = (e) => {
    console.log(e.target.value)
    setNewNote(e.target.value)
  }

  const notesToShow = showAll 
  ? notesState 
  : notesState.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const note = notesState.find(note => note.id === id)
    const changeNote = {...note, important: !note.important}

    noteService
    .update(id, changeNote)
    .then(res => {
      setNotesState(notesState.map(note => note.id === id ? res.data : note))
    })
    .catch(err => {
      setErrorMessage(
        `Note '${note.content}' has already been removed!`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotesState(notesState.filter(note => note.id !== id))
    })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Alert errorMessage={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {Array.isArray(notesToShow) && notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder='a new note...'/>
        <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App