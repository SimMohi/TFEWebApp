import React, {useEffect, useState} from 'react';
import ClubsAPI from "../services/ClubsAPI";
import TeamsAPI from "../services/TeamsAPI";
import {Link} from "react-router-dom";
import CompetitionsAPI from "../services/CompetitionsAPI";

const  CompetitionViewPage = props => {

    const {id} = props.match.params;

    const [teams, setTeams] = useState([]);

    const getTeams = async () => {
        try{
            const teamsCompet = await CompetitionsAPI.findTeam(id);
            teamsCompet.forEach(function (teamcompet) {
            })
            setTeams(teamsCompet);
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        getTeams();
    }, [id]);

    function orderByPoints(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.nbrPoints;
        const bandB = b.nbrPoints;

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

    console.log(teams);
    return (
      <>
          <table className="table table-hover text-">
              <thead>
              <tr>
                  <th>Identifiant</th>
                  <th>Nom</th>
                  <th>Jouer</th>
                  <th>Gagner</th>
                  <th>Nul</th>
                  <th>Perdu</th>
                  <th>Points</th>
              </tr>
              </thead>
              <tbody>
              {orderTeams.map(team =>
                  <tr key={team.id}>
                      <td>{team.id}</td>
                      <td>{team.club.name}</td>
                      <td>{team.nbrMatchs}</td>
                      <td>{team.won || 0} </td>
                      <td>{team.drawn || 0}</td>
                      <td>{team.lost || 0}</td>
                      <td>{team.nbrPoints || 0}</td>
                  </tr>
              )}
              </tbody>
          </table>

          <Link to={"/competition/"+id+"/matchs"} className={"btn btn-info float-right"}>Ajouter des matchs</Link>
      </>
    );
}

export default CompetitionViewPage ;