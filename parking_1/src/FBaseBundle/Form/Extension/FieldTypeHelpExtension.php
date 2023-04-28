<?php
namespace FBaseBundle\Form\Extension;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\FormType;

class FieldTypeHelpExtension extends AbstractTypeExtension {
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver) {
        $resolver->setDefaults([
            // set default values for allowed options
            'help' => null,
            'em' => null,
        ]);
    }



    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefined([
            // set default allowed options for forms
            'help',
            'em',
        ]);
    }



    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder->setAttribute('help', isset($options['help']) ? $options['help'] : []);
    }



    /**
     * @param FormView      $view
     * @param FormInterface $form
     * @param array         $options
     */
    public function buildView(FormView $view, FormInterface $form, array $options) {
        $view->vars['help'] = isset($options['help']) ? $options['help'] : null;
    }



    /**
     * @return string
     */
    public function getExtendedType() {
        return FormType::class;
    }
}