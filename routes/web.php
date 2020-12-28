<?php

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */

//Route::get('/', function () {
//    return view('welcome');
//});

Route::group(array('domain' => 'mediaplatform.streamingmediahosting.com'), function() {
    Route::get('/', 'WelcomeController@index');
    Route::get('dashboard', ['middleware' => 'auth', 'uses' => 'PagesController@dashboard']);
    Route::get('content', ['middleware' => 'auth', 'uses' => 'PagesController@content']);
    Route::get('livestream', ['middleware' => 'auth', 'uses' => 'PagesController@livestream']);
    Route::get('social_broadcasting', ['middleware' => 'auth', 'uses' => 'PagesController@socialBroadcasting']);
    Route::get('channel_manager', ['middleware' => 'auth', 'uses' => 'PagesController@channelManager']);
    Route::get('players', ['middleware' => 'auth', 'uses' => 'PagesController@players']);
    Route::get('playlists', ['middleware' => 'auth', 'uses' => 'PagesController@playlists']);
    Route::get('categories', ['middleware' => 'auth', 'uses' => 'PagesController@categories']);
    Route::get('access_control', ['middleware' => 'auth', 'uses' => 'PagesController@ac']);
    Route::get('transcoding/vod', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingVOD']);
    Route::get('transcoding/live', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingLive']);
    Route::get('ppv/payment_gateway', ['middleware' => 'auth', 'uses' => 'PagesController@paymentGateway']);
    Route::get('ppv/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@emailConfiguration']);
    Route::get('ppv/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@emailTemplates']);
    Route::get('ppv/users', ['middleware' => 'auth', 'uses' => 'PagesController@ppvUsers']);
    Route::get('ppv/tickets', ['middleware' => 'auth', 'uses' => 'PagesController@ppvTickets']);
    Route::get('ppv/content', ['middleware' => 'auth', 'uses' => 'PagesController@ppvContent']);
    Route::get('ppv/orders', ['middleware' => 'auth', 'uses' => 'PagesController@ppvOrders']);
    Route::get('ppv/affiliates', ['middleware' => 'auth', 'uses' => 'PagesController@ppvAffiliates']);
    Route::get('membership/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailConfiguration']);
    Route::get('membership/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailTemplates']);
    Route::get('membership/users', ['middleware' => 'auth', 'uses' => 'PagesController@memUsers']);
    Route::get('membership/content', ['middleware' => 'auth', 'uses' => 'PagesController@memContent']);
    Route::get('historical_stats', ['middleware' => 'auth', 'uses' => 'PagesController@historicalStats']);
    Route::get('player_stats/content_reports', ['middleware' => 'auth', 'uses' => 'PagesController@contentReports']);
    Route::get('player_stats/geo_distribution', ['middleware' => 'auth', 'uses' => 'PagesController@geoDistribution']);
    Route::get('player_stats/system_reports', ['middleware' => 'auth', 'uses' => 'PagesController@systemReports']);
    Route::get('player_stats/live_reports', ['middleware' => 'auth', 'uses' => 'PagesController@liveReports']);
    Route::get('reseller', ['middleware' => 'auth', 'uses' => 'PagesController@reseller']);
    Route::get('ingest', ['middleware' => 'auth', 'uses' => 'PagesController@upload']);
    Route::get('users', ['middleware' => 'auth', 'uses' => 'PagesController@users']);
    Route::get('roles', ['middleware' => 'auth', 'uses' => 'PagesController@roles']);
    Route::get('support_tickets', ['middleware' => 'auth', 'uses' => 'PagesController@supportTickets']);
    Route::get('help/newticket', ['middleware' => 'auth', 'uses' => 'PagesController@newticket']);
    Route::post('help/newticket', ['middleware' => 'auth', 'uses' => 'UserController@submitTicket']);
    Route::get('video_chat', ['middleware' => 'auth', 'uses' => 'PagesController@videoChat']);
});

