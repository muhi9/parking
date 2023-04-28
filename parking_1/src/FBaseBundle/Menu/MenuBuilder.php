<?php

namespace FBaseBundle\Menu;
use Symfony\Component\DependencyInjection\Container;
//use Symfony\Component\Routing\Exception\RouteNotFoundException;
//use \Symfony\Component\RoutingException\ResourceNotFoundException;




class MenuBuilder{

    private $container;

    function __construct(Container $container){

        $this->container = $container;

    }
    public function menuBuilder(){
        $menuItems =$this->container->getParameter('menu');
        $isSuperAdmin = $this->container->get('user.permissions')->isSuperAdmin();
        $isAdmin = $this->container->get('user.permissions')->isAdmin();
        $isOperator = $isAdmin || $this->container->get('user.permissions')->isOperator();
        $isClient = $this->container->get('user.permissions')->isClient();
      
      
        foreach ($menuItems as $k=>$menu) {
            
            if (!empty($menu['rights']) && (stripos($menu['rights'], 'client')!==false && (!$isClient && !$isAdmin && !$isOperator))){
                unset($menuItems[$k]);
                continue;
            }

            if (!empty($menu['rights']) 
                    && (
                        (stripos($menu['rights'], 'admin')!==false && !$isAdmin) 
                        && (stripos($menu['rights'], 'operator')!==false && !$isOperator)
                        && (stripos($menu['rights'], 'su')!==false && !$isSuperAdmin)
                    )
                ) {

                unset($menuItems[$k]);
            }
            if (isset($menu['sub'])) {
                foreach ($menu['sub'] as $sk=>$sub) {
                    if (!empty($sub['rights']) 
                        && (
                            (stripos($sub['rights'], 'admin')!==false && !$isAdmin) 
                            || (stripos($sub['rights'], 'operator')!==false && !$isOperator)
                            || (stripos($sub['rights'], 'su')!==false && !$isSuperAdmin)
                        )
                    ) {
                        unset($menuItems[$k]['sub'][$sk]);
                    }
                }
                if (empty($menuItems[$k]['sub']) && empty($menuItems[$k]['path'])) {
                    unset($menuItems[$k]);
                }
            }
        }

        return $this->container->get('twig')->render('@FBase/Menu/'.$this->container->getParameter('menuView').'.html.twig',['menu'=>$menuItems]);
    }



    public function breadCrumb(){
        $path = $this->container->get('request_stack')->getCurrentRequest()->getPathInfo();
        //echo '-------'.$path.'--------;';exit;
        try {
            $last = $this->container->get('router')->match($path);
        } catch (\Exception $e) {
            throw new \Exception("Unable to find route: ". $path . " in menu.yml. Please add it.", 1442);

        }
        $parent = null;

        $parents = explode('/', $path);
        $match = [];

        foreach($parents as $p) {
            if (stristr($p, 'add') || stristr($p, 'edit') || stristr($p, 'del') || stristr($p, 'list') || stristr($p, 'show')){
                $match[] = '';
                break;
            }
            $match[] = $p;
        }


        if (sizeof($match) > 0){
            try {
                $parent = $this->container->get('router')->match(implode('/',$match));
            } catch (\Exception $e) {
                return null;
            }

        }else{
            return null;
        }

        $opts = ['last'=>$last,];
        if ($parent){
            $opts['parent'] = $parent; 
        }

        return $this->container->get('twig')->render('@FBase/Menu/breadCrumb.html.twig',$opts);

    }
}

