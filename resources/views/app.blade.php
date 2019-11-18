<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
        <meta name="NewTek_TriCaster_Powered" content="">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Streaming Media Platform</title>

        <!-- CSS -->
        <link href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css?v=1" rel="stylesheet">
        <link href="/css/bootstrap.min.css?v=1" rel="stylesheet">
        <link href="/css/font-awesome.min.css?v=1" rel="stylesheet">
        <link href="/css/ionicons.min.css?v=1" rel="stylesheet">
        <link href="/css/style.css?v=1.5" rel="stylesheet">
        <link href="/css/skin-blue.css?v=1" rel="stylesheet">
        <link href="/css/bootstrap-colorpicker.min.css?v=1" rel="stylesheet">
        <link href="/css/tooltipster.css?v=1" rel="stylesheet">
        <link href="/css/jquery.dataTables.min.css?v=1" rel="stylesheet">
        @yield('css')

        @if (Session::get("user.wl_config.layout_top_settings") == 1)
        <!-- User Custom Layout Config Top Nav -->
        <style id="user-style-top">
            .skin-blue .main-header .navbar, .skin-blue .main-header li.user-header {
                background-color: #{{Session::get("user.wl_config.top_nav_bgcolor")}};
            }
            .skin-blue .sidebar-menu > li.active > a, .skin-blue .sidebar-menu > li > a:hover, .skin-blue .sidebar-menu > li:hover > a {
                border-left-color: #{{Session::get("user.wl_config.top_nav_bgcolor")}};
            }
            #logo, .skin-blue .main-header .navbar .sidebar-toggle, .skin-blue .main-header .navbar .nav > li > a, #user-header-wrapper, #account-header{
                color: #{{Session::get("user.wl_config.top_nav_fontcolor")}};
            }
            @if (Session::get("user.wl_config.layout_logo_text") == 1)
            #logo{
                font-size: {{Session::get("user.wl_config.logo_font_size")}}px;
            }
            @endif
        </style>
        @endif
        @if (Session::get("user.wl_config.layout_side_settings") == 1)
        <!-- User Custom Layout Config Side Nav -->
        <style id="user-style-side">
            .skin-blue .wrapper, .skin-blue .main-sidebar, .skin-blue .left-side {
                background-color: #{{Session::get("user.wl_config.side_nav_bgcolor")}};
            }
            .skin-blue .sidebar-menu > li > a {
                color: #{{Session::get("user.wl_config.side_nav_fontcolor")}};
            }
            .skin-blue .sidebar-menu > li > .treeview-menu {
                background-color: #{{Session::get("user.wl_config.side_nav_sub_bgcolor")}};
            }
            .skin-blue .treeview-menu > li > a{
                color: #{{Session::get("user.wl_config.side_nav_sub_fontcolor")}};
            }
        </style>
        @endif
        <!-- User Settings -->
        <script type="text/javascript">
            var sessInfo = {ks:'{{Session::get("user.ks")}}', Id:'{{Session::get("user.userName")}}', pid:{{Session::get("user.id")}}, roleId:{{Session::get("user.roleId")}}, company:'{{Session::get("user.pubName")}}'};
            var services = {rs:{{Session::get("user.rs")}}, vc:{{Session::get("user.vc")}}, mb:{{Session::get("user.mb")}}, trans_live:{{Session::get("user.trans_live")}}, trans_vod:{{Session::get("user.trans_vod")}}, ppv:{{Session::get("user.ppv")}}, mem:{{Session::get("user.membership")}}, wl:{{Session::get("user.wl")}}, sn:{{Session::get("user.sn")}}, tricaster:{{Session::get("user.tricaster")}}};
            var permissions = '{{Session::get("user.permissions")}}';
            var sessPerm = permissions.split(",");
            var html5_ver = 'v2.66';
        </script>

        <!-- Head JS -->
        <!-- HTML5 Shim and Respond.js?v=1 IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js?v=1 doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js?v=1"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js?v=1"></script>
        <![endif]-->
        <?php
        $permissions = explode(",", Session::get("user.permissions"));
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode(curl_request($url), true);

        function curl_request($url) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $output = curl_exec($ch);
            curl_close($ch);
            return $output;
        }
        ?>
    </head>
    <body class="skin-blue fixed sidebar-mini">
        <!-- Site wrapper -->
        <div class="wrapper">
            <header class="main-header">
                <!-- Header Navbar: style can be found in header.less -->
                <nav class="navbar navbar-static-top" role="navigation">
                    <!-- Sidebar toggle button-->
                    <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div id="logo">
                        @if (Session::get("user.wl_config.layout_logo_image") == 1)
                        <img src="https://mediaplatform.streamingmediahosting.com/p/{{Session::get('user.id')}}/thumbnail/entry_id/{{Session::get('user.wl_config.layout_logoid')}}/quality/100/type/1/height/55" height="55px">
                        @elseif (Session::get("user.wl_config.layout_logo_text") == 1 && Session::get("user.child") == 0)
                        {{Session::get("user.pubName")}}
                        @elseif (Session::get("user.wl_config.layout_logo_text") == 1 && Session::get("user.child") == 1 && Session::get("user.fpl") == 0 && Session::get("user.cl") == 0)
                        {{Session::get("user.pubName")}}
                        @elseif (Session::get("user.wl_config.layout_logo_text") == 1 && Session::get("user.child") == 1 && Session::get("user.fpl") == 1)
                        {{Session::get("user.parent_pubName")}}
                        @elseif (Session::get("user.wl_config.layout_logo_text") == 1 && Session::get("user.child") == 1 && Session::get("user.cl") == 1)
                        {{Session::get("user.pubName")}}
                        @else
                        Streaming Media Platform
                        @endif
                    </div>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <!-- User Account: style can be found in dropdown.less -->
                            <li class="dropdown user user-menu">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                    <span class="hidden-xs">Welcome, {{addslashes(trim(Session::get("user.fullName")))}}</span>
                                </a>
                                <ul class="dropdown-menu">
                                    <!-- User image -->
                                    <li class="user-header">
                                        <div id="user-header-wrapper">
                                            <div id="account-header">User Details</div>
                                            <small>User Name</small>
                                            <div class="user-header-text">{{addslashes(trim(Session::get("user.fullName")))}}</div>
                                            <small>User Email</small>
                                            <div class="user-header-text">{{addslashes(trim(Session::get("user.userName")))}}</div>
                                            <small>Partner ID</small>
                                            <div class="user-header-text">{{trim(Session::get("user.id"))}}</div>
                                            <small>API Token</small>
                                            <div class="user-header-text">{{trim(Session::get("user.apiToken"))}}</div>                                            
                                            <small>Role</small>
                                            <div class="user-header-text">{{ Session::get("user.roleName") }}</div>
                                        </div>
                                    </li>
                                    <!-- Menu Footer-->
                                    <li id="user-logout" class="user-footer">
                                        <div class="pull-right">
                                            <a id="logout" class="btn btn-default btn-flat">Sign out</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <!-- Control Sidebar Toggle Button -->
                            <li>
                                <a href="#" id="sidebar-settings" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <!-- Left side column. contains the sidebar -->
            <aside class="main-sidebar">
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar">
                    <!-- sidebar menu: : style can be found in sidebar.less -->
                    <ul class="sidebar-menu">
                        <li class="{{ Request::is('dashboard') ? 'active' : '' }}">
                            <a href="/dashboard">
                                <i class="fa fa-dashboard"></i>
                                <span>Dashboard</span>
                            </a>
                        </li>       
                        @if (Session::get("user.trans_vod") == 1 && in_array("TRANSCODING_BASE", $permissions))
                        <li class="{{ Request::is('transcoding/vod') | Request::is('transcoding/live') ? 'active' : '' }}">
                            <a href="#">
                                <i class="fa fa-film"></i>
                                <span style="position: relative; top: -2px;">Transcoding</span>
                                <span class="fa fa-angle-left pull-right"></span>
                            </a>
                            <ul class="treeview-menu">
                                <li class="{{ Request::is('transcoding/vod') ? 'active' : '' }}"><a href="/transcoding/vod"><i class="fa fa-cog"></i> VOD Transcoding</a></li>
                                <li class="{{ Request::is('transcoding/live') ? 'active' : '' }}"><a href="/transcoding/live"><i class="fa fa-cog"></i> Live Transcoding</a></li>
                            </ul>
                        </li>
                        @endif                         
                        @if (in_array("CONTENT_MANAGE_BASE", $permissions))
                        <li class="{{ Request::is('content') ? 'active' : '' }}">
                            <a href="/content">
                                <i class="fa fa-film"></i>
                                <span style="position: relative; top: -2px;">Content</span>
                            </a>
                        </li>
                        @endif
                        @if (in_array("STUDIO_BASE", $permissions))
                        <li class="{{ Request::is('players') ? 'active' : '' }}">
                            <a href="/players">
                                <i class="fa fa-play"></i>
                                <span>Players</span>
                            </a>
                        </li>
                        @endif                        
                        @if (in_array("LIVE_STREAM_ADD", $permissions) || in_array("LIVE_STREAM_UPDATE", $permissions) || in_array("CONTENT_MANAGE_METADATA", $permissions) || in_array("CONTENT_MANAGE_DELETE", $permissions) || in_array("CONTENT_MANAGE_ACCESS_CONTROL", $permissions) || in_array("CONTENT_MANAGE_THUMBNAIL", $permissions) || in_array("ANALYTICS_BASE", $permissions))
                        <li class="{{ Request::is('livestream') ? 'active' : '' }}">
                            <a href="/livestream">
                                <i class="fa fa-wifi"></i>
                                <span style="position: relative; top: -2px;">Live Stream</span>
                            </a>
                        </li>
                        @endif
                        <li class="{{ Request::is('ppv/payment_gateway') || Request::is('ppv/email_templates') || Request::is('ppv/email_configuration') || Request::is('ppv/users') || Request::is('ppv/tickets') || Request::is('ppv/content') || Request::is('ppv/orders') || Request::is('ppv/affiliates') || Request::is('membership/email_templates') || Request::is('membership/email_configuration') || Request::is('membership/users') || Request::is('membership/content') || Request::is('access_control') || Request::is('users') || Request::is('roles') || Request::is('reseller') ? 'active' : '' }}">
                            <a href="/access_control">
                                <i class="fa fa-lock"></i> <span style="position: relative; top: -3px;">Access Control</span>
                                <span class="fa fa-angle-left pull-right"></span>
                            </a>
                            <ul class="treeview-menu">
                                @if (Session::get("user.ppv") == 1 && (Session::get("user.roleId") == 2 || in_array("BULK_LOG_DOWNLOAD", $permissions)))
                                <li class="{{ Request::is('ppv/payment_gateway') || Request::is('ppv/email_templates') || Request::is('ppv/email_configuration') || Request::is('ppv/users') || Request::is('ppv/tickets') || Request::is('ppv/content') || Request::is('ppv/orders') || Request::is('ppv/affiliates') ? 'active' : '' }}">
                                    <a href="#">
                                        <i class="fa fa-ticket"></i> <span>Pay Per View</span>
                                        <span class="fa fa-angle-left pull-right"></span>
                                    </a>
                                    <ul class="treeview-menu">
                                        <li class="{{ Request::is('ppv/payment_gateway')? 'active' : '' }}"><a href="/ppv/payment_gateway"><i class="fa fa-tag"></i> Payment Gateway</a></li>
                                        <li class="{{ Request::is('ppv/email_templates') || Request::is('ppv/email_configuration')? 'active' : '' }}">
                                            <a href="#"><i class="fa fa-envelope-o"></i> Email <span class="fa fa-angle-left pull-right"></span></a>
                                            <ul class="treeview-menu {{ Request::is('ppv/email_templates') || Request::is('ppv/email_configuration') ? 'menu-open' : '' }}" style="{{ Request::is('ppv/email_templates') || Request::is('ppv/email_configuration') ? 'display: block;' : 'display: none;' }}">
                                                <li class="{{ Request::is('ppv/email_configuration')? 'active' : '' }}"><a href="/ppv/email_configuration"><i class="fa fa-gears"></i> Configuration</a></li>
                                                <li class="{{ Request::is('ppv/email_templates')? 'active' : '' }}"><a href="/ppv/email_templates"><i class="fa fa-file-text-o"></i> Templates</a></li>
                                            </ul>
                                        </li>
                                        <li class="{{ Request::is('ppv/users')? 'active' : '' }}"><a href="/ppv/users"><i class="fa fa-user"></i> Users</a></li>
                                        <li class="{{ Request::is('ppv/tickets')? 'active' : '' }}"><a href="/ppv/tickets"><i class="fa fa-ticket"></i> Tickets</a></li>
                                        <li class="{{ Request::is('ppv/content')? 'active' : '' }}"><a href="/ppv/content"><i class="fa fa-film"></i> Content</a></li>
                                        <li class="{{ Request::is('ppv/orders')? 'active' : '' }}"><a href="/ppv/orders"><i class="fa fa-list-ul"></i> Orders</a></li>
                                        <li class="{{ Request::is('ppv/affiliates')? 'active' : '' }}"><a href="/ppv/affiliates"><i class="fa fa-users"></i> Affiliates Program</a></li>
                                        @if (Session::get("user.partnerParentId") === 0)<li><a href="#" id="ppv-guide"><i class="fa fa-exclamation-circle"></i> User Guide</a></li>@endif
                                    </ul>                                  
                                </li>
                                @endif
                                @if (Session::get("user.membership") == 1 && (Session::get("user.roleId") == 2 || in_array("SYNDICATION_ADD", $permissions)))
                                <li class="{{ Request::is('membership/email_templates') || Request::is('membership/email_configuration') || Request::is('membership/users') || Request::is('membership/content') ? 'active' : '' }}">
                                    <a href="#">
                                        <i class="fa fa-users"></i> <span>Membership</span>
                                        <span class="fa fa-angle-left pull-right"></span>
                                    </a>
                                    <ul class="treeview-menu">
                                        <li class="{{ Request::is('membership/email_templates') || Request::is('membership/email_configuration')? 'active' : '' }}">
                                            <a href="#"><i class="fa fa-envelope-o"></i> Email <span class="fa fa-angle-left pull-right"></span></a>
                                            <ul class="treeview-menu {{ Request::is('membership/email_templates') || Request::is('membership/email_configuration') ? 'menu-open' : '' }}" style="{{ Request::is('membership/email_templates') || Request::is('membership/email_configuration') ? 'display: block;' : 'display: none;' }}">
                                                <li class="{{ Request::is('membership/email_configuration')? 'active' : '' }}"><a href="/membership/email_configuration"><i class="fa fa-gears"></i> Configuration</a></li>
                                                <li class="{{ Request::is('membership/email_templates')? 'active' : '' }}"><a href="/membership/email_templates"><i class="fa fa-file-text-o"></i> Templates</a></li>
                                            </ul>
                                        </li>
                                        <li class="{{ Request::is('membership/users')? 'active' : '' }}"><a href="/membership/users"><i class="fa fa-user"></i> Users</a></li>
                                        <li class="{{ Request::is('membership/content')? 'active' : '' }}"><a href="/membership/content"><i class="fa fa-film"></i> Content</a></li>
                                    </ul>
                                </li>
                                @endif
                                @if (in_array("ACCESS_CONTROL_BASE", $permissions))
                                <li class="{{ Request::is('access_control') ? 'active' : '' }}"><a href="/access_control"><i class="fa fa-lock"></i> <span>Viewer Access</span></a></li>
                                @endif
                                @if (in_array("ADMIN_BASE", $permissions))
                                <li class="{{ Request::is('users') || Request::is('roles') ? 'active' : '' }}">
                                    <a href="#">
                                        <i class="fa fa-user"></i>
                                        <span>Administration</span>
                                        <span class="fa fa-angle-left pull-right"></span>
                                    </a>
                                    <ul class="treeview-menu">
                                        <li class="{{ Request::is('users')? 'active' : '' }}"><a href="/users"><i class="fa fa-users"></i> Authorized Users</a></li>
                                        <li class="{{ Request::is('roles')? 'active' : '' }}"><a href="/roles"><i class="fa fa-check-square-o"></i> User Roles</a></li>
                                    </ul>
                                </li> 
                                @endif       
                                @if (Session::get("user.rs") == 1 && (Session::get("user.roleId") == 2 || in_array("BULK_LOG_DELETE", $permissions)))
                                <li class="{{ Request::is('reseller') ? 'active' : '' }}">
                                    <a href="/reseller">
                                        <i class="fa fa-users"></i>
                                        <span>Sub Accounts</span>
                                    </a>
                                </li>
                                @endif
                            </ul>
                        </li>   
                        @if (in_array("CONTENT_INGEST_UPLOAD", $permissions) && !$response[0]['storage_limit_100'])
                        <li class="{{ Request::is('ingest') ? 'active' : '' }}">
                            <a href="/ingest">
                                <i class="glyphicon glyphicon-cloud-upload"></i>
                                <span style="position: relative; top: -3px;">Upload</span>
                            </a>
                        </li>  
                        @endif                        
                        @if (Session::get("user.sn") == 1)
                        <li class="{{ Request::is('social_broadcasting') ? 'active' : '' }}">
                            <a href="/social_broadcasting">
                                <i class="fa fa-users"></i>
                                <span style="position: relative; top: -2px;">Social Broadcasting</span>
                            </a>
                        </li>                       
                        @endif
                        @if (Session::get("user.cm") == 1)
                        <li class="{{ Request::is('channel_manager') ? 'active' : '' }}">
                            <a href="/channel_manager">
                                <i class="fa fa-toggle-right"></i>
                                <span style="position: relative; top: -2px;">Channel Manager</span>
                            </a>
                        </li>                       
                        @endif
                        @if (in_array("ANALYTICS_BASE", $permissions))                    
                        <li class="treeview {{ Request::is('player_stats/content_reports') || Request::is('player_stats/geo_distribution') || Request::is('player_stats/system_reports') || Request::is('player_stats/live_reports') || Request::is('historical_stats') ? 'active' : '' }}">
                            <a href="#">
                                <i class="fa fa-pie-chart"></i> 
                                <span style="position: relative; top: -3px;">Analytics</span>
                                <span class="fa fa-angle-left pull-right"></span>
                            </a>
                            <ul class="treeview-menu">
                                @if (Session::get("user.ss") == 1)
                                <li class="{{ Request::is('historical_stats')? 'active' : '' }}"><a href="/historical_stats"><i class="fa fa-area-chart"></i> Streaming Statistics</a></li>
                                @endif
                                <li class="{{ Request::is('player_stats/content_reports') || Request::is('player_stats/geo_distribution') || Request::is('player_stats/system_reports') || Request::is('player_stats/live_reports') ? 'active' : '' }}">
                                    <a href="#"><i class="fa fa-line-chart"></i> Player Statistics <span class="fa fa-angle-left pull-right"></span></a>
                                    <ul class="treeview-menu {{ Request::is('player_stats/content_reports') || Request::is('player_stats/geo_distribution') || Request::is('player_stats/system_reports') || Request::is('player_stats/live_reports') ? 'menu-open' : '' }}" style="{{ Request::is('player_stats/content_reports') || Request::is('player_stats/geo_distribution') || Request::is('player_stats/system_reports') || Request::is('player_stats/live_reports') ? 'display: block;' : 'display: none;' }}">
                                        <li class="{{ Request::is('player_stats/content_reports')? 'active' : '' }}"><a href="/player_stats/content_reports"><i class="fa fa-line-chart"></i> Content Reports</a></li>
                                        <li class="{{ Request::is('player_stats/geo_distribution')? 'active' : '' }}"><a href="/player_stats/geo_distribution"><i class="fa fa-line-chart"></i> Geographic Distribution</a></li>
                                        <li class="{{ Request::is('player_stats/system_reports')? 'active' : '' }}"><a href="/player_stats/system_reports"><i class="fa fa-line-chart"></i> System Reports</a></li>
                                        <li class="{{ Request::is('player_stats/live_reports')? 'active' : '' }}"><a href="/player_stats/live_reports"><i class="fa fa-line-chart"></i> Live Reports</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        @endif                        
                        @if (in_array("PLAYLIST_BASE", $permissions))
                        <li class="{{ Request::is('playlists') ? 'active' : '' }}">
                            <a href="/playlists">
                                <i class="fa fa-list"></i>
                                <span style="position: relative; top: -3px;">Playlists</span>
                            </a>
                        </li>
                        @endif
                        @if (in_array("CONTENT_MANAGE_BASE", $permissions))
                        <li class="{{ Request::is('categories') ? 'active' : '' }}">
                            <a href="/categories">
                                <i class="fa fa-th"></i>
                                <span style="position: relative; top: -3px;">Categories</span>
                            </a>
                        </li>
                        @endif  
                        @if (Session::get("user.vc") == 1)
                        <li class="{{ Request::is('video_chat') ? 'active' : '' }}">
                            <a href="/video_chat">
                                <i class="fa fa-video-camera"></i>
                                <span>Video Chat</span>
                            </a>
                        </li>
                        @endif
                        <li class="{{ Request::is('support_tickets') ? 'active' : '' }}">
                            <a href="/help">
                                <i class="fa fa-question-circle"></i>
                                <span style="position: relative; top: -3px;">Help</span>
                                <span class="fa fa-angle-left pull-right"></span>
                            </a>
                            <ul class="treeview-menu">
                                <li><a href="https://mediaplatform.streamingmediahosting.com/user_guide/SMH_User_Guides.zip"><i class="fa fa-question-circle"></i> Get Started</a></li>
                                <li class="{{ Request::is('support_tickets')? 'active' : '' }}"><a href="/support_tickets"><i class="fa fa-ticket"></i> Open a Ticket</a></li>
                                <li><a href="#" id="speed-test"><i class="fa fa-rocket"></i> Speed Test</a></li>
