/*
 *
 *	Streaming Media Hosting
 *	
 *	LiveStreams
 *
 *	9-15-2015
 */
//Main constructor
function ChannelManager() {}

//Global variables
var ApiUrl = "/apps/channel/v1.0/index.php?";
var CacheApiUrl = "/apps/cache/v1.0/index.php?";
var slices = 40;
var frameRate = 400;
var timer = null;
var slice = 0;
var img = new Image();
var categories_data = [];
var cats = [];
var categories = [];
var categoryIDs = [];
var mediaTypes = [];
var duration = [];
var clipped = [];
var ac_select = {};
var ac = [];
var ac_filter = [];
var flavors = [];
var flavors_filter = [];
var shortlink;
var validator;
var limit = 20;
var order = '-recent';
var uiconf_ids = new Array();
var shortlink;
var readonly = false;
var search = '';
var program_eid = null;
var API = null;
var channel_options = '';
var bulkdelete = new Array();
var your_timezone = null;

var time_zones = {
    'Africa/Abidjan': '( GMT +0 ) Africa/Abidjan',
    'Africa/Accra': '( GMT +0 ) Africa/Accra',
    'Africa/Addis_Ababa': '( GMT +3 ) Africa/Addis_Ababa',
    'Africa/Algiers': '( GMT +1 ) Africa/Algiers',
    'Africa/Asmara': '( GMT +3 ) Africa/Asmara',
    'Africa/Bamako': '( GMT +0 ) Africa/Bamako',
    'Africa/Bangui': '( GMT +1 ) Africa/Bangui',
    'Africa/Banjul': '( GMT +0 ) Africa/Banjul',
    'Africa/Bissau': '( GMT +0 ) Africa/Bissau',
    'Africa/Blantyre': '( GMT +2 ) Africa/Blantyre',
    'Africa/Brazzaville': '( GMT +1 ) Africa/Brazzaville',
    'Africa/Bujumbura': '( GMT +2 ) Africa/Bujumbura',
    'Africa/Cairo': '( GMT +2 ) Africa/Cairo',
    'Africa/Casablanca': '( GMT +1 ) Africa/Casablanca',
    'Africa/Ceuta': '( GMT +2 ) Africa/Ceuta',
    'Africa/Conakry': '( GMT +0 ) Africa/Conakry',
    'Africa/Dakar': '( GMT +0 ) Africa/Dakar',
    'Africa/Dar_es_Salaam': '( GMT +3 ) Africa/Dar_es_Salaam',
    'Africa/Djibouti': '( GMT +3 ) Africa/Djibouti',
    'Africa/Douala': '( GMT +1 ) Africa/Douala',
    'Africa/El_Aaiun': '( GMT +1 ) Africa/El_Aaiun',
    'Africa/Freetown': '( GMT +0 ) Africa/Freetown',
    'Africa/Gaborone': '( GMT +2 ) Africa/Gaborone',
    'Africa/Harare': '( GMT +2 ) Africa/Harare',
    'Africa/Johannesburg': '( GMT +2 ) Africa/Johannesburg',
    'Africa/Juba': '( GMT +3 ) Africa/Juba',
    'Africa/Kampala': '( GMT +3 ) Africa/Kampala',
    'Africa/Khartoum': '( GMT +3 ) Africa/Khartoum',
    'Africa/Kigali': '( GMT +2 ) Africa/Kigali',
    'Africa/Kinshasa': '( GMT +1 ) Africa/Kinshasa',
    'Africa/Lagos': '( GMT +1 ) Africa/Lagos',
    'Africa/Libreville': '( GMT +1 ) Africa/Libreville',
    'Africa/Lome': '( GMT +0 ) Africa/Lome',
    'Africa/Luanda': '( GMT +1 ) Africa/Luanda',
    'Africa/Lubumbashi': '( GMT +2 ) Africa/Lubumbashi',
    'Africa/Lusaka': '( GMT +2 ) Africa/Lusaka',
    'Africa/Malabo': '( GMT +1 ) Africa/Malabo',
    'Africa/Maputo': '( GMT +2 ) Africa/Maputo',
    'Africa/Maseru': '( GMT +2 ) Africa/Maseru',
    'Africa/Mbabane': '( GMT +2 ) Africa/Mbabane',
    'Africa/Mogadishu': '( GMT +3 ) Africa/Mogadishu',
    'Africa/Monrovia': '( GMT +0 ) Africa/Monrovia',
    'Africa/Nairobi': '( GMT +3 ) Africa/Nairobi',
    'Africa/Ndjamena': '( GMT +1 ) Africa/Ndjamena',
    'Africa/Niamey': '( GMT +1 ) Africa/Niamey',
    'Africa/Nouakchott': '( GMT +0 ) Africa/Nouakchott',
    'Africa/Ouagadougou': '( GMT +0 ) Africa/Ouagadougou',
    'Africa/Porto-Novo': '( GMT +1 ) Africa/Porto-Novo',
    'Africa/Sao_Tome': '( GMT +0 ) Africa/Sao_Tome',
    'Africa/Tripoli': '( GMT +2 ) Africa/Tripoli',
    'Africa/Tunis': '( GMT +1 ) Africa/Tunis',
    'Africa/Windhoek': '( GMT +2 ) Africa/Windhoek',
    'America/Adak': '( GMT -9 ) America/Adak',
    'America/Anchorage': '( GMT -8 ) America/Anchorage',
    'America/Anguilla': '( GMT -4 ) America/Anguilla',
    'America/Antigua': '( GMT -4 ) America/Antigua',
    'America/Araguaina': '( GMT -3 ) America/Araguaina',
    'America/Argentina/Buenos_Aires': '( GMT -3 ) America/Argentina/Buenos_Aires',
    'America/Argentina/Catamarca': '( GMT -3 ) America/Argentina/Catamarca',
    'America/Argentina/Cordoba': '( GMT -3 ) America/Argentina/Cordoba',
    'America/Argentina/Jujuy': '( GMT -3 ) America/Argentina/Jujuy',
    'America/Argentina/La_Rioja': '( GMT -3 ) America/Argentina/La_Rioja',
    'America/Argentina/Mendoza': '( GMT -3 ) America/Argentina/Mendoza',
    'America/Argentina/Rio_Gallegos': '( GMT -3 ) America/Argentina/Rio_Gallegos',
    'America/Argentina/Salta': '( GMT -3 ) America/Argentina/Salta',
    'America/Argentina/San_Juan': '( GMT -3 ) America/Argentina/San_Juan',
    'America/Argentina/San_Luis': '( GMT -3 ) America/Argentina/San_Luis',
    'America/Argentina/Tucuman': '( GMT -3 ) America/Argentina/Tucuman',
    'America/Argentina/Ushuaia': '( GMT -3 ) America/Argentina/Ushuaia',
    'America/Aruba': '( GMT -4 ) America/Aruba',
    'America/Asuncion': '( GMT -3 ) America/Asuncion',
    'America/Atikokan': '( GMT -5 ) America/Atikokan',
    'America/Bahia': '( GMT -3 ) America/Bahia',
    'America/Bahia_Banderas': '( GMT -5 ) America/Bahia_Banderas',
    'America/Barbados': '( GMT -4 ) America/Barbados',
    'America/Belem': '( GMT -3 ) America/Belem',
    'America/Belize': '( GMT -6 ) America/Belize',
    'America/Blanc-Sablon': '( GMT -4 ) America/Blanc-Sablon',
    'America/Boa_Vista': '( GMT -4 ) America/Boa_Vista',
    'America/Bogota': '( GMT -5 ) America/Bogota',
    'America/Boise" selected="selected': '( GMT -6 ) America/Boise',
    'America/Cambridge_Bay': '( GMT -6 ) America/Cambridge_Bay',
    'America/Campo_Grande': '( GMT -4 ) America/Campo_Grande',
    'America/Cancun': '( GMT -5 ) America/Cancun',
    'America/Caracas': '( GMT -4 ) America/Caracas',
    'America/Cayenne': '( GMT -3 ) America/Cayenne',
    'America/Cayman': '( GMT -5 ) America/Cayman',
    'America/Chicago': '( GMT -5 ) America/Chicago',
    'America/Chihuahua': '( GMT -6 ) America/Chihuahua',
    'America/Costa_Rica': '( GMT -6 ) America/Costa_Rica',
    'America/Creston': '( GMT -7 ) America/Creston',
    'America/Cuiaba': '( GMT -4 ) America/Cuiaba',
    'America/Curacao': '( GMT -4 ) America/Curacao',
    'America/Danmarkshavn': '( GMT +0 ) America/Danmarkshavn',
    'America/Dawson': '( GMT -7 ) America/Dawson',
    'America/Dawson_Creek': '( GMT -7 ) America/Dawson_Creek',
    'America/Denver': '( GMT -6 ) America/Denver',
    'America/Detroit': '( GMT -4 ) America/Detroit',
    'America/Dominica': '( GMT -4 ) America/Dominica',
    'America/Edmonton': '( GMT -6 ) America/Edmonton',
    'America/Eirunepe': '( GMT -5 ) America/Eirunepe',
    'America/El_Salvador': '( GMT -6 ) America/El_Salvador',
    'America/Fort_Nelson': '( GMT -7 ) America/Fort_Nelson',
    'America/Fortaleza': '( GMT -3 ) America/Fortaleza',
    'America/Glace_Bay': '( GMT -3 ) America/Glace_Bay',
    'America/Godthab': '( GMT -2 ) America/Godthab',
    'America/Goose_Bay': '( GMT -3 ) America/Goose_Bay',
    'America/Grand_Turk': '( GMT -4 ) America/Grand_Turk',
    'America/Grenada': '( GMT -4 ) America/Grenada',
    'America/Guadeloupe': '( GMT -4 ) America/Guadeloupe',
    'America/Guatemala': '( GMT -6 ) America/Guatemala',
    'America/Guayaquil': '( GMT -5 ) America/Guayaquil',
    'America/Guyana': '( GMT -4 ) America/Guyana',
    'America/Halifax': '( GMT -3 ) America/Halifax',
    'America/Havana': '( GMT -4 ) America/Havana',
    'America/Hermosillo': '( GMT -7 ) America/Hermosillo',
    'America/Indiana/Indianapolis': '( GMT -4 ) America/Indiana/Indianapolis',
    'America/Indiana/Knox': '( GMT -5 ) America/Indiana/Knox',
    'America/Indiana/Marengo': '( GMT -4 ) America/Indiana/Marengo',
    'America/Indiana/Petersburg': '( GMT -4 ) America/Indiana/Petersburg',
    'America/Indiana/Tell_City': '( GMT -5 ) America/Indiana/Tell_City',
    'America/Indiana/Vevay': '( GMT -4 ) America/Indiana/Vevay',
    'America/Indiana/Vincennes': '( GMT -4 ) America/Indiana/Vincennes',
    'America/Indiana/Winamac': '( GMT -4 ) America/Indiana/Winamac',
    'America/Inuvik': '( GMT -6 ) America/Inuvik',
    'America/Iqaluit': '( GMT -4 ) America/Iqaluit',
    'America/Jamaica': '( GMT -5 ) America/Jamaica',
    'America/Juneau': '( GMT -8 ) America/Juneau',
    'America/Kentucky/Louisville': '( GMT -4 ) America/Kentucky/Louisville',
    'America/Kentucky/Monticello': '( GMT -4 ) America/Kentucky/Monticello',
    'America/Kralendijk': '( GMT -4 ) America/Kralendijk',
    'America/La_Paz': '( GMT -4 ) America/La_Paz',
    'America/Lima': '( GMT -5 ) America/Lima',
    'America/Los_Angeles': '( GMT -7 ) America/Los_Angeles',
    'America/Lower_Princes': '( GMT -4 ) America/Lower_Princes',
    'America/Maceio': '( GMT -3 ) America/Maceio',
    'America/Managua': '( GMT -6 ) America/Managua',
    'America/Manaus': '( GMT -4 ) America/Manaus',
    'America/Marigot': '( GMT -4 ) America/Marigot',
    'America/Martinique': '( GMT -4 ) America/Martinique',
    'America/Matamoros': '( GMT -5 ) America/Matamoros',
    'America/Mazatlan': '( GMT -6 ) America/Mazatlan',
    'America/Menominee': '( GMT -5 ) America/Menominee',
    'America/Merida': '( GMT -5 ) America/Merida',
    'America/Metlakatla': '( GMT -8 ) America/Metlakatla',
    'America/Mexico_City': '( GMT -5 ) America/Mexico_City',
    'America/Miquelon': '( GMT -2 ) America/Miquelon',
    'America/Moncton': '( GMT -3 ) America/Moncton',
    'America/Monterrey': '( GMT -5 ) America/Monterrey',
    'America/Montevideo': '( GMT -3 ) America/Montevideo',
    'America/Montserrat': '( GMT -4 ) America/Montserrat',
    'America/Nassau': '( GMT -4 ) America/Nassau',
    'America/New_York': '( GMT -4 ) America/New_York',
    'America/Nipigon': '( GMT -4 ) America/Nipigon',
    'America/Nome': '( GMT -8 ) America/Nome',
    'America/Noronha': '( GMT -2 ) America/Noronha',
    'America/North_Dakota/Beulah': '( GMT -5 ) America/North_Dakota/Beulah',
    'America/North_Dakota/Center': '( GMT -5 ) America/North_Dakota/Center',
    'America/North_Dakota/New_Salem': '( GMT -5 ) America/North_Dakota/New_Salem',
    'America/Ojinaga': '( GMT -6 ) America/Ojinaga',
    'America/Panama': '( GMT -5 ) America/Panama',
    'America/Pangnirtung': '( GMT -4 ) America/Pangnirtung',
    'America/Paramaribo': '( GMT -3 ) America/Paramaribo',
    'America/Phoenix': '( GMT -7 ) America/Phoenix',
    'America/Port-au-Prince': '( GMT -5 ) America/Port-au-Prince',
    'America/Port_of_Spain': '( GMT -4 ) America/Port_of_Spain',
    'America/Porto_Velho': '( GMT -4 ) America/Porto_Velho',
    'America/Puerto_Rico': '( GMT -4 ) America/Puerto_Rico',
    'America/Rainy_River': '( GMT -5 ) America/Rainy_River',
    'America/Rankin_Inlet': '( GMT -5 ) America/Rankin_Inlet',
    'America/Recife': '( GMT -3 ) America/Recife',
    'America/Regina': '( GMT -6 ) America/Regina',
    'America/Resolute': '( GMT -5 ) America/Resolute',
    'America/Rio_Branco': '( GMT -5 ) America/Rio_Branco',
    'America/Santarem': '( GMT -3 ) America/Santarem',
    'America/Santiago': '( GMT -3 ) America/Santiago',
    'America/Santo_Domingo': '( GMT -4 ) America/Santo_Domingo',
    'America/Sao_Paulo': '( GMT -3 ) America/Sao_Paulo',
    'America/Scoresbysund': '( GMT +0 ) America/Scoresbysund',
    'America/Sitka': '( GMT -8 ) America/Sitka',
    'America/St_Barthelemy': '( GMT -4 ) America/St_Barthelemy',
    'America/St_Johns': '( GMT -3 ) America/St_Johns',
    'America/St_Kitts': '( GMT -4 ) America/St_Kitts',
    'America/St_Lucia': '( GMT -4 ) America/St_Lucia',
    'America/St_Thomas': '( GMT -4 ) America/St_Thomas',
    'America/St_Vincent': '( GMT -4 ) America/St_Vincent',
    'America/Swift_Current': '( GMT -6 ) America/Swift_Current',
    'America/Tegucigalpa': '( GMT -6 ) America/Tegucigalpa',
    'America/Thule': '( GMT -3 ) America/Thule',
    'America/Thunder_Bay': '( GMT -4 ) America/Thunder_Bay',
    'America/Tijuana': '( GMT -7 ) America/Tijuana',
    'America/Toronto': '( GMT -4 ) America/Toronto',
    'America/Tortola': '( GMT -4 ) America/Tortola',
    'America/Vancouver': '( GMT -7 ) America/Vancouver',
    'America/Whitehorse': '( GMT -7 ) America/Whitehorse',
    'America/Winnipeg': '( GMT -5 ) America/Winnipeg',
    'America/Yakutat': '( GMT -8 ) America/Yakutat',
    'America/Yellowknife': '( GMT -6 ) America/Yellowknife',
    'Antarctica/Casey': '( GMT +8 ) Antarctica/Casey',
    'Antarctica/Davis': '( GMT +7 ) Antarctica/Davis',
    'Antarctica/DumontDUrville': '( GMT +10 ) Antarctica/DumontDUrville',
    'Antarctica/Macquarie': '( GMT +11 ) Antarctica/Macquarie',
    'Antarctica/Mawson': '( GMT +5 ) Antarctica/Mawson',
    'Antarctica/McMurdo': '( GMT +13 ) Antarctica/McMurdo',
    'Antarctica/Palmer': '( GMT -3 ) Antarctica/Palmer',
    'Antarctica/Rothera': '( GMT -3 ) Antarctica/Rothera',
    'Antarctica/Syowa': '( GMT +3 ) Antarctica/Syowa',
    'Antarctica/Troll': '( GMT +2 ) Antarctica/Troll',
    'Antarctica/Vostok': '( GMT +6 ) Antarctica/Vostok',
    'Arctic/Longyearbyen': '( GMT +2 ) Arctic/Longyearbyen',
    'Asia/Aden': '( GMT +3 ) Asia/Aden',
    'Asia/Almaty': '( GMT +6 ) Asia/Almaty',
    'Asia/Amman': '( GMT +3 ) Asia/Amman',
    'Asia/Anadyr': '( GMT +12 ) Asia/Anadyr',
    'Asia/Aqtau': '( GMT +5 ) Asia/Aqtau',
    'Asia/Aqtobe': '( GMT +5 ) Asia/Aqtobe',
    'Asia/Ashgabat': '( GMT +5 ) Asia/Ashgabat',
    'Asia/Baghdad': '( GMT +3 ) Asia/Baghdad',
    'Asia/Bahrain': '( GMT +3 ) Asia/Bahrain',
    'Asia/Baku': '( GMT +4 ) Asia/Baku',
    'Asia/Bangkok': '( GMT +7 ) Asia/Bangkok',
    'Asia/Barnaul': '( GMT +7 ) Asia/Barnaul',
    'Asia/Beirut': '( GMT +3 ) Asia/Beirut',
    'Asia/Bishkek': '( GMT +6 ) Asia/Bishkek',
    'Asia/Brunei': '( GMT +8 ) Asia/Brunei',
    'Asia/Chita': '( GMT +9 ) Asia/Chita',
    'Asia/Choibalsan': '( GMT +8 ) Asia/Choibalsan',
    'Asia/Colombo': '( GMT +5 ) Asia/Colombo',
    'Asia/Damascus': '( GMT +3 ) Asia/Damascus',
    'Asia/Dhaka': '( GMT +6 ) Asia/Dhaka',
    'Asia/Dili': '( GMT +9 ) Asia/Dili',
    'Asia/Dubai': '( GMT +4 ) Asia/Dubai',
    'Asia/Dushanbe': '( GMT +5 ) Asia/Dushanbe',
    'Asia/Gaza': '( GMT +3 ) Asia/Gaza',
    'Asia/Hebron': '( GMT +3 ) Asia/Hebron',
    'Asia/Ho_Chi_Minh': '( GMT +7 ) Asia/Ho_Chi_Minh',
    'Asia/Hong_Kong': '( GMT +8 ) Asia/Hong_Kong',
    'Asia/Hovd': '( GMT +7 ) Asia/Hovd',
    'Asia/Irkutsk': '( GMT +8 ) Asia/Irkutsk',
    'Asia/Jakarta': '( GMT +7 ) Asia/Jakarta',
    'Asia/Jayapura': '( GMT +9 ) Asia/Jayapura',
    'Asia/Jerusalem': '( GMT +3 ) Asia/Jerusalem',
    'Asia/Kabul': '( GMT +4 ) Asia/Kabul',
    'Asia/Kamchatka': '( GMT +12 ) Asia/Kamchatka',
    'Asia/Karachi': '( GMT +5 ) Asia/Karachi',
    'Asia/Kathmandu': '( GMT +5 ) Asia/Kathmandu',
    'Asia/Khandyga': '( GMT +9 ) Asia/Khandyga',
    'Asia/Kolkata': '( GMT +5 ) Asia/Kolkata',
    'Asia/Krasnoyarsk': '( GMT +7 ) Asia/Krasnoyarsk',
    'Asia/Kuala_Lumpur': '( GMT +8 ) Asia/Kuala_Lumpur',
    'Asia/Kuching': '( GMT +8 ) Asia/Kuching',
    'Asia/Kuwait': '( GMT +3 ) Asia/Kuwait',
    'Asia/Macau': '( GMT +8 ) Asia/Macau',
    'Asia/Magadan': '( GMT +11 ) Asia/Magadan',
    'Asia/Makassar': '( GMT +8 ) Asia/Makassar',
    'Asia/Manila': '( GMT +8 ) Asia/Manila',
    'Asia/Muscat': '( GMT +4 ) Asia/Muscat',
    'Asia/Nicosia': '( GMT +3 ) Asia/Nicosia',
    'Asia/Novokuznetsk': '( GMT +7 ) Asia/Novokuznetsk',
    'Asia/Novosibirsk': '( GMT +7 ) Asia/Novosibirsk',
    'Asia/Omsk': '( GMT +6 ) Asia/Omsk',
    'Asia/Oral': '( GMT +5 ) Asia/Oral',
    'Asia/Phnom_Penh': '( GMT +7 ) Asia/Phnom_Penh',
    'Asia/Pontianak': '( GMT +7 ) Asia/Pontianak',
    'Asia/Pyongyang': '( GMT +8 ) Asia/Pyongyang',
    'Asia/Qatar': '( GMT +3 ) Asia/Qatar',
    'Asia/Qyzylorda': '( GMT +6 ) Asia/Qyzylorda',
    'Asia/Rangoon': '( GMT +6 ) Asia/Rangoon',
    'Asia/Riyadh': '( GMT +3 ) Asia/Riyadh',
    'Asia/Sakhalin': '( GMT +11 ) Asia/Sakhalin',
    'Asia/Samarkand': '( GMT +5 ) Asia/Samarkand',
    'Asia/Seoul': '( GMT +9 ) Asia/Seoul',
    'Asia/Shanghai': '( GMT +8 ) Asia/Shanghai',
    'Asia/Singapore': '( GMT +8 ) Asia/Singapore',
    'Asia/Srednekolymsk': '( GMT +11 ) Asia/Srednekolymsk',
    'Asia/Taipei': '( GMT +8 ) Asia/Taipei',
    'Asia/Tashkent': '( GMT +5 ) Asia/Tashkent',
    'Asia/Tbilisi': '( GMT +4 ) Asia/Tbilisi',
    'Asia/Tehran': '( GMT +3 ) Asia/Tehran',
    'Asia/Thimphu': '( GMT +6 ) Asia/Thimphu',
    'Asia/Tokyo': '( GMT +9 ) Asia/Tokyo',
    'Asia/Tomsk': '( GMT +7 ) Asia/Tomsk',
    'Asia/Ulaanbaatar': '( GMT +8 ) Asia/Ulaanbaatar',
    'Asia/Urumqi': '( GMT +6 ) Asia/Urumqi',
    'Asia/Ust-Nera': '( GMT +10 ) Asia/Ust-Nera',
    'Asia/Vientiane': '( GMT +7 ) Asia/Vientiane',
    'Asia/Vladivostok': '( GMT +10 ) Asia/Vladivostok',
    'Asia/Yakutsk': '( GMT +9 ) Asia/Yakutsk',
    'Asia/Yekaterinburg': '( GMT +5 ) Asia/Yekaterinburg',
    'Asia/Yerevan': '( GMT +4 ) Asia/Yerevan',
    'Atlantic/Azores': '( GMT +0 ) Atlantic/Azores',
    'Atlantic/Bermuda': '( GMT -3 ) Atlantic/Bermuda',
    'Atlantic/Canary': '( GMT +1 ) Atlantic/Canary',
    'Atlantic/Cape_Verde': '( GMT -1 ) Atlantic/Cape_Verde',
    'Atlantic/Faroe': '( GMT +1 ) Atlantic/Faroe',
    'Atlantic/Madeira': '( GMT +1 ) Atlantic/Madeira',
    'Atlantic/Reykjavik': '( GMT +0 ) Atlantic/Reykjavik',
    'Atlantic/South_Georgia': '( GMT -2 ) Atlantic/South_Georgia',
    'Atlantic/St_Helena': '( GMT +0 ) Atlantic/St_Helena',
    'Atlantic/Stanley': '( GMT -3 ) Atlantic/Stanley',
    'Australia/Adelaide': '( GMT +10 ) Australia/Adelaide',
    'Australia/Brisbane': '( GMT +10 ) Australia/Brisbane',
    'Australia/Broken_Hill': '( GMT +10 ) Australia/Broken_Hill',
    'Australia/Currie': '( GMT +11 ) Australia/Currie',
    'Australia/Darwin': '( GMT +9 ) Australia/Darwin',
    'Australia/Eucla': '( GMT +8 ) Australia/Eucla',
    'Australia/Hobart': '( GMT +11 ) Australia/Hobart',
    'Australia/Lindeman': '( GMT +10 ) Australia/Lindeman',
    'Australia/Lord_Howe': '( GMT +11 ) Australia/Lord_Howe',
    'Australia/Melbourne': '( GMT +11 ) Australia/Melbourne',
    'Australia/Perth': '( GMT +8 ) Australia/Perth',
    'Australia/Sydney': '( GMT +11 ) Australia/Sydney',
    'Europe/Amsterdam': '( GMT +2 ) Europe/Amsterdam',
    'Europe/Andorra': '( GMT +2 ) Europe/Andorra',
    'Europe/Astrakhan': '( GMT +4 ) Europe/Astrakhan',
    'Europe/Athens': '( GMT +3 ) Europe/Athens',
    'Europe/Belgrade': '( GMT +2 ) Europe/Belgrade',
    'Europe/Berlin': '( GMT +2 ) Europe/Berlin',
    'Europe/Bratislava': '( GMT +2 ) Europe/Bratislava',
    'Europe/Brussels': '( GMT +2 ) Europe/Brussels',
    'Europe/Bucharest': '( GMT +3 ) Europe/Bucharest',
    'Europe/Budapest': '( GMT +2 ) Europe/Budapest',
    'Europe/Busingen': '( GMT +2 ) Europe/Busingen',
    'Europe/Chisinau': '( GMT +3 ) Europe/Chisinau',
    'Europe/Copenhagen': '( GMT +2 ) Europe/Copenhagen',
    'Europe/Dublin': '( GMT +1 ) Europe/Dublin',
    'Europe/Gibraltar': '( GMT +2 ) Europe/Gibraltar',
    'Europe/Guernsey': '( GMT +1 ) Europe/Guernsey',
    'Europe/Helsinki': '( GMT +3 ) Europe/Helsinki',
    'Europe/Isle_of_Man': '( GMT +1 ) Europe/Isle_of_Man',
    'Europe/Istanbul': '( GMT +3 ) Europe/Istanbul',
    'Europe/Jersey': '( GMT +1 ) Europe/Jersey',
    'Europe/Kaliningrad': '( GMT +2 ) Europe/Kaliningrad',
    'Europe/Kiev': '( GMT +3 ) Europe/Kiev',
    'Europe/Kirov': '( GMT +3 ) Europe/Kirov',
    'Europe/Lisbon': '( GMT +1 ) Europe/Lisbon',
    'Europe/Ljubljana': '( GMT +2 ) Europe/Ljubljana',
    'Europe/London': '( GMT +1 ) Europe/London',
    'Europe/Luxembourg': '( GMT +2 ) Europe/Luxembourg',
    'Europe/Madrid': '( GMT +2 ) Europe/Madrid',
    'Europe/Malta': '( GMT +2 ) Europe/Malta',
    'Europe/Mariehamn': '( GMT +3 ) Europe/Mariehamn',
    'Europe/Minsk': '( GMT +3 ) Europe/Minsk',
    'Europe/Monaco': '( GMT +2 ) Europe/Monaco',
    'Europe/Moscow': '( GMT +3 ) Europe/Moscow',
    'Europe/Oslo': '( GMT +2 ) Europe/Oslo',
    'Europe/Paris': '( GMT +2 ) Europe/Paris',
    'Europe/Podgorica': '( GMT +2 ) Europe/Podgorica',
    'Europe/Prague': '( GMT +2 ) Europe/Prague',
    'Europe/Riga': '( GMT +3 ) Europe/Riga',
    'Europe/Rome': '( GMT +2 ) Europe/Rome',
    'Europe/Samara': '( GMT +4 ) Europe/Samara',
    'Europe/San_Marino': '( GMT +2 ) Europe/San_Marino',
    'Europe/Sarajevo': '( GMT +2 ) Europe/Sarajevo',
    'Europe/Simferopol': '( GMT +3 ) Europe/Simferopol',
    'Europe/Skopje': '( GMT +2 ) Europe/Skopje',
    'Europe/Sofia': '( GMT +3 ) Europe/Sofia',
    'Europe/Stockholm': '( GMT +2 ) Europe/Stockholm',
    'Europe/Tallinn': '( GMT +3 ) Europe/Tallinn',
    'Europe/Tirane': '( GMT +2 ) Europe/Tirane',
    'Europe/Ulyanovsk': '( GMT +4 ) Europe/Ulyanovsk',
    'Europe/Uzhgorod': '( GMT +3 ) Europe/Uzhgorod',
    'Europe/Vaduz': '( GMT +2 ) Europe/Vaduz',
    'Europe/Vatican': '( GMT +2 ) Europe/Vatican',
    'Europe/Vienna': '( GMT +2 ) Europe/Vienna',
    'Europe/Vilnius': '( GMT +3 ) Europe/Vilnius',
    'Europe/Volgograd': '( GMT +3 ) Europe/Volgograd',
    'Europe/Warsaw': '( GMT +2 ) Europe/Warsaw',
    'Europe/Zagreb': '( GMT +2 ) Europe/Zagreb',
    'Europe/Zaporozhye': '( GMT +3 ) Europe/Zaporozhye',
    'Europe/Zurich': '( GMT +2 ) Europe/Zurich',
    'Indian/Antananarivo': '( GMT +3 ) Indian/Antananarivo',
    'Indian/Chagos': '( GMT +6 ) Indian/Chagos',
    'Indian/Christmas': '( GMT +7 ) Indian/Christmas',
    'Indian/Cocos': '( GMT +6 ) Indian/Cocos',
    'Indian/Comoro': '( GMT +3 ) Indian/Comoro',
    'Indian/Kerguelen': '( GMT +5 ) Indian/Kerguelen',
    'Indian/Mahe': '( GMT +4 ) Indian/Mahe',
    'Indian/Maldives': '( GMT +5 ) Indian/Maldives',
    'Indian/Mauritius': '( GMT +4 ) Indian/Mauritius',
    'Indian/Mayotte': '( GMT +3 ) Indian/Mayotte',
    'Indian/Reunion': '( GMT +4 ) Indian/Reunion',
    'Pacific/Apia': '( GMT +14 ) Pacific/Apia',
    'Pacific/Auckland': '( GMT +13 ) Pacific/Auckland',
    'Pacific/Bougainville': '( GMT +11 ) Pacific/Bougainville',
    'Pacific/Chatham': '( GMT +13 ) Pacific/Chatham',
    'Pacific/Chuuk': '( GMT +10 ) Pacific/Chuuk',
    'Pacific/Easter': '( GMT -5 ) Pacific/Easter',
    'Pacific/Efate': '( GMT +11 ) Pacific/Efate',
    'Pacific/Enderbury': '( GMT +13 ) Pacific/Enderbury',
    'Pacific/Fakaofo': '( GMT +13 ) Pacific/Fakaofo',
    'Pacific/Fiji': '( GMT +12 ) Pacific/Fiji',
    'Pacific/Funafuti': '( GMT +12 ) Pacific/Funafuti',
    'Pacific/Galapagos': '( GMT -6 ) Pacific/Galapagos',
    'Pacific/Gambier': '( GMT -9 ) Pacific/Gambier',
    'Pacific/Guadalcanal': '( GMT +11 ) Pacific/Guadalcanal',
    'Pacific/Guam': '( GMT +10 ) Pacific/Guam',
    'Pacific/Honolulu': '( GMT -10 ) Pacific/Honolulu',
    'Pacific/Johnston': '( GMT -10 ) Pacific/Johnston',
    'Pacific/Kiritimati': '( GMT +14 ) Pacific/Kiritimati',
    'Pacific/Kosrae': '( GMT +11 ) Pacific/Kosrae',
    'Pacific/Kwajalein': '( GMT +12 ) Pacific/Kwajalein',
    'Pacific/Majuro': '( GMT +12 ) Pacific/Majuro',
    'Pacific/Marquesas': '( GMT -10 ) Pacific/Marquesas',
    'Pacific/Midway': '( GMT -11 ) Pacific/Midway',
    'Pacific/Nauru': '( GMT +12 ) Pacific/Nauru',
    'Pacific/Niue': '( GMT -11 ) Pacific/Niue',
    'Pacific/Norfolk': '( GMT +11 ) Pacific/Norfolk',
    'Pacific/Noumea': '( GMT +11 ) Pacific/Noumea',
    'Pacific/Pago_Pago': '( GMT -11 ) Pacific/Pago_Pago',
    'Pacific/Palau': '( GMT +9 ) Pacific/Palau',
    'Pacific/Pitcairn': '( GMT -8 ) Pacific/Pitcairn',
    'Pacific/Pohnpei': '( GMT +11 ) Pacific/Pohnpei',
    'Pacific/Port_Moresby': '( GMT +10 ) Pacific/Port_Moresby',
    'Pacific/Rarotonga': '( GMT -10 ) Pacific/Rarotonga',
    'Pacific/Saipan': '( GMT +10 ) Pacific/Saipan',
    'Pacific/Tahiti': '( GMT -10 ) Pacific/Tahiti',
    'Pacific/Tarawa': '( GMT +12 ) Pacific/Tarawa',
    'Pacific/Tongatapu': '( GMT +13 ) Pacific/Tongatapu',
    'Pacific/Wake': '( GMT +12 ) Pacific/Wake',
    'Pacific/Wallis': '( GMT +12 ) Pacific/Wallis'
}

