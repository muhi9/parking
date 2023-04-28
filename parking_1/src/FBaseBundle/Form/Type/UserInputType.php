<?php

namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use UsersBundle\Entity\User;


class UserInputType extends AbstractType {

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'class' => User::class,
            'url' => 'user_autocomplete',
            'link' => 'user_edit',
            'choice_label' => 'fullName',
            'filterPredefined' => [
                'role' => null,
                'withProfile' => null,
                'checkAvailability' => null,
            ]
        ]);
    }


    
    public function getParent() {
        return ACType::class;
    }

}