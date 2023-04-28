<?php
namespace FBaseBundle\Form\Extension;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;


use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;

class DateTimeTypeExtension extends AbstractTypeExtension{
   
    private $request;
    private $formName;
    private $parentFormName;
    private $container = false;

    public function __construct(RequestStack $request, ContainerInterface $container){
        $this->request = $request->getCurrentRequest();
        $this->container = $container;
    }



    public function buildForm(FormBuilderInterface $builder, array $options){
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) {
            $requestData = $this->request->request->get('time');
            $form = $event->getForm();
            $this->formName = $form->getName();
            $this->parentFormName = $form->getParent()->getName();
            
         //   $form->getParent()->get($this->formName)->addError(new FormError('asdasd')); 
            
            if ($data = $event->getData()) {
                //FMSKAB-392 datetime type is change
                $limit = 10;
                $count = 0;
                $time_field_name[] = $form->getName();
                $parent = $form->getParent();
                
                while($parent!=null) {
                    $time_field_name[] = $parent->getName();
                    $parent = $parent->getParent();
                    if($limit==$count){
                        break;
                    }
                }
                $time_field_name = implode("_",array_reverse($time_field_name)); 
                $time = !empty($requestData[$time_field_name]) ? $requestData[$time_field_name] : '00:00';
                

                if(preg_match('/^'.$this->container->getParameter('date_format_validation').'$/', $data) && preg_match('/^'.$this->container->getParameter('time_format_validation').'$/', $time)) {
                    $time = date('H:i', strtotime($time)); 
                    $date = new \DateTime($data.' '.$time);
                  
                    $dateArray = [
                        'date' => $date->format('Y')."-".$date->format('n')."-".$date->format('j'),
                        'time' => [
                            'hour' => $date->format('G'),
                            'minute' => (int)$date->format('i'),
                        ],
                    ];
                    $event->setData($dateArray);    
                }
                
            } else {
                $event->setData([]);

            }

        });
    }



    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'years'=>range(date('Y')-100, date('Y')+100),
            /*
            'error_bubbling' => true,
            'constraints' => [
                new Callback([$this, 'validate']),
            ],*/
        ]);
        
    }


    
    public function buildView(FormView $view, FormInterface $form, array $options) {
        if(!empty($view->vars['value'])&&is_array($view->vars['value'])){
            $view->vars['value']['time']['hour'] = sprintf('%02d', $view->vars['value']['time']['hour']);
            $view->vars['value']['time']['minute'] = sprintf('%02d', $view->vars['value']['time']['minute']);
            //$date = $view->vars['value'];
            //$view->vars['value'] = ["year" => $date->format('Y'),"month" => $date->format('m'),"day" => $date->format('d')];
        }
    }
/*
    public function validate($data, ExecutionContextInterface $context) {
       
        $timeData = $this->request->request->get('time');
        $formData  = $this->request->request->get($this->parentFormName);
        $time = $timeData[$this->formName];
        
        if($data = $formData[$this->formName]) {
            if(!preg_match('[^\d\s\.:-]', $data.' '.$time)) {
                $context
                    ->buildViolation('Invalid DateTime format')
                    ->atPath($this->formName)
                    ->addViolation();
            }
        }        
    }
    */

    /**
     * @return string
     */
    public function getExtendedType() {
        return DateTimeType::class;
    }



    public function getParent() {
        return DateTimeType::class;
    }
}