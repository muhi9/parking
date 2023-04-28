<?php
namespace FBaseBundle\Service;
use Symfony\Component\DependencyInjection\Container;

class Helper {

	private $container = null;


    public function __construct(Container $container) {
        $this->container = $container;
    }
    
    public function urlToArray($url){
        $split_parameters = explode('&', $url);
        for($i = 0; $i < count($split_parameters); $i++) {
            $final_split = explode('=', $split_parameters[$i]);
            $url_array[$final_split[0]] = $final_split[1];
        }
        return $url_array;
    }

    public function rootDir(){
        $path = explode('/', $this->container->get('kernel')->getProjectDir());
        return end($path);
    }
}
        
