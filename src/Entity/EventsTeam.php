<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


/**
 * @ORM\Table(name="events_team", uniqueConstraints={
 *      @UniqueConstraint(name="event_team_unique",
 *          columns={"id_team_ronvau_id", "id_events_id"})
 *     }
 *  )
 * @ORM\Entity(repositoryClass="App\Repository\EventsTeamRepository")
 * @UniqueEntity(fields={"idTeamRonvau", "idEvents"}, message="Cette équipe est déjà inscrite à cet événement")
 * @ApiResource
 */
class EventsTeam
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\TeamRonvau", inversedBy="eventsTeams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"events_read"})
     */
    private $idTeamRonvau;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Event", inversedBy="eventsTeams")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idEvents;


    public function __construct()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdTeamRonvau(): ?TeamRonvau
    {
        return $this->idTeamRonvau;
    }

    public function setIdTeamRonvau(?TeamRonvau $idTeamRonvau): self
    {
        $this->idTeamRonvau = $idTeamRonvau;

        return $this;
    }

    public function getIdEvents(): ?Event
    {
        return $this->idEvents;
    }

    public function setIdEvents(?Event $idEvents): self
    {
        $this->idEvents = $idEvents;

        return $this;
    }
}
