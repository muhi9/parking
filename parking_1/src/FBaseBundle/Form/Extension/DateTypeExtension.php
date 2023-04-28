<?php
namespace FBaseBundle\Form\Extension;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\Options;

use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;



class DateTypeExtension extends AbstractTypeExtension{
    
    public function buildForm(FormBuilderInterface $builder, array $options){
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) {
          if ($data = $event->getData()) {
              $date = new \DateTime($data);
              $dataArray = ["year" => $date->format('Y'),"month" => $date->format('n'),"day" => $date->format('j')];
              $event->setData($dataArray);
          } else {
              $event->setData(["year" =>'',"month" =>'',"day" =>'']);
          }       
      
      });
     
    }
    
   
    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefault('years', range(date('Y')-100, date('Y')+100));
    }



    public function buildView(FormView $view, FormInterface $form, array $options) {
        if(!empty($view->vars['value'])&&!is_array($view->vars['value'])){
            $date = $view->vars['value'];
            $view->vars['value'] = [
                'year' => $date->format('Y'),
                'month' => $date->format('m'),
                'day' => $date->format('d'),
            ];
        }
    }



    /**
     * @return string
     */
    public function getExtendedType() {
        return DateType::class;
    }



    public function getParent() {
        return DateType::class;
    }
}