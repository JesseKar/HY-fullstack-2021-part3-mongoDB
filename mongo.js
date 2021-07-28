/*const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.tt8ao.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Saving persons to phonebook
// node mongo.js yourPasswordHere "Name Here" 010-0000000
if(process.argv.length === 5) {
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
    })
    person.save().then(result => {
        console.log(result);
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close()
    })
}

// Hakee ja printtaa kaikki tietokannasta.
// Haun voisi tehdä tärkeiden osalta esim:
// Person.find({ important: true }).then...
Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })*/