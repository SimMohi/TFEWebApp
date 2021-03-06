<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;




/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ApiResource(
 *  normalizationContext={
 *      "groups"={"users_read"}
 *  }
 * )
 * @UniqueEntity("email", message="Un utilisateur ayant cette adresse email existe déjà")
 * @ApiFilter(SearchFilter::class , properties={"email": "exact", "isAccepted": "exact"})
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"users_read", "cars_read", "team_ronvau_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"users_read"})
     * @Assert\NotBlank(message="L'email doit être renseigné !")
     * @Assert\Email(message="L'adresse email doit avoir un format valide !")
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups({"users_read"}) 
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Le mot de passe est obligatoire")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"users_read", "cars_read", "team_ronvau_read", "matchs_read"})
     * @Assert\NotBlank(message="Le prénom est obligatoire")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"users_read", "cars_read", "team_ronvau_read", "matchs_read"})
     * @Assert\NotBlank(message="Le nom de famille est obligatoire")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"users_read"})
     * @Assert\Length(min=9, minMessage="Le numéro de gsm/tel doit faire minimum 9 caractères", max=10, maxMessage="Le numéro de gsm/tel doit faire maximum 10 caractères")
     */
    private $gsm;


    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"users_read"})
     */
    private $profilePic;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTeam", mappedBy="userId", orphanRemoval=true)
     */
    private $userTeams;


    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Car", mappedBy="userId", orphanRemoval=true)
     */
    private $cars;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CarPassenger", mappedBy="user", orphanRemoval=true)
     */
    private $carPassengers;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"users_read"})
     */
    private $isAccepted;

    /**
     * @ORM\ManyToOne(targetEntity=Address::class, inversedBy="users")
     * @Groups({"users_read", "cars_read"})
     */
    private $address;

    /**
     * @ORM\OneToMany(targetEntity=Notification::class, mappedBy="user", orphanRemoval=true)
     */
    private $notifications;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $tokenMobile;


    /**
     * @ORM\Column(type="boolean")
     * @Groups({"users_read"})
     */
    private $rgpdVisibleStaff;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"users_read"})
     */
    private $rgpd;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $rgpdDate;


    /**
     * @ORM\Column(type="boolean")
     * @Groups({"users_read"})
     */
    private $rgpdVisibleAll;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastConnection;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"users_read"})
     */
    private $rgdpPhotos;


    /**
     * @ORM\OneToMany(targetEntity=CovoitChat::class, mappedBy="user", orphanRemoval=true)
     */
    private $covoitChats;


    public function __construct()
    {
        $this->rgpd = false;
        $this->userTeams = new ArrayCollection();
        $this->cars = new ArrayCollection();
        $this->carPassengers = new ArrayCollection();
        $this->isAccepted = false;
        $this->notifications = new ArrayCollection();
        $this->covoitChats = new ArrayCollection();
        $this->profilePic = "profile/logo.png";
        $this->rgpd = false;
        $this->rgdpPhotos = false;
        $this->lastConnection = new \DateTime();
        $this->rgpdVisibleAll = false;
        $this->rgpdVisibleStaff = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getGsm(): ?string
    {
        return $this->gsm;
    }

    public function setGsm(?string $gsm): self
    {
        $this->gsm = $gsm;

        return $this;
    }

    public function getProfilePic(): ?string
    {
        return $this->profilePic;
    }

    public function setProfilePic(?string $profilePic): self
    {
        $this->profilePic = $profilePic;

        return $this;
    }

    /**
     * @return Collection|UserTeam[]
     */
    public function getUserTeams(): Collection
    {
        return $this->userTeams;
    }

    public function addUserTeam(UserTeam $userTeam): self
    {
        if (!$this->userTeams->contains($userTeam)) {
            $this->userTeams[] = $userTeam;
            $userTeam->setUserId($this);
        }

        return $this;
    }

    public function removeUserTeam(UserTeam $userTeam): self
    {
        if ($this->userTeams->contains($userTeam)) {
            $this->userTeams->removeElement($userTeam);
            // set the owning side to null (unless already changed)
            if ($userTeam->getUserId() === $this) {
                $userTeam->setUserId(null);
            }
        }

        return $this;
    }


    /**
     * @return Collection|Car[]
     */
    public function getCars(): Collection
    {
        return $this->cars;
    }

    public function addCar(Car $car): self
    {
        if (!$this->cars->contains($car)) {
            $this->cars[] = $car;
            $car->setUserId($this);
        }

        return $this;
    }

    public function removeCar(Car $car): self
    {
        if ($this->cars->contains($car)) {
            $this->cars->removeElement($car);
            // set the owning side to null (unless already changed)
            if ($car->getUserId() === $this) {
                $car->setUserId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|CarPassenger[]
     */
    public function getCarPassengers(): Collection
    {
        return $this->carPassengers;
    }

    public function addCarPassenger(CarPassenger $carPassenger): self
    {
        if (!$this->carPassengers->contains($carPassenger)) {
            $this->carPassengers[] = $carPassenger;
            $carPassenger->setUser($this);
        }

        return $this;
    }

    public function removeCarPassenger(CarPassenger $carPassenger): self
    {
        if ($this->carPassengers->contains($carPassenger)) {
            $this->carPassengers->removeElement($carPassenger);
            // set the owning side to null (unless already changed)
            if ($carPassenger->getUser() === $this) {
                $carPassenger->setUser(null);
            }
        }

        return $this;
    }

    public function getIsAccepted(): ?bool
    {
        return $this->isAccepted;
    }

    public function setIsAccepted(bool $isAccepted): self
    {
        $this->isAccepted = $isAccepted;

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection|Notification[]
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): self
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications[] = $notification;
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): self
    {
        if ($this->notifications->contains($notification)) {
            $this->notifications->removeElement($notification);
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }

    public function getTokenMobile(): ?string
    {
        return $this->tokenMobile;
    }

    public function setTokenMobile(?string $tokenMobile): self
    {
        $this->tokenMobile = $tokenMobile;

        return $this;
    }

    public function getRgpd(): ?bool
    {
        return $this->rgpd;
    }

    public function setRgpd(bool $rgpd): self
    {
        $this->rgpd = $rgpd;

        return $this;
    }

    public function getRgpdDate(): ?\DateTimeInterface
    {
        return $this->rgpdDate;
    }

    public function setRgpdDate(\DateTimeInterface $rgpdDate): self
    {
        $this->rgpdDate = $rgpdDate;

        return $this;
    }

    /**
     * @return Collection|CovoitChat[]
     */
    public function getCovoitChats(): Collection
    {
        return $this->covoitChats;
    }

    public function addCovoitChat(CovoitChat $covoitChat): self
    {
        if (!$this->covoitChats->contains($covoitChat)) {
            $this->covoitChats[] = $covoitChat;
            $covoitChat->setUser($this);
        }

        return $this;
    }

    public function removeCovoitChat(CovoitChat $covoitChat): self
    {
        if ($this->covoitChats->contains($covoitChat)) {
            $this->covoitChats->removeElement($covoitChat);
            // set the owning side to null (unless already changed)
            if ($covoitChat->getUser() === $this) {
                $covoitChat->setUser(null);
            }
        }

        return $this;
    }

    public function getRgpdVisibleStaff(): ?bool
    {
        return $this->rgpdVisibleStaff;
    }

    public function setRgpdVisibleStaff(bool $rgpdVisibleStaff): self
    {
        $this->rgpdVisibleStaff = $rgpdVisibleStaff;

        return $this;
    }

    public function getRgpdVisibleAll(): ?bool
    {
        return $this->rgpdVisibleAll;
    }

    public function setRgpdVisibleAll(bool $rgpdVisibleAll): self
    {
        $this->rgpdVisibleAll = $rgpdVisibleAll;

        return $this;
    }

    public function getLastConnection(): ?\DateTimeInterface
    {
        return $this->lastConnection;
    }

    public function setLastConnection(?\DateTimeInterface $lastConnection): self
    {
        $this->lastConnection = $lastConnection;

        return $this;
    }

    public function getRgdpPhotos(): ?bool
    {
        return $this->rgdpPhotos;
    }

    public function setRgdpPhotos(bool $rgdpPhotos): self
    {
        $this->rgdpPhotos = $rgdpPhotos;

        return $this;
    }

}
