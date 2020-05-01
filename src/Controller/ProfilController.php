<?php

namespace App\Controller;


use App\Entity\Matche;
use App\Entity\PlayerMatch;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use App\Entity\User;
use App\Entity\UserTeam;
use phpDocumentor\Reflection\Types\Object_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;



class ProfilController extends AbstractController
{
    /**
     * @Route("/profile/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getInfoUser(int $id){

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['userId' => $user]);
        $return = array();
        foreach ($userTeams as $userTeam){
            $category = $userTeam->getTeamRonvauId()->getCategory();
            $userMatchs = $this->getDoctrine()->getRepository(PlayerMatch::class)->findBy(['idUserTeam' => $userTeam]);
            $response = array('goal' => 0, 'yellowCard' => 0, 'redCard' => 0, 'played' => 0, 'team' => $category);
            foreach ($userMatchs as $userMatch){
                $response["goal"] += $userMatch->getGoal();
                $response["yellowCard"] += $userMatch->getYellowCard();
                $response["redCard"] += $userMatch->getRedCard();
                $response["played"] += $userMatch->getPlayed();
            }
            $return[] = $response;
        }

        return $this->json($return);
    }

    /**
     * @Route("/getNotificationsUser/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getNotificationsUser(int $id){
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['userId' => $user]);
        $return = array();
        foreach ($userTeams as $userTeam){
            $ronvauTeam = $userTeam->getTeamRonvauId();
            $playerMatches = $this->getDoctrine()->getRepository(PlayerMatch::class)->findBy(['idUserTeam' => $userTeam]);
            $matches = array();
            foreach ($playerMatches as $playerMatch){
                if ($playerMatch->getHasConfirmed() == false && $playerMatch->getHasRefused() == false){
                    $match = $playerMatch->getIdMatch();
                    $matches["name"] = $ronvauTeam->getCategory();
                    $matches["match"] = $match->getHomeTeam()->getClub()->getName()." - ". $match->getVisitorTeam()->getClub()->getName();
                    $matches["joueur"] = $playerMatch;
                    $return[] = $matches;
                }
            }
        }
        return $this->json($return);
    }
}