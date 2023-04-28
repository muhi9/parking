<?php

namespace ParkingBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use ParkingBundle\Form\ParkingType;
use ParkingBundle\Entity\Parking;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/parking")
 */
class ParkingController extends Controller
{

    use \FBaseBundle\Controller\DataGridControllerTrait;
    use \FBaseBundle\Controller\FormValidationControllerTrait;

    /**
     * @Route("/index", name="parking")
     */
    public function indexAction()
    {

        return $this->render('ParkingBundle:Parking:index.html.twig', array(
            'title' => 'Parkings',
        ));
    }

    /**
     * @Route("/add", name="parking_add")
     */
    public function addAction(Request $request)
    {
        if (!$this->container->get('user.permissions')->isAdmin() && !$this->container->get('user.permissions')->isOperator()) {
            return $this->redirectToRoute('parking');
        } else {

            $em = $this->getDoctrine()->getManager();

            $parking = new Parking();

            if ($this->container->get('user.permissions')->isOperator()) {
                $parking->setOwner($this->getUser());
            }

            $form = $this->createForm(ParkingType::class, $parking, ['user' => $this->getUser()]);
            $form->handleRequest($request);

            $notValid = $this->xhrValidateForm($form);
            if (isset($notValid['formErrors']) || $request->get('validationRequest') == 'only') {
                return new JsonResponse($notValid);
            }

            if ($form->isSubmitted() && $form->isValid()) {

                if ($this->container->get('user.permissions')->isOperator()) {
                    $parking->setOwner($this->getUser());
                }

                $em->persist($parking);
                $em->flush();

                return $this->redirectToRoute('parking');
            }

            return $this->render('ParkingBundle:Parking:form.html.twig', [
                'form' => $form->createView(),
                'owner' =>$this->container->get('user.permissions')->isAdmin(),
                'title' => 'Add | Parking',
                'action_name' => 'Add new parking',
                'parking_name' => '',
            ]);
        }
    }

    /**
     * @Route("/edit/{id}", name = "parking_edit")
     */
    public function editAction(Request $request, Parking $id = null)
    {   
        if (!$this->container->get('user.permissions')->isAdmin() && !$this->container->get('user.permissions')->isOperator()) {
            $anon = false;
            return $this->redirectToRoute('parking');
        } else {

            $em = $this->getDoctrine()->getManager();

            $form = $this->createForm(\ParkingBundle\Form\ParkingType::class, $id, ['user' => $this->getUser()]);
            $form->handleRequest($request);

            $notValid = $this->xhrValidateForm($form);
            if (isset($notValid['formErrors']) || $request->get('validationRequest') == 'only') {
                return new JsonResponse($notValid);
            }

            if ($form->isSubmitted() && $form->isValid()) {
                $em->persist($id);
                $em->flush();
                return $this->redirectToRoute('parking');
            }
            
            return $this->render('ParkingBundle:Parking:form.html.twig', [
                'form' => $form->createView(),
                'owner' =>$this->container->get('user.permissions')->isAdmin(),
                'title' => 'Edit | Parking',
                'action_name' => 'Edit parking',
                'parking_name' => $id->getName(),
            ]);
        }
    }

    /**
     * @Route("/list", name = "parking_list")
     */
    public function listAction(Request $request)
    {
        $anon = true;
        $settings['action_links'] = [];
        $coloms = [
            'id' => [
                'title'     => 'ID',
                'orderable' => true,
            ],
            'name' => [
                'title'     => 'Name',
                'search'    => true,
                'orderable' => true,
                'getter'    => function($entity) {
                    $url = $this->generateUrl('reservation_add', [
                        'id' => $entity->getId(),
                    ]);
                    return '<a href='.$url.'>'.$entity->getName().'</a>';
                }
            ],
            'address' => [
                'title'     => 'Address',
                'search'    => true,
                'orderable' => true,
            ],
            'workTime' => [
                'title'     => 'Work time',
                'search'    => true,
                'orderable' => true,
            ],
            'longitude' => [
                'title'     => 'Longitude',
                'search'    => true,
                'orderable' => true,
            ],
            'latitude' => [
                'title'     => 'Latitude',
                'search'    => true,
                'orderable' => true,
            ],

        ];

        if ($this->container->get('user.permissions')->isAdmin() || $this->container->get('user.permissions')->isOperator()) {
            $anon = false;
            $settings['action_links'] = [
                'edit' => 'parking_edit',
                'delete' => 'parking_delete'
            ];
        }


        if (!$this->container->get('user.permissions')->accessLevel(['admin', 'operator'])) {
            unset($coloms['id'], $coloms['longitude'], $coloms['latitude']);
           
        }
      
        $table = $this->dataTable($request, Parking::class, [
            'route' => 'parking_list',
            'user' => $anon,
            'action_links' => $settings['action_links'],
            'defWhere' => $this->container->get('user.permissions')->isOperator() ? ['owner' => $this->getUser()] : null,

        ], $coloms);


        return is_array($table) ? $this->render('ParkingBundle:Parking:list.html.twig', ['table' => $table]) : $table;
    }

    /**
     * @Route("/delete/{id}", name = "parking_delete")
     */
    public function deleteAction(Request $request, Parking $id)
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($id);
        $em->flush();

        return $this->redirectToRoute('parking');
    }
}
