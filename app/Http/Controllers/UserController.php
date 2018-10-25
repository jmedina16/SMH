<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Request;
use App\Models\Help;
use Input;
use Auth;
use Session;
use Log;

class UserController extends Controller {

    public function login() {
        $success = array('success' => false);
        $username = rawurldecode(Input::get('email'));
        $password = rawurldecode(Input::get('password'));
        if (Auth::attempt(array('username' => $username, 'password' => $password))) {
            $success = array('success' => true);
        } else {
            $success = array('success' => false);
        }

        return $success;
    }

    public function logout() {
        setcookie("kmcks", "", time() - 3600, '/', 'mediaplatform.streamingmediahosting.com');
        setcookie("authsessionid", "", time() - 3600, '/', 'mediaplatform.streamingmediahosting.com');
        setcookie("email", "", time() - 3600, '/', 'mediaplatform.streamingmediahosting.com');
        setcookie("pid", "", time() - 3600, '/', 'mediaplatform.streamingmediahosting.com');
        setcookie("uid", "", time() - 3600, '/', 'mediaplatform.streamingmediahosting.com');
        Session::flush();
    }

    public function updateSettings() {
        $firstName = urldecode(Input::get('firstName'));
        $lastName = urldecode(Input::get('lastName'));
        $pubName = urldecode(Input::get('pubName'));
        $phone = urldecode(Input::get('phone'));
        $website = urldecode(Input::get('website'));
        Session::set('user.firstName', $firstName);
        Session::set('user.lastName', $lastName);
        Session::set('user.fullName', $firstName . ' ' . $lastName);
        Session::set('user.pubName', $pubName);
        Session::set('user.phone', $phone);
        Session::set('user.website', $website);
        $success = array('success' => true);
        return $success;
    }

    public function updateEmail() {
        $email = urldecode(Input::get('email'));
        Session::set('user.userName', $email);
        $success = array('success' => true);
        return $success;
    }

    public function updateLayout() {
        $action = urldecode(Request::input('action'));
        $pid = urldecode(Request::input('pid'));
        $layout_top_settings = urldecode(Request::input('layout_top_settings'));
        $top_nav_bgcolor = urldecode(Request::input('top_nav_bgcolor'));
        $top_nav_fontcolor = urldecode(Request::input('top_nav_fontcolor'));
        $layout_logo_image = urldecode(Request::input('layout_logo_image'));
        $layout_logoid = urldecode(Request::input('layout_logoid'));
        $layout_logo_text = urldecode(Request::input('layout_logo_text'));
        $logo_font_size = urldecode(Request::input('logo_font_size'));
        $layout_side_settings = urldecode(Request::input('layout_side_settings'));
        $side_nav_bgcolor = urldecode(Request::input('side_nav_bgcolor'));
        $side_nav_fontcolor = urldecode(Request::input('side_nav_fontcolor'));
        $side_nav_sub_bgcolor = urldecode(Request::input('side_nav_sub_bgcolor'));
        $side_nav_sub_fontcolor = urldecode(Request::input('side_nav_sub_fontcolor'));

        $fields = array(
            'action' => $action,
            'pid' => $pid,
            'layout_top_settings' => $layout_top_settings,
            'top_nav_bgcolor' => $top_nav_bgcolor,
            'top_nav_fontcolor' => $top_nav_fontcolor,
            'layout_logo_image' => $layout_logo_image,
            'layout_logoid' => $layout_logoid,
            'layout_logo_text' => $layout_logo_text,
            'logo_font_size' => $logo_font_size,
            'layout_side_settings' => $layout_side_settings,
            'side_nav_bgcolor' => $side_nav_bgcolor,
            'side_nav_fontcolor' => $side_nav_fontcolor,
            'side_nav_sub_bgcolor' => $side_nav_sub_bgcolor,
            'side_nav_sub_fontcolor' => $side_nav_sub_fontcolor
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/layout.php';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['success']) {
            Session::set('user.wl_config.layout_top_settings', (($layout_top_settings == 'true') ? 1 : 0));
            Session::set('user.wl_config.top_nav_bgcolor', $top_nav_bgcolor);
            Session::set('user.wl_config.top_nav_fontcolor', $top_nav_fontcolor);
            Session::set('user.wl_config.layout_logo_image', (($layout_logo_image == 'true') ? 1 : 0));
            Session::set('user.wl_config.layout_logoid', $layout_logoid);
            Session::set('user.wl_config.layout_logo_text', (($layout_logo_text == 'true') ? 1 : 0));
            Session::set('user.wl_config.logo_font_size', $logo_font_size);
            Session::set('user.wl_config.layout_side_settings', (($layout_side_settings == 'true') ? 1 : 0));
            Session::set('user.wl_config.side_nav_bgcolor', $side_nav_bgcolor);
            Session::set('user.wl_config.side_nav_fontcolor', $side_nav_fontcolor);
            Session::set('user.wl_config.side_nav_sub_bgcolor', $side_nav_sub_bgcolor);
            Session::set('user.wl_config.side_nav_sub_fontcolor', $side_nav_sub_fontcolor);
            $success = array('success' => true);
            echo json_encode($success);
        }
    }

