<?php

namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use UsersBundle\Entity\User;


class ProfileInputType extends AbstractType {

    public function buildView(FormView $view, FormInterface $form, array $options) {
        if ($form->getData() && $form->getData()->getDisabled()) {
            $view->vars['deleted'] = true;
        }
    }


    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'class' => User::class,
            'url' => 'profile_autocomplete',
            'url_image' => 'file_bundle_get_profile_avatar',
            'url_create' => 'profile_autocomplete_create',
            'allow_create' => false,
            'link' => 'profile_view',
            'link_admin' => 'profile_edit',
            'choice_label' => 'fullName',
            'requestRoles' => false,
            'filterPredefined' => [
                'isOperator' => null,
                'personType' => null,
                'withUser' => null, // bool
                'role' => null, // ROLE_*
                'requestRoles' => null, // bool
                'requestDebit' => null, // bool
            ]
        ]);

    }



    public function getParent() {
        return ACType::class;
    }

}
