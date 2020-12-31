<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Help;
use Illuminate\Http\Request;
use Session;

class PagesController extends Controller {

    //Dashboard Page
    public function dashboard() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        //return view('pages.dashboardFW')->with($data);
        return view('pages.dashboard')->with($data);
    }

    //Dashboard VR Page
    public function dashboardVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        return view('pages.dashboardVR')->with($data);
    }

    //Content Page
    public function content() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        $expire = time() + 60 * 60 * 24 * 1;
        setcookie("skiphowto", '1', $expire, '/', 'mediaplatform.streamingmediahosting.com', false);
        //return view('pages.contentFW')->with($data);
        return view('pages.content')->with($data);
    }

    //Content VR Page
    public function contentVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        $expire = time() + 60 * 60 * 24 * 1;
        setcookie("skiphowto", '1', $expire, '/', 'mediaplatform.streamingmediahosting.com', false);
        return view('pages.contentVR')->with($data);
    }

    public function livestream() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        //return view('pages.livestreamsFW')->with($data);
        return view('pages.livestreams')->with($data);
    }

    public function livestreamVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        return view('pages.livestreamsVR')->with($data);
    }

    public function socialBroadcasting() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (Session::get("user.sn") == 1) {
            return view('pages.social_broadcasting')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function socialBroadcastingVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (Session::get("user.sn") == 1) {
            return view('pages.social_broadcastingVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function channelManager() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (Session::get("user.cm") == 1) {
            //return view('pages.channel_managerFW')->with($data);
            return view('pages.channel_manager')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function channelManagerVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (Session::get("user.cm") == 1) {
            return view('pages.channel_managerVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function playlists() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("PLAYLIST_BASE", $permissions)) {
            //return view('pages.playlistsFW')->with($data);
            return view('pages.playlists')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function playlistsVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("PLAYLIST_BASE", $permissions)) {
            return view('pages.playlistsVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Categories Page
    public function categories() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("CONTENT_MANAGE_BASE", $permissions)) {
            //return view('pages.categoriesFW')->with($data);
            return view('pages.categories')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Categories Page
    public function categoriesVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("CONTENT_MANAGE_BASE", $permissions)) {
            return view('pages.categoriesVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Access Control Page
    public function ac() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("ACCESS_CONTROL_BASE", $permissions)) {
            //return view('pages.acFW')->with($data);
            return view('pages.ac')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Access Control Page
    public function acVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("ACCESS_CONTROL_BASE", $permissions)) {
            return view('pages.acVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Transcoding Page
    public function transcodingVOD() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("TRANSCODING_BASE", $permissions)) {
            //return view('pages.transcodingVODFW')->with($data);
            return view('pages.transcodingVOD')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function transcodingLive() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("TRANSCODING_BASE", $permissions)) {
            return view('pages.transcodingLive')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Transcoding Page
    public function transcodingVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("TRANSCODING_BASE", $permissions)) {
            return view('pages.transcodingVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function paymentGateway() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_gateway')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function paymentGatewayVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_gatewayVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function emailConfiguration() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_email_configuration')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function emailConfigurationVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_email_configurationVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function emailTemplates() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_email_templates')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function emailTemplatesVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_email_templatesVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvUsers() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_users')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvUsersVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_usersVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvTickets() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_tickets')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvTicketsVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_ticketsVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvContent() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_content')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvContentVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_contentVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvOrders() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_orders')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvOrdersVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_ordersVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvAffiliates() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_affiliates')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function ppvAffiliatesVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DOWNLOAD", $permissions) && Session::get("user.ppv") == 1) {
            return view('pages.ppv_affiliatesVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memEmailConfiguration() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_email_configuration')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memEmailConfigurationVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_email_configurationVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memEmailTemplates() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_email_templates')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memEmailTemplatesVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_email_templatesVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memUsers() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_users')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memUsersVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_usersVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memContent() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_contentFW')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function memContentVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("SYNDICATION_ADD", $permissions) && Session::get("user.membership") == 1) {
            return view('pages.mem_contentVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function historicalStats() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            $stats_pass = substr(md5(strtolower($pid . '_MP') . 'mp23df2h'), 0, 15);
            $stats_url = 'https://stats.streamingmediahosting.com/?dp+templates.profile.index+p+' . $pid . '+webvars.username+' . $pid . '+webvars.password+' . $stats_pass;
            $ch = curl_init($stats_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            // get headers too with this line
            curl_setopt($ch, CURLOPT_HEADER, 1);
            $result = curl_exec($ch);

            // get cookies
            $cookies = array();
            preg_match_all('/Set-Cookie:(?<cookie>\s{0,}.*)$/im', $result, $cookies);
            $stats_cookie1 = explode('=', $cookies[1][1]);
            $stats_cookie2 = explode(';', $stats_cookie1[1]);
            $myCookie = $stats_cookie2[0];

            $expire = time() + 60 * 60 * 24 * 1;

            setcookie("authsessionid", $myCookie, $expire, '/', 'mediaplatform.streamingmediahosting.com', false);

            return view('pages.historical_stats')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function historicalStatsVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            $stats_pass = substr(md5(strtolower($pid . '_MP') . 'mp23df2h'), 0, 15);
            $stats_url = 'https://stats.streamingmediahosting.com/?dp+templates.profile.index+p+' . $pid . '+webvars.username+' . $pid . '+webvars.password+' . $stats_pass;
            $ch = curl_init($stats_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            // get headers too with this line
            curl_setopt($ch, CURLOPT_HEADER, 1);
            $result = curl_exec($ch);

            // get cookies
            $cookies = array();
            preg_match_all('/Set-Cookie:(?<cookie>\s{0,}.*)$/im', $result, $cookies);
            $stats_cookie1 = explode('=', $cookies[1][1]);
            $stats_cookie2 = explode(';', $stats_cookie1[1]);
            $myCookie = $stats_cookie2[0];

            $expire = time() + 60 * 60 * 24 * 1;

            setcookie("authsessionid", $myCookie, $expire, '/', 'vr.streamingmediahosting.com', false);

            return view('pages.historical_statsVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function contentReports() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.content_reports')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function contentReportsVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.content_reportsVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function geoDistribution() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.geo_dist')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function geoDistributionVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.geo_distVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function systemReports() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.system_reports')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function systemReportsVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.system_reportsVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function liveReports() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.live_reports')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function liveReportsVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            return view('pages.live_reportsVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    //Reseller Page
    public function reseller() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DELETE", $permissions)) {
            return view('pages.reseller')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    //Reseller Page
    public function resellerVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("BULK_LOG_DELETE", $permissions)) {
            return view('pages.resellerVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    //Upload Page
    public function upload() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("CONTENT_INGEST_UPLOAD", $permissions)) {
            //return view('pages.uploadFW')->with('status', $response);
            return view('pages.upload')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    //Upload Page
    public function uploadVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("CONTENT_INGEST_UPLOAD", $permissions)) {
            return view('pages.uploadVR')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    //Administration Users Page
    public function users() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("ADMIN_BASE", $permissions)) {
            return view('pages.users')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Administration Users Page
    public function usersVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("ADMIN_BASE", $permissions)) {
            return view('pages.usersVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Roles Page
    public function roles() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("ADMIN_BASE", $permissions)) {
            return view('pages.roles')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Roles Page
    public function rolesVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("ADMIN_BASE", $permissions)) {
            return view('pages.rolesVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    //Help Page
    public function supportTickets() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        return view('pages.supportTickets')->with('status', $response);
    }

    //Help Page
    public function helpVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        return view('pages.helpVR')->with('status', $response);
    }

    //New Ticket Page
    public function newticket() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        return view('pages.newticket')->with('status', $response);
    }

    //New Ticket Page
    public function newticketVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        return view('pages.newticketVR')->with('status', $response);
    }

    //InP API Calls Page
    public function inpAPICalls() {

        //run the API Calls
        //$pid = Session::get("user.id");
        //$url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        //$response = json_decode($this->curl_request($url), true);
        return view('pages.inp_api_calls');
    }

    public function players() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("STUDIO_BASE", $permissions)) {
            return view('pages.players')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function playersVR() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        $data = array('status' => $response, 'permissions' => $permissions);
        if (in_array("STUDIO_BASE", $permissions)) {
            return view('pages.playersVR')->with($data);
        } else {
            return view('errors.401');
        }
    }

    public function videoChat() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        if (Session::get("user.vc") == 1) {
            return view('pages.video_chat')->with('status', $response);
        } else {
            return view('errors.401');
        }
    }

    public function curl_request($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

}
