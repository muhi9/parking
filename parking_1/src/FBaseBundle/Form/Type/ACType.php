<?php

namespace FBaseBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Psr\Container\ContainerInterface;


class ACType extends AbstractType {

    private $container = false;
    public function __construct(ContainerInterface $container){
              $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
    }



    public function buildView(FormView $view, FormInterface $form, array $options) {
        $view->vars['deleted'] = $options['deleted'];
        $view->vars['url'] = $options['url'];
        $view->vars['url_image'] = $options['url_image'];
        $view->vars['url_create'] = $options['url_create'];
        $view->vars['url_reload'] = $options['url_reload'];
        $view->vars['allow_create'] = $options['allow_create'];
        $view->vars['clear_text_on_blur'] = $options['clear_text_on_blur'];
        $view->vars['link'] = $options['link'];
        $view->vars['link_admin'] = $options['link_admin'];
        $view->vars['choice_label'] = $options['choice_label'];
        $view->vars['filterFields'] = [];
        $view->vars['filterPredefined'] = array_filter($options['filterPredefined'], function($val) {
            return $val!==NULL;
        });

        foreach ($options['filterFields'] as $ajaxFieldName => $fieldName) {
            $tmp = $view;
            $i=10;
            while ($i-- && ($tmp = $tmp->parent) && empty($tmp->children[$fieldName])) {}
            if (empty($tmp->children[$fieldName])) {
                throw new \Exception("Field \"$fieldName\" is missing", 1);
            }
            if (is_numeric($ajaxFieldName)) {
                $ajaxFieldName = $fieldName;
            }

            if(!isset($tmp->children[$fieldName]->vars['attr']['class'])){
                $tmp->children[$fieldName]->vars['attr']['class'] = 'findTarget';
            }else{
                $tmp->children[$fieldName]->vars['attr']['class'].= strrpos($tmp->children[$fieldName]->vars['attr']['class'],'findTarget')===false?' findTarget':'';
            }

            if (!is_null($tmp->vars['data'])) {
                $error_message = !empty($this->container->get('validator')->getMetadataFor($tmp->vars['data'])->getPropertyMetadata($fieldName))?$this->container->get('validator')->getMetadataFor($tmp->vars['data'])->getPropertyMetadata($fieldName)[0]->getConstraints()[0]->message:false;
            }

            if(!empty($error_message)){
                $tmp->children[$fieldName]->vars['attr']['error_msg'] = $this->container->get('translator')->trans($error_message);
            }

            $view->vars['filterFields'][$ajaxFieldName] = $tmp->children[$fieldName]->vars['id'];
            $view->vars['filterFields'][$ajaxFieldName] = $tmp->children[$fieldName]->vars['id'];
        }
    }



    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults([
            'attr' => [
                'class' => 'autocomplete',
            ],
            'url' => false,
            'url_image' => false,
            'url_create' => false,
            'url_reload' => false,
            'allow_create' => false,
            'clear_text_on_blur' => true,
            'link' => false,
            'link_admin' => false,
            'filterFields' => [],
            'filterPredefined' => [],
            'choice_label' => 'id',
            'deleted' => false,
        ]);

    }



    public function getParent() {
        return EntityType::class;
    }

}