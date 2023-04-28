<?php
namespace UsersBundle\EventListener;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\FOSUserEvents;
use UsersBundle\Entity\User;
use UsersBundle\Entity\UserContact;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;

class CreateInfoAfterRegistrationSubscriber implements EventSubscriberInterface
{
    private $container;

   // public function __construct(RouterInterface $router, EntityManagerInterface $em)
    public function __construct(ContainerInterface $container)
    {
        //$this->router = $router;
        $this->container = $container;

    }

    public function onRegistrationSuccess(FormEvent $event)
    {
        $router = $this->container->get('router');
        $url = $router->generate('fos_user_registration_confirmed');
        $response = new RedirectResponse($url);
        $event->setResponse($response);
    }
    public function onRegistrationComplete(FilterUserResponseEvent $user)
    {

        // $userInfo = $user->getUser();
        // $entityManager = $this->container->get('doctrine.orm.entity_manager');
        // $user_type = $entityManager->getRepository(\FBaseBundle\Entity\BaseNoms::class)->findBy(['type'=>'user.type','bnomKey'=>'person']);
        // $user_sub_types = $entityManager->getRepository(\FBaseBundle\Entity\BaseNoms::class)->findBy(['type'=>'user.sub_type']);        
        // $user_contact = $entityManager->getRepository(\FBaseBundle\Entity\BaseNoms::class)->findOneBy(['bnomKey'=>'user-contacts-mail-personal']);        
        
        // $country = false;
        // if($this->container->getParameter('default_country')) {
        //     $country = $entityManager->getRepository(\FBaseBundle\Entity\Country::class)->findBy(['iso2l'=>$this->container->getParameter('default_country')]);        
        // }
        
        // if(!empty($user_type)&&$user_type[0] instanceof \FBaseBundle\Entity\BaseNoms){
        //     $user = $entityManager->getRepository(User::class)->findBy(['user'=>$userInfo]);
        //     if(empty($user)){
        //         $info = new User();
        //         $info->setNickname($userInfo->getUsername());
        //         $info->setUser($userInfo);
        //         $info->setPersonType($user_type[0]);
        //         if(!empty($country)) {
        //             $info->setNationality($country[0]);
        //         }
        //         if(!empty($user_sub_types)) {
        //             foreach ($user_sub_types as $key => $type) {
        //                 if(in_array($type->getBnomKey(), ['ROLE_CLIENT','ROLE_PASSENGER'])){
        //                       $info->addPersonSubType($type);
        //                        #https://www.digiserver.net/jiga/browse/FMSKAB-236?focusedCommentId=10409&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-10409
        //                 }
        //             }
        //         }
        //         //add email in contact
        //         if(!empty($user_contact)) {
        //             $contact = new UserContact();
        //             $contact->setPersonalInfo($info);
        //             $contact->setContactType($user_contact); //personal email
        //             $contact->setInfo1($userInfo->getEmail());
        //             $entityManager->persist($contact);
        //         }
        //         $entityManager->persist($info);
        //         $entityManager->flush();    
        //     }   
        // }
        

    }

    public static function getSubscribedEvents()
    {
        return [
            FOSUserEvents::REGISTRATION_SUCCESS => 'onRegistrationSuccess',
            FOSUserEvents::REGISTRATION_COMPLETED => 'onRegistrationComplete'
        ];
    }
}
