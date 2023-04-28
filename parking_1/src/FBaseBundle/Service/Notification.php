<?php

namespace FBaseBundle\Service;
use Doctrine\ORM\EntityManager;
use MessageBundle\Entity\MessagesQueue;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class Notification {
    
    private $em;
    private $token;

    
    public function __construct(EntityManager $em, TokenStorage $tokenStorage) {
        $this->em = $em;
        $this->token =  $tokenStorage;
    }

    public function notification(){
        $html = '';
        
        if(!empty($this->token)){
            $message_count = $this->em->getRepository(MessagesQueue::class)->count(['user'=>$this->token->getToken()->getUser()]);    
            $message = $this->em->getRepository(MessagesQueue::class)->findBy(['user'=>$this->token->getToken()->getUser()], ['id'=>'DESC'],5);
        
            $html = '';
            if(!empty($message)){
                foreach ($message as $key => $item) {
                    $template = $item->getTemplate()->getTemplateContentByProviderName('Notification');
                    $content = $this->messageCompiler($item->getData(),$template);
                    $severity = $item->getTemplate()->getSeverity()->getName();

                    $color_class = ['Important'=>'success','brand'=>'brand','Error'=>'danger','Warning'=>'warning','Notice'=>'info','focus'=>'focus','primary'=>'primary'];
                    $icon_class = ['flaticon2-line-chart','flaticon2-file','flaticon2-bell'];
                    shuffle($icon_class);
                    $html .='<a href="#" class="k-notification__item"><div class="k-notification__item-icon"><i class="'.$icon_class[0].' k-font-'.$color_class[$severity].'"></i></div><div class="k-notification__item-details"><div class="k-notification__item-title">'.$content.'</div><div class="k-notification__item-time">2 hrs ago</div></div></a>';
                }
            }
            $html = '<div class="k-header__topbar-item dropdown notifications">'.
                        '<div class="k-header__topbar-wrapper" data-toggle="dropdown" data-offset="30px -2px">'.
                            '<span class="k-header__topbar-icon"><i class="flaticon2-bell-alarm-symbol"></i></span>'.
                            '<span class="'.($message_count ? 'k-badge ' : '').'k-badge--dot k-badge--notify k-badge--sm k-badge--brand"></span>'.
                        '</div>'.
                        '<div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">'.
                            '<div class="k-head" style="background-image: url(assets/media/misc/head_bg_sm.jpg)">'.
                                '<h3 class="k-head__title">User Notifications</h3>'.
                                '<div class="k-head__sub">'.
                                    '<span class="k-head__desc">'.$message_count.' new notifications</span>'.
                                '</div>'.
                            '</div>'.
                            '<div class="k-notification k-margin-t-30 k-margin-b-20 k-scroll" data-scroll="true" data-height="270" data-mobile-height="220">'.
                                $html.
                            '</div>'.
                        '</div>'.
                    '</div>';
        }

        return $html;
    }

    private function messageCompiler($data, $template){
      
        $content = $template->getContent();
        foreach ($data as $key => $value) {
             if($key=='attach'){
                continue;
            }
            $content  = str_ireplace('{'.$key.'}', $value, $content);   
        }
        return  $content;
    }
}