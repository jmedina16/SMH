/*
 *
 *	Streaming Media Hosting
 *	
 *	Main
 *
 *	6-01-2015
 */
//Main constructor
function Main(pid,ks) {
    this.pid = pid;
    this.ks = ks;
}

//Global variables
var validator, config, client;
var top_nav_background_color = '#1c84b0', side_nav_bgcolor = '#222D32';
var settings = false;
var layout_top_settings = false;
var layout_top_edit = false;
var layout_side_edit = false;
var layout_side_settings = false; 
var layout_logo_image = false;
var layout_logo_text = true;
var layout_logo_id = -1;
var protocol = location.protocol;
var domain = protocol+'//'+location.host+'/';

//Main prototype/class
Main.prototype = {
    constructor: Main,
    //Creates Kaltura client
    createClient:function(){
        config = new KalturaConfiguration(Number(this.pid));
        config.serviceUrl = domain;
        client = new KalturaClient(config);    
        client.ks = this.ks;
    },
    //Logout action
    logout:function(){
        var reqUrl = '/api/auth/logout';
        
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content')
        } 
 
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'POST',
            data:       sessData,
            success:function(data) { 
                location.reload();     
            }
        });
    },
    //Display Custom Text options
    custom_text_options:function(){
        layout_logo_image = false;
        layout_logo_text = true;
        var cust_text = '<div style="width: 129px; margin-top: 10px; font-size: 11px;"><i>Publisher/Company Name<br> from your settings will be<br> used.</i></div>'+
        '<div class="sub-title">Font Size</div>'+
        '<div class="input-group col-xs-7">'+
        '<select class="form-control" id="logo-font-size" name="logo-font-size" onchange="smhMain.changeLogoFontSize();">'+
        '<option value="1">1</option>'+
        '<option value="2">2</option>'+
        '<option value="3">3</option>'+
        '<option value="4">4</option>'+
        '<option value="5">5</option>'+
        '<option value="6">6</option>'+
        '<option value="7">7</option>'+
        '<option value="8">8</option>'+
        '<option value="9">9</option>'+
        '<option value="10">10</option>'+
        '<option value="11">11</option>'+
        '<option value="12">12</option>'+
        '<option value="13">13</option>'+
        '<option value="14">14</option>'+
        '<option value="15">15</option>'+
        '<option value="16">16</option>'+
        '<option value="17">17</option>'+
        '<option value="18">18</option>'+
        '<option value="19">19</option>'+
        '<option value="20" selected>20</option>'+
        '<option value="21">21</option>'+
        '<option value="22">22</option>'+
        '<option value="23">23</option>'+
        '<option value="24">24</option>'+
        '<option value="25">25</option>'+
        '<option value="26">26</option>'+
        '<option value="27">27</option>'+
        '<option value="28">28</option>'+
        '<option value="29">29</option>'+
        '<option value="30">30</option>'+
        '</select>'+
        '<span style="position: relative; top: 5px; left: 5px;">px</span>'+
        '</div>';
        $('#logo-content').html(cust_text);
        $('#logo').html(sessInfo.company);
        $('#logo').css('color',$('.top-nav-font-color input').val());
    },
    //Change log font size
    changeLogoFontSize:function(){
        $('#logo').css('font-size',$('#logo-font-size').val()+'px');
    },
    //Display Custom Logo options
    custom_logo_options:function(){
        layout_logo_image = true;
        layout_logo_text = false;
        var custom_image = '<div style="width: 129px; margin-top: 10px; font-size: 11px;"><i>Select image from your<br> content.</i></div>'+
        '<div class="form-group">'+
        '<div style="height: 10px;"></div>'+
        '<label class="control-sidebar-subheading">'+
        '<button type="button" id="select-image" class="btn btn-primary" onclick="smhMain.imageContent();">Select Image</button>'+
        '</label>'+
        '</div>'+
        '<div class="sub-title">Preview:</div>'+
        '<div id="logo-preview">None</div>';
        $('#logo-content').html(custom_image);
    },
    //Display image content modal
    imageContent:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','666px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select Image</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div id="image-content-wrapper">'+
        '<div id="images-table"></div>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="image-select-result"></div><button type="button" class="btn btn-default pass-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="image-select" onclick="smhMain.selectLogoImage();">Select</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhMain.loadImages();
    },
    //Gets Images data
    loadImages:function(){
        $('#smh-modal #images-table').empty();
        $('#smh-modal #images-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="images-data"></table>');
        imagesTable = $('#smh-modal #images-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 4,
            "searching": false,
            "info": true,
            "lengthChange": false,
            "ajax": {
                "url": "/apps/platform/getImages.php",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "ks": sessInfo.ks
                    } );
                }
            },
            "language": {
                "zeroRecords": "No Images Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'></span>",
                "width": "10px"
            },
            {
                "title": "<span style='float: left;'>Image</span>"
            },
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Name</span>"
            },
            {
                "title": "<span style='float: left;'>Created On</span>"
            }
            ],           
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 5, 4);     
                var rows = this.fnGetData();
                if ( rows.length === 0 ) {
                    $('#smh-modal #image-select').attr('disabled','');
                }
            }                                
        });
    },
    //Selects Logo Image
    selectLogoImage:function(){
        var radio_value = '';
        var rowcollection =  imagesTable.$(".logoimage:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            radio_value = $(elem).val();
        });
        
        if(radio_value == ''){
            $('#smh-modal #image-select-result').html('<span class="label label-danger">You must select an image!</span>');
            setTimeout(function(){
                $('#smh-modal #image-select-result').empty();
            },3000);
        } else {
            layout_logo_id = radio_value;
            $('#logo').html('<img src="'+protocol+'//imgs.mediaplatform.streamingmediahosting.com/p/'+sessInfo.pid+'/thumbnail/entry_id/'+radio_value+'/quality/100/type/1/height/55" height="55px">');
            $('#logo-preview').html('<img src="'+protocol+'//imgs.mediaplatform.streamingmediahosting.com/p/'+sessInfo.pid+'/thumbnail/entry_id/'+radio_value+'/quality/100/type/1/width/129">');
            $('#smh-modal').modal('hide');
        }        
    },
    //Draws empty rows
    fcmcAddRows:function(obj, numberColumns, targetRows){
        var tableRows = obj.find('tbody tr'); // grab the existing data rows
        var numberNeeded = targetRows - tableRows.length; // how many blank rows are needed to fill up to targetRows
        var lastRow = tableRows.last(); // cache the last data row
        var lastRowCells = lastRow.children('td'); // how many visible columns are there?
        var cellString, highlightColumn, rowClass;
 
        if (targetRows%2) {
            rowClass= "odd";
        } else {
            rowClass = "even";
        }
 
        lastRowCells.each(function(index) {
            if ($(this).hasClass('sorting_1')) {
                highlightColumn = index;
            }
        });
    
        for (var i=0;i<numberNeeded;i++) {
            cellString = "";
            for (var j=0;j<numberColumns;j++) {
                if (j == highlightColumn) {
                    cellString += '<td class="sorting_1 sorting_h">&nbsp;</td>';
                } else {
                    cellString += '<td class="sorting_h">&nbsp;</td>';
                }
            }
        
            lastRow.after('<tr class="'+rowClass+'">'+cellString+'</tr>');
            rowClass = (rowClass == "even") ? "odd" : "even";
        }
    },
    //Display change email modal
    changeEmail:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','490px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close email-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Change Email</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div id="pass-wrapper">'+
        '<form id="pass-form">'+
        '<table id="pass-table">'+
        '<tr>'+
        '<td><b>Edit Email Address:</b></td>'+
        '<td><input type="text" name="useremail" id="useremail" class="form-control" placeholder="Enter email address" value="'+sessInfo.Id+'"></td>'+
        '</tr>'+                                
        '<tr>'+
        '<td><b>Password:</b></td>'+
        '<td><input type="password" name="pass" id="pass" class="form-control" placeholder="Enter current password"></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="2"><span id="curr-email">*Your Password is required for editing your email address.</span></td>'+
        '</tr>'+
        '</table>'+
        '</form>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default email-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-pass" onclick="smhMain.saveEmail()">Save</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#pass-form input').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#pass-form").validate({
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
                useremail:{
                    required: true
                },
                pass:{
                    required: true
                }
            },
            messages: {
                useremail:{
                    required: "Please enter your email address"
                },
                pass:{
                    required: "Please enter your password"
                }
            }
        }); 
    },
    //Display change password modal
    changePass:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','490px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close pass-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Change Password</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div id="pass-wrapper">'+
        '<form id="pass-form">'+
        '<table id="pass-table">'+
        '<tr>'+
        '<td><span class="required"><b>Current Password:</b></span></td>'+
        '<td><input type="password" name="curpass" id="currpass" class="form-control" placeholder="Enter current password"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required"><b>New Password:</b></span></td>'+
        '<td><input type="password" name="newpass" id="newpass" class="form-control" placeholder="Enter new password"></td>'+
        '</tr>'+                                
        '<tr>'+
        '<td><span class="required"><b>Verify New Password:</b></span></td>'+
        '<td><input type="password" name="retrypass" id="retrypass" class="form-control" placeholder="Re-enter new password"></td>'+
        '</tr>'+
        '</table>'+
        '</form>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default pass-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-pass" onclick="smhMain.savePass()">Save</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#pass-form input[type="password"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#pass-form").validate({
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
                curpass:{
                    required: true
                },
                newpass:{
                    required: true
                }, 
                retrypass:{
                    required: true,
                    equalTo: '#newpass'
                }
            },
            messages: {
                curpass:{
                    required: "Please enter your current password"
                },
                newpass:{
                    required: "Please enter a new password"
                }, 
                retrypass:{
                    required: "Please re-enter your new password",
                    equalTo: 'Passwords do not match'
                }
            }
        }); 
    },
    //Saves new password
    savePass:function(){
        var valid = validator.form();
        if(valid){
            $('#smh-modal #save-pass').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');
            var cb = function(success, results){
                if(!success)
                    alert(results);
                if(results == null){
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal #save-pass').removeAttr('disabled');
                    },3000); 
                }else if(results.code && results.message){
                    $('#smh-modal #loading img').css('display','none');
                    alert(results.message);
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal #save-pass').removeAttr('disabled');
                    return;
                }
            };
            var oldLoginId = sessInfo.Id;
            var password = $('#pass-form input[name=curpass]').val();
            var newLoginId = null;
            var newPassword = $('#pass-form input[name=newpass]').val();
            var newFirstName = null;
            var newLastName = null;
            client.user.updateLoginData(cb, oldLoginId, password, newLoginId, newPassword, newFirstName, newLastName);  
        }  
    },
    //Updates user email address
    saveEmail:function(){
        var valid = validator.form();
        if(valid){
            $('#smh-modal #save-pass').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');
            var cb = function(success, results){
                if(!success)
                    alert(results);
                if(results.code && results.message){
                    $('#smh-modal #loading img').css('display','none');
                    alert(results.message);
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal #save-pass').removeAttr('disabled');
                    return;
                }else{
                    var reqUrl = '/api/v1/updateEmail';        
                    var sessData = {
                        email: $('#pass-form input[name=useremail]').val(),
                        _token: $('meta[name="csrf-token"]').attr('content')
                    } 
 
                    $.ajax({
                        cache:      false,
                        url:        reqUrl,
                        type:       'POST',
                        data:       sessData,
                        success:function(data) { 
                            if(data['success']){
                                $('#smh-modal #loading').empty();
                                $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                                setTimeout(function(){
                                    $('#smh-modal #pass-result').empty();
                                    $('#smh-modal #save-pass').removeAttr('disabled');
                                    location.reload();
                                },2000);                         
                            }    
                        }
                    });
                }
            };
            client.startMultiRequest();
            var oldLoginId = sessInfo.Id;
            var password = $('#pass-form input[name=pass]').val();
            var newLoginId = $('#pass-form input[name=useremail]').val();
            var newPassword = null;
            var newFirstName = null;
            var newLastName = null;
            client.user.updateLoginData(cb, oldLoginId, password, newLoginId, newPassword, newFirstName, newLastName);
            var userId = sessInfo.Id;
            var user = new KalturaUser();
            user.id = $('#pass-form input[name=useremail]').val();
            client.user.update(cb, userId, user);
            client.doMultiRequest(cb);
        }  
    },
    //Saves user settings
    saveSettings:function(){
        settings = true;
        $('#settings-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'left'
        });
        validator = $("#settings-form").validate({
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
                firstname:{
                    required: true
                },
                lastname:{
                    required: true
                },
                pubname:{
                    required: true
                },
                phone:{
                    required: true
                }
            },
            messages: {
                firstname:{
                    required: "Please enter your first name"
                },
                lastname:{
                    required: "Please enter your last name"
                },
                pubname:{
                    required: "Please enter your publisher/company name"
                },
                phone:{
                    required: "Please enter your phone number"
                }
            }
        });
        
        var valid = validator.form();
        if(valid){
            $('#save-settings').attr('disabled','');
            $('#loading img').css('display','inline-block');
            var cb = function(success, results){
                if(!success)
                    alert(results);
                if(results.code && results.message){
                    $('#control-sidebar-settings-tab #loading img').css('display','none');
                    alert(results.message);
                    $('#settings-result').empty();
                    $('#save-settings').removeAttr('disabled');
                    return;
                }else{
                    var reqUrl = '/api/v1/updateSettings';
        
                    var sessData = {
                        firstName: $('#settings-form input[name=firstname]').val(),
                        lastName: $('#settings-form input[name=lastname]').val(),
                        pubName: $('#settings-form input[name=pubname]').val(),
                        phone: $('#settings-form input[name=phone]').val(),
                        website: $('#settings-form input[name=website]').val(),
                        _token: $('meta[name="csrf-token"]').attr('content')
                    } 
 
                    $.ajax({
                        cache:      false,
                        url:        reqUrl,
                        type:       'POST',
                        data:       sessData,
                        success:function(data) { 
                            if(data['success']){
                                $('#control-sidebar-settings-tab #loading').empty();
                                $('#settings-result').html('<span class="label label-success">Successfully Updated!</span>');
                                setTimeout(function(){
                                    $('#settings-result').empty();
                                    $('#save-settings').removeAttr('disabled');
                                    location.reload();
                                },2000);                          
                            }    
                        }
                    });
                }
            };
        
            client.startMultiRequest();
            var userId = sessInfo.Id;
            var user = new KalturaUser();
            user.firstName = $('#settings-form input[name=firstname]').val();
            user.lastName = $('#settings-form input[name=lastname]').val();
            client.user.update(cb, userId, user);
            var partner = new KalturaPartner();
            partner.name = $('#settings-form input[name=pubname]').val();
            partner.phone = $('#settings-form input[name=phone]').val();
            partner.website = $('#settings-form input[name=website]').val();
            var allowEmpty = null;
            client.partner.update(cb, partner, allowEmpty);
            client.doMultiRequest(cb);        
        }    
    },
    //Saves user's layout settings
    saveLayout:function(){
        var top_nav_bgcolor = -1;
        var top_nav_fontcolor = -1;
        var logo_font_size = -1;
        var side_nav_fontcolor = -1;
        var side_nav_bgcolor = -1;
        var side_nav_sub_bgcolor = -1;
        var side_nav_sub_fontcolor = -1;
        var layout_logoid = -1;
        if(layout_top_settings){
            top_nav_bgcolor = smhMain.removeHash($('#top_nav_bgcolor').val());
            top_nav_fontcolor = smhMain.removeHash($('#top_nav_fontcolor').val());
            if(layout_logo_text){
                logo_font_size = $('#logo-font-size').val();
            }
            if(layout_logo_image){
                layout_logoid = layout_logo_id;
            }
        }
        
        if(layout_side_settings){
            side_nav_bgcolor = smhMain.removeHash($('#side_nav_bgcolor').val());
            side_nav_fontcolor = smhMain.removeHash($('#side_nav_fontcolor').val());
            side_nav_sub_bgcolor = smhMain.removeHash($('#side_nav_sub_bgcolor').val());
            side_nav_sub_fontcolor = smhMain.removeHash($('#side_nav_sub_fontcolor').val());
        }
        
        var reqUrl = '/api/v1/updateLayout';        
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            action: "update_layout",
            pid: sessInfo.pid,
            layout_top_settings: layout_top_settings,
            top_nav_bgcolor: top_nav_bgcolor,
            top_nav_fontcolor: top_nav_fontcolor,
            layout_logo_image: layout_logo_image,
            layout_logoid: layout_logoid,
            layout_logo_text: layout_logo_text,
            logo_font_size: logo_font_size,
            layout_side_settings: layout_side_settings,
            side_nav_bgcolor: side_nav_bgcolor,
            side_nav_fontcolor: side_nav_fontcolor,
            side_nav_sub_bgcolor: side_nav_sub_bgcolor,
            side_nav_sub_fontcolor: side_nav_sub_fontcolor
        } 
 
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'POST',
            data:       sessData,
            beforeSend: function(){
                $('#save-layout').attr('disabled','');
                $('#control-sidebar-layout-tab #loading img').css('display','inline-block');  
            },
            success:function(data) { 
                var data = $.parseJSON(data);
                if(data['success']){
                    $('#control-sidebar-layout-tab #loading').empty();
                    $('#layout-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#layout-result').empty();
                        $('#save-layout').removeAttr('disabled');
                        location.reload();
                    },2000);                          
                }  
            }
        });        
    },
    //Removes hash
    removeHash:function(value){
        return value.replace('#','');
    },
    //Show top nav custom settings
    showTopCustSetting:function(){
        layout_top_settings = true;
        layout_top_edit = true;
        $('#top-nav-custom').css('display','block');
        $('#top-nav-settings-text').html('<i>Use custom Top Navbar<br> settings below.</i>');
        smhMain.restoreCustTopNav();
    },
    //Show side nav custom settings
    showMenuCustSetting:function(){
        layout_side_settings = true;
        layout_side_edit = true;
        $('#menu-nav-custom').css('display','block');
        $('#side-nav-settings-text').html('<i>Use custom Side Navbar<br> settings below.</i>');
        smhMain.restoreCustSideNav();
    },
    //Hides top nav custom settings
    hideTopCustSetting:function(){
        layout_top_settings = false;
        layout_top_edit = false;
        layout_logo_image = false;
        layout_logo_text = false;
        $('#top-nav-custom').css('display','none');
        $('#top-nav-settings-text').html('<i>Use default Top Navbar<br> settings.</i>');
        smhMain.resetTopNav();
    },
    //Hides side menu custom settings
    hideMenuCustSetting:function(){
        layout_side_settings = false;
        layout_side_edit = false;
        $('#menu-nav-custom').css('display','none');
        $('#side-nav-settings-text').html('<i>Use default Side Navbar<br> settings.</i>');
        smhMain.resetSideMenu();
    },
    //Apply custom settings
    activeTopCustSettings:function(nav_background_color){
        layout_top_settings = true;
        top_nav_background_color = nav_background_color;
        $('#top-nav-custom').css('display','block');
        $('#top-nav-settings-text').html('<i>Use custom Top Navbar<br> settings below.</i>');          
    },
    //Apply custom settings
    activeSideCustSettings:function(nav_bgcolor){
        layout_side_settings = true;
        side_nav_bgcolor = nav_bgcolor;
        $('#menu-nav-custom').css('display','block');
        $('#side-nav-settings-text').html('<i>Use custom Side Navbar<br> settings.</i>');
    },
    //Apply logo text settings
    activeLogoText:function(size){
        smhMain.custom_text_options();
        var selText = 'Custom Text';
        $("#logo-source li a").parents('.sub-options').find('.source-text').html('<span class="text">'+selText+'</span>');
        $('#logo-font-size').val(size);            
    },
    //Apply logo text settings
    activeLogoImage:function(user_id,image_id){
        layout_logo_id = image_id;
        smhMain.custom_logo_options();
        var selText = 'Image';
        $("#logo-source li a").parents('.sub-options').find('.source-text').html('<span class="text">'+selText+'</span>');
        $('#logo-preview').html('<img src="'+protocol+'//imgs.mediaplatform.streamingmediahosting.com/p/'+user_id+'/thumbnail/entry_id/'+image_id+'/quality/100/type/1/width/129">');           
    },
    //Reset Side Menu to default settings
    resetSideMenu:function(){
        side_nav_bgcolor = '#222d32';
        $('.skin-blue .wrapper, .skin-blue .main-sidebar, .skin-blue .left-side').css('background-color','#222d32');
        $('.skin-blue .sidebar-menu > li > a').css('color','#b8c7ce');
        
        $('.skin-blue .sidebar-menu > li > a').each(function (){
            $('.skin-blue .sidebar-menu > li > a').css('border-left-color',side_nav_bgcolor);
        });
        
        $('.skin-blue .sidebar-menu li a').hover(function(){
            $('.skin-blue .sidebar-menu > li > a').each(function (){
                $(this).css('color','#b8c7ce');
            });
            $(this).css('color','#ffffff');
            $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff');
        }, function(){
            $('.skin-blue .sidebar-menu > li > a').each(function (){
                $(this).css('color','#b8c7ce');
            });
            $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff');
        });

        $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff'); 
        $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color); 
        
        $('.skin-blue .sidebar-menu > li > .treeview-menu').css('background-color','#2c3b41');
        
        $('.skin-blue .treeview-menu > li > a').css('color','#8aa4af');  
            
        $('.skin-blue .treeview-menu > li > a').hover(function(){
            $(this).css('color','#ffffff');
        }, function(){
            $(this).css('color','#8aa4af');
        });
    },
    //Restore custom side nav settings
    restoreCustSideNav:function(){
        side_nav_bgcolor = $('.side-nav-color input').val();
        $('.skin-blue .wrapper, .skin-blue .main-sidebar, .skin-blue .left-side').css('background-color',$('.side-nav-color input').val());
        $('.skin-blue .sidebar-menu > li > a').css('color',$('.side-nav-font-color input').val());
        $('.skin-blue .sidebar-menu > li > .treeview-menu').css('background-color',$('.side-nav-submenu-color input').val());        
        $('.skin-blue .treeview-menu > li > a').css('color',$('.side-nav-submenu-font-color input').val());  
        $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff');
        
        $('.skin-blue .sidebar-menu > li > a').each(function (){
            $('.skin-blue .sidebar-menu > li > a').css('border-left-color',side_nav_bgcolor);
        });
        $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color); 
        
        $('.skin-blue .sidebar-menu li a').hover(function(){
            $('.skin-blue .sidebar-menu > li > a').each(function (){
                $(this).css('color',$('.side-nav-font-color input').val());
            });
            $(this).css('color','');
            $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff');
        }, function(){
            $('.skin-blue .sidebar-menu > li > a').each(function (){
                $(this).css('color',$('.side-nav-font-color input').val());
            });
            $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff');
        });        
            
        $('.skin-blue .treeview-menu > li > a').hover(function(){
            $(this).css('color',$('.side-nav-font-hover-color input').val());
        }, function(){
            $(this).css('color',$('.side-nav-submenu-font-color input').val());
        });
    },
    //Reset Top Nav to default settings
    resetTopNav:function(){
        top_nav_background_color = '#1c84b0';
        $('.skin-blue .main-header .navbar').css('background-color','#1c84b0');   
        $('.skin-blue .main-header li.user-header').css('background-color','#1c84b0');
        $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color', '#1c84b0');        
        $('#logo').html('Streaming Media Platform');
        $('.skin-blue .main-header .navbar .sidebar-toggle').css('color','#fff');
        $('.skin-blue .main-header .navbar .nav > li > a').css('color','#fff');
        $('#logo').css('font-size','20px');
        $('#logo').css('color','#fff');
        $('#vr-center-title').css('color','#fff');
        $('#user-header-wrapper').css('color','#fff');
        $('#account-header').css('color','#fff');
        $('.navbar-static-top').css('color', '#fff');
        $('#user-style-top').remove();
        
        $('.skin-blue .sidebar-menu > li > a').hover(function(){
            $(this).css('border-left-color','#1c84b0');               
        }, function(){
            $(this).css('border-left-color','');        
            $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color','#1c84b0');
        });
    },
    //Restores custom top nav settings
    restoreCustTopNav:function(){
        top_nav_background_color = $('.top-nav-color input').val();
        $('.skin-blue .main-header .navbar').css('background-color',$('.top-nav-color input').val());
        $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',$('.top-nav-color input').val());
        $('.skin-blue .main-header li.user-header').css('background-color',$('.top-nav-color input').val());
        $('.skin-blue .main-header .navbar .sidebar-toggle').css('color',$('.top-nav-font-color input').val());
        $('.skin-blue .main-header .navbar .nav > li > a').css('color',$('.top-nav-font-color input').val());
        $('#user-header-wrapper').css('color',$('.top-nav-font-color input').val());
        $('#account-header').css('color',$('.top-nav-font-color input').val());
        
        $('.skin-blue .sidebar-menu > li > a').hover(function(){
            $(this).css('border-left-color',$('.top-nav-color input').val());               
        }, function(){
            $(this).css('border-left-color',side_nav_bgcolor);        
            $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',$('.top-nav-color input').val());
        });
        
        var logo_option = $.trim($("#top-nav-custom #logo-source li a").parents('.sub-options').find('.source-text .text').text());
        if(logo_option == "Custom Text"){
            layout_logo_text = true;
            $('#logo').html(sessInfo.company);
            $('#logo').css('font-size',$('#logo-font-size option:selected').val()+'px');
            $('#logo').css('color',$('.top-nav-font-color input').val()); 
        } else {
            layout_logo_image = true;
            if(layout_logo_id != -1){
                $('#logo').html('<img src="'+protocol+'//imgs.mediaplatform.streamingmediahosting.com/p/'+sessInfo.pid+'/thumbnail/entry_id/'+layout_logo_id+'/quality/100/type/1/height/55" height="55px">');                
            }
        }
    },
    //Reset Modal
    resetModal:function(){
        $('#smh-modal .modal-header').empty(); 
        $('#smh-modal .modal-body').empty();
        $('#smh-modal .modal-footer').empty();
        $('#smh-modal .modal-content').css('min-height','');
        $('#smh-modal .smh-dialog').css('width','');
        $('#smh-modal .modal-body').css('height','');
        $('#smh-modal .modal-body').css('padding','15px');
        $('#smh-modal .modal-footer').css('padding','15px');
        $('#smh-modal .modal-footer').css('border-top-color','#f4f4f4');
        $('#smh-modal').css('z-index','1050');
    },
    //Fix menu after edit
    fixOpenMenu:function(){
        $('.skin-blue .sidebar-menu > li > a').each(function (){
            $(this).css('border-left-color','');
        });
        $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color);   

        if(layout_side_edit){
            $('.skin-blue .sidebar-menu > li > a').each(function (){
                $(this).css('color',$('.side-nav-font-color input').val());
            });
            $('.skin-blue .sidebar-menu > li.active > a').css('color','#ffffff');      
        }
    },
    //Fix menu after closed
    fixCloseMenu:function(){
        $('.skin-blue .sidebar-menu > li > a').hover(function(){
            $(this).css('border-left-color',top_nav_background_color);               
        }, function(){
            $(this).css('border-left-color',side_nav_bgcolor);  
            $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color);
        });  
    },
    //Show Calculator
    showCalc:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','750px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel"><i class="fa fa-calculator"></i> Calculator</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="flash_calc">'+
        '<div style="padding: 10px;"><h5>Use the calculator below to help you estimate your monthly transfer and storage requirements.</h5></div>'+
        '<embed id="flash_calc" height="150" width="618" wmode="opaque" quality="high" bgcolor="#FFFFFF" name="flash_calc" style="undefined" src="/js/transferCalc.swf" type="application/x-shockwave-flash">'+
        '<br>'+
        '<div style="padding: 10px; text-align: left; font-size: 13px;">As an example; a 2 minute video encoded at 350kbps (kilobits per second) will have a "File Size" of approximagtely 6.9MB (megabytes). This means that file will transfer 6.9MB of information over the internet when viewed.<br /><br />To estimate your monthly transfer, simply calculate the number of times you expect each video to be viewed over a month\'s time. So, if we continue our example; let\'s say you expect this video to be viewed 10 times a day:<br /><br /> 30 days x 10 views a day = 300 views. 300 x 6.9 = 2,070MB or about 2.1GB (gigabytes).<br /><br />Now, to help estimate your storage needs, add together the "File Size" for each of your videos. While your storage requirements will probably be pretty easy to pinpoint, your transfer will typically fluctuate from month to month. Your streaming representative will work with you to get you into the right package for your level of need, help you avoid problems, and will work with you as your streaming needs grow.</div></div>';
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Show Port Test
    portTest:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','873px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel"><i class="fa fa-circle-o"></i> Port Test</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="port"><script type="text/javascript"> var params = {}; params.quality = "high"; params.allowFullScreen = "true"; params.allowScriptAccess = "always"; params.wmode = "opaque"; params.bgcolor = "#FFFFFF"; var attributes = {}; swfobject.embedSWF("/js/portTest.swf", "flashDiv", "845", "500", "9.0.28","/js/expressInstall.swf", flashvars, params, attributes); </script> <div id="flashDiv"><strong>You need to <a href="http://www.adobe.com/go/getflashplayer" target="_blank">upgrade your Flash Player</a></strong><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" border="0" /></a></div></div>'; 
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Updates acknowledge alerts
    alertAckd:function(alert){
        var reqUrl = '/api/v1/updateAlertAckd';        
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            alert: alert,
            pid: sessInfo.pid
        } 
 
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'POST',
            data:       sessData
        }); 
    },
    //Register actions
    registerActions:function(){
        $('.nav').on('click', '#sidebar-settings', function(){
            var sidebar = $('.control-sidebar');
            if (!sidebar.hasClass('control-sidebar-open')
                && !$('body').hasClass('control-sidebar-open')) {
                if(settings){
                    $('#settings-form input').tooltipster('destroy'); 
                    settings = false;
                } 
            }         
        });
        
        $('#smh-modal').on('click', '.pass-close', function(){
            $('#pass-form input').tooltipster('destroy');
        });
        
        $('#smh-modal').on('click', '.email-close', function(){
            $('#pass-form input').tooltipster('destroy');
        });
        
        $('#login-form').on('click', '#login', function(){
            var valid = validator.form();
            if(valid){
                smhMain.login();
            }   
        });
        
        $('#user-logout').on('click', '#logout', function(){
            smhMain.logout();  
        });
              
        //Top nav background color
        $('.top-nav-color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            top_nav_background_color = event.color.toHex();
            $('.skin-blue .main-header .navbar').css('background-color',top_nav_background_color);
            $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color);
            $('.skin-blue .main-header li.user-header').css('background-color',top_nav_background_color);
            
            $('.skin-blue .sidebar-menu > li > a').hover(function(){
                $(this).css('border-left-color',top_nav_background_color);               
            }, function(){
                $(this).css('border-left-color',side_nav_bgcolor);        
                $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color);
            });            
        });
        
        //Top nav font color
        $('.top-nav-font-color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            $('#logo').css('color',event.color.toHex());
            $('#vr-center-title').css('color',event.color.toHex());
            $('.skin-blue .main-header .navbar .sidebar-toggle').css('color',event.color.toHex());
            $('.skin-blue .main-header .navbar .nav > li > a').css('color',event.color.toHex());
            $('#user-header-wrapper').css('color',event.color.toHex());
            $('#account-header').css('color',event.color.toHex());
        });  
        
        $("#logo-source li a").click(function(){
            var selText = $(this).text();
            $(this).parents('.sub-options').find('.source-text').html('<span class="text">'+selText+'</span>');
        });
        
        $('.side-nav-color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            side_nav_bgcolor = event.color.toHex();
            $('.skin-blue .wrapper, .skin-blue .main-sidebar, .skin-blue .left-side').css('background-color',side_nav_bgcolor);
            $('.skin-blue .sidebar-menu > li > a').css('border-left-color',side_nav_bgcolor);
            $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color);
            
            $('.skin-blue .sidebar-menu > li > a').hover(function(){
                $(this).css('border-left-color',top_nav_background_color);               
            }, function(){
                $(this).css('border-left-color',side_nav_bgcolor);        
                $('.skin-blue .sidebar-menu > li.active > a').css('border-left-color',top_nav_background_color);
            }); 
        });
        
        $('.side-nav-submenu-color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            $('.skin-blue .sidebar-menu > li > .treeview-menu').css('background-color',event.color.toHex());
        });
        
        $('.side-nav-submenu-font-color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            $('.skin-blue .treeview-menu > li > a').css('color',event.color.toHex());  
        });    
        
        $('.side-nav-font-color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            $('.skin-blue .sidebar-menu > li > a').css('color',event.color.toHex());
        }); 
        
        $('.main-sidebar').on('click', '#flash-support', function(event){ 
            window.open("http://helpx.adobe.com/flash-player/kb/find-version-flash-player.html");
        });
        
        $('.main-sidebar').on('click', '#ppv-guide', function(event){ 
            window.open("/user_guide/smh_ppv_user_guide.pdf");
        });
        
        $('.main-sidebar').on('click', '#speed-test', function(event){ 
            window.open("http://www.speedtest.net/");
        });
    },
    //Find array index
    getIndex:function(array,value){
        var theIndex = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i].id == value) {
                theIndex = i;
                break;
            }
        }
        return theIndex;
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
    },
    imgError:function(source){
        source.src = "/img/noimage.jpg";
        source.onerror = "";
        return true;
    },
    showProcessing:function(){
        $('.processing-loading').html('<img height="20px" src="/img/loading.gif">');
    },
    hideProcessing:function(){
        $('.processing-loading').empty();
    },
    //Dump
    dump:function(arr,level){
        var dumped_text = "";
        if(!level) level = 0;
	
        //The padding given at the beginning of the line.
        var level_padding = "";
        for(var j=0;j<level+1;j++) level_padding += "    ";
	
        if(typeof(arr) == 'object') { //Array/Hashes/Objects 
            for(var item in arr) {
                var value = arr[item];
			
                if(typeof(value) == 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += dump(value,level+1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        } else { //Stings/Chars/Numbers etc.
            dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
        }
        return dumped_text;
    }
}

// Main on ready
$(document).ready(function(){
    smhMain = new Main(sessInfo.pid,sessInfo.ks);
    smhMain.createClient();
    smhMain.registerActions();
    smhMain.registerValidator();
});