Route::group(array('domain' => 'devplatform.streamingmediahosting.com'), function() {
    Route::get('/', 'WelcomeController@index');
    Route::get('dashboard', ['middleware' => 'auth', 'uses' => 'PagesController@dashboard']);
    Route::get('content', ['middleware' => 'auth', 'uses' => 'PagesController@content']);
    Route::get('livestream', ['middleware' => 'auth', 'uses' => 'PagesController@livestream']);
    Route::get('social_broadcasting', ['middleware' => 'auth', 'uses' => 'PagesController@socialBroadcasting']);
    Route::get('channel_manager', ['middleware' => 'auth', 'uses' => 'PagesController@channelManager']);
    Route::get('players', ['middleware' => 'auth', 'uses' => 'PagesController@players']);
    Route::get('playlists', ['middleware' => 'auth', 'uses' => 'PagesController@playlists']);
    Route::get('categories', ['middleware' => 'auth', 'uses' => 'PagesController@categories']);
    Route::get('access_control', ['middleware' => 'auth', 'uses' => 'PagesController@ac']);
    Route::get('transcoding/vod', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingVOD']);
    Route::get('transcoding/live', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingLive']);
    Route::get('ppv/payment_gateway', ['middleware' => 'auth', 'uses' => 'PagesController@paymentGateway']);
    Route::get('ppv/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@emailConfiguration']);
    Route::get('ppv/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@emailTemplates']);
    Route::get('ppv/users', ['middleware' => 'auth', 'uses' => 'PagesController@ppvUsers']);
    Route::get('ppv/tickets', ['middleware' => 'auth', 'uses' => 'PagesController@ppvTickets']);
    Route::get('ppv/content', ['middleware' => 'auth', 'uses' => 'PagesController@ppvContent']);
    Route::get('ppv/orders', ['middleware' => 'auth', 'uses' => 'PagesController@ppvOrders']);
    Route::get('ppv/affiliates', ['middleware' => 'auth', 'uses' => 'PagesController@ppvAffiliates']);
    Route::get('membership/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailConfiguration']);
    Route::get('membership/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailTemplates']);
    Route::get('membership/users', ['middleware' => 'auth', 'uses' => 'PagesController@memUsers']);
    Route::get('membership/content', ['middleware' => 'auth', 'uses' => 'PagesController@memContent']);
    Route::get('historical_stats', ['middleware' => 'auth', 'uses' => 'PagesController@historicalStats']);
    Route::get('player_stats/content_reports', ['middleware' => 'auth', 'uses' => 'PagesController@contentReports']);
    Route::get('player_stats/geo_distribution', ['middleware' => 'auth', 'uses' => 'PagesController@geoDistribution']);
    Route::get('player_stats/system_reports', ['middleware' => 'auth', 'uses' => 'PagesController@systemReports']);
    Route::get('player_stats/live_reports', ['middleware' => 'auth', 'uses' => 'PagesController@liveReports']);
    Route::get('reseller', ['middleware' => 'auth', 'uses' => 'PagesController@reseller']);
    Route::get('ingest', ['middleware' => 'auth', 'uses' => 'PagesController@upload']);
    Route::get('users', ['middleware' => 'auth', 'uses' => 'PagesController@users']);
    Route::get('roles', ['middleware' => 'auth', 'uses' => 'PagesController@roles']);
    Route::get('support_tickets', ['middleware' => 'auth', 'uses' => 'PagesController@supportTickets']);
    Route::get('inp_api_calls', ['middleware' => 'auth', 'uses' => 'PagesController@inPAPICalls']);
    Route::get('help/newticket', ['middleware' => 'auth', 'uses' => 'PagesController@newticket']);
    Route::post('help/newticket', ['middleware' => 'auth', 'uses' => 'UserController@submitTicket']);
    Route::get('video_chat', ['middleware' => 'auth', 'uses' => 'PagesController@videoChat']);
});

