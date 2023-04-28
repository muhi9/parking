<?php

namespace ParkingBundle\Service;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;

class SendEmail {
  
    private $swiftmailer;
    public function __construct(\Swift_Mailer $swiftmailer,$mail_sender, ObjectManager $em, RouterInterface $router) {
        $this->swiftmailer = $swiftmailer;
        $this->from = $mail_sender;
        $this->em = $em;
        $this->router = $router;
    }

   
    /**
    * function send 
    * params: 
    *   - $user object  
    *   - $message string 
    */
    public function send($email_to, $message_content) {
       // $email_to = $provider_emial['contact'];
        //only for test, delete on prod
        //$email_to = 'deniz.kadir@polirind.com';
       

        $subject = 'Reserving a parking space';
        
        $result = ['result'=>0,'error'=>false];
        
        if(!$this->validateEmail($email_to)){
            $result['error'] = 'not valid email '.$email_to;
            return $result;
        }
        
        
        //$logger = new \Swift_Plugins_Loggers_ArrayLogger();
        $logger = new \Swift_Plugins_Loggers_EchoLogger();
        $this->swiftmailer->registerPlugin(new \Swift_Plugins_LoggerPlugin($logger));
        $email = (new \Swift_Message())
            ->setSubject($subject)
            ->setFrom('muharem9009@gmail.com')
            ->setTo($email_to);
       
        $email->addPart($message_content,'text/html');
        $result =  $this->swiftmailer->send($email);
        
        return $result;
    }

    private function validateEmail($emial){
        $result = true;
        if(empty($emial)){
            return false;
        }

        if(!preg_match('/[a-zA-Z0-9._-]+@[a-z0-9-]+\.{1}[a-z]{2,10}/', $emial,$m)){
           $result = false;
        }
        
        return  $result;
    }

}
