<?php

namespace UsersBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;
use FBaseBundle\Traits\BlameStampableEntity;
use FBaseBundle\Traits\SoftDeleteableEntity;

/**
 * UserContact
 *
 * @ORM\Table(name="user_contact")
 * @ORM\Entity(repositoryClass="UsersBundle\Repository\UserContactRepository")
 * @Gedmo\SoftDeleteable(fieldName="deletedAt")
 */
class UserContact {
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
     *
     * @ORM\ManyToOne(targetEntity="UsersBundle\Entity\User")
     * @ORM\JoinColumn(name="user", referencedColumnName="id", nullable=false) 
     * @Assert\NotBlank(message="user.form.contact.error.user_is_blank")
     */
    private $user;


    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     */
    private $phone;

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
     * Set Phone.
     *
     * @param string $phone
     *
     * @return UserContact
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get Phone.
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }


    /**
     * Set User.
     *
     * @param \UsersBundle\Entity\User $user
     *
     * @return UserContact
     */
    public function setUser(\UsersBundle\Entity\User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get User.
     *
     * @return \UsersBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
}