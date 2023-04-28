<?php

namespace FBaseBundle\Traits;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
/**
 * Trait for soft-deletable entities.
 * Usage:
 *
 *  * Add @Gedmo\SoftDeleteable(fieldName="deletedAt") annotation to your entity
 *  * add "use SoftDeletableTrait;" to your entity
 */
trait SoftDeleteableEntity {
    /**
     * DateTime when this entity was deleted (used for "Soft-Delete behaviour")
     *
     * @var \DateTime
     * @ORM\Column(type="datetime",nullable=true)
     */
    protected $deletedAt;
    /**
     * @return \DateTime
     */
    public function getDeletedAt() {
        return $this->deletedAt;
    }
    /**
     * @param \DateTime $deletedAt
     * @return void
     */
    public function setDeletedAt(\DateTime $deletedAt) {
        $this->deletedAt = $deletedAt;
    }
}