//Login prototype/class
ChannelManager.prototype = {
    constructor: ChannelManager,
    init_scheduler: function () {
        scheduler.locale.labels.timeline_tab = "Timeline";
        scheduler.config.mark_now = true;
        scheduler.config.default_date = "%D, %M %j";
        scheduler.config.xml_date = "%Y-%m-%d %H:%i:%s";
        scheduler.config.drag_resize = false;
        scheduler.config.occurrence_timestamp_in_utc = true;
        scheduler.config.include_end_by = true;
        scheduler.config.repeat_precise = true;
        scheduler.config.time_step = 1 / 60;
        var categories_id = categoryIDs.join();
        var ac_id = ac_filter.join();

        scheduler.templates.event_bar_text = function (start, end, event) {
            //return '<span class="dhx_body dhx_event_move">' + event.text + '</span>';
            return '&nbsp;&nbsp;' + event.text;
        };

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
            dx: 350,
            event_dy: "full",
//            second_scale: {
//                x_unit: "minute",
//                x_date: "%h:%i %A",
//                x_step: 30,
//                x_size: 4, //X-Axis length specified as the total number of 'x_step's
//                x_start: x_step, //X-Axis offset in 'x_unit's
//                x_length: 4, //number of 'x_step's that will be scrolled at a time
//            }
        });

        var timezone = jstz.determine();
        var tz = timezone.name();
        var img_ver;
        scheduler.init('scheduler', new Date(), 'timeline');
        scheduler.load("/apps/channel/v1.0/index.php?pid=" + sessInfo.pid + "&ks=" + sessInfo.ks + "&action=get_channels" + "&category=" + categories_id + "&ac=" + ac_id + "&search=" + search + "&tz=" + tz, "json", function () {
            $(".dhx_cal_data .dhx_matrix_scell .channel_wrapper").each(function () {
                if ($(this).attr('data-channel-id') !== undefined) {
                    var img = $(this).find('.channel_thumb img').attr('src').split('version');
                    var img_split = img[1].split('width');
                    img_ver = img_split[0];
                } else {
                    img_ver = 1;
                }
                channel_options += '<li data-channel-select-id="' + $(this).attr('data-channel-id') + '"><a href="#"><img src="https://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/thumbnail/entry_id/' + $(this).attr('data-channel-id') + '/version' + img_ver + 'height/40/width/71" height="40" width="71"><div class="channel-select-title">' + $(this).attr('title') + '</div></a></li>';
            });
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
            smhCM.emptyCheck();
        });

        scheduler.config.className = 'dhtmlXTooltip tooltip';
        scheduler.config.timeout_to_display = 50;
        scheduler.config.delta_x = 15;
        scheduler.config.delta_y = -20;
        var format = scheduler.date.date_to_str("%h:%i:%s %A");
        scheduler.templates.tooltip_text = function (start, end, event) {
            return "<b>" + event.text + "</b><br/>" + format(start) + " - " + format(end);
        };


        scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
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

        scheduler.attachEvent("onEventDrag", function (id, mode, e) {
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
            return true;
        });

