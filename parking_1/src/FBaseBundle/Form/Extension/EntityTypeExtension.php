<?php
namespace FBaseBundle\Form\Extension;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

/*
include in view
    {% javascripts '@child_entity'%}
        <script src="{{ asset_url }}" type="text/javascript"></script>
    {% endjavascripts %}
    

*/
class EntityTypeExtension extends AbstractTypeExtension {


    public function configureOptions(OptionsResolver $resolver) {
       $resolver->setDefaults([
            'child' => false,
            'child_type' => false
        ]);
    }


   public function buildView(FormView $view, FormInterface $form, array $options) {
        $class = [];
        
        if(!empty($options['child'])) {
            $class[] ='hasChildEntity';
            $view->vars['attr']['child'] = $options['child'];
            $view->vars['attr']['child_type'] = $options['child_type'];
        }

        if (isset($view->vars['attr']['class'])) {
            $view->vars['attr']['class'] .= implode(' ', $class);
        } else {
            $view->vars['attr']['class'] = implode(' ', $class);    
        }
    }

    
  
    /**
     * @return string
     */
    public function getExtendedType() {
       return EntityType::class;
    }



    public function getParent() {
        return EntityType::class;
    }
}
