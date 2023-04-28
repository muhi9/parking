<?php

namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormError;

use Doctrine\ORM\EntityManagerInterface;

class UnitsType extends AbstractType {

    protected $request;
    protected $transformations = [];

    protected $possibleUnits = [
        'length' => ['m', 'km', 'ft', 'sm', 'nm', 'in', 'mm'],
        'volume' => ['l', 'm3', 'US gal', 'UK gal', 'qt'],
        'mass' => ['kg', 'lb', 'ton'],
        'pressure' => ['Pa', 'hPa', 'inHg', 'mmHg'],
        'temperature' => ['K', 'C', 'F'],
        'coordinate' => ['hddd°mm\'ss.s"', 'hddd°mm.mmm\'', 'hddd.dddd°'],
        'time' => ['sec', 'min', 'hr'],
        'speed' => ['m/s', 'km/h', 'mph', 'ft/m', 'ft/s', 'kt', 'kph'],
        'flow' => ['l/s', 'm3/s'],
    ];

    protected $units = [];
    protected $defaultUnit;

    protected $userInfo = null;


    public function __construct(TokenStorageInterface $tokenStorage, RequestStack $request, EntityManagerInterface $entityManager) {
        $this->init($tokenStorage->getToken()->getUser() );
        $this->userInfo = $tokenStorage->getToken()->getUser();
        $this->request = $request;
    }


