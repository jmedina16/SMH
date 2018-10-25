/*
 *
 *	Streaming Media Hosting
 *	
 *	LiveStreams
 *
 *	9-15-2015
 */
//Main constructor
function SocialNetwork() {}

//Global variables
var ApiUrl = "/apps/sn/v1.0/dev.php?";
var yt_auth_redirect_url = null;
var fb_auth_redirect_url = null;
var twtr_auth_redirect_url = null;
var twch_auth_redirect_url = null;
var pop_up_timer;
var status_timer;
var yt_is_verified = false;
var yt_ls_enabled = false;
var yt_authorized = false;
var yt_embed = false;
var fb_authorized = false;
var twtr_authorized = false;
var twch_authorized = false;

//Login prototype/class
SocialNetwork.prototype = {
    constructor: SocialNetwork,
    //Build tickets table
    getSnConfig: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            projection: '360'
        }

        var reqUrl = ApiUrl + 'action=get_sn_config';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                $.each(data['platforms'], function (key, value) {
                    if (value['platform'] == 'youtube_live') {
                        if (value['authorized']) {
                            $('#yt-table .sn-settings').css('width', '160px');
                            $('#yt-table #sn-resync').css('display', 'block');
                            yt_authorized = true;
                            $('#yt-status').html('<div class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#yt-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['channel_details']['channel_thumb'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['channel_details']['channel_title'] + '</div><div id="account-button"><button id="yt-auth" class="btn btn-yt" type="button" onclick="smhSN.confirm_remove_youtube_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            smhSN.displayYtSettings(value['auto_upload']);
                        } else {
                            $('#yt-table .sn-settings').css('width', '95px');
                            $('#yt-table #sn-resync').css('display', 'none');
                            yt_authorized = false;
                            yt_auth_redirect_url = value['redirect_url'];
                            $('#yt-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#yt-account').html('<button id="yt-auth" class="btn btn-primary" type="button" onclick="smhSN.youtube_auth_button();">Connect Account</button>');
                        }
                        if (value['is_verified']) {
                            yt_is_verified = true;
                        } else {
                            yt_is_verified = false;
                        }
                        if (value['ls_enabled']) {
                            yt_ls_enabled = true;
                        } else {
                            yt_ls_enabled = false;
                        }
                        if (value['embed_status']) {
                            yt_embed = true;
                        } else {
                            yt_embed = false;
                        }
                        if (yt_authorized && yt_is_verified && !yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'block');
                            $('#yt-integration-warning').html('<i class="fa fa-warning"></i> <a onclick="smhSN.yt_ls_not_enabled();">Live stream not enabled <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>');
                        } else if (yt_authorized && !yt_is_verified && yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'block');
                            $('#yt-integration-warning').html('<i class="fa fa-warning"></i> <a onclick="smhSN.yt_not_verified();">Channel not verified <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>');
                        } else if (yt_authorized && !yt_is_verified && !yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'block');
                            $('#yt-integration-warning').html('<i class="fa fa-warning"></i> <a onclick="smhSN.yt_ls_verified_not_avail();">Integration not complete <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>');
                        } else if (!yt_authorized && !yt_is_verified && !yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'none');
                            $('#yt-integration-warning').html('');
                        }
                    }
                    if (value['platform'] == 'facebook_live') {
                        if (value['authorized']) {
                            $('#fb-table .sn-settings').css('width', '160px');
                            $('#fb-table #sn-resync').css('display', 'block');
                            fb_authorized = true;
                            $('#fb-status').html('<div class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#fb-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['user_details']['user_thumb'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['user_details']['user_name'] + '</div><div id="account-button"><button id="fb-auth" class="btn btn-fb" type="button" onclick="smhSN.confirm_remove_facebook_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            smhSN.displayFbSettings(value['publish_to'], value['settings']);
                        } else {
                            $('#fb-table .sn-settings').css('width', '95px');
                            $('#fb-table #sn-resync').css('display', 'none');
                            fb_authorized = false;
                            fb_auth_redirect_url = value['redirect_url'];
                            $('#fb-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#fb-account').html('<button id="fb-auth" class="btn btn-primary" type="button" onclick="smhSN.facebook_auth_button();">Connect Account</button>');
                        }
                    }
                    if (value['platform'] == 'twitch') {
                        if (value['authorized']) {
                            $('#twch-table .sn-settings').css('width', '160px');
                            $('#twch-table #sn-resync').css('display', 'block');
                            twch_authorized = true;
                            $('#twch-status').html('<div class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#twch-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['channel_details']['channel_logo'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['channel_details']['channel_name'] + '</div><div id="account-button"><button id="twch-auth" class="btn btn-twch" type="button" onclick="smhSN.confirm_remove_twitch_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            smhSN.displayTwchSettings(value['settings']['auto_upload']);
                        } else {
                            $('#twch-table .sn-settings').css('width', '95px');
                            $('#twch-table #sn-resync').css('display', 'none');
                            twch_authorized = false;
                            twch_auth_redirect_url = value['redirect_url'];
                            $('#twch-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#twch-account').html('<button id="twch-auth" class="btn btn-primary" type="button" onclick="smhSN.twitch_auth_button();">Connect Account</button>');
                        }
                    }
                    if (value['platform'] == 'twitter') {
                        if (value['authorized']) {
                            $('#twtr-table .sn-settings').css('width', '160px');
                            $('#twtr-table #sn-resync').css('display', 'block');
                            twtr_authorized = true;
                            $('#twtr-status').html('<div class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#twtr-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['channel_details']['channel_logo'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['channel_details']['channel_name'] + '</div><div id="account-button"><button id="twtr-auth" class="btn btn-twtr" type="button" onclick="smhSN.confirm_remove_twitter_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            smhSN.displayTwchSettings(value['settings']['auto_upload']);
                        } else {
                            $('#twtr-table .sn-settings').css('width', '95px');
                            $('#twtr-table #sn-resync').css('display', 'none');
                            twtr_authorized = false;
                            twtr_auth_redirect_url = value['redirect_url'];
                            $('#twtr-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#twtr-account').html('<span style="color: #808080; font-weight: bold;">Coming Soon</span>');
                        }
                    }
                });
            }
        });
    },
    displayTwchSettings: function (auto_upload_status) {
        var auto_upload = '';
        if (auto_upload_status) {
            var upload_checked = (auto_upload_status == 1) ? 'checked' : '';
            auto_upload += '<div class="checkbox"><label class="pluginLabel"><input id="twch_auto_upload" style="margin-right: 5px" type="checkbox" ' + upload_checked + '>Auto Upload My VOD Content <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Automatically upload videos to your Twitch channel as soon as they\'ve finished uploading to the Platform." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
        } else {
            auto_upload += '<div class="checkbox"><label class="pluginLabel"><input id="twch_auto_upload" style="margin-right: 5px" type="checkbox">Auto Upload My VOD Content <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Automatically upload videos to your Twitch channel as soon as they\'ve finished uploading to the Platform." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
        }
        $('#twch-auto-upload-wrapper').html(auto_upload);
    },
    displayYtSettings: function (auto_upload_status) {
        var auto_upload = '';
        if (auto_upload_status) {
            var upload_checked = (auto_upload_status == 1) ? 'checked' : '';
            auto_upload += '<div class="checkbox"><label class="pluginLabel"><input id="yt_auto_upload" style="margin-right: 5px" type="checkbox" ' + upload_checked + '>Auto Upload My VOD Content <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Automatically upload videos to your YouTube channel as soon as they\'ve finished uploading to the Platform." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
        } else {
            auto_upload += '<div class="checkbox"><label class="pluginLabel"><input id="yt_auto_upload" style="margin-right: 5px" type="checkbox">Auto Upload My VOD Content <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Automatically upload videos to your YouTube channel as soon as they\'ve finished uploading to the Platform." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
        }
        $('#yt-auto-upload-wrapper').html(auto_upload);
    },
    displayFbSettings: function (publish_to_arr, settings_arr) {
        var publish_to_display = '';
        var publish_to_li = '';
        var privacy_display = '';
        var privacy_li = '';
        var fb_ls_vod = '';
        var auto_up = '';
        var cont_stream = '';
        var personal_profile = false;
        var pages = false;
        var groups = false;
        var events = false;
        if (settings_arr) {
            $('#fb-integration-warning').css('display', 'none');
            $('#settings-warning').css('display', 'none');
            var asset_id = settings_arr[0]['asset_id'];
            var type = settings_arr[0]['publish_to'];
            var privacy_id = settings_arr[0]['privacy'];
            var ls_vod = settings_arr[0]['create_vod'];
            var cont_streaming = settings_arr[0]['cont_streaming'];
            var auto_upload = settings_arr[0]['auto_upload'];
            $.each(publish_to_arr, function (index, value) {
                if ((asset_id === value['id']) && (type == value['type'])) {
                    publish_to_display += '<span id="publish-to" data-value="' + value['type'] + ':' + value['id'] + '">' + value['name'] + '</span> <span class="caret"></span>';
                }
                if ((value['type'] === 1) && !personal_profile) {
                    publish_to_li += '<h4 class="dropdown-header">Personal Profile</h4>';
                    personal_profile = true;
                } else if ((value['type'] === 2) && !pages) {
                    publish_to_li += '<h4 class="dropdown-header">Pages You Manage</h4>';
                    pages = true;
                } else if ((value['type'] === 3) && !groups) {
                    publish_to_li += '<h4 class="dropdown-header">Groups You Manage</h4>';
                    groups = true;
                } else if ((value['type'] === 4) && !events) {
                    publish_to_li += '<h4 class="dropdown-header">Events You Manage</h4>';
                    events = true;
                }
                publish_to_li += '<li><a onclick="smhSN.stClicked(' + value['type'] + ',' + value['id'] + ',\'' + value['name'] + '\')">' + value['name'] + '</a></li>';
            });

            if (privacy_id == 1) {
                privacy_display += '<span id="privacy" data-value="1"><i class="fa fa-globe"></i> Public</span> <span class="caret"></span>';
            } else if (privacy_id == 2) {
                privacy_display += '<span id="privacy" data-value="2"><i class="fa fa-users"></i> Friends</span> <span class="caret"></span>';
            } else {
                privacy_display += '<span id="privacy" data-value="3"><i class="fa fa-lock"></i> Only Me</span> <span class="caret"></span>';
            }

            privacy_li += '<li><a onclick="smhSN.pClicked(1)"><i class="fa fa-globe"></i> Public</a></li>' +
                    '<li><a onclick="smhSN.pClicked(2)"><i class="fa fa-users"></i> Friends</a></li>' +
                    '<li><a onclick="smhSN.pClicked(3)"><i class="fa fa-lock"></i> Only Me</a></li>';

            var ls_vod_checked = (ls_vod == 1) ? 'checked' : '';
            fb_ls_vod += '<div class="checkbox"><label class="pluginLabel"><input id="fb_ls_vod" style="margin-right: 5px" type="checkbox" ' + ls_vod_checked + '>Create Facebook VOD <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Create a Facebook VOD once the broadcast is over." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';

            var cont_checked = (cont_streaming == 1) ? 'checked' : '';
            cont_stream += '<div class="checkbox"><label class="pluginLabel"><input id="fb_cont_stream" style="margin-right: 5px" type="checkbox" ' + cont_checked + '>Continuous Streaming <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Removes the 4 hour time limit for streaming. Does not create a Facebook VOD nor trigger notifications." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';

            var auto_upload_checked = (auto_upload == 1) ? 'checked' : '';
            auto_up += '<div class="checkbox"><label class="pluginLabel"><input id="fb_auto_upload" style="margin-right: 5px" type="checkbox" ' + auto_upload_checked + '>Auto Upload My VOD Content <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Automatically upload videos to your Facebook account as soon as they\'ve finished uploading to the Platform." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
        } else {
            $('#fb-save').attr('disabled', '');
            $('#fb-integration-warning').css('display', 'block');
            $('#settings-warning').css('display', 'block');
            publish_to_display += '<span id="publish-to">-- Select Option --</span> <span class="caret"></span>';
            $.each(publish_to_arr, function (index, value) {
                if ((value['type'] === 1) && !personal_profile) {
                    publish_to_li += '<h4 class="dropdown-header">Personal Profile</h4>';
                    personal_profile = true;
                } else if ((value['type'] === 2) && !pages) {
                    publish_to_li += '<h4 class="dropdown-header">Pages You Manage</h4>';
                    pages = true;
                } else if ((value['type'] === 3) && !groups) {
                    publish_to_li += '<h4 class="dropdown-header">Groups You Manage</h4>';
                    groups = true;
                } else if ((value['type'] === 4) && !events) {
                    publish_to_li += '<h4 class="dropdown-header">Events You Manage</h4>';
                    events = true;
                }
                publish_to_li += '<li><a onclick="smhSN.stClicked(' + value['type'] + ',' + value['id'] + ',\'' + value['name'] + '\')">' + value['name'] + '</a></li>';
            });

            privacy_display += '<span id="privacy" data-value="1"><i class="fa fa-globe"></i> Public</span> <span class="caret"></span>';
            privacy_li += '<li><a onclick="smhSN.pClicked(1)"><i class="fa fa-globe"></i> Public</a></li>' +
                    '<li><a onclick="smhSN.pClicked(2)"><i class="fa fa-users"></i> Friends</a></li>' +
                    '<li><a onclick="smhSN.pClicked(3)"><i class="fa fa-lock"></i> Only Me</a></li>';

            fb_ls_vod += '<div class="checkbox"><label class="pluginLabel"><input id="fb_ls_vod" style="margin-right: 5px" type="checkbox">Create Facebook VOD <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Create a Facebook VOD once the broadcast is over." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
            cont_stream += '<div class="checkbox"><label class="pluginLabel"><input id="fb_cont_stream" style="margin-right: 5px" type="checkbox">Continuous Streaming <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Removes the 4 hour time limit for streaming. Does not create a Facebook VOD nor trigger notifications." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
            auto_up += '<div class="checkbox"><label class="pluginLabel"><input id="fb_auto_upload" style="margin-right: 5px" type="checkbox">Auto Upload My VOD Content <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Automatically upload videos to your Facebook account as soon as they\'ve finished uploading to the Platform." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i></label></div>';
        }

        var publish_to = '<div class="dropdown">' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                publish_to_display +
                '</button>' +
                '<div class="clear"></div>' +
                '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                publish_to_li +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
        $('#publish-to-wrapper').html(publish_to);

        var privacy = '<div class="dropdown">' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                privacy_display +
                '</button>' +
                '<div class="clear"></div>' +
                '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                privacy_li +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
        $('#privacy-wrapper').html(privacy);
        $('#ls-vod-wrapper').html(fb_ls_vod);
        $('#cont-streaming-wrapper').html(cont_stream);
        $('#vod-wrapper').html(auto_up);

        if ($('#fb_ls_vod').prop('checked')) {
            $('#fb_cont_stream').attr('disabled', '');
        } else if ($('#fb_cont_stream').prop('checked')) {
            $('#fb_ls_vod').attr('disabled', '');
        }

        $('#publish-to-wrapper .dropdown-menu').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    stClicked: function (type, id, name) {
        $('#fb-save').removeAttr('disabled');
        $('#publish-to-wrapper #publish-to').text(name);
        $('#publish-to-wrapper #publish-to').attr('data-value', type + ':' + id);
    },
    pClicked: function (id) {
        if (id == 1) {
            $('#privacy-wrapper #privacy').html('<i class="fa fa-globe"></i> Public');
        } else if (id == 2) {
            $('#privacy-wrapper #privacy').html('<i class="fa fa-users"></i> Friends');
        } else {
            $('#privacy-wrapper #privacy').html('<i class="fa fa-lock"></i> Only Me');
        }
        $('#privacy-wrapper #privacy').attr('data-value', id);
    },
    toggle_yt_settings: function () {
        $('.yt-setting-row').toggle();
        if (!yt_authorized) {
            $('#yt-account-settings').css('display', 'none');
        }
    },
    toggle_fb_settings: function () {
        $('.fb-setting-row').toggle();
        if (!fb_authorized) {
            $('#fb-account-settings').css('display', 'none');
        }
    },
    toggle_twtr_settings: function () {
        $('.twtr-setting-row').toggle();
        if (!twtr_authorized) {
            $('#twtr-account-settings').css('display', 'none');
        }
    },
    toggle_twch_settings: function () {
        $('.twch-setting-row').toggle();
        if (!twch_authorized) {
            $('#twch-account-settings').css('display', 'none');
        }
    },
    yt_ls_not_enabled: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Live Streaming Not Enabled</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Your YouTube account is not enabled for live streaming.<br> Please use the following guide to enable it:<br><div style="font-size: 15px; margin-top: 15px; margin-bottom: 10px;"><a href="/user_guide/enable_youtube_live.pdf" target="_blank">Enable YouTube Live Streaming <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a></div></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    yt_not_verified: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">YouTube Channel Not Verified</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Your YouTube channel is not verified.<br><br> In order to upload videos longer than 15 minutes to your channel, you must first verify your account. <br><br> To verify your account, visit the following link: <br><div style="font-size: 15px; margin-bottom: 10px;"><a href="https://www.youtube.com/verify" target="_blank">https://www.youtube.com/verify <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a></div></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    yt_ls_verified_not_avail: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">YouTube Integration Not Complete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Your YouTube channel is not verified and is not<br> enabled for live streaming.<br><br> In order to upload videos longer than 15 minutes to your channel, you must first verify your account. <br><br> To verify your account, visit the following link: <br><div style="font-size: 15px;"><a href="https://www.youtube.com/verify" target="_blank">https://www.youtube.com/verify <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a></div><br>Use the following guide to enable live streaming:<br><div style="font-size: 15px; margin-bottom: 10px;"><a href="/user_guide/enable_youtube_live.pdf" target="_blank">Enable YouTube Live Streaming <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    facebook_auth_button: function () {
        var width = 965;
        var height = 600;
        var left = (screen.width / 2) - (width / 2);
        var top = (screen.height / 2) - (height / 2);
        myWindow = window.open("about:blank", "facebook_auth", "location=no,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
        myWindow.location = fb_auth_redirect_url;
        smhSN.pollFacebookStatus();
        smhSN.checkFbWindowClosed();
    },
    youtube_auth_button: function () {
        var width = 965;
        var height = 600;
        var left = (screen.width / 2) - (width / 2);
        var top = (screen.height / 2) - (height / 2);
        myWindow = window.open("about:blank", "youtube_auth", "location=no,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
        myWindow.location = yt_auth_redirect_url;
        smhSN.pollYoutubeStatus();
        smhSN.checkYtWindowClosed();
    },
    twitch_auth_button: function () {
        var width = 965;
        var height = 600;
        var left = (screen.width / 2) - (width / 2);
        var top = (screen.height / 2) - (height / 2);
        myWindow = window.open("about:blank", "twitch_auth", "location=no,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
        myWindow.location = twch_auth_redirect_url;
        smhSN.pollTwitchStatus();
        smhSN.checkTwchWindowClosed();
    },
    pollTwitchStatus: function () {
        status_timer = setInterval(function () {
            smhSN.update_auth_buttons('twch');
        }, 10000);
    },
    checkTwchWindowClosed: function () {
        pop_up_timer = setInterval(function () {
            if (myWindow.closed) {
                clearInterval(pop_up_timer);
                clearInterval(status_timer);
                smhSN.update_auth_buttons('twch');
            }
        }, 1000);
    },
    confirm_remove_facebook_auth: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Disconnect Account</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Are you sure you want to remove this Facebook account?</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="remove-fb" onclick="smhSN.removeFbAuth()">Disconnect</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    removeFbAuth: function () {
        var sessData = {
            action: 'remove_facebook_authorization',
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#smh-modal #loading img').css('display', 'inline-block');
                $('#remove-fb').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    $('#fb-table .sn-settings').css('width', '95px');
                    $('#fb-table #sn-resync').css('display', 'none');
                    smhSN.update_auth_buttons('fb');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Account Successfully Removed!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#remove-fb').removeAttr('disabled');
                        $('#smh-modal').modal('hide');
                    }, 3000);
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                }
            }
        });
    },
    confirm_remove_youtube_auth: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Disconnect Account</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Are you sure you want to remove this YouTube account?</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="remove-yt" onclick="smhSN.removeYtAuth()">Disconnect</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    removeYtAuth: function () {
        var sessData = {
            action: 'remove_youtube_authorization',
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#smh-modal #loading img').css('display', 'inline-block');
                $('#remove-yt').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    $('#yt-table .sn-settings').css('width', '95px');
                    $('#yt-table #sn-resync').css('display', 'none');
                    smhSN.update_auth_buttons('yt');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Account Successfully Removed!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#remove-yt').removeAttr('disabled');
                        $('#smh-modal').modal('hide');
                    }, 3000);
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                }
            }
        });
    },
    confirm_remove_twitch_auth: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Disconnect Account</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Are you sure you want to remove this Twitch account?</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="remove-twch" onclick="smhSN.removeTwchAuth()">Disconnect</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    removeTwchAuth: function () {
        var sessData = {
            action: 'remove_twitch_authorization',
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#smh-modal #loading img').css('display', 'inline-block');
                $('#remove-twch').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    $('#twch-table .sn-settings').css('width', '95px');
                    $('#twch-table #sn-resync').css('display', 'none');
                    smhSN.update_auth_buttons('twch');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Account Successfully Removed!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#remove-yt').removeAttr('disabled');
                        $('#smh-modal').modal('hide');
                    }, 3000);
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                }
            }
        });
    },
    update_auth_buttons: function (sn_platform) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            projection: '360'
        }

        var reqUrl = ApiUrl + 'action=get_sn_config';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                $.each(data['platforms'], function (key, value) {
                    if ((value['platform'] == 'youtube_live') && (sn_platform == 'yt')) {
                        if (value['authorized']) {
                            $('#yt-table .sn-settings').css('width', '160px');
                            $('#yt-table #sn-resync').css('display', 'block');
                            $('#yt-status').html('<div class="green led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#yt-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['channel_details']['channel_thumb'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['channel_details']['channel_title'] + '</div><div id="account-button"><button id="yt-auth" class="btn btn-yt" type="button" onclick="smhSN.confirm_remove_youtube_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            yt_authorized = true;
                            yt_auth_redirect_url = null;
                            clearInterval(pop_up_timer);
                            clearInterval(status_timer);
                            $('#yt-account-settings').css('display', 'table-row');
                            smhSN.displayYtSettings(value['auto_upload']);
                        } else {
                            $('#yt-table .sn-settings').css('width', '95px');
                            $('#yt-table #sn-resync').css('display', 'none');
                            $('#yt-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#yt-account').html('<button id="yt-auth" class="btn btn-primary" type="button" onclick="smhSN.youtube_auth_button();">Connect Account</button>');
                            yt_auth_redirect_url = value['redirect_url'];
                            yt_authorized = false;
                            $('#yt-account-settings').css('display', 'none');
                        }
                        if (value['is_verified']) {
                            yt_is_verified = true;
                        } else {
                            yt_is_verified = false;
                        }
                        if (value['ls_enabled']) {
                            yt_ls_enabled = true;
                        } else {
                            yt_ls_enabled = false;
                        }
                        if (value['embed_status']) {
                            yt_embed = true;
                        } else {
                            yt_embed = false;
                        }
                        if (yt_authorized && yt_is_verified && !yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'block');
                            $('#yt-integration-warning').html('<i class="fa fa-warning"></i> <a onclick="smhSN.yt_ls_not_enabled();">Live stream not enabled <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>');
                        } else if (yt_authorized && !yt_is_verified && yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'block');
                            $('#yt-integration-warning').html('<i class="fa fa-warning"></i> <a onclick="smhSN.yt_not_verified();">Channel not verified <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>');
                        } else if (yt_authorized && !yt_is_verified && !yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'block');
                            $('#yt-integration-warning').html('<i class="fa fa-warning"></i> <a onclick="smhSN.yt_ls_verified_not_avail();">Integration not complete <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>');
                        } else if (!yt_authorized && !yt_is_verified && !yt_ls_enabled) {
                            $('#yt-integration-warning').css('display', 'none');
                            $('#yt-integration-warning').html('');
                        }
                    }
                    if ((value['platform'] == 'facebook_live') && (sn_platform == 'fb')) {
                        if (value['authorized']) {
                            $('#fb-status').html('<div class="green led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#fb-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['user_details']['user_thumb'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['user_details']['user_name'] + '</div><div id="account-button"><button id="fb-auth" class="btn btn-fb" type="button" onclick="smhSN.confirm_remove_facebook_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            fb_authorized = true;
                            fb_auth_redirect_url = null;
                            clearInterval(pop_up_timer);
                            clearInterval(status_timer);
                            $('#fb-account-settings').css('display', 'table-row');
                            smhSN.displayFbSettings(value['publish_to'], value['settings']);
                        } else {
                            $('#fb-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#fb-account').html('<button id="fb-auth" class="btn btn-primary" type="button" onclick="smhSN.facebook_auth_button();">Connect Account</button>');
                            fb_authorized = false;
                            fb_auth_redirect_url = value['redirect_url'];
                            $('#fb-account-settings').css('display', 'none');
                            $('#fb-integration-warning').css('display', 'none');
                        }
                    }
                    if ((value['platform'] == 'twitch') && (sn_platform == 'twch')) {
                        if (value['authorized']) {
                            $('#twch-status').html('<div class="green led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#twch-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['channel_details']['channel_logo'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['channel_details']['channel_name'] + '</div><div id="account-button"><button id="twch-auth" class="btn btn-twch" type="button" onclick="smhSN.confirm_remove_twitch_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            twch_authorized = true;
                            twch_auth_redirect_url = null;
                            clearInterval(pop_up_timer);
                            clearInterval(status_timer);
                            $('#twch-account-settings').css('display', 'table-row');
                            smhSN.displayTwchSettings(value['settings']['auto_upload']);
                        } else {
                            $('#twch-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#twch-account').html('<button id="twch-auth" class="btn btn-primary" type="button" onclick="smhSN.twitch_auth_button();">Connect Account</button>');
                            twch_authorized = false;
                            twch_auth_redirect_url = value['redirect_url'];
                            $('#twch-account-settings').css('display', 'none');
                            $('#twch-integration-warning').css('display', 'none');
                        }
                    }
                    if ((value['platform'] == 'twitter') && (sn_platform == 'twtr')) {
                        if (value['authorized']) {
                            $('#twtr-status').html('<div class="green led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Connected"></div>');
                            $('#twtr-account').html('<div class="alert sn-account" role="alert"><div id="account-img"><img src="' + value['channel_details']['channel_logo'] + '" class="img-circle" alt="Account Image" width="70px"></div><div id="account-title">' + value['channel_details']['channel_name'] + '</div><div id="account-button"><button id="twtr-auth" class="btn btn-twtr" type="button" onclick="smhSN.confirm_remove_twitter_auth();">Disconnect</button></div><div class="clear"></div></div>');
                            twtr_authorized = true;
                            twtr_auth_redirect_url = null;
                            clearInterval(pop_up_timer);
                            clearInterval(status_timer);
                            $('#twtr-account-settings').css('display', 'table-row');
                            smhSN.displayTwtrSettings(value['settings']['auto_upload']);
                        } else {
                            $('#twtr-status').html('<div class="red led" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Not Connected"></div>');
                            $('#twtr-account').html('<span style="color: #808080; font-weight: bold;">Coming Soon</span>');
                            twtr_authorized = false;
                            twtr_auth_redirect_url = value['redirect_url'];
                            $('#twtr-account-settings').css('display', 'none');
                            $('#twtr-integration-warning').css('display', 'none');
                        }
                    }
                });
            }
        });
    },
    pollFacebookStatus: function () {
        status_timer = setInterval(function () {
            smhSN.update_auth_buttons('fb');
        }, 10000);
    },
    checkFbWindowClosed: function () {
        pop_up_timer = setInterval(function () {
            if (myWindow.closed) {
                clearInterval(pop_up_timer);
                clearInterval(status_timer);
                smhSN.update_auth_buttons('fb');
            }
        }, 1000);
    },
    pollYoutubeStatus: function () {
        status_timer = setInterval(function () {
            smhSN.update_auth_buttons('yt');
        }, 10000);
    },
    checkYtWindowClosed: function () {
        pop_up_timer = setInterval(function () {
            if (myWindow.closed) {
                clearInterval(pop_up_timer);
                clearInterval(status_timer);
                smhSN.update_auth_buttons('yt');
            }
        }, 1000);
    },
    twitch_save_settings: function () {
        var auto_upload = $('#twch_auto_upload').is(':checked') ? true : false;
        var sessData = {
            action: 'update_twch_settings',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            auto_upload: auto_upload
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#twch-save-wrapper  #loading img').css('display', 'inline-block');
                $('#twch-save').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    $('#twch-save-wrapper #loading img').css('display', 'none');
                    $('#twch-save-wrapper #pass-result').html('<span class="label label-success">Settings Successfully Saved!</span>');
                    setTimeout(function () {
                        $('#twch-save-wrapper #pass-result').empty();
                        $('#twch-save').removeAttr('disabled');
                    }, 3000);
                } else {
                    $('#twch-save-wrapper #loading img').css('display', 'none');
                    $('#twch-save-wrapper #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                    setTimeout(function () {
                        $('#twch-save-wrapper #pass-result').empty();
                        $('#twch-save').removeAttr('disabled');
                    }, 3000);
                }
            }
        });
    },
    youtube_save_settings: function () {
        var auto_upload = $('#yt_auto_upload').is(':checked') ? true : false;
        var sessData = {
            action: 'update_yt_settings',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            auto_upload: auto_upload
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#yt-save-wrapper  #loading img').css('display', 'inline-block');
                $('#yt-save').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    $('#yt-save-wrapper #loading img').css('display', 'none');
                    $('#yt-save-wrapper #pass-result').html('<span class="label label-success">Settings Successfully Saved!</span>');
                    setTimeout(function () {
                        $('#yt-save-wrapper #pass-result').empty();
                        $('#yt-save').removeAttr('disabled');
                    }, 3000);
                } else {
                    $('#yt-save-wrapper #loading img').css('display', 'none');
                    $('#yt-save-wrapper #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                    setTimeout(function () {
                        $('#yt-save-wrapper #pass-result').empty();
                        $('#yt-save').removeAttr('disabled');
                    }, 3000);
                }
            }
        });
    },
    facebook_save_settings: function () {
        var publish_to_attr = $('#publish-to').attr("data-value");
        var publish_to_split = publish_to_attr.split(':');
        var publish_to = publish_to_split[0];
        var asset_id = publish_to_split[1];
        var privacy = $('#privacy').attr("data-value");
        var vod = $('#fb_ls_vod').is(':checked') ? true : false;
        var cont_stream = $('#fb_cont_stream').is(':checked') ? true : false;
        var auto_upload = $('#fb_auto_upload').is(':checked') ? true : false;
        var sessData = {
            action: 'create_fb_livestream',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            publish_to: publish_to,
            asset_id: asset_id,
            privacy: privacy,
            create_vod: vod,
            cont_streaming: cont_stream,
            auto_upload: auto_upload,
            projection: '360'
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#fb-save-wrapper  #loading img').css('display', 'inline-block');
                $('#fb-save').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    $('#fb-table .sn-settings').css('width', '160px');
                    $('#fb-table #sn-resync').css('display', 'inline-block');
                    $('#fb-integration-warning').css('display', 'none');
                    $('#settings-warning').css('display', 'none');
                    $('#fb-save-wrapper #loading img').css('display', 'none');
                    $('#fb-save-wrapper #pass-result').html('<span class="label label-success">Settings Successfully Saved!</span>');
                    setTimeout(function () {
                        $('#fb-save-wrapper #pass-result').empty();
                        $('#fb-save').removeAttr('disabled');
                    }, 3000);
                } else if (!data['success'] && data['message'] == 'Does not have permission to create live stream') {
                    $('#fb-integration-warning').css('display', 'block');
                    $('#settings-warning').css('display', 'block');
                    $('#fb-save-wrapper #loading img').css('display', 'none');
                    $('#fb-save-wrapper #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                    setTimeout(function () {
                        $('#fb-save-wrapper #pass-result').empty();
                        $('#fb-save').removeAttr('disabled');
                    }, 3000);
                    smhSN.fb_no_permission();
                } else {
                    $('#fb-integration-warning').css('display', 'block');
                    $('#settings-warning').css('display', 'block');
                    $('#fb-save-wrapper #loading img').css('display', 'none');
                    $('#fb-save-wrapper #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                    setTimeout(function () {
                        $('#fb-save-wrapper #pass-result').empty();
                        $('#fb-save').removeAttr('disabled');
                    }, 3000);
                }
            }
        });
    },
    fb_no_permission: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '415px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Error: Could not create a live stream</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">You may not have given Streaming Media<br> Hosting the correct permissions. <br>Please try reconnecting your account.</div></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    fb_resync: function () {
        var sessData = {
            action: 'resync_fb_account',
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#fb-table #sn-resync .fa').css('display', 'none');
                $('#fb-table #sn-resync #loading').css('display', 'inline-block');
                $('#fb-table #sn-resync #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    $('#fb-account #account-title').html(data['profile_details']['user_name']);
                    var thumbnail = '<img src="' + data['profile_details']['user_thumbnail'] + '" class="img-circle" alt="Account Image" width="70px">';
                    $('#fb-account #account-img').html(thumbnail);
                    smhSN.displayFbSettings(data['publish_to'], data['settings']);
                    $('#fb-table #sn-resync #loading').css('display', 'none');
                    $('#fb-table #sn-resync #loading img').css('display', 'none');
                    $('#fb-table #sn-resync .fa').css('display', 'block');
                } else {
                    $('#fb-table #sn-resync #loading').css('display', 'none');
                    $('#fb-table #sn-resync #loading img').css('display', 'none');
                    $('#fb-table #sn-resync .fa').css('display', 'block');
                }
            }
        });
    },
    yt_resync: function () {
        var sessData = {
            action: 'resync_yt_account',
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#yt-table #sn-resync .fa').css('display', 'none');
                $('#yt-table #sn-resync #loading').css('display', 'inline-block');
                $('#yt-table #sn-resync #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    $('#yt-table #account-title').html(data['channel_details']['channel_name']);
                    var thumbnail = '<img src="' + data['channel_details']['channel_thumbnail'] + '" class="img-circle" alt="Account Image" width="70px">';
                    $('#yt-table #account-img').html(thumbnail);
                    $('#yt-table #sn-resync #loading').css('display', 'none');
                    $('#yt-table #sn-resync #loading img').css('display', 'none');
                    $('#yt-table #sn-resync .fa').css('display', 'block');
                } else {
                    $('#yt-table #sn-resync #loading').css('display', 'none');
                    $('#yt-table #sn-resync #loading img').css('display', 'none');
                    $('#yt-table #sn-resync .fa').css('display', 'block');
                }
            }
        });
    },
    twch_resync: function () {
        var sessData = {
            action: 'resync_twch_account',
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#twch-table #sn-resync .fa').css('display', 'none');
                $('#twch-table #sn-resync #loading').css('display', 'inline-block');
                $('#twch-table #sn-resync #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    $('#twch-table #account-title').html(data['channel_details']['channel_name']);
                    var thumbnail = '<img src="' + data['channel_details']['channel_logo'] + '" class="img-circle" alt="Account Image" width="70px">';
                    $('#twch-table #account-img').html(thumbnail);
                    $('#twch-table #sn-resync #loading').css('display', 'none');
                    $('#twch-table #sn-resync #loading img').css('display', 'none');
                    $('#twch-table #sn-resync .fa').css('display', 'block');
                } else {
                    $('#twch-table #sn-resync #loading').css('display', 'none');
                    $('#twch-table #sn-resync #loading img').css('display', 'none');
                    $('#twch-table #sn-resync .fa').css('display', 'block');
                }
            }
        });
    },
    //Register actions
    registerActions: function () {
        $('#fb-account-settings').on('change', '#fb_vod', function (event) {
            if ($(this).prop('checked')) {
                $('#fb_cont_stream').attr('disabled', '');
            } else {
                $('#fb_cont_stream').removeAttr('disabled');
            }
        });

        $('#fb-account-settings').on('change', '#fb_cont_stream', function (event) {
            if ($(this).prop('checked')) {
                $('#fb_vod').attr('disabled', '');
            } else {
                $('#fb_vod').removeAttr('disabled');
            }
        });

        $('#publish-to-wrapper').on('click', '.mCSB_scrollTools', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhSN = new SocialNetwork();
    smhSN.registerActions();
    smhSN.getSnConfig();
});
