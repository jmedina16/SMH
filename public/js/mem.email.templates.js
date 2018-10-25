/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	MEM
 *
 *	7-3-2014
 */
//MEM constructor
function MEM() {}

//Global variables
var ApiUrl = "/apps/mem/v1.0/index.php?";
var validator;
var email_data = new Array();

//MEM prototype/class
MEM.prototype = {
    constructor: MEM,
    //Gets emails
    getEmail:function(){
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
    
        var reqUrl = ApiUrl+'action=get_email';
        
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            success:function(data) {
                email_data = data; 
                if(data['custom_reg_default'] == '1'){
                    $('#reg-email-template').val('custom'); 
                    $('#reg_subject').removeAttr('disabled');
                    $('#reg_subject').val(data['custom_reg_subject']);
                    $('#reg_body').val(data['custom_reg_body']);
                
                } else {
                    $('#reg-email-template').val('default'); 
                    $('#reg_subject').attr('disabled',''); 
                    $('#reg_subject').val(data['default_reg_subject']);
                    $('#reg_body').val(data['default_reg_body']);                
                }
                $('#reg_body').wysihtml5({
                    "font-styles": true, 
                    "emphasis": true,
                    "lists": true, 
                    "html": true,
                    "link": true,
                    "image": true,
                    "color": false,
                    "blockquote": true 
                });
                
                if(data['custom_thankyou_default'] == '1'){
                    $('#ty-email-template').val('custom'); 
                    $('#ty_subject').removeAttr('disabled');
                    $('#ty_subject').val(data['custom_thankyou_subject']);
                    $('#ty_body').val(data['custom_thankyou_body']);
                
                } else {
                    $('#ty-email-template').val('default'); 
                    $('#ty_subject').attr('disabled','');
                    $('#ty_subject').val(data['default_thankyou_subject']);
                    $('#ty_body').val(data['default_thankyou_body']);                
                }
                $('#ty_body').wysihtml5({
                    "font-styles": true, 
                    "emphasis": true,
                    "lists": true, 
                    "html": true,
                    "link": true,
                    "image": true,
                    "color": false,
                    "blockquote": true 
                });
                
                if(data['custom_pswd_default'] == '1'){
                    $('#pswd-email-template').val('custom'); 
                    $('#pswd_subject').removeAttr('disabled');
                    $('#pswd_subject').val(data['custom_pswd_subject']);
                    $('#pswd_body').val(data['custom_pswd_body']);
                
                }
                else {
                    $('#pswd-email-template').val('default'); 
                    $('#pswd_subject').attr('disabled',''); 
                    $('#pswd_subject').val(data['default_pswd_subject']);
                    $('#pswd_body').val(data['default_pswd_body']);                
                }
                
                $('#pswd_body').wysihtml5({
                    "font-styles": true, 
                    "emphasis": true,
                    "lists": true, 
                    "html": true,
                    "link": true,
                    "image": true,
                    "color": false,
                    "blockquote": true 
                });
            }
        });
    },
    //Saves regular email
    saveRegEmail:function(){
        var validator = $("#pur-email").validate({
            ignore: [],
            highlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },        
            unhighlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            rules:{               
                reg_subject:{
                    required: true
                }           
            },
            messages: {          
                reg_subject:{
                    required: "Please enter a subject"
                }
            }
        });
    
        var valid = validator.form();
        if(valid){
            var reg_select = $('#reg-email-template option:selected').val();  
            var reg_subject = $('#reg_subject').val();
            var container = $("#register-table iframe");
            var reg_body = container.contents().find("body").html();
            var sessData;

            if(!reg_body){
                alert('Please enter a message');
            } else if (reg_body.indexOf('<strong>%user_email%</strong>') == -1){
                alert('You must have at least the "User Email" variable in your message.');
            }else {
                if(reg_select == 'custom'){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        reg_default: 1,
                        reg_subject: reg_subject,
                        reg_body: reg_body
                    }        
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        reg_default: 0,
                        reg_subject: reg_subject,
                        reg_body: reg_body
                    }   
                }
    
                var reqUrl = ApiUrl+'action=add_email_reg';   
                $.ajax({
                    cache:      false,
                    url:        reqUrl,
                    type:       'GET',
                    data:       sessData,
                    dataType:   'json',
                    beforeSend:function(){
                        $('#save_pur').attr('disabled','');
                        $('#register-email #loading img').css('display','inline-block');
                    },
                    success:function(data) {
                        if(data['success']){
                            $('#save_pur').removeAttr('disabled'); 
                            $('#register-email #loading img').css('display','none'); 
                            $('#register-email #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                            setTimeout(function(){
                                $('#register-email #pass-result').empty();
                            },5000); 
                        } 
                    }
                }); 
            } 
        } 
    },
    //Saves password email
    savePswdEmail:function(){
        var validator = $("#pswd-email").validate({
            ignore: [],
            highlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },        
            unhighlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            rules:{               
                pswd_subject:{
                    required: true
                }           
            },
            messages: {          
                pswd_subject:{
                    required: "Please enter a subject"
                }
            }
        });
    
        var valid = validator.form();
        if(valid){
            var pswd_select = $('#pswd-email-template option:selected').val();   
            var pswd_subject = $('#pswd_subject').val();
            var container = $("#pswd-table iframe");
            var pswd_body = container.contents().find("body").html();
            var sessData;
    
            if(!pswd_body){
                alert('Please enter a message');
            }
            else {
                if(pswd_select == 'custom'){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        pswd_default: 1,
                        pswd_subject: pswd_subject,
                        pswd_body: pswd_body
                    }        
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        pswd_default: 0,
                        pswd_subject: pswd_subject,
                        pswd_body: pswd_body
                    }   
                }
    
                var reqUrl = ApiUrl+'action=add_email_pswd';
   
                $.ajax({
                    cache:      false,
                    url:        reqUrl,
                    type:       'GET',
                    data:       sessData,
                    dataType:   'json',
                    beforeSend:function(){
                        $('#save_pswd').attr('disabled','');
                        $('#pass-email #loading img').css('display','inline-block');
                    },
                    success:function(data) {
                        if(data['success']){
                            $('#save_pswd').removeAttr('disabled'); 
                            $('#pass-email #loading img').css('display','none'); 
                            $('#pass-email #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                            setTimeout(function(){
                                $('#pass-email #pass-result').empty();
                            },5000); 
                        } 
                    }
                }); 
            } 
        } 
    },
    //Adds regular variables
    addRegVariable:function(){
        var vararr = new Array();
        vararr[0] = '<strong>%business_name%</strong>';
        vararr[1] = '<strong>%user_email%</strong>';
        vararr[2] = '<strong>%email%</strong>'; 
    
        var reg_select = $('#reg-email-template option:selected').val();
        if(reg_select == 'custom'){
            var sel = $('#reg-variables option:selected').val();
            var container = $("#register-table iframe");
            var body = container.contents().find("body");
            var ct = body.html();
            body.html(ct + ' ' + vararr[sel]);      
        }  
    },
    //Adds password email variables
    addPswdVariable:function(){
        var vararr = new Array();
        vararr[0] = '<strong>%business_name%</strong>';
        vararr[1] = '<strong>%user_email%</strong>';
        vararr[2] = '<strong>%email%</strong>'; 
    
        var pswd_select = $('#pswd-email-template option:selected').val();
        if(pswd_select == 'custom'){
            var sel = $('#pswd-variables option:selected').val();
            var container = $("#pswd-table iframe");
            var body = container.contents().find("body");
            var ct = body.html();
            body.html(ct + ' ' + vararr[sel]);       
        } 
    },
    //Clears regular email data
    clearRegData:function(){
        var reg_select = $('#reg-email-template option:selected').val();
        if(reg_select == 'custom'){
            var container = $("#register-table iframe");
            var body = container.contents().find("body");
            body.html('');
            $('textarea#reg_body').text('');
            $('#reg_subject').val('');        
        }
    },
    //Clears password email data
    clearPswdData:function(){
        var pswd_select = $('#pswd-email-template option:selected').val();
        if(pswd_select == 'custom'){
            var container = $("#pswd-table iframe");
            var body = container.contents().find("body");
            body.html('');
            $('textarea#pswd_body').text('');
            $('#pswd_subject').val('');        
        }
    },
    restoreRegData:function(){
        var reg_select = $('#reg-email-template option:selected').val();
        if(reg_select == 'custom'){
            $('#reg_subject').val(email_data['custom_reg_subject']);
            var container = $("#register-table iframe");
            var body = container.contents().find("body");
            body.html(email_data['custom_reg_body']);
        }
    },
    //Restores password email data
    restorePswdData:function(){
        var pswd_select = $('#pswd-email-template option:selected').val();
        if(pswd_select == 'custom'){
            $('#pswd_subject').val(email_data['custom_pswd_subject']);
            var container = $("#pswd-table iframe");
            var body = container.contents().find("body");
            body.html(email_data['custom_pswd_body']);
        }
    },
    //Register all user actions
    registerActions:function(){
        $('#reg-email-template').change(function(){
            if($('#reg-email-template').val() == 'default'){
                $('#reg_subject').attr('disabled','');
                $('#reg_subject').val(email_data['default_reg_subject']);                    
                var container = $("#register-table iframe");
                var body = container.contents().find("body");
                body.html(email_data['default_reg_body']);
            } else {
                $('#reg_subject').removeAttr('disabled');
                $('#reg_body').removeAttr('disabled');   
                if(email_data['custom_reg_subject'] == ''){
                    $('#reg_subject').val(email_data['default_reg_subject']);
                } else {
                    $('#reg_subject').val(email_data['custom_reg_subject']);
                }                    
                if(email_data['custom_reg_body'] == ''){                                            
                    var container = $("#register-table iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['default_reg_body']);
                } else {
                    var container = $("#register-table iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['custom_reg_body']);
                }
            }
        });
        $('#pswd-email-template').change(function(){
            if($('#pswd-email-template').val() == 'default'){
                $('#pswd_subject').attr('disabled','');
                $('#pswd_subject').val(email_data['default_pswd_subject']);                    
                var container = $("#pswd-table iframe");
                var body = container.contents().find("body");
                body.html(email_data['default_pswd_body']);
            } else {
                $('#pswd_subject').removeAttr('disabled');
                $('#pswd_body').removeAttr('disabled'); 
                if(email_data['custom_pswd_subject'] == ''){
                    $('#pswd_subject').val(email_data['default_pswd_subject']);
                } else {
                    $('#pswd_subject').val(email_data['custom_pswd_subject']);
                }                    
                if(email_data['custom_pswd_body'] == ''){                                            
                    var container = $("#pswd-table iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['default_pswd_body']);
                } else {
                    var container = $("#pswd-table iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['custom_pswd_body']);
                }
            }
        });
    }
}

// MEM on ready
$(document).ready(function(){
    smhMEM = new MEM();
    smhMEM.registerActions();
    smhMEM.getEmail();
});