Route::group(array('domain' => 'vr.streamingmediahosting.com'), function() {
    Route::get('/', 'WelcomeController@indexvr');
    Route::get('dashboard', ['middleware' => 'auth', 'uses' => 'PagesController@dashboardVR']);
    Route::get('content', ['middleware' => 'auth', 'uses' => 'PagesController@contentVR']);
    Route::get('livestream', ['middleware' => 'auth', 'uses' => 'PagesController@livestreamVR']);
    Route::get('social_broadcasting', ['middleware' => 'auth', 'uses' => 'PagesController@socialBroadcastingVR']);
    Route::get('channel_manager', ['middleware' => 'auth', 'uses' => 'PagesController@channelManagerVR']);
    Route::get('players', ['middleware' => 'auth', 'uses' => 'PagesController@playersVR']);
    Route::get('playlists', ['middleware' => 'auth', 'uses' => 'PagesController@playlistsVR']);
    Route::get('categories', ['middleware' => 'auth', 'uses' => 'PagesController@categoriesVR']);
    Route::get('access_control', ['middleware' => 'auth', 'uses' => 'PagesController@acVR']);
    Route::get('transcoding', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingVR']);
    Route::get('ppv/payment_gateway', ['middleware' => 'auth', 'uses' => 'PagesController@paymentGatewayVR']);
    Route::get('ppv/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@emailConfigurationVR']);
    Route::get('ppv/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@emailTemplatesVR']);
    Route::get('ppv/users', ['middleware' => 'auth', 'uses' => 'PagesController@ppvUsersVR']);
    Route::get('ppv/tickets', ['middleware' => 'auth', 'uses' => 'PagesController@ppvTicketsVR']);
    Route::get('ppv/content', ['middleware' => 'auth', 'uses' => 'PagesController@ppvContentVR']);
    Route::get('ppv/orders', ['middleware' => 'auth', 'uses' => 'PagesController@ppvOrdersVR']);
    Route::get('ppv/affiliates', ['middleware' => 'auth', 'uses' => 'PagesController@ppvAffiliatesVR']);
    Route::get('membership/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailConfigurationVR']);
    Route::get('membership/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailTemplatesVR']);
    Route::get('membership/users', ['middleware' => 'auth', 'uses' => 'PagesController@memUsersVR']);
    Route::get('membership/content', ['middleware' => 'auth', 'uses' => 'PagesController@memContentVR']);
    Route::get('historical_stats', ['middleware' => 'auth', 'uses' => 'PagesController@historicalStatsVR']);
    Route::get('player_stats/content_reports', ['middleware' => 'auth', 'uses' => 'PagesController@contentReportsVR']);
    Route::get('player_stats/geo_distribution', ['middleware' => 'auth', 'uses' => 'PagesController@geoDistributionVR']);
    Route::get('player_stats/system_reports', ['middleware' => 'auth', 'uses' => 'PagesController@systemReportsVR']);
    Route::get('player_stats/live_reports', ['middleware' => 'auth', 'uses' => 'PagesController@liveReportsVR']);
    Route::get('reseller', ['middleware' => 'auth', 'uses' => 'PagesController@resellerVR']);
    Route::get('ingest', ['middleware' => 'auth', 'uses' => 'PagesController@uploadVR']);
    Route::get('users', ['middleware' => 'auth', 'uses' => 'PagesController@usersVR']);
    Route::get('roles', ['middleware' => 'auth', 'uses' => 'PagesController@rolesVR']);
    Route::get('help', ['middleware' => 'auth', 'uses' => 'PagesController@helpVR']);
    Route::get('help/newticket', ['middleware' => 'auth', 'uses' => 'PagesController@newticketVR']);
    Route::post('help/newticket', ['middleware' => 'auth', 'uses' => 'UserController@submitTicketVR']);
});

Route::group(array('domain' => 'www.mywsnlive.com'), function() {
    Route::get('/', 'WelcomeController@wsnlive');
    Route::get('dashboard', ['middleware' => 'auth', 'uses' => 'PagesController@dashboard']);
    Route::get('content', ['middleware' => 'auth', 'uses' => 'PagesController@content']);
    Route::get('livestream', ['middleware' => 'auth', 'uses' => 'PagesController@livestream']);
    Route::get('social_broadcasting', ['middleware' => 'auth', 'uses' => 'PagesController@socialBroadcasting']);
    Route::get('channel_manager', ['middleware' => 'auth', 'uses' => 'PagesController@channelManager']);
    Route::get('players', ['middleware' => 'auth', 'uses' => 'PagesController@players']);
    Route::get('flash_players', ['middleware' => 'auth', 'uses' => 'PagesController@flashPlayers']);
    Route::get('playlists', ['middleware' => 'auth', 'uses' => 'PagesController@playlists']);
    Route::get('categories', ['middleware' => 'auth', 'uses' => 'PagesController@categories']);
    Route::get('access_control', ['middleware' => 'auth', 'uses' => 'PagesController@ac']);
    Route::get('transcoding/vod', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingVOD']);
    Route::get('transcoding/live', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingLive']);
    Route::get('ppv/payment_gateway', ['middleware' => 'auth', 'uses' => 'PagesController@paymentGateway']);
    Route::get('ppv/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@emailConfiguration']);
    Route::get('ppv/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@emailTemplates']);
    Route::get('ppv/users', ['middleware' => 'auth', 'uses' => 'PagesController@ppvUsers']);
    Route::get('ppv/tickets', ['middleware' => 'auth', 'uses' => 'PagesController@ppvTickets']);
    Route::get('ppv/content', ['middleware' => 'auth', 'uses' => 'PagesController@ppvContent']);
    Route::get('ppv/orders', ['middleware' => 'auth', 'uses' => 'PagesController@ppvOrders']);
    Route::get('ppv/affiliates', ['middleware' => 'auth', 'uses' => 'PagesController@ppvAffiliates']);
    Route::get('membership/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailConfiguration']);
    Route::get('membership/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailTemplates']);
    Route::get('membership/users', ['middleware' => 'auth', 'uses' => 'PagesController@memUsers']);
    Route::get('membership/content', ['middleware' => 'auth', 'uses' => 'PagesController@memContent']);
    Route::get('historical_stats', ['middleware' => 'auth', 'uses' => 'ClientPagesController@historicalStats']);
    Route::get('player_stats/content_reports', ['middleware' => 'auth', 'uses' => 'PagesController@contentReports']);
    Route::get('player_stats/geo_distribution', ['middleware' => 'auth', 'uses' => 'PagesController@geoDistribution']);
    Route::get('player_stats/system_reports', ['middleware' => 'auth', 'uses' => 'PagesController@systemReports']);
    Route::get('player_stats/live_reports', ['middleware' => 'auth', 'uses' => 'PagesController@liveReports']);
    Route::get('reseller', ['middleware' => 'auth', 'uses' => 'PagesController@reseller']);
    Route::get('ingest', ['middleware' => 'auth', 'uses' => 'PagesController@upload']);
    Route::get('users', ['middleware' => 'auth', 'uses' => 'PagesController@users']);
    Route::get('roles', ['middleware' => 'auth', 'uses' => 'PagesController@roles']);
    Route::get('support_tickets', ['middleware' => 'auth', 'uses' => 'PagesController@supportTickets']);
    Route::get('help/newticket', ['middleware' => 'auth', 'uses' => 'PagesController@newticket']);
    Route::post('help/newticket', ['middleware' => 'auth', 'uses' => 'UserController@submitTicket']);
    Route::get('video_chat', ['middleware' => 'auth', 'uses' => 'PagesController@videoChat']);
});

