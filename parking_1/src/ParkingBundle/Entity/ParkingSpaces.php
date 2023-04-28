<?php

namespace ParkingBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;
use FBaseBundle\Traits\BlameStampableEntity;
use FBaseBundle\Traits\SoftDeleteableEntity;

/**
 * ParkingSpaces
 *
 * @ORM\Table(name="parking_spaces")
 * @ORM\Entity(repositoryClass="ParkingBundle\Repository\ParkingSpacesRepository")
 * @Gedmo\SoftDeleteable(fieldName="deletedAt")
 */
class ParkingSpaces
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
     * @ORM\Column(name="placeNumber", type="integer")
     * @Assert\Length(max = 70)
     * @Assert\NotBlank
     */
    private $placeNumber;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     * @Assert\NotBlank
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $typeOfMotorVehicle;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Assert\NotBlank
     */
    private $priceOfHour;

     /**
     *
     * @ORM\ManyToOne(targetEntity="ParkingBundle\Entity\Parking")
     * @ORM\JoinColumn(name="parking", referencedColumnName="id", nullable=false) 
     * @Assert\NotBlank(message="parking.form.contact.error.parking_is_blank")
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
     * Set place Number
     *
     * @param string $placeNumber
     *
     * @return ParkingSpaces
     */
    public function setPlaceNumber($placeNumber)
    {
        $this->placeNumber = $placeNumber;

        return $this;
    }

    /**
     * Get place Number
     *
     * @return string
     */
    public function getPlaceNumber()
    {
        return $this->placeNumber;
    }

     /**
     * Set Status
     *
     * @param string $Status
     *
     * @return ParkingSpaces
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get Status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set parking.
     *
     * @param \ParkingBundle\Entity\Parking $parking
     *
     * @return ParkingSpaces
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

    
    /**
     * Set typeOfMotorVehicle
     *
     * @param string $typeOfMotorVehicle
     *
     * @return ParkingSpaces
     */
    public function setTypeOfMotorVehicle($typeOfMotorVehicle)
    {
        $this->typeOfMotorVehicle = $typeOfMotorVehicle;

        return $this;
    }

    /**
     * Get typeOfMotorVehicle
     *
     * @return string
     */
    public function getTypeOfMotorVehicle()
    {
        return $this->typeOfMotorVehicle;
    }

    /**
     * Set priceOfHour
     *
     * @param string $priceOfHour
     *
     * @return ParkingSpaces
     */
    public function setPriceOfHour($priceOfHour)
    {
        $this->priceOfHour = $priceOfHour;

        return $this;
    }

    /**
     * Get priceOfHour
     *
     * @return string
     */
    public function getPriceOfHour()
    {
        return $this->priceOfHour;
    }

}
