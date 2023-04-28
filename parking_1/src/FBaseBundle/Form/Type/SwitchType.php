<?php

namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;


class SwitchType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
    }


    public function buildView(FormView $view, FormInterface $form, array $options) {
        $view->vars['switch'] = $options['switch'];

    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'attr' => [
                'class' => 'k-checkbox',
            ],
            'switch' => true,
        ]);

    }



    public function getParent() {
        return CheckboxType::class;
    }

}