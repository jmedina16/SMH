/*
 *
 *	Streaming Media Hosting
 *	
 *	Help
 *
 *	9-15-2015
 */
//Main constructor
function Help() {}

//Global variables
var validator;

//Login prototype/class
Help.prototype = {
    constructor: Help,
    //Submits new ticket
    submitTicket:function(){
        $('#ticketForm input[type="text"], #ticketForm select, textarea[name=message]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#ticketForm").validate({
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
                name:{
                    required: true
                },
                useremail:{
                    required: true,
                    email: true
                },
                topicId:{
                    required: true
                },
                subject:{
                    required: true
                },
                message:{
                    required: true
                }
            },
            messages: {
                name:{
                    required: "Please enter your full name"
                },
                useremail:{
                    required: "Please enter your email address",
                    email: "Please enter a vaild email address"
                },
                topicId:{
                    required: "Please select a topic"
                },
                subject:{
                    required: "Please enter a subject"
                },
                message:{
                    required: "Please enter a message"
                }
            }
        });
        
        var valid = validator.form();
        if(valid){
            $('#ticketForm').submit();
        }
    },
    //Register actions
    registerActions:function(){
    }
}

// Main on ready
$(document).ready(function(){
    smhHelp = new Help();
});
