<?php
namespace UsersBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use UsersBundle\Form\UserContactType;
//use UsersBundle\Form\UserAddressType;
use Psr\Container\ContainerInterface;



class UserForm extends AbstractType {

    private $container;
    private $personSubTypes = [];
    private $formValidatorGroups = ['Default'];
    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }


    public function buildForm(FormBuilderInterface $builder, array $options) {
        $current_user = $options['current_user'];
        if (!$builder->getData()->getId()) {
            $this->formValidatorGroups = ['Default','Registration'];
         }
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
            
        

            /*
        $builder->add('addresse', CollectionType::class, [
            'entry_type' => UserAddressType::class,
            'entry_options' => ['label' => false],
            'allow_add' => true,
            'allow_delete' => true,
            'delete_empty' => true,
            'by_reference' => false,
        ]);
*/


    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults(array(
            'label_format' =>'users.form.%name%',
            'allow_extra_fields' => true,
            'constraints' => [
                new Callback([$this, 'validate']),
            ],
            'validation_groups' => $this->formValidatorGroups,
            'current_user'=>null,
        )) ;
    }


}



