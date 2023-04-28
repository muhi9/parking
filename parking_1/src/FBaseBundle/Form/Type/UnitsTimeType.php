<?php

namespace FBaseBundle\Form\Type;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;


class UnitsTimeType extends AbstractType {
	public function configureOptions(OptionsResolver $resolver) {
		$resolver->setDefaults([
			'units' => ['sec', 'min', 'hr'],
			'default_unit' => 'sec',
			'default_unit_getter' => 'getTimeUnits',
			'normalized_unit' => 'sec',
		]);
	}

	public function getParent() {
		return UnitsType::class;
	}
}
