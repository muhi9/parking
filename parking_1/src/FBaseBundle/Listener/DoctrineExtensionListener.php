<?php


namespace FBaseBundle\Listener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Kernel;
use Doctrine\ORM\Configuration; 

class DoctrineExtensionListener implements ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;

    }

    public function onLateKernelRequest(GetResponseEvent $event)
    {
        $translatable = $this->container->get('gedmo.listener.translatable');
        $translatable->setTranslatableLocale($event->getRequest()->getLocale());
    }

    public function onConsoleCommand()
    {
        $this->container->get('gedmo.listener.translatable')
            ->setTranslatableLocale($this->container->get('translator')->getLocale());
        
        try {
        //$user = $this->container->get('doctrine.orm.default_entity_manager')->getRepository('\UsersBundle\Entity\User')->find(1);
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        $user = $this->container->get('doctrine.orm.default_entity_manager')->getRepository('\UsersBundle\Entity\User')->findOneBy(['username'=>'console']);   
        
        if(empty($user)){
            $user = new \UsersBundle\Entity\User();
            $user->setUsername('console');
            $user->setUsernameCanonical('console');
            $user->setEmail('console@console.com');
            $user->setEmailCanonical('console@console.com');
            $user->setPassword('bayvanenomer1');
            $em->persist($user);
        }

        $this->container->get('gedmo.listener.blameable')->setUserValue($user);
        } catch (\Exception $e) {
            echo "WARNING: Exception thrown when setting Blameable for some reason. If this is migration - ignore it - might be missing user column.\n";
            echo "Error: ".$e->getMessage()."\n";
        }
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        
        if (Kernel::MAJOR_VERSION == 2 && Kernel::MINOR_VERSION < 6) {
            $securityContext = $this->container->get('security.context', ContainerInterface::NULL_ON_INVALID_REFERENCE);
            if (null !== $securityContext && null !== $securityContext->getToken() && $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                $loggable = $this->container->get('gedmo.listener.loggable');
                $loggable->setUsername($securityContext->getToken()->getUsername());
            }
        }
        else {
            $tokenStorage = $this->container->get('security.token_storage')->getToken();
            $authorizationChecker = $this->container->get('security.authorization_checker');
            if (null !== $tokenStorage && $authorizationChecker->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                $loggable = $this->container->get('gedmo.listener.loggable');
                $loggable->setUsername($tokenStorage->getUser());
                $blameable = $this->container->get('gedmo.listener.blameable');
                $blameable->setUserValue($tokenStorage->getUser());
            }
        }
    }
}
