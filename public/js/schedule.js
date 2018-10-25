/*
 *
 *	Streaming Media Hosting
 *	
 *	LiveStreams
 *
 *	9-15-2015
 */
//Main constructor
function Schedule() {}

//Global variables
//var ApiUrl = "https://api.mediaplatform.streamingmediahosting.com/apps/channel/v1.0/index.php?";
var ApiUrl = "http://devplatform.streamingmediahosting.com/apps/channel/v1.0/index.php?";
var readonly = false;
var channel_playing = null;
var resizeTimer;
var mediaCleaned = false;
var changeTimeout = null;
var pageInit = true;

//Login prototype/class
Schedule.prototype = {
    constructor: Schedule,
    init_scheduler: function () {
        scheduler.locale.labels.timeline_tab = "Timeline";
        scheduler.config.mark_now = true;
        scheduler.config.default_date = "%D, %M %j";
        scheduler.config.xml_date = "%Y-%m-%d %H:%i:%s";
        scheduler.config.drag_resize = false;
        scheduler.config.drag_move = false;
        scheduler.config.drag_create = false;
        scheduler.config.occurrence_timestamp_in_utc = true;
        scheduler.config.include_end_by = true;
        scheduler.config.repeat_precise = true;
        scheduler.config.time_step = 1 / 60;
        scheduler.config.readonly = true;

        scheduler.templates.event_bar_text = function (start, end, event) {
            return '&nbsp;&nbsp;' + event.text;
        };

        var timezone = jstz.determine();
        var tz = timezone.name();

        var time = Math.round((new Date()).getTime() / 1000);
        time = time - (time % 1800);

        var utcSeconds = time;
        var start = new Date(0); // The 0 there is the key, which sets the date to the epoch
        start.setUTCSeconds(utcSeconds);

        var hours = start.getHours();
        var minutes = start.getMinutes();
        var x_step = (((Number(hours) * 60) + Number(minutes)) / 30);

        scheduler.createTimelineView({
            name: "timeline",
            x_unit: "minute", //measuring unit of the X-Axis.
            x_date: "%h:%i %A", //date format of the X-Axis
            x_step: 30, //X-Axis step in 'x_unit's
            x_size: 4, //X-Axis length specified as the total number of 'x_step's
            x_start: x_step, //X-Axis offset in 'x_unit's
            x_length: 4, //number of 'x_step's that will be scrolled at a time
            y_unit: scheduler.serverList("channels"),
            y_property: "channel_id", //mapped data property
            render: "bar", //view mode
            section_autoheight: false,
            dy: 75,
            dx: 250,
            event_dy: "full",
        });

        scheduler.init('scheduler', new Date(), 'timeline');
        scheduler.load(ApiUrl + "pid=" + sessInfo.pid + "&action=get_public_channels&tz=" + tz, "json", function () {
            var first_channel = $(".dhx_cal_data .dhx_matrix_scell .channel_wrapper:first").attr('data-channel-id');
            smhS.viewChannelProgram(first_channel);

            $(".dhx_cal_event_line").dotdotdot({
                height: 126,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
            $(".channel_title").dotdotdot({
                height: 56,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
        });

        dhtmlXTooltip.config.className = 'dhtmlXTooltip tooltip';
        dhtmlXTooltip.config.timeout_to_display = 1000;
        dhtmlXTooltip.config.delta_x = 15;
        dhtmlXTooltip.config.delta_y = -20;
        var format = scheduler.date.date_to_str("%h:%i:%s %A");
        scheduler.templates.tooltip_text = function (start, end, event) {
            return "<b>" + event.text + "</b><br/>" + format(start) + " - " + format(end);
        };

        scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
            smhS.highlightPrograms();
            $(".dhx_cal_event_line").dotdotdot({
                height: 126,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
            $(".channel_title").dotdotdot({
                height: 56,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
        });

        scheduler.attachEvent("onXLE", function () {
            $(".dhx_cal_event_line").dotdotdot({
                height: 126,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
            $(".channel_title").dotdotdot({
                height: 56,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
        });

        scheduler.showLightbox = function (id, action) {
            if (action === 'showProgramInfo') {
                if (!readonly) {
                    var format = scheduler.date.date_to_str("%h:%i:%s %A");
                    var ev = scheduler.getEvent(id);
                    if (ev !== undefined) {
                        scheduler.startLightbox(id, null);
                        scheduler.hideCover();
                        var start_date = '';
                        var end_date = '';
                        if (ev.event_pid === 0) {
                            start_date = format(ev.start_date);
                            end_date = format(ev.end_date);
                            smhS.showProgramInfo(ev.channel_name, ev.text, ev.entry_desc, ev.thumbId, start_date, end_date);
                        } else if (ev.__proto__.event_pid === 0) {
                            start_date = format(ev.__proto__.start_date);
                            end_date = format(ev.__proto__.end_date);
                            smhS.showProgramInfo(ev.__proto__.channel_name, ev.__proto__.text, ev.__proto__.entry_desc, ev.__proto__.thumbId, start_date, end_date);
                        } else if (ev.__proto__.__proto__.event_pid === 0) {
                            start_date = format(ev.__proto__.__proto__.start_date);
                            end_date = format(ev.__proto__.__proto__.end_date);
                            smhS.showProgramInfo(ev.__proto__.__proto__.channel_name, ev.__proto__.__proto__.text, ev.__proto__.__proto__.entry_desc, ev.__proto__.__proto__.thumbId, start_date, end_date);
                        }
                    }
                }
            }
        }

        scheduler.attachEvent("onClick", function (id, e) {
            var className = $(e.target).prop("class").replace("ddd-truncated", "").trim();
            var event_start_pos = Number($(".dhx_cal_data [event_id*='" + id + "']").css('left').replace("px", ""));
            var event_width = Number($(".dhx_cal_data [event_id*='" + id + "']").css('width').replace("px", ""));
            var event_end_pos = Number(event_start_pos + event_width);

            var mark_time_pos = -1;
            var mark_time = $(".dhx_cal_data [event_id='" + id + "']").prevUntil('.dhx_matrix_now_time').prev(".dhx_matrix_now_time");
            if (mark_time.length > 0) {
                mark_time_pos = Number($(".dhx_cal_data [event_id='" + id + "']").prevUntil(".dhx_matrix_now_time").prev(".dhx_matrix_now_time").css('left').replace("px", ""));
            } else {
                mark_time = $(".dhx_cal_data [event_id='" + id + "']").prev('.dhx_matrix_now_time');
                if (mark_time.length > 0) {
                    mark_time_pos = Number($(".dhx_cal_data [event_id='" + id + "']").prev(".dhx_matrix_now_time").css('left').replace("px", ""));
                }
            }

            smhS.highlightPrograms();
            if (className === "dhx_cal_event_line") {
                if (!readonly) {
                    if ((mark_time_pos < event_start_pos) || (mark_time_pos > event_end_pos)) {
                        scheduler.showLightbox(id, 'showProgramInfo');
                    } else {
                        var format = scheduler.date.date_to_str("%h:%i:%s %A");
                        var ev = scheduler.getEvent(id);

                        if (ev !== undefined) {
                            var start_date = '';
                            var end_date = '';
                            if (ev.event_pid === 0) {
                                start_date = format(ev.start_date);
                                end_date = format(ev.end_date);
                                $('#event-title').html(ev.text);
                                $('#channel-time').html('<span id="channel-title">' + ev.channel_name + '</span><span id="event-time-range">' + start_date + ' - ' + end_date + '</span>');
                                $('#event-desc').html(ev.entry_desc);
                                $(".dhx_cal_data [event_id*='" + id + "']").css('background-color', '#0961BE');
                                smhS.viewChannelProgram(ev.channel_id);
                            } else if (ev.__proto__.event_pid === 0) {
                                start_date = format(ev.__proto__.start_date);
                                end_date = format(ev.__proto__.end_date);
                                $('#event-title').html(ev.__proto__.text);
                                $('#channel-time').html('<span id="channel-title">' + ev.__proto__.channel_name + '</span><span id="event-time-range">' + start_date + ' - ' + end_date + '</span>');
                                $('#event-desc').html(ev.__proto__.entry_desc);
                                $(".dhx_cal_data [event_id*='" + id + "']").css('background-color', '#0961BE');
                                smhS.viewChannelProgram(ev.__proto__.channel_id);
                            } else if (ev.__proto__.__proto__.event_pid === 0) {
                                start_date = format(ev.__proto__.__proto__.start_date);
                                end_date = format(ev.__proto__.__proto__.end_date);
                                $('#event-title').html(ev.__proto__.__proto__.text);
                                $('#channel-time').html('<span id="channel-title">' + ev.__proto__.__proto__.channel_name + '</span><span id="event-time-range">' + start_date + ' - ' + end_date + '</span>');
                                $('#event-desc').html(ev.__proto__.__proto__.entry_desc);
                                $(".dhx_cal_data [event_id*='" + id + "']").css('background-color', '#0961BE');
                                smhS.viewChannelProgram(ev.__proto__.__proto__.channel_id);
                            }
                            $('#entry-details #event-desc').mCustomScrollbar({
                                theme: "inset-dark",
                                scrollButtons: {
                                    enable: true
                                }
                            });
                        }
                    }
                }
            }
        });
    },
    viewChannelProgram: function (cid) {
        channel_playing = cid;
        smhS.highlightPrograms();
        smhS.loadplayer();
    },
    highlightPrograms: function () {
        $.each($('.dhx_cal_data [event_id]'), function () {
            $(this).css('background-color', '');
            $(this).css('color', '');
        });
        var found_program = false;
        $(".dhx_cal_data .dhx_matrix_scell .channel_wrapper").each(function () {
            if (channel_playing === $(this).attr('data-channel-id')) {
                var matrix_line = $(this).closest('td').next().find('.dhx_matrix_line');
                var mark_time = matrix_line.find('.dhx_matrix_now_time');
                var mark_time_pos = -1;
                if (mark_time.length > 0) {

                    matrix_line.find('.dhx_cal_event_line ').each(function () {
                        mark_time_pos = Number(mark_time.css('left').replace("px", ""));
                        if (mark_time_pos === 0) {
                            mark_time_pos = 1;
                        }

                        console.log('highlightPrograms: mark_time_pos: ' + mark_time_pos);

                        var event_start_pos = Number($(this).css('left').replace("px", ""));

                        console.log('highlightPrograms: event_start_pos: ' + event_start_pos);


                        var event_width = Number($(this).css('width').replace("px", ""));
                        var event_end_pos = Number(event_start_pos + event_width);

                        console.log('highlightPrograms: event_end_pos: ' + event_end_pos);

                        if ((mark_time_pos >= event_start_pos) && (mark_time_pos <= event_end_pos)) {
                            found_program = true;
                            var event_id = $(this).attr('event_id');
                            var format = scheduler.date.date_to_str("%h:%i:%s %A");
                            var ev = scheduler.getEvent(event_id);
                            if (ev !== undefined) {
                                var start_date = '';
                                var end_date = '';
                                $(".dhx_cal_data [event_id*='" + event_id + "']").css('color', '#FFF');
                                if (ev.event_pid === 0) {
                                    start_date = format(ev.start_date);
                                    end_date = format(ev.end_date);
                                    $('#event-title').html(ev.text);
                                    $('#channel-time').html('<span id="channel-title">' + ev.channel_name + '</span><span id="event-time-range">' + start_date + ' - ' + end_date + '</span>');
                                    $('#event-desc').html(ev.entry_desc);
                                    $(".dhx_cal_data [event_id*='" + event_id + "']").css('background-color', '#0961BE');
                                } else if (ev.__proto__.event_pid === 0) {
                                    start_date = format(ev.__proto__.start_date);
                                    end_date = format(ev.__proto__.end_date);
                                    $('#event-title').html(ev.__proto__.text);
                                    $('#channel-time').html('<span id="channel-title">' + ev.__proto__.channel_name + '</span><span id="event-time-range">' + start_date + ' - ' + end_date + '</span>');
                                    $('#event-desc').html(ev.__proto__.entry_desc);
                                    $(".dhx_cal_data [event_id*='" + event_id + "']").css('background-color', '#0961BE');
                                } else if (ev.__proto__.__proto__.event_pid === 0) {
                                    start_date = format(ev.__proto__.__proto__.start_date);
                                    end_date = format(ev.__proto__.__proto__.end_date);
                                    $('#event-title').html(ev.__proto__.__proto__.text);
                                    $('#channel-time').html('<span id="channel-title">' + ev.__proto__.__proto__.channel_name + '</span><span id="event-time-range">' + start_date + ' - ' + end_date + '</span>');
                                    $('#event-desc').html(ev.__proto__.__proto__.entry_desc);
                                    $(".dhx_cal_data [event_id*='" + event_id + "']").css('background-color', '#0961BE');
                                }
                                $('#entry-details #event-desc').mCustomScrollbar({
                                    theme: "inset-dark",
                                    scrollButtons: {
                                        enable: true
                                    }
                                });
                            }
                        }
                    });

                    if (!found_program) {
                        $('#event-title').html('No Program Found');
                        $('#channel-time').html('');
                        $('#event-desc').html('No program is scheduled for this time');
                    }
                }
            } else {
                var matrix_line = $(this).closest('td').next().find('.dhx_matrix_line');
                var mark_time = $(this).closest('td').next().find('.dhx_matrix_now_time');
                var mark_time_pos = -1;
                if (mark_time.length > 0) {
                    matrix_line.find('.dhx_cal_event_line ').each(function () {
                        mark_time_pos = Number(mark_time.css('left').replace("px", ""));
                        if (mark_time_pos === 0) {
                            mark_time_pos = 1;
                        }
                        var event_start_pos = Number($(this).css('left').replace("px", ""));
                        var event_width = Number($(this).css('width').replace("px", ""));
                        var event_end_pos = Number(event_start_pos + event_width);
                        if ((mark_time_pos >= event_start_pos) && (mark_time_pos <= event_end_pos)) {
                            var event_id = $(this).attr('event_id');
                            var ev = scheduler.getEvent(event_id);
                            if (ev !== undefined) {
                                $(".dhx_cal_data [event_id*='" + event_id + "']").css('color', '#FFF');
                            }
                        }
                    });
                }
            }

        });
    },
    viewChannel: function (cid) {
        channel_playing = cid;
        smhS.highlightPrograms();
        smhS.loadplayer();
    },
    loadplayer: function () {
        mediaCleaned = true;
        var flashvars = {};
        if (window.kdp) {
            kdp.sendNotification('cleanMedia');
            kdp.sendNotification('changeMedia', {
                'entryId': channel_playing
            });
        } else {
            flashvars.autoPlay = true;
            if (sessInfo.ks != '') {
                flashvars.ks = sessInfo.ks;
            }
            kWidget.embed({
                "targetId": "smh_player",
                "wid": "_" + sessInfo.pid,
                "uiconf_id": sessInfo.playerId,
                "flashvars": flashvars,
                "params": {
                    "wmode": "transparent"
                },
                "cache_st": 1496956314,
                "entry_id": channel_playing
            });
            kWidget.addReadyCallback(function (playerId) {
                window.kdp = $('#' + playerId).get(0);
                if (changeTimeout) {
                    clearTimeout(changeTimeout);
                }
                kdp.kUnbind("mediaReady");
                kdp.kUnbind("playerPlayed");
                kdp.kUnbind("userInitiatedPause");
                kdp.kUnbind("userInitiatedPlay");
                kdp.kUnbind("preSequenceStart");
                kdp.kUnbind("preSequenceComplete");
                kdp.kUnbind("postSequenceStart");
                kdp.kUnbind("postSequenceComplete");
                kdp.kUnbind("adStart");
                kdp.kUnbind("adEnd");
                kdp.kBind('mediaReady', function () {
                    changeTimeout = setTimeout(function () {
                        mediaCleaned = false;
                        pageInit = false;
                    }, 5000);
                });
                kdp.kBind('playerPlayed', function () {
                    if (!mediaCleaned && !pageInit) {
                        changeTimeout = setTimeout(function () {
                            smhS.loadplayer();
                            mediaCleaned = true;
                        }, 1000);
                    }

                });
                kdp.kBind('userInitiatedPause', function () {
                    mediaCleaned = true;
                });
                kdp.kBind('preSequenceStart', function () {
                    mediaCleaned = true;
                });
                kdp.kBind('preSequenceComplete', function () {
                    changeTimeout = setTimeout(function () {
                        mediaCleaned = false;
                        pageInit = false;
                    }, 5000);
                });
                kdp.kBind('postSequenceStart', function () {
                    mediaCleaned = true;
                });
                kdp.kBind('postSequenceComplete', function () {
                    changeTimeout = setTimeout(function () {
                        mediaCleaned = false;
                        pageInit = false;
                    }, 5000);
                });
                kdp.kBind('adStart', function () {
                    mediaCleaned = true;
                });
                kdp.kBind('adEnd', function () {
                    changeTimeout = setTimeout(function () {
                        mediaCleaned = false;
                        pageInit = false;
                    }, 5000);
                });
                kdp.kBind('userInitiatedPlay', function () {
                    changeTimeout = setTimeout(function () {
                        mediaCleaned = false;
                        pageInit = false;
                    }, 5000);
                });
            });
        }
    },
    showProgramInfo: function (channel_name, entry_name, entry_desc, thumbId, start_date, end_date) {
        var content;
        $('.smh-dialog').css('width', '460px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        content = '<div style="float:left;margin-bottom: 20px;margin-top: 5px;color: #fff;width: 400px;margin-right: 15px;margin-left: 15px;">' +
                '<div style="float: left;box-shadow: 4px 4px 6px -1px rgba(0,0,0,0.75);"><img src="https://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/thumbnail/entry_id/' + thumbId + '/quality/100/type/1/width/300/height/90" width="150" height="110"></div><div style="float:right"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel"></h4></div>' +
                '<div class="clear"></div>' +
                '<div style="font-size: 18px;margin: 5px 0 5px 0;">' + entry_name + '</div>' +
                '<div style="font-size: 14px;"><span style="border-right: 1px solid #fff;margin-right: 7px;padding-right: 7px;">' + channel_name + '</span>' + start_date + ' - ' + end_date + '</div>' +
                '<div style="font-size: 14px;">' + entry_desc + '</div>' +
                '</div>' +
                '<div class="clear"></div>';

        $('#smh-modal .modal-body').html(content);
    },
    zoomOut: function () {
        if ((scheduler.matrix.timeline.x_size !== 24) && (scheduler.matrix.timeline.x_length !== 24)) {
            var new_size = scheduler.matrix.timeline.x_size + 1;
            var new_length = scheduler.matrix.timeline.x_length + 1;
            scheduler.matrix.timeline.x_size = new_size;
            scheduler.matrix.timeline.x_length = new_length;
            scheduler.updateView();
            smhS.highlightPrograms();
            $(".dhx_cal_event_line").dotdotdot({
                height: 126,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
            $(".channel_title").dotdotdot({
                height: 56,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
        }
    },
    zoomIn: function () {
        if ((scheduler.matrix.timeline.x_size !== 4) && (scheduler.matrix.timeline.x_length !== 4)) {
            var new_size = scheduler.matrix.timeline.x_size - 1;
            var new_length = scheduler.matrix.timeline.x_length - 1;
            scheduler.matrix.timeline.x_size = new_size;
            scheduler.matrix.timeline.x_length = new_length;
            scheduler.updateView();
            smhS.highlightPrograms();
            $(".dhx_cal_event_line").dotdotdot({
                height: 126,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
            $(".channel_title").dotdotdot({
                height: 56,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            });
        }
    },
    show_minical: function () {
        if (scheduler.isCalendarVisible())
            scheduler.destroyCalendar();
        else
            scheduler.renderCalendar({
                position: "dhx_minical_icon",
                date: scheduler._date,
                navigation: true,
                handler: function (date, calendar) {
                    scheduler.setCurrentView(date);
                    scheduler.destroyCalendar()
                }
            });
    },
    playersPosition: function () {
        var playerHeight = parseInt($("#smh_player").height());
        var player_width_percent = $('#smh_player').width() / $('body').width() * 100;
        var player_final_width_percentage = Math.round(player_width_percent).toFixed(2);
        if (player_final_width_percentage > 57) {
            $("#entry-details-wrapper").css({'height': '180px'});
            var sticky_top_navline = Number(playerHeight) + 199;
            $('#dhx_sticky_navline_wrapper').css({'top': sticky_top_navline + 'px'});
            var sticky_top_header = Number(playerHeight) + 241;
            $('#dhx_sticky_header_wrapper').css({'top': sticky_top_header + 'px'});
        } else {
            $("#entry-details-wrapper").css({'height': playerHeight + 'px'});
            var sticky_top_navline = Number(playerHeight) + 10;
            $('#dhx_sticky_navline_wrapper').css({'top': sticky_top_navline + 'px'});
            var sticky_top_header = Number(playerHeight) + 52;
            $('#dhx_sticky_header_wrapper').css({'top': sticky_top_header + 'px'});
        }
        var scheduler_top_padding = Number(sticky_top_header) + 35;
        $('#scheduler').css({'top': scheduler_top_padding + 'px'});

    },
    //Register actions
    registerActions: function () {
        $(window).resize(function () {
            smhS.playersPosition();
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                smhS.highlightPrograms();
                $(".dhx_cal_event_line").dotdotdot({
                    height: 126,
                    watch: true,
                    ellipsis: "\u2026 ",
                    truncate: "letter",
                    fallbackToLetter: true
                });
                $(".channel_title").dotdotdot({
                    height: 56,
                    watch: true,
                    ellipsis: "\u2026 ",
                    truncate: "letter",
                    fallbackToLetter: true
                });
            }, 100);
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhS = new Schedule();
    smhS.registerActions();
    smhS.playersPosition();
    smhS.init_scheduler();
});