<!--                                <li>
                                    <a href="#">
                                        <i class="fa fa-wrench"></i> <span>Tools</span>
                                        <span class="fa fa-angle-left pull-right"></span>
                                    </a>
                                    <ul class="treeview-menu">
                                        <li><a href="#" onclick="smhMain.showCalc();"><i class="fa fa-calculator"></i> Streaming Calculator</a></li>
                                        <li><a href="#" id="speed-test"><i class="fa fa-rocket"></i> Speed Test</a></li>
                                        <li><a href="#" onclick="smhMain.portTest();"><i class="fa fa-circle-o"></i> Port Test</a></li>
                                        <li><a href="#" id="flash-support"><i class="fa fa-toggle-right"></i> Flash Test</a></li>
                                    </ul>
                                </li>-->
                            </ul>
                        </li>  
                    </ul>
                </section>
                <!-- /.sidebar -->
            </aside>

            <!-- Content -->
            @yield('content')

            <!-- Control Sidebar -->      
            <aside class="control-sidebar control-sidebar-dark">                
                <!-- Create the tabs -->
                @if (Session::get("user.wl") == 1 && (Session::get("user.roleId") == 2 || in_array("dropFolder.CONTENT_INGEST_DROP_FOLDER_DELETE", $permissions)))
                <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
                    <li class="active"><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>                    
                    <li><a href="#control-sidebar-layout-tab" data-toggle="tab"><i class="fa fa-wrench"></i></a></li>                    
                </ul>
                @endif
                <!-- Tab panes -->
                <div class="tab-content">
                    <!-- Settings tab content -->
                    <div class="tab-pane active" id="control-sidebar-settings-tab">            
                        <form id="settings-form" method="post">
                            <h3 class="control-sidebar-heading">User Settings</h3>

                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5 class="required">First Name</h5>
                                    <input type="text" placeholder="Enter First Name" id="firstname" name="firstname" class="form-control" value="{{addslashes(trim(Session::get('user.firstName')))}}" {{ (in_array("ACCOUNT_UPDATE_SETTINGS", $permissions))? : 'disabled' }}/>
                                </label>
                            </div><!-- /.form-group -->

                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5 class="required">Last Name</h5>
                                    <input type="text" placeholder="Enter Last Name" id="lastname" name="lastname" class="form-control" value="{{addslashes(trim(Session::get('user.lastName')))}}" {{ (in_array("ACCOUNT_UPDATE_SETTINGS", $permissions))? : 'disabled' }}/>
                                </label>
                            </div><!-- /.form-group -->

                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5 class="required">Publisher/Company Name</h5>
                                    @if (Session::get("user.cl") == 1)
                                    <input type="text" placeholder="Enter Publisher/Company" id="pubname" name="pubname" class="form-control" value="{{addslashes(trim(Session::get('user.pubName')))}}" disabled />
                                    @else
                                    <input type="text" placeholder="Enter Publisher/Company" id="pubname" name="pubname" class="form-control" value="{{addslashes(trim(Session::get('user.pubName')))}}" {{ (in_array("ACCOUNT_UPDATE_SETTINGS", $permissions))? : 'disabled' }}/>
                                    @endif         
                                </label>
                            </div><!-- /.form-group -->

                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5 class="required">Phone</h5>
                                    <input type="text" placeholder="Enter Phone" id="phone" name="phone" class="form-control" value="{{addslashes(trim(Session::get('user.phone')))}}" {{ (in_array("ACCOUNT_UPDATE_SETTINGS", $permissions))? : 'disabled' }}/>
                                </label>
                            </div><!-- /.form-group -->

                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5>Website</h5>
                                    <input type="text" placeholder="Enter Website" id="website" name="website" class="form-control" value="{{addslashes(trim(Session::get('user.website')))}}" {{ (in_array("ACCOUNT_UPDATE_SETTINGS", $permissions))? : 'disabled' }}/>
                                </label>
                            </div><!-- /.form-group -->

                            @if (in_array("ACCOUNT_UPDATE_SETTINGS", $permissions))
                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5>Email Address</h5>
                                    <a href="#" onclick="smhMain.changeEmail();">Change Email Address</a>
                                </label>                
                            </div><!-- /.form-group -->

                            <div class="form-group">
                                <label class="control-sidebar-subheading">
                                    <h5>Password</h5>
                                    <a href="#" onclick="smhMain.changePass();">Change Password</a>
                                </label>                
                            </div><!-- /.form-group -->

                            <div class="form-group">
                                <div style="height: 10px;"></div>
                                <label class="control-sidebar-subheading">
                                    <button type="button" id="save-settings" onclick="smhMain.saveSettings();" class="btn bg-olive">Save</button>
                                    <div id="settings-result"></div>
                                    <div id="loading"><img height="20px" src="/img/loading.gif"></div>
                                </label>                
                            </div><!-- /.form-group -->
                            @endif
                        </form>
                    </div><!-- /.tab-pane -->

                    @if (Session::get("user.wl") == 1)
                    <!-- Layout tab content -->
                    <div class="tab-pane" id="control-sidebar-layout-tab">      
                        <h3 class="control-sidebar-heading">White Label Settings</h3>

                        <section class="sidebar" style="height: 330px; overflow: hidden; width: auto;">
                            <ul class="layout-menu">
                                <li class="">
                                    <a href="#">
                                        <i class="fa fa-angle-right pull-left"></i>
                                        <span>Top Navbar</span>
                                    </a>

                                    <ul class="treeview-menu" style="display: none;">
                                        <form role="form" id="layout-topnav-settings">
                                            <li>
                                                <label class="control-sidebar-subheading">Settings</label>
                                                <div class="sub-options">
                                                    <div data-toggle="btn-toggle" class="btn-group">
                                                        @if (Session::get("user.wl_config.layout_top_settings") == 1)
                                                        <button class="btn btn-default btn-sm" type="button" id="top-settings-default-btn" onclick="smhMain.hideTopCustSetting();">Default</button>
                                                        <button class="btn btn-default btn-sm active" type="button" id="top-settings-custom-btn" onclick="smhMain.showTopCustSetting();">Custom</button>
                                                        @else
                                                        <button class="btn btn-default btn-sm active" type="button" id="top-settings-default-btn" onclick="smhMain.hideTopCustSetting();">Default</button>
                                                        <button class="btn btn-default btn-sm" type="button" id="top-settings-custom-btn" onclick="smhMain.showTopCustSetting();">Custom</button>
                                                        @endif
                                                    </div>
                                                    <div id="top-nav-settings-text"><i>Use default Top Navbar<br> settings.</i></div>
                                                </div>
                                                <div id="top-nav-custom">
                                                    <label class="control-sidebar-subheading">Colors</label>
                                                    <div class="sub-options">
                                                        <div class="sub-title">Background</div>
                                                        <div class="input-group top-nav-color">
                                                            @if (Session::get("user.wl_config.layout_top_settings") == 1)
                                                            <input type="text" id="top_nav_bgcolor" name="top_nav_bgcolor" value="#{{Session::get('user.wl_config.top_nav_bgcolor')}}" class="form-control" />
                                                            @else
                                                            <input type="text" id="top_nav_bgcolor" name="top_nav_bgcolor" value="#1c84b0" class="form-control" />
                                                            @endif
                                                            <span class="input-group-addon"><i></i></span>
                                                        </div>
                                                    </div>

                                                    <div class="sub-options">
                                                        <div class="sub-title">Font</div>
                                                        <div class="input-group top-nav-font-color">
                                                            @if (Session::get("user.wl_config.layout_top_settings") == 1)
                                                            <input type="text" id="top_nav_fontcolor" name="top_nav_fontcolor" value="#{{Session::get('user.wl_config.top_nav_fontcolor')}}" class="form-control" />
                                                            @else
                                                            <input type="text" id="top_nav_fontcolor" name="top_nav_fontcolor" value="#ffffff" class="form-control" />
                                                            @endif
                                                            <span class="input-group-addon"><i></i></span>
                                                        </div>
                                                    </div>

                                                    <label class="control-sidebar-subheading">Logo</label>
                                                    <div class="sub-options">
                                                        <div class="sub-title">Select Source</div>
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-default source-text"><span class="text">Custom Text</span></button>
                                                            <button data-toggle="dropdown" class="btn btn-default dropdown-toggle" type="button" aria-expanded="false">
                                                                <span class="caret"></span>
                                                            </button>
                                                            <ul role="menu" id="logo-source" class="dropdown-menu">
                                                                <li><a href="#" onclick="smhMain.custom_text_options();">Custom Text</a></li>
                                                                <li><a href="#" onclick="smhMain.custom_logo_options();">Image</a></li>
                                                            </ul>
                                                        </div>
                                                        <div id="logo-content">
                                                            <div style="width: 129px; margin-top: 10px; font-size: 11px;"><i>Publisher/Company Name<br> from your settings will be<br> used.</i></div>
                                                            <div class="sub-title">Font Size</div>
                                                            <div class="input-group col-xs-7">
                                                                <select class="form-control" id="logo-font-size" onchange="smhMain.changeLogoFontSize();">
                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                    <option value="4">4</option>
                                                                    <option value="5">5</option>
                                                                    <option value="6">6</option>
                                                                    <option value="7">7</option>
                                                                    <option value="8">8</option>
                                                                    <option value="9">9</option>
                                                                    <option value="10">10</option>
                                                                    <option value="11">11</option>
                                                                    <option value="12">12</option>
                                                                    <option value="13">13</option>
                                                                    <option value="14">14</option>
                                                                    <option value="15">15</option>
                                                                    <option value="16">16</option>
                                                                    <option value="17">17</option>
                                                                    <option value="18">18</option>
                                                                    <option value="19">19</option>
                                                                    <option value="20" selected>20</option>
                                                                    <option value="21">21</option>
                                                                    <option value="22">22</option>
                                                                    <option value="23">23</option>
                                                                    <option value="24">24</option>
                                                                    <option value="25">25</option>
                                                                    <option value="26">26</option>
                                                                    <option value="27">27</option>
                                                                    <option value="28">28</option>
                                                                    <option value="29">29</option>
                                                                    <option value="30">30</option>
                                                                </select>
                                                                <span style="position: relative; top: 5px; left: 5px;">px</span>
                                                            </div>
                                                        </div>
                                                    </div>                                               
                                                </div>
                                            </li>
                                        </form>
                                    </ul>                                    
                                </li>                       
                                <li>
                                    <a href="#">
                                        <i class="fa fa-angle-right pull-left"></i>
                                        <span>Side Navbar</span>
                                    </a>
                                    <ul class="treeview-menu" style="display: none;">
                                        <form role="form" id="layout-sidenav-settings">
                                            <li>
                                                <label class="control-sidebar-subheading">Settings</label>
                                                <div class="sub-options">
                                                    <div data-toggle="btn-toggle" class="btn-group">
                                                        @if (Session::get("user.wl_config.layout_side_settings") == 1)
                                                        <button class="btn btn-default btn-sm" type="button" onclick="smhMain.hideMenuCustSetting();">Default</button>
                                                        <button class="btn btn-default btn-sm active" type="button" onclick="smhMain.showMenuCustSetting();">Custom</button>
                                                        @else
                                                        <button class="btn btn-default btn-sm active" type="button" onclick="smhMain.hideMenuCustSetting();">Default</button>
                                                        <button class="btn btn-default btn-sm" type="button" onclick="smhMain.showMenuCustSetting();">Custom</button>
                                                        @endif
                                                    </div>
                                                    <div id="side-nav-settings-text"><i>Use default Side Navbar<br> settings.</i></div>
                                                </div>
                                                <div id="menu-nav-custom">
                                                    <label class="control-sidebar-subheading">Colors</label>
                                                    <div class="sub-options">
                                                        <div class="sub-title">Background</div>
                                                        <div class="input-group side-nav-color">
                                                            @if (Session::get("user.wl_config.layout_side_settings") == 1)
                                                            <input type="text" id="side_nav_bgcolor" name="side_nav_bgcolor" value="#{{Session::get('user.wl_config.side_nav_bgcolor')}}" class="form-control" />
                                                            @else
                                                            <input type="text" id="side_nav_bgcolor" name="side_nav_bgcolor" value="#222d32" class="form-control" />
                                                            @endif
                                                            <span class="input-group-addon"><i></i></span>
                                                        </div>
                                                    </div>

                                                    <div class="sub-options">
                                                        <div class="sub-title">Font</div>
                                                        <div class="input-group side-nav-font-color">
                                                            @if (Session::get("user.wl_config.layout_side_settings") == 1)
                                                            <input type="text" id="side_nav_fontcolor" name="side_nav_fontcolor" value="#{{Session::get('user.wl_config.side_nav_fontcolor')}}" class="form-control" />
                                                            @else
                                                            <input type="text" id="side_nav_fontcolor" name="side_nav_fontcolor" value="#b8c7ce" class="form-control" />
                                                            @endif
                                                            <span class="input-group-addon"><i></i></span>
                                                        </div>
                                                    </div>

                                                    <div class="sub-options">
                                                        <div class="sub-title">Sub-Menu Background</div>
                                                        <div class="input-group side-nav-submenu-color">
                                                            @if (Session::get("user.wl_config.layout_side_settings") == 1)
                                                            <input type="text" id="side_nav_sub_bgcolor" name="side_nav_sub_bgcolor" value="#{{Session::get('user.wl_config.side_nav_sub_bgcolor')}}" class="form-control" />
                                                            @else
                                                            <input type="text" id="side_nav_sub_bgcolor" name="side_nav_sub_bgcolor" value="#2c3b41" class="form-control" />
                                                            @endif
                                                            <span class="input-group-addon"><i></i></span>
                                                        </div>
                                                    </div>                 

                                                    <div class="sub-options">
                                                        <div class="sub-title">Sub-Menu Font</div>
                                                        <div class="input-group side-nav-submenu-font-color">
                                                            @if (Session::get("user.wl_config.layout_side_settings") == 1)
                                                            <input type="text" id="side_nav_sub_fontcolor" name="side_nav_sub_fontcolor" value="#{{Session::get('user.wl_config.side_nav_sub_fontcolor')}}" class="form-control" />
                                                            @else
                                                            <input type="text" id="side_nav_sub_fontcolor" name="side_nav_sub_fontcolor" value="#8aa4af" class="form-control" />
                                                            @endif
                                                            <span class="input-group-addon"><i></i></span>
                                                        </div>
                                                    </div> 
                                                </div>
                                            </li>
                                        </form>
                                    </ul>
                                </li>
                            </ul>
                            <div class="form-group">
                                <div style="height: 10px;"></div>
                                <label class="control-sidebar-subheading">
                                    <button type="button" id="save-layout" onclick="smhMain.saveLayout();" class="btn bg-olive">Save</button>
                                    <div id="layout-result"></div>
                                    <div id="loading"><img height="20px" src="/img/loading.gif"></div>
                                </label>                
                            </div><!-- /.form-group -->
                        </section>
                    </div><!-- /.tab-pane -->
                    @endif
                </div>
            </aside><!-- /.control-sidebar -->
            <!-- Add the sidebar's background. This div must be placed
                 immediately after the control sidebar -->
            <div class='control-sidebar-bg'></div>
        </div><!-- ./wrapper -->

        <!-- Scripts -->
        <script>var flashvars = {}; flashvars.myIP = '<?php echo $_SERVER['HTTP_X_FORWARDED_FOR'] ?>'</script>
        <script src="/js/jQuery-2.1.4.min.js?v=1" type="text/javascript"></script>
        <script src="//code.jquery.com/ui/1.10.3/jquery-ui.js?v=1"></script>
        <script src="/js/bootstrap.min.js?v=1" type="text/javascript"></script>
        <script src="/js/jquery.slimscroll.min.js?v=1" type="text/javascript"></script>
        <script src="/js/jquery.form.js?v=1" type="text/javascript"></script>
        <script src="/js/jquery.dataTables.js?v=1" type="text/javascript"></script>
        <script src="/js/paging.js?v=1" type="text/javascript"></script>
        <script src="/js/ColReorderWithResize.js?v=1" type="text/javascript"></script>
        <script src="/js/fastclick.min.js?v=1" type="text/javascript"></script>
        <script src="/js/app.min.js?v=1" type="text/javascript"></script>
        <script src="/js/demo.js?v=1" type="text/javascript"></script>
        <script src="/js/bootstrap-colorpicker.js?v=1" type="text/javascript"></script>
        <script src="/js/jquery.tooltipster.min.js?v=1" type="text/javascript"></script>
        <script src="/js/jquery.validate.min.js?v=1" type="text/javascript"></script>
        <script src="/js/jquery.dotdotdot.min.js?v=1" type="text/javascript"></script>
        <script src="/js/smh.min.js?v=1" type="text/javascript"></script>
        <script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js?v=1" type="text/javascript"></script>
        <script src="/js/main.js?v=1" type="text/javascript"></script>
        @if (Session::get("user.wl_config.layout_top_settings") == 1 || Session::get("user.wl_config.layout_side_settings") == 1)
        <script>
            $(document).ready(function(){
            @if (Session::get("user.wl_config.layout_top_settings") == 1 && Session::get("user.wl") == 1 && Session::get("user.fpl") == 0 && Session::get("user.cl") == 0)
                    @if (Session::get("user.wl_config.layout_logo_text") == 1)
                    smhMain.activeLogoText({{Session::get("user.wl_config.logo_font_size")}});
            @endif
                    @if (Session::get("user.wl_config.layout_logo_image") == 1)
                    smhMain.activeLogoImage({{Session::get("user.id")}}, '{{Session::get("user.wl_config.layout_logoid")}}');
            @endif
                    smhMain.activeTopCustSettings('#{{Session::get("user.wl_config.top_nav_bgcolor")}}');
            @endif
                    @if (Session::get("user.wl_config.layout_top_settings") == 1 && Session::get("user.wl") == 0 && (Session::get("user.fpl") == 1 || Session::get("user.cl") == 1))
                    smhMain.activeTopCustSettings('#{{Session::get("user.wl_config.top_nav_bgcolor")}}');
            @endif
                    @if (Session::get("user.wl_config.layout_side_settings") == 1)
                    smhMain.activeSideCustSettings('#{{Session::get("user.wl_config.side_nav_bgcolor")}}');
            @endif
            });
        </script>
        @endif
        @yield('footer')

        <!-- Modal -->
        <div class="modal fade" id="smh-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog smh-dialog">
                <div class="modal-content">
                    <div class="modal-header"></div>
                    <div class="modal-body"></div>
                    <div class="clear"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
    </body>
</html>
