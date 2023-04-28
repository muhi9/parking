<?php
namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\Form\Exception\UnexpectedTypeException;
use Symfony\Component\OptionsResolver\Options;

use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormError;
use Symfony\Component\DependencyInjection\Container;

class CaptchaType extends AbstractType{

    private $request;
    private $captcha;
    private $error_messages;
    private $session;

    public function __construct(Container $container){
        $this->request = $container->get('request_stack')->getCurrentRequest();
        $this->captcha = $container->getParameter('captcha'); 
        $this->session = $container->get('session'); 
     }


    public function buildForm(FormBuilderInterface $builder, array $options){
      $this->error_messages = null;
      $listener = function (FormEvent $event) {
            $data = $event->getData();
            $form = $event->getForm();
            $captcha = $this->captcha[$this->session->get('captcha')]??null;

            $requestData = $this->request->request->get('captcha');
           
           
            if(empty($captcha)||(strtolower($captcha)!=strtolower($requestData['answer']))){
                    $error = new FormError("Wrong answer, please try again.");
                    $form->addError($error);  
                    $this->error_messages = "fos.register.error.captch";
                }
        };

        $builder->addEventListener(FormEvents::PRE_SUBMIT, $listener);

    }


    public function configureOptions(OptionsResolver $resolver)
    {

    }

    public function buildView(FormView $view, FormInterface $form, array $options){

        $question = array_keys($this->captcha);
        $q = $question[array_rand($question)];
        $this->session->set('captcha',$q); 
        $view->vars['question'] = $q;
        $view->vars['error_messages'] = $this->error_messages;

    }
}
