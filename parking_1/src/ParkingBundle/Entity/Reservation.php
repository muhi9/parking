<?php

namespace ParkingBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use FBaseBundle\Traits\BlameStampableEntity;
use FBaseBundle\Traits\SoftDeleteableEntity;

/**
 * Reservation
 *
 * @ORM\Table(name="reservation")
 * @ORM\Entity(repositoryClass="ParkingBundle\Repository\ReservationRepository")
 */
class Reservation
{
    use BlameStampableEntity;
    use SoftDeleteableEntity;
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\NotBlank
     * @Assert\Length(max = 70)
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     * @Assert\NotBlank
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\NotBlank
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\NotBlank
     */
    private $typeVehicle;

     /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\NotBlank(message="rezervation.form.error.date.notempty")
     */
    private $dateFrom;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\GreaterThan(propertyPath="dateFrom", message="rezervation.to.error.date.end_is_less")
     */
    private $dateTo;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $status = 'new';

     /**
     *
     * @ORM\ManyToOne(targetEntity="ParkingBundle\Entity\Parking")
     * @ORM\JoinColumn(name="parking", referencedColumnName="id", nullable=false) 
     * @Assert\NotBlank(message="parking.form.error.parking_is_blank")
     */
    private $parking;


    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

     /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return Reservation
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     *
     * @return Reservation
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return Reservation
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set typeVehicle
     *
     * @param string $typeVehicle
     *
     * @return Reservation
     */
    public function setTypeVehicle($typeVehicle)
    {
        $this->typeVehicle = $typeVehicle;

        return $this;
    }

    /**
     * Get typeVehicle
     *
     * @return string
     */
    public function getTypeVehicle()
    {
        return $this->typeVehicle;
    }

    /**DateFrom
     */
    public function getDateFrom()
    {
        return $this->dateFrom;
    }

    public function setDateFrom($dateFrom)
    {
        $this->dateFrom = $dateFrom;

        return $this;
    }

    /*DateTO 
    */
    public function getDateTo()
    {
        return $this->dateTo;
    }

    public function setDateTo($dateTo)
    {
        $this->dateTo = $dateTo;

        return $this;
    }

    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    public function getStatus()
    {
        return $this->status;
    }

     /**
     * Set parking.
     *
     * @param \ParkingBundle\Entity\Parking $parking
     *
     * @return Reservation
     */
    public function setParking(\ParkingBundle\Entity\Parking $parking)
    {
        $this->parking = $parking;

        return $this;
    }

    /**
     * Get Parking.
     *
     * @return \ParkingBundle\Entity\Parking
     */
    public function getParking()
    {
        return $this->parking;
    }
}
