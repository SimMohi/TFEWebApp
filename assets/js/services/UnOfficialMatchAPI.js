import axios from 'axios';
import {
    API_URL,
    PLAYER_UNOFFICIAL_MATCHES_API,
    UNOFFICIAL_MATCH_API
} from "../config";

function findAll() {
    return axios
        .get(UNOFFICIAL_MATCH_API)
        .then(response => response.data["hydra:member"]);
}

function find(id){
    return axios
        .get(API_URL + "/unOffMatch/" + id)
        .then(response => response.data);
}

function create(unOffMatch){
    return axios.post(API_URL + "/createUnOff", unOffMatch);
}

function update(id, unOffMatch){
    return axios.put(UNOFFICIAL_MATCH_API + "/" + id, unOffMatch);
}

function deleteUnOffMatch(id){
    return axios.delete(UNOFFICIAL_MATCH_API + "/" + id);
}

function selectUnoff(data) {
    return axios.post(API_URL + "/selectUnoff", data);
}

function editDateUnOffMatch(data){
    return axios.post(API_URL + "/editDateUnOffMatch", data);
}

function delUnOffPl(data){
    return axios.post(API_URL + "/delUnOffPl", data);
}

function deletePlayerUnOffMatch(id){
    return axios.delete(PLAYER_UNOFFICIAL_MATCHES_API + "/"+ id);
}


function updatePlayer(data){
    return axios.put(API_URL + "/acceptConvoc", data);
}

function postEncodeUnOffMatch(data){
    return axios.post(API_URL + "/postEncodeUnOffMatch", data);
}

function calledPlayerUnOffMatch(id) {
    return axios
        .get(API_URL + "/calledPlayerUnOffMatch/" + id)
        .then(response => response.data);
}

function deleteUnOff(data){
    return axios.post(API_URL + "/deleteUnOff", data);
}


export default {
    findAll, find, create, update, deleteUnOffMatch, selectUnoff, delUnOffPl, editDateUnOffMatch, updatePlayer, deletePlayerUnOffMatch, postEncodeUnOffMatch, calledPlayerUnOffMatch, deleteUnOff
}