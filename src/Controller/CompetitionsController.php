<?php


namespace App\Controller;

use App\Entity\Club;
use App\Entity\Competition;
use App\Entity\Matche;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;


class CompetitionsController extends AbstractController
{
    /**
     * Get the competitions where Ronvau is in
     * @Route("/getCompetitionsRonvau")
     */
    public function getCompetitionsRonvau()
    {
        $ronvau = $this->getDoctrine()->getRepository(Club::class)->findOneBy(['name' => "F.C. Ronvau Chaumont"]);
        $teams = $this->getDoctrine()->getRepository(Team::class)->findBy(['club' => $ronvau->getId()]);
        $response = array();
        foreach ($teams as $team){
            $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $team->getCompetition()->getId()]);
            $add = array();
            $add["id"] = $competition->getId();
            $add["name"] = $competition->getName();
            $add["team"] = $team->getId();
            $response[] = $add;
        }

        return $this->json(
            $response
        );
    }

    /**
     * Get Matches for one competition and one matchDay
     * @Route("/getMatchCompetition/{idCompet}/{matchDay}")
     * @param int $idCompet
     * @param int $matchDay
     * @return JsonResponse
     */
    public function getMatchCompetition(int $idCompet, int $matchDay){

        $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $idCompet]);

        $teams = $this->getDoctrine()->getRepository(Team::class)->findBy(['competition' => $competition]);
        $response = array();
        $double = array();
        if (count($teams) >= 0){
            foreach ($teams as $team){
                $matchA = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['homeTeam' => $team, 'matchDay' => $matchDay]);
                $matchB = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['visitorTeam' => $team, 'matchDay' => $matchDay]);
                if($matchA !== null) {
                    $add = array();
                    $add["id"] = $matchA->getId();
                    $add["homeTeam"] = $matchA->getHomeTeam();
                    $add["visitorTeam"] = $matchA->getVisitorTeam();
                    $add["homeTeamGoal"] = $matchA->getHomeTeamGoal();
                    $add["visitorTeamGoal"] = $matchA->getVisitorTeamGoal();
                    $add["isOver"] = $matchA->getIsOver();
                    if (!in_array($add["id"], $double)){
                        $double[] = $add["id"];
                        $response[] = $add;
                    }
                } elseif ($matchB !== null){
                    $add = array();
                    $add["id"] = $matchB->getId();
                    $add["homeTeam"] = $matchB->getHomeTeam();
                    $add["visitorTeam"] = $matchB->getVisitorTeam();
                    $add["homeTeamGoal"] = $matchB->getHomeTeamGoal();
                    $add["visitorTeamGoal"] = $matchB->getVisitorTeamGoal();
                    $add["isOver"] = $matchB->getIsOver();
                    if (!in_array($add["id"], $double)){
                        $double[] = $add["id"];
                        $response[] = $add;
                    }
                }
            }
        }
        return $this->json($response);
    }

    /**
     * Get Ranking for one competition
     * @Route("/getRankingCompetition/{idCompet}")
     * @param int $idCompet
     * @return JsonResponse
     */
    public function getRankingCompetition(int $idCompet){

        $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $idCompet]);

        $teams = $competition->getTeams();
        $response = array();
        foreach ($teams as $team){
            $teamRes = array();
            $teamRes["id"] = $team->getId();
            $teamRes["name"] = $team->getClub()->getName();
            $teamRes["won"] = 0;
            $teamRes["drawn"] = 0;
            $teamRes["lost"] = 0;
            $matchAs = $this->getDoctrine()->getRepository(Matche::class)->findBy(['homeTeam' => $team]);
            $matchBs = $this->getDoctrine()->getRepository(Matche::class)->findBy(['visitorTeam' => $team]);
            foreach ($matchAs as $matchA){
                if ($matchA->getHomeTeamGoal() > $matchA->getVisitorTeamGoal()){
                    $teamRes["won"] = $teamRes["won"] +1;
                } elseif ($matchA->getHomeTeamGoal() < $matchA->getVisitorTeamGoal()){
                    $teamRes["lost"] = $teamRes["lost"] +1;
                } elseif ($matchA->getHomeTeamGoal() == $matchA->getVisitorTeamGoal()){
                    $teamRes["drawn"] = $teamRes["drawn"] +1;
                }
            }
            foreach ($matchBs as $matchB){
                if ($matchB->getHomeTeamGoal() < $matchB->getVisitorTeamGoal()){
                    $teamRes["won"] = $teamRes["won"] +1;
                } elseif ($matchB->getHomeTeamGoal() > $matchB->getVisitorTeamGoal()){
                    $teamRes["lost"] = $teamRes["lost"] +1;
                } elseif ($matchB->getHomeTeamGoal() == $matchB->getVisitorTeamGoal()){
                    $teamRes["drawn"] = $teamRes["drawn"] +1;
                }
            }
            $teamRes["points"] = $teamRes["won"] *3 + $teamRes["drawn"];
            $teamRes["played"] = $teamRes["won"] + $teamRes["drawn"] + $teamRes["lost"];
            $response[] = $teamRes;
        }
        return $this->json($response);
    }

    /**
     * Get the matches for the ronvauTeam
     * @Route("/getRonvauTeamMatch/{idRTeam}")
     * @param int $idRTeam
     */
    public function getRonvauTeamMatch(int $idRTeam){
        $ronvauTeam = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $idRTeam]);
        $category = $ronvauTeam->getCategory();
        $team = $ronvauTeam->getTeam();
        $competition = $team->getCompetition();
        $ronvau = $this->getDoctrine()->getRepository(Club::class)->findOneBy(['name' => "F.C. Ronvau Chaumont"]);
        $team = $this->getDoctrine()->getRepository(Team::class)->findOneBy(['club' => $ronvau->getId(), 'competition' => $competition->getId()]);

        $matchAs = $this->getDoctrine()->getRepository(Matche::class)->findBy(['homeTeam' => $team]);
        $matchBs = $this->getDoctrine()->getRepository(Matche::class)->findBy(['visitorTeam' => $team]);
        $response = array();
        $response["cat"] = $category;
        if (count($matchAs) > 0){
            foreach ($matchAs as $matchA){
                $add = array();
                $add["id"] = $matchA->getId();
                $add["homeTeam"] = $matchA->getHomeTeam();
                $add["visitorTeam"] = $matchA->getVisitorTeam();
                $add["homeTeamGoal"] = $matchA->getHomeTeamGoal();
                $add["visitorTeamGoal"] = $matchA->getVisitorTeamGoal();
                $add["isOver"] = $matchA->getIsOver();
                $add["matchDay"] = $matchA->getMatchDay();
                $add["date"] = $matchA->getDate();
                $response["matchs"][] = $add;
            }
        }
        if (count($matchBs) > 0){
            foreach ($matchBs as $matchB){
                $add = array();
                $add["id"] = $matchB->getId();
                $add["homeTeam"] = $matchB->getHomeTeam();
                $add["visitorTeam"] = $matchB->getVisitorTeam();
                $add["homeTeamGoal"] = $matchB->getHomeTeamGoal();
                $add["visitorTeamGoal"] = $matchB->getVisitorTeamGoal();
                $add["isOver"] = $matchB->getIsOver();
                $add["matchDay"] = $matchB->getMatchDay();
                $add["date"] = $matchB->getDate();
                $response["matchs"][] = $add;
            }
        }
        return $this->json($response);
    }
}