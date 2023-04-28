<?php

namespace ParkingBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use ParkingBundle\Entity\Parking;


class ReservationType extends AbstractType
{

    use \FBaseBundle\Controller\DataGridControllerTrait;
    use \FBaseBundle\Controller\FormValidationControllerTrait;

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $parking = $options['parking'];
        $typeVehicle = [
            'car',
            'motorbike',
            'pickup truck',
            'minivan',
            'cargo van',
            'campervan',
            'limousine'
        ];

        $builder
            ->add('parking', EntityType::class, [
                'class' => Parking::class,
                'data' => $parking
            ]);

        if ($options['user'] != null && $options['user']->getRoles()[0]=='ROLE_CLIENT') {
            $builder
                ->add('firstName', null, ['data' => $options['user']->getFirstName()])
                ->add('lastName', null, ['data' => $options['user']->getLastName()])
                ->add('email', null, ['data' => $options['user']->getEmail()]);
        }else{
            $builder
            ->add('firstName')
            ->add('lastName')
            ->add('email');
        }

        $builder
            ->add('typeVehicle', ChoiceType::class, [
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
            ->add('dateFrom', DateTimeType::class, ['input' => 'datetime', 'required' => false, 'data' => date_create('', timezone_open('Europe/Sofia'))])
            ->add('dateTo', DateTimeType::class, ['input' => 'datetime', 'required' => false])
            ->add('save', SubmitType::class);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'ParkingBundle\Entity\Reservation',
            "parking" => null,
            "user" => null,
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'parkingbundle_reservation';
    }
}
