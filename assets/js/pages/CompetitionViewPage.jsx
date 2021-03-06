import React, {useEffect, useState} from 'react';
import ClubsAPI from "../services/ClubsAPI";
import TeamsAPI from "../services/TeamsAPI";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";
import authAPI from "../services/authAPI";

const  CompetitionViewPage = props => {

    const {id} = props.match.params;
    const isAdmin = authAPI.getIsAdmin();
    const [name, setName] = useState("");
    const [teams, setTeams] = useState([]);

    const getTeams = async () => {
        try{
            const teamsCompet = await CompetitionsAPI.getRanking(id);
            setName(teamsCompet["name"]);
            setTeams(teamsCompet["rank"]);
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        getTeams();
    }, [id]);

    function orderByPoints(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.points;
        const bandB = b.points;

        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    const orderTeams = [...teams];
    orderTeams.sort(orderByPoints);

    return (
      <>
          <Link to={"/competition"} className={"btn btn-danger "}><i className="fas fa-arrow-left"/></Link>
          {isAdmin &&
          <Link to={"/competition/" + id + "/matchs"} className={"btn btn-warning float-right"}>Ajouter des matchs</Link>
          }
          <h3 className={"text-center mb-5"}>Classement {name}</h3>
          <table className="table table-hover whiteBorder">
              <thead>
              <tr>
                  <th></th>
                  <th>Equipe</th>
                  <th>Jouer</th>
                  <th>Gagner</th>
                  <th>Nul</th>
                  <th>Perdu</th>
                  <th>Points</th>
              </tr>
              </thead>
              <tbody>
              {orderTeams.map((team, index) =>
                  <tr key={team.id}>
                      <td>{index+1}</td>
                      <td>{team.name}</td>
                      <td>{team.played}</td>
                      <td>{team.won} </td>
                      <td>{team.drawn}</td>
                      <td>{team.lost}</td>
                      <td>{team.points}</td>
                  </tr>
              )}
              </tbody>
          </table>
      </>
    );
}

export default CompetitionViewPage ;