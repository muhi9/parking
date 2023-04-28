<?php

namespace UsersBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use UsersBundle\Form\UserForm;
use UsersBundle\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;


/**
 * @Route("adm/user")
 */
class UserController extends Controller
{


    use \FBaseBundle\Controller\DataGridControllerTrait;
    use \FBaseBundle\Controller\FormValidationControllerTrait;


    /**
     * @Route("/add", name="profile_add")
     */
    public function addAction(Request $request)
    {
        if (!$this->container->get('user.permissions')->isAdmin()) {
                return $this->redirectToRoute('user_edit',['id'=>$this->getUser()->getId()]);
        }
        $title ='profile.add';
        return $this->form($request, $title, null);
    }

    /**
     * @Route("/", name="user")
     */
    public function indexAction(Request $request) {
       
        if (!$this->container->get('user.permissions')->isAdmin()) {
            return $this->redirectToRoute('user_edit',['id'=>$this->getUser()->getId()]);
        }
        return $this->render('UsersBundle:Users:index.html.twig');
    }


    /**
    * @Route("/edit/{id}", name="user_edit")
    */
    public function editAction(Request $request, $id = null){
        $em = $this->getDoctrine()->getManager();

        if ($this->container->get('user.permissions')->isAdmin()&& $id) {
            $user = $em->getRepository('UsersBundle:User')->find($id);
        } else {
            $user = $em->getRepository('UsersBundle:User')->find($this->getUser());
        }

        if (empty($user)) {
            return $this->redirectToRoute('user');
        }
        $form = $this->createForm(\UsersBundle\Form\UserFOSForm::class, $user,['current_user' => $this->getUser()]);
        $form->handleRequest($request);

        $notValid = $this->xhrValidateForm($form);
        if (isset($notValid['formErrors']) || $request->get('validationRequest') == 'only') {
            return new JsonResponse($notValid);
        }

        if ($form->isSubmitted() && $form->isValid()) {
            $userManager = $this->get('fos_user.user_manager');
            $userManager->updateUser($user);

            return $this->redirectToRoute('user');
        }

        return $this->render('@Users/Users/form.html.twig', [
            'form' => $form->createView(), 
            'title' => 'Edit Profile | Parking',
            'user' => $user,
        ]);
    }


    /**
     * @Route("/autocomplete/{query}", name="user_autocomplete")
     */
    public function autocompleteAction(Request $request, $query) {
        if ($request->isXmlHttpRequest()) {
            $em = $this->getDoctrine()->getManager();
            $query = str_replace('_|_', '/', $query);
            $result = [];

            $constrains = [
                'name' => $query,
            ];
            if (($temp = $request->get('role'))!=NULL) {
                $constrains['role'] = $temp;
            }
            if (($temp = $request->get('withProfile'))!=NULL) {
                $constrains['withProfile'] = !!$temp;
            }
            //$em->getRepository(User::class)->findUser($constrains);
            $temp = $this->getDoctrine()->getManager()->getRepository('UsersBundle:User')->findUser($constrains);
            //echo 's: ' . sizeof($temp);
            foreach ($temp as $tmp) {
                $result[] = [
                    'id' => $tmp->getId(),
                    'value' => $tmp->getFullName(),
                ];
            }
            return new JsonResponse($result);
        }
    }

/**
     * @Route("/list", name="user_list")
     */
    public function listAction(Request $request) {
       

        $searchCustom[] = [
                        'field' => 'username',
                        'where' => ['type'=> 'or', 'clause' => '{{entityAlias}}.username LIKE :usernameValue', 'valSetter' => ':usernameValue', 'slike' => '{{val}}%'],
                        'where' => ['type'=> 'or', 'clause' => '{{entityAlias}}.firstName LIKE :firstNameValue', 'valSetter' => ':firstNameValue', 'slike' => '{{val}}%'],
                        'where' => ['type'=> 'or', 'clause' => '{{entityAlias}}.lastName LIKE :lastNameValue', 'valSetter' => ':lastNameValue', 'slike' => '{{val}}%']                        
                    ];
        
        $table = $this->dataTable($request, User::class, [
            'route' => 'user_list',
            'action_links' => ['edit'=>'user_edit','delete'=>'user_delete'],
            'customSearch' => ['name'=>$searchCustom],
        ], [
            'id' => [
                'title'     => 'ID',
                'orderable' => true,
            ],
            'username' => [
                'title'     => 'Name',
                'search'    => true,
                'orderable' => true,
            ],
            'first name' => [
                'getter'    => function($entity) {
                    return $entity->getFirstName();
                }

            ],
            'last name' => [
                'getter'    => function($entity) {
                    return $entity->getLastName();
                }
            ],
            'roles' => [
                'title'     => 'Roles',
                'search'    => true,
                'search_type' => 'match',
                'orderable' => true,
                'getter'    => function($entity) {
                    return implode(', ', $entity->getRoles());
                }
            ],
        ]);

        return is_array($table) ? $this->render('UsersBundle:Users:list.html.twig', ['table'=>$table]) : $table;
    }

    /**
     * @Route("/delete/{id}", name = "user_delete")
     */
    public function deleteAction(Request $request, User $id)
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($id);
        $em->flush();
        
        return $this->redirectToRoute('user');

    }
    

    public function form(Request $request, $title='',User $id = null){

        //foreach ($_POST['user_form']['user'] as $key => $value) {
            //if(strstr($key, 'user_form') &&/
        //        if(is_string($value) && !empty($value))
        //            $hasVals=true;
        //}
        //if (!$hasVals)
        //    $request->set('user_form','user',null);

        $data = $user_type=[];
        $em = $this->getDoctrine()->getManager();
        $id = $id ?: new User();
        $hasVals = false;
        //$_POST['user']=null;
        //unset($_POST['user_form']['user']);
        //print_r($_POST);exit;

        
        $form = $this->createForm(UserForm::class, $id,['current_user' => $this->getUser()]);
        $form->handleRequest($request);
   
        $notValid = $this->xhrValidateForm($form);
        if (isset($notValid['formErrors']) || $request->get('validationRequest') == 'only') {
            return new JsonResponse($notValid);
        }

        if ($form->isSubmitted()) {
            $em->persist($id);
            $em->flush();
            return $this->redirectToRoute('user');
        }

        $data['form'] = $form->createView();
        $data['title'] = $title;

        return $this->render('UsersBundle:Users:form.html.twig',$data);
    }


}