Route::group(array('domain' => 'mywsnlive.com'), function() {
    Route::get('/', 'WelcomeController@wsnlive');
    Route::get('dashboard', ['middleware' => 'auth', 'uses' => 'PagesController@dashboard']);
    Route::get('content', ['middleware' => 'auth', 'uses' => 'PagesController@content']);
    Route::get('livestream', ['middleware' => 'auth', 'uses' => 'PagesController@livestream']);
    Route::get('social_broadcasting', ['middleware' => 'auth', 'uses' => 'PagesController@socialBroadcasting']);
    Route::get('channel_manager', ['middleware' => 'auth', 'uses' => 'PagesController@channelManager']);
    Route::get('players', ['middleware' => 'auth', 'uses' => 'PagesController@players']);
    Route::get('flash_players', ['middleware' => 'auth', 'uses' => 'PagesController@flashPlayers']);
    Route::get('playlists', ['middleware' => 'auth', 'uses' => 'PagesController@playlists']);
    Route::get('categories', ['middleware' => 'auth', 'uses' => 'PagesController@categories']);
    Route::get('access_control', ['middleware' => 'auth', 'uses' => 'PagesController@ac']);
    Route::get('transcoding/vod', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingVOD']);
    Route::get('transcoding/live', ['middleware' => 'auth', 'uses' => 'PagesController@transcodingLive']);
    Route::get('ppv/payment_gateway', ['middleware' => 'auth', 'uses' => 'PagesController@paymentGateway']);
    Route::get('ppv/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@emailConfiguration']);
    Route::get('ppv/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@emailTemplates']);
    Route::get('ppv/users', ['middleware' => 'auth', 'uses' => 'PagesController@ppvUsers']);
    Route::get('ppv/tickets', ['middleware' => 'auth', 'uses' => 'PagesController@ppvTickets']);
    Route::get('ppv/content', ['middleware' => 'auth', 'uses' => 'PagesController@ppvContent']);
    Route::get('ppv/orders', ['middleware' => 'auth', 'uses' => 'PagesController@ppvOrders']);
    Route::get('ppv/affiliates', ['middleware' => 'auth', 'uses' => 'PagesController@ppvAffiliates']);
    Route::get('membership/email_configuration', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailConfiguration']);
    Route::get('membership/email_templates', ['middleware' => 'auth', 'uses' => 'PagesController@memEmailTemplates']);
    Route::get('membership/users', ['middleware' => 'auth', 'uses' => 'PagesController@memUsers']);
    Route::get('membership/content', ['middleware' => 'auth', 'uses' => 'PagesController@memContent']);
    Route::get('historical_stats', ['middleware' => 'auth', 'uses' => 'ClientPagesController@historicalStats']);
    Route::get('player_stats/content_reports', ['middleware' => 'auth', 'uses' => 'PagesController@contentReports']);
    Route::get('player_stats/geo_distribution', ['middleware' => 'auth', 'uses' => 'PagesController@geoDistribution']);
    Route::get('player_stats/system_reports', ['middleware' => 'auth', 'uses' => 'PagesController@systemReports']);
    Route::get('player_stats/live_reports', ['middleware' => 'auth', 'uses' => 'PagesController@liveReports']);
    Route::get('reseller', ['middleware' => 'auth', 'uses' => 'PagesController@reseller']);
    Route::get('ingest', ['middleware' => 'auth', 'uses' => 'PagesController@upload']);
    Route::get('users', ['middleware' => 'auth', 'uses' => 'PagesController@users']);
    Route::get('roles', ['middleware' => 'auth', 'uses' => 'PagesController@roles']);
    Route::get('support_tickets', ['middleware' => 'auth', 'uses' => 'PagesController@supportTickets']);
    Route::get('help/newticket', ['middleware' => 'auth', 'uses' => 'PagesController@newticket']);
    Route::post('help/newticket', ['middleware' => 'auth', 'uses' => 'UserController@submitTicket']);
    Route::get('video_chat', ['middleware' => 'auth', 'uses' => 'PagesController@videoChat']);
});

