import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CovoitPage from "./CovoitPage";
import CovoitAPI from "../services/CovoitAPI";
import Moment from "react-moment";
import {toast} from "react-toastify";
import authAPI from "../services/authAPI";

const CovoitsPage = props => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [covoits, setCovoits] = useState([]);
    const [userConnected, setUserConnected] = useState({});
    const [carPassenger, setCarPassenger] = useState({
        user: "",
        car: ""
    });

    const findCovoits = async () => {
        try {
            const data = await CovoitAPI.findAll();
            setCovoits(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleDelete = async id => {
        const originalsCovoit = [...covoits];
        setCovoits(covoits.filter(covoit => covoit.id !== id));
        try {
            await CovoitAPI.deleteCar(id);
            toast.success("Le covoiturage a bien été supprimé");
        } catch (error) {
            setCovoits(originalsCovoit);
            toast.error("La suppression a échoué");
        }
    };

    const getUserConnected = async () => {
        try{
            const userInfo = await authAPI.getUserInfo();
            setUserConnected(userInfo[0]);
        } catch (error) {
            console.log(error.response);
        }
    }

    const subscribe = id => {
        const user = userConnected["@id"];
        const car = "/api/cars/"+id;
        setCarPassenger({ user, car});
    }

    const addPassenger = async () =>{
        try {
            await CovoitAPI.addPassenger(carPassenger);
            toast.success("Vous vous êtes bien inscrit au covoiturage");
        } catch (e) {
            toast.error("L'inscription au covoiturage a échoué");
        }
    }

    useEffect( () => {
        findCovoits();
        getUserConnected();
    }, [show]);

    useEffect( () => {
        if (carPassenger["user"] != '' && carPassenger["car"] != ""){
            addPassenger();
        }
    }, [carPassenger]);

    console.log(covoits);
    console.log(carPassenger);

    return(
        <>
            <h1>Espace covoiturage </h1>
            <Button className="btn btn-primary float-right mb-3" onClick={handleShow}>
                Nouveau covoiturage
            </Button>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Conducteur</th>
                    <th>Lieu de départ</th>
                    <th>Date et heure</th>
                    <th>places restantes</th>
                </tr>
                </thead>
                <tbody>
                {covoits.map(covoit =>
                    <tr key={covoit.id}>
                        <td>{covoit.userId["firstName"]+" "+covoit.userId["lastName"]}</td>
                        <td>{covoit.departurePlace}</td>
                        <td>
                            <Moment format="YYYY-MM-DD HH:mm">
                                {covoit.date}
                            </Moment>
                        </td>
                        <td>{covoit.placeRemaining}</td>
                        {covoit["carPassengers"].map(passenger =>
                            passenger.user["@id"] == userConnected["@id"] && <td>coucou</td> || <td>salut</td>

                        )}
                        <td>
                            <td><button onClick={() => subscribe(covoit.id)} className="btn btn-sm btn-success mr-3">S'inscire</button></td>
                            <button onClick={() => handleDelete(covoit.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nouveau covoiturage</Modal.Title>
                </Modal.Header>
                <Modal.Body><CovoitPage id={"new"}/></Modal.Body>
            </Modal>
        </>
    )
}

export default CovoitsPage;