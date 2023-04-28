<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use ParkingBundle\Entity\Parking;
use ParkingBundle\Entity\ParkingSpaces;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{

	use \FBaseBundle\Controller\DataGridControllerTrait;
	use \FBaseBundle\Controller\FormValidationControllerTrait;

	/**
	 * @Route("/", name="homepage")
	 */
	public function indexAction(Request $request)
	{

		$repository = $this->getDoctrine()->getRepository(Parking::class);
		$products = $repository->findAll();
		$parkingInfo = [];
		foreach ($products as $parking) {

			$parkingInfo[] = [
				'parkingID' => $parking->getId(),
				'name' => $parking->getName(),
				'address' => $parking->getAddress(),
				'long' => $this->coordinatNorm($parking->getlongitude()),
				'lat' => $this->coordinatNorm($parking->getLatitude()),
				'allSpaces' => count($parking->getSpaces()),
				'workTime' => $parking->getWorkTime(),
				'freeSpaces' => count($parking->getFreespaces()),
				'spaceNum' => $parking->getSpaceNum(),
			];
		}

		return $this->render('AppBundle:Default:index.html.twig', [
			"info" => $parkingInfo,
			'title'=>""
		]);
	}

	private function coordinatNorm($coordinates)
	{
		//$res = substr($coordinates,1);
		$result = null;
		if (preg_match("/[0-9]+.[0-9]+/", $coordinates, $match)) {
			$result = $match[0];
		} else {
			//todo? 
		}

		return (float)$result;
	}
}
