<?php

namespace UsersBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use FBaseBundle\Form\Type\SwitchType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use UsersBundle\Form\UserContactType;

class UserFOSForm extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options) {
        $current_user = $options['current_user'];
        $builder
           ->add('firstName')
           ->add('middleName')
           ->add('lastName')
           ->add('phone', CollectionType::class, [
                   'entry_type' => UserContactType::class,
                   'entry_options' => [
                       'label' => false,
                       'contact_type' => 'phone'
                   ],
                   'allow_add' => true,
                   'allow_delete' => true,
                   'delete_empty' => true,
                   'by_reference' => false,
                   ]
               );
           if(in_array('ROLE_ADMIN', $current_user->getRoles())){                
                $builder
                ->add('enabled', SwitchType::class)
                ->add('roles', ChoiceType::class, [
                    'multiple' => true,
                    'expanded' => false,
                    'choices' => [
                        'users.form.roles.admin' => 'ROLE_ADMIN',
                        'users.form.roles.operator' => 'ROLE_OPERATOR',
                        'users.form.roles.client' => 'ROLE_CLIENT',
                    ],
                ]);
            }
            $builder->add('save', SubmitType::class);
    }



    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults(array(
            'label_format' =>'users.form.%name%',
            'allow_extra_fields' => true,
            'current_user'=>null
        ));
    }



    public function getParent() {
        return UserFOSType::class;
    }

}
