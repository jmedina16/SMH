/*
 *
 *	Streaming Media Hosting
 *	
 *	Reseller
 *
 *	9-15-2015
 */
//Main constructor
function Reseller() {}

//Global variables
var account_layout_top_settings = false;
var account_layout_logo_image = false;
var account_layout_logo_text = false;
var account_layout_side_settings = false;
var user_storage_limit = 0;
var user_storage_used = 0;
var user_bandwidth_limit = 0;
var user_bandwidth_used = 0;
var available_bandwidth = 0;
var avaiable_storage = 0;
var total_entries;

//Login prototype/class
Reseller.prototype = {
    constructor: Reseller,
    //Build tickets table
    getResellerAccounts: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#reseller-table').empty();
        $('#reseller-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="reseller-data"></table>');
        rsTable = $('#reseller-data').DataTable({
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
            "lengthChange": true,
            "ajax": {
                "url": "/apps/platform/reseller_acnts.php",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "parent_id": sessInfo.pid,
                        "action": "get_acnts",
                        "tz": tz
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    $('#available').html(json['usersAvail']);
                    $('#parent_total_transfer').html(json['total_bandwidth_used']);
                    var total_bandwidth_used_percentage = json['total_bandwidth_used_percentage'];
                    $('#parent_bandwidth_progress').css('width', total_bandwidth_used_percentage + '%');

                    if (total_bandwidth_used_percentage < 80) {
                        $('#parent_bandwidth_progress').removeClass('progress-bar-green');
                        $('#parent_bandwidth_progress').removeClass('progress-bar-yellow');
                        $('#parent_bandwidth_progress').removeClass('progress-bar-red');
                        $('#parent_bandwidth_progress').addClass('progress-bar-green');
                    }

                    if (total_bandwidth_used_percentage >= 80 && total_bandwidth_used_percentage < 90) {
                        $('#parent_bandwidth_progress').removeClass('progress-bar-green');
                        $('#parent_bandwidth_progress').removeClass('progress-bar-yellow');
                        $('#parent_bandwidth_progress').removeClass('progress-bar-red');
                        $('#parent_bandwidth_progress').addClass('progress-bar-yellow');
                    }

                    if (total_bandwidth_used_percentage >= 90) {
                        $('#parent_bandwidth_progress').removeClass('progress-bar-green');
                        $('#parent_bandwidth_progress').removeClass('progress-bar-yellow');
                        $('#parent_bandwidth_progress').removeClass('progress-bar-red');
                        $('#parent_bandwidth_progress').addClass('progress-bar-red');
                    }

                    $('#parent_total_storage').html(json['total_storage_used']);
                    var total_storage_used_percentage = json['total_storage_used_percentage'];
                    $('#parent_storage_progress').css('width', total_storage_used_percentage + '%');

                    if (total_storage_used_percentage < 80) {
                        $('#parent_storage_progress').removeClass('progress-bar-green');
                        $('#parent_storage_progress').removeClass('progress-bar-yellow');
                        $('#parent_storage_progress').removeClass('progress-bar-red');
                        $('#parent_storage_progress').addClass('progress-bar-green');
                    }

                    if (total_storage_used_percentage >= 80 && total_storage_used_percentage < 90) {
                        $('#parent_storage_progress').removeClass('progress-bar-green');
                        $('#parent_storage_progress').removeClass('progress-bar-yellow');
                        $('#parent_storage_progress').removeClass('progress-bar-red');
                        $('#parent_storage_progress').addClass('progress-bar-yellow');
                    }

                    if (total_storage_used_percentage >= 90) {
                        $('#parent_storage_progress').removeClass('progress-bar-green');
                        $('#parent_storage_progress').removeClass('progress-bar-yellow');
                        $('#parent_storage_progress').removeClass('progress-bar-red');
                        $('#parent_storage_progress').addClass('progress-bar-red');
                    }

                    user_storage_limit = json['user_storage_limit'];
                    user_storage_used = json['user_storage_used'];
                    user_bandwidth_limit = json['user_bandwidth_limit'];
                    user_bandwidth_used = json['user_bandwidth_used'];
                    available_bandwidth = user_bandwidth_limit - user_bandwidth_used;
                    if (!user_bandwidth_limit) {
                        $('#parent_bandwidth_limit').html('unlimited ');
                    } else {
                        $('#parent_bandwidth_limit').html(smhRS.formatNumber(user_bandwidth_limit));
                    }
                    if (!user_storage_limit) {
                        $('#parent_storage_limit').html('unlimited ');
                    } else {
                        $('#parent_storage_limit').html(smhRS.formatNumber(user_storage_limit));
                    }
                    if (Number(json['usersAvail']) == 0 || available_bandwidth <= 0 && user_bandwidth_limit > 0) {
                        $('#add-account').attr('disabled', '');
                    } else {
                        $('#add-account').removeAttr('disabled');
                    }
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Accounts Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><div class='data-break'>Status</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>ID</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Publisher/Company</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Admin Email</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Admin Name</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Data Transfered</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Storage Used</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                    "width": "170px"
                }
            ],
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 8, 10);
            }
        });
    },
    //Edit Account Details
    editAccount: function (pid, pub_name, desc, admin_name, admin_email) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '490px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close account-edit-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Account</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="pass-wrapper">' +
                '<form id="account-edit-form">' +
                '<table id="account-table">' +
                '<tr>' +
                '<td><b>ID:</b></td>' +
                '<td>' + pid + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b class="required">Business Name:</b></td>' +
                '<td style="width: 60%;"><input type="text" name="pub_name" id="pub_name" class="form-control" placeholder="Enter business name" value="' + pub_name + '"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b class="required">Admin Name:</b></td>' +
                '<td><input type="text" name="admin_name" id="admin_name" class="form-control" placeholder="Enter Admin Name" value="' + admin_name + '"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b class="required">Admin Email:</b></td>' +
                '<td><input type="text" name="admin_email" id="admin_email" class="form-control" placeholder="Enter Admin Email" value="' + admin_email + '"></td>' +
                '</tr>' +
                '</table>' +
                '</form>' +
                '</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default account-edit-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-account" onclick="smhRS.updateAccount(' + pid + ')">Save</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#account-edit-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#account-edit-form").validate({
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
                pub_name: {
                    required: true
                },
                admin_name: {
                    required: true
                },
                admin_email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                pub_name: {
                    required: 'Please enter a publisher/company name'
                },
                admin_name: {
                    required: 'Please enter an Admin Name'
                },
                admin_email: {
                    required: 'Please enter an Admin Email',
                    email: 'Please enter a valid email address'
                }
            }
        });
    },
    //Update Account Details
    updateAccount: function (pid) {
        var valid = validator.form();
        if (valid) {
            var childId = pid;
            var businessName = $("#account-edit-form #pub_name").val();
            var name = $("#account-edit-form #admin_name").val();
            var email = $("#account-edit-form #admin_email").val();

            var reqUrl = '/api/v1/updateResellerAccount';
            var sessData = {
                _token: $('meta[name="csrf-token"]').attr('content'),
                ks: sessInfo.ks,
                action: 'update',
                parentId: sessInfo.pid,
                childId: childId,
                businessName: businessName,
                businessDescription: businessName,
                ownerName: name,
                ownerEmail: email
            }

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'POST',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#smh-modal #update-account').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    if (data['success']) {
                        $('#smh-modal #loading').empty();
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Saved!</span>');
                        smhRS.getResellerAccounts();
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal #update-account').removeAttr('disabled');
                        }, 3000);
                    }
                }
            });
        }
    },
    //Create Account
    createAccount: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '490px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close account-create-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Account</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="pass-wrapper">' +
                '<form id="account-create-form">' +
                '<table id="account-table">' +
                '<tr>' +
                '<td><b class="required">Business Name:</b></td>' +
                '<td style="width: 60%;"><input type="text" name="pub_name" id="pub_name" class="form-control" placeholder="Enter business name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b class="required">Admin Name:</b></td>' +
                '<td><input type="text" name="admin_name" id="admin_name" class="form-control" placeholder="Enter Admin Name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b class="required">Admin Email:</b></td>' +
                '<td><input type="text" name="admin_email" id="admin_email" class="form-control" placeholder="Enter Admin Email"></td>' +
                '</tr>' +
                '</table>' +
                '</form>' +
                '</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default account-create-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="create-account" onclick="smhRS.createReseller()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#account-create-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#account-create-form").validate({
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
                pub_name: {
                    required: true
                },
                admin_name: {
                    required: true
                },
                admin_email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                pub_name: {
                    required: 'Please enter a business name'
                },
                admin_name: {
                    required: 'Please enter an Admin Name'
                },
                admin_email: {
                    required: 'Please enter an Admin Email',
                    email: 'Please enter a valid email address'
                }
            }
        });
    },
    //Create reseller account
    createReseller: function () {
        var valid = validator.form();
        if (valid) {
            var businessName = $("#account-create-form #pub_name").val();
            var name = $("#account-create-form #admin_name").val();
            var email = $("#account-create-form #admin_email").val();

            var reqUrl = '/apps/reseller/v1.0/index.php';
            var sessData = {
                _token: $('meta[name="csrf-token"]').attr('content'),
                ks: sessInfo.ks,
                action: 'create',
                parentId: sessInfo.pid,
                businessName: businessName,
                businessDescription: businessName,
                ownerName: name,
                ownerEmail: email,
                vr: 0
            }

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'POST',
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#smh-modal #create-account').attr('disabled', '');
                    $('#smh-modal #loading img').css('display', 'inline-block');
                    $('#smh-modal #pass-result').html('<span class="label label-success" style="margin-right: 10px;">Creating account, please wait..</span>');
                },
                success: function (data) {
                    if (data['success']) {
                        $('#smh-modal #loading').empty();
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                        smhRS.getResellerAccounts();
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            smhRS.editServices(0, 0, 0, 0, 0, 0, 0, data['child_id'], true);
                        }, 3000);
                    } else if (data['error']) {
                        $('#smh-modal #loading').empty();
                        $('#smh-modal #pass-result').html('<span class="label label-danger">' + data['message'] + '</span>');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal #create-account').removeAttr('disabled');
                        }, 3000);
                    }
                }
            });
        }
    },
    //Edit status modal
    editStatus: function (childId, admin_name, status) {
        smhMain.resetModal();
        var header, content, footer, statusUpdate;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Status</h4>';
        $('#smh-modal .modal-header').html(header);

        if (status == 'Unblock') {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to unblock the selected account?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + admin_name + ")</div>";
            statusUpdate = 1;
        } else {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to block the selected account?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + admin_name + ")</div>";
            statusUpdate = 2;
        }

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-status" onclick="smhRS.updateStatus(' + childId + ',' + statusUpdate + ')">' + status + '</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Updates user status
    updateStatus: function (childId, statusUpdate) {
        var reqUrl = '/api/v1/updateResellerStatus';
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            ks: sessInfo.ks,
            action: 'status',
            parentId: sessInfo.pid,
            childId: childId,
            status: statusUpdate
        }

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'POST',
            data: sessData,
            beforeSend: function () {
                $('#save-status').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                var data = $.parseJSON(data);
                if (data['success']) {
                    $('#smh-modal').modal('hide');
                    smhRS.getResellerAccounts();
                }
            }
        });
    },
    //Delete Account modal
    deleteAccount: function (childId, admin_name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to delete the selected account?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + admin_name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-account" onclick="smhRS.removeAccount(' + childId + ')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove account
    removeAccount: function (childId) {
        var reqUrl = '/api/v1/deleteResellerAccount';
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            ks: sessInfo.ks,
            action: 'delete',
            parentId: sessInfo.pid,
            childId: childId
        }

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'POST',
            data: sessData,
            beforeSend: function () {
                $('#delete-account').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                var data = $.parseJSON(data);
                if (data['success']) {
                    $('#smh-modal').modal('hide');
                    smhRS.getResellerAccounts();
                }
            }
        });
    },
    //Edit Account Services
    editServices: function (trans, ppv, mem, vc, wl, efwl, cl, pid, ca) {
        smhMain.resetModal();
        var header, content, footer;
        var trans_service = '';
        var ppv_service = '';
        var mem_service = '';
        var vc_service = '';
        var layout_service = '';
        if (services.trans_vod) {
            var trans_check = (trans) ? 'checked' : '';
            trans_service = '<tr class="services-body"><td class="services-text">Transcoding</td><td class="services-switch"><input ' + trans_check + ' data-toggle="toggle" id="trans-service" type="checkbox"></td></tr>';
        }
        if (services.ppv) {
            var ppv_check = (ppv) ? 'checked' : '';
            ppv_service = '<tr class="services-body"><td class="services-text">Pay Per View</td><td class="services-switch"><input ' + ppv_check + ' data-toggle="toggle" id="ppv-service" type="checkbox"></td></tr>';
        }
        if (services.mem) {
            var mem_check = (mem) ? 'checked' : '';
            mem_service = '<tr class="services-body"><td class="services-text">Membership</td><td class="services-switch"><input ' + mem_check + ' data-toggle="toggle" id="mem-service" type="checkbox"></td></tr>';
        }
        if (services.vc) {
            var vc_check = (vc) ? 'checked' : '';
            vc_service = '<tr class="services-body"><td class="services-text">Video Chat</td><td class="services-switch"><input ' + vc_check + ' data-toggle="toggle" id="vc-service" type="checkbox"></td></tr>';
        }
        if (services.wl) {
            var wl_check = (wl) ? 'checked' : '';
            var efwl_check = (efwl) ? 'checked' : '';
            var cl_check = (cl) ? 'checked' : '';
            layout_service = '<tr><td colspan="2" id="services-header">Layout Configuration<div class="layout-config">Enable the White Label service, apply my layout configuration,<br> or customize this account\'s layout</div></td></tr>' +
                    '<tr class="services-body"><td class="services-text">White Label</td><td class="services-switch"><input ' + wl_check + ' data-toggle="toggle" id="wl-service" type="checkbox"></td></tr>' +
                    '<tr class="services-body"><td class="services-text">Apply My Layout</td><td class="services-switch"><input ' + efwl_check + ' data-toggle="toggle" id="efwl-service" type="checkbox"></td></tr>' +
                    '<tr class="services-body"><td class="services-text">Customize Layout</td><td class="services-switch"><input ' + cl_check + ' data-toggle="toggle" id="cl-service" type="checkbox"><div id="edit-settings"><button onclick="smhRS.modifyUserLayout(' + pid + ');" class="btn btn-primary" type="button">Edit Layout</button><div></td></tr>';
        }

        $('.smh-dialog').css('width', '490px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Modify Services</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<table id="service-table">' +
                '<tr><td colspan="2" id="services-header">Switch this account\'s services on or off</td></tr>' +
                trans_service +
                ppv_service +
                mem_service +
                vc_service +
                layout_service +
                '</table>';
        $('#smh-modal .modal-body').html(content);

        $('#trans-service').bootstrapToggle();
        $('#ppv-service').bootstrapToggle();
        $('#mem-service').bootstrapToggle();
        $('#vc-service').bootstrapToggle();
        $('#wl-service').bootstrapToggle();
        $('#efwl-service').bootstrapToggle();
        $('#cl-service').bootstrapToggle();

        $('#service-table #wl-service').change(function () {
            if ($(this).prop('checked')) {
                $('#efwl-service').bootstrapToggle('off');
                $('#cl-service').bootstrapToggle('off');
                $('#edit-settings').css('display', 'none');
            }
        });

        $('#service-table #efwl-service').change(function () {
            if ($(this).prop('checked')) {
                $('#wl-service').bootstrapToggle('off');
                $('#cl-service').bootstrapToggle('off');
                $('#edit-settings').css('display', 'none');
            }
        });

        $('#service-table #cl-service').change(function () {
            if ($(this).prop('checked')) {
                $('#wl-service').bootstrapToggle('off');
                $('#efwl-service').bootstrapToggle('off');
                $('#edit-settings').css('display', 'inline-block');
            } else {
                $('#edit-settings').css('display', 'none');
            }
        });

        if (cl) {
            $('#edit-settings').css('display', 'inline-block');
        }

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-services" onclick="smhRS.saveServices(' + pid + ',' + ca + ')">Save</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Modify Limits modal
    editLimits: function (childId, child_storage_limit, child_bandwidth_limit) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Modify Limits</h4>';
        $('#smh-modal .modal-header').html(header);

        var bandwidth_available = '';
        var storage_available = '';
        if (user_bandwidth_limit == 0) {
            bandwidth_available = 'unlimited ';
        } else {
            bandwidth_available = user_bandwidth_limit - user_bandwidth_used;
        }
        if (user_storage_limit == 0) {
            storage_available = 'unlimited ';
        } else {
            storage_available = user_storage_limit - user_storage_used;
        }
        var storage = '<input id="storage-limit" type="hidden" name="storage-limit" value="0">';
        var bandwidth = '<input id="bandwidth-limit" type="hidden" name="bandwidth-limit" value="0">';
        if (child_storage_limit != 0 && user_storage_limit == 0) {
            storage = '<tr><td id="services-header" style="background-color: #fff; border-bottom: 1px solid #f0f0f0;" colspan="2">Available Storage: <span id="storage-avail">' + smhRS.formatNumber(storage_available) + '</span>GB</td></tr>' +
                    '<tr class="services-body"><td class="services-text">Storage</td><td class="services-switch"><div class="col-md-13"><input id="storage-limit" type="text" name="storage-limit" class="col-md-8 form-control"></div></td></tr>';
        } else if (child_storage_limit != 0 && storage_available >= 0) {
            storage = '<tr><td id="services-header" style="background-color: #fff; border-bottom: 1px solid #f0f0f0;" colspan="2">Available Storage: <span id="storage-avail">' + smhRS.formatNumber(storage_available) + '</span>GB</td></tr>' +
                    '<tr class="services-body"><td class="services-text">Storage</td><td class="services-switch"><div class="col-md-13"><input id="storage-limit" type="text" name="storage-limit" class="col-md-8 form-control"></div></td></tr>';
        }

        if (child_bandwidth_limit != 0 && user_bandwidth_limit == 0) {
            bandwidth = '<tr><td id="services-header" style="background-color: #fff; border-bottom: 1px solid #f0f0f0;" colspan="2">Available Bandwidth: <span id="bandwidth-avail">' + smhRS.formatNumber(bandwidth_available) + '</span>GB</td></tr>' +
                    '<tr class="services-body"><td class="services-text">Bandwidth</td><td class="services-switch"><div class="col-md-13"><input id="bandwidth-limit" type="text" name="bandwidth-limit" class="form-control"></div></td></tr>';
        } else if (child_bandwidth_limit != 0 && bandwidth_available >= 0) {
            bandwidth = '<tr><td id="services-header" style="background-color: #fff; border-bottom: 1px solid #f0f0f0;" colspan="2">Available Bandwidth: <span id="bandwidth-avail">' + smhRS.formatNumber(bandwidth_available) + '</span>GB</td></tr>' +
                    '<tr class="services-body"><td class="services-text">Bandwidth</td><td class="services-switch"><div class="col-md-13"><input id="bandwidth-limit" type="text" name="bandwidth-limit" class="form-control"></div></td></tr>';
        }

        var disable = '';
        if (bandwidth_available < 0 && storage_available < 0) {
            bandwidth = '<tr><td id="services-header" style="background-color: #fff; border-bottom: 1px solid #f0f0f0;" colspan="2">No Bandwidth and Storage Available</td></tr>';
            disable = 'disabled';
        }

        content = '<table id="service-table" class="limits-table">' +
                '<tr><td colspan="2" id="services-header">Set Storage/Bandwidth Limits on this account</td></tr>' +
                bandwidth +
                storage +
                '</table>';

        $('#smh-modal .modal-body').html(content);

        if (child_storage_limit != 0) {
            if (user_storage_limit == 0) {
                $("input[name='storage-limit']").TouchSpin({
                    initval: child_storage_limit,
                    postfix: 'GB',
                    min: 1,
                    max: 100000,
                    step: 1,
                    verticalbuttons: true
                });
            } else if (storage_available >= 0) {
                var max_storage = user_storage_limit - user_storage_used;
                if (max_storage <= child_storage_limit) {
                    $("input[name='storage-limit']").TouchSpin({
                        initval: child_storage_limit,
                        postfix: 'GB',
                        min: 1,
                        max: child_storage_limit + max_storage,
                        step: 1,
                        verticalbuttons: true
                    });
                    $("input[name='storage-limit']").on('change', function () {
                        var add_sub = child_storage_limit - parseInt($('#storage-limit').val())
                        var new_storage_available = storage_available + add_sub;
                        $('#storage-avail').html(smhRS.formatNumber(new_storage_available));
                    });
                } else {
                    var new_max_storage = max_storage + child_storage_limit;
                    $("input[name='storage-limit']").TouchSpin({
                        initval: child_storage_limit,
                        postfix: 'GB',
                        min: 1,
                        max: new_max_storage,
                        step: 1,
                        verticalbuttons: true
                    });
                    $("input[name='storage-limit']").on('change', function () {
                        var add_sub = child_storage_limit - parseInt($('#storage-limit').val())
                        var new_storage_available = storage_available + add_sub;
                        $('#storage-avail').html(smhRS.formatNumber(new_storage_available));
                    });
                }
            }
        }
        if (child_bandwidth_limit != 0) {
            if (user_bandwidth_limit == 0) {
                $("input[name='bandwidth-limit']").TouchSpin({
                    initval: child_bandwidth_limit,
                    postfix: 'GB',
                    min: 1,
                    max: 100000,
                    step: 1,
                    verticalbuttons: true
                });
            } else if (bandwidth_available >= 0) {
                var max_bandwidth = user_bandwidth_limit - user_bandwidth_used;
                if (max_bandwidth <= child_bandwidth_limit) {
                    $("input[name='bandwidth-limit']").TouchSpin({
                        initval: child_bandwidth_limit,
                        postfix: 'GB',
                        min: 1,
                        max: child_bandwidth_limit + max_bandwidth,
                        step: 1,
                        verticalbuttons: true
                    });
                    $("input[name='bandwidth-limit']").on('change', function () {
                        var add_sub = child_bandwidth_limit - parseInt($('#bandwidth-limit').val())
                        var new_bandwidth_available = bandwidth_available + add_sub;
                        $('#bandwidth-avail').html(smhRS.formatNumber(new_bandwidth_available));
                    });
                } else {
                    var new_max_bandwidth = max_bandwidth + child_bandwidth_limit;
                    $("input[name='bandwidth-limit']").TouchSpin({
                        initval: child_bandwidth_limit,
                        postfix: 'GB',
                        min: 1,
                        max: new_max_bandwidth,
                        step: 1,
                        verticalbuttons: true
                    });
                    $("input[name='bandwidth-limit']").on('change', function () {
                        var add_sub = child_bandwidth_limit - parseInt($('#bandwidth-limit').val())
                        var new_bandwidth_available = bandwidth_available + add_sub;
                        $('#bandwidth-avail').html(smhRS.formatNumber(new_bandwidth_available));
                    });
                }
            }
        }

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-limits" onclick="smhRS.saveLimits(' + childId + ')" ' + disable + '>Save</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Format number
    formatNumber: function (num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    //Update Child Limits
    saveLimits: function (id) {
        var storage_limit = $("#storage-limit").val();
        var bandwidth_limit = $("#bandwidth-limit").val();
        var reqUrl = '/api/v1/updateUserLimits';
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            childId: id,
            storage_limit: storage_limit,
            bandwidth_limit: bandwidth_limit
        }

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#smh-modal #update-limits').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Saved!</span>');
                    smhRS.getResellerAccounts();
                    setTimeout(function () {
                        $('#smh-modal').modal('hide');
                    }, 3000);
                }
            }
        });
    },
    //Modify User Layout
    modifyUserLayout: function (pid) {
        var trans_service = 0;
        var ppv_service = 0;
        var mem_service = 0;
        var vc_service = 0;
        var wl_service = 0;
        var efwl_service = 0;
        var cl_service = 0;
        if (services.trans_vod) {
            trans_service = ($('#service-table #trans-service').prop('checked')) ? 1 : 0;
        }
        if (services.ppv) {
            ppv_service = ($('#service-table #ppv-service').prop('checked')) ? 1 : 0;
        }
        if (services.mem) {
            mem_service = ($('#service-table #mem-service').prop('checked')) ? 1 : 0;
        }
        if (services.vc) {
            vc_service = ($('#service-table #vc-service').prop('checked')) ? 1 : 0;
        }
        if (services.wl) {
            wl_service = ($('#service-table #wl-service').prop('checked')) ? 1 : 0;
            efwl_service = ($('#service-table #efwl-service').prop('checked')) ? 1 : 0;
            cl_service = ($('#service-table #cl-service').prop('checked')) ? 1 : 0;
        }

        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '400px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Layout</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="text-align: center; margin-top: 186px; height: 364px;"><img height="20px" src="/img/loading.gif"></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="layout-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" onclick="smhRS.editServices(' + trans_service + ',' + ppv_service + ',' + mem_service + ',' + vc_service + ',' + wl_service + ',' + efwl_service + ',' + cl_service + ',' + pid + ',' + false + ');">Back</button><button type="button" class="btn btn-primary" id="save-account-layout" onclick="smhRS.saveAcntLayout(' + trans_service + ',' + ppv_service + ',' + mem_service + ',' + vc_service + ',' + wl_service + ',' + efwl_service + ',' + cl_service + ',' + pid + ')">Save</button>';
        $('#smh-modal .modal-footer').html(footer);

        var reqUrl = '/api/v1/getLayout';
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            pid: pid,
            action: 'get_layout'
        }

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            success: function (data) {
                var data = $.parseJSON(data);
                var account_layout = data[0];

                if (account_layout) {
                    content = '<ul class="nav nav-tabs">' +
                            '<li class="active"><a data-toggle="tab" href="#topnav-tab">Top Navbar</a></li>' +
                            '<li><a data-toggle="tab" href="#sidenav-tab">Side Navbar</a></li>' +
                            '</ul>' +
                            '<div class="tab-content">' +
                            '<div id="topnav-tab" class="tab-pane active">';

                    if (account_layout['layout_top_settings'] == 0) {
                        content += '<form id="account-layout-topnav-settings" role="form">' +
                                '<li>' +
                                '<div id="account-top-nav-custom">' +
                                '<div class="sub-title">Settings</div>' +
                                '<div style="height: 10px;"></div>' +
                                '<div class="sub-options">' +
                                '<div data-toggle="btn-toggle" class="btn-group">' +
                                '<button class="btn btn-default btn-sm active" type="button" id="account-top-default-btn" onclick="smhRS.disableTopCustSetting();">Default</button>' +
                                '<button class="btn btn-default btn-sm" type="button" id="account-top-custom-btn" onclick="smhRS.enableTopCustSetting();">Custom</button>' +
                                '</div>' +
                                '<div id="account-top-nav-settings-text"><i>Use default settings.</i></div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Background Color</div>' +
                                '<div class="input-group account-top-nav-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#3c8dbc" name="account_top_nav_bgcolor" id="account_top_nav_bgcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Font Color</div>' +
                                '<div class="input-group account-top-nav-font-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#ffffff" name="account_top_nav_fontcolor" id="account_top_nav_fontcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<label class="sub-title">Logo</label>' +
                                '<div style="margin-top: 10px; margin-bottom: 5px; font-weight: normal;">Select Source</div>' +
                                '<div class="sub-options">' +
                                '<div class="btn-group">' +
                                '<button type="button" class="btn btn-default source-text"><span class="text">Custom Text</span></button>' +
                                '<button aria-expanded="false" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                                '<span class="caret"></span>' +
                                '</button>' +
                                '<ul class="dropdown-menu" id="logo-source" role="menu">' +
                                '<li><a onclick="smhRS.custom_text_options();">Custom Text</a></li>' +
                                '<li><a onclick="smhRS.custom_logo_options();">Image</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '<div id="logo-content">' +
                                '<div style="margin-top: 10px; font-size: 11px; margin-bottom: 15px; font-weight: normal;"><i>Publisher/Company Name will be used.</i></div>' +
                                '<div style="display: inline-block; margin-right: 10px; font-weight: normal; margin-bottom: 5px;">Font Size</div>' +
                                '<div class="input-group col-xs-6">' +
                                '<select id="account-logo-font-size" class="form-control">' +
                                '<option value="1">1 px</option>' +
                                '<option value="2">2 px</option>' +
                                '<option value="3">3 px</option>' +
                                '<option value="4">4 px</option>' +
                                '<option value="5">5 px</option>' +
                                '<option value="6">6 px</option>' +
                                '<option value="7">7 px</option>' +
                                '<option value="8">8 px</option>' +
                                '<option value="9">9 px</option>' +
                                '<option value="10">10 px</option>' +
                                '<option value="11">11 px</option>' +
                                '<option value="12">12 px</option>' +
                                '<option value="13">13 px</option>' +
                                '<option value="14">14 px</option>' +
                                '<option value="15">15 px</option>' +
                                '<option value="16">16 px</option>' +
                                '<option value="17">17 px</option>' +
                                '<option value="18">18 px</option>' +
                                '<option value="19">19 px</option>' +
                                '<option value="20" selected>20 px</option>' +
                                '<option value="21">21 px</option>' +
                                '<option value="22">22 px</option>' +
                                '<option value="23">23 px</option>' +
                                '<option value="24">24 px</option>' +
                                '<option value="25">25 px</option>' +
                                '<option value="26">26 px</option>' +
                                '<option value="27">27 px</option>' +
                                '<option value="28">28 px</option>' +
                                '<option value="29">29 px</option>' +
                                '<option value="30">30 px</option>' +
                                '</select>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</li>' +
                                '</form>';
                    }
                    if (account_layout['layout_top_settings'] == 1) {
                        account_layout_top_settings = true;
                        content += '<form id="account-layout-topnav-settings" role="form">' +
                                '<li>' +
                                '<div id="account-top-nav-custom">' +
                                '<div class="sub-title">Settings</div>' +
                                '<div style="height: 10px;"></div>' +
                                '<div class="sub-options">' +
                                '<div data-toggle="btn-toggle" class="btn-group">' +
                                '<button class="btn btn-default btn-sm" type="button" id="account-top-default-btn" onclick="smhRS.disableTopCustSetting();">Default</button>' +
                                '<button class="btn btn-default btn-sm active" type="button" id="account-top-custom-btn" onclick="smhRS.enableTopCustSetting();">Custom</button>' +
                                '</div>' +
                                '<div id="account-top-nav-settings-text"><i>Use custom settings.</i></div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Background Color</div>' +
                                '<div class="input-group account-top-nav-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#' + account_layout['top_nav_bgcolor'] + '" name="account_top_nav_bgcolor" id="account_top_nav_bgcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Font Color</div>' +
                                '<div class="input-group account-top-nav-font-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#' + account_layout['top_nav_fontcolor'] + '" name="account_top_nav_fontcolor" id="account_top_nav_fontcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<label class="sub-title">Logo</label>' +
                                '<div style="margin-top: 10px; margin-bottom: 5px; font-weight: normal;">Select Source</div>' +
                                '<div class="sub-options">';

                        if (account_layout['layout_logo_text'] == 1) {
                            account_layout_logo_image = false;
                            account_layout_logo_text = true;
                            content += '<div class="btn-group">' +
                                    '<button type="button" class="btn btn-default source-text"><span class="text">Custom Text</span></button>' +
                                    '<button aria-expanded="false" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                                    '<span class="caret"></span>' +
                                    '</button>' +
                                    '<ul class="dropdown-menu" id="logo-source" role="menu">' +
                                    '<li><a onclick="smhRS.custom_text_options();">Custom Text</a></li>' +
                                    '<li><a onclick="smhRS.custom_logo_options();">Image</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '<div id="logo-content">' +
                                    '<div style="margin-top: 10px; font-size: 11px; margin-bottom: 15px; font-weight: normal;"><i>Publisher/Company Name will be used.</i></div>' +
                                    '<div style="display: inline-block; margin-right: 10px; font-weight: normal; margin-bottom: 5px;">Font Size</div>' +
                                    '<div class="input-group col-xs-6">' +
                                    '<select id="account-logo-font-size" class="form-control">' +
                                    '<option value="1">1 px</option>' +
                                    '<option value="2">2 px</option>' +
                                    '<option value="3">3 px</option>' +
                                    '<option value="4">4 px</option>' +
                                    '<option value="5">5 px</option>' +
                                    '<option value="6">6 px</option>' +
                                    '<option value="7">7 px</option>' +
                                    '<option value="8">8 px</option>' +
                                    '<option value="9">9 px</option>' +
                                    '<option value="10">10 px</option>' +
                                    '<option value="11">11 px</option>' +
                                    '<option value="12">12 px</option>' +
                                    '<option value="13">13 px</option>' +
                                    '<option value="14">14 px</option>' +
                                    '<option value="15">15 px</option>' +
                                    '<option value="16">16 px</option>' +
                                    '<option value="17">17 px</option>' +
                                    '<option value="18">18 px</option>' +
                                    '<option value="19">19 px</option>' +
                                    '<option value="20">20 px</option>' +
                                    '<option value="21">21 px</option>' +
                                    '<option value="22">22 px</option>' +
                                    '<option value="23">23 px</option>' +
                                    '<option value="24">24 px</option>' +
                                    '<option value="25">25 px</option>' +
                                    '<option value="26">26 px</option>' +
                                    '<option value="27">27 px</option>' +
                                    '<option value="28">28 px</option>' +
                                    '<option value="29">29 px</option>' +
                                    '<option value="30">30 px</option>' +
                                    '</select>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>' +
                                    '</form>';
                        }
                        if (account_layout['layout_logo_image'] == 1) {
                            account_layout_logo_image = true;
                            account_layout_logo_text = false;
                            content += '<div class="btn-group">' +
                                    '<button type="button" class="btn btn-default source-text"><span class="text">Image</span></button>' +
                                    '<button aria-expanded="false" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                                    '<span class="caret"></span>' +
                                    '</button>' +
                                    '<ul class="dropdown-menu" id="logo-source" role="menu">' +
                                    '<li><a onclick="smhRS.custom_text_options();">Custom Text</a></li>' +
                                    '<li><a onclick="smhRS.custom_logo_options();">Image</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '<div id="logo-content">' +
                                    '<div style="margin-top: 10px; font-size: 11px; font-weight: normal;"><i>Select image from your content.</i></div>' +
                                    '<div class="form-group">' +
                                    '<div style="height: 10px;"></div>' +
                                    '<label class="control-sidebar-subheading">' +
                                    '<button type="button" id="account-select-image" class="btn btn-primary" onclick="smhRS.imageContent();">Select Image</button>' +
                                    '</label>' +
                                    '</div>' +
                                    '<div class="sub-title">Preview:</div>' +
                                    '<div id="account-logo-preview" style="font-weight: normal;"><img src="' + protocol + '//imgs.mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/thumbnail/entry_id/' + account_layout['layout_logoid'] + '/quality/100/type/1/width/129"></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>' +
                                    '</form>';
                        }
                    }

                    content += '</div>' +
                            '<div id="sidenav-tab" class="tab-pane">' +
                            '<form id="account-layout-sidenav-settings" role="form">' +
                            '<li>' +
                            '<div class="sub-title">Settings</div>' +
                            '<div style="height: 10px;"></div>' +
                            '<div class="sub-options">';

                    if (account_layout['layout_side_settings'] == 0) {
                        content += '<div class="btn-group" data-toggle="btn-toggle">' +
                                '<button onclick="smhRS.disableSideCustSetting();" type="button" id="account-side-default-btn" class="btn btn-default btn-sm active">Default</button>' +
                                '<button onclick="smhRS.enableSideCustSetting();" type="button" id="account-side-custom-btn" class="btn btn-default btn-sm">Custom</button>' +
                                '</div>' +
                                '<div id="account-side-nav-settings-text"><i>Use default settings.</i></div>' +
                                '</div>' +
                                '<div id="menu-nav-custom" style="display: block;">' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Background Color</div>' +
                                '<div class="input-group account-side-nav-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#222d32" name="account_side_nav_bgcolor" id="account_side_nav_bgcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Font Color</div>' +
                                '<div class="input-group account-side-nav-font-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#b8c7ce" name="account_side_nav_fontcolor" id="account_side_nav_fontcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Sub-Menu Background Color</div>' +
                                '<div class="input-group account-side-nav-submenu-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#2c3b41" name="account_side_nav_sub_bgcolor" id="account_side_nav_sub_bgcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Sub-Menu Font Color</div>' +
                                '<div class="input-group account-side-nav-submenu-font-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#8aa4af" name="account_side_nav_sub_fontcolor" id="account_side_nav_sub_fontcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '<div style="height: 10px;"></div>' +
                                '</div>' +
                                '</div>' +
                                '</li>' +
                                '</form>' +
                                '</div>' +
                                '</div>';
                    }
                    if (account_layout['layout_side_settings'] == 1) {
                        account_layout_side_settings = true;
                        content += '<div class="btn-group" data-toggle="btn-toggle">' +
                                '<button onclick="smhRS.disableSideCustSetting();" type="button" id="account-side-default-btn" class="btn btn-default btn-sm">Default</button>' +
                                '<button onclick="smhRS.enableSideCustSetting();" type="button" id="account-side-custom-btn" class="btn btn-default btn-sm active">Custom</button>' +
                                '</div>' +
                                '<div id="account-side-nav-settings-text"><i>Use custom settings.</i></div>' +
                                '</div>' +
                                '<div id="menu-nav-custom" style="display: block;">' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Background Color</div>' +
                                '<div class="input-group account-side-nav-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#' + account_layout['side_nav_bgcolor'] + '" name="account_side_nav_bgcolor" id="account_side_nav_bgcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Font Color</div>' +
                                '<div class="input-group account-side-nav-font-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#' + account_layout['side_nav_fontcolor'] + '" name="account_side_nav_fontcolor" id="account_side_nav_fontcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Sub-Menu Background Color</div>' +
                                '<div class="input-group account-side-nav-submenu-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#' + account_layout['side_nav_sub_bgcolor'] + '" name="account_side_nav_sub_bgcolor" id="account_side_nav_sub_bgcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="sub-options">' +
                                '<div class="sub-title">Sub-Menu Font Color</div>' +
                                '<div class="input-group account-side-nav-submenu-font-color colorpicker-element">' +
                                '<input type="text" class="form-control" value="#' + account_layout['side_nav_sub_fontcolorr'] + '" name="account_side_nav_sub_fontcolor" id="account_side_nav_sub_fontcolor">' +
                                '<span class="input-group-addon"><i></i></span>' +
                                '</div>' +
                                '<div style="height: 10px;"></div>' +
                                '</div>' +
                                '</div>' +
                                '</li>' +
                                '</form>' +
                                '</div>' +
                                '</div>';
                    }
                } else {
                    content = '<ul class="nav nav-tabs">' +
                            '<li class="active"><a data-toggle="tab" href="#topnav-tab">Top Navbar</a></li>' +
                            '<li><a data-toggle="tab" href="#sidenav-tab">Side Navbar</a></li>' +
                            '</ul>' +
                            '<div class="tab-content">' +
                            '<div id="topnav-tab" class="tab-pane active">' +
                            '<form id="account-layout-topnav-settings" role="form">' +
                            '<li>' +
                            '<div id="account-top-nav-custom">' +
                            '<div class="sub-title">Settings</div>' +
                            '<div style="height: 10px;"></div>' +
                            '<div class="sub-options">' +
                            '<div data-toggle="btn-toggle" class="btn-group">' +
                            '<button class="btn btn-default btn-sm active" type="button" id="account-top-default-btn" onclick="smhRS.disableTopCustSetting();">Default</button>' +
                            '<button class="btn btn-default btn-sm" type="button" id="account-top-custom-btn" onclick="smhRS.enableTopCustSetting();">Custom</button>' +
                            '</div>' +
                            '<div id="account-top-nav-settings-text"><i>Use default settings.</i></div>' +
                            '</div>' +
                            '<div class="sub-options">' +
                            '<div class="sub-title">Background Color</div>' +
                            '<div class="input-group account-top-nav-color colorpicker-element">' +
                            '<input type="text" class="form-control" value="#3c8dbc" name="account_top_nav_bgcolor" id="account_top_nav_bgcolor">' +
                            '<span class="input-group-addon"><i></i></span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="sub-options">' +
                            '<div class="sub-title">Font Color</div>' +
                            '<div class="input-group account-top-nav-font-color colorpicker-element">' +
                            '<input type="text" class="form-control" value="#ffffff" name="account_top_nav_fontcolor" id="account_top_nav_fontcolor">' +
                            '<span class="input-group-addon"><i></i></span>' +
                            '</div>' +
                            '</div>' +
                            '<label class="sub-title">Logo</label>' +
                            '<div style="margin-top: 10px; margin-bottom: 5px; font-weight: normal;">Select Source</div>' +
                            '<div class="sub-options">' +
                            '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default source-text"><span class="text">Custom Text</span></button>' +
                            '<button aria-expanded="false" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                            '<span class="caret"></span>' +
                            '</button>' +
                            '<ul class="dropdown-menu" id="logo-source" role="menu">' +
                            '<li><a onclick="smhRS.custom_text_options();">Custom Text</a></li>' +
                            '<li><a onclick="smhRS.custom_logo_options();">Image</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '<div id="logo-content">' +
                            '<div style="margin-top: 10px; font-size: 11px; margin-bottom: 15px; font-weight: normal;"><i>Publisher/Company Name will be used.</i></div>' +
                            '<div style="display: inline-block; margin-right: 10px; font-weight: normal; margin-bottom: 5px;">Font Size</div>' +
                            '<div class="input-group col-xs-6">' +
                            '<select id="account-logo-font-size" class="form-control">' +
                            '<option value="1">1 px</option>' +
                            '<option value="2">2 px</option>' +
                            '<option value="3">3 px</option>' +
                            '<option value="4">4 px</option>' +
                            '<option value="5">5 px</option>' +
                            '<option value="6">6 px</option>' +
                            '<option value="7">7 px</option>' +
                            '<option value="8">8 px</option>' +
                            '<option value="9">9 px</option>' +
                            '<option value="10">10 px</option>' +
                            '<option value="11">11 px</option>' +
                            '<option value="12">12 px</option>' +
                            '<option value="13">13 px</option>' +
                            '<option value="14">14 px</option>' +
                            '<option value="15">15 px</option>' +
                            '<option value="16">16 px</option>' +
                            '<option value="17">17 px</option>' +
                            '<option value="18">18 px</option>' +
                            '<option value="19">19 px</option>' +
                            '<option value="20" selected>20 px</option>' +
                            '<option value="21">21 px</option>' +
                            '<option value="22">22 px</option>' +
                            '<option value="23">23 px</option>' +
                            '<option value="24">24 px</option>' +
                            '<option value="25">25 px</option>' +
                            '<option value="26">26 px</option>' +
                            '<option value="27">27 px</option>' +
                            '<option value="28">28 px</option>' +
                            '<option value="29">29 px</option>' +
                            '<option value="30">30 px</option>' +
                            '</select>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</li>' +
                            '</form>' +
                            '</div>' +
                            '<div id="sidenav-tab" class="tab-pane">' +
                            '<form id="account-layout-sidenav-settings" role="form">' +
                            '<li>' +
                            '<div class="sub-title">Settings</div>' +
                            '<div style="height: 10px;"></div>' +
                            '<div class="sub-options">' +
                            '<div class="btn-group" data-toggle="btn-toggle">' +
                            '<button onclick="smhRS.disableSideCustSetting();" type="button" id="account-side-default-btn" class="btn btn-default btn-sm active">Default</button>' +
                            '<button onclick="smhRS.enableSideCustSetting();" type="button" id="account-side-custom-btn" class="btn btn-default btn-sm">Custom</button>' +
                            '</div>' +
                            '<div id="account-side-nav-settings-text"><i>Use default settings.</i></div>' +
                            '</div>' +
                            '<div id="menu-nav-custom" style="display: block;">' +
                            '<div class="sub-options">' +
                            '<div class="sub-title">Background Color</div>' +
                            '<div class="input-group account-side-nav-color colorpicker-element">' +
                            '<input type="text" class="form-control" value="#222d32" name="account_side_nav_bgcolor" id="account_side_nav_bgcolor">' +
                            '<span class="input-group-addon"><i></i></span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="sub-options">' +
                            '<div class="sub-title">Font Color</div>' +
                            '<div class="input-group account-side-nav-font-color colorpicker-element">' +
                            '<input type="text" class="form-control" value="#b8c7ce" name="account_side_nav_fontcolor" id="account_side_nav_fontcolor">' +
                            '<span class="input-group-addon"><i></i></span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="sub-options">' +
                            '<div class="sub-title">Sub-Menu Background Color</div>' +
                            '<div class="input-group account-side-nav-submenu-color colorpicker-element">' +
                            '<input type="text" class="form-control" value="#2c3b41" name="account_side_nav_sub_bgcolor" id="account_side_nav_sub_bgcolor">' +
                            '<span class="input-group-addon"><i></i></span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="sub-options">' +
                            '<div class="sub-title">Sub-Menu Font Color</div>' +
                            '<div class="input-group account-side-nav-submenu-font-color colorpicker-element">' +
                            '<input type="text" class="form-control" value="#8aa4af" name="account_side_nav_sub_fontcolor" id="account_side_nav_sub_fontcolor">' +
                            '<span class="input-group-addon"><i></i></span>' +
                            '</div>' +
                            '<div style="height: 10px;"></div>' +
                            '</div>' +
                            '</div>' +
                            '</li>' +
                            '</form>' +
                            '</div>' +
                            '</div>';
                }

                $('#smh-modal .modal-body').html(content);

                //Top nav background color
                $('.account-top-nav-color').colorpicker({
                    format: 'hex'
                });

                //Top nav font color
                $('.account-top-nav-font-color').colorpicker({
                    format: 'hex'
                });

                //Side nav background color
                $('.account-side-nav-color').colorpicker({
                    format: 'hex'
                });

                //Side nav font color
                $('.account-side-nav-font-color').colorpicker({
                    format: 'hex'
                });

                //Side sub-menu background color
                $('.account-side-nav-submenu-color').colorpicker({
                    format: 'hex'
                });

                //Side sub-menu font color
                $('.account-side-nav-submenu-font-color').colorpicker({
                    format: 'hex'
                });

                $("#account-layout-topnav-settings #logo-source li a").click(function () {
                    var selText = $(this).text();
                    $(this).parents('.sub-options').find('.source-text').html('<span class="text">' + selText + '</span>');
                });

                $('.btn-group[data-toggle="btn-toggle"]').each(function () {
                    var group = $(this);
                    $(this).find(".btn").on('click', function (e) {
                        group.find(".btn.active").removeClass("active");
                        $(this).addClass("active");
                        e.preventDefault();
                    });
                });

                if (account_layout) {
                    if (account_layout['layout_logo_text'] == 1) {
                        $('#account-logo-font-size').val(account_layout['logo_font_size']);
                    }
                    if (account_layout['layout_top_settings'] == 0) {
                        smhRS.disableTopCustSetting();
                    }

                    if (account_layout['layout_side_settings'] == 0) {
                        smhRS.disableSideCustSetting();
                    }
                } else {
                    smhRS.disableTopCustSetting();
                    smhRS.disableSideCustSetting();
                }
            }
        });
    },
    //Display Custom text options
    custom_text_options: function () {
        account_layout_logo_image = false;
        account_layout_logo_text = true;
        var cust_text = '<div style="margin-top: 10px; font-size: 11px; margin-bottom: 15px; font-weight: normal;"><i>Publisher/Company Name will be used.</i></div>' +
                '<div style="display: inline-block; margin-right: 10px; font-weight: normal; margin-bottom: 5px;">Font Size</div>' +
                '<div class="input-group col-xs-6">' +
                '<select class="form-control" id="account-logo-font-size">' +
                '<option value="1">1 px</option>' +
                '<option value="2">2 px</option>' +
                '<option value="3">3 px</option>' +
                '<option value="4">4 px</option>' +
                '<option value="5">5 px</option>' +
                '<option value="6">6 px</option>' +
                '<option value="7">7 px</option>' +
                '<option value="8">8 px</option>' +
                '<option value="9">9 px</option>' +
                '<option value="10">10 px</option>' +
                '<option value="11">11 px</option>' +
                '<option value="12">12 px</option>' +
                '<option value="13">13 px</option>' +
                '<option value="14">14 px</option>' +
                '<option value="15">15 px</option>' +
                '<option value="16">16 px</option>' +
                '<option value="17">17 px</option>' +
                '<option value="18">18 px</option>' +
                '<option value="19">19 px</option>' +
                '<option value="20" selected>20 px</option>' +
                '<option value="21">21 px</option>' +
                '<option value="22">22 px</option>' +
                '<option value="23">23 px</option>' +
                '<option value="24">24 px</option>' +
                '<option value="25">25 px</option>' +
                '<option value="26">26 px</option>' +
                '<option value="27">27 px</option>' +
                '<option value="28">28 px</option>' +
                '<option value="29">29 px</option>' +
                '<option value="30">30 px</option>' +
                '</select>' +
                '</div>';
        $('#account-layout-topnav-settings #logo-content').html(cust_text);
    },
    //Display Custom Logo options
    custom_logo_options: function () {
        account_layout_logo_image = true;
        account_layout_logo_text = false;
        var custom_image = '<div style="margin-top: 10px; font-size: 11px; font-weight: normal;"><i>Select image from your content.</i></div>' +
                '<div class="form-group">' +
                '<div style="height: 10px;"></div>' +
                '<label class="control-sidebar-subheading">' +
                '<button type="button" id="account-select-image" class="btn btn-primary" onclick="smhRS.imageContent();">Select Image</button>' +
                '</label>' +
                '</div>' +
                '<div class="sub-title">Preview:</div>' +
                '<div id="account-logo-preview" style="font-weight: normal;">None</div>';
        $('#account-layout-topnav-settings #logo-content').html(custom_image);
    },
    //Display image content modal
    imageContent: function () {
        smhRS.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '666px');
        $('#smh-modal2 .modal-body').css('padding', '15px 15px 0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select Image</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div id="image-content-wrapper">' +
                '<div id="images-table"></div>' +
                '</div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="image-select-result"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="image-select" onclick="smhRS.selectLogoImage();">Select</button>';
        $('#smh-modal2 .modal-footer').html(footer);
        smhRS.loadImages();

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');
    },
    //Gets Images data
    loadImages: function () {
        $('#smh-modal2 #images-table').empty();
        $('#smh-modal2 #images-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="images-data"></table>');
        accountImagesTable = $('#smh-modal2 #images-data').DataTable({
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
                "data": function (d) {
                    return $.extend({}, d, {
                        "ks": sessInfo.ks
                    });
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
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 5, 4);
                var rows = this.fnGetData();
                if (rows.length === 0) {
                    $('#smh-modal2 #image-select').attr('disabled', '');
                }
            }
        });
    },
    //Selects Logo Image
    selectLogoImage: function () {
        var radio_value = '';
        var rowcollection = accountImagesTable.$(".logoimage:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            radio_value = $(elem).val();
        });

        if (radio_value == '') {
            $('#smh-modal2 #image-select-result').html('<span class="label label-danger">You must select an image!</span>');
            setTimeout(function () {
                $('#smh-modal2 #image-select-result').empty();
            }, 3000);
        } else {
            account_layout_logo_id = radio_value;
            $('#smh-modal #account-logo-preview').html('<img src="' + protocol + '//imgs.mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/thumbnail/entry_id/' + radio_value + '/quality/100/type/1/width/129">');
            $('#smh-modal2').modal('hide');
            $('#smh-modal').css('z-index', '');
        }
    },
    //Disables top menu custom settings
    disableTopCustSetting: function () {
        account_layout_top_settings = false;
        //        account_layout_side_edit = false;
        $('#account-top-nav-settings-text').html('<i>Use default settings.</i>');
        smhRS.custom_text_options();
        account_layout_logo_text = false;
        $('.account-top-nav-color').colorpicker('setValue', '#3c8dbc');
        $('.account-top-nav-color').colorpicker('disable');
        $('.account-top-nav-font-color').colorpicker('setValue', '#ffffff');
        $('.account-top-nav-font-color').colorpicker('disable');
        $("#account-layout-topnav-settings #logo-source li a").parents('.sub-options').find('.source-text').html('<span class="text">Custom Text</span>');
        $('#account-top-nav-custom .source-text').prop('disabled', true);
        $('#account-top-nav-custom .source-text').removeClass('btn-default');
        $('#account-top-nav-custom .source-text').addClass('btn-disabled');
        $('#account-top-nav-custom .dropdown-toggle').prop('disabled', true);
        $('#account-top-nav-custom .dropdown-toggle').removeClass('btn-default');
        $('#account-top-nav-custom .dropdown-toggle').addClass('btn-disabled');
        $('#account-top-nav-custom #account-logo-font-size').prop('disabled', true);
    },
    //Enables top menu custom settings
    enableTopCustSetting: function () {
        account_layout_top_settings = true;
        account_layout_logo_text = true;
        $('#account-top-nav-settings-text').html('<i>Use custom settings.</i>');
        $('.account-top-nav-color').colorpicker('enable');
        $('.account-top-nav-font-color').colorpicker('enable');
        $('#account-top-nav-custom .source-text').prop('disabled', false);
        $('#account-top-nav-custom .source-text').removeClass('btn-disabled');
        $('#account-top-nav-custom .source-text').addClass('btn-default');
        $('#account-top-nav-custom .dropdown-toggle').prop('disabled', false);
        $('#account-top-nav-custom .dropdown-toggle').removeClass('btn-disabled');
        $('#account-top-nav-custom .dropdown-toggle').addClass('btn-default');
        $('#account-top-nav-custom #account-logo-font-size').prop('disabled', false);
    },
    //Disables side menu custom settings
    disableSideCustSetting: function () {
        account_layout_side_settings = false;
        $('#account-side-nav-settings-text').html('<i>Use default settings.</i>');
        $('.account-side-nav-color').colorpicker('setValue', '#222d32');
        $('.account-side-nav-color').colorpicker('disable');
        $('.account-side-nav-font-color').colorpicker('setValue', '#b8c7ce');
        $('.account-side-nav-font-color').colorpicker('disable');
        $('.account-side-nav-submenu-color').colorpicker('setValue', '#2c3b41');
        $('.account-side-nav-submenu-color').colorpicker('disable');
        $('.account-side-nav-submenu-font-color').colorpicker('setValue', '#8aa4af');
        $('.account-side-nav-submenu-font-color').colorpicker('disable');
    },
    //Enables side menu custom settings
    enableSideCustSetting: function () {
        account_layout_side_settings = true;
        $('#account-side-nav-settings-text').html('<i>Use custom settings.</i>');
        $('.account-side-nav-color').colorpicker('enable');
        $('.account-side-nav-font-color').colorpicker('enable');
        $('.account-side-nav-submenu-color').colorpicker('enable');
        $('.account-side-nav-submenu-font-color').colorpicker('enable');
    },
    //Save User Layout Configuration
    saveAcntLayout: function (trans_service, ppv_service, mem_service, vc_service, wl_service, efwl_service, cl_service, pid) {
        var top_nav_bgcolor = -1;
        var top_nav_fontcolor = -1;
        var logo_font_size = -1;
        var side_nav_fontcolor = -1;
        var side_nav_bgcolor = -1;
        var side_nav_sub_bgcolor = -1;
        var side_nav_sub_fontcolor = -1;
        var layout_logoid = -1;

        if (account_layout_top_settings) {
            top_nav_bgcolor = smhMain.removeHash($('#account-layout-topnav-settings #account_top_nav_bgcolor').val());
            top_nav_fontcolor = smhMain.removeHash($('#account-layout-topnav-settings #account_top_nav_fontcolor').val());
            if (account_layout_logo_text) {
                logo_font_size = $('#account-layout-topnav-settings #account-logo-font-size').val();
            }
            if (account_layout_logo_image) {
                layout_logoid = account_layout_logo_id;
            }
        }

        if (account_layout_side_settings) {
            side_nav_bgcolor = smhMain.removeHash($('#account-layout-sidenav-settings #account_side_nav_bgcolor').val());
            side_nav_fontcolor = smhMain.removeHash($('#account-layout-sidenav-settings #account_side_nav_fontcolor').val());
            side_nav_sub_bgcolor = smhMain.removeHash($('#account-layout-sidenav-settings #account_side_nav_sub_bgcolor').val());
            side_nav_sub_fontcolor = smhMain.removeHash($('#account-layout-sidenav-settings #account_side_nav_sub_fontcolor').val());
        }

        var reqUrl = '/api/v1/updateResellerLayout';
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            action: "update_layout",
            pid: pid,
            layout_top_settings: account_layout_top_settings,
            top_nav_bgcolor: top_nav_bgcolor,
            top_nav_fontcolor: top_nav_fontcolor,
            layout_logo_image: account_layout_logo_image,
            layout_logoid: layout_logoid,
            layout_logo_text: account_layout_logo_text,
            logo_font_size: logo_font_size,
            layout_side_settings: account_layout_side_settings,
            side_nav_bgcolor: side_nav_bgcolor,
            side_nav_fontcolor: side_nav_fontcolor,
            side_nav_sub_bgcolor: side_nav_sub_bgcolor,
            side_nav_sub_fontcolor: side_nav_sub_fontcolor
        }

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'POST',
            data: sessData,
            beforeSend: function () {
                $('#save-account-layout').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                var data = $.parseJSON(data);
                if (data['success']) {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #layout-result').html('<span class="label label-success">Successfully Saved!</span>');
                    setTimeout(function () {
                        $('#smh-modal #layout-result').empty();
                        $('#save-account-layout').removeAttr('disabled');
                        smhRS.editServices(trans_service, ppv_service, mem_service, vc_service, wl_service, efwl_service, cl_service, pid, false);
                    }, 2000);
                }
            }
        });
    },
    //Reset Modal
    resetModal: function () {
        $('#smh-modal2 .modal-header').empty();
        $('#smh-modal2 .modal-body').empty();
        $('#smh-modal2 .modal-footer').empty();
        $('#smh-modal2 .modal-content').css('min-height', '');
        $('#smh-modal2 .smh-dialog2').css('width', '');
        $('#smh-modal2 .modal-body').css('height', '');
        $('#smh-modal2 .modal-body').css('padding', '15px');
    },
    //Save user services
    saveServices: function (pid, ca) {
        var mb_service = 1;
        var trans_service = 0;
        var ppv_service = 0;
        var mem_service = 0;
        var vc_service = 0;
        var wl_service = 0;
        var efwl_service = 0;
        var cl_service = 0;
        if (services.trans_vod) {
            trans_service = ($('#service-table #trans-service').prop('checked')) ? 1 : 0;
        }
        if (services.ppv) {
            ppv_service = ($('#service-table #ppv-service').prop('checked')) ? 1 : 0;
        }
        if (services.mem) {
            mem_service = ($('#service-table #mem-service').prop('checked')) ? 1 : 0;
        }
        if (services.vc) {
            vc_service = ($('#service-table #vc-service').prop('checked')) ? 1 : 0;
        }
        if (services.wl) {
            wl_service = ($('#service-table #wl-service').prop('checked')) ? 1 : 0;
            efwl_service = ($('#service-table #efwl-service').prop('checked')) ? 1 : 0;
            cl_service = ($('#service-table #cl-service').prop('checked')) ? 1 : 0;
        }

        var reqUrl = '/api/v1/updateUserServices';
        var sessData = {
            _token: $('meta[name="csrf-token"]').attr('content'),
            pid: pid,
            streaming_mobile: mb_service,
            transcoding_vod: trans_service,
            pay_per_view: ppv_service,
            membership: mem_service,
            streaming_live_chat: vc_service,
            white_label: wl_service,
            force_parent_layout: efwl_service,
            use_custom_layout: cl_service
        }

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'POST',
            data: sessData,
            beforeSend: function () {
                $('#save-services').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                var data = $.parseJSON(data);
                if (data['success']) {
                    $('#smh-modal #loading').empty();
                    $('#pass-result').html('<span class="label label-success">Successfully Saved!</span>');
                    smhRS.getResellerAccounts();
                    setTimeout(function () {
                        $('#pass-result').empty();
                        $('#save-services').removeAttr('disabled');
                        if (ca) {
                            smhRS.editLimits(pid, 1, 1);
                        }
                    }, 3000);
                }
            }
        });

    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_reseller_metadata';
        }
    },
    getStats: function (cpid) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '530px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close account-edit-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Streaming Statistics</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="margin-left: auto; margin-right: auto; width: 383px; margin-bottom: 80px;">' +
                '<div style="margin-left: auto; margin-right: auto; width: 277px;">Export streaming statistics for account <b>' + cpid + '</b></div>' +
                '<div class="date-range-sub" style="width: 207px;">' +
                '<span id="custom-dates">' +
                '<span id="dates-title">Dates: </span>' +
                '<div class="input-group">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker1 form-control" id="date-picker-1" style="position: relative; z-index: 3000; width: 105px;">' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="date-range-sub" style="width: 175px;">' +
                '<span id="custom-dates">' +
                '<span id="dates-title">To </span>' +
                '<div class="input-group" style="margin-left: 15px;">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker2 form-control" id="date-picker-2" style="position: relative; z-index: 3000; width: 105px;">' +
                '</div>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>';
        $('#smh-modal .modal-body').html(content);

        $(".date-picker1").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $(".date-picker2").datepicker({
            dateFormat: "yy-mm-dd"
        });

        var days = 30;
        var from_calendar = Date.today().addDays(-days).toString("yyyy-MM-dd");
        var to_calendar = Date.today().toString("yyyy-MM-dd");

        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default account-edit-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="export-child-stats" onclick="smhRS.exportChildStats(' + cpid + ')">Export</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    exportChildStats: function (cpid) {
        var date1 = $('#date-picker-1').val();
        var date2 = $('#date-picker-2').val();
        $('#smh-modal #export-child-stats').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        window.location = '/apps/stats/v1.0/index.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&cpid=' + cpid + '&start_date=' + date1 + '&end_date=' + date2 + '&action=get_child_stats';
        setTimeout(function () {
            $('#smh-modal #loading img').css('display', 'none');
            $('#smh-modal #export-child-stats').removeAttr('disabled');
        }, 1000);
    },
    exportAllStats: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '530px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close account-edit-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Streaming Statistics</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="margin-left: auto; margin-right: auto; width: 383px; margin-bottom: 80px;">' +
                '<div style="margin-left: auto; margin-right: auto; width: 292px;">Export streaming statistics for all child accounts</div>' +
                '<div class="date-range-sub" style="width: 207px;">' +
                '<span id="custom-dates">' +
                '<span id="dates-title">Dates: </span>' +
                '<div class="input-group">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker1 form-control" id="date-picker-1" style="position: relative; z-index: 3000; width: 105px;">' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="date-range-sub" style="width: 175px;">' +
                '<span id="custom-dates">' +
                '<span id="dates-title">To </span>' +
                '<div class="input-group" style="margin-left: 15px;">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker2 form-control" id="date-picker-2" style="position: relative; z-index: 3000; width: 105px;">' +
                '</div>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>';
        $('#smh-modal .modal-body').html(content);

        $(".date-picker1").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $(".date-picker2").datepicker({
            dateFormat: "yy-mm-dd"
        });

        var days = 30;
        var from_calendar = Date.today().addDays(-days).toString("yyyy-MM-dd");
        var to_calendar = Date.today().toString("yyyy-MM-dd");

        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default account-edit-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="export-all-child-stats" onclick="smhRS.exportAllChildStats()">Export</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    exportAllChildStats: function () {
        var date1 = $('#date-picker-1').val();
        var date2 = $('#date-picker-2').val();
        $('#smh-modal #export-all-child-stats').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        window.location = '/apps/stats/v1.0/index.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&start_date=' + date1 + '&end_date=' + date2 + '&action=get_all_child_stats';
        setTimeout(function () {
            $('#smh-modal #loading img').css('display', 'none');
            $('#smh-modal #export-all-child-stats').removeAttr('disabled');
        }, 1000);
    },
    //Register actions
    registerActions: function () {
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
        });

        $('#smh-modal').on('click', '.account-create-close', function () {
            $('#account-create-form input').tooltipster('destroy');
        });

        $('#smh-modal').on('click', '.account-edit-close', function () {
            $('#account-edit-form input').tooltipster('destroy');
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhRS = new Reseller();
    smhRS.getResellerAccounts();
    smhRS.registerActions();
});
