/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	PPV
 *
 *	7-3-2014
 */
//PPV constructor
function PPV() {}

//Global variables
var ApiUrl = "/apps/ppv/v1.0/dev.php?";
var validator;
var email_data = new Array();
var owner_attrs = new Array();
var total_entries;
var num = 1;

//PPV prototype/class
PPV.prototype = {
    constructor: PPV,
    //Load ppv user table
    getUsers: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#users-table').empty();
        $('#users-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="users-data"></table>');
        $('#users-data').dataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": true,
            "lengthChange": true,
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "action": "list_users",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Users Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'>Status</span>"
                },
                {
                    "title": "<span style='float: left;'>ID</span>"
                },
                {
                    "title": "<span style='float: left;'>First Name</span>"
                },
                {
                    "title": "<span style='float: left;'>Last Name</span>"
                },
                {
                    "title": "<span style='float: left;'>Email</span>"
                },
                {
                    "title": "<span style='float: left;'>Additional Details</span>"
                },
                {
                    "title": "<span style='float: left;'>Restriction <i data-placement='top' data-toggle='tooltip' data-delay=\'{\"show\":700, \"hide\":30}\' data-html='true' data-original-title='<strong>Unlimited Access: </strong>unlimited access to all of your pay-per-view content.<br/><br/><strong>Limited Access: </strong>restricted access to your content based on a user&rsquo;s purchases.' class='fa fa-question-circle'></i></span>"
                },
                {
                    "title": "<span style='float: left;'>Logged In</span>"
                },
                {
                    "title": "<span style='float: left;'>Created At</span>"
                },
                {
                    "title": "<span style='float: left;'>Actions</span>",
                    "width": "195px"
                }
            ],
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 10, 10);
            }
        });
    },
    //Gets gateways
    getGateways: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var reqUrl = ApiUrl + 'action=get_gateways';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                var gateway_setup = false;
                if (data['gateways'] == '') {
                    smhPPV.setup();
                } else {
                    $.each(data['gateways'], function (key, value) {
                        if (value['name'] == 'paypal') {
                            if (value['status'] == '1') {
                                gateway_setup = true;
                                $.each(value['options'], function (k, v) {
                                    if (k == 'currency') {
                                        $.cookie('currency', v);
                                        $('#ticket-currency').val(v);
                                    }
                                });
                            }
                        }
                        if (value['name'] == 'authnet') {
                            if (value['status'] == '1') {
                                gateway_setup = true;
                                $.each(value['options'], function (k, v) {
                                    if (k == 'currency') {
                                        $.cookie('currency', v);
                                        $('#ticket-currency').val(v);
                                    }
                                });
                            }
                        }
                    });
                    if (!gateway_setup) {
                        smhPPV.setup();
                    }
                }
            }
        });
    },
    //Loads setup modal
    setup: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '540px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Pay-Per-View</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; height: 50px; margin-top: 20px;'>*Notice: You must setup at least one payment gateway to use this service</div>";
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    viewDetails: function (json_details) {
        smhMain.resetModal();
        var header, content, footer;
        var detail_fields = '';
        $('.smh-dialog').css('width', '540px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        if (json_details) {
            var details = JSON.parse(json_details);
            $.each(details, function (index, value) {
                detail_fields += '<h4>' + value.field_name + '</h4>' +
                        '<div class="detail-spacing" style="margin-left: 20px;">' + value.value + '</div>';
            });
        } else {
            detail_fields += '<div style="width: 300px; margin-left: auto; margin-right: auto; text-align: center; margin-top: 100px;">No additional details found</div>';
        }

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Additional User Details</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div id='details-wrapper'>" +
                detail_fields +
                '</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal #details-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    editUserDetails: function (uid, json_details) {
        smhMain.resetModal();
        var header, content, footer;
        var detail_fields = '';
        var field_rules = {};
        var field_messages = {};
        $('.smh-dialog').css('width', '640px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        if (owner_attrs.length) {
            if (json_details) {
                var details = JSON.parse(json_details);
                $.each(details, function (index, value) {
                    if (value.required == '1') {
                        field_rules['field' + value.id] = {
                            required: true,
                            fieldcheck: true
                        }
                        field_messages['field' + value.id] = {
                            required: "Field cannot be empty",
                            fieldcheck: "Only alphanumeric characters and underscores are allowed"
                        }
                    }
                    detail_fields += '<tr class="form-user-row"><td><div style="width: 150px;">' + value.field_name + ':</div></td><td><div class="input-group"><input class="field form-control" placeholder="Please enter a value" data-fieldname="' + value.field_name + '" data-required="' + value.required + '" data-id="' + value.id + '" name="field' + value.id + '" value="' + value.value + '" style="display: block; width: 300px ! important;" type="text"></div></td></tr>';
                });
                content = '<div class="row">' +
                        '<div class="col-sm-10 center-block">' +
                        '<div id="form-user-wrapper">' +
                        '<form id="form-edit-details">' +
                        '<table id="form-user-table">' +
                        '<thead>' +
                        '<tr><th><span style="font-weight: bold;">Field Name</span></th><th><span style="font-weight: bold;">Value</span></th></tr>' +
                        '</thead>' +
                        '<tbody>' +
                        detail_fields +
                        '</tbody>' +
                        '</table>' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $('#smh-modal .modal-body').html(content);
            } else {
                $.each(owner_attrs, function (index, value) {
                    if (value.required == '1') {
                        field_rules['field' + value.id] = {
                            required: true,
                            fieldcheck: true
                        }
                        field_messages['field' + value.id] = {
                            required: "Field cannot be empty",
                            fieldcheck: "Only alphanumeric characters and underscores are allowed"
                        }
                    }
                    detail_fields += '<tr class="form-user-row"><td><div style="width: 150px;">' + value.name + ':</div></td><td><div class="input-group"><input class="field form-control" placeholder="Please enter a value" data-fieldname="' + value.name + '" data-required="' + value.required + '" data-id="' + value.id + '" name="field' + value.id + '" style="display: block; width: 300px ! important;" type="text"></div></td></tr>';
                });
                content = '<div class="row">' +
                        '<div class="col-sm-10 center-block">' +
                        '<div id="form-user-wrapper">' +
                        '<form id="form-edit-details">' +
                        '<table id="form-user-table">' +
                        '<thead>' +
                        '<tr><th><span style="font-weight: bold;">Field Name</span></th><th><span style="font-weight: bold;">Value</span></th></tr>' +
                        '</thead>' +
                        '<tbody>' +
                        detail_fields +
                        '</tbody>' +
                        '</table>' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                $('#smh-modal .modal-body').html(content);
            }
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default user-details-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-user-reg" onclick="smhPPV.updateUserDetails(' + uid + ')">Update</button>';
            $('#smh-modal .modal-footer').html(footer);

            $('#smh-modal #form-edit-details input[type="text"]').tooltipster({
                trigger: 'custom',
                onlyOne: false,
                position: 'left'
            });

            validator = $("#smh-modal #form-edit-details").validate({
                highlight: function (element, errorClass) {
                    $(element).removeClass("valid").removeClass("error").addClass("validate-error");
                },
                unhighlight: function (element, errorClass) {
                    $(element).removeClass("valid").removeClass("validate-error");
                },
                errorPlacement: function (error, element) {
                    $(element).tooltipster('update', $(error).text());
                    $(element).tooltipster('show');
                },
                success: function (label, element) {
                    $(element).tooltipster('hide');
                },
                rules: field_rules,
                messages: field_messages
            });
        } else {
            content = '<div style="width: 300px; text-align: center; margin: 100px auto;">No additional details found</div>';
            $('#smh-modal .modal-body').html(content);
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default user-details-close" data-dismiss="modal">Close</button>';
            $('#smh-modal .modal-footer').html(footer);
        }

        header = '<button type="button" class="close smh-close user-details-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Additional User Details</h4>';
        $('#smh-modal .modal-header').html(header);
    },
    updateUserDetails: function (uid) {
        var valid = validator.form();
        if (valid) {
            var update_fields = new Array();
            var table = $("#smh-modal #form-user-table tbody");
            table.find('tr.form-user-row').each(function () {
                var id = $(this).find('td').find('.input-group').find('.field').attr('data-id');
                var field_name = $(this).find('td').find('.input-group').find('.field').attr('data-fieldname');
                var required = $(this).find('td').find('.input-group').find('.field').attr('data-required');
                var value = $(this).find('td').find('.input-group').find('.field').val();
                update_fields.push({
                    'field_name': field_name,
                    'id': id,
                    'required': required,
                    'value': value
                });
            });

            var sessData = {
                pid: sessInfo.pid,
                ks: sessInfo.ks,
                uid: uid,
                updateFields: JSON.stringify(update_fields)
            }

            var reqUrl = ApiUrl + 'action=update_user_details';

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'GET',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#edit-user-reg').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    if (data['success']) {
                        smhPPV.getUsers();
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        }, 5000);
                    }
                }
            });
        }
    },
    //Registration form modal
    editReg: function () {
        smhMain.resetModal();
        var header, content, footer;
        num = 1;
        var owner_fields = '';
        $('.smh-dialog').css('width', '640px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        if (owner_attrs) {
            $.each(owner_attrs, function (index, value) {
                var checked = '';
                if (value.required == '1') {
                    checked = 'checked';
                }
                owner_fields += '<tr class="form-user-row" id="field-num' + num + '"><td><div class="input-group"><input class="field form-control" placeholder="Enter a field name" data-id="' + value.id + '" value="' + value.name + '" id="field-input' + num + '" name="field' + num + '" style="display: block; width: 300px ! important;" type="text" onkeydown="smhPPV.limit(event,this.value);" onkeyup="smhPPV.limit(event,this.value);"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input class="req" style="position: relative; margin-left: 0px; margin-top: 0px;" type="checkbox" id="field-required-num' + num + '" ' + checked + '></div></div></div></td><td><div class="remove-field-icon"><i class="fa fa-remove" onclick="smhPPV.removeField(\'field-num' + num + '\')"></i></div></td></tr>';
                num++;
            });
        }

        header = '<button type="button" class="close smh-close user-reg-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Registration Form</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="row">' +
                '<div class="col-sm-9 center-block" style="margin-top: 10px;">Add up to 5 additional fields to your user registration form. Check the "required" check box next to the fields where you require your users to enter a value. Only alphanumeric characters and underscores are allowed for field names.</div>' +
                '<div class="col-sm-9 center-block">' +
                '<div id="form-user-wrapper">' +
                '<form id="form-user">' +
                '<table id="form-user-table">' +
                '<thead>' +
                '<tr><th><span style="font-weight: bold;">Field Name</span></th><th><span style="font-weight: bold;">Required</span></th><th><span style="font-weight: bold;">Remove</span></th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td><div class="input-group"><input class="form-control" name="field" style="display: block; width: 300px ! important;" value="First Name" disabled="" type="text"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input style="position: relative; margin-left: 0px; margin-top: 0px;" checked="" disabled="" type="checkbox"></div></div></div></td><td></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div class="input-group"><input class="form-control" name="field" style="display: block; width: 300px ! important;" value="Last Name" disabled="" type="text"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input style="position: relative; margin-left: 0px; margin-top: 0px;" checked="" disabled="" type="checkbox"></div></div></div></td><td></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div class="input-group"><input class="form-control" name="field" style="display: block; width: 300px ! important;" value="Email" disabled="" type="text"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input style="position: relative; margin-left: 0px; margin-top: 0px;" checked="" disabled="" type="checkbox"></div></div></div></td><td></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div class="input-group"><input class="form-control" name="field" style="display: block; width: 300px ! important;" value="Password" disabled="" type="text"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input style="position: relative; margin-left: 0px; margin-top: 0px;" checked="" disabled="" type="checkbox"></div></div></div></td><td></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div class="input-group"><input class="form-control" name="field" style="display: block; width: 300px ! important;" value="Confirm Password" disabled="" type="text"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input style="position: relative; margin-left: 0px; margin-top: 0px;" checked="" disabled="" type="checkbox"></div></div></div></td><td></td>' +
                '</tr>' +
                owner_fields +
                '</tbody>' +
                '</table>' +
                '</form>' +
                '<div id="add-form-field"><i class="fa fa-plus"></i> Add New Field</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default user-reg-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-user-reg" onclick="smhPPV.updateUserReg()">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal #form-user input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'left'
        });
    },
    updateUserReg: function () {
        $('#smh-modal #form-user input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'left'
        });
        validator = $("#smh-modal #form-user").validate({
            highlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                field1: {
                    required: true,
                    fieldcheck: true
                },
                field2: {
                    required: true,
                    fieldcheck: true
                },
                field3: {
                    required: true,
                    fieldcheck: true
                },
                field4: {
                    required: true,
                    fieldcheck: true
                },
                field5: {
                    required: true,
                    fieldcheck: true
                }
            },
            messages: {
                field1: {
                    required: "Field cannot be empty",
                    fieldcheck: "Only alphanumeric characters and underscores are allowed"
                },
                field2: {
                    required: "Field cannot be empty",
                    fieldcheck: "Only alphanumeric characters and underscores are allowed"
                },
                field3: {
                    required: "Field cannot be empty",
                    fieldcheck: "Only alphanumeric characters and underscores are allowed"
                },
                field4: {
                    required: "Field cannot be empty",
                    fieldcheck: "Only alphanumeric characters and underscores are allowed"
                },
                field5: {
                    required: "Field cannot be empty",
                    fieldcheck: "Only alphanumeric characters and underscores are allowed"
                }
            }
        });
        var valid = validator.form();
        if (valid) {
            var new_fields = new Array();
            var update_fields = new Array();
            var remove_fields = new Array();
            var table = $("#smh-modal #form-user-table tbody");
            table.find('tr.form-user-row').each(function () {
                var checkbox = $(this).find(':checkbox:checked');
                var id = $(this).find('td').find('.input-group').find('.field').attr('data-id');
                if (id) {
                    update_fields.push({'name': $(this).find('td').find('.input-group').find('.field').val(), 'required': checkbox.length, 'id': id});
                } else {
                    new_fields.push({'name': $(this).find('td').find('.input-group').find('.field').val(), 'required': checkbox.length});
                }

            });

            $.each(owner_attrs, function (i1, v1) {
                var found = false;
                $.each(update_fields, function (i2, v2) {
                    if (v1.id == v2.id) {
                        found = true;
                    }
                });
                if (!found) {
                    remove_fields.push(v1.id);
                }
            });

            var sessData = {
                pid: sessInfo.pid,
                ks: sessInfo.ks,
                newFields: JSON.stringify(new_fields),
                updateFields: JSON.stringify(update_fields),
                removeFields: JSON.stringify(remove_fields)
            }

            var reqUrl = ApiUrl + 'action=update_reg_fields';

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'GET',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#edit-user-reg').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    if (data['success']) {
                        smhPPV.getUsers();
                        smhPPV.get_owner_attrs();
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        }, 5000);
                    }
                }
            });
        }
    },
    get_owner_attrs: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var reqUrl = ApiUrl + 'action=get_owner_attrs';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                owner_attrs = data;
            }
        });
    },
    //Add user modal
    addUser: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '535px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create User</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="add-user-form" style="margin-top: 20px;" action="">' +
                '<table width="460px" border="0" id="admin_edit">' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">First Name:</div></td><td><input type="text" name="fname" class="form-control" placeholder="Enter a First Name" id="fname" size="49"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">Last Name:</div></td><td><input type="text" name="lname" class="form-control" placeholder="Enter a Last Name" id="lname" size="49"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">Email:</div></td><td><input type="text" name="email" class="form-control" placeholder="Enter an Email" id="email" size="49"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">Password:</div></td><td><input type="password" name="pass" class="form-control" placeholder="Enter a Password" id="smh-pass" size="49"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">Confirm Password:</div></td><td><input type="password" name="pass2" class="form-control" placeholder="Re-enter the Password" id="smh-pass2" size="49"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">Restriction:</div></td><td><select class="form-control" id="restriction" style="width: 175px;"><option value="1">Limited Access</option><option value="2">Unlimited Access</option></select></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div style="width: 150px; text-align:left; padding-right:15px">Status:</div></td><td><select class="form-control" id="status" style="width: 175px;"><option value="1">Active</option><option value="2">Blocked</option></select></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2"><br /><div style="width: 150px; text-align:left; padding-right:15px">*All Fields Required.</div></td>' +
                '</tr>' +
                '</table>' +
                '</form></center>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default add-user-close" data-dismiss="modal">Close</button><button id="add-user-account" class="btn btn-primary" onclick="smhPPV.createUser();">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#add-user-form input').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#add-user-form").validate({
            highlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                fname: {
                    required: true
                },
                lname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                pass: {
                    required: true,
                    mypassword: true,
                    minlength: 5
                },
                pass2: {
                    required: true,
                    minlength: 5,
                    equalTo: '#smh-pass'
                },
                restriction: {
                    required: true
                },
                status: {
                    required: true
                }
            },
            messages: {
                fname: {
                    required: "Please enter a first name"
                },
                lname: {
                    required: "Please enter a last name"
                },
                email: {
                    required: "Please enter a email",
                    email: "Please enter a valid email"
                },
                pass: {
                    required: "Please enter a password",
                    minlength: "The password must be at least 5 characters long"
                },
                pass2: {
                    required: "Please enter a password",
                    minlength: "The password must be at least 5 characters long",
                    equalTo: 'Passwords do not match'
                },
                restriction: {
                    required: "Please choose a restriction"
                },
                status: {
                    required: "Please choose a status"
                }
            }
        });
    },
    //Do create user
    createUser: function () {
        var valid = validator.form();
        if (valid) {
            var timezone = jstz.determine();
            var tz = timezone.name();
            var pid = sessInfo.pid;
            var firstName = $("input#fname").val();
            var lastName = $("input#lname").val();
            var email = $("input#email").val();
            var pass = $('#smh-pass').val();
            var restriction = $('select#restriction option:selected').val();
            var status = $('select#status option:selected').val();

            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                fname: firstName,
                lname: lastName,
                email: email,
                pass: pass,
                restriction: restriction,
                status: status,
                tz: tz
            }

            var reqUrl = ApiUrl + 'action=create_account';

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'GET',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#add-user-account').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    if (data['error']) {
                        $('#add-user-account').removeAttr('disabled');
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User already exists!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                        }, 5000);
                    } else {
                        smhPPV.getUsers();
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        }, 5000);
                    }
                }
            });
        }
    },
    //Edit User
    editUser: function (pid, uid, fname, lname, email) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '565px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit User</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="edit-ppv-user" action="">' +
                '<table width="460px" border="0" id="admin_edit">' +
                '<tr>' +
                '<td><div style="width: 100px;">First Name:</div></td><td><input type="text" name="fname" class="form-control" placeholder="Enter a First Name" id="fname" size="49" value="' + fname + '"></td>' +
                '</tr>' +
                '<tr>' +
                '<td>Last Name:</td><td><input type="text" name="lname" class="form-control" id="lname" placeholder="Enter a Last Name" size="49" value="' + lname + '"></td>' +
                '</tr>' +
                '<tr>' +
                '<td>Email:</td><td><input type="text" name="email" class="form-control" id="email" placeholder="Enter an Email" size="49" value="' + email + '"></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2"><br />*All Fields Required.</td>' +
                '</tr>' +
                '</table>' +
                '</form></center>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="update-user" class="btn btn-primary" onclick="smhPPV.updateUser(' + pid + ',' + uid + ')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#edit-ppv-user input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#edit-ppv-user").validate({
            highlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                fname: {
                    required: true
                },
                lname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                fname: {
                    required: "Please enter a first name"
                },
                lname: {
                    required: "Please enter a last name"
                },
                email: {
                    required: "Please enter a email",
                    email: "Please enter a valid email"
                }
            }
        });
    },
    //Updates user account
    updateUser: function (pid, uid) {
        var valid = validator.form();
        if (valid) {
            var timezone = jstz.determine();
            var tz = timezone.name();
            var firstName = $("input#fname").val();
            var lastName = $("input#lname").val();
            var email = $("input#email").val();

            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                uid: uid,
                fname: firstName,
                lname: lastName,
                email: email,
                tz: tz
            }

            var reqUrl = ApiUrl + 'action=update_account';

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'GET',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#update-user').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    if (data['error']) {
                        $('#update-user').removeAttr('disabled');
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User does not exist!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                        }, 5000);
                    } else {
                        smhPPV.getUsers();
                        $('#update-user').removeAttr('disabled');
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                        }, 5000);
                    }
                }
            });
        }
    },
    //View User Orders
    userOrders: function (pid, uid, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '980px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Orders for ' + name + '</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div id='order-table'></div>";
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhPPV.getUserOrders(pid, uid);
    },
    //Load User orders table
    getUserOrders: function (pid, uid) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#order-table').empty();
        $('#order-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data table-hover" id="order-data"></table>');
        $('#order-data').dataTable({
            "dom": 'R<"H"l<"refresh-wrapper">fr>t<"F"ip>',
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
            "sorting": [[0, 'desc']],
            "paginationType": "bootstrap",
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "action": "get_user_orders",
                        "pid": pid,
                        "uid": uid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Orders Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'>ID</span>",
                    "width": "40px"
                },
                {
                    "title": "<span style='float: left;'>Entry Name</span>",
                    "width": "210px"
                },
                {
                    "title": "<span style='float: left;'>Order Status</span>",
                    "width": "75px"
                },
                {
                    "title": "<span style='float: left;'>Payment Status</span>",
                    "width": "80px"
                },
                {
                    "title": "<span style='float: left;'>Ticket Name</span>",
                    "width": "100px"
                },
                {
                    "title": "<span style='float: left;'>Ticket Price</span>",
                    "width": "85px"
                },
                {
                    "title": "<span style='float: left;'>Expires</span>",
                    "width": "123px"
                },
                {
                    "title": "<span style='float: left;'>Max Views</span>",
                    "width": "55px"
                },
                {
                    "title": "<span style='float: left;'>Current Views</span>",
                    "width": "55px"
                }
            ],
            "drawCallback": function () {
                smhMain.fcmcAddRows(this, 9, 10);
            }
        });
        $(".refresh-wrapper").html('<div style="float: right; margin-top: 3px; margin-left: 5px; margin-bottom: 5px;"><a href="#" id="refresh" onClick="smhPPV.getUserOrders(' + pid + ',' + uid + ');"><i class="fa fa-refresh"></i>&nbsp;&nbsp;Refresh</a></div>');
    },
    //User restriction modal
    userRestriction: function (pid, email, restriction) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Change Restriction</h4>';
        $('#smh-modal .modal-header').html(header);

        if (restriction == 1) {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center; width: 400px;'>Choose the restriction for this user:<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px; width: 172px;'><select class='form-control' id='restriction' style='width: 172px;'><option value='1' selected>Limited Access</option><option value='2'>Unlimited Access</option></select></div>";
        } else {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center; width: 400px;'>Choose the restriction for this user:<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px; width: 172px;'><select class='form-control' id='restriction' style='width: 172px;'><option value='1'>Limited Access</option><option value='2' selected>Unlimited Access</option></select></div>";
        }
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="restrict-user" class="btn btn-primary" onclick="smhPPV.updateRestriction(' + pid + ',\'' + email + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do update restriction
    updateRestriction: function (pid, email) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        var restriction = $('select#restriction option:selected').val();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            email: email,
            restriction: restriction,
            tz: tz
        }

        var reqUrl = ApiUrl + 'action=update_user_restriction';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#restrict-user').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#restrict-user').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User does not exist!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                } else {
                    smhPPV.getUsers();
                    $('#restrict-user').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                }
            }
        });
    },
    //User password modal
    userPassword: function (pid, email, name, status) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close pass-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Password Reset</h4>';
        $('#smh-modal .modal-header').html(header);

        if (status == 3) {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>This user must first be activated.<div>";
            footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        } else {
            content = '<center>' +
                    '<div style="margin-left: auto; margin-right: auto; text-align: center;">Enter the new password below for (' + name + ')<div><br>' +
                    '<form id="pass-user" action="">' +
                    '<table width="453px" border="0" id="admin_edit">' +
                    '<tr>' +
                    '<td style="width: 150px; text-align:right; padding-right:15px">Password:</td><td><input type="password" name="pass" class="form-control" placeholder="Enter a Password" id="smh-pass"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="width: 150px; text-align:right; padding-right:15px">Confirm Password:</td><td><input type="password" name="pass2" class="form-control" placeholder="Re-enter the Password" id="smh-pass2"></td>' +
                    '</tr>' +
                    '</table>' +
                    '</form></center>';
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default pass-close" data-dismiss="modal">Close</button><button id="reset-user-pswd" class="btn btn-primary" onclick="smhPPV.resetPswrd(' + pid + ',\'' + email + '\')">Reset</button>';
        }
        $('#smh-modal .modal-body').html(content);
        $('#smh-modal .modal-footer').html(footer);

        $('#pass-user input').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#pass-user").validate({
            highlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                pass: {
                    required: true,
                    mypassword: true,
                    minlength: 5
                },
                pass2: {
                    required: true,
                    minlength: 5,
                    equalTo: '#smh-pass'
                }
            },
            messages: {
                pass: {
                    required: "Please enter a password",
                    minlength: "The password must be at least 5 characters long"
                },
                pass2: {
                    required: "Please enter a password",
                    minlength: "The password must be at least 5 characters long",
                    equalTo: 'Passwords do not match'
                }
            }
        });

    },
    //Do Reset Password
    resetPswrd: function (pid, email) {
        var valid = validator.form();
        if (valid) {
            var timezone = jstz.determine();
            var tz = timezone.name();
            var pass = $('#smh-pass').val();

            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                email: email,
                pass: pass,
                tz: tz
            }

            var reqUrl = ApiUrl + 'action=reset_pswd';

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'GET',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#reset-user-pswd').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    if (data['error']) {
                        $('#reset-user-pswd').removeAttr('disabled');
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User does not exist!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                        }, 5000);
                    } else {
                        smhPPV.getUsers();
                        $('#reset-user-pswd').removeAttr('disabled');
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                        }, 5000);
                    }
                }
            });
        }
    },
    //Change status modal
    statusUser: function (pid, email, name, status, uid) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var status_update, status_text;
        if (status == 1) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected user?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";
            status_update = 2;
            status_text = 'Block';
        } else if (status == 2) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected user?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";
            status_update = 1;
            status_text = 'Unblock';
        } else if (status == 3) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Activate User</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to activate the selected user?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";
            status_update = 1;
            status_text = 'Activate';
        }
        $('.modal-header').html(header);
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-user" class="btn btn-primary" onclick="smhPPV.updateStatus(' + pid + ',\'' + email + '\',' + status_update + ',' + uid + ')">' + status_text + '</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do update status
    updateStatus: function (pid, email, status_update, uid) {
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            email: email,
            status: status_update,
            uid: uid,
            tz: tz
        }

        var reqUrl = ApiUrl + 'action=update_user_status';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#status-user').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#status-user').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User does not exist!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                } else {
                    smhPPV.getUsers();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 5000);
                }
            }
        });
    },
    //Session Modal
    destroySession: function (pid, uid, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Destroy Session</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to destroy this user's login session?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="delete-user" class="btn btn-primary" onclick="smhPPV.doDestroySession(' + pid + ',' + uid + ')">Destroy Session</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do Destroy Session
    doDestroySession: function (pid, uid) {
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            uid: uid
        }

        var reqUrl = ApiUrl + 'action=destroy_session';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#delete-user').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#delete-user').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User currently not logged in!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                } else {
                    smhPPV.getUsers();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Destroyed Session!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 5000);
                }
            }
        });
    },
    //Delete Modal
    deleteUser: function (pid, uid, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete User</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected user?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="delete-user" class="btn btn-primary" onclick="smhPPV.removeUser(' + pid + ',\'' + uid + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do delete user
    removeUser: function (pid, uid) {
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            uid: uid,
            tz: tz
        }

        var reqUrl = ApiUrl + 'action=delete_account';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#delete-user').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#delete-user').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! User does not exist!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                } else {
                    smhPPV.getUsers();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Deleted!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 5000);
                }
            }
        });
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_ppv_user_metadata';
        }
    },
    update_concurrent_status: function (status) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            concurrent: status
        }

        var reqUrl = ApiUrl + 'action=user_concurrent_status';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {}
        });
    },
    get_concurrent_status: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var reqUrl = ApiUrl + 'action=get_concurrent_status';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['concurrent_logins']) {
                    $('#concurrent-logins').bootstrapToggle('on');
                } else {
                    $('#concurrent-logins').bootstrapToggle('off');
                }
                $('#concurrent-logins').change(function () {
                    if ($(this).prop('checked')) {
                        smhPPV.update_concurrent_status(1);
                    } else {
                        smhPPV.update_concurrent_status(0);
                    }
                });
            }
        });
    },
    update_activation_skip_status: function (status) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            skip: status
        }

        var reqUrl = ApiUrl + 'action=user_activation_skip_status';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {}
        });
    },
    get_activation_skip_status: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var reqUrl = ApiUrl + 'action=get_activation_skip_status';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['skip_activation']) {
                    $('#activation-step').bootstrapToggle('on');
                } else {
                    $('#activation-step').bootstrapToggle('off');
                }
                $('#activation-step').change(function () {
                    if ($(this).prop('checked')) {
                        smhPPV.update_activation_skip_status(1);
                    } else {
                        smhPPV.update_activation_skip_status(0);
                    }
                });
            }
        });
    },
    removeField: function (row) {
        $('#' + row).remove();
        num--;
    },
    limit: function (event, value) {
        var max_chars = 42;
        if (value != undefined && value.toString().length < max_chars || $.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
        } else {
            event.preventDefault();
        }
    },
    //Register all user actions
    registerActions: function () {
        $.validator.addMethod('mypassword', function (value, element) {
            return this.optional(element) || (value.match(/[A-Z]/) && value.match(/[a-z]/) && value.match(/[0-9]/));
        }, 'Password must contain at least one uppercase letter, one lowercase letter, and one number.');
        $.validator.addMethod("fieldcheck", function (value, element) {
            return this.optional(element) || /^[A-Za-z0-9_'"\s]+$/i.test(value);
        }, "Only alphanumeric characters and underscores are allowed.");
        $('#smh-modal').on('click', '.edit-user-close', function () {
            $('#edit-ppv-user input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.pass-close', function () {
            $('#pass-user input[type="password"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.add-user-close', function () {
            $('#add-user-form input').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.user-reg-close', function () {
            $('#form-user input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.user-details-close', function () {
            $('#form-edit-details input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '#add-form-field', function (event) {
            if (num <= 5) {
                $('#form-user-table tr:last').after('<tr class="form-user-row" id="field-num' + num + '"><td><div class="input-group"><input class="field form-control" placeholder="Enter a field name" data-id="" id="field-input' + num + '" name="field' + num + '" style="display: block; width: 300px ! important;" type="text" onkeydown="smhPPV.limit(event,this.value);" onkeyup="smhPPV.limit(event,this.value);"></div></td><td><div class="form-group"><div class="checkbox"><div class="checkbox-wrapper"><input class="req" style="position: relative; margin-left: 0px; margin-top: 0px;" type="checkbox" id="field-required-num' + num + '"></div></div></div></td><td><div class="remove-field-icon"><i class="fa fa-remove" onclick="smhPPV.removeField(\'field-num' + num + '\')"></i></div></td></tr>');

                $('#smh-modal #form-user input[type="text"]').tooltipster({
                    trigger: 'custom',
                    onlyOne: false,
                    position: 'left'
                });
                num++;
            }
        });
    }
}

// PPV on ready
$(document).ready(function () {
    smhPPV = new PPV();
    smhPPV.getGateways();
    smhPPV.getUsers();
    smhPPV.registerActions();
    smhPPV.get_concurrent_status();
    smhPPV.get_activation_skip_status();
    smhPPV.get_owner_attrs();
});
