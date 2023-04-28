<?php
namespace FBaseBundle\Form\Type;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\HttpFoundation\RequestStack;
use Psr\Container\ContainerInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;


use Symfony\Component\Form\Extension\Core\Type\DateTimeType;

class DateRangeType extends AbstractType {
    
    private $request;
    private $formName;
    private $parentFormName;
    private $container = false;

    public function __construct(RequestStack $request, ContainerInterface $container){
        $this->request = $request->getCurrentRequest();
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options){
      
         

        
        
    }

    public function buildView(FormView $view, FormInterface $form, array $options){
        $ids = ['picker'=>$view->vars['id']];
        foreach (['start'=>$options['start'], 'end'=>$options['end']] as $key => $fieldName) {
            $tmp = $view;
            $i=10;
            while ($i-- && ($tmp = $tmp->parent) && empty($tmp->children[$fieldName])) {}
            if (empty($tmp->children[$fieldName])) {
                throw new \Exception("Field \"$fieldName\" is missing", 1);
            }
            $ids[$key] = $tmp->children[$fieldName]->vars['id'];
            $tmp->children[$fieldName]->vars['part_of_range'] = $key;
            $tmp->children[$fieldName]->vars['part_of_range_elements'] = &$ids;
        }
        $view->vars['part_of_range'] = 'picker';
        $view->vars['part_of_range_elements'] = $ids;
        
    }
    
    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'start' => '',
            'end' =>'',
            'mapped' => false
        ]);
    }
}