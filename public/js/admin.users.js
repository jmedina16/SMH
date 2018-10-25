/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	Admin
 *
 *	7-3-2014
 */
//Admin constructor
function Admin(id,ks) {
    this.id = id;
    this.ks = ks;
}

//Global variables
var admin_data, userid, statusUpdate, validator, userRoles, total_entries;
var rolesDesc = {};

//Admin prototype/class
Admin.prototype = {
    constructor: Admin,
    //Inserts name on page
    getUsers:function(){          
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#users-table').empty();
        $('#users-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="users-data"></table>');
        usersTable = $('#users-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": false,
            "info": true,
            "lengthChange": false,
            "ajax": {
                "url": "/api/v1/getUsers",
                "type": "GET",
                "data": function ( d ) {   
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "id": sessInfo.Id,
                        "tz": tz,
                        "m": ($.inArray("ADMIN_USER_UPDATE", sessPerm) != -1)? true : false,
                        "d": ($.inArray("ADMIN_USER_DELETE", sessPerm) != -1)? true : false
                    } );
                },
                "dataSrc": function ( json ) {
                    total_entries = json['recordsTotal'];
                    $('#available').html(json['usersAvail']);
                    if(Number(json['usersAvail']) == 0 || $.inArray("ADMIN_USER_ADD", sessPerm) == -1){
                        $('#add-user').attr('disabled', '');
                    } else {
                        $('#add-user').removeAttr('disabled');
                    }
                    return json.data 
                }
            },
            "language": {
                "zeroRecords": "No users found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'><div class='data-break'>Status</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>User Name</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>User ID</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Email Address</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Role</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Last Login</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                "width": "170px"
            },
            ],           
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 7, 10);     
            }                                
        });
    },
    //Load user edit modal
    editUser:function(email,firstName,lastName,roleId,oy){
        var header, content, footer;
      
        smhMain.resetModal();
        $('.smh-dialog').css('width','615px');
        $('#smh-modal .modal-body').empty();
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
    
        header = '<button type="button" class="close smh-close admin-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit User</h4>';
        $('#smh-modal .modal-header').html(header);
        
        var role_disable = (oy)? 'disabled' : '';
    
        content = '<form id="edit-user" action="">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr><td colspan="2"><span style="font-weight: bold;">User Details</span><hr></td></tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Login Email Address:</span></td><td style="width: 71%;"><input type="text" name="email" id="email" class="form-control" placeholder="Enter email address" disabled="disabled" value="'+email+'"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">First Name:</span></td><td><input type="text" name="fname" id="fname" class="form-control" placeholder="Enter firstname name" disabled="disabled" value="'+firstName+'"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Last Name:</span></td><td><input type="text" name="lname" id="lname" class="form-control" placeholder="Enter last name" disabled="disabled" value="'+lastName+'"></td>'+
        '</tr>'+
        '<tr><td colspan="2"><span style="font-weight: bold; padding-top: 40px;">Account Specific Details</span><hr></td></tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">User Role:</span></td><td><select id="roles-select" class="form-control" '+role_disable+'>'+userRoles+'</select></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Description:</span></td><td><div id="desc"></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="2"><span id="curr-email">*Changes made to the user\'s role may impact his/her current session</span></td>'+
        '</tr>'+
        '</table>'+
        '</form>';
        
        $('#smh-modal .modal-body').html(content);    
        
        $('#roles-select').val(roleId);
        $('#desc').html(rolesDesc[roleId]);
        
        $('#edit-user').on('change','#roles-select', function(){
            var role = $('select#roles-select option:selected').val();
            $('#edit-user #desc').html(rolesDesc[role]);
        });
        
        var disable = ($.inArray("ADMIN_USER_UPDATE", sessPerm) != -1)? '' : 'disabled';
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default admin-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-user" onclick="smhAdmin.updateUser()" '+disable+'>Update</button>';
        $('#smh-modal .modal-footer').html(footer);              
    },
    //Get user roles
    getUserRoles:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
            if(results.code && results.message){
                alert(results.message);
                return;
            }else{
                var roles_select = '';
                $.each(results.objects, function(index, value){ 
                    roles_select += '<option value="'+value.id+'">'+value.name+'</option>';
                    rolesDesc[value.id] = value.description;
                });
                userRoles = roles_select;
            }
        };
        
        var filter = new KalturaUserRoleFilter();
        filter.orderBy = "+id";
        filter.statusEqual = 1;
        filter.tagsMultiLikeOr = "kmc";
        var pager;
        client.userRole.listAction(cb, filter, pager);
    },
    //Update user data
    updateUser:function(){
        var role = $('select#roles-select option:selected').val(); 
        var userid = $('#edit-user #email').val();
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }
            $('#smh-modal #loading').empty();
            $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
            setTimeout(function(){
                $('#smh-modal #pass-result').empty();
                $('#smh-modal #update-user').removeAttr('disabled');
            },3000); 
            smhAdmin.getUsers();
        };
    
        $('#smh-modal #update-user').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block'); 
        var user = new KalturaUser();
        user.roleIds = role;
        client.user.update(cb, userid, user);
    },
    //Load user status modal
    editStatus:function(id,status,fullname){        
        smhMain.resetModal();
        var header, content, footer, statusUpdate, statusText;
        $('.smh-dialog').css('width','435px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Status</h4>';
        $('#smh-modal .modal-header').html(header);
        
        if(status == 0){
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to unblock the selected account?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+fullname+")</div>";
            statusUpdate = 1;    
            statusText = 'Unblock'
        } else {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to block the selected account?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+fullname+")</div>";
            statusUpdate = 0; 
            statusText = 'Block'
        }
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-status" onclick="smhAdmin.updateStatus(\''+id+'\','+statusUpdate+')">'+statusText+'</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Save user status
    updateStatus:function(userid,statusUpdate){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            } 
            $('#smh-modal #loading').empty();
            $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
            setTimeout(function(){
                $('#smh-modal #pass-result').empty();
                $('#smh-modal #save-status').removeAttr('disabled');
            },3000); 
            smhAdmin.getUsers();
        };
        $('#save-status').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        var user = new KalturaUser();
        user.status = statusUpdate;
        client.user.update(cb, userid, user);
    },
    //Load user delete modal
    deleteUser:function(id,fullname){       
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','435px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to delete the selected user?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+fullname+")</div>";
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-user" onclick="smhAdmin.removeUser(\''+id+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Deletes User
    removeUser:function(userid){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            } 
            $('#smh-modal').modal('hide');
            smhAdmin.getUsers();             
        };
        
        $('#delete-user').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        var user = new KalturaUser();
        user.status = 2;
        client.user.update(cb, userid, user);
    },
    //Load add user modal
    addUser:function(){    
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','615px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close user-create-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create User</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<form id="create-user" action="">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr><td colspan="2"><span style="font-weight: bold;">User Details</span><hr></td></tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Login Email Address:</span></td><td style="width: 71%;"><input type="text" name="email" id="email" class="form-control" placeholder="Enter email address"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">First Name:</span></td><td><input type="text" name="fname" id="fname" class="form-control" placeholder="Enter first name"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Last Name:</span></td><td><input type="text" name="lname" id="lname" class="form-control" placeholder="Enter last name"></td>'+
        '</tr>'+
        '<tr><td colspan="2"><span style="font-weight: bold; padding-top: 40px;">Account Specific Details</span><hr></td></tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">User Role:</span></td><td><select id="roles-select" class="form-control">'+userRoles+'</select></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Description:</span></td><td><div id="desc">Full control over publisher account and user management functionalities</div></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="2"><span id="curr-email">*Changes made to the user\'s role may impact his/her current session</span></td>'+
        '</tr>'+
        '</table>'+
        '</form>';
        $('#smh-modal .modal-body').html(content);
        
        $('#create-user').on('change','#roles-select', function(){
            var role = $('select#roles-select option:selected').val();
            $('#create-user #desc').html(rolesDesc[role]);
        });
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default user-create-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="create-account" onclick="smhAdmin.createUser()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#create-user input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#create-user").validate({
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
                fname:{
                    required: true
                },
                lname:{
                    required: true
                }
            },
            messages: {
                email:{
                    required: 'Please enter an email address',
                    email: 'Please enter a valid email address'
                },
                fname:{
                    required: 'Please enter a first name'
                },
                lname:{
                    required: 'Please enter a last name'
                }
            }
        });
    },
    //Create new user account
    createUser:function(){
        var valid = validator.form();
        if(valid){
            var email = $('#create-user #email').val();
            var firstname = $('#create-user #fname').val();
            var lastname = $('#create-user #lname').val();
            var role = $('select#roles-select option:selected').val();
            
            var cb = function (success, results){
                if(!success)
                    alert(results);

                if(results.code && results.message){
                    alert(results.message);
                    return;
                }                  
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">User Successfully Created!</span>');
                setTimeout(function(){
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal').modal('hide');
                },3000); 
                smhAdmin.getUsers();
            };
        
            $('#create-account').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');
            var user = new KalturaUser();   
            user.id = email;
            user.email = email;
            user.status = 1;
            user.firstName = firstname;
            user.lastName = lastname;
            user.isAdmin = "true";
            user.roleIds = role;
            client.user.add(cb, user);
        }
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_users_metadata';
        }        
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal').on('click', '.user-create-close', function(){
            $('#create-user input').tooltipster('destroy');
        });
    }
}

// Admin on ready
$(document).ready(function(){
    smhAdmin = new Admin();
    smhAdmin.getUsers();
    smhAdmin.getUserRoles();
    smhAdmin.registerActions();
});
