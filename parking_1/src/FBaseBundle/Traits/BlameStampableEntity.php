<?php

namespace FBaseBundle\Traits;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use UsersBundle\Entity\User;


/**
 * Blameable Trait, usable with PHP >= 5.4
 *
 * @author David Buchmann <mail@davidbu.ch>
 * @license MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
trait BlameStampableEntity
{
    /**
     * @var User
     * @Gedmo\Blameable(on="create")
     * @ORM\ManyToOne(targetEntity="UsersBundle\Entity\User")
     * @ORM\JoinColumn(name="created_by", referencedColumnName="id")
     */
    protected $createdBy;

    /**
     * @var User
     * @Gedmo\Blameable(on="update")
     * @ORM\ManyToOne(targetEntity="UsersBundle\Entity\User")
     * @ORM\JoinColumn(name="updated_by", referencedColumnName="id")
     */
    protected $updatedBy;

    /**
     * @var \DateTime
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    protected $createdAt;

    /**
     * @var \DateTime
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    protected $updatedAt;

    /**
     * Sets createdBy.
     *
     * @param  User $createdBy
     * @return $this
     */
    public function setCreatedBy(User $createdBy)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Returns createdBy.
     *
     * @return User
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Sets updatedBy.
     *
     * @param  User $updatedBy
     * @return $this
     */
    public function setUpdatedBy(User $updatedBy)
    {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    /**
     * Returns updatedBy.
     *
     * @return User
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }

    /**
     * Sets createdAt.
     *
     * @param  \DateTime $createdAt
     * @return $this
     */
    public function setCreatedAt(\DateTime $createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Returns createdAt.
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Sets updatedAt.
     *
     * @param  \DateTime $updatedAt
     * @return $this
     */
    public function setUpdatedAt(\DateTime $updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Returns updatedAt.
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    public function floatToInt($item)
    {
        return (int)((float)$item*1000);
    }

    public function floatFromInt($item)
    {
        return (float)((int)$item/1000);
    }

    public function timeTosec($time){
        sscanf($time, "%d:%d", $hours, $minutes);
        $time_seconds = isset($hours) ? $hours * 3600 + $minutes * 60 : $minutes * 60;
        return $time_seconds;
    }

    public function secTotime($seconds){
        $hours = floor($seconds / 3600);
        $mins = floor($seconds / 60 % 60);
        $timeFormat = sprintf('%02d:%02d', $hours, $mins);
        return $timeFormat;
    }
/*
    //reorder Crew by position order in basenom FMSKAB-365
    public function reorderCrew($crew) {
        
        $temp_reorder_crew = [];
        foreach($crew as $value) {
            $temp_reorder_crew[$value->getPosition()->getOrder()][] = $value;
        }
        ksort($temp_reorder_crew);
        $reorder_crew = [];
        foreach($temp_reorder_crew as $order => $value) {
            foreach($value as $crew) {
                $reorder_crew[] = $crew;    
            }
        }

        return !empty($reorder_crew)?array_combine(range(0, count($reorder_crew)-1), array_values($reorder_crew)):[];
    }*/
}
