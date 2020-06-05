import React, {useEffect, useState} from 'react';
import CompetitionsAPI from "../services/CompetitionsAPI";
import DateFunctions from "../services/DateFunctions";
import {Link} from "react-router-dom";


const MatchPages = props => {

    const {id} = props.match.params;

    const [matchs, setMatchs] = useState();
    const [matchDay, setMatchDay] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);

    const findMatchs = async () => {
        try {
            const response = await CompetitionsAPI.getMatchCompet(id);
            setMatchDay(Object.keys(response));
            setMatchs(response);
        } catch (e) {
            console.log(e);
        }
    }

    const selectMatchDay = ({ currentTarget }) => {
        setSelectedDay(currentTarget.value);
    }


    useEffect( () => {
        findMatchs();
    }, []);

    return(
        <>
            <div className="w-50 m-auto">
                <Link to={"/competition"} className={"btn btn-link float-right"}>Retour à la liste</Link>
                <select className="form-control w-50" id="matchDay" name={"matchDay"} onChange={selectMatchDay}>
                    {matchDay.map((opt,index) =>
                    <option key={index} value={opt}>journée numéro {opt}</option>
                    )}
                </select>
                <div className={"mt-3 bgGrey"}>
                    {typeof matchs != "undefined" && typeof selectedDay != 'undefined' && matchs[selectedDay].map((mat,index) =>
                        <div key={mat.id}>
                            <div className={"row m-2"}>
                                <div className="col-2">
                                    {mat.date != null && DateFunctions.dateFormatFrDMHM(mat.date) || "Non défini"}
                                </div>
                                <div className="col-4">
                                    {mat.homeTeam.club.name}
                                </div>
                                <div className="col-4">
                                    {mat.visitorTeam.club.name}
                                </div>
                                <div className="col-2">
                                    {
                                        (mat.homeTeamGoal != null && mat.homeTeamGoal.toString() || "")
                                        + " - " +
                                        (mat.visitorTeamGoal != null && mat.visitorTeamGoal.toString() || "")
                                    }
                                </div>
                            </div>
                        <hr/>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default MatchPages;