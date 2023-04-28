<?php

namespace FBaseBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;

class DefaultController extends Controller
{
    /**
     * @Route("/demo",name="demo")
     */
    public function indexAction()
    {
    	return $this->render('FBaseBundle:Default:index.html.twig');
    }

	/**
	 * @Route("/session-keep", name="session_keep_alive")
	 */
	public function sessionKeepAction(Request $request) {
		if ($request->isXmlHttpRequest()) {
			$securityContext = $this->get('security.authorization_checker');
			return new JsonResponse($this->get('session')->get('lastUsed'));
		}else{
			 return $this->redirectToRoute('homepage');
		}
	}

	/**
	 * @Route("/session-check", name="session_check_alive")
	 */
	public function sessionCheckAction(Request $request) {
		if ($request->isXmlHttpRequest()) {
			//check if log in if not redirect to login page
			return new JsonResponse($this->get('session')->get('lastUsed'));
		}else{
			 return $this->redirectToRoute('homepage');
		}
	}
	
}
