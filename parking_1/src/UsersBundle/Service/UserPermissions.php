<?php
namespace UsersBundle\Service;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class UserPermissions {
	
	private $token;

    public function __construct(TokenStorage $tokenStorage) {
        $this->token =  $tokenStorage;
    }
    public function isSuperAdmin(){
        return $this->userIs('ROLE_SUPER_ADMIN');
    }
   	public function isAdmin(){
    	return $this->userIs('ROLE_ADMIN');
    }

    public function isOperator(){
    	return $this->userIs('ROLE_OPERATOR');
    }

    public function isInstructor(){
    	return $this->userIs('ROLE_INSTRUCTOR');
    }

    public function isClient(){
        return $this->userIs('ROLE_CLIENT');
    }

    public function isStudent(){
    	return $this->userIs('ROLE_STUDENT');
    }

    public function isUser(){
        return $this->userIs('ROLE_USER');
    }

    private function userIs($role){
        
        if($this->token->getToken()->getUser()!="anon."){
            return in_array($role, $this->token->getToken()->getUser()->getRoles())?true:false;
        }else {
            return false;
        }
    }

     /** 
     * @param (array) $roles = [admin, operator, instructor, student, client]
     * @return bool
     */
    public function accessLevel($roles = []) {
        $access = false;
        foreach ($roles as $role) {
            $role = 'ROLE_'.strtoupper($role);
            if($this->userIs($role)){
               $access = true; 
            }
        }
        return $access;
    }
}