    protected function init($personalInfo) {
    }    



    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($options, $builder) {
            $form = $event->getForm()->getParent();
            $value_field_name = preg_replace('/_[^_]*$/', '', $builder->getName());
            $units_field_name = $value_field_name.'_units';
            $normalized_field_name = $units_field_name.'_normalized';
            $value_getter = 'get'.str_replace(' ', '', ucwords(str_replace('_', ' ', $value_field_name)));
            $units_getter = 'get'.str_replace(' ', '', ucwords(str_replace('_', ' ', $units_field_name)));
            $data = $form->getData();
          //  $user_units = $this->userInfo->{$options['default_unit_getter']}();
            $user_units =  'hddd°mm\'ss.s"';
            $current_value = $data && method_exists($data, $value_getter) ? $data->$value_getter() : null;
            $current_units = ($data && method_exists($data, $units_getter) ? $data->$units_getter() : null) ?: $user_units;
            if($options['convert'] == false) {
                $user_units = $current_units;   
            }
           // $user_units = $current_units;
            // input field
            if (empty($options['hide_input'])) {
                if (empty($options['builder'])) {
                    throw new \Exception($builder->getName().": 'builder' is required for unit values", 1);
                }
                if (!empty($options['input_numeric'])) {
                    $form->add($value_field_name, NumberType::class, $options['input_options'] + [
                        'data' => is_null($current_value) ? null : round(self::convert($current_value, $current_units, $user_units), $options['precision']),
                    ]);
                } else {
                    $form->add($value_field_name, TextType::class, $options['input_options'] + [
                        'data' => self::convert($current_value, $current_units, $user_units),
                    ]);
                }
                $form->add($normalized_field_name, HiddenType::class);

                // save normalization and conversions
                $options['builder']->addEventListener(FormEvents::PRE_SUBMIT, function(FormEvent $event) use ($current_value, $current_units, $value_field_name, $units_field_name, $user_units, $options, $normalized_field_name) {
                    $data = $event->getData();
                    if (!isset($data[$value_field_name]) || empty($data[$units_field_name])) {
                        return;
                    }
                    $value = $data[$value_field_name];
                    $units = $data[$units_field_name];
                    $old_value_new_units = self::convert($current_value, $current_units, $units);
                    if (!empty($options['input_numeric'])) {
                        $value = round($value, $options['precision']);
                        $old_value_new_units = round($old_value_new_units, $options['precision']);
                    }
                    if ($value!=$old_value_new_units) {
                        $data[$value_field_name] = $value;
                        $data[$units_field_name] = $units;
                        $data[$normalized_field_name] = self::convert($value, $units, $options['normalized_unit']);
                    } else {
                        $data[$value_field_name] = $current_value;
                        $data[$units_field_name] = $current_units;
                    }
                    $event->setData($data);
                });
            }
            $form->add('asd', HiddenType::class, ['mapped'=>false]);

            // units field
            if (!empty($options['use_units_field'])) {
                $form->add($units_field_name, HiddenType::class, $options['units_options'] + [
                    'attr' => ['data-units-field'=>$options['use_units_field']],
                    'data' => $user_units,
                ]);
            } else if (!empty($options['hide_units'])) {
                $form->add($units_field_name, HiddenType::class, $options['units_options'] + [
                    'data' => $user_units,
                ]);
            } else {
                // select
                $form->add($units_field_name, ChoiceType::class, $options['units_options'] + [
                    'choices'  => array_combine($options['units'], $options['units']),
                    'data' => $user_units,
                ]);
            }
        });
    }



    public function finishView(FormView $view, FormInterface $form, array $options) {
        if (!empty($options['use_units_field'])) {
            $tmp = $view;
            $i=10;
            while ($i-- && ($tmp = $tmp->parent) && empty($tmp->children[$options['use_units_field']])) {}
            if (empty($tmp->children[$options['use_units_field']])) {
                throw new \Exception("Field \"$options[use_units_field]\" is missing", 1);
            }
        }

        $view->vars['units'] = $options['units'];
        $view->vars['default_unit'] = $options['default_unit_getter'] ? : $options['default_unit'];
        $view->vars['hide_input'] = $options['hide_input'];
        $view->vars['hide_units'] = $options['hide_units'] || $options['use_units_field'];
        $value_field_name = preg_replace('/_[^_]*$/', '', $form->getName());
        $view->vars['value_field_name'] = $value_field_name;
        $view->vars['units_field_name'] = $value_field_name.'_units';
    }



    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'mapped' => false,
            'attr' => [
                'class' => 'form-control units_type',
            ],
            'units' => [],
            'default_unit' => '',
            'default_unit_getter' => false,
            'normalized_unit' => '',
            'allow_extra_fields'=>true,
            'precision' => 2,
            'hide_input' => false,
            'hide_units' => false,
            'use_units_field' => false,
            'use_units_value' => false,
            'input_options' => [],
            'units_options' => [],
            'input_numeric' => true,
            'convert' => true,
            'builder' => null,
        ]);

    }



    public static function convert($value, $from, $to) {
        if (!$value) {
            return $value;
        }

        $result = null;
        // to => [from, from...]
        $conversions = [
            'mm'      => ['mm'=>1,                'm'=>1000,              'km'=>1000000,           'in'=>25.4000000259,    'ft'=>304.799999537,     'sm'=>1609347.2187,  'nm'=>1852000],
            'm'       => ['mm'=>0.001,            'm'=>1,                 'km'=>1000,              'in'=>0.0254000000259,  'ft'=>0.304799999537,    'sm'=>1609.3472187,  'nm'=>1852],
            'km'      => ['mm'=>0.000001,         'm'=>0.001,             'km'=>1,                 'in'=>2.54000000259e-5, 'ft'=>0.000304799999537, 'sm'=>1.6093472187,  'nm'=>1.852],
            'in'      => ['mm'=>0.0393700787,     'm'=>39.3700787,        'km'=>39370.0787,        'in'=>1,                'ft'=>0.0833333333,      'sm'=>63360,         'nm'=>72913.3848048],
            'ft'      => ['mm'=>0.0032808399,     'm'=>3.2808399,         'km'=>3280.8399,         'in'=>12,               'ft'=>1,                 'sm'=>5280,          'nm'=>6076.11562192],
            'sm'      => ['mm'=>6.21369949493e-7, 'm'=>0.000621369949493, 'km'=>0.621369949493,    'in'=>1.57828282828e-5, 'ft'=>0.000189393939394, 'sm'=>1,             'nm'=>1.15077944789],
            'nm'      => ['mm'=>5.39956803456e-7, 'm'=>0.000539956803456, 'km'=>0.539956803456,    'in'=>1.3714903e-5,     'ft'=>0.00016457883,     'sm'=>0.868976242,   'nm'=>1],
            
            
            'l'       => ['l'=>1,           'm3'=>1000,       'US gal'=>3.78541178913,    'UK gal'=>4.54609188687,    'qt'=>0.946352945492],
            'm3'      => ['l'=>0.001,       'm3'=>1,          'US gal'=>0.00378541178913, 'UK gal'=>0.00454609188687, 'qt'=>0.000946352945492],
            'US gal'  => ['l'=>0.264172052, 'm3'=>264.172052, 'US gal'=>1,                'UK gal'=>1.20095042256 /*0.83267384*/,       'qt'=>0.25/*4*/],
            'UK gal'  => ['l'=>0.219969157, 'm3'=>219.969157, 'US gal'=>0.83267384 /*1.20095042256*/,    'UK gal'=>1,                'qt'=>0.20816846001 /*4.80380169*/],
            'qt'      => ['l'=>1.05668821,  'm3'=>1056.68821, 'US gal'=>4 /*0.25*/,             'UK gal'=>4.80380169 /*0.20816846001*/,    'qt'=>1],
            

            'kg'      => ['kg'=>1,          'ton'=>1000,       'lb'=>0.45359237038],
            'ton'     => ['kg'=>0.001,      'ton'=>1,          'lb'=>0.00045359237038],
            'lb'      => ['kg'=>2.20462262, 'ton'=>2204.62262, 'lb'=>1],

            'Pa'      => ['Pa'=>1,              'hPa'=>100,          'inHg'=>3386,       'mmHg'=>133.322368368],
            'hPa'     => ['Pa'=>0.01,           'hPa'=>1,            'inHg'=>33.86,      'mmHg'=>1.33322368368],
            'inHg'    => ['Pa'=>0.000295333727, 'hPa'=>0.0295333727, 'inHg'=>1,          'mmHg'=>0.039374592],
            'mmHg'    => ['Pa'=>0.00750061683,  'hPa'=>0.750061683,  'inHg'=>25.3970886, 'mmHg'=>1],

            'sec'     => ['sec'=>1,                 'min'=>60,              'hr'=>3600],
            'min'     => ['sec'=>0.01666666666667,  'min'=>1,               'hr'=>60],
            'hr'      => ['sec'=>0.000277777777778, 'min'=>0.0166666666666, 'hr'=>1],

            'm/s'     => ['m/s'=>1,          'km/h'=>0.277777778, 'mph'=>0.44704,    'ft/m'=>3.2808399,    'ft/s'=>0.3048,      'kt'=>0.514444444],
            'km/h'    => ['m/s'=>3.6,        'km/h'=>1,           'mph'=>1.609344,   'ft/m'=>0.018288,     'ft/s'=>1.09728,     'kt'=>1.85200],
            'mph'     => ['m/s'=>2.23693629, 'km/h'=>0.621371192, 'mph'=>1,          'ft/m'=>0.0113636364, 'ft/s'=>0.681818182, 'kt'=>1.15077945],
            'ft/m'    => ['m/s'=>196.850394, 'km/h'=>54.6806649,  'mph'=>88,         'ft/m'=>1,            'ft/s'=>60,          'kt'=>101.268591],
            'ft/s'    => ['m/s'=>3.2808399,  'km/h'=>0.911344415, 'mph'=>1.46666667, 'ft/m'=>0.0166666667, 'ft/s'=>1,           'kt'=>1.68780986],
            'kt'      => ['m/s'=>1.94384449, 'km/h'=>0.539956803, 'mph'=>2.23693629, 'ft/m'=>0.0113636364, 'ft/s'=>0.681818182, 'kt'=>1],

            'l/h'     => ['l/h'=>1,           'US gal/h'=>3.78541178],
            'US gal/h'=> ['l/h'=>0.264172052, 'US gal/h'=>1],
        ];
        if (isset($conversions[$to]) && isset($conversions[$to][$from])) {
            $result = $value * $conversions[$to][$from];
        } else {
            switch ($from) {
                case 'K':
                    switch ($to) {
                        case 'K':
                            $result = $value;
                            break;
                        case 'C':
                            $result = $value + 272.15;
                            break;
                        case 'F':
                            $result = $value * 9/5 - 459.67;
                            break;
                    }
                    break;
                case 'C':
                    switch ($to) {
                        case 'K':
                            $result = $value - 272.15;
                            break;
                        case 'C':
                            $result = $value;
                            break;
                        case 'F':
                            $result = $value * 9/5 + 32;
                            break;
                    }
                    break;
                case 'F':
                    switch ($to) {
                        case 'K':
                            $result = ($value + 459.67) * 5/9;
                            break;
                        case 'C':
                            $result = ($result - 32) * 5/9;
                            break;
                        case 'F':
                            $result = $value;
                            break;
                    }
                    break;
                case 'hddd°mm\'ss.s"':
                    if (preg_match('/([NEWS])(\d+).(\d+).(\d+)\.(\d+)/u', strtoupper($value), $temp)) {
                        $deg = $temp[2] + $temp[3] / 60 + floatval("$temp[4].$temp[5]") / 3600;
                    } else {
                        break;
                    }
                case 'hddd°mm.mmm\'':
                    if (!isset($deg)) {
                        if (preg_match('/([NEWS])(\d+).(\d+)\.(\d+)/u', strtoupper($value), $temp)) {
                            $deg = $temp[2] + floatval("$temp[3].$temp[4]") / 60;
                        } else {
                            break;
                        }
                    }
                case 'hddd.dddd°':
                    if (!isset($deg)) {
                        if (preg_match('/([NEWS])(\d+)\.(\d+)/', strtoupper($value), $temp)) {
                            $deg = floatval("$temp[2].$temp[3]");
                        } else {
                            break;
                        }
                    }
                    if (isset($deg)) {
                        $min = (($deg - floor($deg)) * 60);
                        $sec = ($deg - floor($deg) - (floor($min))/60) * 3600;
                        switch ($to) {
                            case 'hddd°mm\'ss.s"':
                                $format = in_array($temp[1],['N','S'])?'%s%02d°%02d\'%04.2f"':'%s%03d°%02d\'%04.2f"';
                                $result = sprintf($format, $temp[1], $deg, $min, $sec);
                                break;
                            case 'hddd°mm.mmm\'':
                                $result = sprintf('%s%03d°%06.3f', $temp[1], $deg, $min);
                                break;
                            case 'hddd.dddd°':
                                $result = sprintf('%s%07.4f°', $temp[1], $deg);
                                break;
                        }
                    }
                    break;
            }
        }
        if ($result===null) {
            $result = $value;
        }
        return $result;
    }
}
