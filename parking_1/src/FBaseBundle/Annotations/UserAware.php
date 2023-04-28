<?php
namespace FBaseBundle\Annotations;
use Doctrine\Common\Annotations\Annotation;
/**
 * @Annotation
 * @Target("CLASS")
 */
final class UserAware
{
    public $userPropertyName;
    public $userFieldName; // Kept for backwards compatibility reasons
}

/* use it like:
/ **
 *
 * @ORM\Entity
 * @UserAware(userPropertyFieldName="order")
 * /
class product {
*/