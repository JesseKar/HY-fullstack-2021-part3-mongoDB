require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*let persons = [
    {
        name: "Arto Hellas",
        number: "123545",
        id: 1
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 2
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 3
      },
      {
        name: "Marja Hellas",
        number: "105109515",
        id: 4
      }
]*/

// Frontpage
app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

// Info page
app.get('/info', (req, res) => {
  Person.countDocuments({}, (err, count) => {
    if(err) {
      console.log(err)
    } else {
      console.log('count:', count)
      res.send(`<p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>`)
    }
  })
})

// Get all
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// Get by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Add
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log(body)
  // empty field and doubles handling
  if(!body.name) {
    return res.status(404).json({
      error: 'name missing'
    })
  }
  if(!body.number) {
    return res.status(404).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log(person)

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

// Delete
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Update
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

/*const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}*/
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})