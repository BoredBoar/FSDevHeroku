import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'
const app = express()

console.log(Person)

morgan.token('entry', (req) => {
  if(Object.keys(req.body).length > 0){
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :entry'))


// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
    Person.find({})
      .then(persons => {
        response.json(persons)
      })
  })

  app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div></br>
        <div>${new Date().toString()}</div>
    `)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){response.json(person)}
    else{
        response.statusMessage = `Person with ID of ${request.params.id} was not found`
        response.status(404).end()
        }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    var exists = persons.find(person => person.id === id)
    if(exists) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }
    response.statusMessage = `Person with ID of ${request.params.id} was not found`
    response.status(404).end()
  })

  app.post('/api/persons', (request, response) => {
    const person = request.body
    var newID = Math.floor(Math.random() * 9999999);
    while(persons.find(person => person.id === newID)) {
        newID = Math.floor(Math.random() * max);
    }
    if (!person.name || !person.number) {
        response.status(406).json({error: `Person must contain BOTH a name and a number`})
        return
    }
    if (persons.find(x => x.name.toLowerCase() === person.name.toLowerCase())) {
        response.status(406).json({error: `${person.name} already exists in the phonebook!`})
        return
    } 
    persons = persons.concat({...person,id:newID})
    response.json({...person, id:newID})
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})