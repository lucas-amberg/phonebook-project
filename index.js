const express = require("express")
const app = express()

app.use(express.json())

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

const newId = () => {
    const id = Math.floor(Math.random()*1000)
    
    return id
}

app.get("/", (request, response) => {
    response.send("<h1>Hello, welcome to the phonebook API</h1>")
})

app.get("/api/persons", (request, response) => {
    response.send(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    response.send(persons.find(person => person.id === id))
})

app.get("/info", (request, response) => {
    const currentTime = new Date()
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
    `)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const lengthBefore = persons.length
    persons = persons.filter(person => person.id !== id)
    if (persons.length === lengthBefore) {
        response.status(404).end()
    }
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    console.log(body)
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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})