//        scheduler.attachEvent("onDragEnd", function (id, mode, e) {
//            $(".dhx_cal_event_line").dotdotdot({
//                height: 126,
//                watch: true,
//                ellipsis: "\u2026 ",
//                truncate: "letter",
//                fallbackToLetter: true
//            });
//            $(".channel_title").dotdotdot({
//                height: 56,
//                watch: true,
//                ellipsis: "\u2026 ",
//                truncate: "letter",
//                fallbackToLetter: true
//            });
//            return true;
//        });

        scheduler.showLightbox = function (id, action) {
            console.log("action:");
            console.log(action);
            if (action === 'update') {
                if (!readonly) {
                    var format = scheduler.date.date_to_str("%Y-%m-%d %h:%i:%s %A");
                    var ev = scheduler.getEvent(id);
                    console.log(ev)
                    if (ev !== undefined) {
                        scheduler.startLightbox(id, null);
                        scheduler.hideCover();
                        var start_date = '';
                        var end_date = '';
                        if (ev.event_pid === 0) {
                            start_date = format(ev.start_date);
                            end_date = format(ev.end_date);
                            smhCM.editProgram(ev.live_segment_id, ev.pcid, ev.channel_id, ev.entryId, ev.text, ev.thumbId, ev.event_length, ev.repeat, ev.rec_type, start_date, end_date);
                        } else if (ev.__proto__.event_pid === 0) {
                            start_date = format(ev.__proto__.start_date);
                            end_date = format(ev.__proto__.end_date);
                            smhCM.editProgram(ev.__proto__.live_segment_id, ev.__proto__.pcid, ev.__proto__.channel_id, ev.__proto__.entryId, ev.__proto__.text, ev.__proto__.thumbId, ev.__proto__.event_length, ev.__proto__.repeat, ev.__proto__.rec_type, start_date, end_date);
                        } else if (ev.__proto__.__proto__.event_pid === 0) {
                            start_date = format(ev.__proto__.__proto__.start_date);
                            end_date = format(ev.__proto__.__proto__.end_date);
                            smhCM.editProgram(ev.__proto__.__proto__.live_segment_id, ev.__proto__.__proto__.pcid, ev.__proto__.__proto__.channel_id, ev.__proto__.__proto__.entryId, ev.__proto__.__proto__.text, ev.__proto__.__proto__.thumbId, ev.__proto__.__proto__.event_length, ev.__proto__.__proto__.repeat, ev.__proto__.__proto__.rec_type, start_date, end_date);
                        }
                    }
                }
            } else if (action === 'add') {
                if (!readonly) {
                    var format = scheduler.date.date_to_str("%Y-%m-%d %h:%i:%s %A");
                    var ev = scheduler.getEvent(id);
                    console.log(ev)
                    if (ev !== undefined) {
                        scheduler.startLightbox(id, null);
                        scheduler.hideCover();
                        var start_date = format(ev.start_date);
                        var end_date = format(ev.end_date);
                        smhCM.addNewProgram(ev.channel_id, ev.id, start_date, end_date);
                    }
                }
            }
        }

        scheduler.attachEvent("onClick", function (id, e) {
            console.log("onClick");
            var className = $(e.target).prop("class").replace("ddd-truncated", "").trim();
            if (className === "dhx_cal_event_line") {
                if (!readonly) {
                    scheduler.showLightbox(id, 'update');
                }
            }
        });

        scheduler.attachEvent("onEmptyClick", function (date, e) {
            console.log("onEmptyClick");
            var className = $(e.target).prop("class").trim();
            if (className === "dhx_matrix_cell") {
                if (!readonly) {
                    var action_data = scheduler.getActionData(e);
                    var event = {
                        start_date: action_data.date,
                        end_date: scheduler.date.add(action_data.date, 1 / 60, "minute"),
                        channel_id: action_data.section,
                        text: 'New Program'
                    };
                    var eventId = scheduler.addEventNow(event);
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
                    scheduler.showLightbox(eventId, 'add');
                }
            }
        });

        var dragged_event;
        var collided = false;
        var drag_mode_move = false;
        scheduler.attachEvent("onBeforeDrag", function (id, mode, e) {
            collided = false;
            drag_mode_move = (mode === 'move') ? true : false;
            dragged_event = scheduler.getEvent(id); //use it to get the object of the dragged event
            return true;
        });
        scheduler.attachEvent("onDragEnd", function () {
            var event_obj = dragged_event;
            if (!collided && drag_mode_move) {
                var format = scheduler.date.date_to_str("%Y-%m-%d %h:%i:%s %A");
                console.log(event_obj);
                var cid = event_obj.channel_id;
                var name = event_obj.text;
                var start_date = format(event_obj.start_date);
                var end_date, new_end_date;
                var lsid, pcid, eid, repeat, rec_type, event_length;
                if (event_obj.event_pid === 0) {
                    lsid = event_obj.live_segment_id;
                    pcid = event_obj.pcid;
                    eid = event_obj.entryId;
                    repeat = event_obj.repeat;
                    rec_type = event_obj.rec_type;
                    event_length = event_obj.event_length;
                    new_end_date = event_obj.end_date;
                } else if (event_obj.__proto__.event_pid === 0) {
                    lsid = event_obj.__proto__.live_segment_id;
                    pcid = event_obj.__proto__.pcid;
                    eid = event_obj.__proto__.entryId;
                    repeat = event_obj.__proto__.repeat;
                    rec_type = event_obj.__proto__.rec_type;
                    event_length = event_obj.__proto__.event_length;
                    new_end_date = event_obj.__proto__.end_date;
                } else if (event_obj.__proto__.__proto__.event_pid === 0) {
                    lsid = event_obj.__proto__.__proto__.live_segment_id;
                    pcid = event_obj.__proto__.__proto__.pcid;
                    eid = event_obj.__proto__.__proto__.entryId;
                    repeat = event_obj.__proto__.__proto__.repeat;
                    rec_type = event_obj.__proto__.__proto__.rec_type;
                    event_length = event_obj.__proto__.__proto__.event_length;
                    new_end_date = event_obj.__proto__.__proto__.end_date;
                }
                if (repeat) {
                    var rec_type_split = rec_type.split('_');
                    var type = rec_type_split[0];
                    var count = Number(rec_type_split[1]);
                    var day = Number(rec_type_split[2]);
                    var count2 = Number(rec_type_split[3]);
                    var days_extra = rec_type_split[4].split('#');
                    var days = days_extra[0];
                    var extra = days_extra[1];
                    console.log(extra)

                    if (extra === 'no') {
                        end_date = '9999-02-01 00:00:00';
                    } else if (!extra) {
                        var date = new Date(new_end_date);
                        var new_date = date.setDate(date.getDate() + 1);
                        var d = new Date(new_date);
                        end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }

                    if (type === 'day') {
                        if (extra && extra !== 'no') {
                            var additional_days = Number(count) * Number(extra);
                            var date = new Date(start_date);
                            var new_date = date.setDate(date.getDate() + Number(additional_days));
                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    } else if (type === 'week') {
                        var days_arr = days.split(',');
                        for (var i = 0; i < days_arr.length; i++) {
                            days_arr[i] = parseInt(days_arr[i], 10);
                        }

                        var check_date = new Date(start_date);
                        if ($.inArray(check_date.getDay(), days_arr) === -1) {
                            var firstOccurr = smhCM.getWeeklyStartDate(days_arr, start_date);
                            var start_date_mod = new Date(firstOccurr);
                            var month_day = start_date_mod.getDate();
                            var month = ("0" + (start_date_mod.getMonth() + 1)).slice(-2);
                            var year = start_date_mod.getFullYear();

                            var hour = smhCM.addZero(start_date_mod.getHours());
                            var minute = smhCM.addZero(start_date_mod.getMinutes());
                            var second = smhCM.addZero(start_date_mod.getSeconds());
                            var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                            var d = new Date(new_date);
                            start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                        if (extra && extra !== 'no') {
                            var find_week_end_date = smhCM.getWeeklyEndDate(days_arr, Number(count), Number(extra), start_date);
                            var d = new Date(find_week_end_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    } else if (type === 'month') {
                        if (day) {
                            var new_start_date = smhCM.getMonthlyStartDate(Number(count2), day, start_date);
                            var d = new Date(new_start_date);
                            start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");

                            if (extra && extra !== 'no') {
                                var additional_months = Number(count) * Number(extra);
                                var date = new Date(start_date);
                                var new_date = date.addMonths(Number(additional_months));
                                var d = new Date(new_date);
                                var new_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                                var nth_end_date = smhCM.nthWeekdayOfMonth(day, count2, new_end_date)

                                var end_date_mod = new Date(nth_end_date);
                                var month_day = end_date_mod.getDate();
                                var month = ("0" + (end_date_mod.getMonth() + 1)).slice(-2);
                                var year = end_date_mod.getFullYear();

                                var start_date_mod = new Date(start_date);
                                var hour = smhCM.addZero(start_date_mod.getHours());
                                var minute = smhCM.addZero(start_date_mod.getMinutes());
                                var second = smhCM.addZero(start_date_mod.getSeconds());
                                var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                                var d = new Date(new_date);
                                //var pre_end_date = d.addDays(1);
                                end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            }
                        } else {
                            if (extra && extra !== 'no') {
                                var additional_months = Number(count) * Number(extra);
                                var date = new Date(start_date);
                                var new_date = date.addMonths(Number(additional_months));
                                var d = new Date(new_date);
                                end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            }
                        }
                    } else if (type === 'year') {
                        if (day) {
                            var date = new Date(start_date);
                            var year = date.getFullYear();
                            var month = ("0" + (date.getMonth() + 1)).slice(-2);
                            var hour = smhCM.addZero(date.getHours());
                            var minute = smhCM.addZero(date.getMinutes());
                            var second = smhCM.addZero(date.getSeconds());
                            var new_date = year + '-' + month + '-01 ' + hour + ':' + minute + ':' + second;
                            var nth_start_date = smhCM.nthWeekdayOfMonth(day, count2, new_date);
                            var start_date_mod = nth_start_date.toString("yyyy-MM-dd " + hour + ":" + minute + ":" + second);
                            var date_mod = new Date(start_date_mod);
                            start_date = date_mod.toString("yyyy-MM-dd hh:mm:ss tt");

                            if (extra && extra !== 'no') {
                                var additional_years = Number(count) * Number(extra);
                                var date = new Date(start_date);
                                var new_date = date.addYears(Number(additional_years));
                                var d = new Date(new_date);
                                var new_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                                var nth_end_date = smhCM.nthWeekdayOfMonth(day, count2, new_end_date);

                                var end_date_mod = new Date(nth_end_date);
                                var month_day = end_date_mod.getDate();
                                var month = ("0" + (end_date_mod.getMonth() + 1)).slice(-2);
                                var year = end_date_mod.getFullYear();

                                var start_date_mod = new Date(start_date);
                                var hour = smhCM.addZero(start_date_mod.getHours());
                                var minute = smhCM.addZero(start_date_mod.getMinutes());
                                var second = smhCM.addZero(start_date_mod.getSeconds());
                                var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                                var d = new Date(new_date);
                                end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            }
                        } else {
                            if (extra && extra !== 'no') {
                                var date = new Date(start_date);
                                var new_date = date.addYears(Number(extra));
                                var d = new Date(new_date);
                                end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            }
                        }
                    }
                } else {
                    end_date = format(event_obj.end_date);
                }
                smhCM.moveProgram(name, lsid, pcid, cid, eid, start_date, end_date, repeat, rec_type, event_length);
            }
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
            return true;
        });

        scheduler.attachEvent("onEventCollision", function (ev, evs) {
            collided = true;
            return true;
        });
    },
    refresh_schedule: function () {
        var categories_id = categoryIDs.join();
        var ac_id = ac_filter.join();
        scheduler.clearAll();
        channel_options = '';
        smhCM.getTimeZone();
        scheduler.load("/apps/channel/v1.0/index.php?pid=" + sessInfo.pid + "&ks=" + sessInfo.ks + "&action=get_channels" + "&category=" + categories_id + "&ac=" + ac_id + "&search=" + search + "&tz=" + your_timezone, "json", function () {
            $(".dhx_cal_data .dhx_matrix_scell .channel_wrapper").each(function () {
                channel_options += '<li data-channel-select-id="' + $(this).attr('data-channel-id') + '"><a href="#"><img src="https://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/thumbnail/entry_id/' + $(this).attr('data-channel-id') + '/quality/100/type/1/height/40/width/71" height="40" width="71"><div class="channel-select-title">' + $(this).attr('title') + '</div></a></li>';
            });
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
            smhCM.emptyCheck();
        });
    },
    moveProgram: function (name, lsid, pcid, cid, eid, start_date, end_date, repeat, rec_type, event_length) {
        smhCM.resetModal();
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Move</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin-top: 15px; height: 90px; width: 404px;'>Are you sure you want to move the following program:<div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div><div style='padding-bottom: 10px;'>to this new date/time?</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="move-program" onclick="smhCM.doMove(' + lsid + ',' + pcid + ',\'' + cid + '\',\'' + eid + '\',\'' + start_date + '\',\'' + end_date + '\',' + repeat + ',\'' + rec_type + '\',' + event_length + ')">Move</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    doMove: function (lsid, pcid, cid, eid, start_date, end_date, repeat, rec_type, event_length) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'update_program',
            lsid: lsid,
            pcid: pcid,
            cid: cid,
            eid: eid,
            start_date: start_date,
            end_date: end_date,
            repeat: repeat,
            rec_type: rec_type,
            event_length: event_length
        }
        console.log('doMove:')
        console.log(sessData)

        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#move-program').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    smhCM.refresh_schedule();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Program Successfully Moved!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#move-program').removeAttr('disabled');
                        $(".smh-close").click();
                    }, 3000);
                } else {
                    if (data['collision']) {
                        smhCM.conflictFound(0);
                        $('#smh-modal #loading img').css('display', 'none');
                        setTimeout(function () {
                            $('#smh-modal #pass-result').empty();
                            $('#move-program').removeAttr('disabled');
                        }, 3000);
                    } else {
                        $('#smh-modal #loading img').css('display', 'none');
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                    }
                }
            }
        });
    },
    emptyCheck: function () {
        var empty_check = scheduler.matrix.timeline.y_unit;
        if (empty_check.length === 1) {
            $.each(empty_check, function (index, value) {
                if (value.key === 0) {
                    readonly = true;
                    //scheduler.updateView();
                } else {
                    readonly = false;
                }
            });
        } else {
            readonly = false;
        }
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
//        scheduler.showLightbox = function (id, action) {
//            console.log("action:");
//            console.log(action);
//            if (action === 'update') {
//                if (!readonly) {
//                    var format = scheduler.date.date_to_str("%Y-%m-%d %h:%i:%s %A");
//                    var ev = scheduler.getEvent(id);
//                    console.log(ev)
//                    if (ev !== undefined) {
//                        scheduler.startLightbox(id, null);
//                        scheduler.hideCover();
//                        var start_date = '';
//                        var end_date = '';
//                        if (ev.__proto__.entryId) {
//                            start_date = format(ev.__proto__.start_date);
//                            end_date = format(ev.__proto__.end_date);
//                            smhCM.editProgram(ev.__proto__.live_segment_id, ev.__proto__.pcid, ev.__proto__.channel_id, ev.__proto__.entryId, ev.__proto__.text, ev.__proto__.event_length, ev.__proto__.repeat, ev.__proto__.rec_type, start_date, end_date);
//                        } else {
//                            start_date = format(ev.start_date);
//                            end_date = format(ev.end_date);
//                            smhCM.editProgram(ev.live_segment_id, ev.pcid, ev.channel_id, ev.entryId, ev.text, ev.event_length, ev.repeat, ev.rec_type, start_date, end_date);
//                        }
//                    }
//                }
//            } else if (action === 'add') {
//                if (!readonly) {
//                    var format = scheduler.date.date_to_str("%Y-%m-%d %h:%i:%s %A");
//                    var ev = scheduler.getEvent(id);
//                    console.log(ev)
//                    if (ev !== undefined) {
//                        scheduler.startLightbox(id, null);
//                        scheduler.hideCover();
//                        var start_date = format(ev.start_date);
//                        var end_date = format(ev.end_date);
//                        smhCM.addNewProgram(ev.channel_id, ev.id, start_date, end_date);
//                    }
//                }
//            }
//        }
//
//        scheduler.attachEvent("onClick", function (id, e) {
//            console.log("onClick");
//            var className = $(e.target).prop("class").replace("ddd-truncated", "").trim();
//            if (className === "dhx_cal_event_line") {
//                if (!readonly) {
//                    scheduler.showLightbox(id, 'update');
//                }
//            }
//        });
//
//        scheduler.attachEvent("onEmptyClick", function (date, e) {
//            console.log("onEmptyClick");
//            var className = $(e.target).prop("class").trim();
//            if (className === "dhx_matrix_cell") {
//                if (!readonly) {
//                    var action_data = scheduler.getActionData(e);
//                    var event = {
//                        start_date: action_data.date,
//                        end_date: scheduler.date.add(action_data.date, 1 / 60, "minute"),
//                        channel_id: action_data.section,
//                        text: 'New Program'
//                    };
//                    var eventId = scheduler.addEventNow(event);
//                    $(".dhx_cal_event_line").dotdotdot({
//                        height: 126,
//                        watch: true,
//                        ellipsis: "\u2026 ",
//                        truncate: "letter",
//                        fallbackToLetter: true
//                    });
//                    $(".channel_title").dotdotdot({
//                        height: 56,
//                        watch: true,
//                        ellipsis: "\u2026 ",
//                        truncate: "letter",
//                        fallbackToLetter: true
//                    });
//                    scheduler.showLightbox(eventId, 'add');
//                }
//            }
//        });
    },
    zoomOut: function () {
        if ((scheduler.matrix.timeline.x_size !== 24) && (scheduler.matrix.timeline.x_length !== 24)) {
            var new_size = scheduler.matrix.timeline.x_size + 1;
            var new_length = scheduler.matrix.timeline.x_length + 1;
            scheduler.matrix.timeline.x_size = new_size;
            scheduler.matrix.timeline.x_length = new_length;
            scheduler.updateView();
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
    addNewProgram: function (channelId, eventId, start_date, end_date) {
        smhCM.resetModal();
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal" onclick="smhCM.removeEvent(' + eventId + ')"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Program</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<form id="add-program-form">' +
                '<div class="row">' +
                '<div class="col-sm-10 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">Run On Channel:</span></td><td>' +
                '<div class="dropdown">' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="channel-selected"></span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="channel-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                channel_options +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">Program Source:</span></td><td><div id="program-selected"><div id="program-title">None Selected</div><span style="display: inline-block;float: right;"><button type="button" class="btn btn-block bg-olive" id="select-program" onclick="smhCM.selectProgram(\'timeline\');" style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;padding: 10px 15px;position: relative;top: 0px;right: 0px;height: 41px;"><i class="fa fa-external-link"></i></button></span></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td valign=top><div style="font-weight: normal;">Program Schedule:</div></td><td><div class="repeat-title">Start Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker1">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + start_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div style="margin-top:10px;" class="repeat-title">End Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker2">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + end_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Repeat Program:</span></td><td><input data-toggle="toggle" id="recurrence-status" type="checkbox"></td>' +
                '</tr>' +
                '<tr id="all-repeat-options">' +
                '<td></td><td>' +
                '<div class="repeat-title">Program Length</div>' +
                '<span class="size1"><input id="hours" name="value" value=00><div>hours</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="minutes" name="value" value=00><div>minutes</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="seconds" name="value" value=00><div>seconds</div></span>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-wrapper">' +
                '<div class="repeat-title">Repeat Pattern</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="pattern-selected">Daily</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-pattern-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">Daily</a></li>' +
                '<li><a href="#">Weekly</a></li>' +
                '<li><a href="#">Monthly</a></li>' +
                '<li><a href="#">Yearly</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div id="repeat-options">' +
                '<div class="repeat-title">Repeat Every</div>' +
                '<input type="text" class="form-control" id="repeat-everyday" value="1"/><span id="repeat-everyday-text">day(s)</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-ends-wrapper">' +
                '<div class="repeat-title">Recurrence Ends</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="repeat-ends-selected">No End Date</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-ends-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">No End Date</a></li>' +
                '<li><a href="#">After</a></li>' +
                '<li><a href="#">End by</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="repeat-ends-options">' +
                '</div>' +
                '<div class="clear"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal .modal-body').html(content);

        //var saved_end_date = $('#datetimepicker2 input').val();
        $('#recurrence-status').change(function () {
            if ($(this).prop('checked')) {
                $('#all-repeat-options').css('display', 'table-row');
                $('#datetimepicker2 input').val('');
                $('#datetimepicker2 input').prop('disabled', true);
                $('#seconds').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#minutes').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#minutes').spinner('stepDown');
                            return false;
                        }
                    },
                    value: 300
                });
                $('#minutes').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#hours').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#hours').spinner('stepDown');
                            return false;
                        }
                    }
                });
                $('#hours').spinner({
                    numberFormat: "d2",
                    alignment: 'vertical',
                    min: 0
                });

                $('.ui-spinner a').addClass('ui-state-default');

            } else {
                var entry = $('#program-selected').attr('data-entry');
                if (entry) {
                    var entry_duration = $('#program-selected').attr('data-entry-duration');
                    var start_date = $('#datetimepicker1 input').val();
                    var d = new Date(start_date);
                    d.setSeconds(d.getSeconds() + Number(entry_duration));
                    var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(entry_end_date);
                } else {
                    var start_date_mod = $('#datetimepicker1 input').val();
                    var d = new Date(start_date_mod);
                    d.setSeconds(d.getSeconds() + 1);
                    var end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(end_date);
                }
                $('#all-repeat-options').css('display', 'none');
                $('#datetimepicker2 input').prop('disabled', false);
            }
        });

        $(".modal #channel-list li").each(function () {
            if (channelId === $(this).attr('data-channel-select-id')) {
                $('#channel-selected').html($(this).html());
                $('#channel-selected').attr('data-channel-selected', channelId);
            }
        });

        $('#smh-modal #add-program-form .dropdown').on('click', '.mCSB_scrollTools', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

        $('#smh-modal #channel-list').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $(".channel-select-title").dotdotdot({
            height: 56,
            watch: true,
            ellipsis: "\u2026 ",
            truncate: "letter",
            fallbackToLetter: true
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            ignoreReadonly: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            useCurrent: false,
            ignoreReadonly: true
        });

        $('#datetimepicker1').on('dp.change', function (e) {
            var entry = $('#program-selected').attr('data-entry');
            var repeat = $('#recurrence-status').is(":checked");
            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
            if (entry && !repeat && entry_duration) {
                var new_start_date = $('#datetimepicker1 input').val();
                var d = new Date(new_start_date);
                d.setSeconds(d.getSeconds() + entry_duration);
                var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                $('#datetimepicker2 input').val(entry_end_date);
            }
        });

//        $('#datetimepicker2').on('dp.change', function (e) {
//            var entry = $('#program-selected').attr('data-entry');
//            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
//            if (entry && entry_duration) {
//                var new_end_date = $('#datetimepicker2 input').val();
//                var d = new Date(new_end_date);
//                d.setSeconds(d.getSeconds() - entry_duration);
//                var entry_start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
//                $('#datetimepicker1 input').val(entry_start_date);
//            }
//        });

        $('#recurrence-status').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal" onclick="smhCM.removeEvent(' + eventId + ')">Cancel</button><button type="button" class="btn btn-primary" id="add-program" onclick="smhCM.saveProgram(\'' + channelId + '\',\'timeline\')">Save</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    editChannelProgram: function (lsid, pcid, channelId, entryId, entryName, thumbId, entryLength, repeat, rec_type, start_date, end_date) {
        smhCM.resetModal2();
//        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '600px');
        $('#smh-modal2 .modal-body').css('padding', '0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1000');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Program</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<form id="add-program-form">' +
                '<div class="row">' +
                '<div class="col-sm-10 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">Program Source:</span></td><td><span id="channel-selected" data-channel-selected="' + channelId + '"></span><div id="program-selected" data-entry="' + entryId + '" data-entry-duration="' + entryLength + '"><img src="http://devplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/thumbnail/entry_id/' + thumbId + '/quality/100/type/1/height/40/width/71" height="40" width="71"><div id="program-title">' + entryName + '</div><span style="display: inline-block;float: right;"><button type="button" class="btn btn-block bg-olive" id="select-program" onclick="smhCM.selectProgram(\'channel\');" style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;padding: 10px 15px;position: relative;top: 0px;right: 0px;height: 41px;"><i class="fa fa-external-link"></i></button></span></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td valign=top><div style="font-weight: normal;">Program Schedule:</div></td><td><div class="repeat-title">Start Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker1">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + start_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div style="margin-top:10px;" class="repeat-title">End Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker2">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + end_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Repeat Program:</span></td><td><input data-toggle="toggle" id="recurrence-status" type="checkbox"></td>' +
                '</tr>' +
                '<tr id="all-repeat-options">' +
                '<td></td><td>' +
                '<div class="repeat-title">Program Length</div>' +
                '<span class="size1"><input id="hours" name="value" value=00><div>hours</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="minutes" name="value" value=00><div>minutes</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="seconds" name="value" value=00><div>seconds</div></span>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-wrapper">' +
                '<div class="repeat-title">Repeat Pattern</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="pattern-selected">Daily</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-pattern-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">Daily</a></li>' +
                '<li><a href="#">Weekly</a></li>' +
                '<li><a href="#">Monthly</a></li>' +
                '<li><a href="#">Yearly</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div id="repeat-options">' +
                '<div class="repeat-title">Repeat Every</div>' +
                '<input type="text" class="form-control" id="repeat-everyday" value="1"/><span id="repeat-everyday-text">day(s)</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-ends-wrapper">' +
                '<div class="repeat-title">Recurrence Ends</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="repeat-ends-selected">No End Date</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-ends-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">No End Date</a></li>' +
                '<li><a href="#">After</a></li>' +
                '<li><a href="#">End by</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="repeat-ends-options">' +
                '</div>' +
                '<div class="clear"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal2 .modal-body').html(content);

        $('#recurrence-status').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

        if (API) {
            API.destroy();
        }
        API = $('#smh-modal2 #program-title').dotdotdot({
            height: 32,
            watch: true,
            ellipsis: "\u2026 ",
            truncate: "letter",
            fallbackToLetter: true
        }).data("dotdotdot");


        //var saved_end_date = $('#datetimepicker2 input').val();
        $('#recurrence-status').change(function () {
            if ($(this).prop('checked')) {
                $('#all-repeat-options').css('display', 'table-row');
                $('#datetimepicker2 input').val('');
                $('#datetimepicker2 input').prop('disabled', true);
                $('#seconds').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#minutes').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#minutes').spinner('stepDown');
                            return false;
                        }
                    },
                    value: 300
                });
                $('#minutes').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#hours').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#hours').spinner('stepDown');
                            return false;
                        }
                    }
                });
                $('#hours').spinner({
                    numberFormat: "d2",
                    alignment: 'vertical',
                    min: 0
                });

                $('.ui-spinner a').addClass('ui-state-default');

            } else {
                var entry = $('#program-selected').attr('data-entry');
                if (entry) {
                    var entry_duration = $('#program-selected').attr('data-entry-duration');
                    var start_date = $('#datetimepicker1 input').val();
                    var d = new Date(start_date);
                    d.setSeconds(d.getSeconds() + Number(entry_duration));
                    var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(entry_end_date);
                } else {
                    var start_date_mod = $('#datetimepicker1 input').val();
                    var d = new Date(start_date_mod);
                    d.setSeconds(d.getSeconds() + 1);
                    var end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(end_date);
                }
                $('#all-repeat-options').css('display', 'none');
                $('#datetimepicker2 input').prop('disabled', false);
            }
        });

        $(".modal #channel-list li").each(function () {
            if (channelId === $(this).attr('data-channel-select-id')) {
                $('#channel-selected').html($(this).html());
                $('#channel-selected').attr('data-channel-selected', channelId);
            }
        });

        $('#smh-modal2 #add-program-form .dropdown').on('click', '.mCSB_scrollTools', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

        $('#smh-modal2 #channel-list').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $(".channel-select-title").dotdotdot({
            height: 56,
            watch: true,
            ellipsis: "\u2026 ",
            truncate: "letter",
            fallbackToLetter: true
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            ignoreReadonly: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            useCurrent: false,
            ignoreReadonly: true
        });

        $('#datetimepicker1').on('dp.change', function (e) {
            var entry = $('#program-selected').attr('data-entry');
            var repeat = $('#recurrence-status').is(":checked");
            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
            if (entry && !repeat && entry_duration) {
                var new_start_date = $('#datetimepicker1 input').val();
                var d = new Date(new_start_date);
                d.setSeconds(d.getSeconds() + entry_duration);
                var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                $('#datetimepicker2 input').val(entry_end_date);
            }
        });

//        $('#datetimepicker2').on('dp.change', function (e) {
//            var entry = $('#program-selected').attr('data-entry');
//            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
//            if (entry && entry_duration) {
//                var new_end_date = $('#datetimepicker2 input').val();
//                var d = new Date(new_end_date);
//                d.setSeconds(d.getSeconds() - entry_duration);
//                var entry_start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
//                $('#datetimepicker1 input').val(entry_start_date);
//            }
//        });

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="update-program" onclick="smhCM.updateProgram(' + lsid + ',' + pcid + ',\'' + channelId + '\',\'channel\')">Update</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        if (Number(entryLength) !== 0) {
            var duration_hms = smhCM.secondsTimeSpanToHMS(entryLength);
            var duration_parse = duration_hms.split(":");
            var duration_hours = duration_parse[0];
            var duration_mintues = duration_parse[1];
            var duration_seconds = duration_parse[2];
            $('#hours').val(duration_hours);
            $('#minutes').val(duration_mintues);
            $('#seconds').val(duration_seconds);
        }

        if (repeat) {
            $('#recurrence-status').bootstrapToggle('on');
            var rec_type_split = rec_type.split('_');
            var type = rec_type_split[0].charAt(0).toUpperCase() + rec_type_split[0].slice(1).toLowerCase().replace("ay", "ai") + 'ly';
            var count = Number(rec_type_split[1]);
            var day = Number(rec_type_split[2]);
            var count2 = Number(rec_type_split[3]);
            var days_extra = rec_type_split[4].split('#');
            var days = days_extra[0];
            var extra = days_extra[1];

            $('#repeat-pattern-list').find('a:contains("' + type + '")').click();

            if (type === 'Daily') {
                $('#repeat-everyday').val(count);
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            } else if (type === 'Weekly') {
                $('#repeat-everyweek').val(count);
                var days_arr = days.split(',');
                $.each(days_arr, function (index, value) {
                    if (Number(value) === 0) {
                        $('.day-table input[value="0"]').prop('checked', true);
                    } else if (Number(value) === 1) {
                        $('.day-table input[value="1"]').prop('checked', true);
                    } else if (Number(value) === 2) {
                        $('.day-table input[value="2"]').prop('checked', true);
                    } else if (Number(value) === 3) {
                        $('.day-table input[value="3"]').prop('checked', true);
                    } else if (Number(value) === 4) {
                        $('.day-table input[value="4"]').prop('checked', true);
                    } else if (Number(value) === 5) {
                        $('.day-table input[value="5"]').prop('checked', true);
                    } else if (Number(value) === 6) {
                        $('.day-table input[value="6"]').prop('checked', true);
                    }
                });
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            } else if (type === 'Monthly') {
                if (day) {
                    $('#repeat-month-options-list').find('a:contains("On")').click();
                    $('#month-week-day-count').val(count);
                    var weekth = count2 + smhCM.nth(count2);
                    $('#repeat-month-week-list').find('a').filter(function () {
                        return $(this).text() === weekth;
                    }).click();
                    if (day === 0) {
                        $('#repeat-month-week-day-list').find('a:contains("Sunday")').click();
                    } else if (day === 1) {
                        $('#repeat-month-week-day-list').find('a:contains("Monday")').click();
                    } else if (day === 2) {
                        $('#repeat-month-week-day-list').find('a:contains("Tuesday")').click();
                    } else if (day === 3) {
                        $('#repeat-month-week-day-list').find('a:contains("Wednesday")').click();
                    } else if (day === 4) {
                        $('#repeat-month-week-day-list').find('a:contains("Thursday")').click();
                    } else if (day === 5) {
                        $('#repeat-month-week-day-list').find('a:contains("Friday")').click();
                    } else if (day === 6) {
                        $('#repeat-month-week-day-list').find('a:contains("Saturday")').click();
                    }
                } else {
                    $('#repeat-month-options-list').find('a:contains("Repeat")').click();
                    $('#month-count').val(count);
                    var start_dt = new Date(start_date);
                    var month_day = Number(start_dt.toString("dd").replace(/\b0(?=\d)/g, ''));
                    var dayth = month_day + smhCM.nth(month_day);
                    $('#repeat-month-day-list').find('a').filter(function () {
                        return $(this).text() === dayth;
                    }).click();
                }
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            } else if (type === 'Yearly') {
                if (day) {
                    $('#repeat-year-options-list').find('a:contains("On")').click();
                    var weekth = count2 + smhCM.nth(count2);
                    $('#repeat-year-day-month-list').find('a').filter(function () {
                        return $(this).text() === weekth;
                    }).click();
                    if (day === 0) {
                        $('#repeat-year-week-day-list').find('a:contains("Sunday")').click();
                    } else if (day === 1) {
                        $('#repeat-year-week-day-list').find('a:contains("Monday")').click();
                    } else if (day === 2) {
                        $('#repeat-year-week-day-list').find('a:contains("Tuesday")').click();
                    } else if (day === 3) {
                        $('#repeat-year-week-day-list').find('a:contains("Wednesday")').click();
                    } else if (day === 4) {
                        $('#repeat-year-week-day-list').find('a:contains("Thursday")').click();
                    } else if (day === 5) {
                        $('#repeat-year-week-day-list').find('a:contains("Friday")').click();
                    } else if (day === 6) {
                        $('#repeat-year-week-day-list').find('a:contains("Saturday")').click();
                    }
                    var start_dt = new Date(start_date);
                    var month = Number(start_dt.toString("MM").replace(/\b0(?=\d)/g, ''));
                    if (month === 1) {
                        $('#repeat-year-month-options-list').find('a:contains("January")').click();
                    } else if (month === 2) {
                        $('#repeat-year-month-options-list').find('a:contains("February")').click();
                    } else if (month === 3) {
                        $('#repeat-year-month-options-list').find('a:contains("March")').click();
                    } else if (month === 4) {
                        $('#repeat-year-month-options-list').find('a:contains("April")').click();
                    } else if (month === 5) {
                        $('#repeat-year-month-options-list').find('a:contains("May")').click();
                    } else if (month === 6) {
                        $('#repeat-year-month-options-list').find('a:contains("June")').click();
                    } else if (month === 7) {
                        $('#repeat-year-month-options-list').find('a:contains("July")').click();
                    } else if (month === 8) {
                        $('#repeat-year-month-options-list').find('a:contains("August")').click();
                    } else if (month === 9) {
                        $('#repeat-year-month-options-list').find('a:contains("September")').click();
                    } else if (month === 10) {
                        $('#repeat-year-month-options-list').find('a:contains("October")').click();
                    } else if (month === 11) {
                        $('#repeat-year-month-options-list').find('a:contains("November")').click();
                    } else if (month === 12) {
                        $('#repeat-year-month-options-list').find('a:contains("December")').click();
                    }
                } else {
                    $('#repeat-year-options-list').find('a:contains("Every")').click();
                    var start_dt = new Date(start_date);
                    var month_day = Number(start_dt.toString("dd").replace(/\b0(?=\d)/g, ''));
                    var dayth = month_day + smhCM.nth(month_day);
                    $('#repeat-year-day-list').find('a').filter(function () {
                        return $(this).text() === dayth;
                    }).click();
                    var month = Number(start_dt.toString("MM").replace(/\b0(?=\d)/g, ''));
                    if (month === 1) {
                        $('#repeat-year-month-options-list').find('a:contains("January")').click();
                    } else if (month === 2) {
                        $('#repeat-year-month-options-list').find('a:contains("February")').click();
                    } else if (month === 3) {
                        $('#repeat-year-month-options-list').find('a:contains("March")').click();
                    } else if (month === 4) {
                        $('#repeat-year-month-options-list').find('a:contains("April")').click();
                    } else if (month === 5) {
                        $('#repeat-year-month-options-list').find('a:contains("May")').click();
                    } else if (month === 6) {
                        $('#repeat-year-month-options-list').find('a:contains("June")').click();
                    } else if (month === 7) {
                        $('#repeat-year-month-options-list').find('a:contains("July")').click();
                    } else if (month === 8) {
                        $('#repeat-year-month-options-list').find('a:contains("August")').click();
                    } else if (month === 9) {
                        $('#repeat-year-month-options-list').find('a:contains("September")').click();
                    } else if (month === 10) {
                        $('#repeat-year-month-options-list').find('a:contains("October")').click();
                    } else if (month === 11) {
                        $('#repeat-year-month-options-list').find('a:contains("November")').click();
                    } else if (month === 12) {
                        $('#repeat-year-month-options-list').find('a:contains("December")').click();
                    }
                }
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            }
        }
    },
    editProgram: function (lsid, pcid, channelId, entryId, entryName, thumbId, entryLength, repeat, rec_type, start_date, end_date) {
        smhCM.resetModal();
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Program</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<form id="add-program-form">' +
                '<div class="row">' +
                '<div class="col-sm-10 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">Run On Channel:</span></td><td>' +
                '<div class="dropdown">' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="channel-selected"></span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="channel-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                channel_options +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">Program Source:</span></td><td><div id="program-selected" data-entry="' + entryId + '" data-entry-duration="' + entryLength + '"><img src="http://devplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/thumbnail/entry_id/' + thumbId + '/quality/100/type/1/height/40/width/71" height="40" width="71"><div id="program-title">' + entryName + '</div><span style="display: inline-block;float: right;"><button type="button" class="btn btn-block bg-olive" id="select-program" onclick="smhCM.selectProgram(\'timeline\');" style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;padding: 10px 15px;position: relative;top: 0px;right: 0px;height: 41px;"><i class="fa fa-external-link"></i></button></span></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td valign=top><div style="font-weight: normal;">Program Schedule:</div></td><td><div class="repeat-title">Start Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker1">' +
                '<input type="text" class="form-control" id="test" style="margin: auto; width: 280px; height: 41px;" value="' + start_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div style="margin-top:10px;" class="repeat-title">End Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker2">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + end_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Repeat Program:</span></td><td><input data-toggle="toggle" id="recurrence-status" type="checkbox"></td>' +
                '</tr>' +
                '<tr id="all-repeat-options">' +
                '<td></td><td>' +
                '<div class="repeat-title">Program Length</div>' +
                '<span class="size1"><input id="hours" name="value" value=00><div>hours</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="minutes" name="value" value=00><div>minutes</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="seconds" name="value" value=00><div>seconds</div></span>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-wrapper">' +
                '<div class="repeat-title">Repeat Pattern</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="pattern-selected">Daily</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-pattern-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">Daily</a></li>' +
                '<li><a href="#">Weekly</a></li>' +
                '<li><a href="#">Monthly</a></li>' +
                '<li><a href="#">Yearly</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div id="repeat-options">' +
                '<div class="repeat-title">Repeat Every</div>' +
                '<input type="text" class="form-control" id="repeat-everyday" value="1"/><span id="repeat-everyday-text">day(s)</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-ends-wrapper">' +
                '<div class="repeat-title">Recurrence Ends</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="repeat-ends-selected">No End Date</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-ends-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">No End Date</a></li>' +
                '<li><a href="#">After</a></li>' +
                '<li><a href="#">End by</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="repeat-ends-options">' +
                '</div>' +
                '<div class="clear"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal .modal-body').html(content);

        $('#recurrence-status').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

        if (API) {
            API.destroy();
        }
        API = $('#smh-modal #program-title').dotdotdot({
            height: 32,
            watch: true,
            ellipsis: "\u2026 ",
            truncate: "letter",
            fallbackToLetter: true
        }).data("dotdotdot");


        //var saved_end_date = $('#datetimepicker2 input').val();
        $('#recurrence-status').change(function () {
            if ($(this).prop('checked')) {
                $('#all-repeat-options').css('display', 'table-row');
                $('#datetimepicker2 input').val('');
                $('#datetimepicker2 input').prop('disabled', true);
                $('#seconds').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#minutes').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#minutes').spinner('stepDown');
                            return false;
                        }
                    },
                    value: 300
                });
                $('#minutes').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#hours').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#hours').spinner('stepDown');
                            return false;
                        }
                    }
                });
                $('#hours').spinner({
                    numberFormat: "d2",
                    alignment: 'vertical',
                    min: 0
                });

                $('.ui-spinner a').addClass('ui-state-default');

            } else {
                var entry = $('#program-selected').attr('data-entry');
                if (entry) {
                    var entry_duration = $('#program-selected').attr('data-entry-duration');
                    var start_date = $('#datetimepicker1 input').val();
                    var d = new Date(start_date);
                    d.setSeconds(d.getSeconds() + Number(entry_duration));
                    var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(entry_end_date);
                } else {
                    var start_date_mod = $('#datetimepicker1 input').val();
                    var d = new Date(start_date_mod);
                    d.setSeconds(d.getSeconds() + 1);
                    var end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(end_date);
                }
                $('#all-repeat-options').css('display', 'none');
                $('#datetimepicker2 input').prop('disabled', false);
            }
        });

        $(".modal #channel-list li").each(function () {
            if (channelId === $(this).attr('data-channel-select-id')) {
                $('#channel-selected').html($(this).html());
                $('#channel-selected').attr('data-channel-selected', channelId);
            }
        });

        $('#smh-modal #add-program-form .dropdown').on('click', '.mCSB_scrollTools', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

        $('#smh-modal #channel-list').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $(".channel-select-title").dotdotdot({
            height: 56,
            watch: true,
            ellipsis: "\u2026 ",
            truncate: "letter",
            fallbackToLetter: true
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            ignoreReadonly: true,
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            useCurrent: false,
            ignoreReadonly: true
        });

        $('#datetimepicker1').on('dp.change', function (e) {
            var entry = $('#program-selected').attr('data-entry');
            var repeat = $('#recurrence-status').is(":checked");
            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
            if (entry && !repeat && entry_duration) {
                var new_start_date = $('#datetimepicker1 input').val();
                var d = new Date(new_start_date);
                d.setSeconds(d.getSeconds() + entry_duration);
                var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                $('#datetimepicker2 input').val(entry_end_date);
            }
        });

//        $('#datetimepicker2').on('dp.change', function (e) {
//            var entry = $('#program-selected').attr('data-entry');
//            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
//            if (entry && entry_duration) {
//                var new_end_date = $('#datetimepicker2 input').val();
//                var d = new Date(new_end_date);
//                d.setSeconds(d.getSeconds() - entry_duration);
//                var entry_start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
//                $('#datetimepicker1 input').val(entry_start_date);
//            }
//        });

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-primary" id="delete-program" onclick="smhCM.deleteProgram(' + lsid + ',\'' + entryName + '\',\'' + entryId + '\',\'timeline\')" style="float: left;">Delete</button><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="update-program" onclick="smhCM.updateProgram(' + lsid + ',' + pcid + ',\'' + channelId + '\',\'timeline\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        if (Number(entryLength) !== 0) {
            var duration_hms = smhCM.secondsTimeSpanToHMS(entryLength);
            var duration_parse = duration_hms.split(":");
            var duration_hours = duration_parse[0];
            var duration_mintues = duration_parse[1];
            var duration_seconds = duration_parse[2];
            $('#hours').val(duration_hours);
            $('#minutes').val(duration_mintues);
            $('#seconds').val(duration_seconds);
        }

        if (repeat) {
            $('#recurrence-status').bootstrapToggle('on');
            var rec_type_split = rec_type.split('_');
            var type = rec_type_split[0].charAt(0).toUpperCase() + rec_type_split[0].slice(1).toLowerCase().replace("ay", "ai") + 'ly';
            var count = Number(rec_type_split[1]);
            var day = Number(rec_type_split[2]);
            var count2 = Number(rec_type_split[3]);
            var days_extra = rec_type_split[4].split('#');
            var days = days_extra[0];
            var extra = days_extra[1];

            $('#repeat-pattern-list').find('a:contains("' + type + '")').click();

            if (type === 'Daily') {
                $('#repeat-everyday').val(count);
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            } else if (type === 'Weekly') {
                $('#repeat-everyweek').val(count);
                var days_arr = days.split(',');
                $.each(days_arr, function (index, value) {
                    if (Number(value) === 0) {
                        $('.day-table input[value="0"]').prop('checked', true);
                    } else if (Number(value) === 1) {
                        $('.day-table input[value="1"]').prop('checked', true);
                    } else if (Number(value) === 2) {
                        $('.day-table input[value="2"]').prop('checked', true);
                    } else if (Number(value) === 3) {
                        $('.day-table input[value="3"]').prop('checked', true);
                    } else if (Number(value) === 4) {
                        $('.day-table input[value="4"]').prop('checked', true);
                    } else if (Number(value) === 5) {
                        $('.day-table input[value="5"]').prop('checked', true);
                    } else if (Number(value) === 6) {
                        $('.day-table input[value="6"]').prop('checked', true);
                    }
                });
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            } else if (type === 'Monthly') {
                if (day) {
                    $('#repeat-month-options-list').find('a:contains("On")').click();
                    $('#month-week-day-count').val(count);
                    var weekth = count2 + smhCM.nth(count2);
                    $('#repeat-month-week-list').find('a').filter(function () {
                        return $(this).text() === weekth;
                    }).click();
                    if (day === 0) {
                        $('#repeat-month-week-day-list').find('a:contains("Sunday")').click();
                    } else if (day === 1) {
                        $('#repeat-month-week-day-list').find('a:contains("Monday")').click();
                    } else if (day === 2) {
                        $('#repeat-month-week-day-list').find('a:contains("Tuesday")').click();
                    } else if (day === 3) {
                        $('#repeat-month-week-day-list').find('a:contains("Wednesday")').click();
                    } else if (day === 4) {
                        $('#repeat-month-week-day-list').find('a:contains("Thursday")').click();
                    } else if (day === 5) {
                        $('#repeat-month-week-day-list').find('a:contains("Friday")').click();
                    } else if (day === 6) {
                        $('#repeat-month-week-day-list').find('a:contains("Saturday")').click();
                    }
                } else {
                    $('#repeat-month-options-list').find('a:contains("Repeat")').click();
                    $('#month-count').val(count);
                    var start_dt = new Date(start_date);
                    var month_day = Number(start_dt.toString("dd").replace(/\b0(?=\d)/g, ''));
                    var dayth = month_day + smhCM.nth(month_day);
                    $('#repeat-month-day-list').find('a').filter(function () {
                        return $(this).text() === dayth;
                    }).click();
                }
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            } else if (type === 'Yearly') {
                if (day) {
                    $('#repeat-year-options-list').find('a:contains("On")').click();
                    var weekth = count2 + smhCM.nth(count2);
                    $('#repeat-year-day-month-list').find('a').filter(function () {
                        return $(this).text() === weekth;
                    }).click();
                    if (day === 0) {
                        $('#repeat-year-week-day-list').find('a:contains("Sunday")').click();
                    } else if (day === 1) {
                        $('#repeat-year-week-day-list').find('a:contains("Monday")').click();
                    } else if (day === 2) {
                        $('#repeat-year-week-day-list').find('a:contains("Tuesday")').click();
                    } else if (day === 3) {
                        $('#repeat-year-week-day-list').find('a:contains("Wednesday")').click();
                    } else if (day === 4) {
                        $('#repeat-year-week-day-list').find('a:contains("Thursday")').click();
                    } else if (day === 5) {
                        $('#repeat-year-week-day-list').find('a:contains("Friday")').click();
                    } else if (day === 6) {
                        $('#repeat-year-week-day-list').find('a:contains("Saturday")').click();
                    }
                    var start_dt = new Date(start_date);
                    var month = Number(start_dt.toString("MM").replace(/\b0(?=\d)/g, ''));
                    if (month === 1) {
                        $('#repeat-year-month-options-list').find('a:contains("January")').click();
                    } else if (month === 2) {
                        $('#repeat-year-month-options-list').find('a:contains("February")').click();
                    } else if (month === 3) {
                        $('#repeat-year-month-options-list').find('a:contains("March")').click();
                    } else if (month === 4) {
                        $('#repeat-year-month-options-list').find('a:contains("April")').click();
                    } else if (month === 5) {
                        $('#repeat-year-month-options-list').find('a:contains("May")').click();
                    } else if (month === 6) {
                        $('#repeat-year-month-options-list').find('a:contains("June")').click();
                    } else if (month === 7) {
                        $('#repeat-year-month-options-list').find('a:contains("July")').click();
                    } else if (month === 8) {
                        $('#repeat-year-month-options-list').find('a:contains("August")').click();
                    } else if (month === 9) {
                        $('#repeat-year-month-options-list').find('a:contains("September")').click();
                    } else if (month === 10) {
                        $('#repeat-year-month-options-list').find('a:contains("October")').click();
                    } else if (month === 11) {
                        $('#repeat-year-month-options-list').find('a:contains("November")').click();
                    } else if (month === 12) {
                        $('#repeat-year-month-options-list').find('a:contains("December")').click();
                    }
                } else {
                    $('#repeat-year-options-list').find('a:contains("Every")').click();
                    var start_dt = new Date(start_date);
                    var month_day = Number(start_dt.toString("dd").replace(/\b0(?=\d)/g, ''));
                    var dayth = month_day + smhCM.nth(month_day);
                    $('#repeat-year-day-list').find('a').filter(function () {
                        return $(this).text() === dayth;
                    }).click();
                    var month = Number(start_dt.toString("MM").replace(/\b0(?=\d)/g, ''));
                    if (month === 1) {
                        $('#repeat-year-month-options-list').find('a:contains("January")').click();
                    } else if (month === 2) {
                        $('#repeat-year-month-options-list').find('a:contains("February")').click();
                    } else if (month === 3) {
                        $('#repeat-year-month-options-list').find('a:contains("March")').click();
                    } else if (month === 4) {
                        $('#repeat-year-month-options-list').find('a:contains("April")').click();
                    } else if (month === 5) {
                        $('#repeat-year-month-options-list').find('a:contains("May")').click();
                    } else if (month === 6) {
                        $('#repeat-year-month-options-list').find('a:contains("June")').click();
                    } else if (month === 7) {
                        $('#repeat-year-month-options-list').find('a:contains("July")').click();
                    } else if (month === 8) {
                        $('#repeat-year-month-options-list').find('a:contains("August")').click();
                    } else if (month === 9) {
                        $('#repeat-year-month-options-list').find('a:contains("September")').click();
                    } else if (month === 10) {
                        $('#repeat-year-month-options-list').find('a:contains("October")').click();
                    } else if (month === 11) {
                        $('#repeat-year-month-options-list').find('a:contains("November")').click();
                    } else if (month === 12) {
                        $('#repeat-year-month-options-list').find('a:contains("December")').click();
                    }
                }
                if (extra) {
                    if (extra === 'no') {
                        $('#repeat-ends-list').find('a:contains("No End Date")').click();
                    } else {
                        $('#repeat-ends-list').find('a:contains("After")').click();
                        $('#after-occur').val(extra);
                    }
                } else {
                    $('#repeat-ends-list').find('a:contains("End by")').click();
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() - 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd");
                    $('#datetimepicker3 input').val(end_date);
                }
            }
        }
    },
    nth: function (d) {
        if (d > 3 && d < 21)
            return 'th';
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    },
    buildRecType: function (type, count, day, count2, days, extra) {
        return type + '_' + count + '_' + day + '_' + count2 + '_' + days + '#' + extra;
    },
    saveProgram: function (cid, origin) {
        var modal = (origin === 'channel') ? 2 : '';
        var entry_selected = $('#program-selected').attr('data-entry');
        if (entry_selected) {
            var channel_selected = $('#channel-selected').attr('data-channel-selected');
            var start_date = '';
            var end_date = '';
            var type_selected = '';
            var type = '';
            var count = '';
            var day = '';
            var count2 = '';
            var days = '';
            var rec_type = '';
            var event_length = 0;
            var recurrence_ends = '';
            var extra = '';
            var repeat = ($('#recurrence-status').prop('checked')) ? true : false;
            if (repeat) {
                type_selected = $('#pattern-selected').text().toLowerCase();
                recurrence_ends = $('#repeat-ends-selected').text();
                if (recurrence_ends === 'No End Date') {
                    extra = 'no';
                    end_date = '9999-02-01 00:00:00';
                } else if (recurrence_ends === 'After') {
                    extra = $('#after-occur').val();
                } else if (recurrence_ends === 'End by') {
                    var end_by = $('#datetimepicker3 input').val();
                    end_date = end_by + ' 00:00:00';
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() + 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                }
                if (type_selected === 'daily') {
                    type = 'day';
                    start_date = $('#datetimepicker1 input').val();
                    count = $('#repeat-everyday').val();
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);

                    if (extra && (extra !== 'no')) {
                        var additional_days = Number(count) * Number(extra);
                        var date = new Date(start_date);
                        var new_date = date.setDate(date.getDate() + Number(additional_days));
                        var d = new Date(new_date);
                        end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }

                } else if (type_selected === 'weekly') {
                    type = 'week';
                    var start_date_input = $('#datetimepicker1 input').val();
                    count = $('#repeat-everyweek').val();
                    var days_arr = new Array();
                    $('#smh-modal .day-table input[type="checkbox"]').each(function () {
                        if ($(this).is(":checked")) {
                            var checkbox_value = $(this).val();
                            days_arr.push(Number(checkbox_value));
                        }
                    });
                    days_arr = days_arr.sort();
                    if (days_arr.length === 0) {
                        days_arr.push(0);
                    }
                    var sort_days = days_arr.sort();
                    days = sort_days.join(',');
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);

                    var check_date = new Date(start_date_input);
                    if ($.inArray(check_date.getDay(), sort_days) !== -1) {
                        start_date = start_date_input;
                    } else {
                        var firstOccurr = smhCM.getWeeklyStartDate(sort_days, start_date_input);
                        var start_date_mod = new Date(firstOccurr);
                        var month_day = start_date_mod.getDate();
                        var month = ("0" + (start_date_mod.getMonth() + 1)).slice(-2);
                        var year = start_date_mod.getFullYear();

                        var hour = smhCM.addZero(start_date_mod.getHours());
                        var minute = smhCM.addZero(start_date_mod.getMinutes());
                        var second = smhCM.addZero(start_date_mod.getSeconds());
                        var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                        var d = new Date(new_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }

                    if (extra && (extra !== 'no')) {
                        var find_week_end_date = smhCM.getWeeklyEndDate(sort_days, Number(count), Number(extra), start_date);
                        var d = new Date(find_week_end_date);
                        end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }
                } else if (type_selected === 'monthly') {
                    type = 'month';
                    var month_options_selected = $('#repeat-month-options-selected').text();
                    if (month_options_selected === 'Repeat') {
                        var day_selected = $('#repeat-month-day-selected').text();
                        var month_day = day_selected.slice(0, -2);
                        count = $('#month-count').val();
                        start_date = $('#datetimepicker1 input').val();

                        if (month_day.length === 1) {
                            month_day = '0' + month_day;
                        }

                        var date = new Date(start_date);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        var hour = smhCM.addZero(date.getHours());
                        var minute = smhCM.addZero(date.getMinutes());
                        var second = smhCM.addZero(date.getSeconds());
                        var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                        var d = new Date(new_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        if (extra && (extra !== 'no')) {
                            var additional_months = Number(count) * Number(extra);
                            var date = new Date(start_date);
                            var new_date = date.addMonths(Number(additional_months));
                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    } else if (month_options_selected === 'On') {
                        count = $('#month-week-day-count').val();
                        start_date = $('#datetimepicker1 input').val();
                        var month_week_selected = $('#repeat-month-week-selected').text();
                        count2 = month_week_selected.slice(0, -2);
                        var month_week_day_selected = $('#repeat-month-week-day-selected').text();
                        if (month_week_day_selected === 'Monday') {
                            day = 1;
                        } else if (month_week_day_selected === 'Tuesday') {
                            day = 2;
                        } else if (month_week_day_selected === 'Wednesday') {
                            day = 3;
                        } else if (month_week_day_selected === 'Thursday') {
                            day = 4;
                        } else if (month_week_day_selected === 'Friday') {
                            day = 5;
                        } else if (month_week_day_selected === 'Saturday') {
                            day = 6;
                        } else if (month_week_day_selected === 'Sunday') {
                            day = 0;
                        }

                        var new_start_date = smhCM.getMonthlyStartDate(Number(count2), day, start_date);
                        var d = new Date(new_start_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");

                        if (extra && (extra !== 'no')) {
                            var additional_months = Number(count) * Number(extra);
                            var old_start_date = $('#datetimepicker1 input').val();
                            var date = new Date(old_start_date);
                            var new_date = date.addMonths(Number(additional_months));
                            var d = new Date(new_date);
                            var new_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            var nth_end_date = smhCM.nthWeekdayOfMonth(day, count2, new_end_date)

                            var end_date_mod = new Date(nth_end_date);
                            var month_day = end_date_mod.getDate();
                            var month = ("0" + (end_date_mod.getMonth() + 1)).slice(-2);
                            var year = end_date_mod.getFullYear();

                            var start_date_mod = new Date(old_start_date);
                            var hour = smhCM.addZero(start_date_mod.getHours());
                            var minute = smhCM.addZero(start_date_mod.getMinutes());
                            var second = smhCM.addZero(start_date_mod.getSeconds());
                            var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                            var d = new Date(new_date);
                            //var pre_end_date = d.addDays(1);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    }
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);
                } else if (type_selected === 'yearly') {
                    type = 'year';
                    var year_options_selected = $('#repeat-year-options-selected').text();
                    if (year_options_selected === 'Every') {
                        count = 1;
                        start_date = $('#datetimepicker1 input').val();
                        var day_selected = $('#repeat-year-day-selected').text();
                        var month_day = day_selected.slice(0, -2);
                        if (month_day.length === 1) {
                            month_day = '0' + month_day;
                        }

                        var year_month_selected = $('#repeat-year-month-options-selected').text();
                        var month = '';
                        if (year_month_selected === 'January') {
                            month = 1;
                        } else if (year_month_selected === 'February') {
                            month = 2;
                        } else if (year_month_selected === 'March') {
                            month = 3;
                        } else if (year_month_selected === 'April') {
                            month = 4;
                        } else if (year_month_selected === 'May') {
                            month = 5;
                        } else if (year_month_selected === 'June') {
                            month = 6;
                        } else if (year_month_selected === 'July') {
                            month = 7;
                        } else if (year_month_selected === 'August') {
                            month = 8;
                        } else if (year_month_selected === 'September') {
                            month = 9;
                        } else if (year_month_selected === 'October') {
                            month = 10;
                        } else if (year_month_selected === 'November') {
                            month = 11;
                        } else if (year_month_selected === 'December') {
                            month = 12;
                        }

                        if (month.length === 1) {
                            month = '0' + month;
                        }

                        var date = new Date(start_date);
                        var year = date.getFullYear();
                        var hour = smhCM.addZero(date.getHours());
                        var minute = smhCM.addZero(date.getMinutes());
                        var second = smhCM.addZero(date.getSeconds());
                        var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                        var d = new Date(new_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");

                        if (extra && (extra !== 'no')) {
                            var date = new Date(start_date);
                            var new_date = date.addYears(Number(extra));
                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    } else if (year_options_selected === 'On') {
                        count = 1;
                        start_date = $('#datetimepicker1 input').val();
                        var month_week_selected = $('#repeat-year-day-month-selected').text();
                        count2 = month_week_selected.slice(0, -2);

                        var month_week_day_selected = $('#repeat-year-week-day-selected').text();
                        if (month_week_day_selected === 'Monday') {
                            day = 1;
                        } else if (month_week_day_selected === 'Tuesday') {
                            day = 2;
                        } else if (month_week_day_selected === 'Wednesday') {
                            day = 3;
                        } else if (month_week_day_selected === 'Thursday') {
                            day = 4;
                        } else if (month_week_day_selected === 'Friday') {
                            day = 5;
                        } else if (month_week_day_selected === 'Saturday') {
                            day = 6;
                        } else if (month_week_day_selected === 'Sunday') {
                            day = 0;
                        }

                        var year_month_selected = $('#repeat-year-month-options-selected').text();
                        var month = '';
                        if (year_month_selected === 'January') {
                            month = 1;
                        } else if (year_month_selected === 'February') {
                            month = 2;
                        } else if (year_month_selected === 'March') {
                            month = 3;
                        } else if (year_month_selected === 'April') {
                            month = 4;
                        } else if (year_month_selected === 'May') {
                            month = 5;
                        } else if (year_month_selected === 'June') {
                            month = 6;
                        } else if (year_month_selected === 'July') {
                            month = 7;
                        } else if (year_month_selected === 'August') {
                            month = 8;
                        } else if (year_month_selected === 'September') {
                            month = 9;
                        } else if (year_month_selected === 'October') {
                            month = 10;
                        } else if (year_month_selected === 'November') {
                            month = 11;
                        } else if (year_month_selected === 'December') {
                            month = 12;
                        }

                        var new_month = '';
                        if (month.length === 1) {
                            new_month = '0' + month;
                        } else {
                            new_month = month;
                        }

                        var date = new Date(start_date);
                        var year = date.getFullYear();
                        var hour = smhCM.addZero(date.getHours());
                        var minute = smhCM.addZero(date.getMinutes());
                        var second = smhCM.addZero(date.getSeconds());
                        var new_date = year + '-' + new_month + '-01 ' + hour + ':' + minute + ':' + second;
                        var nth_start_date = smhCM.nthWeekdayOfMonth(day, count2, new_date);
                        var start_date_mod = nth_start_date.toString("yyyy-MM-dd " + hour + ":" + minute + ":" + second);
                        var date_mod = new Date(start_date_mod);
                        start_date = date_mod.toString("yyyy-MM-dd hh:mm:ss tt");

                        if (extra && (extra !== 'no')) {
                            var additional_years = Number(count) * Number(extra);
                            var date = new Date(start_date);
                            var new_date = date.addYears(Number(additional_years));
                            var d = new Date(new_date);
                            var new_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            var nth_end_date = smhCM.nthWeekdayOfMonth(day, count2, new_end_date);

                            var end_date_mod = new Date(nth_end_date);
                            var month_day = end_date_mod.getDate();
                            var month = ("0" + (end_date_mod.getMonth() + 1)).slice(-2);
                            var year = end_date_mod.getFullYear();

                            var start_date_mod = new Date(start_date);
                            var hour = smhCM.addZero(start_date_mod.getHours());
                            var minute = smhCM.addZero(start_date_mod.getMinutes());
                            var second = smhCM.addZero(start_date_mod.getSeconds());
                            var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    }
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);
                }

                var hours = $('#hours').val();
                var minutes = $('#minutes').val();
                var seconds = $('#seconds').val();
                var duration = hours + ':' + minutes + ':' + seconds;
                event_length = smhCM.hmsToSeconds(duration);

            } else {
                start_date = $('#datetimepicker1 input').val();
                end_date = $('#datetimepicker2 input').val();
                var diff = Date.parse(end_date) - Date.parse(start_date);
                event_length = diff / 1000;
            }

            if (Number(event_length) >= 0) {
                var sessData = {
                    pid: sessInfo.pid,
                    ks: sessInfo.ks,
                    action: 'add_program',
                    cid: channel_selected,
                    eid: entry_selected,
                    start_date: start_date,
                    end_date: end_date,
                    repeat: repeat,
                    rec_type: rec_type,
                    event_length: event_length
                }

                console.log(sessData);

                $.ajax({
                    cache: false,
                    url: ApiUrl,
                    type: 'POST',
                    data: sessData,
                    dataType: 'json',
                    beforeSend: function () {
                        $('#add-program').attr('disabled', '');
                        $('#smh-modal' + modal + ' #loading img').css('display', 'inline-block');
                    },
                    success: function (data) {
                        if (data['success']) {
                            if (modal === 2) {
                                smhCM.getChannelEntries(cid);
                            }
                            smhCM.refresh_schedule();
                            $('#smh-modal' + modal + ' #loading img').css('display', 'none');
                            $('#smh-modal' + modal + ' #pass-result').html('<span class="label label-success">Program Successfully Created!</span>');
                            setTimeout(function () {
                                $('#smh-modal' + modal + ' #pass-result').empty();
                                $('#add-program').removeAttr('disabled');
                                if (modal === 2) {
                                    $('#smh-modal2').modal('hide');
                                    $('#smh-modal').css('z-index', '');
                                    $('#smh-modal2').on('hidden.bs.modal', function (e) {
                                        $('body').addClass('modal-open');
                                    });
                                } else {
                                    $('#smh-modal').modal('hide');
                                    $('#smh-modal').on('hidden.bs.modal', function (e) {
                                        $('body').addClass('modal-open');
                                    });
                                }
                            }, 3000);
                        } else {
                            if (data['collision']) {
                                smhCM.conflictFound(modal);
                                $('#smh-modal' + modal + ' #loading img').css('display', 'none');
                                setTimeout(function () {
                                    $('#smh-modal' + modal + ' #pass-result').empty();
                                    $('#add-program').removeAttr('disabled');
                                }, 3000);
                            } else {
                                $('#smh-modal' + modal + ' #loading img').css('display', 'none');
                                $('#smh-modal' + modal + ' #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                            }
                        }
                    }
                });
            } else {
                smhCM.programZero(modal);
            }
        } else {
            smhCM.noEntrySelected(modal);
        }
    },
    updateProgram: function (lsid, pcid, cid, origin) {
        var modal = (origin === 'channel') ? 2 : '';
        var entry_selected = $('#program-selected').attr('data-entry');
        if (entry_selected) {
            var channel_selected = $('#channel-selected').attr('data-channel-selected');
            var start_date = '';
            var end_date = '';
            var type_selected = '';
            var type = '';
            var count = '';
            var day = '';
            var count2 = '';
            var days = '';
            var rec_type = '';
            var event_length = 0;
            var recurrence_ends = '';
            var extra = '';
            var repeat = ($('#recurrence-status').prop('checked')) ? true : false;
            if (repeat) {
                type_selected = $('#pattern-selected').text().toLowerCase();
                recurrence_ends = $('#repeat-ends-selected').text();
                if (recurrence_ends === 'No End Date') {
                    extra = 'no';
                    end_date = '9999-02-01 00:00:00';
                } else if (recurrence_ends === 'After') {
                    extra = $('#after-occur').val();
                } else if (recurrence_ends === 'End by') {
                    var end_by = $('#datetimepicker3 input').val();
                    end_date = end_by + ' 00:00:00';
                    var date = new Date(end_date);
                    var new_date = date.setDate(date.getDate() + 1);
                    var d = new Date(new_date);
                    end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                }
                if (type_selected === 'daily') {
                    type = 'day';
                    start_date = $('#datetimepicker1 input').val();
                    count = $('#repeat-everyday').val();
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);

                    if (extra && (extra !== 'no')) {
                        var additional_days = Number(count) * Number(extra);
                        var date = new Date(start_date);
                        var new_date = date.setDate(date.getDate() + Number(additional_days));
                        var d = new Date(new_date);
                        end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }

                } else if (type_selected === 'weekly') {
                    type = 'week';
                    var start_date_input = $('#datetimepicker1 input').val();
                    count = $('#repeat-everyweek').val();
                    var days_arr = new Array();
                    $('#smh-modal .day-table input[type="checkbox"]').each(function () {
                        if ($(this).is(":checked")) {
                            var checkbox_value = $(this).val();
                            days_arr.push(Number(checkbox_value));
                        }
                    });
                    days_arr = days_arr.sort();
                    if (days_arr.length === 0) {
                        days_arr.push(0);
                    }
                    var sort_days = days_arr.sort();
                    days = sort_days.join(',');
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);

                    var check_date = new Date(start_date_input);
                    if ($.inArray(check_date.getDay(), sort_days) !== -1) {
                        start_date = start_date_input;
                    } else {
                        var firstOccurr = smhCM.getWeeklyStartDate(sort_days, start_date_input);
                        var start_date_mod = new Date(firstOccurr);
                        var month_day = start_date_mod.getDate();
                        var month = ("0" + (start_date_mod.getMonth() + 1)).slice(-2);
                        var year = start_date_mod.getFullYear();

                        var hour = smhCM.addZero(start_date_mod.getHours());
                        var minute = smhCM.addZero(start_date_mod.getMinutes());
                        var second = smhCM.addZero(start_date_mod.getSeconds());
                        var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                        var d = new Date(new_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }

                    if (extra && (extra !== 'no')) {
                        var find_week_end_date = smhCM.getWeeklyEndDate(sort_days, Number(count), Number(extra), start_date);
                        var d = new Date(find_week_end_date);
                        end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    }
                } else if (type_selected === 'monthly') {
                    type = 'month';
                    var month_options_selected = $('#repeat-month-options-selected').text();
                    if (month_options_selected === 'Repeat') {
                        var day_selected = $('#repeat-month-day-selected').text();
                        var month_day = day_selected.slice(0, -2);
                        count = $('#month-count').val();
                        start_date = $('#datetimepicker1 input').val();

                        if (month_day.length === 1) {
                            month_day = '0' + month_day;
                        }

                        var date = new Date(start_date);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        var hour = smhCM.addZero(date.getHours());
                        var minute = smhCM.addZero(date.getMinutes());
                        var second = smhCM.addZero(date.getSeconds());
                        var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                        var d = new Date(new_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        if (extra && (extra !== 'no')) {
                            var additional_months = Number(count) * Number(extra);
                            var date = new Date(start_date);
                            var new_date = date.addMonths(Number(additional_months));
                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    } else if (month_options_selected === 'On') {
                        count = $('#month-week-day-count').val();
                        start_date = $('#datetimepicker1 input').val();
                        var month_week_selected = $('#repeat-month-week-selected').text();
                        count2 = month_week_selected.slice(0, -2);
                        var month_week_day_selected = $('#repeat-month-week-day-selected').text();
                        if (month_week_day_selected === 'Monday') {
                            day = 1;
                        } else if (month_week_day_selected === 'Tuesday') {
                            day = 2;
                        } else if (month_week_day_selected === 'Wednesday') {
                            day = 3;
                        } else if (month_week_day_selected === 'Thursday') {
                            day = 4;
                        } else if (month_week_day_selected === 'Friday') {
                            day = 5;
                        } else if (month_week_day_selected === 'Saturday') {
                            day = 6;
                        } else if (month_week_day_selected === 'Sunday') {
                            day = 0;
                        }

                        var new_start_date = smhCM.getMonthlyStartDate(Number(count2), day, start_date);
                        var d = new Date(new_start_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");

                        if (extra && (extra !== 'no')) {
                            var additional_months = Number(count) * Number(extra);
                            var old_start_date = $('#datetimepicker1 input').val();
                            var date = new Date(old_start_date);
                            var new_date = date.addMonths(Number(additional_months));
                            var d = new Date(new_date);
                            var new_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            var nth_end_date = smhCM.nthWeekdayOfMonth(day, count2, new_end_date)

                            var end_date_mod = new Date(nth_end_date);
                            var month_day = end_date_mod.getDate();
                            var month = ("0" + (end_date_mod.getMonth() + 1)).slice(-2);
                            var year = end_date_mod.getFullYear();

                            var start_date_mod = new Date(old_start_date);
                            var hour = smhCM.addZero(start_date_mod.getHours());
                            var minute = smhCM.addZero(start_date_mod.getMinutes());
                            var second = smhCM.addZero(start_date_mod.getSeconds());
                            var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                            var d = new Date(new_date);
                            //var pre_end_date = d.addDays(1);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    }
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);
                } else if (type_selected === 'yearly') {
                    type = 'year';
                    var year_options_selected = $('#repeat-year-options-selected').text();
                    if (year_options_selected === 'Every') {
                        count = 1;
                        start_date = $('#datetimepicker1 input').val();
                        var day_selected = $('#repeat-year-day-selected').text();
                        var month_day = day_selected.slice(0, -2);
                        if (month_day.length === 1) {
                            month_day = '0' + month_day;
                        }

                        var year_month_selected = $('#repeat-year-month-options-selected').text();
                        var month = '';
                        if (year_month_selected === 'January') {
                            month = 1;
                        } else if (year_month_selected === 'February') {
                            month = 2;
                        } else if (year_month_selected === 'March') {
                            month = 3;
                        } else if (year_month_selected === 'April') {
                            month = 4;
                        } else if (year_month_selected === 'May') {
                            month = 5;
                        } else if (year_month_selected === 'June') {
                            month = 6;
                        } else if (year_month_selected === 'July') {
                            month = 7;
                        } else if (year_month_selected === 'August') {
                            month = 8;
                        } else if (year_month_selected === 'September') {
                            month = 9;
                        } else if (year_month_selected === 'October') {
                            month = 10;
                        } else if (year_month_selected === 'November') {
                            month = 11;
                        } else if (year_month_selected === 'December') {
                            month = 12;
                        }

                        if (month.length === 1) {
                            month = '0' + month;
                        }

                        var date = new Date(start_date);
                        var year = date.getFullYear();
                        var hour = smhCM.addZero(date.getHours());
                        var minute = smhCM.addZero(date.getMinutes());
                        var second = smhCM.addZero(date.getSeconds());
                        var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                        var d = new Date(new_date);
                        start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");

                        if (extra && (extra !== 'no')) {
                            var date = new Date(start_date);
                            var new_date = date.addYears(Number(extra));
                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    } else if (year_options_selected === 'On') {
                        count = 1;
                        start_date = $('#datetimepicker1 input').val();
                        var month_week_selected = $('#repeat-year-day-month-selected').text();
                        count2 = month_week_selected.slice(0, -2);

                        var month_week_day_selected = $('#repeat-year-week-day-selected').text();
                        if (month_week_day_selected === 'Monday') {
                            day = 1;
                        } else if (month_week_day_selected === 'Tuesday') {
                            day = 2;
                        } else if (month_week_day_selected === 'Wednesday') {
                            day = 3;
                        } else if (month_week_day_selected === 'Thursday') {
                            day = 4;
                        } else if (month_week_day_selected === 'Friday') {
                            day = 5;
                        } else if (month_week_day_selected === 'Saturday') {
                            day = 6;
                        } else if (month_week_day_selected === 'Sunday') {
                            day = 0;
                        }

                        var year_month_selected = $('#repeat-year-month-options-selected').text();
                        var month = '';
                        if (year_month_selected === 'January') {
                            month = 1;
                        } else if (year_month_selected === 'February') {
                            month = 2;
                        } else if (year_month_selected === 'March') {
                            month = 3;
                        } else if (year_month_selected === 'April') {
                            month = 4;
                        } else if (year_month_selected === 'May') {
                            month = 5;
                        } else if (year_month_selected === 'June') {
                            month = 6;
                        } else if (year_month_selected === 'July') {
                            month = 7;
                        } else if (year_month_selected === 'August') {
                            month = 8;
                        } else if (year_month_selected === 'September') {
                            month = 9;
                        } else if (year_month_selected === 'October') {
                            month = 10;
                        } else if (year_month_selected === 'November') {
                            month = 11;
                        } else if (year_month_selected === 'December') {
                            month = 12;
                        }

                        var new_month = '';
                        if (month.length === 1) {
                            new_month = '0' + month;
                        } else {
                            new_month = month;
                        }

                        var date = new Date(start_date);
                        var year = date.getFullYear();
                        var hour = smhCM.addZero(date.getHours());
                        var minute = smhCM.addZero(date.getMinutes());
                        var second = smhCM.addZero(date.getSeconds());
                        var new_date = year + '-' + new_month + '-01 ' + hour + ':' + minute + ':' + second;
                        var nth_start_date = smhCM.nthWeekdayOfMonth(day, count2, new_date);
                        var start_date_mod = nth_start_date.toString("yyyy-MM-dd " + hour + ":" + minute + ":" + second);
                        var date_mod = new Date(start_date_mod);
                        start_date = date_mod.toString("yyyy-MM-dd hh:mm:ss tt");

                        if (extra && (extra !== 'no')) {
                            var additional_years = Number(count) * Number(extra);
                            var date = new Date(start_date);
                            var new_date = date.addYears(Number(additional_years));
                            var d = new Date(new_date);
                            var new_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                            var nth_end_date = smhCM.nthWeekdayOfMonth(day, count2, new_end_date);

                            var end_date_mod = new Date(nth_end_date);
                            var month_day = end_date_mod.getDate();
                            var month = ("0" + (end_date_mod.getMonth() + 1)).slice(-2);
                            var year = end_date_mod.getFullYear();

                            var start_date_mod = new Date(start_date);
                            var hour = smhCM.addZero(start_date_mod.getHours());
                            var minute = smhCM.addZero(start_date_mod.getMinutes());
                            var second = smhCM.addZero(start_date_mod.getSeconds());
                            var new_date = year + '-' + month + '-' + month_day + ' ' + hour + ':' + minute + ':' + second;

                            var d = new Date(new_date);
                            end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                        }
                    }
                    rec_type = smhCM.buildRecType(type, count, day, count2, days, extra);
                }

                var hours = $('#hours').val();
                var minutes = $('#minutes').val();
                var seconds = $('#seconds').val();
                var duration = hours + ':' + minutes + ':' + seconds;
                event_length = smhCM.hmsToSeconds(duration);

            } else {
                start_date = $('#datetimepicker1 input').val();
                end_date = $('#datetimepicker2 input').val();
                var diff = Date.parse(end_date) - Date.parse(start_date);
                event_length = diff / 1000;
            }

            if (Number(event_length) >= 0) {
                var sessData = {
                    pid: sessInfo.pid,
                    ks: sessInfo.ks,
                    action: 'update_program',
                    lsid: lsid,
                    pcid: pcid,
                    cid: channel_selected,
                    eid: entry_selected,
                    start_date: start_date,
                    end_date: end_date,
                    repeat: repeat,
                    rec_type: rec_type,
                    event_length: event_length
                }

                console.log(sessData);

                $.ajax({
                    cache: false,
                    url: ApiUrl,
                    type: 'POST',
                    data: sessData,
                    dataType: 'json',
                    beforeSend: function () {
                        $('#update-program').attr('disabled', '');
                        $('#smh-modal' + modal + ' #loading img').css('display', 'inline-block');
                    },
                    success: function (data) {
                        if (data['success']) {
                            if (modal === 2) {
                                smhCM.getChannelEntries(cid);
                            }
                            smhCM.refresh_schedule();
                            $('#smh-modal' + modal + ' #loading img').css('display', 'none');
                            $('#smh-modal' + modal + ' #pass-result').html('<span class="label label-success">Program Successfully Updated!</span>');
                            setTimeout(function () {
                                $('#smh-modal' + modal + ' #pass-result').empty();
                                $('#update-program').removeAttr('disabled');
                                $(".smh-close" + modal).click();
                            }, 3000);
                        } else {
                            if (data['collision']) {
                                smhCM.conflictFound(modal);
                                $('#smh-modal' + modal + ' #loading img').css('display', 'none');
                                setTimeout(function () {
                                    $('#smh-modal' + modal + ' #pass-result').empty();
                                    $('#update-program').removeAttr('disabled');
                                }, 3000);
                            } else {
                                $('#smh-modal' + modal + ' #loading img').css('display', 'none');
                                $('#smh-modal' + modal + ' #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                            }
                        }
                    }
                });
            } else {
                smhCM.programZero(modal);
            }
        } else {
            smhCM.noEntrySelected(modal);
        }
    },
    nthWeekdayOfMonth: function (weekday, n, date) {
        var d = new Date(date);
        var count = 0, idate = new Date(d.getFullYear(), d.getMonth(), 1);
        while (true) {
            if (idate.getDay() === weekday) {
                if (++count == n) {
                    break;
                }
            }
            idate.setDate(idate.getDate() + 1);
        }
        return idate;
    },
    firstOccurrOfWeekDay: function (weekday, date) {
        var idate = new Date(date);
        while (true) {
            if (idate.getDay() === weekday) {
                break;
            }
            idate.setDate(idate.getDate() + 1);
        }
        return idate;
    },
    getMonthlyStartDate: function (week_count, day, date) {
        var idate = new Date(date), temp = new Date(date), start_date = '';

        if (week_count === 1) {
            if (day === 0) {
                idate.first().sunday();
            } else if (day === 1) {
                idate.first().monday();
            } else if (day === 2) {
                idate.first().tuesday();
            } else if (day === 3) {
                idate.first().wednesday();
            } else if (day === 4) {
                idate.first().thursday();
            } else if (day === 5) {
                idate.first().friday();
            } else if (day === 6) {
                idate.first().saturday();
            }
        } else if (week_count === 2) {
            if (day === 0) {
                idate.second().sunday();
            } else if (day === 1) {
                idate.second().monday();
            } else if (day === 2) {
                idate.second().tuesday();
            } else if (day === 3) {
                idate.second().wednesday();
            } else if (day === 4) {
                idate.second().thursday();
            } else if (day === 5) {
                idate.second().friday();
            } else if (day === 6) {
                idate.second().saturday();
            }
        } else if (week_count === 3) {
            if (day === 0) {
                idate.third().sunday();
            } else if (day === 1) {
                idate.third().monday();
            } else if (day === 2) {
                idate.third().tuesday();
            } else if (day === 3) {
                idate.third().wednesday();
            } else if (day === 4) {
                idate.third().thursday();
            } else if (day === 5) {
                idate.third().friday();
            } else if (day === 6) {
                idate.third().saturday();
            }
        } else if (week_count === 4) {
            if (day === 0) {
                idate.fourth().sunday();
            } else if (day === 1) {
                idate.fourth().monday();
            } else if (day === 2) {
                idate.fourth().tuesday();
            } else if (day === 3) {
                idate.fourth().wednesday();
            } else if (day === 4) {
                idate.fourth().thursday();
            } else if (day === 5) {
                idate.fourth().friday();
            } else if (day === 6) {
                idate.fourth().saturday();
            }
        }

        if (idate.getDate() < temp.getDate()) {
            idate.setMonth(idate.getMonth() + 1);
            if (week_count === 1) {
                if (day === 0) {
                    idate.first().sunday();
                } else if (day === 1) {
                    idate.first().monday();
                } else if (day === 2) {
                    idate.first().tuesday();
                } else if (day === 3) {
                    idate.first().wednesday();
                } else if (day === 4) {
                    idate.first().thursday();
                } else if (day === 5) {
                    idate.first().friday();
                } else if (day === 6) {
                    idate.first().saturday();
                }
            } else if (week_count === 2) {
                if (day === 0) {
                    idate.second().sunday();
                } else if (day === 1) {
                    idate.second().monday();
                } else if (day === 2) {
                    idate.second().tuesday();
                } else if (day === 3) {
                    idate.second().wednesday();
                } else if (day === 4) {
                    idate.second().thursday();
                } else if (day === 5) {
                    idate.second().friday();
                } else if (day === 6) {
                    idate.second().saturday();
                }
            } else if (week_count === 3) {
                if (day === 0) {
                    idate.third().sunday();
                } else if (day === 1) {
                    idate.third().monday();
                } else if (day === 2) {
                    idate.third().tuesday();
                } else if (day === 3) {
                    idate.third().wednesday();
                } else if (day === 4) {
                    idate.third().thursday();
                } else if (day === 5) {
                    idate.third().friday();
                } else if (day === 6) {
                    idate.third().saturday();
                }
            } else if (week_count === 4) {
                if (day === 0) {
                    idate.fourth().sunday();
                } else if (day === 1) {
                    idate.fourth().monday();
                } else if (day === 2) {
                    idate.fourth().tuesday();
                } else if (day === 3) {
                    idate.fourth().wednesday();
                } else if (day === 4) {
                    idate.fourth().thursday();
                } else if (day === 5) {
                    idate.fourth().friday();
                } else if (day === 6) {
                    idate.fourth().saturday();
                }
            }
            start_date = idate;
        } else if (idate.getDate() > temp.getDate()) {
            start_date = idate;
        } else if (idate.getDate() === temp.getDate()) {
            start_date = temp;
        }
        return start_date;
    },
    getWeeklyStartDate: function (days, date) {
        var idate = new Date(date), start_date = '';
        while (true) {
            if ($.inArray(idate.getDay(), days) !== -1) {
                start_date = smhCM.firstOccurrOfWeekDay(idate.getDay(), idate);
                break;
            }
            idate.setDate(idate.getDate() + 1);
        }
        return start_date;
    },
    getWeeklyEndDate: function (days, interval, n, date) {
        var idate = new Date(date), end_date = '';
        var rule_days = Array();
        $.each(days, function (index, value) {
            if (value === 0) {
                rule_days.push(RRule.SU);
            } else if (value === 1) {
                rule_days.push(RRule.MO);
            } else if (value === 2) {
                rule_days.push(RRule.TU);
            } else if (value === 3) {
                rule_days.push(RRule.WE);
            } else if (value === 4) {
                rule_days.push(RRule.TH);
            } else if (value === 5) {
                rule_days.push(RRule.FR);
            } else if (value === 6) {
                rule_days.push(RRule.SA);
            }
        });
        var rule = new RRule({
            freq: RRule.WEEKLY,
            interval: interval,
            byweekday: rule_days,
            dtstart: idate,
            count: n
        });
        var occurrences = rule.all();
        var last_date = occurrences.slice(-1)[0];
        end_date = last_date.addDays(1);
        return end_date;
    },
    addZero: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    programZero: function (modal) {
        var header, content, footer, top_modal;
        top_modal = (modal === 2) ? 3 : 2;
        $('.smh-dialog' + top_modal).css('width', '315px');
        $('#smh-modal' + top_modal + ' .modal-body').css('padding', '0');
        $('#smh-modal' + top_modal).modal({
            backdrop: 'static'
        });

        if (top_modal === 3) {
            $('#smh-modal' + top_modal).css('z-index', '3000');
            $('#smh-modal' + modal).css('z-index', '2000');
        } else {
            $('#smh-modal' + top_modal).css('z-index', '2000');
            $('#smh-modal' + modal).css('z-index', '1000');
        }

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Program Length Error</h4>';
        $('#smh-modal' + top_modal + ' .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">Your program length must be greater than zero</div>';

        $('#smh-modal' + top_modal + ' .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal' + top_modal + ' .modal-footer').html(footer);
    },
    //No Entry selected modal
    noEntrySelected: function (modal) {
        var header, content, footer, top_modal;
        top_modal = (modal === 2) ? 3 : 2;
        $('.smh-dialog' + top_modal).css('width', '315px');
        $('#smh-modal' + top_modal + ' .modal-body').css('padding', '0');
        $('#smh-modal' + top_modal).modal({
            backdrop: 'static'
        });

        if (top_modal === 3) {
            $('#smh-modal' + top_modal).css('z-index', '3000');
            $('#smh-modal' + modal).css('z-index', '2000');
        } else {
            $('#smh-modal' + top_modal).css('z-index', '2000');
            $('#smh-modal' + modal).css('z-index', '1000');
        }

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Program Source Selected</h4>';
        $('#smh-modal' + top_modal + ' .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a program source</div>';

        $('#smh-modal' + top_modal + ' .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal' + top_modal + ' .modal-footer').html(footer);
    },
    conflictFound: function (modal) {
        var header, content, footer, top_modal;
        top_modal = (modal === 2) ? 3 : 2;
        $('.smh-dialog' + top_modal).css('width', '510px');
        $('#smh-modal' + top_modal + ' .modal-body').css('padding', '0');
        $('#smh-modal' + top_modal).modal({
            backdrop: 'static'
        });

        if (top_modal === 3) {
            $('#smh-modal' + top_modal).css('z-index', '3000');
            $('#smh-modal' + modal).css('z-index', '2000');
        } else {
            $('#smh-modal' + top_modal).css('z-index', '2000');
            $('#smh-modal' + modal).css('z-index', '1000');
        }

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Program conflict found</h4>';
        $('#smh-modal' + top_modal + ' .modal-header').html(header);

        content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">A program conflict was found. Please schedule a different date/time.</div>';

        $('#smh-modal' + top_modal + ' .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal' + top_modal + '  .modal-footer').html(footer);
    },
    selectProgram: function (origin) {
        smhCM.resetFilters();
        var header, content, footer, modal, previous_modal;
        modal = (origin === 'timeline') ? 2 : 3;
        previous_modal = (modal === 2) ? '' : 2;

        $('#smh-modal' + modal).css('z-index', '2000');
        $('#smh-modal' + modal + ' .modal-body').css('padding', '0');
        $('#smh-modal' + previous_modal).css('z-index', '1000');
        $('#smh-modal' + modal + ' .smh-dialog' + modal).css('width', '880px');
        $('#smh-modal' + modal + ' .modal-body').css('height', '565px');
        $('#smh-modal' + modal).modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close' + modal + '" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select a program source</h4>';
        $('#smh-modal' + modal + ' .modal-header').html(header);

        var tree = smhCM.json_tree(categories, 'cat');
        var tree_ac = smhCM.json_tree(ac, 'ac');
        var tree_flavors = smhCM.json_tree(flavors, 'flavors');

        content = '<div class="channel-tab tabbable">' +
                '<ul class="nav nav-pills nav-stacked player-menu">' +
                '<li class="active">' +
                '<a data-toggle="tab" href="#entries" id="entries-tab" class="enabled entries-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Entries" class="fa fa-film"></i></a>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tab" href="#playlists" id="playlists-tab" class="playlists-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlists" class="ion ion-android-list" style="font-size: 42px;"></i></a>' +
                '</li>' +
                '</ul>' +
                '<div class="tab-content">' +
                '<div id="entries" class="tab-pane active">' +
                '<div class="options">' +
                '<div class="col-sm-11" style="margin-bottom: 15px;text-align: left;display: block;float: none;font-size: 20px;">Entries</div>' +
                '<div class="col-sm-5" style="margin-bottom: 5px;text-align: left;float: none;position: absolute;left: 312px;top: 12px;">Select an entry source for this program below</div>' +
                '<div class="col-sm-12 center-block">' +
                '<div id="programs-wrapper">' +
                '<span class="dropdown header dropdown-accordion">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default filter-btn"><span class="text">Filters</span></button>' +
                '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                '<li role="presentation">' +
                '<div class="panel-group" id="accordion">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a href="#collapseFBOne" data-toggle="collapse" data-parent="#accordion">' +
                'Filter by Categories' +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse in" id="collapseFBOne">' +
                '<div class="panel-body">' +
                '<div id="tree1">' +
                '<div class="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body cat-filter">' +
                tree +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a href="#collapseFBTwo" data-toggle="collapse" data-parent="#accordion">' +
                'Additional Filters' +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse" id="collapseFBTwo">' +
                '<div class="panel-body">' +
                '<div id="tree2">' +
                '<div id="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="media_all" checked> <b>All Media Types</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body media-filter">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="1" class="media_list"> Video</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="5" class="media_list"> Audio</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="100" class="media_list"> Live Stream</label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="durations_all" checked> <b>All Durations</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body duration-filter">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="short" class="duration_list"> Short (0-4 min.)</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="medium" class="duration_list"> Medium (4-20 min.)</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="long" class="duration_list"> Long (20+ min.)</label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="clipped_all" checked> <b>All Original & Clipped Entries</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body clipped-filter">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="1" class="clipped_list"> Original Entries</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="0" class="clipped_list"> Clipped Entries</label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body ac-filter">' +
                tree_ac +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="flavors_all" checked> <b>All Flavors</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body flavors-filter">' +
                tree_flavors +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div id="fblist-table"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="playlists" class="tab-pane">' +
                '<div class="options">' +
                '<div class="col-sm-5" style="margin-bottom: 5px;text-align: left;top: 7px;left: 221px;">Select a playlist source for this program below</div>' +
                '<div class="col-sm-5" style="margin-bottom: 15px;text-align: left;float: none;font-size: 20px;position: absolute;top: 29px;">Playlists</div>' +
                '<div class="col-sm-12 center-block">' +
                '<div id="cm-playlist-table"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal' + modal + ' .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close' + modal + '" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhCM.doProgramSelect(' + modal + ',' + previous_modal + ')">Select</button>';
        $('#smh-modal' + modal + ' .modal-footer').html(footer);
        $('#smh-modal' + modal + ' .modal-footer').addClass('menu-expand-footer');

        $('#smh-modal' + modal + ' #tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal' + modal + ' #tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal' + modal + ' #programs-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal' + modal + ' #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal' + modal + ' .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#smh-modal' + modal + ' .cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal' + modal + ' .cat_all').prop('checked', false);
                } else {
                    $('#smh-modal' + modal + ' .cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhCM.loadEntries(modal);
            }, 100);
        });
        $('#smh-modal' + modal + ' #tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal' + modal + ' .media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('#smh-modal' + modal + ' .media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal' + modal + ' .media_all').prop('checked', false);
            } else {
                $('#smh-modal' + modal + ' .media_all').prop('checked', true);
            }
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('.duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('#smh-modal' + modal + ' .duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal' + modal + ' .durations_all').prop('checked', false);
            } else {
                $('#smh-modal' + modal + ' .durations_all').prop('checked', true);
            }
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal' + modal + ' .clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('#smh-modal' + modal + ' .clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal' + modal + ' .clipped_all').prop('checked', false);
            } else {
                $('#smh-modal' + modal + ' .clipped_all').prop('checked', true);
            }
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal' + modal + ' .ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#smh-modal' + modal + ' .ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal' + modal + ' .ac_all').prop('checked', false);
            } else {
                $('#smh-modal' + modal + ' .ac_all').prop('checked', true);
            }
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal' + modal + ' .flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhCM.loadEntries(modal);
        });
        $('#smh-modal' + modal + ' #tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('#smh-modal' + modal + ' .flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal' + modal + ' .flavors_all').prop('checked', false);
            } else {
                $('#smh-modal' + modal + ' .flavors_all').prop('checked', true);
            }
            smhCM.loadEntries(modal);
        });

        // Collapse accordion every time dropdown is shown
        $('#smh-modal' + modal + ' #programs-wrapper .dropdown-accordion').on('show.bs.dropdown', function (event) {
            var accordion = $(this).find($(this).data('accordion'));
            accordion.find('.panel-collapse.in').collapse('hide');
        });

        // Prevent dropdown to be closed when we click on an accordion link
        $('#smh-modal' + modal + ' #programs-wrapper .dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('#programs-wrapper ' + $(this).data('parent')).find('.panel-collapse.in').collapse('hide');
            $($(this).attr('href')).collapse('show');
        });

        $('#smh-modal' + modal + ' .dropdown-accordion').on('click', '.panel-body', function (event) {
            event.stopPropagation();
        });
        $('#smh-modal' + modal + ' .channel-tab .player-menu a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            if (target == '#entries') {
                program_source_tab = 'entries';
            } else {
                program_source_tab = 'playlists';
            }
        });
        $('#smh-modal' + modal + ' .channel-tab .player-menu a[data-toggle="tab"]:first').trigger("shown.bs.tab");
        smhCM.loadEntries(modal);
        smhCM.loadPlaylists(modal);
    },
    doProgramSelect: function (modal, previous_modal) {
        var rowcollection;
        if (program_source_tab == 'entries') {
            rowcollection = programsTable.$(".program-entry:checked", {
                "page": "all"
            });
        } else {
            rowcollection = programsPlaylistTable.$(".program-entry:checked", {
                "page": "all"
            });
        }
        program_eid = null;
        var entry_name = '';
        var duration = 0;
        var program_thumb = '';
        previous_modal = (previous_modal) ? previous_modal : '';
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val();
            var split_value = checkbox_value.split(';');
            program_eid = split_value[0];
            entry_name = split_value[1];
            duration = split_value[2];
            program_thumb = (program_source_tab == 'entries') ? program_eid : split_value[3];
        });
        var origin = (modal === 2) ? 'timeline' : 'channel';
        if (program_eid) {
            if (API) {
                API.destroy();
            }
            $('#smh-modal' + previous_modal + ' #program-selected').attr('data-entry', program_eid);
            $('#smh-modal' + previous_modal + ' #program-selected').attr('data-entry-duration', duration);
            $('#smh-modal' + previous_modal + ' #program-selected').empty();
            $('#smh-modal' + previous_modal + ' #program-selected').html('<img src="http://devplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/thumbnail/entry_id/' + program_thumb + '/quality/100/type/1/height/40/width/71" height="40" width="71"><div id="program-title">' + entry_name + '</div><span style="display: inline-block;float: right;"><button type="button" class="btn btn-block bg-olive" id="select-program" onclick="smhCM.selectProgram(\'' + origin + '\');" style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;padding: 10px 15px;position: relative;top: 0px;right: 0px;height: 41px;"><i class="fa fa-external-link"></i></button></span>');
            API = $('#smh-modal' + previous_modal + ' #program-title').dotdotdot({
                height: 32,
                watch: true,
                ellipsis: "\u2026 ",
                truncate: "letter",
                fallbackToLetter: true
            }).data("dotdotdot");
            if (Number(duration) !== 0) {
                var duration_hms = smhCM.secondsTimeSpanToHMS(duration);
                var duration_parse = duration_hms.split(":");
                var duration_hours = duration_parse[0];
                var duration_mintues = duration_parse[1];
                var duration_seconds = duration_parse[2];
                $('#hours').val(duration_hours);
                $('#minutes').val(duration_mintues);
                $('#seconds').val(duration_seconds);

                var repeat = ($('#smh-modal' + previous_modal + ' #recurrence-status').prop('checked')) ? true : false;
                if (!repeat) {
                    var start_date = $('#datetimepicker1 input').val();
                    var d = new Date(start_date);
                    d.setSeconds(d.getSeconds() + Number(duration));
                    var end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(end_date);
                }
            }
        } else {
            $('#smh-modal' + previous_modal + ' #program-selected').html('<div id="program-title">None Selected</div><span style="display: inline-block;float: right;"><button type="button" class="btn btn-block bg-olive" id="select-program" onclick="smhCM.selectProgram(\'' + origin + '\');" style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;padding: 10px 15px;position: relative;top: 0px;right: 0px;height: 41px;"><i class="fa fa-external-link"></i></button></span>');
        }
        $(".smh-close" + modal).click();
    },
    loadPlaylists: function (modal) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal' + modal + ' #cm-playlist-table').empty();
        $('#smh-modal' + modal + ' #cm-playlist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="cm-playlist-data"></table>');
        programsPlaylistTable = $('#smh-modal' + modal + ' #cm-playlist-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "scrollCollapse": true,
            "scrollY": "425px",
            "ajax": {
                "url": "/api/v1/getProgramPlaylists",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "action": "get_program_content",
                        "ks": sessInfo.ks,
                        "tz": tz
                    });
                }
            },
            "language": {
                "zeroRecords": "No Playlists Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Entries</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 2, 10);
            }
        });
        $('#smh-modal' + modal + ' #cm-playlist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    loadEntries: function (modal) {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal' + modal + ' #fblist-table').empty();
        $('#smh-modal' + modal + ' #fblist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="fblist-data"></table>');
        programsTable = $('#smh-modal' + modal + ' #fblist-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "scrollCollapse": true,
            "scrollY": "425px",
            "ajax": {
                "url": "/api/v1/getProgramEntries",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "action": "get_program_content",
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "category": categories_id,
                        "mediaType": mediaTypes_id,
                        "duration": durations,
                        "clipped": clipped_id,
                        "ac": ac_id,
                        "flavors": flavors_id
                    });
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Entries</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 2, 10);
            }
        });
        $('#smh-modal' + modal + ' #fblist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    removeEvent: function (id) {
//        console.log('removeEvent');
//        console.log(id);
        scheduler.deleteEvent(id, true);
    },
    getChannelEntries: function (cid) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#channel-table').empty();
        $('#channel-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="channels-data"></table>');
        channelsTable = $('#channels-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 6,
            "searching": true,
            "info": true,
            "lengthChange": false,
            "responsive": true,
            "ajax": {
                "url": "/api/v1/getChannelEntries",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "pid": sessInfo.pid,
                        "tz": tz,
                        "cid": cid
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Programs Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><input type='checkbox' class='channel-bulk' id='channel-bulkAll' style='width:16px; margin-right: 7px;' name='channel_bulkAll' /></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Thumbnail</div></span>",
                    "width": "105px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Name</div></span>",
                    "width": "190px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Start Date</div></span>",
                    "width": "200px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>End Date</div></span>",
                    "width": "200px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                    "width": "110px"
                },
            ],
            columnDefs: [{
                    targets: 2,
                    render: $.fn.dataTable.render.ellipsis(27, true)
                }],
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 6, 6);
            }
        });

        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled', '');
        $('#channel-table').on('change', ".channel-bulk", function () {
            var anyBoxesChecked = false;
            $('#channel-table input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });

            if (anyBoxesChecked == true) {
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled', '');
            }
        });
        $('#channel-bulkAll').click(function () {
            if (this.checked) {
                $('.channel-bulk').each(function () {
                    this.checked = true;
                });
            } else {
                $('.channel-bulk').each(function () {
                    this.checked = false;
                });
            }
        });
    },
    thumbBase: function (o) {
        var path = o.src;
        var pos = path.indexOf("/vid_slice");
        if (pos != -1)
            path = path.substring(0, pos);

        return path;
    },
    change: function (o, i) {
        slice = (i + 1) % slices;

        var path = smhCM.thumbBase(o);

        o.src = path + "/vid_slice/" + i + "/vid_slices/" + slices;
        img.src = path + "/vid_slice/" + slice + "/vid_slices/" + slices;

        i = i % slices;
        i++;

        timer = setTimeout(function () {
            smhCM.change(o, i)
        }, frameRate);
    },
    thumbRotatorStart: function (o) {
        clearTimeout(timer);
        var path = smhCM.thumbBase(o);
        smhCM.change(o, 1);
    },
    thumbRotatorEnd: function (o) {
        clearTimeout(timer);
        o.src = smhCM.thumbBase(o);
    },
    //Get player uiconf ids
    getUiConfs: function () {
        var sessData = {
            ks: sessInfo.ks,
            partner_id: sessInfo.pid,
            type: "player"
        };

        var reqUrl = "/index.php/kmc/getuiconfs";
        $.ajax({
            cache: false,
            url: reqUrl,
            async: false,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                uiconf_ids = data;
            }
        });
    },
    previewEmbedSchedule: function () {
        smhMain.resetModal();
        var header, content, gen, embedCode, player_prev_gen, player_prev;
        $('#smh-modal4 .modal-body').css('padding', '0');
        $('#smh-modal4').modal({
            backdrop: 'static'
        });
        $('#smh-modal4').addClass('previewModal');

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Preview & Embed</h4>';
        $('#smh-modal4 .modal-header').html(header);

        var player_options = '';
        $.each(uiconf_ids, function (key, value) {
            if (value['id'] !== 6710348) {
                player_options += "<option value='" + value['id'] + "'>" + value['name'] + "</option>";
            }
        });
        var uiconf_id = uiconf_ids[0]['id'];
        var width = 500;
        var height = 800;

        var embed_perm = '';

        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            embed_perm = '<div style="margin-top: 10px; font-weight: bold;"><div style="color: #444; font-size: 12px; padding-top: 15px; float: left;">Embed Code:</div><div style="float: right; margin-right: 13px;"><button id="select-bttn" class="btn btn-default" style="margin: 10px 0 10px 0;">Select Code</button></div></div>' +
                    '<textarea class="form-control" id="embed_code" rows="5" cols="30" style="height: 135px;"></textarea>' +
                    '<hr>';
        }

        content = '<div class="content">' +
                '<div class="options">' +
                '<div id="select-player-options">' +
                '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 30px; color: #444; font-size: 12px;">Select Player:</span><span><select id="players" class="form-control" style="width: 213px;">' + player_options + '</select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Player includes both layout and functionality (advertising, substitles, etc)</span></div>' +
                '<hr>' +
                '</div>' +
                '<div style="margin-top: 10px; margin-bottom: 10px; font-weight: bold;">' +
                '<span style="color: #444; font-size: 12px;margin-right: 30px;">Iframe Dimensions:</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Width</span><input type="text" value="100" id="dim_width" name="dim_width" style="width: 70px; margin-left: 10px; display: inline;" class="form-control" disabled><span> %</span>' +
                '<div class="right-ar">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Height</span><input type="text" value="' + height + '" id="dim_height" name="dim_height" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr>' +
                '<div id="preview-options">' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">View a standalone page with this schedule</span></div>' +
                '<div id="shortlink" style="margin-top: 5px; font-size: 12px; word-wrap: break-word;"></div>' +
                embed_perm +
                '</div>' +
                '</div>' +
                '<div class="player_preview">Preview Schedule<hr>' +
                '<div id="previewIframe" style="margin-top: 5px;"></div>' +
                '</div>' +
                '</div>';
        $('#smh-modal4 .modal-body').html(content);

        $('.options').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal4').on('keyup', '#dim_height', function (ev) {
            var height = $('#dim_height').val();
            $('#embed_code').text('<iframe frameborder="0" style="height: ' + height + 'px; width: 100%; border: none" allowfullscreen webkitallowfullscreen mozallowfullscreen src="https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '"></iframe>');
        });

        $('#smh-modal4').on('change', 'select#players', function (event) {
            uiconf_id = $('select#players option:selected').val();
            $('#shortlink').html('<a target="_blank" href="https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '">https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '</a>');
            smhCM.generateScedulerIframe(uiconf_id);
            $('#embed_code').text('<iframe frameborder="0" style="height: 800px; width: 100%; border: none" allowfullscreen webkitallowfullscreen mozallowfullscreen src="https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '"></iframe>');
        });

        $('#shortlink').html('<a target="_blank" href="https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '">https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '</a>');
        smhCM.generateScedulerIframe(uiconf_id);
        $('#embed_code').text('<iframe frameborder="0" style="height: 800px; width: 100%; border: none" allowfullscreen webkitallowfullscreen mozallowfullscreen src="https://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=' + sessInfo.pid + '&playerId=' + uiconf_id + '"></iframe>');

        $('#smh-modal4').on('click', '#select-bttn', function (event) {
            $('#smh-modal4 #embed_code').select();
        });

    },
    //Preview and Embed
    previewEmbed: function (entryId, name) {
        smhMain.resetModal();
        var header, content, gen, embedCode, player_prev_gen, player_prev;
        var protocol = 'http';
        var seo = false;
        $('#smh-modal4 .modal-body').css('padding', '0');
        $('#smh-modal4').modal({
            backdrop: 'static'
        });
        $('#smh-modal4').addClass('previewModal');

        var header_text = 'Preview';
        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            header_text = 'Preview & Embed';
        }

        name = name.replace(/"/g, '&quot;');

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + header_text + ': ' + name.replace(/%20/g, " ") + '</h4>';
        $('#smh-modal4 .modal-header').html(header);

        var player_options = '';
        $.each(uiconf_ids, function (key, value) {
            if (value['id'] !== 6710348) {
                player_options += "<option value='" + value['id'] + "'>" + value['name'] + "</option>";
            }
        });
        var uiconf_id = uiconf_ids[0]['id'];
        var width = uiconf_ids[0]['width'];
        var height = uiconf_ids[0]['height'];
        var sizing = 'fixed';
        var ratio = '16:9';

        var embed_perm = '';
        var embed_type = '';
        var secure_seo = '';

        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            embed_perm = '<div style="margin-top: 10px; font-weight: bold;"><div style="color: #444; font-size: 12px; padding-top: 15px; float: left;">Embed Code:</div><div style="float: right; margin-right: 13px;"><button id="select-bttn" class="btn btn-default" style="margin: 10px 0 10px 0;">Select Code</button></div></div>' +
                    '<textarea class="form-control" id="embed_code" rows="5" cols="30"></textarea>' +
                    '<hr>';
            embed_type = '<div id="embed-types-options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 37px;">Embed Type:</span><span><select class="form-control embedType" style="width: 213px;"><option value="dynamic">Dynamic Embed</option><option value="thumb">Thumbnail Embed</option><option value="iframe">Iframe Embed</option></select></span></div>' +
                    '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.</span></div>' +
                    '<hr>' +
                    '</div>';
            secure_seo = '<div id="seo-options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="secure" name="secure"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Support for HTTPS embed code</span></div>' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="seo" name="seo"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Include Search Engine Optimization data</span></div>' +
                    '<hr>' +
                    '</div>';
        }

        content = '<div class="content">' +
                '<div class="options">' +
                '<div id="select-player-options">' +
                '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 30px; color: #444; font-size: 12px;">Select Player:</span><span><select id="players" class="form-control" style="width: 213px;">' + player_options + '</select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Player includes both layout and functionality (advertising, substitles, etc)</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="embed-options">' +
                embed_type +
                '<div style="margin-top: 10px; margin-bottom: 10px; font-weight: bold;">' +
                '<span style="color: #444; font-size: 12px;margin-right: 30px;">Player Dimensions</span>' +
                '</div>' +
                '<div id="player-sizing">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Sizing:</span>' +
                '<div style="margin-top:5px; margin-bottom:15px;display: inline-block; margin-left: 8px;">' +
                '<div class="radio" style="display: inline-block;">' +
                '<label class="pluginLabel">' +
                '<input type="radio" style="margin-right: 5px" id="player_fixed" name="player_sizing" checked>Fixed' +
                '</label>' +
                '</div>' +
                '<div class="radio" style="display: inline-block; margin-left: 15px;">' +
                '<label class="pluginLabel">' +
                '<input type="radio" style="margin-right: 5px" id="player_responsive" name="player_sizing">Responsive' +
                '</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Aspect Ratio:</span>' +
                '<select id="aspect_ratio" style="margin-bottom: 15px; display: inline-block; margin-left: 8px; width: 135px; font-weight: bold;" class="form-control"><option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option></select>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Width</span><input type="text" value="' + width + '" id="dim_width" name="dim_width" style="width: 70px; margin-left: 10px; display: inline;" class="form-control"><span> px</span>' +
                '<div class="right-ar">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Height</span><input type="text" value="' + height + '" id="dim_height" name="dim_height" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>' +
                '</div>' +
                '<button class="btn btn-default" style="margin-top: 20px" id="update-dim"><i class="fa fa-refresh">&nbsp;</i>Update Dimensions</button>' +
                '<div class="clear"></div>' +
                '<hr>' +
                secure_seo +
                '<div id="preview-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 52px;">Preview:</span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Scan the QR code to preview in your mobile device</span></div>' +
                '<div id="qrcode" style="margin-top: 5px; font-size: 12px; width: 80px; height: 80px;"></div>' +
                '<hr>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">View a standalone page with this player</span></div>' +
                '<div id="shortlink" style="margin-top: 5px; font-size: 12px; word-wrap: break-word;"></div>' +
                '</div>' +
                embed_perm +
                '</div>' +
                '</div>' +
                '<div class="player_preview">Preview Player<hr>' +
                '<div id="previewIframe" style="margin-top: 5px;"></div>' +
                '</div>' +
                '</div>';
        $('#smh-modal4 .modal-body').html(content);

        $('.options').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        var embed = $('select.embedType option:selected').val();
        var delivery = 'hls';
        smhCM.getShortLink(uiconf_id, entryId, embed, delivery);
        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
            embedCode = gen.getCode();
            $('#embed_code').text(embedCode);
        }

        player_prev_gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhCM.generateIframe(player_prev);

        $('#smh-modal4').on('change', 'input:radio[name=player_sizing]', function (event) {
            if ($('#smh-modal4 #player_fixed').prop('checked')) {
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                sizing = "fixed";
            } else if ($('#smh-modal4 #player_responsive').prop('checked')) {
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9" selected>16:9</option><option value="4:3">4:3</option>');
                $('#dim_height').attr('disabled', '');
                sizing = "responsive";
            }
            var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
            width = $('#dim_width').val();
            height = parseInt(width * aspect);
            $('#dim_height').val(height);
            player_prev_gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhCM.generateIframe(player_prev);
        });

        $('#smh-modal4').on('change', 'select#players', function (event) {
            uiconf_id = $('select#players option:selected').val();
            $.each(uiconf_ids, function (key, value) {
                if (uiconf_id == value['id']) {
                    width = value['width'];
                    height = value['height'];
                }
            });

            $('#dim_width').val(width);
            $('#dim_height').val(height);

            player_prev_gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            smhCM.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhCM.generateIframe(player_prev);
        });

        $('#smh-modal4').on('click', '#update-dim', function () {
            width = $('#dim_width').val();
            height = $('#dim_height').val();
            player_prev_gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhCM.generateIframe(player_prev);
        });

        $('#smh-modal4').on('keyup', '#dim_width', function () {
            ratio = $('#aspect_ratio').val();
            if (ratio !== 'custom') {
                var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
            }
        });

        $('#smh-modal4').on('change', '#aspect_ratio', function () {
            ratio = $('#aspect_ratio').val();
            if (ratio !== 'custom') {
                $('#dim_height').attr('disabled', '');
                var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
            } else {
                $('#dim_height').removeAttr('disabled');
            }
        });

        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            $('select.embedType').on('change', function (event) {
                embed = $('select.embedType option:selected').val();
                if (embed == 'dynamic') {
                    $('#embedType-text').html('Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.');
                } else if (embed == 'thumb') {
                    $('#embedType-text').html('This is the recommended method to use when you need to embed many players/entries in the same web page.');
                } else if (embed == 'iframe') {
                    $('#embedType-text').html('Iframe embed is good for sites that do not allow 3rd party JavaScript to be embeded on their pages.');
                }
                player_prev_gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhCM.getShortLink(uiconf_id, entryId, embed, delivery);

                gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
                player_prev = player_prev_gen.getCode();
                smhCM.generateIframe(player_prev);
            });
            $('.previewModal .options').on('change', '#secure', function (event) {
                if ($("#secure").is(':checked')) {
                    protocol = 'https';
                    gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    protocol = 'http';
                    gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
            $('.previewModal .options').on('change', '#seo', function (event) {
                if ($("#seo").is(':checked')) {
                    seo = true;
                    gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    seo = false;
                    gen = smhCM.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
        }

        $('#smh-modal4').on('click', '#select-bttn', function (event) {
            $('#smh-modal4 #embed_code').select();
        });
    },
    generateScedulerIframe: function (uiconf_id) {
        $('#previewIframe').empty();
        var iframe = document.createElement('iframe');
        // Reset iframe style
        iframe.frameborder = "0";
        iframe.frameBorder = "0";
        iframe.marginheight = "0";
        iframe.marginwidth = "0";
        iframe.frameborder = "0";
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('id', 'smh-iframe');
        iframe.src = "http://devplatform.streamingmediahosting.com/apps/channel/v1.0/schedule.php?pid=" + sessInfo.pid + "&playerId=" + uiconf_id + "&ks=" + sessInfo.ks;
        $('#previewIframe').append(iframe);
    },
    //Generate iframe code
    generateIframe: function (embedCode) {
        $('#previewIframe').empty();
        var style = '<style>html, body {margin: 0; padding: 0; width: 100%; height: 100%; } #framePlayerContainer {margin: 0 auto; padding-top: 20px; text-align: center; } object, div { margin: 0 auto; }</style>';
        var iframe = document.createElement('iframe');
        // Reset iframe style
        iframe.frameborder = "0";
        iframe.frameBorder = "0";
        iframe.marginheight = "0";
        iframe.marginwidth = "0";
        iframe.frameborder = "0";
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('id', 'smh-iframe');
        $('#previewIframe').append(iframe);
        var newDoc = iframe.contentDocument;
        newDoc.open();
        newDoc.write('<!doctype html><html><head>' + style + '</head><body><div id="framePlayerContainer">' + embedCode + '</div></body></html>');
        newDoc.close();
    },
    //Get Shortlink
    getShortLink: function (uiconf, entryid, embed, delivery) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#qrcode').empty();
            shortlink = 'https://mediaplatform.streamingmediahosting.com/tiny/' + results['id'];
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 80,
                height: 80
            });
            qrcode.clear();
            qrcode.makeCode(shortlink);
            $('#shortlink').html('<a target="_blank" href="' + shortlink + '">' + shortlink + '</a>');
        };
        var url = '';
        if (delivery == 'http') {
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/entry_id/" + entryid + "/embed/" + embed + "?&flashvars[ks]=" + sessInfo.ks;
        } else {
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/entry_id/" + entryid + "/embed/" + embed + "?&flashvars[streamerType]=rtmp&flashvars[mediaProtocol]=rtmp&flashvars[ks]=" + sessInfo.ks;
        }

        $('#shortlink').html('Generating...');
        $('#qrcode').html('Generating...');
        var shortLink = new KalturaShortLink();
        shortLink.systemName = "KMC-PREVIEW";
        shortLink.fullUrl = url;
        client.shortLink.add(cb, shortLink);
    },
    //Generate embed code
    generateEmbed: function (uiconf_id, entryId, width, height, protocol, streamerType, embed, seo, name, preview, sizing, aspectRatio) {
        var flashvars = {};
        flashvars.LeadHLSOnAndroid = true;

        if (preview) {
            flashvars.ks = sessInfo.ks;
        }

        var cacheSt = smhCM.getCacheSt();
        var gen = new kEmbedCodeGenerator({
            host: "mediaplatform.streamingmediahosting.com",
            securedHost: "mediaplatform.streamingmediahosting.com",
            embedType: embed,
            partnerId: sessInfo.pid,
            widgetId: "_" + sessInfo.pid,
            uiConfId: uiconf_id,
            entryId: entryId,
            playerId: "smh_player",
            width: width,
            height: height,
            cacheSt: cacheSt,
            includeKalturaLinks: false,
            includeSeoMetadata: seo,
            sizing: sizing,
            aspectRatio: aspectRatio,
            preview: preview,
            protocol: protocol,
            flashVars: flashvars,
            entryMeta: {
                name: name,
                thumbnailUrl: "http://imgs.mediaportal.streamingmediahosting.com/p/" + sessInfo.pid + "/sp/" + sessInfo.pid + "00/thumbnail/entry_id/" + entryId + "/width/120/height/90/bgcolor/000000/type/2",
                width: width,
                height: height
            }
        });
        return gen;
    },
    //Generate Cache
    getCacheSt: function () {
        var d = new Date();
        return Math.floor(d.getTime() / 1000) + (15 * 60); // start caching in 15 minutes
    },
    addProgram: function (cid) {
        smhCM.resetModal2();
        var header, content, footer;
        $('.smh-dialog2').css('width', '600px');
        $('#smh-modal2 .modal-body').css('padding', '0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        var currentDate = new Date();
        var start_date = currentDate.toString("yyyy-MM-dd hh:mm:ss tt");

        currentDate.setSeconds(currentDate.getSeconds() + 300);
        var end_date = currentDate.toString("yyyy-MM-dd hh:mm:ss tt");

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1000');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Program</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<form id="add-program-form">' +
                '<div class="row">' +
                '<div class="col-sm-10 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">Program Source:</span></td><td><span id="channel-selected" data-channel-selected="' + cid + '"></span><div id="program-selected"><div id="program-title">None Selected</div><span style="display: inline-block;float: right;"><button type="button" class="btn btn-block bg-olive" id="select-program" onclick="smhCM.selectProgram(\'channel\');" style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;padding: 10px 15px;position: relative;top: 0px;right: 0px;height: 41px;"><i class="fa fa-external-link"></i></button></span></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td valign=top><div style="font-weight: normal;">Program Schedule:</div></td><td><div class="repeat-title">Start Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker1">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + start_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div style="margin-top:10px;" class="repeat-title">End Date</div>' +
                '<div class="date-wrapper">' +
                '<div class="input-group input-append date" id="datetimepicker2">' +
                '<input type="text" class="form-control" style="margin: auto; width: 280px; height: 41px;" value="' + end_date + '" readonly/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Repeat Program:</span></td><td><input data-toggle="toggle" id="recurrence-status" type="checkbox"></td>' +
                '</tr>' +
                '<tr id="all-repeat-options">' +
                '<td></td><td>' +
                '<div class="repeat-title">Program Length</div>' +
                '<span class="size1"><input id="hours" name="value" value=00><div>hours</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="minutes" name="value" value=00><div>minutes</div></span><span class="time-colon"> : </span>' +
                '<span class="size2"><input id="seconds" name="value" value=00><div>seconds</div></span>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-wrapper">' +
                '<div class="repeat-title">Repeat Pattern</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="pattern-selected">Daily</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-pattern-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">Daily</a></li>' +
                '<li><a href="#">Weekly</a></li>' +
                '<li><a href="#">Monthly</a></li>' +
                '<li><a href="#">Yearly</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div id="repeat-options">' +
                '<div class="repeat-title">Repeat Every</div>' +
                '<input type="text" class="form-control" id="repeat-everyday" value="1"/><span id="repeat-everyday-text">day(s)</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr class="repeat-separator">' +
                '<div class="dropdown repeat-ends-wrapper">' +
                '<div class="repeat-title">Recurrence Ends</div>' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="repeat-ends-selected">No End Date</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="repeat-ends-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">No End Date</a></li>' +
                '<li><a href="#">After</a></li>' +
                '<li><a href="#">End by</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="repeat-ends-options">' +
                '</div>' +
                '<div class="clear"></div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="add-program" onclick="smhCM.saveProgram(\'' + cid + '\',\'channel\')">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        //var saved_end_date = $('#datetimepicker2 input').val();
        $('#recurrence-status').change(function () {
            if ($(this).prop('checked')) {
                $('#all-repeat-options').css('display', 'table-row');
                $('#datetimepicker2 input').val('');
                $('#datetimepicker2 input').prop('disabled', true);
                $('#seconds').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#minutes').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#minutes').spinner('stepDown');
                            return false;
                        }
                    },
                    value: 300
                });
                $('#minutes').spinner({
                    alignment: 'vertical',
                    numberFormat: "d2",
                    spin: function (event, ui) {
                        if (ui.value >= 60) {
                            $(this).spinner('value', ui.value - 60);
                            $('#hours').spinner('stepUp');
                            return false;
                        } else if (ui.value < 0) {
                            $(this).spinner('value', ui.value + 60);
                            $('#hours').spinner('stepDown');
                            return false;
                        }
                    }
                });
                $('#hours').spinner({
                    numberFormat: "d2",
                    alignment: 'vertical',
                    min: 0
                });

                $('.ui-spinner a').addClass('ui-state-default');

            } else {
                var entry = $('#program-selected').attr('data-entry');
                if (entry) {
                    var entry_duration = $('#program-selected').attr('data-entry-duration');
                    var start_date = $('#datetimepicker1 input').val();
                    var d = new Date(start_date);
                    d.setSeconds(d.getSeconds() + Number(entry_duration));
                    var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(entry_end_date);
                } else {
                    var start_date_mod = $('#datetimepicker1 input').val();
                    var d = new Date(start_date_mod);
                    d.setSeconds(d.getSeconds() + 1);
                    var end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                    $('#datetimepicker2 input').val(end_date);
                }
                $('#all-repeat-options').css('display', 'none');
                $('#datetimepicker2 input').prop('disabled', false);
            }
        });

        $("#channel-list li").each(function () {
            if (channelId === $(this).attr('data-channel-select-id')) {
                $('#channel-selected').html($(this).html());
                $('#channel-selected').attr('data-channel-selected', channelId);
            }
        });

        $('#smh-modal #add-program-form .dropdown').on('click', '.mCSB_scrollTools', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

        $('#smh-modal #channel-list').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $(".channel-select-title").dotdotdot({
            height: 56,
            watch: true,
            ellipsis: "\u2026 ",
            truncate: "letter",
            fallbackToLetter: true
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            ignoreReadonly: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm:ss A',
            sideBySide: true,
            useCurrent: false,
            ignoreReadonly: true
        });

        $('#datetimepicker1').on('dp.change', function (e) {
            var entry = $('#program-selected').attr('data-entry');
            var repeat = $('#recurrence-status').is(":checked");
            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
            if (entry && !repeat && entry_duration) {
                var new_start_date = $('#datetimepicker1 input').val();
                var d = new Date(new_start_date);
                d.setSeconds(d.getSeconds() + entry_duration);
                var entry_end_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
                $('#datetimepicker2 input').val(entry_end_date);
            }
        });

//        $('#datetimepicker2').on('dp.change', function (e) {
//            var entry = $('#program-selected').attr('data-entry');
//            var entry_duration = Number($('#program-selected').attr('data-entry-duration'));
//            if (entry && entry_duration) {
//                var new_end_date = $('#datetimepicker2 input').val();
//                var d = new Date(new_end_date);
//                d.setSeconds(d.getSeconds() - entry_duration);
//                var entry_start_date = d.toString("yyyy-MM-dd hh:mm:ss tt");
//                $('#datetimepicker1 input').val(entry_start_date);
//            }
//        });

        $('#recurrence-status').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

    },
    deleteProgram: function (id, name, cid, origin) {
        smhCM.resetModal2();
        var header, content, footer;
        $('.smh-dialog2').css('width', '435px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1000');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = "<div style='text-align: center; margin-top: 15px; height: 70px; width: 404px;'>Are you sure you want to delete the following program?<div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-program" onclick="smhCM.removeProgram(\'' + id + '\',\'' + cid + '\',\'' + origin + '\')">Delete</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    removeProgram: function (sid, cid, origin) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'delete_program',
            sid: sid
        }

        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#delete-program').attr('disabled', '');
                $('#smh-modal2 #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    if (origin === 'timeline') {
                        smhCM.refresh_schedule();
                        $('#smh-modal2 #loading img').css('display', 'none');
                        $('#smh-modal .smh-close').click();
                        $('#smh-modal2 .smh-close2').click();
                    } else {
                        smhCM.refresh_schedule();
                        smhCM.getChannelEntries(cid);
                        $('#smh-modal2 #loading img').css('display', 'none');
                        $('#smh-modal2 .smh-close2').click();
                    }
                } else {
                    $('#smh-modal2 #loading img').css('display', 'none');
                    $('#smh-modal2 #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                }
            }
        });
    },
    deleteChannel: function (id, name) {
        smhCM.resetModal();
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 100px; width: 378px;'>Are you sure you want to delete the following channel?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div><div style='margin-bottom: 30px;'>Note: Every program for this channel will also be deleted</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-channel" onclick="smhCM.removeChannel(\'' + id + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    removeChannel: function (id) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'delete_channel',
            cid: id
        }

        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#smh-modal #loading img').css('display', 'inline-block');
                $('#delete-channel').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    smhCM.refresh_schedule();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Channel Successfully Deleted!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#delete-channel').removeAttr('disabled');
                        $('#smh-modal').modal('hide');
                    }, 3000);
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                }
            }
        });
    },
    addChannel: function () {
        smhMain.resetModal();
        smhCM.resetModal();
        smhCM.resetFilters();
        var header, content, footer;
        $('.smh-dialog').css('width', '656px');
        $('#smh-modal .modal-body').css('height', '380px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var access_select = '';
        var ac_disable = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? '' : 'disabled';
        var cat_disable = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? '' : 'disabled';
        var refid_disable = ($.inArray("CONTENT_INGEST_REFERENCE_MODIFY", sessPerm) != -1) ? '' : 'disabled';
        var metadata_disable = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? '' : 'disabled';

        $.each(ac_select, function (index, value) {
            access_select += '<option value="' + index + '">' + value + '</option>';
        });

        header = '<button type="button" class="close smh-close mplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Channel</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<form id="add-channel-form">' +
                '<div class="row">' +
                '<div class="col-sm-10 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span class="required" style="font-weight: normal;">Name:</span></td><td><input type="text" name="ch_name" id="ch_name" class="form-control" placeholder="Enter a name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="ch_desc" id="ch_desc" class="form-control" placeholder="Enter a description" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="ch_tags" id="ch_tags" class="form-control" placeholder="Enter tags separated by commas" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="ch_ref" id="ch_ref" class="form-control" placeholder="Enter a reference ID" ' + refid_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Categories: <i class="fa fa-external-link" onclick="smhCM.selectCat();"></i></span></td><td><input type="text" name="ch_cat" id="ch_cat" class="form-control" placeholder="Enter categories separated by commas" ' + cat_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Access Control Profile:</span></td><td><select class="form-control" id="ac-select" ' + ac_disable + '>' + access_select + '</select></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default mplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="add-channel" onclick="smhCM.createChannel()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#add-channel-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#add-channel-form").validate({
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
                ch_name: {
                    required: true
                }
            },
            messages: {
                ch_name: {
                    required: 'Please enter a name'
                }
            }
        });
    },
    editChannel: function (id, name, desc, tags, refid, cats, ac, status, publish, thumbUrl) {
        smhMain.resetModal();
        smhCM.resetModal();
        smhCM.resetFilters();
        var header, content, footer;
        $('.smh-dialog').css('width', '956px');
        $('#smh-modal .modal-body').css('height', '640px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var access_select = '';
        var ac_disable = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? '' : 'disabled';
        var cat_disable = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? '' : 'disabled';
        var refid_disable = ($.inArray("CONTENT_INGEST_REFERENCE_MODIFY", sessPerm) != -1) ? '' : 'disabled';
        var metadata_disable = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? '' : 'disabled';

        $.each(ac_select, function (index, value) {
            access_select += '<option value="' + index + '">' + value + '</option>';
        });

        name = name.replace(/"/g, '&quot;');
        desc = desc.replace(/"/g, '&quot;');

        header = '<button type="button" class="close smh-close mplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Channel</h4>';
        $('#smh-modal .modal-header').html(header);

        var status_check = '';
        var status_disable_check = '';
        var status_tooltip = '';
        if (status === 2) {
            if (publish) {
                status_check = 'checked';
            }
        } else if (status === 7) {
            status_disable_check = 'disabled'
            status_tooltip = '<i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="This channel must have at least one program in order to go live." class="fa fa-question-circle" style="font-size: 14px; margin-left: 5px; top: 0;"></i>';
        }
        content = '<div class="channel-tab tabbable">' +
                '<ul class="nav nav-pills nav-stacked player-menu">' +
                '<li class="active">' +
                '<a data-toggle="tab" href="#details" id="basic-tab" class="enabled basic-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Channel Details" class="fa fa-gears"></i></a>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tab" href="#channel-entries" id="display-tab" class="programs-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Channel Programs" class="fa fa-list"></i></a>' +
                '</li>' +
                '</ul>' +
                '<div class="tab-content">' +
                '<div id="details" class="tab-pane active">' +
                '<div class="options">' +
                '<h3>Channel Details</h3>' +
                '<form id="edit-channel-form">' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<table width="100%" border="0" id="entry-edit-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span style="font-weight: normal;">On Air Status:</span></td><td><input ' + status_check + ' data-toggle="toggle" id="air-status" type="checkbox" ' + status_disable_check + '> ' + status_tooltip + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 151px;"><span class="required" style="font-weight: normal;">Name:</span></td><td><input type="text" name="ch_name" id="ch_name" class="form-control" value="' + name + '" placeholder="Enter a name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="ch_desc" id="ch_desc" class="form-control" placeholder="Enter a description" value="' + desc + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Thumbnail:</span></td><td><img id="thumb_channel" src="' + thumbUrl + '/quality/100/type/1/width/300/height/168" width="300" height="168"><div style="margin-top: 3px;"><a id="platform-config-link" onclick="smhCM.editThumbnail(\'' + id + '\')">[Edit Thumbnail]</a></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="ch_tags" id="ch_tags" class="form-control" placeholder="Enter tags separated by commas" value="' + tags + '"' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="ch_ref" id="ch_ref" class="form-control" placeholder="Enter a reference ID" value="' + refid + '" ' + refid_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Categories: <i class="fa fa-external-link" onclick="smhCM.selectCat();"></i></span></td><td><input type="text" name="ch_cat" id="ch_cat" class="form-control" placeholder="Enter categories separated by commas" value="' + cats + '" ' + cat_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Access Control Profile:</span></td><td><select class="form-control" id="ac-select" ' + ac_disable + '>' + access_select + '</select></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">HLS Playback URL:</span></td><td><input type="text" class="form-control" value="https://secure.streamingmediahosting.com/8019BC0/livehttp/' + sessInfo.pid + '-live/' + id + '/playlist.m3u8"></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="channel-entries" class="tab-pane">' +
                '<div class="options">' +
                '<h3>Channel Programs</h3>' +
                '<div id="users-buttons" style="position:  absolute; top: 64px; z-index: 1000; left: 91px; width: 857px;">' +
                '<div style="display: inline-block; float: left;">' +
                '<span style="display: inline-block; float: left;"><button class="btn btn-block bg-olive" id="add-program" onclick="smhCM.addProgram(\'' + id + '\');">Create Program</button></span>' +
                '</div>' +
                '<div style="display: inline-block; float: right;">' +
                '<span class="dropdown header">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default dd-delete-btn" type="button" disabled=""><span class="text">Bulk Actions</span></button>' +
                '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu playlist-bulk">' +
                '<li role="presentation"><a onclick="smhCM.bulkDeleteModal(\'' + id + '\');" tabindex="-1" role="menuitem">Delete</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="channel-table"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);
        $('#ac-select').val(ac);
        $('#air-status').bootstrapToggle({
            on: 'Live',
            off: 'Off Air'
        });

        $('#air-status').change(function () {
            if ($(this).prop('checked')) {
                smhCM.updateChannelStatus(id, true);
            } else {
                smhCM.updateChannelStatus(id, false);
            }
        })

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default mplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-channel" onclick="smhCM.updateChannel(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        $('#smh-modal .modal-footer').addClass('channel-menu-expand-footer');

        smhCM.getChannelEntries(id);

        $('#edit-channel-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#edit-channel-form").validate({
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
                ch_name: {
                    required: true
                }
            },
            messages: {
                ch_name: {
                    required: 'Please enter a name'
                }
            }
        });
    },
    //Bulk Delete Modal
    bulkDeleteModal: function (cid) {
        bulkdelete = new Array();
        var rowcollection = channelsTable.$(".channel-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            bulkdelete.push(checkbox_value[0]);
        });

        //smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '440px');
        $('#smh-modal2 .modal-body').css('padding', '0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1000');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Bulk Delete</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected programs?</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-entries" onclick="smhCM.bulkDelete(\'' + cid + '\')">Delete</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    bulkDelete: function (cid) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'delete_program',
            sid: bulkdelete.join()
        }

        console.log(sessData)

        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#delete-entries').attr('disabled', '');
                $('#smh-modal2 #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    smhCM.refresh_schedule();
                    smhCM.getChannelEntries(cid);
                    $('#smh-modal2 #loading img').css('display', 'none');
                    $('#smh-modal2 .smh-close2').click();
                } else {
                    $('#smh-modal2 #loading img').css('display', 'none');
                    $('#smh-modal2 #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                }
            }
        });
    },
    updateChannelStatus: function (cid, status) {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'update_channel_status',
            cid: cid,
            status: status
        }
        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['success']) {
                    smhCM.refresh_schedule();
                }
            }
        });
    },
    updateChannel: function (id) {
        var valid = validator.form();
        if (valid) {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }

                $('#smh-modal #loading img').css('display', 'none');
                $('#smh-modal #pass-result').html('<span class="label label-success">Channel Successfully Updated!</span>');
                setTimeout(function () {
                    $('#smh-modal #pass-result').empty();
                    $('#edit-channel').removeAttr('disabled');
                }, 3000);
                smhCM.refresh_schedule();
            };

            $('#smh-modal #loading img').css('display', 'inline-block');
            $('#edit-channel').attr('disabled', '');
            var name = $('#smh-modal #ch_name').val();
            var desc = $('#smh-modal #ch_desc').val();
            var tags = $('#smh-modal #ch_tags').val();
            var ref = $('#smh-modal #ch_ref').val();
            var cat = $('#smh-modal #ch_cat').val();
            var ac = $('#smh-modal #ac-select').val();

            var liveChannel = new KalturaLiveChannel();
            if (!(typeof desc === "undefined") && !(desc === null) && desc.length > 0) {
                liveChannel.description = desc;
            }
            if (!(typeof tags === "undefined") && !(tags === null) && tags.length > 0) {
                liveChannel.tags = tags;
            }
            if (!(typeof ref === "undefined") && !(ref === null) && ref.length > 0) {
                liveChannel.referenceId = ref;
            }
            if (!(typeof cat === "undefined") && !(cat === null) && cat.length > 0) {
                liveChannel.categories = cat;
            }
            if (!(typeof ac === "undefined") && !(ac === null) && ac.length > 0 && ac > 0) {
                liveChannel.accessControlId = ac;
            }

            liveChannel.name = name;
            client.liveChannel.update(cb, id, liveChannel);
        }
    },
    editThumbnail: function (id) {
        smhCM.resetModal2();
        var header, content, footer;
        $('.smh-dialog2').css('width', '800px');
        $('#smh-modal2 .modal-body').css('height', '615px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1000');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Thumbnail</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<iframe style="width:0px;height:0px;border:0px;position: absolute;" name=hiddenIFrame />' +
                '<form id="thumbUp" enctype="multipart/form-data" target="hiddenIFrame" method="post" action="https://mediaplatform.streamingmediahosting.com/api_v3/index.php?service=thumbAsset&action=addfromimage">' +
                '<input type="hidden" name="ks" value="' + sessInfo.ks + '">' +
                '<input type="hidden" name="entryId" value="' + id + '">' +
                '<input class="upload" type="file" name="fileData">' +
                '</form>' +
                '<div class="dropdown thumb-dropdown">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default" type="button"><span class="text">Add Thumbnail</span></button>' +
                '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu1" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu1" role="menu" class="dropdown-menu">' +
                '<li role="presentation"><a onclick="smhCM.uploadThumb(\'' + id + '\')" href="#" tabindex="-1" role="menuitem">Upload</span></a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<span id="status" style="float: left; margin-top: 4px; margin-left: 18px;"><div id="loading"><img height="20px" src="/img/loading.gif"></div></span><div id="thumb-table" style="padding-top: 39px;"></div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
        smhCM.loadThumbs(id);
    },
    //Load Thumbnails table
    loadThumbs: function (id) {
        var thumb_results = new Array();

        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            $('#thumb-data_processing').css('display', 'none');
            var myData = results['objects'];
            var i = 0;
            $.each(myData, function (key, value) {
                var dimensions = value['width'] + ' X ' + value['height'];
                var size = Math.floor(value['size'] / 1024);
                var actions, image, default_thumb;

                if (value['tags'] == "default_thumb") {
                    image = "<div style='height: 100px;'><span class='helper'></span><img src='https://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/ks/" + sessInfo.ks + "/thumbAssetId/" + value['id'] + "' style='width: 130px; max-height: 100px; vertical-align: middle;' /></div>";
                    default_thumb = '<i style="color: #676a6c; width: 100%; text-align: center;" class="fa fa-check-square-o"></i>';
                    actions = '<span class="dropdown header">' +
                            '<div class="btn-group">' +
                            '<button class="btn btn-default" type="button"><span class="text">Select Action</span></button>' +
                            '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                            '<li role="presentation"><a href="https://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/thumbAssetId/' + value['id'] + '/options:download/true" tabindex="-1" role="menuitem">Download</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</span>';
                } else {
                    image = "<div style='height: 100px;'><span class='helper'></span><img src='https://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/ks/" + sessInfo.ks + "/thumbAssetId/" + value['id'] + "' style='width: 130px; max-height: 100px; vertical-align: middle;' /></div>";
                    default_thumb = '';
                    actions = '<span class="dropdown header">' +
                            '<div class="btn-group">' +
                            '<button class="btn btn-default" type="button"><span class="text">Select Action</span></button>' +
                            '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                            '<li role="presentation"><a onclick="smhCM.setThumbdefault(\'' + value['id'] + '\',\'' + id + '\')" tabindex="-1" role="menuitem">Set as Default</a></li>' +
                            '<li role="presentation"><a href="https://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/thumbAssetId/' + value['id'] + '/options:download/true" tabindex="-1" role="menuitem">Download</a></li>' +
                            '<li role="presentation"><a onclick="smhCM.deleteThumbModal(\'' + value['id'] + '\',\'' + id + '\')" tabindex="-1" role="menuitem">Delete</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</span>';
                }
                thumb_results[i] = new Array(image, dimensions, size, default_thumb, actions);
                i++;
            });

            $('#thumb-table').empty();
            $('#thumb-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="thumb-data"></table>');
            $('#thumb-data').DataTable({
                "dom": 'R<"H"lfr>t<"F"ip>',
                "order": [],
                "ordering": false,
                "jQueryUI": false,
                "autoWidth": false,
                "pagingType": "bootstrap",
                "pageLength": 10,
                "searching": false,
                "processing": true,
                "info": false,
                "lengthChange": false,
                "data": thumb_results,
                "language": {
                    "zeroRecords": "No Thumbnails Found"
                },
                "columns": [
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Thumbnail</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Dimensions</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Size (KB)</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Default</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                        "width": "170px"
                    },
                ],
                "drawCallback": function (oSettings) {
                    smhMain.fcmcAddRows(this, 5, 4);
                }
            });
        }

        $('#thumb-data_processing').css('display', 'inline');
        var filter = new KalturaThumbAssetFilter();
        filter.orderBy = "tags";
        filter.entryIdEqual = id;
        filter.statusEqual = KalturaThumbAssetStatus.READY;
        var pager;
        client.thumbAsset.listAction(cb, filter, pager);
    },
    //Upload thumbnail
    uploadThumb: function (vid) {
        entryId = vid;
        $('#thumbUp input').click();
    },
    //Set thumbnail as default
    setThumbdefault: function (thumb_id, entry_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhCM.displayThumbResults(entry_id);

            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#thumb-data_processing').css('display', 'inline');
        client.thumbAsset.setAsDefault(cb, thumb_id);
    },
    displayThumbResults: function (entry_id) {
        smhCM.purgeCache('thumbnail');
        $('#thumb-data_processing').css('display', 'none');
        smhCM.loadThumbs(entry_id);
        smhCM.updateThumbImage(entry_id);
        smhCM.refresh_schedule();

    },
    updateThumbImage: function (entry_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#thumb_channel').attr('src', results.thumbnailUrl + '/quality/100/type/1/width/300/height/168');
        };
        var version = null;
        client.baseEntry.get(cb, entry_id, version);
    },
    //Delete Thumbnail modal
    deleteThumbModal: function (thumb_id, entry_id) {
        var header, content, footer;
        $('.smh-dialog3').css('width', '415px');
        $('#smh-modal3').modal({
            backdrop: 'static'
        });
        $('#smh-modal3').css('z-index', '2000');
        $('#smh-modal2').css('z-index', '3');

        header = '<button type="button" class="close smh-close3" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Thumbnail</h4>';
        $('#smh-modal3 .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Are you sure you want to delete the selected thumbnail?</div>';
        $('#smh-modal3 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close3" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ac" onclick="smhCM.deleteThumb(\'' + thumb_id + '\',\'' + entry_id + '\')">Delete</button>';
        $('#smh-modal3 .modal-footer').html(footer);
    },
    //Do Delete Thumbnail
    deleteThumb: function (thumb_id, entry_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                $('#smh-modal3 #loading img').css('display', 'none');
                $('#smh-modal3 .smh-close3').click();
                smhCM.loadThumbs(entry_id);
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#smh-modal3 #loading img').css('display', 'inline-block');
        client.thumbAsset.deleteAction(cb, thumb_id);
    },
    purgeCache: function (asset) {
        var response = false;
        var sessData = {
            action: 'purge_cache',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            asset: asset
        }

        $.ajax({
            cache: false,
            url: CacheApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data['success']) {
                    response = true;
                }
            }
        });
        return response;
    },
    createChannel: function () {
        var valid = validator.form();
        if (valid) {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                smhCM.refresh_schedule();
                $('#smh-modal #loading img').css('display', 'none');
                $('#smh-modal #pass-result').html('<span class="label label-success">Channel Successfully Created!</span>');
                setTimeout(function () {
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal #add-channel').removeAttr('disabled');
                    $('#smh-modal').modal('hide');
                }, 3000);

            };

            $('#smh-modal #loading img').css('display', 'inline-block');
            $('#smh-modal #add-channel').attr('disabled', '');
            var name = $('#smh-modal #ch_name').val();
            var desc = $('#smh-modal #ch_desc').val();
            var tags = $('#smh-modal #ch_tags').val();
            var ref = $('#smh-modal #ch_ref').val();
            var cat = $('#smh-modal #ch_cat').val();
            var ac = $('#smh-modal #ac-select').val();

            var liveChannel = new KalturaLiveChannel();
            if (!(typeof desc === "undefined") && !(desc === null) && desc.length > 0) {
                liveChannel.description = desc;
            }
            if (!(typeof tags === "undefined") && !(tags === null) && tags.length > 0) {
                liveChannel.tags = tags;
            }
            if (!(typeof ref === "undefined") && !(ref === null) && ref.length > 0) {
                liveChannel.referenceId = ref;
            }
            if (!(typeof cat === "undefined") && !(cat === null) && cat.length > 0) {
                liveChannel.categories = cat;
            }
            if (!(typeof ac === "undefined") && !(ac === null) && ac.length > 0 && ac > 0) {
                liveChannel.accessControlId = ac;
            }

            var channel_sort_number = $('.dhx_cal_data .dhx_matrix_scell').length + 1
            liveChannel.name = name;
            liveChannel.partnerSortValue = channel_sort_number;
            client.liveChannel.add(cb, liveChannel);
        }
    },
    //Select categories modal
    selectCat: function () {
        smhCM.resetModal2();

        var header, content, footer;
        $('.smh-dialog2').css('width', '350px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1000');

        var tree = '<div style="margin-left: auto; margin-right: auto; width: 135px; font-weight: bold; margin-top: 50px;">No Categories found</div>';
        var apply_button = '';
        if (categories.length > 0) {
            tree = smhCM.json_tree(categories, 'cat');
            apply_button = '<button type="button" class="btn btn-primary" onclick="smhCM.applyCat();">Apply</button>'
        }
        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select Categories</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div id="catselect-wrapper">' +
                '<div id="tree3">' +
                '<div class="cat-options">' +
                tree +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>' + apply_button;
        $('#smh-modal2 .modal-footer').html(footer);

        if (categories.length > 0) {
            $('#catselect-wrapper #tree3').tree({
                collapseDuration: 100,
                expandDuration: 100,
                onCheck: {
                    ancestors: null
                }
            });
            $('#catselect-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });
        }
    },
    //Inserts Categories
    applyCat: function () {
        var catIDs = [];
        $('#smh-modal2 .cat-options input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                var checkbox_value = $(this).val();
                catIDs.push(cats[checkbox_value]);
            }
        });
        $('#smh-modal #ch_cat').val(catIDs.join(','));
        $('#smh-modal2 .smh-close2').click();
    },
    addChannelX: function () {
        smhMain.resetModal();
        smhCM.resetModal();
        smhCM.resetFilters();
        var header, content, footer;
        $('.smh-dialog').css('width', '985px');
        $('#smh-modal .modal-body').css('height', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close mplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Channel</h4>';
        $('#smh-modal .modal-header').html(header);

        var tree = smhCM.json_tree(categories, 'cat');
        var tree_ac = smhCM.json_tree(ac, 'ac');
        var tree_flavors = smhCM.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-manual-plist" action="">' +
                '<table width="98%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="channel_name" name="channel_name"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="channel_desc" name="channel_desc"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left;">Entries</div>' +
                '<span class="dropdown header dropdown-accordion">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default filter-btn"><span class="text">Filters</span></button>' +
                '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                '<li role="presentation">' +
                '<div class="panel-group" id="accordion">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a href="#collapseOne" data-toggle="collapse" data-parent="#accordion">' +
                'Filter by Categories' +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse in" id="collapseOne">' +
                '<div class="panel-body">' +
                '<div id="tree1">' +
                '<div class="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body cat-filter">' +
                tree +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a href="#collapseTwo" data-toggle="collapse" data-parent="#accordion">' +
                'Additional Filters' +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse" id="collapseTwo">' +
                '<div class="panel-body">' +
                '<div id="tree2">' +
                '<div id="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="media_all" checked> <b>All Media Types</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body media-filter">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="1" class="media_list"> Video</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="5" class="media_list"> Audio</label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="durations_all" checked> <b>All Durations</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body duration-filter">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="short" class="duration_list"> Short (0-4 min.)</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="medium" class="duration_list"> Medium (4-20 min.)</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="long" class="duration_list"> Long (20+ min.)</label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="clipped_all" checked> <b>All Original & Clipped Entries</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body clipped-filter">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="1" class="clipped_list"> Original Entries</label></div>' +
                '</li>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="0" class="clipped_list"> Clipped Entries</label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body ac-filter">' +
                tree_ac +
                '</div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="flavors_all" checked> <b>All Flavors</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body flavors-filter">' +
                tree_flavors +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '</div>' +
                '</div>' +
                '<div id="playlist-wrapper">' +
                '<div class="header" style="text-align: left;">' +
                'Channel' +
                '<div style="text-align: right; font-size: 12px; color: #868991; margin-bottom: 6px;"><div style="display: inline-block; position: relative; right: 168px;">Drag And Drop Your Entries Below</div><div id="drag-drop-icon"><i class="fa fa-arrow-down"></i></div><div id="drag-drop-elip"><i class="fa fa-ellipsis-h"></i></div><div id="drag-drop-icon"><i class="fa fa-arrows"></i></div></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="plist-entries"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default mplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="add-channel" onclick="smhCM.createChannel()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal #plist-entries').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhCM.loadEntries_manual_plist();
        });
        $('#smh-modal #tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal .cat_all').prop('checked', false);
                } else {
                    $('#smh-modal .cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhCM.loadEntries_manual_plist();
            }, 100);
        });

        $('#smh-modal #tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhCM.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('#smh-modal .media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .media_all').prop('checked', false);
            } else {
                $('#smh-modal .media_all').prop('checked', true);
            }
            smhCM.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('.duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhCM.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('#smh-modal .duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .durations_all').prop('checked', false);
            } else {
                $('#smh-modal .durations_all').prop('checked', true);
            }
            smhCM.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhCM.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('#smh-modal .clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .clipped_all').prop('checked', false);
            } else {
                $('#smh-modal .clipped_all').prop('checked', true);
            }
            smhCM.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhCM.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#smh-modal .ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .ac_all').prop('checked', false);
            } else {
                $('#smh-modal .ac_all').prop('checked', true);
            }
            smhCM.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhCM.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('#smh-modal .flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .flavors_all').prop('checked', false);
            } else {
                $('#smh-modal .flavors_all').prop('checked', true);
            }
            smhCM.loadEntries_manual_plist();
        });

        // Collapse accordion every time dropdown is shown
        $('#smh-modal .dropdown-accordion').on('show.bs.dropdown', function (event) {
            var accordion = $(this).find($(this).data('accordion'));
            accordion.find('.panel-collapse.in').collapse('hide');
        });

        // Prevent dropdown to be closed when we click on an accordion link
        $('#smh-modal .dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $($(this).data('parent')).find('.panel-collapse.in').collapse('hide');
            $($(this).attr('href')).collapse('show');
        });

        $('#smh-modal .dropdown-accordion').on('click', '.panel-body', function (event) {
            event.stopPropagation();
        });

        $('#smh-modal #tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal #tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal #entries-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#create-manual-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-manual-plist").validate({
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
                channel_name: {
                    required: true
                }
            },
            messages: {
                channel_name: {
                    required: 'Please enter a name'
                }
            }
        });
        smhCM.loadEntries_manual_plist();

    },
    createChannelX: function () {
        var valid = validator.form();
        if (valid) {
            var clist_arr = [];
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                clist_arr.push($(this).attr("data-entryid"));
            });

            if (clist_arr.length > 0) {
                var name = $('#create-manual-plist #channel_name').val();
                var desc = $('#create-manual-plist #channel_desc').val();
                var channelContent = clist_arr.join(";");

                var sessData = {
                    pid: sessInfo.pid,
                    ks: sessInfo.ks,
                    action: 'add_channel',
                    eids: channelContent,
                    name: name,
                    desc: desc
                }

                $.ajax({
                    cache: false,
                    url: ApiUrl,
                    type: 'POST',
                    data: sessData,
                    dataType: 'json',
                    beforeSend: function () {
                        $('#add-channel').attr('disabled', '');
                        $('#smh-modal #loading img').css('display', 'inline-block');
                    },
                    success: function (data) {
                        if (data['success']) {
                            smhCM.getChannels();
                            $('#smh-modal #loading img').css('display', 'none');
                            $('#smh-modal #pass-result').html('<span class="label label-success">Channel Successfully Created!</span>');
                            setTimeout(function () {
                                $('#smh-modal #pass-result').empty();
                                $('#add-channel').removeAttr('disabled');
                                $('#smh-modal').modal('hide');
                            }, 3000);
                        } else {
                            $('#smh-modal #loading img').css('display', 'none');
                            $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                        }
                    }
                });
            } else {
                smhCM.noClist();
            }
        }
    },
    //No channel segments modal
    noClist: function () {
        smhCM.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '340px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Channel Segments</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must add at least one entry to the channel</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');
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
        $('#smh-modal2 .modal-footer').removeClass('menu-expand-footer');
        $('#smh-modal .modal-footer').removeClass('channel-menu-expand-footer');

    },
    resetModal2: function () {
        $('#smh-modal2 .modal-header').empty();
        $('#smh-modal2 .modal-body').empty();
        $('#smh-modal2 .modal-footer').empty();
        $('#smh-modal2 .modal-content').css('min-height', '');
        $('#smh-modal2 .smh-dialog2').css('width', '');
        $('#smh-modal2 .modal-body').css('height', '');
        $('#smh-modal2 .modal-body').css('padding', '15px');
        $('#smh-modal2 .modal-footer').removeClass('menu-expand-footer');
        $('#smh-modal .modal-footer').removeClass('menu-expand-footer');

    },
    //Creates unordered tree
    json_tree: function (data, type) {
        var json = '<ul>';
        for (var i = 0; i < data.length; ++i) {
            if (data[i].children.length) {
                json = json + '<li class="collapsed"><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
                json = json + smhCM.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Load Entries
    loadEntries_manual_plist: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal #plist-table').empty();
        $('#smh-modal #plist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="plist-data"></table>');
        manualTable = $('#smh-modal #plist-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "scrollCollapse": true,
            "scrollY": "511px",
            "ajax": {
                "url": "/api/v1/getChannel_Entries",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "category": categories_id,
                        "mediaType": mediaTypes_id,
                        "duration": durations,
                        "clipped": clipped_id,
                        "ac": ac_id,
                        "flavors": flavors_id
                    });
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><div class='data-break'>Channels</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 1, 10);
                $('#smh-modal #plist-data .entry-wrapper').draggable({
                    appendTo: '#plist-entries',
                    containment: 'window',
                    scroll: false,
                    helper: 'clone',
                    zIndex: 1000,
                    connectToSortable: "#plist-entries .mCSB_container",
                    cursorAt: {
                        left: 200,
                        top: 85
                    }
                });
                $('#smh-modal #plist-entries').droppable({
                    accept: '#plist-data .entry-wrapper',
                    drop: function (event, ui) {
                        $('#plist-entries .mCSB_container').append($(ui.helper).clone());
                        $('#plist-entries .entry-wrapper').css('position', '');
                        $('#plist-entries .entry-wrapper').css('top', '');
                        $('#plist-entries .entry-wrapper').css('left', '');
                        $('#plist-entries .entry-wrapper').addClass('hover');
                        $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        var duration = 0;
                        $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                            duration += Number($(this).attr("data-duration"));
                        });
                        var final_duration = smhCM.convertToHHMM(duration);
                        $('#playlist-info #duration').html(final_duration);
                    }
                });
                $("#smh-modal #plist-entries .mCSB_container").sortable({
                    placeholder: "plist-hightlight",
                    helper: 'clone',
                    start: function (e, ui) {
                        $('#plist-entries .entry-wrapper').addClass('hover');
                    },
                    stop: function (e, ui) {
                        $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        var duration = 0;
                        $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                            duration += Number($(this).attr("data-duration"));
                        });
                        var final_duration = smhCM.convertToHHMM(duration);
                        $('#playlist-info #duration').html(final_duration);
                    }
                });
            }
        });
        $('#smh-modal #plist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Get Access Control Profiles
    getAccessControlProfiles: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var ac_arr = [];
                $.each(results.objects, function (index, value) {
                    ac_select[value.id] = value.name
                    var ac_obj = {};
                    ac_obj['id'] = value.id;
                    ac_obj['name'] = value.name;
                    ac_obj['parentId'] = 0;
                    ac_obj['children'] = [];
                    ac_arr.push(ac_obj);
                });
                ac = ac_arr;
                smhCM.addAC();
            }
        };

        var filter = null;
        var pager = null;
        client.accessControlProfile.listAction(cb, filter, pager);
    },
    //Get Conversion Profiles
    getFlavors: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var flavors_arr = [];
                $.each(results.objects, function (index, value) {
                    var flavors_obj = {};
                    flavors_obj['id'] = value.id;
                    flavors_obj['name'] = value.name;
                    flavors_obj['parentId'] = 0;
                    flavors_obj['children'] = [];
                    flavors_arr.push(flavors_obj);
                });
                flavors = flavors_arr;
            }
        };

        var pager = null;
        var filter = null;
        client.flavorParams.listAction(cb, filter, pager);
    },
    //Get Categories
    getCats: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var categories_arr = [];
                $.each(results.objects, function (index, value) {
                    cats[value.id] = value.fullName;
                    var cat_arr = {};
                    cat_arr['id'] = value.id;
                    cat_arr['parentId'] = value.parentId;
                    cat_arr['name'] = value.name;
                    cat_arr['partnerSortValue'] = value.partnerSortValue;
                    categories_arr.push(cat_arr);
                });
                categories_arr.sort(function (a, b) {
                    return a.partnerSortValue - b.partnerSortValue;
                });
                categories_data = categories_arr;
                categories = smhCM.getNestedChildren(categories_arr, 0);
                smhCM.addCats();
            }
        };

        var filter = new KalturaCategoryFilter();
        filter.orderBy = "+name";
        var pager = null;
        client.category.listAction(cb, filter, pager);
    },
    //Adds filter categories
    addCats: function () {
        var tree = smhCM.json_tree(categories, 'cat');
        $('.cat-filter').html(tree);
        $('.dropdown-filter #tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });
        $('#users-buttons .dropdown-filter .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        // Collapse accordion every time dropdown is shown
        $('#users-buttons .dropdown-accordion').on('show.bs.dropdown', function (event) {
            var accordion = $(this).find($(this).data('accordion'));
            accordion.find('.panel-collapse.in').collapse('hide');
        });

        // Prevent dropdown to be closed when we click on an accordion link
        $('#users-buttons .dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $($(this).data('parent')).find('.panel-collapse.in').collapse('hide');
            $($(this).attr('href')).collapse('show');
        });

        $('#users-buttons .dropdown-accordion').on('click', '.panel-body', function (event) {
            event.stopPropagation();
        });

        $('#users-buttons .dropdown-filter #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhCM.refresh_schedule();
        });
        $('#users-buttons .dropdown-filter #tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#users-buttons .dropdown-filter .cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#users-buttons .dropdown-filter .cat_all').prop('checked', false);
                } else {
                    $('#users-buttons .dropdown-filter .cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhCM.refresh_schedule();
            }, 100);
        });
    },
    //Adds Access Control Filter
    addAC: function () {
        var tree_ac = smhCM.json_tree(ac, 'ac');
        $('.ac-filter').html(tree_ac);
        $('.dropdown-filter #tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });
        $('#users-buttons .dropdown-filter .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        $('#users-buttons .dropdown-filter #tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhCM.refresh_schedule();
        });
        $('#users-buttons .dropdown-filter #tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#users-buttons .dropdown-filter .ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#users-buttons .dropdown-filter .ac_all').prop('checked', false);
            } else {
                $('#users-buttons .dropdown-filter .ac_all').prop('checked', true);
            }
            smhCM.refresh_schedule();
        });
    },
    //Removes drag and drop icon
    removeDND: function (div) {
        $(div).parent("div").remove();
        $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
        var duration = 0;
        $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
            duration += Number($(this).attr("data-duration"));
        });
        var final_duration = smhCM.convertToHHMM(duration);
        $('#playlist-info #duration').html(final_duration);
    },
    //Creates nested children
    getNestedChildren: function (arr, parentId) {
        var out = []
        for (var i in arr) {
            if (arr[i].parentId == parentId) {
                var children = smhCM.getNestedChildren(arr, arr[i].id)

                if (children.length) {
                    arr[i].children = children
                } else {
                    arr[i].children = []
                }
                out.push(arr[i])
            }
        }
        return out
    },
    convertToHHMM: function (secs) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = secs - (hr * 3600) - (min * 60);
        return ((hr < 10) && (hr > 0) ? "0" + hr + ':' : ((hr == 0) ? "" : hr + ':')) + ((min < 10) && (min > 0) ? "0" + min + ':' : ((min == 0) ? "00:" : min + ':')) + ((sec < 10) && (sec > 0) ? "0" + sec : ((sec == 0) ? "00" : sec));
    },
    resetFilters: function () {
        categoryIDs = [];
        mediaTypes = [];
        duration = [];
        clipped = [];
        ac_filter = [];
        flavors_filter = [];
        limit = 20;
        order = '-recent';
    },
    secondsTimeSpanToHMS: function (s) {
        var h = Math.floor(s / 3600); //Get whole hours
        s -= h * 3600;
        var m = Math.floor(s / 60); //Get remaining minutes
        s -= m * 60;
        return (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
    },
    hmsToSeconds: function (hms) {
        var a = hms.split(':'); // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        return seconds;
    },
    getTimeZone: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'get_timezone',
            tz: tz
        }

        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['success']) {
                    your_timezone = data['timezone'];
                    $('#time-zone').html(time_zones[data['timezone']]);
                }
            }
        });
    },
    changeZone: function () {
        smhCM.resetModal();
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '495px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Update Time Zone</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="text-align: center;margin-top: 15px;height: 29px;width: auto;">Use the dropdown below to update your time zone.</div>' +
                '<div class="col-md-12">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-3 control-label" style="padding-left: 0px;">Time Zone:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<select class="form-control" id="time-zone" style="margin: auto; width: 294px;"><option value="Africa/Abidjan">( GMT +0 ) Africa/Abidjan</option><option value="Africa/Accra">( GMT +0 ) Africa/Accra</option><option value="Africa/Addis_Ababa">( GMT +3 ) Africa/Addis_Ababa</option><option value="Africa/Algiers">( GMT +1 ) Africa/Algiers</option><option value="Africa/Asmara">( GMT +3 ) Africa/Asmara</option><option value="Africa/Bamako">( GMT +0 ) Africa/Bamako</option><option value="Africa/Bangui">( GMT +1 ) Africa/Bangui</option><option value="Africa/Banjul">( GMT +0 ) Africa/Banjul</option><option value="Africa/Bissau">( GMT +0 ) Africa/Bissau</option><option value="Africa/Blantyre">( GMT +2 ) Africa/Blantyre</option><option value="Africa/Brazzaville">( GMT +1 ) Africa/Brazzaville</option><option value="Africa/Bujumbura">( GMT +2 ) Africa/Bujumbura</option><option value="Africa/Cairo">( GMT +2 ) Africa/Cairo</option><option value="Africa/Casablanca">( GMT +1 ) Africa/Casablanca</option><option value="Africa/Ceuta">( GMT +2 ) Africa/Ceuta</option><option value="Africa/Conakry">( GMT +0 ) Africa/Conakry</option><option value="Africa/Dakar">( GMT +0 ) Africa/Dakar</option><option value="Africa/Dar_es_Salaam">( GMT +3 ) Africa/Dar_es_Salaam</option><option value="Africa/Djibouti">( GMT +3 ) Africa/Djibouti</option><option value="Africa/Douala">( GMT +1 ) Africa/Douala</option><option value="Africa/El_Aaiun">( GMT +1 ) Africa/El_Aaiun</option><option value="Africa/Freetown">( GMT +0 ) Africa/Freetown</option><option value="Africa/Gaborone">( GMT +2 ) Africa/Gaborone</option><option value="Africa/Harare">( GMT +2 ) Africa/Harare</option><option value="Africa/Johannesburg">( GMT +2 ) Africa/Johannesburg</option><option value="Africa/Juba">( GMT +3 ) Africa/Juba</option><option value="Africa/Kampala">( GMT +3 ) Africa/Kampala</option><option value="Africa/Khartoum">( GMT +3 ) Africa/Khartoum</option><option value="Africa/Kigali">( GMT +2 ) Africa/Kigali</option><option value="Africa/Kinshasa">( GMT +1 ) Africa/Kinshasa</option><option value="Africa/Lagos">( GMT +1 ) Africa/Lagos</option><option value="Africa/Libreville">( GMT +1 ) Africa/Libreville</option><option value="Africa/Lome">( GMT +0 ) Africa/Lome</option><option value="Africa/Luanda">( GMT +1 ) Africa/Luanda</option><option value="Africa/Lubumbashi">( GMT +2 ) Africa/Lubumbashi</option><option value="Africa/Lusaka">( GMT +2 ) Africa/Lusaka</option><option value="Africa/Malabo">( GMT +1 ) Africa/Malabo</option><option value="Africa/Maputo">( GMT +2 ) Africa/Maputo</option><option value="Africa/Maseru">( GMT +2 ) Africa/Maseru</option><option value="Africa/Mbabane">( GMT +2 ) Africa/Mbabane</option><option value="Africa/Mogadishu">( GMT +3 ) Africa/Mogadishu</option><option value="Africa/Monrovia">( GMT +0 ) Africa/Monrovia</option><option value="Africa/Nairobi">( GMT +3 ) Africa/Nairobi</option><option value="Africa/Ndjamena">( GMT +1 ) Africa/Ndjamena</option><option value="Africa/Niamey">( GMT +1 ) Africa/Niamey</option><option value="Africa/Nouakchott">( GMT +0 ) Africa/Nouakchott</option><option value="Africa/Ouagadougou">( GMT +0 ) Africa/Ouagadougou</option><option value="Africa/Porto-Novo">( GMT +1 ) Africa/Porto-Novo</option><option value="Africa/Sao_Tome">( GMT +0 ) Africa/Sao_Tome</option><option value="Africa/Tripoli">( GMT +2 ) Africa/Tripoli</option><option value="Africa/Tunis">( GMT +1 ) Africa/Tunis</option><option value="Africa/Windhoek">( GMT +2 ) Africa/Windhoek</option><option value="America/Adak">( GMT -9 ) America/Adak</option><option value="America/Anchorage">( GMT -8 ) America/Anchorage</option><option value="America/Anguilla">( GMT -4 ) America/Anguilla</option><option value="America/Antigua">( GMT -4 ) America/Antigua</option><option value="America/Araguaina">( GMT -3 ) America/Araguaina</option><option value="America/Argentina/Buenos_Aires">( GMT -3 ) America/Argentina/Buenos_Aires</option><option value="America/Argentina/Catamarca">( GMT -3 ) America/Argentina/Catamarca</option><option value="America/Argentina/Cordoba">( GMT -3 ) America/Argentina/Cordoba</option><option value="America/Argentina/Jujuy">( GMT -3 ) America/Argentina/Jujuy</option><option value="America/Argentina/La_Rioja">( GMT -3 ) America/Argentina/La_Rioja</option><option value="America/Argentina/Mendoza">( GMT -3 ) America/Argentina/Mendoza</option><option value="America/Argentina/Rio_Gallegos">( GMT -3 ) America/Argentina/Rio_Gallegos</option><option value="America/Argentina/Salta">( GMT -3 ) America/Argentina/Salta</option><option value="America/Argentina/San_Juan">( GMT -3 ) America/Argentina/San_Juan</option><option value="America/Argentina/San_Luis">( GMT -3 ) America/Argentina/San_Luis</option><option value="America/Argentina/Tucuman">( GMT -3 ) America/Argentina/Tucuman</option><option value="America/Argentina/Ushuaia">( GMT -3 ) America/Argentina/Ushuaia</option><option value="America/Aruba">( GMT -4 ) America/Aruba</option><option value="America/Asuncion">( GMT -3 ) America/Asuncion</option><option value="America/Atikokan">( GMT -5 ) America/Atikokan</option><option value="America/Bahia">( GMT -3 ) America/Bahia</option><option value="America/Bahia_Banderas">( GMT -5 ) America/Bahia_Banderas</option><option value="America/Barbados">( GMT -4 ) America/Barbados</option><option value="America/Belem">( GMT -3 ) America/Belem</option><option value="America/Belize">( GMT -6 ) America/Belize</option><option value="America/Blanc-Sablon">( GMT -4 ) America/Blanc-Sablon</option><option value="America/Boa_Vista">( GMT -4 ) America/Boa_Vista</option><option value="America/Bogota">( GMT -5 ) America/Bogota</option><option value="America/Boise" selected="selected">( GMT -6 ) America/Boise</option><option value="America/Cambridge_Bay">( GMT -6 ) America/Cambridge_Bay</option><option value="America/Campo_Grande">( GMT -4 ) America/Campo_Grande</option><option value="America/Cancun">( GMT -5 ) America/Cancun</option><option value="America/Caracas">( GMT -4 ) America/Caracas</option><option value="America/Cayenne">( GMT -3 ) America/Cayenne</option><option value="America/Cayman">( GMT -5 ) America/Cayman</option><option value="America/Chicago">( GMT -5 ) America/Chicago</option><option value="America/Chihuahua">( GMT -6 ) America/Chihuahua</option><option value="America/Costa_Rica">( GMT -6 ) America/Costa_Rica</option><option value="America/Creston">( GMT -7 ) America/Creston</option><option value="America/Cuiaba">( GMT -4 ) America/Cuiaba</option><option value="America/Curacao">( GMT -4 ) America/Curacao</option><option value="America/Danmarkshavn">( GMT +0 ) America/Danmarkshavn</option><option value="America/Dawson">( GMT -7 ) America/Dawson</option><option value="America/Dawson_Creek">( GMT -7 ) America/Dawson_Creek</option><option value="America/Denver">( GMT -6 ) America/Denver</option><option value="America/Detroit">( GMT -4 ) America/Detroit</option><option value="America/Dominica">( GMT -4 ) America/Dominica</option><option value="America/Edmonton">( GMT -6 ) America/Edmonton</option><option value="America/Eirunepe">( GMT -5 ) America/Eirunepe</option><option value="America/El_Salvador">( GMT -6 ) America/El_Salvador</option><option value="America/Fort_Nelson">( GMT -7 ) America/Fort_Nelson</option><option value="America/Fortaleza">( GMT -3 ) America/Fortaleza</option><option value="America/Glace_Bay">( GMT -3 ) America/Glace_Bay</option><option value="America/Godthab">( GMT -2 ) America/Godthab</option><option value="America/Goose_Bay">( GMT -3 ) America/Goose_Bay</option><option value="America/Grand_Turk">( GMT -4 ) America/Grand_Turk</option><option value="America/Grenada">( GMT -4 ) America/Grenada</option><option value="America/Guadeloupe">( GMT -4 ) America/Guadeloupe</option><option value="America/Guatemala">( GMT -6 ) America/Guatemala</option><option value="America/Guayaquil">( GMT -5 ) America/Guayaquil</option><option value="America/Guyana">( GMT -4 ) America/Guyana</option><option value="America/Halifax">( GMT -3 ) America/Halifax</option><option value="America/Havana">( GMT -4 ) America/Havana</option><option value="America/Hermosillo">( GMT -7 ) America/Hermosillo</option><option value="America/Indiana/Indianapolis">( GMT -4 ) America/Indiana/Indianapolis</option><option value="America/Indiana/Knox">( GMT -5 ) America/Indiana/Knox</option><option value="America/Indiana/Marengo">( GMT -4 ) America/Indiana/Marengo</option><option value="America/Indiana/Petersburg">( GMT -4 ) America/Indiana/Petersburg</option><option value="America/Indiana/Tell_City">( GMT -5 ) America/Indiana/Tell_City</option><option value="America/Indiana/Vevay">( GMT -4 ) America/Indiana/Vevay</option><option value="America/Indiana/Vincennes">( GMT -4 ) America/Indiana/Vincennes</option><option value="America/Indiana/Winamac">( GMT -4 ) America/Indiana/Winamac</option><option value="America/Inuvik">( GMT -6 ) America/Inuvik</option><option value="America/Iqaluit">( GMT -4 ) America/Iqaluit</option><option value="America/Jamaica">( GMT -5 ) America/Jamaica</option><option value="America/Juneau">( GMT -8 ) America/Juneau</option><option value="America/Kentucky/Louisville">( GMT -4 ) America/Kentucky/Louisville</option><option value="America/Kentucky/Monticello">( GMT -4 ) America/Kentucky/Monticello</option><option value="America/Kralendijk">( GMT -4 ) America/Kralendijk</option><option value="America/La_Paz">( GMT -4 ) America/La_Paz</option><option value="America/Lima">( GMT -5 ) America/Lima</option><option value="America/Los_Angeles">( GMT -7 ) America/Los_Angeles</option><option value="America/Lower_Princes">( GMT -4 ) America/Lower_Princes</option><option value="America/Maceio">( GMT -3 ) America/Maceio</option><option value="America/Managua">( GMT -6 ) America/Managua</option><option value="America/Manaus">( GMT -4 ) America/Manaus</option><option value="America/Marigot">( GMT -4 ) America/Marigot</option><option value="America/Martinique">( GMT -4 ) America/Martinique</option><option value="America/Matamoros">( GMT -5 ) America/Matamoros</option><option value="America/Mazatlan">( GMT -6 ) America/Mazatlan</option><option value="America/Menominee">( GMT -5 ) America/Menominee</option><option value="America/Merida">( GMT -5 ) America/Merida</option><option value="America/Metlakatla">( GMT -8 ) America/Metlakatla</option><option value="America/Mexico_City">( GMT -5 ) America/Mexico_City</option><option value="America/Miquelon">( GMT -2 ) America/Miquelon</option><option value="America/Moncton">( GMT -3 ) America/Moncton</option><option value="America/Monterrey">( GMT -5 ) America/Monterrey</option><option value="America/Montevideo">( GMT -3 ) America/Montevideo</option><option value="America/Montserrat">( GMT -4 ) America/Montserrat</option><option value="America/Nassau">( GMT -4 ) America/Nassau</option><option value="America/New_York">( GMT -4 ) America/New_York</option><option value="America/Nipigon">( GMT -4 ) America/Nipigon</option><option value="America/Nome">( GMT -8 ) America/Nome</option><option value="America/Noronha">( GMT -2 ) America/Noronha</option><option value="America/North_Dakota/Beulah">( GMT -5 ) America/North_Dakota/Beulah</option><option value="America/North_Dakota/Center">( GMT -5 ) America/North_Dakota/Center</option><option value="America/North_Dakota/New_Salem">( GMT -5 ) America/North_Dakota/New_Salem</option><option value="America/Ojinaga">( GMT -6 ) America/Ojinaga</option><option value="America/Panama">( GMT -5 ) America/Panama</option><option value="America/Pangnirtung">( GMT -4 ) America/Pangnirtung</option><option value="America/Paramaribo">( GMT -3 ) America/Paramaribo</option><option value="America/Phoenix">( GMT -7 ) America/Phoenix</option><option value="America/Port-au-Prince">( GMT -5 ) America/Port-au-Prince</option><option value="America/Port_of_Spain">( GMT -4 ) America/Port_of_Spain</option><option value="America/Porto_Velho">( GMT -4 ) America/Porto_Velho</option><option value="America/Puerto_Rico">( GMT -4 ) America/Puerto_Rico</option><option value="America/Rainy_River">( GMT -5 ) America/Rainy_River</option><option value="America/Rankin_Inlet">( GMT -5 ) America/Rankin_Inlet</option><option value="America/Recife">( GMT -3 ) America/Recife</option><option value="America/Regina">( GMT -6 ) America/Regina</option><option value="America/Resolute">( GMT -5 ) America/Resolute</option><option value="America/Rio_Branco">( GMT -5 ) America/Rio_Branco</option><option value="America/Santarem">( GMT -3 ) America/Santarem</option><option value="America/Santiago">( GMT -3 ) America/Santiago</option><option value="America/Santo_Domingo">( GMT -4 ) America/Santo_Domingo</option><option value="America/Sao_Paulo">( GMT -3 ) America/Sao_Paulo</option><option value="America/Scoresbysund">( GMT +0 ) America/Scoresbysund</option><option value="America/Sitka">( GMT -8 ) America/Sitka</option><option value="America/St_Barthelemy">( GMT -4 ) America/St_Barthelemy</option><option value="America/St_Johns">( GMT -3 ) America/St_Johns</option><option value="America/St_Kitts">( GMT -4 ) America/St_Kitts</option><option value="America/St_Lucia">( GMT -4 ) America/St_Lucia</option><option value="America/St_Thomas">( GMT -4 ) America/St_Thomas</option><option value="America/St_Vincent">( GMT -4 ) America/St_Vincent</option><option value="America/Swift_Current">( GMT -6 ) America/Swift_Current</option><option value="America/Tegucigalpa">( GMT -6 ) America/Tegucigalpa</option><option value="America/Thule">( GMT -3 ) America/Thule</option><option value="America/Thunder_Bay">( GMT -4 ) America/Thunder_Bay</option><option value="America/Tijuana">( GMT -7 ) America/Tijuana</option><option value="America/Toronto">( GMT -4 ) America/Toronto</option><option value="America/Tortola">( GMT -4 ) America/Tortola</option><option value="America/Vancouver">( GMT -7 ) America/Vancouver</option><option value="America/Whitehorse">( GMT -7 ) America/Whitehorse</option><option value="America/Winnipeg">( GMT -5 ) America/Winnipeg</option><option value="America/Yakutat">( GMT -8 ) America/Yakutat</option><option value="America/Yellowknife">( GMT -6 ) America/Yellowknife</option><option value="Antarctica/Casey">( GMT +8 ) Antarctica/Casey</option><option value="Antarctica/Davis">( GMT +7 ) Antarctica/Davis</option><option value="Antarctica/DumontDUrville">( GMT +10 ) Antarctica/DumontDUrville</option><option value="Antarctica/Macquarie">( GMT +11 ) Antarctica/Macquarie</option><option value="Antarctica/Mawson">( GMT +5 ) Antarctica/Mawson</option><option value="Antarctica/McMurdo">( GMT +13 ) Antarctica/McMurdo</option><option value="Antarctica/Palmer">( GMT -3 ) Antarctica/Palmer</option><option value="Antarctica/Rothera">( GMT -3 ) Antarctica/Rothera</option><option value="Antarctica/Syowa">( GMT +3 ) Antarctica/Syowa</option><option value="Antarctica/Troll">( GMT +2 ) Antarctica/Troll</option><option value="Antarctica/Vostok">( GMT +6 ) Antarctica/Vostok</option><option value="Arctic/Longyearbyen">( GMT +2 ) Arctic/Longyearbyen</option><option value="Asia/Aden">( GMT +3 ) Asia/Aden</option><option value="Asia/Almaty">( GMT +6 ) Asia/Almaty</option><option value="Asia/Amman">( GMT +3 ) Asia/Amman</option><option value="Asia/Anadyr">( GMT +12 ) Asia/Anadyr</option><option value="Asia/Aqtau">( GMT +5 ) Asia/Aqtau</option><option value="Asia/Aqtobe">( GMT +5 ) Asia/Aqtobe</option><option value="Asia/Ashgabat">( GMT +5 ) Asia/Ashgabat</option><option value="Asia/Baghdad">( GMT +3 ) Asia/Baghdad</option><option value="Asia/Bahrain">( GMT +3 ) Asia/Bahrain</option><option value="Asia/Baku">( GMT +4 ) Asia/Baku</option><option value="Asia/Bangkok">( GMT +7 ) Asia/Bangkok</option><option value="Asia/Barnaul">( GMT +7 ) Asia/Barnaul</option><option value="Asia/Beirut">( GMT +3 ) Asia/Beirut</option><option value="Asia/Bishkek">( GMT +6 ) Asia/Bishkek</option><option value="Asia/Brunei">( GMT +8 ) Asia/Brunei</option><option value="Asia/Chita">( GMT +9 ) Asia/Chita</option><option value="Asia/Choibalsan">( GMT +8 ) Asia/Choibalsan</option><option value="Asia/Colombo">( GMT +5 ) Asia/Colombo</option><option value="Asia/Damascus">( GMT +3 ) Asia/Damascus</option><option value="Asia/Dhaka">( GMT +6 ) Asia/Dhaka</option><option value="Asia/Dili">( GMT +9 ) Asia/Dili</option><option value="Asia/Dubai">( GMT +4 ) Asia/Dubai</option><option value="Asia/Dushanbe">( GMT +5 ) Asia/Dushanbe</option><option value="Asia/Gaza">( GMT +3 ) Asia/Gaza</option><option value="Asia/Hebron">( GMT +3 ) Asia/Hebron</option><option value="Asia/Ho_Chi_Minh">( GMT +7 ) Asia/Ho_Chi_Minh</option><option value="Asia/Hong_Kong">( GMT +8 ) Asia/Hong_Kong</option><option value="Asia/Hovd">( GMT +7 ) Asia/Hovd</option><option value="Asia/Irkutsk">( GMT +8 ) Asia/Irkutsk</option><option value="Asia/Jakarta">( GMT +7 ) Asia/Jakarta</option><option value="Asia/Jayapura">( GMT +9 ) Asia/Jayapura</option><option value="Asia/Jerusalem">( GMT +3 ) Asia/Jerusalem</option><option value="Asia/Kabul">( GMT +4 ) Asia/Kabul</option><option value="Asia/Kamchatka">( GMT +12 ) Asia/Kamchatka</option><option value="Asia/Karachi">( GMT +5 ) Asia/Karachi</option><option value="Asia/Kathmandu">( GMT +5 ) Asia/Kathmandu</option><option value="Asia/Khandyga">( GMT +9 ) Asia/Khandyga</option><option value="Asia/Kolkata">( GMT +5 ) Asia/Kolkata</option><option value="Asia/Krasnoyarsk">( GMT +7 ) Asia/Krasnoyarsk</option><option value="Asia/Kuala_Lumpur">( GMT +8 ) Asia/Kuala_Lumpur</option><option value="Asia/Kuching">( GMT +8 ) Asia/Kuching</option><option value="Asia/Kuwait">( GMT +3 ) Asia/Kuwait</option><option value="Asia/Macau">( GMT +8 ) Asia/Macau</option><option value="Asia/Magadan">( GMT +11 ) Asia/Magadan</option><option value="Asia/Makassar">( GMT +8 ) Asia/Makassar</option><option value="Asia/Manila">( GMT +8 ) Asia/Manila</option><option value="Asia/Muscat">( GMT +4 ) Asia/Muscat</option><option value="Asia/Nicosia">( GMT +3 ) Asia/Nicosia</option><option value="Asia/Novokuznetsk">( GMT +7 ) Asia/Novokuznetsk</option><option value="Asia/Novosibirsk">( GMT +7 ) Asia/Novosibirsk</option><option value="Asia/Omsk">( GMT +6 ) Asia/Omsk</option><option value="Asia/Oral">( GMT +5 ) Asia/Oral</option><option value="Asia/Phnom_Penh">( GMT +7 ) Asia/Phnom_Penh</option><option value="Asia/Pontianak">( GMT +7 ) Asia/Pontianak</option><option value="Asia/Pyongyang">( GMT +8 ) Asia/Pyongyang</option><option value="Asia/Qatar">( GMT +3 ) Asia/Qatar</option><option value="Asia/Qyzylorda">( GMT +6 ) Asia/Qyzylorda</option><option value="Asia/Rangoon">( GMT +6 ) Asia/Rangoon</option><option value="Asia/Riyadh">( GMT +3 ) Asia/Riyadh</option><option value="Asia/Sakhalin">( GMT +11 ) Asia/Sakhalin</option><option value="Asia/Samarkand">( GMT +5 ) Asia/Samarkand</option><option value="Asia/Seoul">( GMT +9 ) Asia/Seoul</option><option value="Asia/Shanghai">( GMT +8 ) Asia/Shanghai</option><option value="Asia/Singapore">( GMT +8 ) Asia/Singapore</option><option value="Asia/Srednekolymsk">( GMT +11 ) Asia/Srednekolymsk</option><option value="Asia/Taipei">( GMT +8 ) Asia/Taipei</option><option value="Asia/Tashkent">( GMT +5 ) Asia/Tashkent</option><option value="Asia/Tbilisi">( GMT +4 ) Asia/Tbilisi</option><option value="Asia/Tehran">( GMT +3 ) Asia/Tehran</option><option value="Asia/Thimphu">( GMT +6 ) Asia/Thimphu</option><option value="Asia/Tokyo">( GMT +9 ) Asia/Tokyo</option><option value="Asia/Tomsk">( GMT +7 ) Asia/Tomsk</option><option value="Asia/Ulaanbaatar">( GMT +8 ) Asia/Ulaanbaatar</option><option value="Asia/Urumqi">( GMT +6 ) Asia/Urumqi</option><option value="Asia/Ust-Nera">( GMT +10 ) Asia/Ust-Nera</option><option value="Asia/Vientiane">( GMT +7 ) Asia/Vientiane</option><option value="Asia/Vladivostok">( GMT +10 ) Asia/Vladivostok</option><option value="Asia/Yakutsk">( GMT +9 ) Asia/Yakutsk</option><option value="Asia/Yekaterinburg">( GMT +5 ) Asia/Yekaterinburg</option><option value="Asia/Yerevan">( GMT +4 ) Asia/Yerevan</option><option value="Atlantic/Azores">( GMT +0 ) Atlantic/Azores</option><option value="Atlantic/Bermuda">( GMT -3 ) Atlantic/Bermuda</option><option value="Atlantic/Canary">( GMT +1 ) Atlantic/Canary</option><option value="Atlantic/Cape_Verde">( GMT -1 ) Atlantic/Cape_Verde</option><option value="Atlantic/Faroe">( GMT +1 ) Atlantic/Faroe</option><option value="Atlantic/Madeira">( GMT +1 ) Atlantic/Madeira</option><option value="Atlantic/Reykjavik">( GMT +0 ) Atlantic/Reykjavik</option><option value="Atlantic/South_Georgia">( GMT -2 ) Atlantic/South_Georgia</option><option value="Atlantic/St_Helena">( GMT +0 ) Atlantic/St_Helena</option><option value="Atlantic/Stanley">( GMT -3 ) Atlantic/Stanley</option><option value="Australia/Adelaide">( GMT +10 ) Australia/Adelaide</option><option value="Australia/Brisbane">( GMT +10 ) Australia/Brisbane</option><option value="Australia/Broken_Hill">( GMT +10 ) Australia/Broken_Hill</option><option value="Australia/Currie">( GMT +11 ) Australia/Currie</option><option value="Australia/Darwin">( GMT +9 ) Australia/Darwin</option><option value="Australia/Eucla">( GMT +8 ) Australia/Eucla</option><option value="Australia/Hobart">( GMT +11 ) Australia/Hobart</option><option value="Australia/Lindeman">( GMT +10 ) Australia/Lindeman</option><option value="Australia/Lord_Howe">( GMT +11 ) Australia/Lord_Howe</option><option value="Australia/Melbourne">( GMT +11 ) Australia/Melbourne</option><option value="Australia/Perth">( GMT +8 ) Australia/Perth</option><option value="Australia/Sydney">( GMT +11 ) Australia/Sydney</option><option value="Europe/Amsterdam">( GMT +2 ) Europe/Amsterdam</option><option value="Europe/Andorra">( GMT +2 ) Europe/Andorra</option><option value="Europe/Astrakhan">( GMT +4 ) Europe/Astrakhan</option><option value="Europe/Athens">( GMT +3 ) Europe/Athens</option><option value="Europe/Belgrade">( GMT +2 ) Europe/Belgrade</option><option value="Europe/Berlin">( GMT +2 ) Europe/Berlin</option><option value="Europe/Bratislava">( GMT +2 ) Europe/Bratislava</option><option value="Europe/Brussels">( GMT +2 ) Europe/Brussels</option><option value="Europe/Bucharest">( GMT +3 ) Europe/Bucharest</option><option value="Europe/Budapest">( GMT +2 ) Europe/Budapest</option><option value="Europe/Busingen">( GMT +2 ) Europe/Busingen</option><option value="Europe/Chisinau">( GMT +3 ) Europe/Chisinau</option><option value="Europe/Copenhagen">( GMT +2 ) Europe/Copenhagen</option><option value="Europe/Dublin">( GMT +1 ) Europe/Dublin</option><option value="Europe/Gibraltar">( GMT +2 ) Europe/Gibraltar</option><option value="Europe/Guernsey">( GMT +1 ) Europe/Guernsey</option><option value="Europe/Helsinki">( GMT +3 ) Europe/Helsinki</option><option value="Europe/Isle_of_Man">( GMT +1 ) Europe/Isle_of_Man</option><option value="Europe/Istanbul">( GMT +3 ) Europe/Istanbul</option><option value="Europe/Jersey">( GMT +1 ) Europe/Jersey</option><option value="Europe/Kaliningrad">( GMT +2 ) Europe/Kaliningrad</option><option value="Europe/Kiev">( GMT +3 ) Europe/Kiev</option><option value="Europe/Kirov">( GMT +3 ) Europe/Kirov</option><option value="Europe/Lisbon">( GMT +1 ) Europe/Lisbon</option><option value="Europe/Ljubljana">( GMT +2 ) Europe/Ljubljana</option><option value="Europe/London">( GMT +1 ) Europe/London</option><option value="Europe/Luxembourg">( GMT +2 ) Europe/Luxembourg</option><option value="Europe/Madrid">( GMT +2 ) Europe/Madrid</option><option value="Europe/Malta">( GMT +2 ) Europe/Malta</option><option value="Europe/Mariehamn">( GMT +3 ) Europe/Mariehamn</option><option value="Europe/Minsk">( GMT +3 ) Europe/Minsk</option><option value="Europe/Monaco">( GMT +2 ) Europe/Monaco</option><option value="Europe/Moscow">( GMT +3 ) Europe/Moscow</option><option value="Europe/Oslo">( GMT +2 ) Europe/Oslo</option><option value="Europe/Paris">( GMT +2 ) Europe/Paris</option><option value="Europe/Podgorica">( GMT +2 ) Europe/Podgorica</option><option value="Europe/Prague">( GMT +2 ) Europe/Prague</option><option value="Europe/Riga">( GMT +3 ) Europe/Riga</option><option value="Europe/Rome">( GMT +2 ) Europe/Rome</option><option value="Europe/Samara">( GMT +4 ) Europe/Samara</option><option value="Europe/San_Marino">( GMT +2 ) Europe/San_Marino</option><option value="Europe/Sarajevo">( GMT +2 ) Europe/Sarajevo</option><option value="Europe/Simferopol">( GMT +3 ) Europe/Simferopol</option><option value="Europe/Skopje">( GMT +2 ) Europe/Skopje</option><option value="Europe/Sofia">( GMT +3 ) Europe/Sofia</option><option value="Europe/Stockholm">( GMT +2 ) Europe/Stockholm</option><option value="Europe/Tallinn">( GMT +3 ) Europe/Tallinn</option><option value="Europe/Tirane">( GMT +2 ) Europe/Tirane</option><option value="Europe/Ulyanovsk">( GMT +4 ) Europe/Ulyanovsk</option><option value="Europe/Uzhgorod">( GMT +3 ) Europe/Uzhgorod</option><option value="Europe/Vaduz">( GMT +2 ) Europe/Vaduz</option><option value="Europe/Vatican">( GMT +2 ) Europe/Vatican</option><option value="Europe/Vienna">( GMT +2 ) Europe/Vienna</option><option value="Europe/Vilnius">( GMT +3 ) Europe/Vilnius</option><option value="Europe/Volgograd">( GMT +3 ) Europe/Volgograd</option><option value="Europe/Warsaw">( GMT +2 ) Europe/Warsaw</option><option value="Europe/Zagreb">( GMT +2 ) Europe/Zagreb</option><option value="Europe/Zaporozhye">( GMT +3 ) Europe/Zaporozhye</option><option value="Europe/Zurich">( GMT +2 ) Europe/Zurich</option><option value="Indian/Antananarivo">( GMT +3 ) Indian/Antananarivo</option><option value="Indian/Chagos">( GMT +6 ) Indian/Chagos</option><option value="Indian/Christmas">( GMT +7 ) Indian/Christmas</option><option value="Indian/Cocos">( GMT +6 ) Indian/Cocos</option><option value="Indian/Comoro">( GMT +3 ) Indian/Comoro</option><option value="Indian/Kerguelen">( GMT +5 ) Indian/Kerguelen</option><option value="Indian/Mahe">( GMT +4 ) Indian/Mahe</option><option value="Indian/Maldives">( GMT +5 ) Indian/Maldives</option><option value="Indian/Mauritius">( GMT +4 ) Indian/Mauritius</option><option value="Indian/Mayotte">( GMT +3 ) Indian/Mayotte</option><option value="Indian/Reunion">( GMT +4 ) Indian/Reunion</option><option value="Pacific/Apia">( GMT +14 ) Pacific/Apia</option><option value="Pacific/Auckland">( GMT +13 ) Pacific/Auckland</option><option value="Pacific/Bougainville">( GMT +11 ) Pacific/Bougainville</option><option value="Pacific/Chatham">( GMT +13 ) Pacific/Chatham</option><option value="Pacific/Chuuk">( GMT +10 ) Pacific/Chuuk</option><option value="Pacific/Easter">( GMT -5 ) Pacific/Easter</option><option value="Pacific/Efate">( GMT +11 ) Pacific/Efate</option><option value="Pacific/Enderbury">( GMT +13 ) Pacific/Enderbury</option><option value="Pacific/Fakaofo">( GMT +13 ) Pacific/Fakaofo</option><option value="Pacific/Fiji">( GMT +12 ) Pacific/Fiji</option><option value="Pacific/Funafuti">( GMT +12 ) Pacific/Funafuti</option><option value="Pacific/Galapagos">( GMT -6 ) Pacific/Galapagos</option><option value="Pacific/Gambier">( GMT -9 ) Pacific/Gambier</option><option value="Pacific/Guadalcanal">( GMT +11 ) Pacific/Guadalcanal</option><option value="Pacific/Guam">( GMT +10 ) Pacific/Guam</option><option value="Pacific/Honolulu">( GMT -10 ) Pacific/Honolulu</option><option value="Pacific/Johnston">( GMT -10 ) Pacific/Johnston</option><option value="Pacific/Kiritimati">( GMT +14 ) Pacific/Kiritimati</option><option value="Pacific/Kosrae">( GMT +11 ) Pacific/Kosrae</option><option value="Pacific/Kwajalein">( GMT +12 ) Pacific/Kwajalein</option><option value="Pacific/Majuro">( GMT +12 ) Pacific/Majuro</option><option value="Pacific/Marquesas">( GMT -10 ) Pacific/Marquesas</option><option value="Pacific/Midway">( GMT -11 ) Pacific/Midway</option><option value="Pacific/Nauru">( GMT +12 ) Pacific/Nauru</option><option value="Pacific/Niue">( GMT -11 ) Pacific/Niue</option><option value="Pacific/Norfolk">( GMT +11 ) Pacific/Norfolk</option><option value="Pacific/Noumea">( GMT +11 ) Pacific/Noumea</option><option value="Pacific/Pago_Pago">( GMT -11 ) Pacific/Pago_Pago</option><option value="Pacific/Palau">( GMT +9 ) Pacific/Palau</option><option value="Pacific/Pitcairn">( GMT -8 ) Pacific/Pitcairn</option><option value="Pacific/Pohnpei">( GMT +11 ) Pacific/Pohnpei</option><option value="Pacific/Port_Moresby">( GMT +10 ) Pacific/Port_Moresby</option><option value="Pacific/Rarotonga">( GMT -10 ) Pacific/Rarotonga</option><option value="Pacific/Saipan">( GMT +10 ) Pacific/Saipan</option><option value="Pacific/Tahiti">( GMT -10 ) Pacific/Tahiti</option><option value="Pacific/Tarawa">( GMT +12 ) Pacific/Tarawa</option><option value="Pacific/Tongatapu">( GMT +13 ) Pacific/Tongatapu</option><option value="Pacific/Wake">( GMT +12 ) Pacific/Wake</option><option value="Pacific/Wallis">( GMT +12 ) Pacific/Wallis</option></select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal #time-zone').val(your_timezone);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-zone" onclick="smhCM.doUpdateZone()">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    doUpdateZone: function () {
        var new_tz = $('#smh-modal #time-zone').val();
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            action: 'update_timezone',
            tz: new_tz
        }

        $.ajax({
            cache: false,
            url: ApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#update-zone').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['success']) {
                    your_timezone = data['timezone'];
                    $('#time-zone').html(time_zones[data['timezone']]);
                    smhCM.refresh_schedule();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#update-zone').removeAttr('disabled');
                        $('#smh-modal').modal('hide');
                    }, 3000);
                }
            }
        });
    },
    //Register actions
    registerActions: function () {
        $('.modal').on('click', '.program-entry', function () {
            // in the handler, 'this' refers to the box clicked on
            var $box = $(this);
            if ($box.is(":checked")) {
                // the name of the box is retrieved using the .attr() method
                // as it is assumed and expected to be immutable
                var group = "input:checkbox[name='" + $box.attr("name") + "']";
                // the checked state of the group/box on the other hand will change
                // and the current value is retrieved using .prop() method
                $(group).prop("checked", false);
                $box.prop("checked", true);
            } else {
                $box.prop("checked", false);
            }
        });
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal3').on('click', '.smh-close3', function () {
            $('#smh-modal2').css('z-index', '2000');
            $('#smh-modal').css('z-index', '1000');
            $('#smh-modal3').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal2').on('change', '#thumbUp input[type=file]', function () {
            // select the form and submit
            $('#smh-modal2 form').submit();
            var options = {
                dataType: 'xml',
                complete: function () {
                    setTimeout(function () {
                        $('#smh-modal2 #loading img').css('display', 'none');
                        smhCM.loadThumbs(entryId);
                    }, 1800);
                },
                beforeSend: function () {
                    $('#smh-modal2 #loading img').css('display', 'inline-block');
                }
            };
            $(this).ajaxSubmit(options);
            return false;
        });
        $('#channel-search input[type=search]').keyup(function () {
            search = $(this).val();
            smhCM.refresh_schedule();
        });

        $('.modal').on('click', '#channel-list li a', function () {
            var channelId = $(this).parent().attr('data-channel-select-id');
            $('#channel-selected').html($(this).html());
            $('#channel-selected').attr('data-channel-selected', channelId);
        });
        $('.modal').on('click', '#repeat-pattern-list li a', function () {
            $('#pattern-selected').html($(this).html());
            if ($(this).html() === 'Daily') {
                $('#repeat-options').html('<div class="repeat-title">Repeat Every</div>' +
                        '<input type="text" class="form-control" id="repeat-everyday" value="1"/><span id="repeat-everyday-text">day(s)</span>');
            } else if ($(this).html() === 'Weekly') {
                $('#repeat-options').html('<div class="repeat-title">Repeat Every</div>' +
                        '<input type="text" class="form-control" id="repeat-everyweek" value="1"/><span id="repeat-everyweek-text">week(s) on the following days:</span>' +
                        '<table class="day-table"><tr><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="1"> Monday</td><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="2"> Tuesday</td><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="3"> Wednesday</td></tr></tr><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="4"> Thursday</td><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="5"> Friday</td><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="6"> Saturday</td></tr><tr><td class="day-wrapper"><input type="checkbox" class="week-day" name="weekday" value="0"> Sunday</td><tr></table>');
            } else if ($(this).html() === 'Monthly') {
                $('#repeat-options').html('<div class="dropdown repeat-month-options-wrapper">' +
                        '<div class="repeat-title">Monthly Options</div>' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-month-options-selected">Repeat</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-month-options-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">Repeat</a></li>' +
                        '<li><a href="#">On</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '<div id="month-options">' +
                        '<div class="dropdown repeat-month-day-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-month-day-selected">1st</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-month-day-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">1st</a></li>' +
                        '<li><a href="#">2nd</a></li>' +
                        '<li><a href="#">3rd</a></li>' +
                        '<li><a href="#">4th</a></li>' +
                        '<li><a href="#">5th</a></li>' +
                        '<li><a href="#">6th</a></li>' +
                        '<li><a href="#">7th</a></li>' +
                        '<li><a href="#">8th</a></li>' +
                        '<li><a href="#">9th</a></li>' +
                        '<li><a href="#">10th</a></li>' +
                        '<li><a href="#">11th</a></li>' +
                        '<li><a href="#">12th</a></li>' +
                        '<li><a href="#">13th</a></li>' +
                        '<li><a href="#">14th</a></li>' +
                        '<li><a href="#">15th</a></li>' +
                        '<li><a href="#">16th</a></li>' +
                        '<li><a href="#">17th</a></li>' +
                        '<li><a href="#">18th</a></li>' +
                        '<li><a href="#">19th</a></li>' +
                        '<li><a href="#">20th</a></li>' +
                        '<li><a href="#">21st</a></li>' +
                        '<li><a href="#">22nd</a></li>' +
                        '<li><a href="#">23rd</a></li>' +
                        '<li><a href="#">24th</a></li>' +
                        '<li><a href="#">25th</a></li>' +
                        '<li><a href="#">26th</a></li>' +
                        '<li><a href="#">27th</a></li>' +
                        '<li><a href="#">28th</a></li>' +
                        '<li><a href="#">29th</a></li>' +
                        '<li><a href="#">30th</a></li>' +
                        '<li><a href="#">31st</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="month-day-text"> day every </div><input type="text" class="form-control" id="month-count" value="1"/><div id="month-day-text"> month(s)</div>' +
                        '</div>' +
                        '<div class="clear"></div>');
                $('.modal #repeat-month-day-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-month-day-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            } else if ($(this).html() === 'Yearly') {
                $('#repeat-options').html('<div class="dropdown repeat-year-options-wrapper">' +
                        '<div class="repeat-title">Yearly Options</div>' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-options-selected">Every</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-options-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">Every</a></li>' +
                        '<li><a href="#">On</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '<div id="year-options">' +
                        '<div class="dropdown repeat-month-day-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-day-selected">1st</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-day-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">1st</a></li>' +
                        '<li><a href="#">2nd</a></li>' +
                        '<li><a href="#">3rd</a></li>' +
                        '<li><a href="#">4th</a></li>' +
                        '<li><a href="#">5th</a></li>' +
                        '<li><a href="#">6th</a></li>' +
                        '<li><a href="#">7th</a></li>' +
                        '<li><a href="#">8th</a></li>' +
                        '<li><a href="#">9th</a></li>' +
                        '<li><a href="#">10th</a></li>' +
                        '<li><a href="#">11th</a></li>' +
                        '<li><a href="#">12th</a></li>' +
                        '<li><a href="#">13th</a></li>' +
                        '<li><a href="#">14th</a></li>' +
                        '<li><a href="#">15th</a></li>' +
                        '<li><a href="#">16th</a></li>' +
                        '<li><a href="#">17th</a></li>' +
                        '<li><a href="#">18th</a></li>' +
                        '<li><a href="#">19th</a></li>' +
                        '<li><a href="#">20th</a></li>' +
                        '<li><a href="#">21st</a></li>' +
                        '<li><a href="#">22nd</a></li>' +
                        '<li><a href="#">23rd</a></li>' +
                        '<li><a href="#">24th</a></li>' +
                        '<li><a href="#">25th</a></li>' +
                        '<li><a href="#">26th</a></li>' +
                        '<li><a href="#">27th</a></li>' +
                        '<li><a href="#">28th</a></li>' +
                        '<li><a href="#">29th</a></li>' +
                        '<li><a href="#">30th</a></li>' +
                        '<li><a href="#">31st</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="month-day-text"> day of every </div>' +
                        '<div class="dropdown repeat-year-month-options-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-month-options-selected">January</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-month-options-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">January</a></li>' +
                        '<li><a href="#">February</a></li>' +
                        '<li><a href="#">March</a></li>' +
                        '<li><a href="#">April</a></li>' +
                        '<li><a href="#">May</a></li>' +
                        '<li><a href="#">June</a></li>' +
                        '<li><a href="#">July</a></li>' +
                        '<li><a href="#">August</a></li>' +
                        '<li><a href="#">September</a></li>' +
                        '<li><a href="#">October</a></li>' +
                        '<li><a href="#">November</a></li>' +
                        '<li><a href="#">December</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '</div>' +
                        '<div class="clear"></div>');
                $('.modal #repeat-year-day-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-year-day-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                $('.modal #repeat-year-month-options-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-year-month-options-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
        $('.modal').on('click', '#repeat-month-options-list li a', function () {
            $('#repeat-month-options-selected').html($(this).html());
            if ($(this).html() === 'Repeat') {
                $('#month-options').html('<div class="dropdown repeat-month-day-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-month-day-selected">1st</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-month-day-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">1st</a></li>' +
                        '<li><a href="#">2nd</a></li>' +
                        '<li><a href="#">3rd</a></li>' +
                        '<li><a href="#">4th</a></li>' +
                        '<li><a href="#">5th</a></li>' +
                        '<li><a href="#">6th</a></li>' +
                        '<li><a href="#">7th</a></li>' +
                        '<li><a href="#">8th</a></li>' +
                        '<li><a href="#">9th</a></li>' +
                        '<li><a href="#">10th</a></li>' +
                        '<li><a href="#">11th</a></li>' +
                        '<li><a href="#">12th</a></li>' +
                        '<li><a href="#">13th</a></li>' +
                        '<li><a href="#">14th</a></li>' +
                        '<li><a href="#">15th</a></li>' +
                        '<li><a href="#">16th</a></li>' +
                        '<li><a href="#">17th</a></li>' +
                        '<li><a href="#">18th</a></li>' +
                        '<li><a href="#">19th</a></li>' +
                        '<li><a href="#">20th</a></li>' +
                        '<li><a href="#">21st</a></li>' +
                        '<li><a href="#">22nd</a></li>' +
                        '<li><a href="#">23rd</a></li>' +
                        '<li><a href="#">24th</a></li>' +
                        '<li><a href="#">25th</a></li>' +
                        '<li><a href="#">26th</a></li>' +
                        '<li><a href="#">27th</a></li>' +
                        '<li><a href="#">28th</a></li>' +
                        '<li><a href="#">29th</a></li>' +
                        '<li><a href="#">30th</a></li>' +
                        '<li><a href="#">31st</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="month-day-text"> day every </div><input type="text" class="form-control" id="month-count" value="1"/><div id="month-day-text"> month(s)</div>' +
                        '</div>');
                $('.modal #repeat-month-day-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-month-day-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            } else if ($(this).html() === 'On') {
                $('#month-options').html('<div class="dropdown repeat-month-week-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-month-week-selected">1st</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-month-week-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">1st</a></li>' +
                        '<li><a href="#">2nd</a></li>' +
                        '<li><a href="#">3rd</a></li>' +
                        '<li><a href="#">4th</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="dropdown repeat-month-week-day-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-month-week-day-selected">Monday</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-month-week-day-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">Monday</a></li>' +
                        '<li><a href="#">Tuesday</a></li>' +
                        '<li><a href="#">Wednesday</a></li>' +
                        '<li><a href="#">Thursday</a></li>' +
                        '<li><a href="#">Friday</a></li>' +
                        '<li><a href="#">Saturday</a></li>' +
                        '<li><a href="#">Sunday</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="month-day-text"> every </div><input type="text" class="form-control" id="month-week-day-count" value="1"/><div id="month-day-text"> month(s)</div>');
            }
        });
        $('.modal').on('click', '#repeat-year-options-list li a', function () {
            $('#repeat-year-options-selected').html($(this).html());
            if ($(this).html() === 'Every') {
                $('#year-options').html('<div class="dropdown repeat-month-day-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-day-selected">1st</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-day-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">1st</a></li>' +
                        '<li><a href="#">2nd</a></li>' +
                        '<li><a href="#">3rd</a></li>' +
                        '<li><a href="#">4th</a></li>' +
                        '<li><a href="#">5th</a></li>' +
                        '<li><a href="#">6th</a></li>' +
                        '<li><a href="#">7th</a></li>' +
                        '<li><a href="#">8th</a></li>' +
                        '<li><a href="#">9th</a></li>' +
                        '<li><a href="#">10th</a></li>' +
                        '<li><a href="#">11th</a></li>' +
                        '<li><a href="#">12th</a></li>' +
                        '<li><a href="#">13th</a></li>' +
                        '<li><a href="#">14th</a></li>' +
                        '<li><a href="#">15th</a></li>' +
                        '<li><a href="#">16th</a></li>' +
                        '<li><a href="#">17th</a></li>' +
                        '<li><a href="#">18th</a></li>' +
                        '<li><a href="#">19th</a></li>' +
                        '<li><a href="#">20th</a></li>' +
                        '<li><a href="#">21st</a></li>' +
                        '<li><a href="#">22nd</a></li>' +
                        '<li><a href="#">23rd</a></li>' +
                        '<li><a href="#">24th</a></li>' +
                        '<li><a href="#">25th</a></li>' +
                        '<li><a href="#">26th</a></li>' +
                        '<li><a href="#">27th</a></li>' +
                        '<li><a href="#">28th</a></li>' +
                        '<li><a href="#">29th</a></li>' +
                        '<li><a href="#">30th</a></li>' +
                        '<li><a href="#">31st</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="month-day-text"> day of every </div>' +
                        '<div class="dropdown repeat-year-month-options-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-month-options-selected">January</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-month-options-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">January</a></li>' +
                        '<li><a href="#">February</a></li>' +
                        '<li><a href="#">March</a></li>' +
                        '<li><a href="#">April</a></li>' +
                        '<li><a href="#">May</a></li>' +
                        '<li><a href="#">June</a></li>' +
                        '<li><a href="#">July</a></li>' +
                        '<li><a href="#">August</a></li>' +
                        '<li><a href="#">September</a></li>' +
                        '<li><a href="#">October</a></li>' +
                        '<li><a href="#">November</a></li>' +
                        '<li><a href="#">December</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '</div>');
                $('.modal #repeat-year-day-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-year-day-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                $('.modal #repeat-year-month-options-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-year-month-options-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            } else if ($(this).html() === 'On') {
                $('#year-options').html('<div class="dropdown repeat-year-day-month-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-day-month-selected">1st</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-day-month-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">1st</a></li>' +
                        '<li><a href="#">2nd</a></li>' +
                        '<li><a href="#">3rd</a></li>' +
                        '<li><a href="#">4th</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="dropdown repeat-year-week-day-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-week-day-selected">Monday</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-week-day-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">Monday</a></li>' +
                        '<li><a href="#">Tuesday</a></li>' +
                        '<li><a href="#">Wednesday</a></li>' +
                        '<li><a href="#">Thursday</a></li>' +
                        '<li><a href="#">Friday</a></li>' +
                        '<li><a href="#">Saturday</a></li>' +
                        '<li><a href="#">Sunday</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="month-day-text"> of </div>' +
                        '<div class="dropdown repeat-year-month-options-wrapper">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="repeat-year-month-options-selected">January</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="repeat-year-month-options-list" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">January</a></li>' +
                        '<li><a href="#">February</a></li>' +
                        '<li><a href="#">March</a></li>' +
                        '<li><a href="#">April</a></li>' +
                        '<li><a href="#">May</a></li>' +
                        '<li><a href="#">June</a></li>' +
                        '<li><a href="#">July</a></li>' +
                        '<li><a href="#">August</a></li>' +
                        '<li><a href="#">September</a></li>' +
                        '<li><a href="#">October</a></li>' +
                        '<li><a href="#">November</a></li>' +
                        '<li><a href="#">December</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="clear"></div>');
                $('.modal #repeat-year-month-options-list').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
                $('.modal #add-program-form .dropdown #repeat-year-month-options-list').on('click', '.mCSB_scrollTools', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
        $('.modal').on('click', '#repeat-month-day-list li a', function () {
            $('#repeat-month-day-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-month-week-list li a', function () {
            $('#repeat-month-week-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-month-week-day-list li a', function () {
            $('#repeat-month-week-day-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-year-day-list li a', function () {
            $('#repeat-year-day-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-year-month-options-list li a', function () {
            $('#repeat-year-month-options-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-year-day-month-list li a', function () {
            $('#repeat-year-day-month-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-year-week-day-list li a', function () {
            $('#repeat-year-week-day-selected').html($(this).html());
        });
        $('.modal').on('click', '#repeat-ends-list li a', function () {
            $('#repeat-ends-selected').html($(this).html());
            if ($(this).html() === 'No End Date') {
                $('#repeat-ends-options').html('');
            } else if ($(this).html() === 'After') {
                $('#repeat-ends-options').html('<input type="text" class="form-control" id="after-occur" value="1"/><div id="occur-text"> occurrence(s)</div>');
            } else if ($(this).html() === 'End by') {
                var currentDate = new Date();
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1
                var year = currentDate.getFullYear();
                var end_date = year + '-' + month + '-' + day;
                $('#repeat-ends-options').html('<div class="date-wrapper">' +
                        '<div class="input-group input-append date" id="datetimepicker3">' +
                        '<input type="text" class="form-control" style="margin: auto; width: 110px; height: 41px;" value="' + end_date + '" readonly/>' +
                        '<span class="input-group-addon">' +
                        '<span class="glyphicon glyphicon-calendar"></span>' +
                        '</span>' +
                        '</div>' +
                        '</div>');
                $('#datetimepicker3').datetimepicker({
                    toolbarPlacement: 'bottom',
                    showClear: true,
                    format: 'YYYY-MM-DD',
                    ignoreReadonly: true
                });
            }
        });

        if (!window.Globalize)
            window.Globalize = {
                format: function (number, format) {
                    number = String(this.parseFloat(number, 10) * 1);
                    format = (m = String(format).match(/^[nd](\d+)$/)) ? m[1] : 2;
                    for (i = 0; i < format - number.length; i++)
                        number = '0' + number;
                    return number;
                },
                parseFloat: function (number, radix) {
                    return parseFloat(number, radix || 10);
                }
            };
    }
}

// Main on ready
$(document).ready(function () {
    smhCM = new ChannelManager();
    smhCM.registerActions();
    smhCM.getUiConfs();
    smhCM.getCats();
    smhCM.getAccessControlProfiles();
    smhCM.getFlavors();
    smhCM.init_scheduler();
    smhCM.getTimeZone();
    //smhCM.getChannels();
});
