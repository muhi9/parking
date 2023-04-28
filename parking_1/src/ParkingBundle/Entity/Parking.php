<?php

namespace ParkingBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Mapping\Annotation as Gedmo;
use FBaseBundle\Traits\BlameStampableEntity;
use FBaseBundle\Traits\SoftDeleteableEntity;

use ParkingBundle\Entity\ParkingSpaces;


/**
 * Parking
 *
 * @ORM\Table(name="parking")
 * @ORM\Entity(repositoryClass="ParkingBundle\Repository\ParkingRepository")
 * @Gedmo\SoftDeleteable(fieldName="deletedAt")
 */
class Parking
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
     * @ORM\ManyToOne(targetEntity="UsersBundle\Entity\User")
     * @ORM\JoinColumn(name="owner", referencedColumnName="id", nullable=false) 
     * @Assert\NotBlank(message="parking.form.error.owner_is_blank")
     */
    private $owner;

     /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\NotBlank
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     * @Assert\NotBlank
     */
    private $address;


    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     */
    private $longitude;

    /**
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    private $longitude_units;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $longitude_units_normalized;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     */
    private $latitude;

    /**
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    private $latitude_units;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $latitude_units_normalized;
    
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     */
    private $workTime;

    /**
     * @ORM\OneToMany(targetEntity="ParkingBundle\Entity\ParkingSpaces", mappedBy="parking", orphanRemoval=true, cascade={"persist"})
     * @Assert\Valid()
     */
    private $spaces;



    
    public function __construct()
    {
        $this->spaces = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->name;
    }

     /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }


    public function getOwner()
    {
        return $this->owner;
    }

    public function setOwner($owner)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * Set Name
     *
     * @param string $name
     *
     * @return Parking
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get Name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set address
     *
     * @param string $address
     *
     * @return Parking
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set longitude
     *
     * @param string $longitude
     *
     * @return Parking
     */
    public function setlongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * Get longitude
     *
     * @return string
     */
    public function getlongitude()
    {
        return $this->longitude;
    }

    /**
     * Set latitude
     *
     * @param string $latitude
     *
     * @return Parking
     */
    public function setlatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return string
     */
    public function getlatitude()
    {
        return $this->latitude;
    }
    
    /************************ latitudeUnits *********************************** */

      /**
     * Set latitudeUnits.
     *
     * @param string $latitudeUnits
     *
     * @return Parking
     */
    public function setLatitudeUnits($latitudeUnits)
    {
        $this->latitude_units = $latitudeUnits;

        return $this;
    }

    /**
     * Get latitudeUnits.
     *
     * @return string
     */
    public function getLatitudeUnits()
    {
        return $this->latitude_units;
    }

   

    /************************ longitudeUnits *********************************** */

      /**
     * Set longitudeUnits.
     *
     * @param string $longitudeUnits
     *
     * @return Parking
     */
    public function setLongitudeUnits($longitudeUnits)
    {
        $this->longitude_units = $longitudeUnits;

        return $this;
    }

    /**
     * Get latUnits.
     *
     * @return string
     */
    public function getLongitudeUnits()
    {
        return $this->longitude_units;
    }

    /************************************************************************* */

    /**
     * Set latUnitsNormalized.
     *
     * @param string|null $latUnitsNormalized
     *
     * @return Parking
     */
    public function setLatUnitsNormalized($latUnitsNormalized = null)
    {
        $this->lat_units_normalized = $latUnitsNormalized;

        return $this;
    }

    /**
     * Get latUnitsNormalized.
     *
     * @return string|null
     */
    public function getLatUnitsNormalized()
    {
        return $this->lat_units_normalized;
    }
/************************* Longitude ******************************************** */
    /**
     * Set longitudeUnitsNormalized.
     *
     * @param string|null $longitude_units_normalized
     *
     * @return Parking
     */
    public function setLongitudeUnitsNormalized($longitudeUnitsNormalized = null)
    {
        $this->longitude_units_normalized = $longitudeUnitsNormalized;

        return $this;
    }
    /**
     * Get longitudeUnitsNormalized.
     *
     * @return string|null
     */
    public function getLongitudeUnitsNormalized()
    {
        return $this->longitude_units_normalized;
    }

/********************* Latitude ************************************************* */
    
    /**
     * Set latitudeUnitsNormalized.
     *
     * @param string|null $latitude_units_normalized
     *
     * @return Parking
     */

    public function setLatitudeUnitsNormalized($latitudeUnitsNormalized = null)
    {
        $this->latitude_units_normalized = $latitudeUnitsNormalized;

        return $this;
    }

    /**
     * Get latitudeUnitsNormalized.
     *
     * @return string|null
     */
    public function getLatitudeUnitsNormalized()
    {
        return $this->latitude_units_normalized;
    }

/********************************************************************** */
    /**
     * Set lngUnitsNormalized.
     *
     * @param string|null $lngUnitsNormalized
     *
     * @return Parking
     */
    public function setLngUnitsNormalized($lngUnitsNormalized = null)
    {
        $this->lng_units_normalized = $lngUnitsNormalized;

        return $this;
    }

    /**
     * Get lngUnitsNormalized.
     *
     * @return string|null
     */
    public function getLngUnitsNormalized()
    {
        return $this->lng_units_normalized;
    }
    
    /**
     * Set workTime
     *
     * @param string $workTime
     *
     * @return Parking
     */
    public function setWorkTime($workTime)
    {
        $this->workTime = $workTime;

        return $this;
    }

    /**
     * Get workTime
     *
     * @return string
     */
    public function getWorkTime()
    {
        return $this->workTime;
    }

    /**
     * Add spaces.
     *
     * @param \ParkingBundle\Entity\ParkingSpaces $spaces
     *
     * @return Parking
     */
    public function addSpace(ParkingSpaces $space)
    {
        $space->setParking($this);
        $this->spaces[] = $space;

        return $this;
    }

    /**
     * Remove spaces.
     *
     * @param \ParkingBundle\Entity\ParkingSpaces $spaces
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeSpace(ParkingSpaces $spaces)
    {
        return $this->spaces->removeElement($spaces);
    }

    /**
     * Get spaces.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSpaces()
    {
        return $this->spaces;
        /*return $this->spaces->filter(function($contact) {
            return $contact->getContactType() && $contact->getContactType()->getType()->getNameKey()=='user.spaces';
        });*/
    }

    /**
     * Add rezervation.
     *
     * @param \ParkingBundle\Entity\Reservation $rezervation
     *
     * @return Parking
     */
    public function addReservation(Reservation $rezervation)
    {
        $rezervation->setParking($this);
        $this->rezervation[] = $rezervation;

        return $this;
    }

    /**
     * Remove rezervation.
     *
     * @param \ParkingBundle\Entity\Reservation $rezervation
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeReservation(Reservation $rezervation)
    {
        return $this->rezervation->removeElement($rezervation);
    }

    /**
     * Get rezervation.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getReservation()
    {
        return $this->rezervation;
        /*return $this->spaces->filter(function($contact) {
            return $contact->getContactType() && $contact->getContactType()->getType()->getNameKey()=='user.spaces';
        });*/
    }
      
    public function getFreeSpaces()
    {
         return $this->spaces->filter(function($space) {
           return $space->getStatus()=='available';
        });
    }
    
    public function getBusySpaces()
    {
         return $this->spaces->filter(function($space) {
           return $space->getStatus()=='busy';
        });
    }

    public function getSpaceNum()
    {
         return $this->spaces->filter(function($space) {
           return $space->getPlaceNumber();
        });
    }

}
