<?php

namespace ParkingBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use ParkingBundle\Form\ParkingSpacesType;
use UsersBundle\Entity\User;

use FBaseBundle\Form\Type\UnitsLatitudeType;
use FBaseBundle\Form\Type\UnitsLongitudeType;

class ParkingType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $user = $options['user'];

        $builder
    
            ->add('name')
            ->add('address')
            ->add('longitude',UnitsLongitudeType::class, ['builder'=>$builder])
            ->add('latitude',UnitsLatitudeType::class, ['builder'=>$builder])
            ->add('spaces', CollectionType::class, [
                'entry_type' => ParkingSpacesType::class,
                'entry_options' => [
                    'label' => false,
                ],
                'allow_add' => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false,
                ])

            ->add('workTime');
           
                if(in_array('ROLE_ADMIN',$user->getRoles())){
                    $builder->add('owner', EntityType::class, [    
                        'class' => User::class]);
                }
        $builder
            ->add('save',SubmitType::class)
        ;
    }
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {

        $resolver->setDefaults(array(
            'data_class' => 'ParkingBundle\Entity\Parking',
            'user'=>null,
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'parkingbundle_parking';
    }


}
