const mongoose = require("mongoose")

if (process.argv.length<3) {
    console.log("give your password, person name, and person number as an argument")
    process.exit(1)
}
else if (process.argv.length >= 3) {
    const password = process.argv[2]
    const url = 
    `mongodb+srv://mongo-access:${password}@phonebook-cluster.b014m5d.mongodb.net/phonebookApp?retryWrites=true&w=majority`
    
    if (process.argv.length === 3) {
        mongoose.set("strictQuery", false)
        mongoose.connect(url)

        const personSchema = new mongoose.Schema({
            name: String,
            number: String
        })
        const Person = mongoose.model("Person", personSchema)
        Person.find({}).then(result => {
            console.log("phonebook:")
            result.forEach(person => console.log(`${person.name} ${person.number}`))
            mongoose.connection.close()
        })
        
    }
    else {
        const newName = process.argv[3]
        const newNumber = process.argv[4]

        mongoose.set("strictQuery", false)
        mongoose.connect(url)

        const personSchema = new mongoose.Schema({
            name: String,
            number: String
        })

        const Person = mongoose.model("Person", personSchema)

        const newPerson = new Person({
            name: newName,
            number: newNumber
        })

        newPerson.save().then(result => {
            console.log(`added ${newName} number ${newNumber} to phonebook`)
            mongoose.connection.close()
        })
    }
}


