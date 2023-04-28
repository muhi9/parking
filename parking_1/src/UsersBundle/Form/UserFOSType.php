<?php

namespace UsersBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use FOS\UserBundle\Form\Type\RegistrationFormType;
use FBaseBundle\Entity\Language;



class UserFOSType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options) {
        //$builder
        //    ->add('language', EntityType::class, [
        //       'class' => Language::class
        //    ]);
    }



    public function getParent() {
        return RegistrationFormType::class;
    }

}