<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Help;
use Illuminate\Http\Request;
use Session;

class ClientPagesController extends Controller {

    public function historicalStats() {
        $pid = Session::get("user.id");
        $url = 'http://10.5.25.17/index.php/api/accounts/limits/' . $pid . '.json';
        $response = json_decode($this->curl_request($url), true);
        $permissions = explode(",", Session::get("user.permissions"));
        if (in_array("ANALYTICS_BASE", $permissions)) {
            $stats_pass = substr(md5(strtolower($pid . '_MP') . 'mp23df2h'), 0, 15);
            $stats_url = 'https://stats.www.mywsnlive.com/?dp+templates.profile.index+p+' . $pid . '+webvars.username+' . $pid . '+webvars.password+' . $stats_pass;
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

            setcookie("authsessionid", $myCookie, $expire, '/', 'www.mywsnlive.com', false);

            return view('pages.wl_clients.mywsnlive.historical_stats')->with('status', $response);
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
