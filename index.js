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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
      .then(persons => {
        response.json(persons)
      }).catch(error => next(error))
  })

  // app.get('/info', (request, response) => {
  //   response.send(`<div>Phonebook has info for ${persons.length} people</div></br>
  //       <div>${new Date().toString()}</div>
  //   `)
  // })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if(person){response.json(person)}
        else{
            response.statusMessage = `Person with ID of ${request.params.id} was not found`
            response.status(404).end()
        }
      }).catch(err => next(err))
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    // if(person){response.json(person)}
    // else{
    //     response.statusMessage = `Person with ID of ${request.params.id} was not found`
    //     response.status(404).end()
    //     }
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        if(result) {
          response.status(204).end()
        } else {
          response.statusMessage = `Person with ID of ${request.params.id} was not found`
          response.status(404).end()
        }
      }).catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndUpdate(request.params.id, {number: request.body.number})
      .then(result => {
        console.log(`Updated ${result.name} to number ${result.number}`)
        response.json(result)
      }).catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const person = new Person({
      name: request.body.name,
      number: request.body.number
    })
    person.save().then(result => {
      console.log('added', `${result.name} number ${result.number}`, 'to phonebook')
      response.json(result)
    }).catch(error => next(error))
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
  } 
  
  // handler of requests with result to errors
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})