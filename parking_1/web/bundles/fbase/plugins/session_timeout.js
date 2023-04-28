
var SessionTimeout = function () {
    var init = function () {
        $.sessionTimeout({
            title: 'Session Timeout Notification',
            message: 'Your session is about to expire.',
            logoutButton: 'Logout',
            keepAliveButton: 'Stay Connected',
            keepAliveUrl: urls.session_keep_alive,
            sessionCheckUrl: urls.session_check_alive,
            redirUrl: urls.fos_user_security_logout,
            logoutUrl: urls.fos_user_security_logout,
            warnAfter: (session_settings.max_life*1000), //second to miliseconds
            redirAfter: ((session_settings.max_life+session_settings.countdown)*1000), //second to miliseconds 
            keepAliveInterval: 60000, //1 min
            countdownMessage: 'Redirecting in {timer} seconds.',
            countdownBar: true,
            ignoreUserActivity: false,
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            init();
        }
    };

}();

$(document).ready(function() {
     SessionTimeout.init();   
 });