    public function updateResellerLayout() {
        $action = urldecode(Request::input('action'));
        $pid = urldecode(Request::input('pid'));
        $layout_top_settings = urldecode(Request::input('layout_top_settings'));
        $top_nav_bgcolor = urldecode(Request::input('top_nav_bgcolor'));
        $top_nav_fontcolor = urldecode(Request::input('top_nav_fontcolor'));
        $layout_logo_image = urldecode(Request::input('layout_logo_image'));
        $layout_logoid = urldecode(Request::input('layout_logoid'));
        $layout_logo_text = urldecode(Request::input('layout_logo_text'));
        $logo_font_size = urldecode(Request::input('logo_font_size'));
        $layout_side_settings = urldecode(Request::input('layout_side_settings'));
        $side_nav_bgcolor = urldecode(Request::input('side_nav_bgcolor'));
        $side_nav_fontcolor = urldecode(Request::input('side_nav_fontcolor'));
        $side_nav_sub_bgcolor = urldecode(Request::input('side_nav_sub_bgcolor'));
        $side_nav_sub_fontcolor = urldecode(Request::input('side_nav_sub_fontcolor'));

        $fields = array(
            'action' => $action,
            'pid' => $pid,
            'layout_top_settings' => $layout_top_settings,
            'top_nav_bgcolor' => $top_nav_bgcolor,
            'top_nav_fontcolor' => $top_nav_fontcolor,
            'layout_logo_image' => $layout_logo_image,
            'layout_logoid' => $layout_logoid,
            'layout_logo_text' => $layout_logo_text,
            'logo_font_size' => $logo_font_size,
            'layout_side_settings' => $layout_side_settings,
            'side_nav_bgcolor' => $side_nav_bgcolor,
            'side_nav_fontcolor' => $side_nav_fontcolor,
            'side_nav_sub_bgcolor' => $side_nav_sub_bgcolor,
            'side_nav_sub_fontcolor' => $side_nav_sub_fontcolor
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/layout.php';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['success']) {
            $success = array('success' => true);
            echo json_encode($success);
        } else {
            $success = array('success' => false);
            echo json_encode($success);
        }
    }

    public function getUserTickets() {
        $start = Input::get('start');
        $length = Input::get('length');
        $draw = Input::get('draw');
        $tz = Input::get('tz');
        $help = new Help(Session::get("user.userName"));
        $content = $help->getUserTickets($start, $length, $draw, $tz);
        return $content;
    }

    public function submitTicket() {
        $data = array(
            'name' => Request::input('name'),
            'email' => Request::input('useremail'),
            'subject' => Request::input('subject'),
            'message' => Request::input('message'),
            'ip' => Request::input('ip'),
            'topicId' => Request::input('topicId')
        );
        if (Input::has('phone')) {
            $data['phone'] = Request::input('phone');
        }
        $result = $this->help_curl_request($data);
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->simple_curl_request($url), true);

        $data = array(
            'result' => $result,
            'status' => $response
        );

