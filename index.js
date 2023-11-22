const express = require("express")
const morgan = require("morgan")
const cors  =  require("cors")

morgan.token("data", (request) => {
    return JSON.stringify(request.body)
})

const app = express()
app.use(express.static("dist"))


app.use(express.json())
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

// Initial persons
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

let id = persons.length

// Function to generate new ID between 0 and 999 for new person
const newId = () => {
    id = id + 1
    return id
}

// Root page response

// Shows all persons
app.get("/api/persons", (request, response) => {
    response.send(persons)
})

// Shows individual person RESTfully by searching their ID
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    response.send(persons.find(person => person.id === id))
})

// Displays information about the API
app.get("/info", (request, response) => {
    const currentTime = new Date()
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
    `)
})

// Deletes a person based on their ID
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const lengthBefore = persons.length
    persons = persons.filter(person => person.id !== id)
    if (persons.length === lengthBefore) {
        response.status(404).end()
    }
    response.status(204).end()
})

// Adds a new person with a post request to /api/persons
app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    }
    else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }
    else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    const newPerson = {
        id: newId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)

    response.json(newPerson)
})
// Starts server

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})