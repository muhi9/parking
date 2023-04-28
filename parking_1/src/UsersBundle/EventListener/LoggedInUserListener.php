<?php
namespace UsersBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class LoggedInUserListener
{
    private $router;
    private $container;
    private $token;

    public function __construct($router, $container, $token)
    {
        $this->router = $router;
        $this->container = $container;
        $this->token = $token;
    }    

    public function onKernelRequest(GetResponseEvent $event)
    {
    
        $redirectArray = ['/login','/register/','/resetting/request'];
        //if($container->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')){
         if($this->token->getToken()!=null && is_object($this->token->getToken()->getUser())){
            $routeName = $this->container->get('router.request_context')->getPathInfo();
            if (in_array($routeName, $redirectArray)) {
                $url = $this->router->generate('homepage');
                $event->setResponse(new RedirectResponse($url));
            }
        }
        
    }
}