        return view('pages.thankyou')->with($data);
    }

    public function submitTicketVR() {
        $data = array(
            'name' => Request::input('name'),
            'email' => Request::input('useremail'),
            'subject' => Request::input('subject'),
            'message' => Request::input('message'),
            'ip' => Request::input('ip'),
            'topicId' => Request::input('topicId')
        );
        if (Input::has('phone')) {
            $data['phone'] = Request::input('phone');
        }
        $result = $this->help_curl_request($data);
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->simple_curl_request($url), true);

        $data = array(
            'result' => $result,
            'status' => $response
        );

        return view('pages.thankyouVR')->with($data);
    }

    public function updateUserServices() {
        $success = array('success' => false);
        $fields = array(
            'pid' => Request::input('pid'),
            'streaming_mobile' => Request::input('streaming_mobile'),
            'transcoding_vod' => Request::input('transcoding_vod'),
            'pay_per_view' => Request::input('pay_per_view'),
            'membership' => Request::input('membership'),
            'streaming_live_chat' => Request::input('streaming_live_chat'),
            'white_label' => Request::input('white_label'),
            'force_parent_layout' => Request::input('force_parent_layout'),
            'use_custom_layout' => Request::input('use_custom_layout')
        );
        $url = 'http://10.5.25.17/index.php/api/reseller/updateServices.json';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['result'] == 'success') {
            $success = array('success' => true);
            echo json_encode($success);
        } else {
            echo json_encode($success);
        }
    }

    public function updateUserLimits() {
        $success = array('success' => false);
        $fields = array(
            'childId' => Request::input('childId'),
            'storage_limit' => Request::input('storage_limit'),
            'bandwidth_limit' => Request::input('bandwidth_limit')
        );
        $url = 'http://10.5.25.17/index.php/api/reseller/updateLimits.json';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['result'] == 'success') {
            $success = array('success' => true);
            echo json_encode($success);
        } else {
            echo json_encode($success);
        }
    }

    public function createResellerAccount() {
        $success = array('success' => false);
        $fields = array(
            'ks' => Request::input('ks'),
            'action' => Request::input('action'),
            'parentId' => Request::input('parentId'),
            'businessName' => Request::input('businessName'),
            'businessDescription' => Request::input('businessDescription'),
            'ownerName' => Request::input('ownerName'),
            'ownerEmail' => Request::input('ownerEmail')
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/reseller/v1.0/index.php';
        $response = json_decode($this->curl_request($url, $fields), true);
        if (isset($response['Error'])) {
            $success = array('error' => true, 'message' => 'Error: Email already exists!');
            echo json_encode($success);
        } else {
            $success = array('success' => true, 'child_id' => $response['child_id']);
            echo json_encode($success);
        }
    }

    public function updateResellerAccount() {
        $success = array('success' => false);
        $fields = array(
            'ks' => Request::input('ks'),
            'action' => Request::input('action'),
            'parentId' => Request::input('parentId'),
            'childId' => Request::input('childId'),
            'businessName' => Request::input('businessName'),
            'businessDescription' => Request::input('businessDescription'),
            'ownerName' => Request::input('ownerName'),
            'ownerEmail' => Request::input('ownerEmail')
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/reseller/v1.0/index.php';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['result'] == 'success!') {
            $success = array('success' => true);
            echo json_encode($success);
        } else {
            echo json_encode($success);
        }
    }

    public function updateResellerStatus() {
        $success = array('success' => false);
        $fields = array(
            'ks' => Request::input('ks'),
            'action' => Request::input('action'),
            'parentId' => Request::input('parentId'),
            'childId' => Request::input('childId'),
            'status' => Request::input('status'),
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/reseller/v1.0/index.php';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['result'] == 'success') {
            $success = array('success' => true);
            echo json_encode($success);
        } else {
            echo json_encode($success);
        }
    }

    public function deleteResellerAccount() {
        $success = array('success' => false);
        $fields = array(
            'ks' => Request::input('ks'),
            'action' => Request::input('action'),
            'parentId' => Request::input('parentId'),
            'childId' => Request::input('childId')
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/reseller/v1.0/index.php';
        $response = json_decode($this->curl_request($url, $fields), true);
        if ($response['result'] == 'success') {
            $success = array('success' => true);
            echo json_encode($success);
        } else {
            echo json_encode($success);
        }
    }

    public function getLayout() {
        $action = urldecode(Request::input('action'));
        $pid = urldecode(Request::input('pid'));

        $fields = array(
            'action' => $action,
            'pid' => $pid,
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/layout.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getUsers() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $id = Request::input('id');
        $m = Request::input('m');
        $d = Request::input('d');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'id' => $id,
            'delete' => ($d == 'true') ? 1 : 0,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/admin_getUsers.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getRoles() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $d = Request::input('d');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'delete' => ($d == 'true') ? 1 : 0,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/admin_getRoles.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getAC() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $d = Request::input('d');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'delete' => ($d == 'true') ? 1 : 0,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getAC.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getACFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $d = Request::input('d');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'delete' => ($d == 'true') ? 1 : 0,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://meddev2/apps/platform/getAC.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getTrans() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $d = Request::input('d');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'delete' => ($d == 'true') ? 1 : 0,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getTrans.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getCategories() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'search' => $search['value'],
            'draw' => $draw,
            'tz' => $tz,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getCategories.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getCategoriesFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'search' => $search['value'],
            'draw' => $draw,
            'tz' => $tz,
            'modify' => ($m == 'true') ? 1 : 0
        );
        $url = 'http://meddev2/apps/platform/getCategories.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function updateAlertAckd() {
        $alert = urldecode(Request::input('alert'));
        $pid = urldecode(Request::input('pid'));

        $fields = array(
            'alert' => $alert,
            'pid' => $pid,
        );
        $url = 'http://10.5.25.17/index.php/api/accounts/updateAlertAckd.json';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getTableContent() {
        $action = Request::input('table');
        $offset = Request::input('offset');
        $from = Request::input('from');
        $to = Request::input('to');
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $ks = Request::input('ks');
        $objectId = (Request::input('objectId') || Request::input('objectId') != '' || Request::input('objectId') != null) ? Request::input('objectId') : null;
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'offset' => $offset,
            'from' => $from,
            'to' => $to,
            'action' => $action,
            'objectId' => $objectId
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/player.stats.tables.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getTableContentFW() {
        $action = Request::input('table');
        $offset = Request::input('offset');
        $from = Request::input('from');
        $to = Request::input('to');
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $ks = Request::input('ks');
        $objectId = (Request::input('objectId') || Request::input('objectId') != '' || Request::input('objectId') != null) ? Request::input('objectId') : null;
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'offset' => $offset,
            'from' => $from,
            'to' => $to,
            'action' => $action,
            'objectId' => $objectId
        );
        $url = 'http://meddev2/apps/platform/player.stats.tables.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getChannelEntries() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $pid = Request::input('pid');
        $cid = Request::input('cid');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'pid' => $pid,
            'action' => 'get_channel_entries',
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'cid' => $cid,
            'search' => $search['value']
        );
        $url = 'http://devplatform.streamingmediahosting.com/apps/channel/v1.0/index.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getPlaylists() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $d = Request::input('d');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value'],
            'modify' => ($m == 'true') ? 1 : 0,
            'delete' => ($d == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/playlists.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getPlaylistsFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $m = Request::input('m');
        $d = Request::input('d');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value'],
            'modify' => ($m == 'true') ? 1 : 0,
            'delete' => ($d == 'true') ? 1 : 0
        );
        $url = 'http://meddev2/apps/platform/playlists.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getPlayers() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $pid = Request::input('pid');
        $m = Request::input('m');
        $d = Request::input('d');
        $search = Request::input('search');
        $fields = array(
            'pid' => $pid,
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value'],
            'modify' => ($m == 'true') ? 1 : 0,
            'delete' => ($d == 'true') ? 1 : 0
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/players.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getPlayersFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $pid = Request::input('pid');
        $m = Request::input('m');
        $d = Request::input('d');
        $search = Request::input('search');
        $fields = array(
            'pid' => $pid,
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value'],
            'modify' => ($m == 'true') ? 1 : 0,
            'delete' => ($d == 'true') ? 1 : 0
        );
        $url = 'http://meddev2/apps/platform/players.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getPlaylistsEntries() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/playlists.entries.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getPlaylistsEntriesFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors
        );
        $url = 'http://meddev2/apps/platform/playlists.entries.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getEntries() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $modify_perm = Request::input('modify_perm');
        $delete_perm = Request::input('delete_perm');
        $ac_perm = Request::input('ac_perm');
        $thumb_perm = Request::input('thumb_perm');
        $stats_perm = Request::input('stats_perm');
        $download_perm = Request::input('download_perm');
        $flavors_perm = Request::input('flavors_perm');
        $clip_perm = Request::input('clip_perm');
        $captions_perm = Request::input('captions_perm');
        $sn = Request::input('sn');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors,
            'modify_perm' => ($modify_perm == 'true') ? 1 : 0,
            'delete_perm' => ($delete_perm == 'true') ? 1 : 0,
            'ac_perm' => ($ac_perm == 'true') ? 1 : 0,
            'thumb_perm' => ($thumb_perm == 'true') ? 1 : 0,
            'stats_perm' => ($stats_perm == 'true') ? 1 : 0,
            'download_perm' => ($download_perm == 'true') ? 1 : 0,
            'flavors_perm' => ($flavors_perm == 'true') ? 1 : 0,
            'clip_perm' => ($clip_perm == 'true') ? 1 : 0,
            'captions_perm' => ($captions_perm == 'true') ? 1 : 0,
            'sn' => $sn
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/entries.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getEntriesFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $modify_perm = Request::input('modify_perm');
        $delete_perm = Request::input('delete_perm');
        $ac_perm = Request::input('ac_perm');
        $thumb_perm = Request::input('thumb_perm');
        $stats_perm = Request::input('stats_perm');
        $download_perm = Request::input('download_perm');
        $flavors_perm = Request::input('flavors_perm');
        $clip_perm = Request::input('clip_perm');
        $captions_perm = Request::input('captions_perm');
        $sn = Request::input('sn');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors,
            'modify_perm' => ($modify_perm == 'true') ? 1 : 0,
            'delete_perm' => ($delete_perm == 'true') ? 1 : 0,
            'ac_perm' => ($ac_perm == 'true') ? 1 : 0,
            'thumb_perm' => ($thumb_perm == 'true') ? 1 : 0,
            'stats_perm' => ($stats_perm == 'true') ? 1 : 0,
            'download_perm' => ($download_perm == 'true') ? 1 : 0,
            'flavors_perm' => ($flavors_perm == 'true') ? 1 : 0,
            'clip_perm' => ($clip_perm == 'true') ? 1 : 0,
            'captions_perm' => ($captions_perm == 'true') ? 1 : 0,
            'sn' => $sn
        );
        $url = 'http://meddev2/apps/platform/entries.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getVREntries() {
        $action = Request::input('action');
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $modify_perm = Request::input('modify_perm');
        $delete_perm = Request::input('delete_perm');
        $ac_perm = Request::input('ac_perm');
        $thumb_perm = Request::input('thumb_perm');
        $stats_perm = Request::input('stats_perm');
        $download_perm = Request::input('download_perm');
        $flavors_perm = Request::input('flavors_perm');
        $sn = Request::input('sn');
        $fields = array(
            'action' => $action,
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors,
            'modify_perm' => ($modify_perm == 'true') ? 1 : 0,
            'delete_perm' => ($delete_perm == 'true') ? 1 : 0,
            'ac_perm' => ($ac_perm == 'true') ? 1 : 0,
            'thumb_perm' => ($thumb_perm == 'true') ? 1 : 0,
            'stats_perm' => ($stats_perm == 'true') ? 1 : 0,
            'download_perm' => ($download_perm == 'true') ? 1 : 0,
            'flavors_perm' => ($flavors_perm == 'true') ? 1 : 0,
            'sn' => $sn
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/vr.entries.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getProgramEntries() {
        $action = Request::input('action');
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $modify_perm = Request::input('modify_perm');
        $delete_perm = Request::input('delete_perm');
        $ac_perm = Request::input('ac_perm');
        $thumb_perm = Request::input('thumb_perm');
        $stats_perm = Request::input('stats_perm');
        $download_perm = Request::input('download_perm');
        $flavors_perm = Request::input('flavors_perm');
        $sn = Request::input('sn');
        $fields = array(
            'action' => $action,
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors,
            'modify_perm' => ($modify_perm == 'true') ? 1 : 0,
            'delete_perm' => ($delete_perm == 'true') ? 1 : 0,
            'ac_perm' => ($ac_perm == 'true') ? 1 : 0,
            'thumb_perm' => ($thumb_perm == 'true') ? 1 : 0,
            'stats_perm' => ($stats_perm == 'true') ? 1 : 0,
            'download_perm' => ($download_perm == 'true') ? 1 : 0,
            'flavors_perm' => ($flavors_perm == 'true') ? 1 : 0
        );
        $url = 'http://devplatform.streamingmediahosting.com/apps/platform/program.entries.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getProgramPlaylists() {
        $action = Request::input('action');
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $search = Request::input('search');
        $fields = array(
            'action' => $action,
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value']
        );
        $url = 'http://devplatform.streamingmediahosting.com/apps/platform/program.playlists.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getRBPlaylistsEntries() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $limit = Request::input('limit');
        $order = Request::input('orderby');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors,
            'limit' => $limit,
            'order' => $order
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/playlists.entries.rb.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getRBPlaylistsEntriesFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $limit = Request::input('limit');
        $order = Request::input('orderby');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors,
            'limit' => $limit,
            'order' => $order
        );
        $url = 'http://meddev2/apps/platform/playlists.entries.rb.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getLiveStreams() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $ac = Request::input('ac');
        $category = Request::input('category');
        $search = Request::input('search');
        $pid = Request::input('pid');
        $m = Request::input('m');
        $d = Request::input('d');
        $config_perm = Request::input('config_perm');
        $ac_perm = Request::input('ac_perm');
        $thumb_perm = Request::input('thumb_perm');
        $stats_perm = Request::input('stats_perm');
        $sn = Request::input('sn');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'ac' => $ac,
            'search' => $search['value'],
            'pid' => $pid,
            'modify' => ($m == 'true') ? 1 : 0,
            'delete' => ($d == 'true') ? 1 : 0,
            'config_perm' => ($config_perm == 'true') ? 1 : 0,
            'ac_perm' => ($ac_perm == 'true') ? 1 : 0,
            'thumb_perm' => ($thumb_perm == 'true') ? 1 : 0,
            'stats_perm' => ($stats_perm == 'true') ? 1 : 0,
            'sn' => $sn
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/livestreams.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function getLiveStreamsFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $ac = Request::input('ac');
        $category = Request::input('category');
        $search = Request::input('search');
        $pid = Request::input('pid');
        $m = Request::input('m');
        $d = Request::input('d');
        $config_perm = Request::input('config_perm');
        $ac_perm = Request::input('ac_perm');
        $thumb_perm = Request::input('thumb_perm');
        $stats_perm = Request::input('stats_perm');
        $sn = Request::input('sn');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'ac' => $ac,
            'search' => $search['value'],
            'pid' => $pid,
            'modify' => ($m == 'true') ? 1 : 0,
            'delete' => ($d == 'true') ? 1 : 0,
            'config_perm' => ($config_perm == 'true') ? 1 : 0,
            'ac_perm' => ($ac_perm == 'true') ? 1 : 0,
            'thumb_perm' => ($thumb_perm == 'true') ? 1 : 0,
            'stats_perm' => ($stats_perm == 'true') ? 1 : 0,
            'sn' => $sn
        );
        $url = 'http://meddev2/apps/platform/livestreams.table.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function memEntries() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getMemEntries.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function memEntriesFW() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors
        );
        $url = 'http://meddev2/apps/platform/getMemEntries.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function memPlaylists() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value']
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getMemPlaylists.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function memCategories() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value']
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getMemCategories.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function ppvEntries() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $category = Request::input('category');
        $search = Request::input('search');
        $mediaType = Request::input('mediaType');
        $duration = Request::input('duration');
        $clipped = Request::input('clipped');
        $ac = Request::input('ac');
        $flavors = Request::input('flavors');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'category' => $category,
            'search' => $search['value'],
            'mediaType' => $mediaType,
            'duration' => $duration,
            'clipped' => $clipped,
            'ac' => $ac,
            'flavors' => $flavors
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getPpvEntries.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function ppvPlaylists() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value']
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getPpvPlaylists.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function ppvCategories() {
        $start = Request::input('start');
        $length = Request::input('length');
        $draw = Request::input('draw');
        $tz = Request::input('tz');
        $ks = Request::input('ks');
        $search = Request::input('search');
        $fields = array(
            'ks' => $ks,
            'start' => $start,
            'length' => $length,
            'draw' => $draw,
            'tz' => $tz,
            'search' => $search['value']
        );
        $url = 'http://mediaplatform.streamingmediahosting.com/apps/platform/getPpvCategories.php';
        $response = $this->curl_request($url, $fields);
        echo $response;
    }

    public function curl_request($url, $params) {
        $postfields = http_build_query($params);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, count($params));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    public function simple_curl_request($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    public function help_curl_request($data) {
        $config = array(
            'url' => 'http://help.streamingmediahosting.com/api/tickets.json',
            'key' => '240F4704D0E9A72CDA4CEE5EDC730197'
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $config['url']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_USERAGENT, 'osTicket API Client v1.8');
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:', 'X-API-Key: ' . $config['key']));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $result = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $result;
    }

}
