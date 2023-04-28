<?php

namespace UsersBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use UsersBundle\Entity\UserContact;



class UserContactType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options) {
            $builder->add('phone', TelType::class, ['label'=>'Number','attr'=>['class'=>'mask-regex', 'regex'=>'^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$']]);   
       
    }

    public function validate($data, ExecutionContextInterface $context) {
        $fields = [];
        /*if ($data->getPersonalInfo()->getPersonType()->getBnomKey()=='person') {
            if($data->getContactType()->getType()->getNameKey()=='user.emergency'&&empty($data->getInfo3())){
              $fields = ['info3'];
            }
            
        }*/

        if(!empty($fields)){
            foreach ($fields as $field) {
                $tmp = 'get'.ucfirst($field);
                if (!$data->$tmp()) {
                    $context
                        ->buildViolation('users.form.error.'.$field.'_is_blank')
                        ->atPath($field)
                        ->addViolation();
                }
            }    
        }
    }



    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults(array(
            'data_class' => UserContact::class,
            'label_format' => 'user.form.contact.%name%',
            'contact_type' => null,
            'constraints' => [
                new Callback([$this, 'validate']),
            ],
        ));
    }
}
