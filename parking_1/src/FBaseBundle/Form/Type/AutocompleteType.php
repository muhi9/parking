<?php
namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Bridge\Doctrine\Form\ChoiceList\DoctrineChoiceLoader;
use Symfony\Component\Form\ChoiceList\Loader\CallbackChoiceLoader;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\Query\Parameter;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bridge\Doctrine\Form\ChoiceList\ORMQueryBuilderLoader;
use Symfony\Component\Form\Exception\UnexpectedTypeException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use FBaseBundle\Entity\BaseNoms;
use Doctrine\ORM\EntityManagerInterface;

class AutocompleteType extends AbstractType{

    public function buildForm(FormBuilderInterface $builder, array $options){
        
        $view->vars['attr']['type'] = 0;
        
        $preSetData = function (FormEvent $event) {
            $data = $event->getData();
            $form = $event->getForm();
            $options = $form->getConfig()->getOptions();
            
            if(!isset($options['baseNom'])||empty($options['baseNom'])){
               $error = new FormError("not found basenom");
               $form->addError($error);
            }
        };
        $builder->addEventListener(FormEvents::PRE_SET_DATA, $preSetData);
        
    }
    
    public function buildView(FormView $view, FormInterface $form, array $options)
    { 
        $view->vars['attr']['type'] = 0;
        
            
        if(isset($options['baseNom'])&&!empty($options['baseNom'])){
            $view->vars['attr']['type'] = $options['baseNom'];
        }
      
    }
    
    public function configureOptions(OptionsResolver $resolver){
        $resolver->setDefaults(array(
            'class' =>  BaseNoms::class,
            'baseNom'=>false,
            
        ));

    }
    
    public function getParent(){
      return EntityType::class;
    }
}