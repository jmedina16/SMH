@extends('app')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
<!--    <section class="content-header">
        <h1><i class="fa fa-users"></i> Social Broadcasting</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Social Broadcasting</li>
        </ol>
    </section>-->
    <!-- Main content -->
    <section class="content">
        @include('alerts')
<!--        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Upload your videos and simultaneously broadcast to your social media accounts with a single stream.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>-->
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header">Social Media Platforms - Connect to your favorite social media platforms.</div>
                    </div>
                    <div class="box-body">
                        <form id="config-form" action="">
                            <table class="sn-table" id="yt-table">                               
                                <tr>
                                    <td class="sn-td"><div class="sn-logo-wrapper"><img src="/img/youtube_logo.png" width="80px"></div></td><td><div class="sn-platform-text">Broadcast your streams and upload your videos to YouTube</div><div class="sn-settings"><div id="sn-resync"><a data-placement="top" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Resync account" onclick="smhSN.yt_resync();"><i class="fa fa-refresh"></i></a><div id="loading"><img src="/img/loading.gif" height="20px"></div></div><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button" onclick="smhSN.toggle_yt_settings();"><i class="fa fa-cog"></i></button></div><div id="yt-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="yt-integration-warning"></div><div class="clear"></div></td>
                                </tr>
                                <tr class="sn-table yt-setting-row even" style="display: none;">
                                    <td><div style="margin-left: 10px;">ACCOUNT</div></td><td><div id="yt-account"></div></td>
                                </tr>  
                                <tr class="sn-table yt-setting-row even" id="yt-account-settings" style="display: none;">
                                    <td><div style="margin-left: 10px;">SETTINGS</div></td>
                                    <td>
                                        <div id="yt-auto-upload-wrapper"></div>   
                                        <div id="yt-save-wrapper"><button id="yt-save" class="btn btn-primary" type="button" onclick="smhSN.youtube_save_settings();">Save</button><div id="pass-result"></div><div id="loading"><img src="/img/loading.gif" height="20px"></div></div>
                                    </td>
                                </tr> 
                            </table>
<!--                            <table class="sn-table" id="fb-table">                               
                                <tr>
                                    <td class="sn-td"><div class="sn-logo-wrapper"><img src="/img/facebook_logo.png" width="80px"></div></td><td><div class="sn-platform-text sn-notice">Broadcast your streams and upload your videos to Facebook <div class="sn-notice-text">* Facebook can only be simultaneously streamed with Streaming Media Hosting</div></div><div class="sn-settings sn-settings-notice"><div id="sn-resync"><a data-placement="top" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Resync account" onclick="smhSN.fb_resync();"><i class="fa fa-refresh"></i></a><div id="loading"><img src="/img/loading.gif" height="20px"></div></div><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button" onclick="smhSN.toggle_fb_settings();"><i class="fa fa-cog"></i></button></div><div id="fb-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="fb-integration-warning" class="sn-integration-notice"><i class="fa fa-warning"></i> Integration not complete</div><div class="clear"></div></td>
                                </tr>
                                <tr class="sn-table fb-setting-row even" style="display: none;">
                                    <td><div style="margin-left: 10px;">ACCOUNT</div></td><td><div id="fb-account"></div></td>
                                </tr>            
                                <tr class="sn-table fb-setting-row even" id="fb-account-settings" style="display: none;">
                                    <td><div style="margin-left: 10px;">SETTINGS</div></td>
                                    <td>
                                        <div id="settings-warning">You must complete your integration by choosing where you want to stream to below.</div>
                                        <span class="sn-settings-title">Publish to</span>
                                        <div id="publish-to-wrapper"></div>
                                        <div class="clear"></div>
                                        <span class="sn-settings-title">Privacy</span>
                                        <div id="privacy-wrapper"></div>
                                        <span class="sn-settings-title">Live Streaming Settings</span>
                                        <div id="ls-vod-wrapper"></div>   
                                        <div id="cont-streaming-wrapper"></div>
                                        <span class="sn-settings-title">Video On Demand Settings</span>
                                        <div id="vod-wrapper"></div> 
                                        <div id="fb-save-wrapper"><button id="fb-save" class="btn btn-primary" type="button" onclick="smhSN.facebook_save_settings();">Save</button><div id="pass-result"></div><div id="loading"><img src="/img/loading.gif" height="20px"></div></div>
                                    </td>
                                </tr>                                  
                            </table>               -->
                            <table class="sn-table" id="twch-table">                               
                                <tr>
                                    <td class="sn-td"><div class="sn-logo-wrapper"><img src="/img/twitch_logo.png" width="80px"></div></td><td><div class="sn-platform-text">Broadcast your streams and upload your videos to Twitch</div><div class="sn-settings"><div id="sn-resync"><a data-placement="top" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Resync account" onclick="smhSN.twch_resync();"><i class="fa fa-refresh"></i></a><div id="loading"><img src="/img/loading.gif" height="20px"></div></div><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button" onclick="smhSN.toggle_twch_settings();"><i class="fa fa-cog"></i></button></div><div id="twch-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="twch-integration-warning"></div><div class="clear"></div></td>
                                </tr>
                                <tr class="sn-table twch-setting-row even" style="display: none;">
                                    <td><div style="margin-left: 10px;">ACCOUNT</div></td><td><div id="twch-account"></div></td>
                                </tr>  
                                <tr class="sn-table twch-setting-row even" id="twch-account-settings" style="display: none;">
                                    <td><div style="margin-left: 10px;">SETTINGS</div></td>
                                    <td>
                                        <div id="twch-auto-upload-wrapper"></div>   
                                        <div id="twch-save-wrapper"><button id="twch-save" class="btn btn-primary" type="button" onclick="smhSN.twitch_save_settings();">Save</button><div id="pass-result"></div><div id="loading"><img src="/img/loading.gif" height="20px"></div></div>
                                    </td>
                                </tr> 
                            </table>
