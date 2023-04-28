<?php

namespace ParkingBundle\Controller;

use ParkingBundle\Entity\Reservation;
use ParkingBundle\Entity\Parking;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class ReservationController extends Controller
{
    use \FBaseBundle\Controller\DataGridControllerTrait;
    use \FBaseBundle\Controller\FormValidationControllerTrait;

    /**
     * @Route("/reservation/{id}", name="reservation_add")
     */
    public function addAction(Request $request, Parking $id = null)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        $reservation = new Reservation();
        $form = $this->createForm(\ParkingBundle\Form\ReservationType::class, $reservation, [
            'parking' => $id, 
            'attr' => ['data-validation-type' => 'skip'], 
            'user' => $user]);
            
        $form->handleRequest($request);
        $notValid = $this->xhrValidateForm($form);

        if (isset($notValid['formErrors']) || $request->get('validationRequest') == 'only') {
            return new JsonResponse($notValid);
        }

        $freeSpaces = count($id->getFreeSpaces());
        $allSpaces = count($id->getSpaces());

        if ($freeSpaces > 0) {

            if ($form->isSubmitted() && $form->isValid()) {
               
                $longitude = $this->coordinatNorm($reservation->getParking()->getLongitude());
                $latitude = $this->coordinatNorm($reservation->getParking()->getLatitude());

                $message = "Hello, 

                Thank you for choosing our car park.
                Your booking request has been successfully accepted. Please wait for a confirmation email!
                Parking lot address: https://www.google.com/maps?q=$latitude,$longitude";
                
                $email = $reservation->getEmail();
                $em->persist($id);
                $em->persist($reservation);
                $em->flush();
                $result = $this->get('send_email')->send($email, $message);
                $this->addFlash('success',"Your booking request has been successfully accepted. Please wait for a confirmation email!");

                if ($result) {
                return $this->redirectToRoute('homepage');
                }
            }
        } else {
            echo '<script>alert("All spaces are taken, please choose another parking lot!")</script>';
        }

        return $this->render('ParkingBundle:Reservation:reservation.html.twig', array(
            'form' => $form->createView(),
            'title' => 'Reservation | Parking',
            'Reservation' => $id
        ));
    }

    /**
     * @Route("/reservations", name = "reservation")
     */
    public function indexAction(Request $request)
    {
        return $this->render('ParkingBundle:Reservation:index.html.twig');
    }

    /**
     * @Route("/reservations/list", name = "reservation_list")
     */
    public function listAction(Request $request)
    {
        $settings['action_links'] = [];
        $coloms =[
            'id' => [
            'title'     => 'ID',
            'orderable' => true,
            ], 
            'firstName' => [
                'title'     => 'First Name',
                'search'    => true,
                'orderable' => true,
            ],
            'lastName' => [
                'title'     => 'Last Name',
                'search'    => true,
                'orderable' => true,
            ],
            'email' => [
                'title'     => 'Email',
                'search'    => true,
                'orderable' => true,
            ],
            'parking' => [
                'title'     => 'Parking',
                'search'    => true,
                'orderable' => true,
            ],
            'status' => [
                'title'     => 'Status',
                'search'    => true,
                'orderable' => true,
                'getter'=> function($entity) {
                    if(!empty($entity->getStatus())){
                        return ucfirst($entity->getStatus());
                    }else{
                        return 'New';
                    }
                }
            ],
            'typeVehicle' => [
                'title'     => 'Type vehicle',
                'search'    => true,
                'orderable' => true,
            ],
            'dateFrom' => [
                'title'     => 'Date From',
                'search'    => true,
                'orderable' => true,
                'getter'=> function($entity) {
                    $date = $entity->getDateFrom();
                    return $date->format('d.m.Y - H:i');
                }
            ],
            'dateTo' => [
                'title'     => 'Date To',
                'search'    => true,
                'orderable' => true,
                'getter'=> function($entity) {
                    if(!empty($entity->getDateTo())){
                    $date = $entity->getDateTo();
                    return $date->format('d.m.Y  H:i');
                }
            }
            ],
        ];

        if ($this->container->get('user.permissions')->isAdmin() || $this->container->get('user.permissions')->isOperator()) {
            $settings['action_links'] = [
                'confirm' => 'reservation_confirm',
                'refusal' => 'reservation_refusal',
                'delete' => 'reservation_delete'
            ];
        }

        if (!$this->container->get('user.permissions')->accessLevel(['admin', 'operator'])) {
            unset($coloms['id']);
           
        }
       
        $table = $this->dataTable($request, Reservation::class, [
            'route' => 'reservation_list',
            'user' => $this->getUser(),
            'action_links' => $settings['action_links'],
            'prepareQuery' => function ($queryBuilder) {
                if ($this->container->get('user.permissions')->isOperator()) {
                    $queryBuilder->leftJoin('q.parking', 'p')
                        ->andWhere('p.owner = :owner')
                        ->setParameter('owner', $this->getUser());
                }

                if ($this->container->get('user.permissions')->isClient()) {
                    $queryBuilder->leftJoin('q.parking', 'p')
                        ->andWhere('q.createdBy = :created_by')
                        ->setParameter('created_by', $this->getUser());
                }
            }

        ], $coloms);
        
        return is_array($table) ? $this->render('ParkingBundle:Reservation:reservation_list.html.twig', ['table' => $table]) : $table;
    }

    /**
     * @Route("/reservation/confirm/{id}", name = "reservation_confirm")
     */
    public function confirmAction(Request $request, Reservation $id)
     {
        $message = 'Hello! Your reservation has been confirmed. We are expecting you !';
      
        $id->getParking()->getFreeSpaces()->first()->setStatus('busy');
        $email = $id->getEmail();
        $this->get('send_email')->send($email, $message);
        $em = $this->getDoctrine()->getManager();
        $id->setStatus('confirm');
        $em->persist($id);
        $em->flush();

        return $this->redirectToRoute('reservation');
    }

    /**
     * @Route("/reservation/refusal/{id}", name = "reservation_refusal")
     */
    public function refusalAction(Request $request, Reservation $id)
     {
        $message = 'We are sorry!
        Your reservation has been canceled due to lack of available places. Please excuse us!';
        $email = $id->getEmail();
        $this->get('send_email')->send($email, $message);
        $em = $this->getDoctrine()->getManager();
        $id->setStatus('refusal');
        $em->persist($id);
        $em->flush();

        return $this->redirectToRoute('reservation');
    }

    /**
     * @Route("/delete/{id}", name = "reservation_delete")
     */
    public function deleteAction(Request $request, Reservation $id)
    {
        // dump($id->getParking()->getBusySpaces());
        // die();
        // $id->getParking()->getBusySpaces()->first()->setStatus('available');
        $em = $this->getDoctrine()->getManager();
        $em->remove($id);
        $em->flush();

        return $this->redirectToRoute('reservation');
    }


    private function coordinatNorm($coordinates)
    {
        //$res = substr($coordinates,1);
        $result = null;
        if (preg_match("/[0-9]+.[0-9]+/", $coordinates, $match)) {
            $result = $match[0];
        } else {
            //todo? 
        }

        return (float)$result;
    }
}
