import axios from "axios";

const baseURL = "/api/persons"

const retrievePersons = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const uploadPerson = (personObject) => {
    const request = axios.post(baseURL, personObject)
    console.log("ran")
    return request.then(response => response.data)
}

const deletePerson = id => {
    const url = `${baseURL}/${id}`
    const request = axios.delete(url)
    return request.then(response => response.data)
}

const changePhoneNumber = (person, updatedNumber) => {
    const url = `${baseURL}/${person.id}`
    const newPerson = {...person, number: updatedNumber}
    const request = axios.put(url, newPerson)
    return request.then(response => response.data)
}

export default {retrievePersons, uploadPerson, deletePerson, changePhoneNumber}