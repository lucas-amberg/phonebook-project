require("dotenv").config()

const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URL

console.log("connecting to mongodb+srv://mongo-access:<PASSWORD>@phonebook-cluster.b014m5d.mongodb.net/phonebookApp?retryWrites=true&w=majority")

mongoose.connect(url) //Connects to database
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB, error: ", error.message)
    })

//Template for Person Document in Mongo Cluster
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 7,
        required: true
    }
})

//Makes it so the API does not display a __v and _id attribute because they are unnessessary
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)