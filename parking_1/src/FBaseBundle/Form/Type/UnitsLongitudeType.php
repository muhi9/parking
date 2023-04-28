<?php

namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UnitsLongitudeType extends AbstractType {
	private $userUnits = 'hddd.dddd°';

	public function configureOptions(OptionsResolver $resolver) {
		$mask = [
			//'hddd°mm\'ss.s"' => '(W|w|E|e)([0-8][0-9])\°([0-5][0-9])\'([0-5][0-9])\.([0-9][0-9])',
			//'hddd°mm.mmm\'' => '(W|w|E|e)([0-8][0-9])\°([0-5][0-9])\.([0-9][0-9][0-9])',
		    'hddd°mm\'ss.s"' => '(W|w|E|e)([0|1][0-7][0-9])\°([0-5][0-9])\'([0-5][0-9])\.([0-9][0-9])',
			'hddd°mm.mmm\''  => '(W|w|E|e)([0|1][0-7][0-9])\°([0-5][0-9])\.([0-9][0-9][0-9])',
			'hddd.dddd°' 	 => '(W|w|E|e)([0-1]?[0-9]{1,2})\.(\d+)°',
		];
		$resolver->setDefaults([
			'units' => ['hddd°mm\'ss.s"', 'hddd°mm.mmm\'', 'hddd.dddd°'],
			'default_unit' => 'hddd°mm\'ss.s"',
			'default_unit_getter' => 'getGeographicCoordinateUnits',
			'normalized_unit' => 'hddd°mm\'ss.s"',
            'input_numeric' => false,
            'hide_units' => true,
			'input_options' => [
				'attr'=>[
					'class'=>'mask-regex touppercase',
					'regex' => $mask[$this->userUnits],
					'placeholder' => 'input.longitude.placeholder',
				],
			],
		]);
	}

	public function getParent() {
		return UnitsType::class;
	}
}

