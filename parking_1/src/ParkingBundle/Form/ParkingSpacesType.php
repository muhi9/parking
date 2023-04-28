<?php

namespace ParkingBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;


class ParkingSpacesType extends AbstractType
{
    
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $status=['available','busy','closed'];
        $typeVehicle = ['car',
        'motorbike',
        'pickup truck',
        'minivan',
        'cargo van',
        'campervan',
        'limousine'];
        $builder
        ->add('placeNumber')
        ->add('status', ChoiceType::class, [
            'choices' => [
                'available' => $status[0],
                'busy' => $status[1],
                'closed' => $status[2],
            ],
            'multiple' => false,
            'expanded' => false,
        ])
        ->add('typeOfMotorVehicle', ChoiceType::class, [
            'choices' => [
                'car' => $typeVehicle[0],
                'motorbike' => $typeVehicle[1],
                'pickup truck' => $typeVehicle[2],
                'minivan' => $typeVehicle[3],
                'cargo van' => $typeVehicle[4],
                'campervan' => $typeVehicle[5],
                'limousine' => $typeVehicle[6],
            ],
            'multiple' => false,
            'expanded' => false,
        ])
        ->add('priceOfHour');
    }
    // public function validate($data, ExecutionContextInterface $context) {
    //     $fields = [];

    //     if(!empty($fields)){
    //         foreach ($fields as $field) {
    //             $tmp = 'get'.ucfirst($field);
    //             if (!$data->$tmp()) {
    //                 $context
    //                     ->buildViolation('users.form.error.'.$field.'_is_blank')
    //                     ->atPath($field)
    //                     ->addViolation();
    //             }
    //         }    
    //     }
    // }
    
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'ParkingBundle\Entity\ParkingSpaces'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'parkingbundle_parkingspaces';
    }


}
