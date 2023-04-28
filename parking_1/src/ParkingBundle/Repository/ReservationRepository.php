<?php

namespace ParkingBundle\Repository;

/**
 * ReservationRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ReservationRepository extends \Doctrine\ORM\EntityRepository
{
    use \FBaseBundle\Repository\BaseRepository;
    function checkReservationAvailability($filter= []){
        $qb = $this->createQueryBuilder('r');
        $qb->select('r');
        if (!empty($filter['from'])) {
            $qb
            ->andWhere($qb->expr()->orX(
                $qb->expr()->like('r.dateFrom', ':from'),
                $qb->expr()->like('r.dateTo', ':to')
                // $qb->expr()->like('u.middleName', ':pId'),
                // $qb->expr()->like('u.lastName', ':pId')
                ))
                
                ->setParameters(['from'=> $filter['from'],'to'=>$filter['to']]);
            }
          
           
            $result =  $qb->getQuery()->getResult();
            foreach ($result as $elm){
                $elm->getDateFrom()->format('H:i:s');
               
             }

    }
}
