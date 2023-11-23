require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const cors  =  require("cors")
const Person = require("./models/person.js")

morgan.token("data", (request) => {
    return JSON.stringify(request.body)
})

const app = express() //Sets app to express
app.use(express.static("dist")) //Sets frontend to dist directory
app.use(express.json())
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))



// OLD OG LIST OF NUMBERS AND NAMES
// Initial persons
// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// let id = persons.length

// Function to generate new ID between 0 and 999 for new person
const newId = () => {
    id = id + 1
    return id
}

// Root page response

// Shows all persons
app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Shows individual person RESTfully by searching their ID
app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

// Displays information about the API
app.get("/info", (request, response) => {
    const currentTime = new Date()
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
    `)
})

//OLD FUNCTIONALITY FOR DELETING
// Deletes a person based on their ID
// app.delete("/api/persons/:id", (request, response) => {
//     const id = Number(request.params.id)
//     const lengthBefore = persons.length
//     persons = persons.filter(person => person.id !== id)
//     if (persons.length === lengthBefore) {
//         response.status(404).end()
//     }
//     response.status(204).end()
// })

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log("error recieved: ", error.message)
            next(error)
        })
})

// Adds a new person with a post request to /api/persons
app.post("/api/persons", (request, response) => {
    const body = request.body
    console.log(request.body)
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
    // else if (Person.find({name: body.name})) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

//Handles all requests that reach an unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

//Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    //Handles all requests that aren't to a properly formatted ID
    if (error.name === "CastError") {
        return response.status(400).send({error: "malformatted id"})
    }

    next(error)
}

app.use(errorHandler)


// Starts server

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})