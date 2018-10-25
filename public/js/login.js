/*
 *
 *	Streaming Media Hosting
 *	
 *	Login
 *
 *	6-01-2015
 */
//Main constructor
function Login() {}

//Global variables
var validator;

//Login prototype/class
Login.prototype = {
    constructor: Login,
    //Login action
    login:function(){
        var sessData = {
            email: $('#email').val(),
            password: $('#password').val(),
            _token: $('#_token').val()
        } 

        var reqUrl = '/api/auth/login';
 
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'POST',
            data:       sessData,
            beforeSend: function() {
                $('#login').attr('disabled','');
                $('#loading img').css('display','inline-block');
            },
            success:function(data) { 
                if(data['success']){
                    $('#loading').empty();
                    location.reload();
                } else {
                    $('#login').removeAttr('disabled');
                    $('#loading img').css('display','none');
                    $('#login-result').html('<div class="alert alert-danger">Sorry, wrong login credentials</div>');
                    setTimeout(function(){
                        $('#login-result').empty();
                    },5000);
                }         
            }
        });
    },
    //Register actions
    registerActions:function(){
        $('#login-form').on('click', '#login', function(){
            var valid = validator.form();
            if(valid){
                smhLogin.login();
            }   
        });
        
        $('#user-logout').on('click', '#logout', function(){
            smhLogin.logout();  
        });
        
        $("#login-form").on( "keypress", function(event) {
            if (event.which == 13 && !event.shiftKey) {
                var valid = validator.form();
                if(valid){
                    smhLogin.login();
                } 
            }
        });
    },
    //Register validators
    registerValidator:function(){
        $('#login-form input[type="email"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
            
        $('#login-form input[type="password"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#login-form").validate({
            highlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },        
            unhighlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules:{
                email:{
                    required: true,
                    email: true
                },
                password:{
                    required: true
                }
            },
            messages: {
                email:{
                    required: "Please enter your email"
                },
                password:{
                    required: "Please enter your password"
                }
            }
        }); 
    }
}

// Main on ready
$(document).ready(function(){
    smhLogin = new Login();
    smhLogin.registerActions();
    smhLogin.registerValidator();
});
