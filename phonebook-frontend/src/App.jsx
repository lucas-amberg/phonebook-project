import { useState, useEffect } from 'react'
import phoneBookService from './services/phoneBookService'

//Error popup
const PopUpMessage = ({message, type}) => {
  if (message == null) {
    return null
  }
  return(<div className={type}>
    {message}
  </div>)
}

//Person Component
const Person = ({name, number, id, handleDelete}) => {
  return(
    <div>
      {name}&nbsp;
      {number} &nbsp;
      <button onClick={() => handleDelete(id, name)}>delete</button>
    </div>
  )
}

//Sets the filter at the top
const Filter = ({filterChange, text}) => {
  return (<div>filter shown with <input onChange={filterChange} value={text} />
  </div>)
}

//Allows you to add a new person to the backend

const PersonForm = ({
  submitButtonHandler, 
  nameChange, 
  numberChange, 
  nameText, 
  numberText}) => 
  {
  return(
    <form>
        <div>
          name: <input onChange={nameChange} value={nameText}/>
        </div>
        <div>
          number: <input onChange = {numberChange} value={numberText} />
        </div>
        <div>
          <button type="submit" onClick={submitButtonHandler}>add</button>
        </div>
      </form>
  )
}

const Persons = ({personList, handleDelete}) => {
  return (
    personList.map((person) => <Person key={person.id} name={person.name} number={person.number} id={person.id} handleDelete={handleDelete}/>))
}

const App = () => {

  const [persons, setPersons] = useState([])
  // console.log(`render ${persons.length} persons`)
  useEffect(()=> {
    document.title = "Phonebook"
    phoneBookService
      .retrievePersons()
      .then(initialPersons => {
        setPersons(initialPersons)
        setNewId(initialPersons.length + 1) //Sets the new id to the next numerical id available (eg 1, 2, 3, 4.. next will be 5)
        setShownPersons(initialPersons)
      })
  },[])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [shownPersons, setShownPersons] = useState(persons)
  const [popUpText, setPopUpText] = useState(null)
  const [popUpType, setPopUpType] = useState(null)
  const [newId, setNewId] = useState(null) //Set a new id hook to keep track of what ID to assign to new person

  const filterPersons = (filter, personsList = persons) => {
    setShownPersons(personsList.filter((person) => {
      return person.name.toLowerCase().includes(filter.toLowerCase())
    }))
  }

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`) === false) {
      return -1
    } 
    phoneBookService
      .deletePerson(id)
      .then(deletedPerson => {
        // console.log(`deleting person with id ${id}`)
        const newPersons = persons.filter((person) => {
          return person.id !== id
        })
        setPopUpType("success-pop-up")
        setPopUpText(`Deleted ${name} successfully.`)
        // console.log(newPersons)
        setPersons(newPersons)
        filterPersons(newFilter, newPersons)
        setTimeout(() => {
          setPopUpText(null)
          setPopUpType(null)
        },5000)
      })
  }


  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    if (event.target.value !== "") {
      filterPersons(event.target.value)
    }
    else {
      setShownPersons(persons)
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    const personExist = persons.find((person) => person.name === newName)
    if (personExist !== undefined) {
      if (window.confirm(`${personExist.name} is already added to the phone book, replace the old number with a new one?`)) {
        // console.log(personExist)
        phoneBookService
          .changePhoneNumber(personExist, newNumber)
          .then(updatedPerson => {
            const newPersons = persons.map((person) => {
              return person.id !== updatedPerson.id ? person : updatedPerson
            })
            setPersons(newPersons)
            filterPersons(newFilter, newPersons)
            setPopUpType("success-pop-up")
            setPopUpText(`Updated ${personExist.name} Phone Number to ${newNumber}`)
            setNewNumber("")
            setNewName("")
            setTimeout(() => {
              setPopUpText(null)
              setPopUpType(null)
            },5000)
          })
          .catch(error=> { 
            setPopUpType("fail-pop-up")
            setPopUpText(error.response.data.error)

            // const updatedPersons = persons.filter((person) => {
            //   return person.id !== personExist.id
            // })

            // setPersons(updatedPersons)
            // setShownPersons(updatedPersons)
            setTimeout(() => {
              setPopUpText(null)
              setPopUpType(null)
            },5000)
          })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: newId
      }
      const personNewId = newId
      setNewId(newId + 1) // Updates newId so the next person added will have the next ID available

      phoneBookService
        .uploadPerson(newPerson)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName("")  
          setNewNumber("")
          setPopUpType("success-pop-up")
          setPopUpText(`Added ${newPerson.name}`)
          console.log(newPerson.id)
          if (newFilter !== "") { //Makes sure no filters are applied and if they are they remain in place
            filterPersons(newFilter, persons.concat({name: newName, number: newNumber, id: newPerson.id}))
          }
          else { //Shows persons as normal without filter
            setShownPersons(persons.concat({name: newName, number: newNumber, id: newPerson.id}))
          }

          setTimeout(()=>{
            setPopUpType(null)
            setPopUpText(null)
          }, 5000)
        })
        .catch(error => { // Catches an error when the validation fails
          setPopUpText(error.response.data.error)
          setPopUpType("fail-pop-up")
          setTimeout(()=>{
            setPopUpType(null)
            setPopUpText(null)
          }, 5000)
        })

      
      
    }
    console.log("exit")
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <PopUpMessage message={popUpText} type={popUpType}/>
      <Filter 
        filterChange={handleFilterChange} 
        text={newFilter}
      />
      <h2>add a new</h2>

      <PersonForm 
        nameChange={handleNameChange}
        numberChange={handleNumberChange}
        nameText={newName}
        numberText={newNumber}
        submitButtonHandler={addNewPerson}
      />

      <h2>Numbers</h2>
      <Persons personList={shownPersons} handleDelete={handleDeletePerson}/>
      <br></br>
      <p>All names, numbers, and information on this page are fictitious. No identification with actual persons (living or deceased) is intended or should be inferred.</p>
    </div>
  )
}

export default App