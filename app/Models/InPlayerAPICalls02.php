<?php

namespace App\Models;

use Kaltura\Client\Configuration as KalturaConfiguration;
use Kaltura\Client\Client as KalturaClient;
use Kaltura\Client\Enum\SessionType as KalturaSessionType;
use Kaltura\Client\ApiException;
use Kaltura\Client\ClientException;
use Illuminate\Support\Facades\Request;
use Log;

class InPAPICallsModel {

    protected $ks;
    protected $adminPartnerId = -2;
    protected $adminAPISecretKey = '68b329da9893e34099c7d8ad5cb9c940';
    protected $user = '';
    protected $uiconf = '6711661';

    function __construct() {
//        $config = new KalturaConfiguration($this->adminPartnerId);
//        $config->serviceUrl = 'http://mediaplatform.streamingmediahosting.com/';
//        $client = new KalturaClient($config);
//        $this->ks = $client->generateSessionV2($this->adminAPISecretKey, $this->user, KalturaSessionType::ADMIN, $this->adminPartnerId, 86400, '');
    }

    public function getUserById($pid) {
        try {
            $user = array();
            $ks = $this->impersonate($pid);
            $config = new KalturaConfiguration($pid);
            $config->serviceUrl = 'http://mediaplatform.streamingmediahosting.com/';
            $client = new KalturaClient($config);
            $client->setKs($ks);
            $result = (array) $client->partner->get($pid);
            $pid = $result['id'];
            $user = array(
                'id' => $result['id'],
                'displayName' => $result['name'],
                'email' => $result['adminEmail'],
                'ks' => $ks
            );
            return $user;
        } catch (Exception $e) {
            Log::error($e);
            return null;
        }
    }
    
        public function impersonate($pid) {
        $config = new KalturaConfiguration($pid);
        $config->serviceUrl = 'http://mediaplatform.streamingmediahosting.com/';
        $client = new KalturaClient($config);
        $secret = $this->adminAPISecretKey;
        $impersonatedPartnerId = $pid;
        $userId = null;
        $type = KalturaSessionType::ADMIN;
        $partnerId = $this->adminPartnerId;
        $expiry = null;
        $privileges = null;
        $result = $client->session->impersonate($secret, $impersonatedPartnerId, $userId, $type, $partnerId, $expiry, $privileges);
        return $result;
    }

    public function curl_request($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
        $result = curl_exec($ch);
        $result = json_decode($result);
        curl_close($ch);
        return $result;
    }

}