Route::group(['prefix' => 'api/auth'], function() {
    Route::post('/login', 'UserController@login');
    Route::post('/logout', 'UserController@logout');
});

Route::group(['prefix' => 'api/v1', 'middleware' => 'auth:api'], function() {
    Route::post('/updateSettings', 'UserController@updateSettings');
    Route::post('/updateEmail', 'UserController@updateEmail');
    Route::post('/updateLayout', 'UserController@updateLayout');
    Route::post('/updateResellerLayout', 'UserController@updateResellerLayout');
    Route::post('/updateUserServices', 'UserController@updateUserServices');
    Route::post('/createResellerAccount', 'UserController@createResellerAccount');
    Route::post('/updateResellerAccount', 'UserController@updateResellerAccount');
    Route::post('/updateResellerStatus', 'UserController@updateResellerStatus');
    Route::post('/deleteResellerAccount', 'UserController@deleteResellerAccount');
    Route::post('/updateUserLimits', 'UserController@updateUserLimits');
    Route::post('/updateAlertAckd', 'UserController@updateAlertAckd');
    Route::post('/player_stats/table', 'UserController@getTableContent');
    Route::post('/player_stats/tableFW', 'UserController@getTableContentFW');
    Route::get('/getUserTickets', 'UserController@getUserTickets');
    Route::get('/getLayout', 'UserController@getLayout');
    Route::get('/getUsers', 'UserController@getUsers');
    Route::get('/getRoles', 'UserController@getRoles');
    Route::get('/getAC', 'UserController@getAC');
    Route::get('/getACFW', 'UserController@getACFW');
    Route::get('/getTrans', 'UserController@getTrans');
    Route::get('/getCategories', 'UserController@getCategories');
    Route::get('/getCategoriesFW', 'UserController@getCategoriesFW');
    Route::get('/getChannelEntries', 'UserController@getChannelEntries');
    Route::get('/getPlaylists', 'UserController@getPlaylists');
    Route::get('/getPlaylistsFW', 'UserController@getPlaylistsFW');
    Route::get('/getPlayers', 'UserController@getPlayers');
    Route::get('/getPlayersFW', 'UserController@getPlayersFW');
    Route::get('/getPlaylists_Entries', 'UserController@getPlaylistsEntries');
    Route::get('/getPlaylists_EntriesFW', 'UserController@getPlaylistsEntriesFW');
    Route::get('/getChannel_Entries', 'UserController@getChannelEntries');
    Route::get('/getRBPlaylists_Entries', 'UserController@getRBPlaylistsEntries');
    Route::get('/getRBPlaylists_EntriesFW', 'UserController@getRBPlaylistsEntriesFW');
    Route::get('/getLiveStreams', 'UserController@getLiveStreams');
    Route::get('/getLiveStreamsFW', 'UserController@getLiveStreamsFW');
    Route::get('/getEntries', 'UserController@getEntries');
    Route::get('/getEntriesFW', 'UserController@getEntriesFW');
    Route::get('/getVREntries', 'UserController@getVREntries');
    Route::get('/getProgramEntries', 'UserController@getProgramEntries');
    Route::get('/getProgramPlaylists', 'UserController@getProgramPlaylists');
    Route::get('/ppv_entries', 'UserController@ppvEntries');
    Route::get('/ppv_playlists', 'UserController@ppvPlaylists');
    Route::get('/ppv_categories', 'UserController@ppvCategories');
    Route::get('/mem_entries', 'UserController@memEntries');
    Route::get('/mem_entriesFW', 'UserController@memEntriesFW');
    Route::get('/mem_playlists', 'UserController@memPlaylists');
    Route::get('/mem_categories', 'UserController@memCategories');
});
