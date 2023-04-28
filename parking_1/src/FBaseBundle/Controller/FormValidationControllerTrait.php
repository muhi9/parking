<?php
namespace FBaseBundle\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

trait FormValidationControllerTrait {

    /**
      * Handle xhr request - validate form and return formErrors if any
     * @param $form Form validation
     * @return false / array ['formErrors'=>$errors];
      */
    public function xhrValidateForm(FormInterface $form) {
        $request = $this->container->get('request_stack')->getCurrentRequest();
        if($form->isSubmitted() && $request->isXmlHttpRequest()) {
            $errors = $this->formErrors($form);
            if($errors && $form->isSubmitted()) {
                    return ['formErrors' => $errors];
            }
        }
        return false;
    }

    public function xhrValidateEntity($e) {
        $validator = $this->get('validator');
        $errorsValidator = $validator->validate($e);
        $errors = [];
        foreach ($errorsValidator as $field => $error) {
            $errors[$error->getPropertyPath()] = $error->getMessage();
        }
        if (sizeof($errors)>0) {
            return ['formErrors' => $errors];
        }
        return false;
    }
    /**
     * Handle form validation with passed form
     * @param $form Form validation
     * @return false / array ['field'=>'error',...]
     */
    public function formErrors(FormInterface $form) {
        $validator = $this->get('validator');
        $request = $this->container->get('request_stack')->getCurrentRequest();
        $errorsValidator = $validator->validate($form);
        if (sizeof($errorsValidator) > 0) {
            $errors = [];
            $fname = $form->getName();
            foreach ($errorsValidator as $field => $error) {
                $field = $error->getPropertyPath();
                $field1 = $error->getPropertyPath();
                    $field = str_replace(['.children', 'children[', '].data'], ['', $fname.'[', ']'], $field);
                    $field1 = strtolower(str_replace(['children[', '].data', 'data.'], ['', ''], $field1));
                if (substr($field, 0, 5) == 'data.') {
                  if (preg_match('/data\.(.*)(\[[\d]+\])\.(.*)$/', $field, $m)) {
                    $field = 'data.' . $m[1]. ']' . $m[2] . '['.$m[3];
                  }
                  $field = $fname.'['.substr($field,5).']';
                }
                if(strpos($field, 'user_form[user.') !== false) {

                  $field = str_replace('.', '][', $field);
                }
               
                $postvars = $request->get($fname);
                $currval = null;
                if (isset($postvars[$field1]) && !empty($postvars[$field1])) {
                    $currval = '; Current value: '.$postvars[$field1];
                }
                $translator = $this->get('translator');
                if ($translator)
                  $errors[$field] = ($translator->trans($error->getMessage()) . $currval);
                else
                  $errors[$field] = ($error->getMessage() . $currval);

                $errors[$field] = str_replace(array_keys($error->getParameters()), $error->getParameters(), $errors[$field]);
            }

            return $errors;
        }
        return false;
    }

    /**
     * Returns a RedirectResponse OR JsonResponse(['redirectTo'=>'...']) to the given route with the given parameters.
     *
     * @param string $route      The name of the route
     * @param array  $parameters An array of parameters
     * @param int    $status     The status code to use for the Response
     *
     * @return RedirectResponse
     *
     * @final since version 3.4
     */
    protected function redirectToRoute($route, array $parameters = [], $status = 302)
    {
        $request = $this->container->get('request_stack')->getCurrentRequest();
        $hash = null;
        if ($route == 'user_license') {
          $route = 'profile_edit';
          if (isset($parameters['profile'])) {
            $parameters['id'] = $parameters['profile'];
            $parameters['profile'] = null;
          }
          $parameters['activate_tab'] = 'licenses';
        }
        if (isset($parameters['activate_tab'])) {
          $hash = '#'.$parameters['activate_tab'];
          $parameters['activate_tab'] = null;
        }

        if ($request->isXmlHttpRequest()) {
            return new JsonResponse(['redirectTo' => $this->generateUrl($route, $parameters).$hash]);
        }

        return $this->redirect($this->generateUrl($route, $parameters) . $hash, $status);
    }


    /**
     * Clear and return type of flash set in argument.
    */
    private function clearFlash($type) {
      $flashbag = $this->get('session')->getFlashBag();
      return $flashbag->get($type);
    }
}
