import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/cars/")
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get("http://localhost:8000/api/cars/" + id)
        .then(response => response.data);
}

function create(car){
    return axios.post("http://localhost:8000/api/cars", car);
}

function addPassenger(carPass){
    return axios.post("http://localhost:8000/api/car_passengers", carPass);
}

function delPassenger(id) {
    return axios.delete("http://localhost:8000/api/car_passengers/"+ id);

}

function update(id, car){
    return axios.put("http://localhost:8000/api/cars/" + id, car);
}

function updateCarPass(id, carPass){
    return axios.put("http://localhost:8000/api/car_passengers/" + id, carPass);
}

function patch(id, car){
    return axios.patch("http://localhost:8000/api/cars/" + id, car);
}

function deleteCar(id){
    return axios.delete("http://localhost:8000/api/cars/" + id);
}

export default {
    findAll, find, create, addPassenger, update, updateCarPass, patch, deleteCar, delPassenger
}