<!--                            <table class="sn-table" id="sf-table">                               
                                <tr>
                                    <td class="sn-td" style="padding: 4px;"><div class="sn-logo-wrapper"><img src="/img/salesforce_logo.png" width="90px"></div></td><td><div class="sn-platform-text">Broadcast your streams and upload your videos to Salesforce</div><div class="sn-settings"><div id="sn-resync"><a data-placement="top" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Resync account"><i class="fa fa-refresh"></i></a><div id="loading"><img src="/img/loading.gif" height="20px"></div></div><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button"><i class="fa fa-cog"></i></button></div><div id="sf-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="sf-integration-warning"></div><div class="clear"></div></td>
                                </tr>
                            </table>
                            <table class="sn-table" id="vimeo-table">                               
                                <tr>
                                    <td class="sn-td"><div class="sn-logo-wrapper"><img src="/img/vimeo_logo.png" width="80px"></div></td><td><div class="sn-platform-text">Broadcast your streams and upload your videos to Vimeo</div><div class="sn-settings"><div id="sn-resync"><a data-placement="top" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Resync account"><i class="fa fa-refresh"></i></a><div id="loading"><img src="/img/loading.gif" height="20px"></div></div><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button"><i class="fa fa-cog"></i></button></div><div id="vimeo-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="vimeo-integration-warning"></div><div class="clear"></div></td>
                                </tr>
                            </table>
                            <table class="sn-table" id="twtr-table">                               
                                <tr>
                                    <td class="sn-td"><div class="sn-logo-wrapper"><img src="/img/twitter_logo.png" width="80px"></div></td><td><div class="sn-platform-text">Broadcast your streams and upload your videos to Periscope</div><div class="sn-settings"><div id="sn-resync"><a data-placement="top" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Resync account"><i class="fa fa-refresh"></i></a><div id="loading"><img src="/img/loading.gif" height="20px"></div></div><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button"><i class="fa fa-cog"></i></button></div><div id="twtr-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="twtr-integration-warning"></div><div class="clear"></div></td>
                                </tr>
                                <tr class="sn-table twtr-setting-row even" style="display: none;">
                                    <td><div style="margin-left: 10px;">ACCOUNT</div></td><td><div id="twtr-account"></div></td>
                                </tr>  
                                <tr class="sn-table twtr-setting-row even" id="twtr-account-settings" style="display: none;">
                                    <td><div style="margin-left: 10px;">SETTINGS</div></td>
                                    <td>
                                        <div id="twtr-auto-upload-wrapper"></div>   
                                        <div id="twtr-save-wrapper"><button id="twtr-save" class="btn btn-primary" type="button" onclick="smhSN.twitter_save_settings();">Save</button><div id="pass-result"></div><div id="loading"><img src="/img/loading.gif" height="20px"></div></div>
                                    </td>
                                </tr> 
                            </table>
                            <table class="sn-table" id="weibo-table">                               
                                <tr>
                                    <td class="sn-td"><div class="sn-logo-wrapper"><img src="/img/weibo_logo.jpg" width="80px"></div></td><td><div class="sn-platform-text">Broadcast your streams to Weibo</div><div class="sn-settings"><div class="sn-setting-button"><button class="btn btn-default" class="green led" data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Settings" type="button"><i class="fa fa-cog"></i></button></div><div id="weibo-status"><img src="/img/loading.gif" height="20px"></div><div class="clear"></div></div><div id="weibo-integration-warning"></div><div class="clear"></div></td>
                                </tr>
                                <tr class="sn-table weibo-setting-row even" style="display: none;">
                                    <td><div style="margin-left: 10px;">ACCOUNT</div></td><td><div id="weibo-account"></div></td>
                                </tr>  
                                <tr class="sn-table weibo-setting-row even" id="weibo-account-settings" style="display: none;">
                                    <td><div style="margin-left: 10px;">SETTINGS</div></td>
                                    <td>
                                        <div id="weibo-auto-upload-wrapper"></div>   
                                        <div id="weibo-save-wrapper"><button id="weibo-save" class="btn btn-primary" type="button" onclick="smhSN.weibo_save_settings();">Save</button><div id="pass-result"></div><div id="loading"><img src="/img/loading.gif" height="20px"></div></div>
                                    </td>
                                </tr> 
                            </table>-->
                        </form>
                        @if (Session::get("user.partnerParentId") === 0)
                        <div id="social-guides">
                            <hr>
                            <div id="social-guides-text">Use the following guides to connect your social media accounts to the Platform.</div>
                            <div id="social-guides-links">
                                <a href="/user_guide/yt_setup_guide.pdf" target="_blank">YouTube Integration Guide <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a><br>
<!--                                <a href="/user_guide/fb_setup_guide_v2.pdf" target="_blank">Facebook Integration Guide <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a><br>-->
                                <a href="/user_guide/twch_setup_guide.pdf" target="_blank">Twitch Integration Guide <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a>
                            </div>
                        </div>
                        @endif                        
                    </div>
                </div>
            </div>
        </div>      
    </section>
    <!-- Modal -->
    <div class="modal fade" id="smh-modal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog2">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal3" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog3">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal4" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog4">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/social_network.js?v=1.5" type="text/javascript"></script>
@stop