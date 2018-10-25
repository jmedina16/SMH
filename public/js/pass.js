/*
 *
 *	Streaming Media Hosting
 *	
 *	Pass
 *
 *	6-01-2015
 */
//Main constructor
function Pass() {}

//Global variables
var validator;

//Login prototype/class
Pass.prototype = {
    constructor: Pass,
    //Register actions
    registerActions:function(){
        $("#login-form").on( "keypress", function(event) {
            if (event.which == 13 && !event.shiftKey) {
                var valid = validator.form();
                if(valid){
                    smhPass.setPass();
                } 
            }
        });
    },
    //Register validators
    registerValidator:function(){           
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
                pass1:{
                    required: true
                },
                pass2:{
                    required: true,
                    equalTo: '#pass1'
                }
            },
            messages: {
                pass1:{
                    required: "Please enter your password"
                },
                pass2:{
                    required: "Please re-enter your password",
                    equalTo: 'Passwords do not match'
                }
            }
        }); 
    },
    //Reset Modal
    resetModal:function(){
        $('#smh-modal .modal-header').empty(); 
        $('#smh-modal .modal-body').empty();
        $('#smh-modal .modal-footer').empty();
        $('#smh-modal .modal-content').css('min-height','');
        $('#smh-modal .smh-dialog2').css('width','');
        $('#smh-modal .modal-body').css('height','');
        $('#smh-modal .modal-body').css('padding','15px');
    },
    //Set Password
    setPass:function(){
        var valid = validator.form();
        if(valid){
            var pass1 = $('input[name=pass1]').val();
            var pass2 = $('input[name=pass2]').val();
            var length = /^.{8,14}$/;
            var lowercase = /^(?=.*[a-z]).+$/;
            var digit = /^(?=.*\d).+$/;
            var special = /^(?=.*[%~!@#$^*=+?[\]{}])+/;
            var arrows = /^[^<>]+$/;
            if(!length.test(pass2) || !lowercase.test(pass2) || !arrows.test(pass2) || !digit.test(pass2) || !special.test(pass2)){                    
                smhPass.error_ne();
                return false;                   
            } else {
                var sessData = {
                    service: "user",
                    action: "setInitialPassword",
                    hashKey: setpasshashkey,
                    newPassword: pass1,
                    format: "1"
                };

                var reqUrl = "/api_v3/index.php?"; 
                $.ajax({
                    cache:      false,
                    url:        reqUrl,
                    async:      false,
                    type:       'POST',
                    data:       sessData,
                    dataType:   'json',
                    beforeSend: function(){
                        $('#loading img').css('display','inline-block');
                    },
                    success:function(data) {
                        $('#loading img').css('display','none');
                        if(data == null){
                            smhPass.pass_succ(); 
                        } else {
                            if(data['code'] == "NEW_PASSWORD_HASH_KEY_INVALID" || data['code'] == "NEW_PASSWORD_HASH_KEY_EXPIRED"){
                                alert("This link is invalid or has expired.");
                            }
                        } 
                    }          
                }); 
            }
        }
    },
    pass_succ:function(){
        smhPass.resetModal();
        var header, content;
        $('.smh-dialog').css('width','415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });                         
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Password Set</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size: 13px; width: 340px; margin-left: auto; margin-right: auto; text-align: left;">'+
        '<h4>Your password has been successfully set!</h4>'+
        '<p>You will now be redirected to the login page. If you are not redirected, please click on the following link: <a href="https://mediaplatform.streamingmediahosting.com">https://mediaplatform.streamingmediahosting.com</a></p>'+
        '</div>'; 
        $('#smh-modal .modal-body').html(content);
        
        setTimeout(function(){
            window.location.href = "https://mediaplatform.streamingmediahosting.com";
        },5000); 
    },
    error_ne:function(){
        smhPass.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });                         
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Error</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size: 13px; width: 340px; margin-left: auto; margin-right: auto;">The password you entered has an invalid structure.<br />'+
        'Passwords must obey the following rules :<br />'+
        '<ul>'+
        '<li>Must be of length between 8 and 14</li>'+
        '<li>Must not contain your name</li>'+
        '<li>Must contain at least one lowercase letter (a-z)</li>'+
        '<li>Must contain at least one digit (0-9)</li>'+
        '<li>Must contain at least one of the following symbols: <br>% ~ ! @ # $ ^ * = + ? [ ] { }</li>'+
        '<li>Must not contain the following characters: < or ></li>'+
        '</ul>'+
        '</div>'; 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    }
}

// Main on ready
$(document).ready(function(){
    smhPass = new Pass();
    smhPass.registerActions();
    smhPass.registerValidator();
});
