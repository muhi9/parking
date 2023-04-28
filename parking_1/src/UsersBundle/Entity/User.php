<?php

namespace UsersBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use FBaseBundle\Traits\BlameStampableEntity;
use FBaseBundle\Traits\SoftDeleteableEntity;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 * @ORM\Entity(repositoryClass="UsersBundle\Repository\UserRepository")
 * @UniqueEntity(fields={"email"}, errorPath="email", message="users.form.uniq_mail")
 * @UniqueEntity(fields={"username"}, errorPath="username", message="users.form.uniq_username")
 * @Gedmo\SoftDeleteable(fieldName="deletedAt")
 */
class User extends BaseUser
{
    use BlameStampableEntity;
    use SoftDeleteableEntity;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    
    
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     */
    private $firstName;

    

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     */
    private $middleName;

   
    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Assert\Length(max = 70)
     */
    private $lastName;

     /**
     * @ORM\OneToMany(targetEntity="UsersBundle\Entity\UserContact", mappedBy="user", orphanRemoval=true, cascade={"persist"})
     * @Assert\Valid()
     */
    private $phone;



    public function __construct()
    {
        parent::__construct();
        // your own logic
        $this->roles = array('ROLE_CLIENT');

    }

    public function getId()
    {
        return $this->id;
    }

     /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return User
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
     * Set middleName
     *
     * @param string $middleName
     *
     * @return User
     */
    public function setMiddleName($middleName)
    {
        $this->middleName = $middleName;

        return $this;
    }

    /**
     * Get middleName
     *
     * @return string
     */
    public function getMiddleName()
    {
        return $this->middleName;
    }

        /**
     * Set lastName
     *
     * @param string $lastName
     *
     * @return User
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
    public function getLstName()
    {
        return $this->lastName;
    }


    /**
     * Add phone.
     *
     * @param \UsersBundle\Entity\UserContact $phone
     *
     * @return User
     */
    public function addPhone(\UsersBundle\Entity\UserContact $phone)
    {
        $phone->setUser($this);
        $this->phone[] = $phone;

        return $this;
    }

    /**
     * Remove phone.
     *
     * @param \UsersBundle\Entity\UserContact $phone
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removePhone(\UsersBundle\Entity\UserContact $phone)
    {
        return $this->phone->removeElement($phone);
    }

    /**
     * Get phone.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPhone()
    {
        return $this->phone;
    }

    public function getLastName()
    {
        return $this->lastName;
    }


    public function getFullName($official = false)
    {          
        return $this->getFirstName() . ' ' . $this->getLastName();
    }

    

    public function setRoles(array $roles)
    {
        $this->roles = array();
        foreach ($roles as $role) {
            $this->addRole($role);
        }

        return $this;
    }
    public function getRoles()
    {
        $this->roles  = in_array('ROLE_SUPER_ADMIN', $this->roles) && !in_array('ROLE_ADMIN', $this->roles)?array_merge($this->roles, ['ROLE_ADMIN']):$this->roles;  
        return $this->roles;
    }
}
