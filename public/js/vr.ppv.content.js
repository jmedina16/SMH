/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	PPV
 *
 *	7-3-2014
 */
//PPV constructor
function PPV() {}

//Global variables
var ApiUrl = "/apps/ppv/v1.0/dev.php?";
var validator;
var total_entries;
var categories = [];
var categoryIDs = [];
var mediaTypes = [];
var duration = [];
var clipped = [];
var ac = [];
var ac_filter = [];
var flavors = [];
var flavors_filter = [];
var ppv_entry_id;
var ppv_entry_type;
var ppv_entry_name;
var ppv_ac_id;
var ppv_ac_name;
var ppv_tickets = new Array();
var partnerData = null;
var startDate = '';
var endDate = '';
var playlistContent = new Array();
var countries_imgs = {
    'AF': '<img src="/img/flags/af.gif" title="Afghanistan">',
    'AX': '<img src="/img/flags/ax.gif" title="Aland Islands">',
    'AL': '<img src="/img/flags/al.gif" title="Albania">',
    'DZ': '<img src="/img/flags/dz.gif" title="Algeria">',
    'AS': '<img src="/img/flags/as.gif" title="American Samoa">',
    'AD': '<img src="/img/flags/ad.gif" title="Andorra">',
    'AO': '<img src="/img/flags/ao.gif" title="Angola">',
    'AI': '<img src="/img/flags/ai.gif" title="Anguilla">',
    'AQ': '<img src="/img/flags/aq.gif" title="Antarctica">',
    'AG': '<img src="/img/flags/ag.gif" title="Antigua and Barbuda">',
    'AR': '<img src="/img/flags/ar.gif" title="Argentina">',
    'AM': '<img src="/img/flags/am.gif" title="Armenia">',
    'AW': '<img src="/img/flags/aw.gif" title="Aruba">',
    'AU': '<img src="/img/flags/au.gif" title="Australia">',
    'AT': '<img src="/img/flags/at.gif" title="Austria">',
    'AZ': '<img src="/img/flags/az.gif" title="Azerbaijan">',
    'BS': '<img src="/img/flags/bs.gif" title="Bahamas">',
    'BH': '<img src="/img/flags/bh.gif" title="Bahrain">',
    'BD': '<img src="/img/flags/bd.gif" title="Bangladesh">',
    'BB': '<img src="/img/flags/bb.gif" title="Barbados">',
    'BY': '<img src="/img/flags/by.gif" title="Belarus">',
    'BE': '<img src="/img/flags/be.gif" title="Belgium">',
    'BZ': '<img src="/img/flags/bz.gif" title="Belize">',
    'BJ': '<img src="/img/flags/bj.gif" title="Benin">',
    'BM': '<img src="/img/flags/bm.gif" title="Bermuda">',
    'BT': '<img src="/img/flags/bt.gif" title="Bhutan">',
    'BO': '<img src="/img/flags/bo.gif" title="Bolivia">',
    'BA': '<img src="/img/flags/ba.gif" title="Bosnia and Herzegovina">',
    'BW': '<img src="/img/flags/bw.gif" title="Botswana">',
    'BV': '<img src="/img/flags/bv.gif" title="Bouvet Island">',
    'BR': '<img src="/img/flags/br.gif" title="Brazil">',
    'IO': '<img src="/img/flags/io.gif" title="British Indian Ocean Territory">',
    'BN': '<img src="/img/flags/bn.gif" title="Brunei">',
    'BG': '<img src="/img/flags/bg.gif" title="Bulgaria">',
    'BF': '<img src="/img/flags/bf.gif" title="Burkina Faso">',
    'BI': '<img src="/img/flags/bi.gif" title="Burundi">',
    'KH': '<img src="/img/flags/kh.gif" title="Cambodia">',
    'CM': '<img src="/img/flags/cm.gif" title="Cameroon">',
    'CA': '<img src="/img/flags/ca.gif" title="Canada">',
    'CV': '<img src="/img/flags/cv.gif" title="Cape Verde">',
    'KY': '<img src="/img/flags/ky.gif" title="Cayman Island">',
    'CF': '<img src="/img/flags/cf.gif" title="Central African Republic">',
    'TD': '<img src="/img/flags/td.gif" title="Chad">',
    'CL': '<img src="/img/flags/cl.gif" title="Chile">',
    'CN': '<img src="/img/flags/cn.gif" title="China">',
    'CO': '<img src="/img/flags/co.gif" title="Colombia">',
    'KM': '<img src="/img/flags/km.gif" title="Comoros">',
    'CG': '<img src="/img/flags/cg.gif" title="Congo">',
    'CD': '<img src="/img/flags/cd.gif" title="Congo (DRC)">',
    'CK': '<img src="/img/flags/ck.gif" title="Cook Islands">',
    'CR': '<img src="/img/flags/cr.gif" title="Costa Rica">',
    'HR': '<img src="/img/flags/hr.gif" title="Croatia">',
    'CU': '<img src="/img/flags/cu.gif" title="Cuba">',
    'CY': '<img src="/img/flags/cy.gif" title="Cyprus">',
    'CZ': '<img src="/img/flags/cz.gif" title="Czech Republic">',
    'CI': '<img src="/img/flags/ci.gif" title="Cte d\'lvoire">',
    'DK': '<img src="/img/flags/dk.gif" title="Denmark">',
    'DJ': '<img src="/img/flags/dj.gif" title="Djibouti">',
    'DM': '<img src="/img/flags/dm.gif" title="Dominica">',
    'DO': '<img src="/img/flags/do.gif" title="Dominican Republic">',
    'EC': '<img src="/img/flags/ec.gif" title="Ecuador">',
    'EG': '<img src="/img/flags/eg.gif" title="Eqypt">',
    'SV': '<img src="/img/flags/sv.gif" title="El Salvador">',
    'GQ': '<img src="/img/flags/gq.gif" title="Equatorial Guinea">',
    'ER': '<img src="/img/flags/er.gif" title="Eritrea">',
    'EE': '<img src="/img/flags/ee.gif" title="Estonia">',
    'ET': '<img src="/img/flags/et.gif" title="Ethiopia">',
    'FK': '<img src="/img/flags/fk.gif" title="Falkland Islands (Islas Malvinas)">',
    'FO': '<img src="/img/flags/fo.gif" title="Faroe Islands">',
    'FJ': '<img src="/img/flags/fj.gif" title="Fiji Islands">',
    'FI': '<img src="/img/flags/fi.gif" title="Finland">',
    'FR': '<img src="/img/flags/fr.gif" title="France">',
    'GF': '<img src="/img/flags/gf.gif" title="French Guiana">',
    'PF': '<img src="/img/flags/pf.gif" title="French Polynesia">',
    'TF': '<img src="/img/flags/tf.gif" title="French Southern and Antarctic Lands">',
    'GA': '<img src="/img/flags/ga.gif" title="Gabon">',
    'GM': '<img src="/img/flags/gm.gif" title="Gambia, The">',
    'GE': '<img src="/img/flags/ge.gif" title="Georgia">',
    'DE': '<img src="/img/flags/de.gif" title="Germany">',
    'GH': '<img src="/img/flags/gh.gif" title="Ghana">',
    'GI': '<img src="/img/flags/gi.gif" title="Gibraltar">',
    'GR': '<img src="/img/flags/gr.gif" title="Greece">',
    'GL': '<img src="/img/flags/gl.gif" title="Greenland">',
    'GD': '<img src="/img/flags/gd.gif" title="Grenada">',
    'GP': '<img src="/img/flags/gp.gif" title="Guadeloupe">',
    'GU': '<img src="/img/flags/gu.gif" title="Guam">',
    'GT': '<img src="/img/flags/gt.gif" title="Guatemala">',
    'GG': '<img src="/img/flags/gg.gif" title="Guernsey">',
    'GN': '<img src="/img/flags/gn.gif" title="Guinea">',
    'GW': '<img src="/img/flags/gw.gif" title="Guinea-Bissau">',
    'GY': '<img src="/img/flags/gy.gif" title="Guyana">',
    'HT': '<img src="/img/flags/ht.gif" title="Haiti">',
    'HM': '<img src="/img/flags/hm.gif" title="Heard Island and McDonald Islands">',
    'HN': '<img src="/img/flags/hn.gif" title="Honduras">',
    'HK': '<img src="/img/flags/hk.gif" title="Hong Kong SAR">',
    'HU': '<img src="/img/flags/hu.gif" title="Hungary">',
    'IS': '<img src="/img/flags/is.gif" title="Iceland">',
    'IN': '<img src="/img/flags/in.gif" title="India">',
    'ID': '<img src="/img/flags/id.gif" title="Indonesia">',
    'IR': '<img src="/img/flags/ir.gif" title="Iran">',
    'IQ': '<img src="/img/flags/iq.gif" title="Iraq">',
    'IE': '<img src="/img/flags/ie.gif" title="Ireland">',
    'IM': '<img src="/img/flags/im.gif" title="Isle of Man">',
    'IL': '<img src="/img/flags/il.gif" title="Israel">',
    'IT': '<img src="/img/flags/it.gif" title="Italy">',
    'JM': '<img src="/img/flags/jm.gif" title="Jamaica">',
    'JP': '<img src="/img/flags/jp.gif" title="Japan">',
    'JE': '<img src="/img/flags/je.gif" title="Jersey">',
    'JO': '<img src="/img/flags/jo.gif" title="Jordan">',
    'KZ': '<img src="/img/flags/kz.gif" title="Kazakhstan">',
    'KE': '<img src="/img/flags/ke.gif" title="Kenya">',
    'KI': '<img src="/img/flags/ki.gif" title="Kiribati">',
    'KR': '<img src="/img/flags/kr.gif" title="Korea">',
    'KW': '<img src="/img/flags/kw.gif" title="Kuwait">',
    'KG': '<img src="/img/flags/kg.gif" title="Kyrgyzstan">',
    'LA': '<img src="/img/flags/la.gif" title="Laos">',
    'LV': '<img src="/img/flags/lv.gif" title="Latvia">',
    'LB': '<img src="/img/flags/lb.gif" title="Lebanon">',
    'LS': '<img src="/img/flags/ls.gif" title="Lesotho">',
    'LR': '<img src="/img/flags/lr.gif" title="Liberia">',
    'LY': '<img src="/img/flags/ly.gif" title="Libya">',
    'LI': '<img src="/img/flags/li.gif" title="Liechtenstein">',
    'LT': '<img src="/img/flags/lt.gif" title="Lithuania">',
    'LU': '<img src="/img/flags/lu.gif" title="Luxembourg">',
    'MO': '<img src="/img/flags/mo.gif" title="Macao SAR">',
    'MK': '<img src="/img/flags/mk.gif" title="Macedonia, Former Yugoslav Republic of">',
    'MG': '<img src="/img/flags/mg.gif" title="Madagascar">',
    'MW': '<img src="/img/flags/mw.gif" title="Malawi">',
    'MY': '<img src="/img/flags/my.gif" title="Malaysia">',
    'MV': '<img src="/img/flags/mv.gif" title="Maldives">',
    'ML': '<img src="/img/flags/ml.gif" title="Mali">',
    'MT': '<img src="/img/flags/mt.gif" title="Malta">',
    'MH': '<img src="/img/flags/mh.gif" title="Marshall Islands">',
    'MQ': '<img src="/img/flags/mq.gif" title="Martinique">',
    'MR': '<img src="/img/flags/mr.gif" title="Mauritania">',
    'MU': '<img src="/img/flags/mu.gif" title="Mauritius">',
    'YT': '<img src="/img/flags/yt.gif" title="Mayotte">',
    'MX': '<img src="/img/flags/mx.gif" title="Mexico">',
    'FM': '<img src="/img/flags/fm.gif" title="Micronesia">',
    'MD': '<img src="/img/flags/md.gif" title="Moldova">',
    'MC': '<img src="/img/flags/mc.gif" title="Monaco">',
    'MN': '<img src="/img/flags/mn.gif" title="Mongolia">',
    'ME': '<img src="/img/flags/me.gif" title="Montenegro">',
    'MS': '<img src="/img/flags/ms.gif" title="Montserrat">',
    'MA': '<img src="/img/flags/ma.gif" title="Morocco">',
    'MZ': '<img src="/img/flags/mz.gif" title="Mozambique">',
    'MM': '<img src="/img/flags/mm.gif" title="Myanmar">',
    'NA': '<img src="/img/flags/na.gif" title="Namibia">',
    'NR': '<img src="/img/flags/nr.gif" title="Nauru">',
    'NP': '<img src="/img/flags/np.gif" title="Nepal">',
    'NL': '<img src="/img/flags/nl.gif" title="Netherlands">',
    'AN': '<img src="/img/flags/an.gif" title="Netherlands Antilles">',
    'NC': '<img src="/img/flags/nc.gif" title="New Caledonia">',
    'NZ': '<img src="/img/flags/nz.gif" title="New Zealand">',
    'NI': '<img src="/img/flags/ni.gif" title="Nicaragua">',
    'NE': '<img src="/img/flags/ne.gif" title="Niger>',
    'NG': '<img src="/img/flags/ng.gif" title="Nigeria">',
    'NU': '<img src="/img/flags/nu.gif" title="Niue">',
    'NF': '<img src="/img/flags/nf.gif" title="Norfolk Island">',
    'KP': '<img src="/img/flags/kp.gif" title="North Korea">',
    'MP': '<img src="/img/flags/mp.gif" title="Northern Mariana Islands">',
    'NO': '<img src="/img/flags/no.gif" title="Norway">',
    'OM': '<img src="/img/flags/om.gif" title="Oman">',
    'PK': '<img src="/img/flags/pk.gif" title="Pakistan">',
    'PW': '<img src="/img/flags/pw.gif" title="Palau">',
    'PA': '<img src="/img/flags/pa.gif" title="Panama">',
    'PG': '<img src="/img/flags/pg.gif" title="Papua New Guinea">',
    'PY': '<img src="/img/flags/py.gif" title="Paraguay">',
    'PE': '<img src="/img/flags/pe.gif" title="Peru">',
    'PH': '<img src="/img/flags/ph.gif" title="Philippines">',
    'PN': '<img src="/img/flags/pn.gif" title="Pitcairn Islands">',
    'PL': '<img src="/img/flags/pl.gif" title="Poland">',
    'PT': '<img src="/img/flags/pt.gif" title="Portugal">',
    'PR': '<img src="/img/flags/pr.gif" title="Puerto Rico">',
    'QA': '<img src="/img/flags/qa.gif" title="Qatar">',
    'RE': '<img src="/img/flags/re.gif" title="Reunion">',
    'RO': '<img src="/img/flags/ro.gif" title="Romania">',
    'RU': '<img src="/img/flags/ru.gif" title="Russia">',
    'RW': '<img src="/img/flags/rw.gif" title="Rwanda">',
    'MF': '',
    'WS': '<img src="/img/flags/ws.gif" title="Samoa">',
    'SM': '<img src="/img/flags/sm.gif" title="San Marino">',
    'SA': '<img src="/img/flags/sa.gif" title="Saudi Arabia">',
    'SN': '<img src="/img/flags/sn.gif" title="Senegal">',
    'RS': '<img src="/img/flags/rs.gif" title="Serbia">',
    'CS': '<img src="/img/flags/cs.gif" title="Serbia and Montenegro">',
    'SC': '<img src="/img/flags/sc.gif" title="Seychelles">',
    'SL': '<img src="/img/flags/sl.gif" title="Sierra Leone">',
    'SG': '<img src="/img/flags/sg.gif" title="Singapore">',
    'SK': '<img src="/img/flags/sk.gif" title="Slovakia">',
    'SI': '<img src="/img/flags/si.gif" title="Slovenia">',
    'SB': '<img src="/img/flags/sb.gif" title="Solomon Islands">',
    'SO': '<img src="/img/flags/so.gif" title="Somalia">',
    'ZA': '<img src="/img/flags/za.gif" title="South Africa">',
    'GS': '<img src="/img/flags/gs.gif" title="South Georgia and the South Sandwich Islands">',
    'ES': '<img src="/img/flags/es.gif" title="Spain">',
    'LK': '<img src="/img/flags/lk.gif" title="Sri Lanka">',
    'KN': '<img src="/img/flags/kn.gif" title="St. Kitts and Nevis">',
    'LC': '<img src="/img/flags/lc.gif" title="St. Lucia">',
    'PM': '<img src="/img/flags/pm.gif" title="St. Pierre and Miquelon">',
    'VC': '<img src="/img/flags/vc.gif" title="St. Vincent and the Grenadines">',
    'SD': '<img src="/img/flags/sd.gif" title="Sudan">',
    'SR': '<img src="/img/flags/sr.gif" title="Suriname">',
    'SZ': '<img src="/img/flags/sz.gif" title="Swaziland">',
    'SE': '<img src="/img/flags/se.gif" title="Sweden">',
    'CH': '<img src="/img/flags/ch.gif" title="Switzerland">',
    'SY': '<img src="/img/flags/sy.gif" title="Syria">',
    'ST': '<img src="/img/flags/st.gif" title="So Tom and Principe">',
    'TW': '<img src="/img/flags/tw.gif" title="Taiwan">',
    'TJ': '<img src="/img/flags/tj.gif" title="Tajikistan">',
    'TZ': '<img src="/img/flags/tz.gif" title="Tanzania">',
    'TH': '<img src="/img/flags/th.gif" title="Thailand">',
    'TG': '<img src="/img/flags/tg.gif" title="Togo">',
    'TK': '<img src="/img/flags/tk.gif" title="Tokelau">',
    'TO': '<img src="/img/flags/to.gif" title="Tonga">',
    'TT': '<img src="/img/flags/tt.gif" title="Trinidad and Tobago">',
    'TN': '<img src="/img/flags/tn.gif" title="Tunisia">',
    'TR': '<img src="/img/flags/tr.gif" title="Turkey">',
    'TM': '<img src="/img/flags/tm.gif" title="Turkmenistan">',
    'TC': '<img src="/img/flags/tc.gif" title="Turks and Caicos Islands">',
    'TV': '<img src="/img/flags/tv.gif" title="Tuvalu">',
    'UG': '<img src="/img/flags/ug.gif" title="Uganda">',
    'UA': '<img src="/img/flags/ua.gif" title="Ukraine">',
    'AE': '<img src="/img/flags/ae.gif" title="United Arab Emirates">',
    'UK': '<img src="/img/flags/uk.gif" title="United Kingdom">',
    'US': '<img src="/img/flags/us.gif" title="United States">',
    'UM': '<img src="/img/flags/um.gif" title="United States Minor Outlying Islands">',
    'UY': '<img src="/img/flags/uy.gif" title="Uruguay">',
    'UZ': '<img src="/img/flags/uz.gif" title="Uzbekistan">',
    'VU': '<img src="/img/flags/vu.gif" title="Vanuatu">',
    'VA': '<img src="/img/flags/va.gif" title="Vatican City">',
    'VE': '<img src="/img/flags/ve.gif" title="Venezuela">',
    'VN': '<img src="/img/flags/vn.gif" title="Vietnam">',
    'VI': '<img src="/img/flags/vi.gif" title="Virgin Islands">',
    'VG': '<img src="/img/flags/vg.gif" title="Virgin Islands, British">',
    'WF': '<img src="/img/flags/wf.gif" title="Walls and Futuna">',
    'YE': '<img src="/img/flags/ye.gif" title="Yemen">',
    'ZM': '<img src="/img/flags/zm.gif" title="Zambia">',
    'ZW': '<img src="/img/flags/zw.gif" title="Zimbabwe">'
};
var countries_text = {
    'AF': 'Afghanistan',
    'AX': 'Aland Islands',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AS': 'American Samoa',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AI': 'Anguilla',
    'AQ': 'Antarctica',
    'AG': 'Antigua and Barbuda',
    'AR': 'Argentina',
    'AM': 'Armenia',
    'AW': 'Aruba',
    'AU': 'Australia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BS': 'Bahamas',
    'BH': 'Bahrain',
    'BD': 'Bangladesh',
    'BB': 'Barbados',
    'BY': 'Belarus',
    'BE': 'Belgium',
    'BZ': 'Belize',
    'BJ': 'Benin',
    'BM': 'Bermuda',
    'BT': 'Bhutan',
    'BO': 'Bolivia',
    'BA': 'Bosnia and Herzegovina',
    'BW': 'Botswana',
    'BV': 'Bouvet Island',
    'BR': 'Brazil',
    'IO': 'British Indian Ocean Territory',
    'BN': 'Brunei',
    'BG': 'Bulgaria',
    'BF': 'Burkina Faso',
    'BI': 'Burundi',
    'KH': 'Cambodia',
    'CM': 'Cameroon',
    'CA': 'Canada',
    'CV': 'Cape Verde',
    'KY': 'Cayman Island',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'CL': 'Chile',
    'CN': 'China',
    'CO': 'Colombia',
    'KM': 'Comoros',
    'CG': 'Congo',
    'CD': 'Congo (DRC)',
    'CK': 'Cook Islands',
    'CR': 'Costa Rica',
    'HR': 'Croatia',
    'CU': 'Cuba',
    'CY': 'Cyprus',
    'CZ': 'Czech Republic',
    'CI': 'Cate dlvoire',
    'DK': 'Denmark',
    'DJ': 'Djibouti',
    'DM': 'Dominica',
    'DO': 'Dominican Republic',
    'EC': 'Ecuador',
    'EG': 'Eqypt',
    'SV': 'El Salvador',
    'GQ': 'Equatorial Guinea',
    'ER': 'Eritrea',
    'EE': 'Estonia',
    'ET': 'Ethiopia',
    'FK': 'Falkland Islands (Islas Malvinas)',
    'FO': 'Faroe Islands',
    'FJ': 'Fiji Islands',
    'FI': 'Finland',
    'FR': 'France',
    'GF': 'French Guiana',
    'PF': 'French Polynesia',
    'TF': 'French Southern and Antarctic Lands',
    'GA': 'Gabon',
    'GM': 'Gambia, The',
    'GE': 'Georgia',
    'DE': 'Germany',
    'GH': 'Ghana',
    'GI': 'Gibraltar',
    'GR': 'Greece',
    'GL': 'Greenland',
    'GD': 'Grenada',
    'GP': 'Guadeloupe',
    'GU': 'Guam',
    'GT': 'Guatemala',
    'GG': 'Guernsey',
    'GN': 'Guinea',
    'GW': 'Guinea-Bissau',
    'GY': 'Guyana',
    'HT': 'Haiti',
    'HM': 'Heard Island and McDonald Islands',
    'HN': 'Honduras',
    'HK': 'Hong Kong SAR',
    'HU': 'Hungary',
    'IS': 'Iceland',
    'IN': 'India',
    'ID': 'Indonesia',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'IE': 'Ireland',
    'IM': 'Isle of Man',
    'IL': 'Israel',
    'IT': 'Italy',
    'JM': 'Jamaica',
    'JP': 'Japan',
    'JE': 'Jersey',
    'JO': 'Jordan',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KI': 'Kiribati',
    'KR': 'Korea',
    'KW': 'Kuwait',
    'KG': 'Kyrgyzstan',
    'LA': 'Laos',
    'LV': 'Latvia',
    'LB': 'Lebanon',
    'LS': 'Lesotho',
    'LR': 'Liberia',
    'LY': 'Libya',
    'LI': 'Liechtenstein',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MO': 'Macao SAR',
    'MK': 'Macedonia, Former Yugoslav Republic of',
    'MG': 'Madagascar',
    'MW': 'Malawi',
    'MY': 'Malaysia',
    'MV': 'Maldives',
    'ML': 'Mali',
    'MT': 'Malta',
    'MH': 'Marshall Islands',
    'MQ': 'Martinique',
    'MR': 'Mauritania',
    'MU': 'Mauritius',
    'YT': 'Mayotte',
    'MX': 'Mexico',
    'FM': 'Micronesia',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'MN': 'Mongolia',
    'ME': 'Montenegro',
    'MS': 'Montserrat',
    'MA': 'Morocco',
    'MZ': 'Mozambique',
    'MM': 'Myanmar',
    'NA': 'Namibia',
    'NR': 'Nauru',
    'NP': 'Nepal',
    'NL': 'Netherlands',
    'AN': 'Netherlands Antilles',
    'NC': 'New Caledonia',
    'NZ': 'New Zealand',
    'NI': 'Nicaragua',
    'NE': 'Niger>',
    'NG': 'Nigeria',
    'NU': 'Niue',
    'NF': 'Norfolk Island',
    'KP': 'North Korea',
    'MP': 'Northern Mariana Islands',
    'NO': 'Norway',
    'OM': 'Oman',
    'PK': 'Pakistan',
    'PW': 'Palau',
    'PA': 'Panama',
    'PG': 'Papua New Guinea',
    'PY': 'Paraguay',
    'PE': 'Peru',
    'PH': 'Philippines',
    'PN': 'Pitcairn Islands',
    'PL': 'Poland',
    'PT': 'Portugal',
    'PR': 'Puerto Rico',
    'QA': 'Qatar',
    'RE': 'Reunion',
    'RO': 'Romania',
    'RU': 'Russia',
    'RW': 'Rwanda',
    'MF': 'Saint Martin',
    'WS': 'Samoa',
    'SM': 'San Marino',
    'SA': 'Saudi Arabia',
    'SN': 'Senegal',
    'RS': 'Serbia',
    'CS': 'Serbia and Montenegro',
    'SC': 'Seychelles',
    'SL': 'Sierra Leone',
    'SG': 'Singapore',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'SB': 'Solomon Islands',
    'SO': 'Somalia',
    'ZA': 'South Africa',
    'GS': 'South Georgia and the South Sandwich Islands',
    'ES': 'Spain',
    'LK': 'Sri Lanka',
    'KN': 'St. Kitts and Nevis',
    'LC': 'St. Lucia',
    'PM': 'St. Pierre and Miquelon',
    'VC': 'St. Vincent and the Grenadines',
    'SD': 'Sudan',
    'SR': 'Suriname',
    'SZ': 'Swaziland',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'SY': 'Syria',
    'ST': 'So Tom and Principe',
    'TW': 'Taiwan',
    'TJ': 'Tajikistan',
    'TZ': 'Tanzania',
    'TH': 'Thailand',
    'TG': 'Togo',
    'TK': 'Tokelau',
    'TO': 'Tonga',
    'TT': 'Trinidad and Tobago',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'TM': 'Turkmenistan',
    'TC': 'Turks and Caicos Islands',
    'TV': 'Tuvalu',
    'UG': 'Uganda',
    'UA': 'Ukraine',
    'AE': 'United Arab Emirates',
    'UK': 'United Kingdom',
    'US': 'United States',
    'UM': 'United States Minor Outlying Islands',
    'UY': 'Uruguay',
    'UZ': 'Uzbekistan',
    'VU': 'Vanuatu',
    'VA': 'Vatican City',
    'VE': 'Venezuela',
    'VN': 'Vietnam',
    'VI': 'Virgin Islands',
    'VG': 'Virgin Islands, British',
    'WF': 'Walls and Futuna',
    'YE': 'Yemen',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe'
};

//PPV prototype/class
PPV.prototype = {
    constructor: PPV,
    //Load ppv user table
    getContent: function () {
        $('#content-table').empty();
        $('#content-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="content-data"></table>');
        $('#content-data').dataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": true,
            "lengthChange": true,
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "action": "list_entries",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'>Status</span>"
                },
                {
                    "title": "<span style='float: left;'>ID</span>"
                },
                {
                    "title": "<span style='float: left;'>Name</span>"
                },
                {
                    "title": "<span style='float: left;'>Type</span>"
                },
                {
                    "title": "<span style='float: left;'>Ticket(s)</span>"
                },
                {
                    "title": "<span style='float: left;'>Access Control</span>"
                },
                {
                    "title": "<span style='float: left;'>Created At</span>"
                },
                {
                    "title": "<span style='float: left;'>Updated At</span>"
                },
                {
                    "title": "<span style='float: left;'>Actions</span>",
                    "width": "195px"
                }
            ],
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 9, 10);
            }
        });
    },
    //Gets gateways
    getGateways: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var reqUrl = ApiUrl + 'action=get_gateways';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                var gateway_setup = false;
                if (data['gateways'] == '') {
                    smhPPV.setup();
                } else {
                    $.each(data['gateways'], function (key, value) {
                        if (value['name'] == 'paypal') {
                            if (value['status'] == '1') {
                                gateway_setup = true;
                                $.each(value['options'], function (k, v) {
                                    if (k == 'currency') {
                                        $.cookie('currency', v);
                                        $('#ticket-currency').val(v);
                                    }
                                });
                            }
                        }
                        if (value['name'] == 'authnet') {
                            if (value['status'] == '1') {
                                gateway_setup = true;
                                $.each(value['options'], function (k, v) {
                                    if (k == 'currency') {
                                        $.cookie('currency', v);
                                        $('#ticket-currency').val(v);
                                    }
                                });
                            }
                        }
                    });
                    if (!gateway_setup) {
                        smhPPV.setup();
                    }
                }
            }
        });
    },
    //Loads setup modal
    setup: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '540px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Pay-Per-View</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; height: 50px; margin-top: 20px;'>*Notice: You must setup at least one payment gateway to use this service</div>";
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Status modal
    statusEntry: function (pid, eid, status) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var status_update, status_text;
        if (status == 1) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + eid + ")</div>";
            status_update = 2;
            status_text = 'Block';
        } else {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + eid + ")</div>";
            status_update = 1;
            status_text = 'Unblock';
        }
        $('#smh-modal .modal-header').html(header);
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-entry" class="btn btn-primary" onclick="smhPPV.updateStatus(' + pid + ',\'' + eid + '\',' + status_update + ')">' + status_text + '</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do update status
    updateStatus: function (pid, eid, status) {
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            kentry_id: eid,
            status: status,
            tz: tz
        }

        var reqUrl = ApiUrl + 'action=update_entry_status';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#status-entry').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#status-entry').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Entry does not exist!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                } else {
                    smhPPV.getContent();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 5000);
                }
            }
        });
    },
    //Delete entry modal
    deleteEntry: function (pid, eid, type) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Entry</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + eid + ")</div>";
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="delete-entry" class="btn btn-primary" onclick="smhPPV.removeEntry(' + pid + ',\'' + eid + '\',' + type + ')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
        ppv_entry_id = eid;
    },
    //Do remove entry
    removeEntry: function (pid, eid, type) {
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            kentry_id: eid,
            media_type: type
        }

        var reqUrl = ApiUrl + 'action=delete_entry';

        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#delete-entry').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#delete-entry').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Entry does not exist!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 5000);
                } else {
                    if (type == 1) {
                        smhPPV.saveScheduling(true, false, 0, false, 0);
                    } else if (type == 3) {
                        smhPPV.savePlistScheduling(true, false, 0, false, 0);
                    }
                    smhPPV.getContent();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Deleted!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 5000);
                }
            }
        });
    },
    //Show preview and embed
    previewEmbed: function (sm_ak, uiconf, player_width, player_height, eid, mode, wrap_width) {
        smhMain.resetModal();
        var header, content;
        $('#smh-modal3 .modal-body').css('height', '700px');
        $('#smh-modal3 .modal-body').css('padding', '0');
        $('#smh-modal3').modal({
            backdrop: 'static'
        });
        $('#smh-modal3').addClass('previewModal');

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Preview & Embed</h4>';
        $('#smh-modal3 .modal-header').html(header);

        content = '<iframe id="trim-clip" scrolling="no" width="100%" height="100%" frameborder="0" src="/apps/platform/vr_preview_embed.php?pid=' + sessInfo.pid + '&sm_ak=' + sm_ak + '&ks=' + sessInfo.ks + '&uiconf_id=' + uiconf + '&width=' + player_width + '&height=' + player_height + '&entry_id=' + eid + '&mode=' + mode + '&wrap_width=' + wrap_width + '">';
        $('#smh-modal3 .modal-body').html(content);
    },
    //Singel Entry modal
    addSingleEntry: function () {
        smhMain.resetModal();
        smhPPV.resetFilters();
        var header, content;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Single Entry</h4>';
        $('#smh-modal .modal-header').html(header);

        var tree = smhPPV.json_tree(categories, 'cat');
        var tree_ac = smhPPV.json_tree(ac, 'ac');
        var tree_flavors = smhPPV.json_tree(flavors, 'flavors');

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 20%;" class="active"><a href="#select-entry-tab" data-toggle="tab">SELECT ENTRY</a></li>' +
                '<li style="width: 20%;"><a href="#details-tab" data-toggle="tab">ENTRY DETAILS</a></li>' +
                '<li style="width: 20%;"><a href="#scheduling-tab" data-toggle="tab">SCHEDULING</a></li>' +
                '<li style="width: 20%;"><a href="#tickets-tab" data-toggle="tab">TICKET(S)</a></li>' +
                '<li style="width: 20%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="select-entry-tab">' +
                '<div id="ppv-entries-wrapper">' +
                '<div style="margin-left: auto; margin-right: auto; width: 235px;">Select an entry you would like to sell.</div>' +
                '<div class="header rs-header">' +
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
                '<div id="entries">' +
                '<div id="mediaentry-table"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="details-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">The following details will appear on the purchase window. Please make sure they are correct.</div>' +
                '<div id="details"></div>' +
                '</div>' +
                '<div class="tab-pane" id="scheduling-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">Scheduling determines when your entry will be permitted for viewing and when access should be discontinued.<br>The ability to set a start time also allows for a presale window.</div>' +
                '<div id="scheduling-wrapper">' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="any_time" id="any_time" name="scheduling" checked> Any Time</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="range" id="range" name="scheduling"> Specific Range</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8" style="margin-top: 20px;">' +
                '<div class="form-group">' +
                '<label for="datetimepicker1" class="col-xs-4 control-label">Start Date:</label>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker1" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label"><input style="width=33px" id="end-date" type="checkbox" disabled>End Date:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker2" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label" style="padding-left: 0px;">Time Zone:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<select class="form-control" id="time-zone" style="margin: auto; width: 294px;" disabled><option value="Africa/Abidjan">( GMT +0 ) Africa/Abidjan</option><option value="Africa/Accra">( GMT +0 ) Africa/Accra</option><option value="Africa/Addis_Ababa">( GMT +3 ) Africa/Addis_Ababa</option><option value="Africa/Algiers">( GMT +1 ) Africa/Algiers</option><option value="Africa/Asmara">( GMT +3 ) Africa/Asmara</option><option value="Africa/Bamako">( GMT +0 ) Africa/Bamako</option><option value="Africa/Bangui">( GMT +1 ) Africa/Bangui</option><option value="Africa/Banjul">( GMT +0 ) Africa/Banjul</option><option value="Africa/Bissau">( GMT +0 ) Africa/Bissau</option><option value="Africa/Blantyre">( GMT +2 ) Africa/Blantyre</option><option value="Africa/Brazzaville">( GMT +1 ) Africa/Brazzaville</option><option value="Africa/Bujumbura">( GMT +2 ) Africa/Bujumbura</option><option value="Africa/Cairo">( GMT +2 ) Africa/Cairo</option><option value="Africa/Casablanca">( GMT +1 ) Africa/Casablanca</option><option value="Africa/Ceuta">( GMT +2 ) Africa/Ceuta</option><option value="Africa/Conakry">( GMT +0 ) Africa/Conakry</option><option value="Africa/Dakar">( GMT +0 ) Africa/Dakar</option><option value="Africa/Dar_es_Salaam">( GMT +3 ) Africa/Dar_es_Salaam</option><option value="Africa/Djibouti">( GMT +3 ) Africa/Djibouti</option><option value="Africa/Douala">( GMT +1 ) Africa/Douala</option><option value="Africa/El_Aaiun">( GMT +1 ) Africa/El_Aaiun</option><option value="Africa/Freetown">( GMT +0 ) Africa/Freetown</option><option value="Africa/Gaborone">( GMT +2 ) Africa/Gaborone</option><option value="Africa/Harare">( GMT +2 ) Africa/Harare</option><option value="Africa/Johannesburg">( GMT +2 ) Africa/Johannesburg</option><option value="Africa/Juba">( GMT +3 ) Africa/Juba</option><option value="Africa/Kampala">( GMT +3 ) Africa/Kampala</option><option value="Africa/Khartoum">( GMT +3 ) Africa/Khartoum</option><option value="Africa/Kigali">( GMT +2 ) Africa/Kigali</option><option value="Africa/Kinshasa">( GMT +1 ) Africa/Kinshasa</option><option value="Africa/Lagos">( GMT +1 ) Africa/Lagos</option><option value="Africa/Libreville">( GMT +1 ) Africa/Libreville</option><option value="Africa/Lome">( GMT +0 ) Africa/Lome</option><option value="Africa/Luanda">( GMT +1 ) Africa/Luanda</option><option value="Africa/Lubumbashi">( GMT +2 ) Africa/Lubumbashi</option><option value="Africa/Lusaka">( GMT +2 ) Africa/Lusaka</option><option value="Africa/Malabo">( GMT +1 ) Africa/Malabo</option><option value="Africa/Maputo">( GMT +2 ) Africa/Maputo</option><option value="Africa/Maseru">( GMT +2 ) Africa/Maseru</option><option value="Africa/Mbabane">( GMT +2 ) Africa/Mbabane</option><option value="Africa/Mogadishu">( GMT +3 ) Africa/Mogadishu</option><option value="Africa/Monrovia">( GMT +0 ) Africa/Monrovia</option><option value="Africa/Nairobi">( GMT +3 ) Africa/Nairobi</option><option value="Africa/Ndjamena">( GMT +1 ) Africa/Ndjamena</option><option value="Africa/Niamey">( GMT +1 ) Africa/Niamey</option><option value="Africa/Nouakchott">( GMT +0 ) Africa/Nouakchott</option><option value="Africa/Ouagadougou">( GMT +0 ) Africa/Ouagadougou</option><option value="Africa/Porto-Novo">( GMT +1 ) Africa/Porto-Novo</option><option value="Africa/Sao_Tome">( GMT +0 ) Africa/Sao_Tome</option><option value="Africa/Tripoli">( GMT +2 ) Africa/Tripoli</option><option value="Africa/Tunis">( GMT +1 ) Africa/Tunis</option><option value="Africa/Windhoek">( GMT +2 ) Africa/Windhoek</option><option value="America/Adak">( GMT -9 ) America/Adak</option><option value="America/Anchorage">( GMT -8 ) America/Anchorage</option><option value="America/Anguilla">( GMT -4 ) America/Anguilla</option><option value="America/Antigua">( GMT -4 ) America/Antigua</option><option value="America/Araguaina">( GMT -3 ) America/Araguaina</option><option value="America/Argentina/Buenos_Aires">( GMT -3 ) America/Argentina/Buenos_Aires</option><option value="America/Argentina/Catamarca">( GMT -3 ) America/Argentina/Catamarca</option><option value="America/Argentina/Cordoba">( GMT -3 ) America/Argentina/Cordoba</option><option value="America/Argentina/Jujuy">( GMT -3 ) America/Argentina/Jujuy</option><option value="America/Argentina/La_Rioja">( GMT -3 ) America/Argentina/La_Rioja</option><option value="America/Argentina/Mendoza">( GMT -3 ) America/Argentina/Mendoza</option><option value="America/Argentina/Rio_Gallegos">( GMT -3 ) America/Argentina/Rio_Gallegos</option><option value="America/Argentina/Salta">( GMT -3 ) America/Argentina/Salta</option><option value="America/Argentina/San_Juan">( GMT -3 ) America/Argentina/San_Juan</option><option value="America/Argentina/San_Luis">( GMT -3 ) America/Argentina/San_Luis</option><option value="America/Argentina/Tucuman">( GMT -3 ) America/Argentina/Tucuman</option><option value="America/Argentina/Ushuaia">( GMT -3 ) America/Argentina/Ushuaia</option><option value="America/Aruba">( GMT -4 ) America/Aruba</option><option value="America/Asuncion">( GMT -3 ) America/Asuncion</option><option value="America/Atikokan">( GMT -5 ) America/Atikokan</option><option value="America/Bahia">( GMT -3 ) America/Bahia</option><option value="America/Bahia_Banderas">( GMT -5 ) America/Bahia_Banderas</option><option value="America/Barbados">( GMT -4 ) America/Barbados</option><option value="America/Belem">( GMT -3 ) America/Belem</option><option value="America/Belize">( GMT -6 ) America/Belize</option><option value="America/Blanc-Sablon">( GMT -4 ) America/Blanc-Sablon</option><option value="America/Boa_Vista">( GMT -4 ) America/Boa_Vista</option><option value="America/Bogota">( GMT -5 ) America/Bogota</option><option value="America/Boise" selected="selected">( GMT -6 ) America/Boise</option><option value="America/Cambridge_Bay">( GMT -6 ) America/Cambridge_Bay</option><option value="America/Campo_Grande">( GMT -4 ) America/Campo_Grande</option><option value="America/Cancun">( GMT -5 ) America/Cancun</option><option value="America/Caracas">( GMT -4 ) America/Caracas</option><option value="America/Cayenne">( GMT -3 ) America/Cayenne</option><option value="America/Cayman">( GMT -5 ) America/Cayman</option><option value="America/Chicago">( GMT -5 ) America/Chicago</option><option value="America/Chihuahua">( GMT -6 ) America/Chihuahua</option><option value="America/Costa_Rica">( GMT -6 ) America/Costa_Rica</option><option value="America/Creston">( GMT -7 ) America/Creston</option><option value="America/Cuiaba">( GMT -4 ) America/Cuiaba</option><option value="America/Curacao">( GMT -4 ) America/Curacao</option><option value="America/Danmarkshavn">( GMT +0 ) America/Danmarkshavn</option><option value="America/Dawson">( GMT -7 ) America/Dawson</option><option value="America/Dawson_Creek">( GMT -7 ) America/Dawson_Creek</option><option value="America/Denver">( GMT -6 ) America/Denver</option><option value="America/Detroit">( GMT -4 ) America/Detroit</option><option value="America/Dominica">( GMT -4 ) America/Dominica</option><option value="America/Edmonton">( GMT -6 ) America/Edmonton</option><option value="America/Eirunepe">( GMT -5 ) America/Eirunepe</option><option value="America/El_Salvador">( GMT -6 ) America/El_Salvador</option><option value="America/Fort_Nelson">( GMT -7 ) America/Fort_Nelson</option><option value="America/Fortaleza">( GMT -3 ) America/Fortaleza</option><option value="America/Glace_Bay">( GMT -3 ) America/Glace_Bay</option><option value="America/Godthab">( GMT -2 ) America/Godthab</option><option value="America/Goose_Bay">( GMT -3 ) America/Goose_Bay</option><option value="America/Grand_Turk">( GMT -4 ) America/Grand_Turk</option><option value="America/Grenada">( GMT -4 ) America/Grenada</option><option value="America/Guadeloupe">( GMT -4 ) America/Guadeloupe</option><option value="America/Guatemala">( GMT -6 ) America/Guatemala</option><option value="America/Guayaquil">( GMT -5 ) America/Guayaquil</option><option value="America/Guyana">( GMT -4 ) America/Guyana</option><option value="America/Halifax">( GMT -3 ) America/Halifax</option><option value="America/Havana">( GMT -4 ) America/Havana</option><option value="America/Hermosillo">( GMT -7 ) America/Hermosillo</option><option value="America/Indiana/Indianapolis">( GMT -4 ) America/Indiana/Indianapolis</option><option value="America/Indiana/Knox">( GMT -5 ) America/Indiana/Knox</option><option value="America/Indiana/Marengo">( GMT -4 ) America/Indiana/Marengo</option><option value="America/Indiana/Petersburg">( GMT -4 ) America/Indiana/Petersburg</option><option value="America/Indiana/Tell_City">( GMT -5 ) America/Indiana/Tell_City</option><option value="America/Indiana/Vevay">( GMT -4 ) America/Indiana/Vevay</option><option value="America/Indiana/Vincennes">( GMT -4 ) America/Indiana/Vincennes</option><option value="America/Indiana/Winamac">( GMT -4 ) America/Indiana/Winamac</option><option value="America/Inuvik">( GMT -6 ) America/Inuvik</option><option value="America/Iqaluit">( GMT -4 ) America/Iqaluit</option><option value="America/Jamaica">( GMT -5 ) America/Jamaica</option><option value="America/Juneau">( GMT -8 ) America/Juneau</option><option value="America/Kentucky/Louisville">( GMT -4 ) America/Kentucky/Louisville</option><option value="America/Kentucky/Monticello">( GMT -4 ) America/Kentucky/Monticello</option><option value="America/Kralendijk">( GMT -4 ) America/Kralendijk</option><option value="America/La_Paz">( GMT -4 ) America/La_Paz</option><option value="America/Lima">( GMT -5 ) America/Lima</option><option value="America/Los_Angeles">( GMT -7 ) America/Los_Angeles</option><option value="America/Lower_Princes">( GMT -4 ) America/Lower_Princes</option><option value="America/Maceio">( GMT -3 ) America/Maceio</option><option value="America/Managua">( GMT -6 ) America/Managua</option><option value="America/Manaus">( GMT -4 ) America/Manaus</option><option value="America/Marigot">( GMT -4 ) America/Marigot</option><option value="America/Martinique">( GMT -4 ) America/Martinique</option><option value="America/Matamoros">( GMT -5 ) America/Matamoros</option><option value="America/Mazatlan">( GMT -6 ) America/Mazatlan</option><option value="America/Menominee">( GMT -5 ) America/Menominee</option><option value="America/Merida">( GMT -5 ) America/Merida</option><option value="America/Metlakatla">( GMT -8 ) America/Metlakatla</option><option value="America/Mexico_City">( GMT -5 ) America/Mexico_City</option><option value="America/Miquelon">( GMT -2 ) America/Miquelon</option><option value="America/Moncton">( GMT -3 ) America/Moncton</option><option value="America/Monterrey">( GMT -5 ) America/Monterrey</option><option value="America/Montevideo">( GMT -3 ) America/Montevideo</option><option value="America/Montserrat">( GMT -4 ) America/Montserrat</option><option value="America/Nassau">( GMT -4 ) America/Nassau</option><option value="America/New_York">( GMT -4 ) America/New_York</option><option value="America/Nipigon">( GMT -4 ) America/Nipigon</option><option value="America/Nome">( GMT -8 ) America/Nome</option><option value="America/Noronha">( GMT -2 ) America/Noronha</option><option value="America/North_Dakota/Beulah">( GMT -5 ) America/North_Dakota/Beulah</option><option value="America/North_Dakota/Center">( GMT -5 ) America/North_Dakota/Center</option><option value="America/North_Dakota/New_Salem">( GMT -5 ) America/North_Dakota/New_Salem</option><option value="America/Ojinaga">( GMT -6 ) America/Ojinaga</option><option value="America/Panama">( GMT -5 ) America/Panama</option><option value="America/Pangnirtung">( GMT -4 ) America/Pangnirtung</option><option value="America/Paramaribo">( GMT -3 ) America/Paramaribo</option><option value="America/Phoenix">( GMT -7 ) America/Phoenix</option><option value="America/Port-au-Prince">( GMT -5 ) America/Port-au-Prince</option><option value="America/Port_of_Spain">( GMT -4 ) America/Port_of_Spain</option><option value="America/Porto_Velho">( GMT -4 ) America/Porto_Velho</option><option value="America/Puerto_Rico">( GMT -4 ) America/Puerto_Rico</option><option value="America/Rainy_River">( GMT -5 ) America/Rainy_River</option><option value="America/Rankin_Inlet">( GMT -5 ) America/Rankin_Inlet</option><option value="America/Recife">( GMT -3 ) America/Recife</option><option value="America/Regina">( GMT -6 ) America/Regina</option><option value="America/Resolute">( GMT -5 ) America/Resolute</option><option value="America/Rio_Branco">( GMT -5 ) America/Rio_Branco</option><option value="America/Santarem">( GMT -3 ) America/Santarem</option><option value="America/Santiago">( GMT -3 ) America/Santiago</option><option value="America/Santo_Domingo">( GMT -4 ) America/Santo_Domingo</option><option value="America/Sao_Paulo">( GMT -3 ) America/Sao_Paulo</option><option value="America/Scoresbysund">( GMT +0 ) America/Scoresbysund</option><option value="America/Sitka">( GMT -8 ) America/Sitka</option><option value="America/St_Barthelemy">( GMT -4 ) America/St_Barthelemy</option><option value="America/St_Johns">( GMT -3 ) America/St_Johns</option><option value="America/St_Kitts">( GMT -4 ) America/St_Kitts</option><option value="America/St_Lucia">( GMT -4 ) America/St_Lucia</option><option value="America/St_Thomas">( GMT -4 ) America/St_Thomas</option><option value="America/St_Vincent">( GMT -4 ) America/St_Vincent</option><option value="America/Swift_Current">( GMT -6 ) America/Swift_Current</option><option value="America/Tegucigalpa">( GMT -6 ) America/Tegucigalpa</option><option value="America/Thule">( GMT -3 ) America/Thule</option><option value="America/Thunder_Bay">( GMT -4 ) America/Thunder_Bay</option><option value="America/Tijuana">( GMT -7 ) America/Tijuana</option><option value="America/Toronto">( GMT -4 ) America/Toronto</option><option value="America/Tortola">( GMT -4 ) America/Tortola</option><option value="America/Vancouver">( GMT -7 ) America/Vancouver</option><option value="America/Whitehorse">( GMT -7 ) America/Whitehorse</option><option value="America/Winnipeg">( GMT -5 ) America/Winnipeg</option><option value="America/Yakutat">( GMT -8 ) America/Yakutat</option><option value="America/Yellowknife">( GMT -6 ) America/Yellowknife</option><option value="Antarctica/Casey">( GMT +8 ) Antarctica/Casey</option><option value="Antarctica/Davis">( GMT +7 ) Antarctica/Davis</option><option value="Antarctica/DumontDUrville">( GMT +10 ) Antarctica/DumontDUrville</option><option value="Antarctica/Macquarie">( GMT +11 ) Antarctica/Macquarie</option><option value="Antarctica/Mawson">( GMT +5 ) Antarctica/Mawson</option><option value="Antarctica/McMurdo">( GMT +13 ) Antarctica/McMurdo</option><option value="Antarctica/Palmer">( GMT -3 ) Antarctica/Palmer</option><option value="Antarctica/Rothera">( GMT -3 ) Antarctica/Rothera</option><option value="Antarctica/Syowa">( GMT +3 ) Antarctica/Syowa</option><option value="Antarctica/Troll">( GMT +2 ) Antarctica/Troll</option><option value="Antarctica/Vostok">( GMT +6 ) Antarctica/Vostok</option><option value="Arctic/Longyearbyen">( GMT +2 ) Arctic/Longyearbyen</option><option value="Asia/Aden">( GMT +3 ) Asia/Aden</option><option value="Asia/Almaty">( GMT +6 ) Asia/Almaty</option><option value="Asia/Amman">( GMT +3 ) Asia/Amman</option><option value="Asia/Anadyr">( GMT +12 ) Asia/Anadyr</option><option value="Asia/Aqtau">( GMT +5 ) Asia/Aqtau</option><option value="Asia/Aqtobe">( GMT +5 ) Asia/Aqtobe</option><option value="Asia/Ashgabat">( GMT +5 ) Asia/Ashgabat</option><option value="Asia/Baghdad">( GMT +3 ) Asia/Baghdad</option><option value="Asia/Bahrain">( GMT +3 ) Asia/Bahrain</option><option value="Asia/Baku">( GMT +4 ) Asia/Baku</option><option value="Asia/Bangkok">( GMT +7 ) Asia/Bangkok</option><option value="Asia/Barnaul">( GMT +7 ) Asia/Barnaul</option><option value="Asia/Beirut">( GMT +3 ) Asia/Beirut</option><option value="Asia/Bishkek">( GMT +6 ) Asia/Bishkek</option><option value="Asia/Brunei">( GMT +8 ) Asia/Brunei</option><option value="Asia/Chita">( GMT +9 ) Asia/Chita</option><option value="Asia/Choibalsan">( GMT +8 ) Asia/Choibalsan</option><option value="Asia/Colombo">( GMT +5 ) Asia/Colombo</option><option value="Asia/Damascus">( GMT +3 ) Asia/Damascus</option><option value="Asia/Dhaka">( GMT +6 ) Asia/Dhaka</option><option value="Asia/Dili">( GMT +9 ) Asia/Dili</option><option value="Asia/Dubai">( GMT +4 ) Asia/Dubai</option><option value="Asia/Dushanbe">( GMT +5 ) Asia/Dushanbe</option><option value="Asia/Gaza">( GMT +3 ) Asia/Gaza</option><option value="Asia/Hebron">( GMT +3 ) Asia/Hebron</option><option value="Asia/Ho_Chi_Minh">( GMT +7 ) Asia/Ho_Chi_Minh</option><option value="Asia/Hong_Kong">( GMT +8 ) Asia/Hong_Kong</option><option value="Asia/Hovd">( GMT +7 ) Asia/Hovd</option><option value="Asia/Irkutsk">( GMT +8 ) Asia/Irkutsk</option><option value="Asia/Jakarta">( GMT +7 ) Asia/Jakarta</option><option value="Asia/Jayapura">( GMT +9 ) Asia/Jayapura</option><option value="Asia/Jerusalem">( GMT +3 ) Asia/Jerusalem</option><option value="Asia/Kabul">( GMT +4 ) Asia/Kabul</option><option value="Asia/Kamchatka">( GMT +12 ) Asia/Kamchatka</option><option value="Asia/Karachi">( GMT +5 ) Asia/Karachi</option><option value="Asia/Kathmandu">( GMT +5 ) Asia/Kathmandu</option><option value="Asia/Khandyga">( GMT +9 ) Asia/Khandyga</option><option value="Asia/Kolkata">( GMT +5 ) Asia/Kolkata</option><option value="Asia/Krasnoyarsk">( GMT +7 ) Asia/Krasnoyarsk</option><option value="Asia/Kuala_Lumpur">( GMT +8 ) Asia/Kuala_Lumpur</option><option value="Asia/Kuching">( GMT +8 ) Asia/Kuching</option><option value="Asia/Kuwait">( GMT +3 ) Asia/Kuwait</option><option value="Asia/Macau">( GMT +8 ) Asia/Macau</option><option value="Asia/Magadan">( GMT +11 ) Asia/Magadan</option><option value="Asia/Makassar">( GMT +8 ) Asia/Makassar</option><option value="Asia/Manila">( GMT +8 ) Asia/Manila</option><option value="Asia/Muscat">( GMT +4 ) Asia/Muscat</option><option value="Asia/Nicosia">( GMT +3 ) Asia/Nicosia</option><option value="Asia/Novokuznetsk">( GMT +7 ) Asia/Novokuznetsk</option><option value="Asia/Novosibirsk">( GMT +7 ) Asia/Novosibirsk</option><option value="Asia/Omsk">( GMT +6 ) Asia/Omsk</option><option value="Asia/Oral">( GMT +5 ) Asia/Oral</option><option value="Asia/Phnom_Penh">( GMT +7 ) Asia/Phnom_Penh</option><option value="Asia/Pontianak">( GMT +7 ) Asia/Pontianak</option><option value="Asia/Pyongyang">( GMT +8 ) Asia/Pyongyang</option><option value="Asia/Qatar">( GMT +3 ) Asia/Qatar</option><option value="Asia/Qyzylorda">( GMT +6 ) Asia/Qyzylorda</option><option value="Asia/Rangoon">( GMT +6 ) Asia/Rangoon</option><option value="Asia/Riyadh">( GMT +3 ) Asia/Riyadh</option><option value="Asia/Sakhalin">( GMT +11 ) Asia/Sakhalin</option><option value="Asia/Samarkand">( GMT +5 ) Asia/Samarkand</option><option value="Asia/Seoul">( GMT +9 ) Asia/Seoul</option><option value="Asia/Shanghai">( GMT +8 ) Asia/Shanghai</option><option value="Asia/Singapore">( GMT +8 ) Asia/Singapore</option><option value="Asia/Srednekolymsk">( GMT +11 ) Asia/Srednekolymsk</option><option value="Asia/Taipei">( GMT +8 ) Asia/Taipei</option><option value="Asia/Tashkent">( GMT +5 ) Asia/Tashkent</option><option value="Asia/Tbilisi">( GMT +4 ) Asia/Tbilisi</option><option value="Asia/Tehran">( GMT +3 ) Asia/Tehran</option><option value="Asia/Thimphu">( GMT +6 ) Asia/Thimphu</option><option value="Asia/Tokyo">( GMT +9 ) Asia/Tokyo</option><option value="Asia/Tomsk">( GMT +7 ) Asia/Tomsk</option><option value="Asia/Ulaanbaatar">( GMT +8 ) Asia/Ulaanbaatar</option><option value="Asia/Urumqi">( GMT +6 ) Asia/Urumqi</option><option value="Asia/Ust-Nera">( GMT +10 ) Asia/Ust-Nera</option><option value="Asia/Vientiane">( GMT +7 ) Asia/Vientiane</option><option value="Asia/Vladivostok">( GMT +10 ) Asia/Vladivostok</option><option value="Asia/Yakutsk">( GMT +9 ) Asia/Yakutsk</option><option value="Asia/Yekaterinburg">( GMT +5 ) Asia/Yekaterinburg</option><option value="Asia/Yerevan">( GMT +4 ) Asia/Yerevan</option><option value="Atlantic/Azores">( GMT +0 ) Atlantic/Azores</option><option value="Atlantic/Bermuda">( GMT -3 ) Atlantic/Bermuda</option><option value="Atlantic/Canary">( GMT +1 ) Atlantic/Canary</option><option value="Atlantic/Cape_Verde">( GMT -1 ) Atlantic/Cape_Verde</option><option value="Atlantic/Faroe">( GMT +1 ) Atlantic/Faroe</option><option value="Atlantic/Madeira">( GMT +1 ) Atlantic/Madeira</option><option value="Atlantic/Reykjavik">( GMT +0 ) Atlantic/Reykjavik</option><option value="Atlantic/South_Georgia">( GMT -2 ) Atlantic/South_Georgia</option><option value="Atlantic/St_Helena">( GMT +0 ) Atlantic/St_Helena</option><option value="Atlantic/Stanley">( GMT -3 ) Atlantic/Stanley</option><option value="Australia/Adelaide">( GMT +10 ) Australia/Adelaide</option><option value="Australia/Brisbane">( GMT +10 ) Australia/Brisbane</option><option value="Australia/Broken_Hill">( GMT +10 ) Australia/Broken_Hill</option><option value="Australia/Currie">( GMT +11 ) Australia/Currie</option><option value="Australia/Darwin">( GMT +9 ) Australia/Darwin</option><option value="Australia/Eucla">( GMT +8 ) Australia/Eucla</option><option value="Australia/Hobart">( GMT +11 ) Australia/Hobart</option><option value="Australia/Lindeman">( GMT +10 ) Australia/Lindeman</option><option value="Australia/Lord_Howe">( GMT +11 ) Australia/Lord_Howe</option><option value="Australia/Melbourne">( GMT +11 ) Australia/Melbourne</option><option value="Australia/Perth">( GMT +8 ) Australia/Perth</option><option value="Australia/Sydney">( GMT +11 ) Australia/Sydney</option><option value="Europe/Amsterdam">( GMT +2 ) Europe/Amsterdam</option><option value="Europe/Andorra">( GMT +2 ) Europe/Andorra</option><option value="Europe/Astrakhan">( GMT +4 ) Europe/Astrakhan</option><option value="Europe/Athens">( GMT +3 ) Europe/Athens</option><option value="Europe/Belgrade">( GMT +2 ) Europe/Belgrade</option><option value="Europe/Berlin">( GMT +2 ) Europe/Berlin</option><option value="Europe/Bratislava">( GMT +2 ) Europe/Bratislava</option><option value="Europe/Brussels">( GMT +2 ) Europe/Brussels</option><option value="Europe/Bucharest">( GMT +3 ) Europe/Bucharest</option><option value="Europe/Budapest">( GMT +2 ) Europe/Budapest</option><option value="Europe/Busingen">( GMT +2 ) Europe/Busingen</option><option value="Europe/Chisinau">( GMT +3 ) Europe/Chisinau</option><option value="Europe/Copenhagen">( GMT +2 ) Europe/Copenhagen</option><option value="Europe/Dublin">( GMT +1 ) Europe/Dublin</option><option value="Europe/Gibraltar">( GMT +2 ) Europe/Gibraltar</option><option value="Europe/Guernsey">( GMT +1 ) Europe/Guernsey</option><option value="Europe/Helsinki">( GMT +3 ) Europe/Helsinki</option><option value="Europe/Isle_of_Man">( GMT +1 ) Europe/Isle_of_Man</option><option value="Europe/Istanbul">( GMT +3 ) Europe/Istanbul</option><option value="Europe/Jersey">( GMT +1 ) Europe/Jersey</option><option value="Europe/Kaliningrad">( GMT +2 ) Europe/Kaliningrad</option><option value="Europe/Kiev">( GMT +3 ) Europe/Kiev</option><option value="Europe/Kirov">( GMT +3 ) Europe/Kirov</option><option value="Europe/Lisbon">( GMT +1 ) Europe/Lisbon</option><option value="Europe/Ljubljana">( GMT +2 ) Europe/Ljubljana</option><option value="Europe/London">( GMT +1 ) Europe/London</option><option value="Europe/Luxembourg">( GMT +2 ) Europe/Luxembourg</option><option value="Europe/Madrid">( GMT +2 ) Europe/Madrid</option><option value="Europe/Malta">( GMT +2 ) Europe/Malta</option><option value="Europe/Mariehamn">( GMT +3 ) Europe/Mariehamn</option><option value="Europe/Minsk">( GMT +3 ) Europe/Minsk</option><option value="Europe/Monaco">( GMT +2 ) Europe/Monaco</option><option value="Europe/Moscow">( GMT +3 ) Europe/Moscow</option><option value="Europe/Oslo">( GMT +2 ) Europe/Oslo</option><option value="Europe/Paris">( GMT +2 ) Europe/Paris</option><option value="Europe/Podgorica">( GMT +2 ) Europe/Podgorica</option><option value="Europe/Prague">( GMT +2 ) Europe/Prague</option><option value="Europe/Riga">( GMT +3 ) Europe/Riga</option><option value="Europe/Rome">( GMT +2 ) Europe/Rome</option><option value="Europe/Samara">( GMT +4 ) Europe/Samara</option><option value="Europe/San_Marino">( GMT +2 ) Europe/San_Marino</option><option value="Europe/Sarajevo">( GMT +2 ) Europe/Sarajevo</option><option value="Europe/Simferopol">( GMT +3 ) Europe/Simferopol</option><option value="Europe/Skopje">( GMT +2 ) Europe/Skopje</option><option value="Europe/Sofia">( GMT +3 ) Europe/Sofia</option><option value="Europe/Stockholm">( GMT +2 ) Europe/Stockholm</option><option value="Europe/Tallinn">( GMT +3 ) Europe/Tallinn</option><option value="Europe/Tirane">( GMT +2 ) Europe/Tirane</option><option value="Europe/Ulyanovsk">( GMT +4 ) Europe/Ulyanovsk</option><option value="Europe/Uzhgorod">( GMT +3 ) Europe/Uzhgorod</option><option value="Europe/Vaduz">( GMT +2 ) Europe/Vaduz</option><option value="Europe/Vatican">( GMT +2 ) Europe/Vatican</option><option value="Europe/Vienna">( GMT +2 ) Europe/Vienna</option><option value="Europe/Vilnius">( GMT +3 ) Europe/Vilnius</option><option value="Europe/Volgograd">( GMT +3 ) Europe/Volgograd</option><option value="Europe/Warsaw">( GMT +2 ) Europe/Warsaw</option><option value="Europe/Zagreb">( GMT +2 ) Europe/Zagreb</option><option value="Europe/Zaporozhye">( GMT +3 ) Europe/Zaporozhye</option><option value="Europe/Zurich">( GMT +2 ) Europe/Zurich</option><option value="Indian/Antananarivo">( GMT +3 ) Indian/Antananarivo</option><option value="Indian/Chagos">( GMT +6 ) Indian/Chagos</option><option value="Indian/Christmas">( GMT +7 ) Indian/Christmas</option><option value="Indian/Cocos">( GMT +6 ) Indian/Cocos</option><option value="Indian/Comoro">( GMT +3 ) Indian/Comoro</option><option value="Indian/Kerguelen">( GMT +5 ) Indian/Kerguelen</option><option value="Indian/Mahe">( GMT +4 ) Indian/Mahe</option><option value="Indian/Maldives">( GMT +5 ) Indian/Maldives</option><option value="Indian/Mauritius">( GMT +4 ) Indian/Mauritius</option><option value="Indian/Mayotte">( GMT +3 ) Indian/Mayotte</option><option value="Indian/Reunion">( GMT +4 ) Indian/Reunion</option><option value="Pacific/Apia">( GMT +14 ) Pacific/Apia</option><option value="Pacific/Auckland">( GMT +13 ) Pacific/Auckland</option><option value="Pacific/Bougainville">( GMT +11 ) Pacific/Bougainville</option><option value="Pacific/Chatham">( GMT +13 ) Pacific/Chatham</option><option value="Pacific/Chuuk">( GMT +10 ) Pacific/Chuuk</option><option value="Pacific/Easter">( GMT -5 ) Pacific/Easter</option><option value="Pacific/Efate">( GMT +11 ) Pacific/Efate</option><option value="Pacific/Enderbury">( GMT +13 ) Pacific/Enderbury</option><option value="Pacific/Fakaofo">( GMT +13 ) Pacific/Fakaofo</option><option value="Pacific/Fiji">( GMT +12 ) Pacific/Fiji</option><option value="Pacific/Funafuti">( GMT +12 ) Pacific/Funafuti</option><option value="Pacific/Galapagos">( GMT -6 ) Pacific/Galapagos</option><option value="Pacific/Gambier">( GMT -9 ) Pacific/Gambier</option><option value="Pacific/Guadalcanal">( GMT +11 ) Pacific/Guadalcanal</option><option value="Pacific/Guam">( GMT +10 ) Pacific/Guam</option><option value="Pacific/Honolulu">( GMT -10 ) Pacific/Honolulu</option><option value="Pacific/Johnston">( GMT -10 ) Pacific/Johnston</option><option value="Pacific/Kiritimati">( GMT +14 ) Pacific/Kiritimati</option><option value="Pacific/Kosrae">( GMT +11 ) Pacific/Kosrae</option><option value="Pacific/Kwajalein">( GMT +12 ) Pacific/Kwajalein</option><option value="Pacific/Majuro">( GMT +12 ) Pacific/Majuro</option><option value="Pacific/Marquesas">( GMT -10 ) Pacific/Marquesas</option><option value="Pacific/Midway">( GMT -11 ) Pacific/Midway</option><option value="Pacific/Nauru">( GMT +12 ) Pacific/Nauru</option><option value="Pacific/Niue">( GMT -11 ) Pacific/Niue</option><option value="Pacific/Norfolk">( GMT +11 ) Pacific/Norfolk</option><option value="Pacific/Noumea">( GMT +11 ) Pacific/Noumea</option><option value="Pacific/Pago_Pago">( GMT -11 ) Pacific/Pago_Pago</option><option value="Pacific/Palau">( GMT +9 ) Pacific/Palau</option><option value="Pacific/Pitcairn">( GMT -8 ) Pacific/Pitcairn</option><option value="Pacific/Pohnpei">( GMT +11 ) Pacific/Pohnpei</option><option value="Pacific/Port_Moresby">( GMT +10 ) Pacific/Port_Moresby</option><option value="Pacific/Rarotonga">( GMT -10 ) Pacific/Rarotonga</option><option value="Pacific/Saipan">( GMT +10 ) Pacific/Saipan</option><option value="Pacific/Tahiti">( GMT -10 ) Pacific/Tahiti</option><option value="Pacific/Tarawa">( GMT +12 ) Pacific/Tarawa</option><option value="Pacific/Tongatapu">( GMT +13 ) Pacific/Tongatapu</option><option value="Pacific/Wake">( GMT +12 ) Pacific/Wake</option><option value="Pacific/Wallis">( GMT +12 ) Pacific/Wallis</option></select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-7">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-7 control-label" style="margin-left: 14px;"><input id="countdown" type="checkbox" checked>Show a countdown timer</label></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="tickets-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 214px;">Select one or more tickets (max 5).</div>' +
                '<div id="ticketentry-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="ac-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>' +
                '<div id="acentry-table"></div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhPPV.validateFinalStep()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        $('#any_time').change(function () {
            if ($('#any_time').prop('checked')) {
                $('#datetimepicker1').attr('disabled', '');
                $('#datetimepicker2').attr('disabled', '');
                $('#end-date').attr('disabled', '');
                $('#time-zone').attr('disabled', '');
                $('#countdown').attr('disabled', '');
                $('#scheduling-wrapper .control-label').css('color', '#999');
                $('#end-date').prop('checked', false);
                $('#countdown').prop('checked', false);
            }
        });

        $('#range').change(function () {
            if ($('#range').prop('checked')) {
                $('#datetimepicker1').removeAttr('disabled');
                $('#end-date').removeAttr('disabled');
                $('#time-zone').removeAttr('disabled');
                $('#countdown').removeAttr('disabled');
                $('#scheduling-wrapper .control-label').css('color', '#000');
            }
        });

        $('#end-date').change(function () {
            if ($('#end-date').prop('checked')) {
                $('#datetimepicker2').removeAttr('disabled');
            } else {
                $('#datetimepicker2').attr('disabled', '');
                $('#datetimepicker2').val('');
            }
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true,
            useCurrent: false
        });
        $("#datetimepicker1").on("dp.change", function (e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker2").on("dp.change", function (e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });
        var timezone = jstz.determine();
        var tz_name = timezone.name();
        $('select#time-zone').val(tz_name);

        smhPPV.activateWizard();
        smhPPV.getMediaEntries();
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
        $('#smh-modal #ppv-entries-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
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
        $('#smh-modal #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal2 .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhPPV.getMediaEntries();
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
                smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
        });

        $('#smh-modal #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
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
            smhPPV.getMediaEntries();
        });
    },
    //Playlist Entry Modal
    addPlistEntry: function () {
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 20%;" class="active"><a href="#select-plist-tab" data-toggle="tab">SELECT PLAYLIST</a></li>' +
                '<li style="width: 20%;"><a href="#details-tab" data-toggle="tab">ENTRY DETAILS</a></li>' +
                '<li style="width: 20%;"><a href="#scheduling-tab" data-toggle="tab">SCHEDULING</a></li>' +
                '<li style="width: 20%;"><a href="#tickets-tab" data-toggle="tab">TICKET(S)</a></li>' +
                '<li style="width: 20%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="select-plist-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 245px;">Select the playlist you would like to sell.<br><small>*Note: You must have at least 1 manual Playlist</small></div>' +
                '<div id="ppv-playlist-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="details-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 20px;">Entry Details</div>' +
                '<div id="details"></div>' +
                '</div>' +
                '<div class="tab-pane" id="scheduling-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">Scheduling determines when your entry will be permitted for viewing and when access should be discontinued.<br>The ability to set a start time also allows for a presale window.</div>' +
                '<div id="scheduling-wrapper">' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="any_time" id="any_time" name="scheduling" checked> Any Time</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="range" id="range" name="scheduling"> Specific Range</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8" style="margin-top: 20px;">' +
                '<div class="form-group">' +
                '<label for="datetimepicker1" class="col-xs-4 control-label">Start Date:</label>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker1" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label"><input style="width=33px" id="end-date" type="checkbox" disabled>End Date:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker2" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label" style="padding-left: 0px;">Time Zone:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<select class="form-control" id="time-zone" style="margin: auto; width: 294px;" disabled><option value="Africa/Abidjan">( GMT +0 ) Africa/Abidjan</option><option value="Africa/Accra">( GMT +0 ) Africa/Accra</option><option value="Africa/Addis_Ababa">( GMT +3 ) Africa/Addis_Ababa</option><option value="Africa/Algiers">( GMT +1 ) Africa/Algiers</option><option value="Africa/Asmara">( GMT +3 ) Africa/Asmara</option><option value="Africa/Bamako">( GMT +0 ) Africa/Bamako</option><option value="Africa/Bangui">( GMT +1 ) Africa/Bangui</option><option value="Africa/Banjul">( GMT +0 ) Africa/Banjul</option><option value="Africa/Bissau">( GMT +0 ) Africa/Bissau</option><option value="Africa/Blantyre">( GMT +2 ) Africa/Blantyre</option><option value="Africa/Brazzaville">( GMT +1 ) Africa/Brazzaville</option><option value="Africa/Bujumbura">( GMT +2 ) Africa/Bujumbura</option><option value="Africa/Cairo">( GMT +2 ) Africa/Cairo</option><option value="Africa/Casablanca">( GMT +1 ) Africa/Casablanca</option><option value="Africa/Ceuta">( GMT +2 ) Africa/Ceuta</option><option value="Africa/Conakry">( GMT +0 ) Africa/Conakry</option><option value="Africa/Dakar">( GMT +0 ) Africa/Dakar</option><option value="Africa/Dar_es_Salaam">( GMT +3 ) Africa/Dar_es_Salaam</option><option value="Africa/Djibouti">( GMT +3 ) Africa/Djibouti</option><option value="Africa/Douala">( GMT +1 ) Africa/Douala</option><option value="Africa/El_Aaiun">( GMT +1 ) Africa/El_Aaiun</option><option value="Africa/Freetown">( GMT +0 ) Africa/Freetown</option><option value="Africa/Gaborone">( GMT +2 ) Africa/Gaborone</option><option value="Africa/Harare">( GMT +2 ) Africa/Harare</option><option value="Africa/Johannesburg">( GMT +2 ) Africa/Johannesburg</option><option value="Africa/Juba">( GMT +3 ) Africa/Juba</option><option value="Africa/Kampala">( GMT +3 ) Africa/Kampala</option><option value="Africa/Khartoum">( GMT +3 ) Africa/Khartoum</option><option value="Africa/Kigali">( GMT +2 ) Africa/Kigali</option><option value="Africa/Kinshasa">( GMT +1 ) Africa/Kinshasa</option><option value="Africa/Lagos">( GMT +1 ) Africa/Lagos</option><option value="Africa/Libreville">( GMT +1 ) Africa/Libreville</option><option value="Africa/Lome">( GMT +0 ) Africa/Lome</option><option value="Africa/Luanda">( GMT +1 ) Africa/Luanda</option><option value="Africa/Lubumbashi">( GMT +2 ) Africa/Lubumbashi</option><option value="Africa/Lusaka">( GMT +2 ) Africa/Lusaka</option><option value="Africa/Malabo">( GMT +1 ) Africa/Malabo</option><option value="Africa/Maputo">( GMT +2 ) Africa/Maputo</option><option value="Africa/Maseru">( GMT +2 ) Africa/Maseru</option><option value="Africa/Mbabane">( GMT +2 ) Africa/Mbabane</option><option value="Africa/Mogadishu">( GMT +3 ) Africa/Mogadishu</option><option value="Africa/Monrovia">( GMT +0 ) Africa/Monrovia</option><option value="Africa/Nairobi">( GMT +3 ) Africa/Nairobi</option><option value="Africa/Ndjamena">( GMT +1 ) Africa/Ndjamena</option><option value="Africa/Niamey">( GMT +1 ) Africa/Niamey</option><option value="Africa/Nouakchott">( GMT +0 ) Africa/Nouakchott</option><option value="Africa/Ouagadougou">( GMT +0 ) Africa/Ouagadougou</option><option value="Africa/Porto-Novo">( GMT +1 ) Africa/Porto-Novo</option><option value="Africa/Sao_Tome">( GMT +0 ) Africa/Sao_Tome</option><option value="Africa/Tripoli">( GMT +2 ) Africa/Tripoli</option><option value="Africa/Tunis">( GMT +1 ) Africa/Tunis</option><option value="Africa/Windhoek">( GMT +2 ) Africa/Windhoek</option><option value="America/Adak">( GMT -9 ) America/Adak</option><option value="America/Anchorage">( GMT -8 ) America/Anchorage</option><option value="America/Anguilla">( GMT -4 ) America/Anguilla</option><option value="America/Antigua">( GMT -4 ) America/Antigua</option><option value="America/Araguaina">( GMT -3 ) America/Araguaina</option><option value="America/Argentina/Buenos_Aires">( GMT -3 ) America/Argentina/Buenos_Aires</option><option value="America/Argentina/Catamarca">( GMT -3 ) America/Argentina/Catamarca</option><option value="America/Argentina/Cordoba">( GMT -3 ) America/Argentina/Cordoba</option><option value="America/Argentina/Jujuy">( GMT -3 ) America/Argentina/Jujuy</option><option value="America/Argentina/La_Rioja">( GMT -3 ) America/Argentina/La_Rioja</option><option value="America/Argentina/Mendoza">( GMT -3 ) America/Argentina/Mendoza</option><option value="America/Argentina/Rio_Gallegos">( GMT -3 ) America/Argentina/Rio_Gallegos</option><option value="America/Argentina/Salta">( GMT -3 ) America/Argentina/Salta</option><option value="America/Argentina/San_Juan">( GMT -3 ) America/Argentina/San_Juan</option><option value="America/Argentina/San_Luis">( GMT -3 ) America/Argentina/San_Luis</option><option value="America/Argentina/Tucuman">( GMT -3 ) America/Argentina/Tucuman</option><option value="America/Argentina/Ushuaia">( GMT -3 ) America/Argentina/Ushuaia</option><option value="America/Aruba">( GMT -4 ) America/Aruba</option><option value="America/Asuncion">( GMT -3 ) America/Asuncion</option><option value="America/Atikokan">( GMT -5 ) America/Atikokan</option><option value="America/Bahia">( GMT -3 ) America/Bahia</option><option value="America/Bahia_Banderas">( GMT -5 ) America/Bahia_Banderas</option><option value="America/Barbados">( GMT -4 ) America/Barbados</option><option value="America/Belem">( GMT -3 ) America/Belem</option><option value="America/Belize">( GMT -6 ) America/Belize</option><option value="America/Blanc-Sablon">( GMT -4 ) America/Blanc-Sablon</option><option value="America/Boa_Vista">( GMT -4 ) America/Boa_Vista</option><option value="America/Bogota">( GMT -5 ) America/Bogota</option><option value="America/Boise" selected="selected">( GMT -6 ) America/Boise</option><option value="America/Cambridge_Bay">( GMT -6 ) America/Cambridge_Bay</option><option value="America/Campo_Grande">( GMT -4 ) America/Campo_Grande</option><option value="America/Cancun">( GMT -5 ) America/Cancun</option><option value="America/Caracas">( GMT -4 ) America/Caracas</option><option value="America/Cayenne">( GMT -3 ) America/Cayenne</option><option value="America/Cayman">( GMT -5 ) America/Cayman</option><option value="America/Chicago">( GMT -5 ) America/Chicago</option><option value="America/Chihuahua">( GMT -6 ) America/Chihuahua</option><option value="America/Costa_Rica">( GMT -6 ) America/Costa_Rica</option><option value="America/Creston">( GMT -7 ) America/Creston</option><option value="America/Cuiaba">( GMT -4 ) America/Cuiaba</option><option value="America/Curacao">( GMT -4 ) America/Curacao</option><option value="America/Danmarkshavn">( GMT +0 ) America/Danmarkshavn</option><option value="America/Dawson">( GMT -7 ) America/Dawson</option><option value="America/Dawson_Creek">( GMT -7 ) America/Dawson_Creek</option><option value="America/Denver">( GMT -6 ) America/Denver</option><option value="America/Detroit">( GMT -4 ) America/Detroit</option><option value="America/Dominica">( GMT -4 ) America/Dominica</option><option value="America/Edmonton">( GMT -6 ) America/Edmonton</option><option value="America/Eirunepe">( GMT -5 ) America/Eirunepe</option><option value="America/El_Salvador">( GMT -6 ) America/El_Salvador</option><option value="America/Fort_Nelson">( GMT -7 ) America/Fort_Nelson</option><option value="America/Fortaleza">( GMT -3 ) America/Fortaleza</option><option value="America/Glace_Bay">( GMT -3 ) America/Glace_Bay</option><option value="America/Godthab">( GMT -2 ) America/Godthab</option><option value="America/Goose_Bay">( GMT -3 ) America/Goose_Bay</option><option value="America/Grand_Turk">( GMT -4 ) America/Grand_Turk</option><option value="America/Grenada">( GMT -4 ) America/Grenada</option><option value="America/Guadeloupe">( GMT -4 ) America/Guadeloupe</option><option value="America/Guatemala">( GMT -6 ) America/Guatemala</option><option value="America/Guayaquil">( GMT -5 ) America/Guayaquil</option><option value="America/Guyana">( GMT -4 ) America/Guyana</option><option value="America/Halifax">( GMT -3 ) America/Halifax</option><option value="America/Havana">( GMT -4 ) America/Havana</option><option value="America/Hermosillo">( GMT -7 ) America/Hermosillo</option><option value="America/Indiana/Indianapolis">( GMT -4 ) America/Indiana/Indianapolis</option><option value="America/Indiana/Knox">( GMT -5 ) America/Indiana/Knox</option><option value="America/Indiana/Marengo">( GMT -4 ) America/Indiana/Marengo</option><option value="America/Indiana/Petersburg">( GMT -4 ) America/Indiana/Petersburg</option><option value="America/Indiana/Tell_City">( GMT -5 ) America/Indiana/Tell_City</option><option value="America/Indiana/Vevay">( GMT -4 ) America/Indiana/Vevay</option><option value="America/Indiana/Vincennes">( GMT -4 ) America/Indiana/Vincennes</option><option value="America/Indiana/Winamac">( GMT -4 ) America/Indiana/Winamac</option><option value="America/Inuvik">( GMT -6 ) America/Inuvik</option><option value="America/Iqaluit">( GMT -4 ) America/Iqaluit</option><option value="America/Jamaica">( GMT -5 ) America/Jamaica</option><option value="America/Juneau">( GMT -8 ) America/Juneau</option><option value="America/Kentucky/Louisville">( GMT -4 ) America/Kentucky/Louisville</option><option value="America/Kentucky/Monticello">( GMT -4 ) America/Kentucky/Monticello</option><option value="America/Kralendijk">( GMT -4 ) America/Kralendijk</option><option value="America/La_Paz">( GMT -4 ) America/La_Paz</option><option value="America/Lima">( GMT -5 ) America/Lima</option><option value="America/Los_Angeles">( GMT -7 ) America/Los_Angeles</option><option value="America/Lower_Princes">( GMT -4 ) America/Lower_Princes</option><option value="America/Maceio">( GMT -3 ) America/Maceio</option><option value="America/Managua">( GMT -6 ) America/Managua</option><option value="America/Manaus">( GMT -4 ) America/Manaus</option><option value="America/Marigot">( GMT -4 ) America/Marigot</option><option value="America/Martinique">( GMT -4 ) America/Martinique</option><option value="America/Matamoros">( GMT -5 ) America/Matamoros</option><option value="America/Mazatlan">( GMT -6 ) America/Mazatlan</option><option value="America/Menominee">( GMT -5 ) America/Menominee</option><option value="America/Merida">( GMT -5 ) America/Merida</option><option value="America/Metlakatla">( GMT -8 ) America/Metlakatla</option><option value="America/Mexico_City">( GMT -5 ) America/Mexico_City</option><option value="America/Miquelon">( GMT -2 ) America/Miquelon</option><option value="America/Moncton">( GMT -3 ) America/Moncton</option><option value="America/Monterrey">( GMT -5 ) America/Monterrey</option><option value="America/Montevideo">( GMT -3 ) America/Montevideo</option><option value="America/Montserrat">( GMT -4 ) America/Montserrat</option><option value="America/Nassau">( GMT -4 ) America/Nassau</option><option value="America/New_York">( GMT -4 ) America/New_York</option><option value="America/Nipigon">( GMT -4 ) America/Nipigon</option><option value="America/Nome">( GMT -8 ) America/Nome</option><option value="America/Noronha">( GMT -2 ) America/Noronha</option><option value="America/North_Dakota/Beulah">( GMT -5 ) America/North_Dakota/Beulah</option><option value="America/North_Dakota/Center">( GMT -5 ) America/North_Dakota/Center</option><option value="America/North_Dakota/New_Salem">( GMT -5 ) America/North_Dakota/New_Salem</option><option value="America/Ojinaga">( GMT -6 ) America/Ojinaga</option><option value="America/Panama">( GMT -5 ) America/Panama</option><option value="America/Pangnirtung">( GMT -4 ) America/Pangnirtung</option><option value="America/Paramaribo">( GMT -3 ) America/Paramaribo</option><option value="America/Phoenix">( GMT -7 ) America/Phoenix</option><option value="America/Port-au-Prince">( GMT -5 ) America/Port-au-Prince</option><option value="America/Port_of_Spain">( GMT -4 ) America/Port_of_Spain</option><option value="America/Porto_Velho">( GMT -4 ) America/Porto_Velho</option><option value="America/Puerto_Rico">( GMT -4 ) America/Puerto_Rico</option><option value="America/Rainy_River">( GMT -5 ) America/Rainy_River</option><option value="America/Rankin_Inlet">( GMT -5 ) America/Rankin_Inlet</option><option value="America/Recife">( GMT -3 ) America/Recife</option><option value="America/Regina">( GMT -6 ) America/Regina</option><option value="America/Resolute">( GMT -5 ) America/Resolute</option><option value="America/Rio_Branco">( GMT -5 ) America/Rio_Branco</option><option value="America/Santarem">( GMT -3 ) America/Santarem</option><option value="America/Santiago">( GMT -3 ) America/Santiago</option><option value="America/Santo_Domingo">( GMT -4 ) America/Santo_Domingo</option><option value="America/Sao_Paulo">( GMT -3 ) America/Sao_Paulo</option><option value="America/Scoresbysund">( GMT +0 ) America/Scoresbysund</option><option value="America/Sitka">( GMT -8 ) America/Sitka</option><option value="America/St_Barthelemy">( GMT -4 ) America/St_Barthelemy</option><option value="America/St_Johns">( GMT -3 ) America/St_Johns</option><option value="America/St_Kitts">( GMT -4 ) America/St_Kitts</option><option value="America/St_Lucia">( GMT -4 ) America/St_Lucia</option><option value="America/St_Thomas">( GMT -4 ) America/St_Thomas</option><option value="America/St_Vincent">( GMT -4 ) America/St_Vincent</option><option value="America/Swift_Current">( GMT -6 ) America/Swift_Current</option><option value="America/Tegucigalpa">( GMT -6 ) America/Tegucigalpa</option><option value="America/Thule">( GMT -3 ) America/Thule</option><option value="America/Thunder_Bay">( GMT -4 ) America/Thunder_Bay</option><option value="America/Tijuana">( GMT -7 ) America/Tijuana</option><option value="America/Toronto">( GMT -4 ) America/Toronto</option><option value="America/Tortola">( GMT -4 ) America/Tortola</option><option value="America/Vancouver">( GMT -7 ) America/Vancouver</option><option value="America/Whitehorse">( GMT -7 ) America/Whitehorse</option><option value="America/Winnipeg">( GMT -5 ) America/Winnipeg</option><option value="America/Yakutat">( GMT -8 ) America/Yakutat</option><option value="America/Yellowknife">( GMT -6 ) America/Yellowknife</option><option value="Antarctica/Casey">( GMT +8 ) Antarctica/Casey</option><option value="Antarctica/Davis">( GMT +7 ) Antarctica/Davis</option><option value="Antarctica/DumontDUrville">( GMT +10 ) Antarctica/DumontDUrville</option><option value="Antarctica/Macquarie">( GMT +11 ) Antarctica/Macquarie</option><option value="Antarctica/Mawson">( GMT +5 ) Antarctica/Mawson</option><option value="Antarctica/McMurdo">( GMT +13 ) Antarctica/McMurdo</option><option value="Antarctica/Palmer">( GMT -3 ) Antarctica/Palmer</option><option value="Antarctica/Rothera">( GMT -3 ) Antarctica/Rothera</option><option value="Antarctica/Syowa">( GMT +3 ) Antarctica/Syowa</option><option value="Antarctica/Troll">( GMT +2 ) Antarctica/Troll</option><option value="Antarctica/Vostok">( GMT +6 ) Antarctica/Vostok</option><option value="Arctic/Longyearbyen">( GMT +2 ) Arctic/Longyearbyen</option><option value="Asia/Aden">( GMT +3 ) Asia/Aden</option><option value="Asia/Almaty">( GMT +6 ) Asia/Almaty</option><option value="Asia/Amman">( GMT +3 ) Asia/Amman</option><option value="Asia/Anadyr">( GMT +12 ) Asia/Anadyr</option><option value="Asia/Aqtau">( GMT +5 ) Asia/Aqtau</option><option value="Asia/Aqtobe">( GMT +5 ) Asia/Aqtobe</option><option value="Asia/Ashgabat">( GMT +5 ) Asia/Ashgabat</option><option value="Asia/Baghdad">( GMT +3 ) Asia/Baghdad</option><option value="Asia/Bahrain">( GMT +3 ) Asia/Bahrain</option><option value="Asia/Baku">( GMT +4 ) Asia/Baku</option><option value="Asia/Bangkok">( GMT +7 ) Asia/Bangkok</option><option value="Asia/Barnaul">( GMT +7 ) Asia/Barnaul</option><option value="Asia/Beirut">( GMT +3 ) Asia/Beirut</option><option value="Asia/Bishkek">( GMT +6 ) Asia/Bishkek</option><option value="Asia/Brunei">( GMT +8 ) Asia/Brunei</option><option value="Asia/Chita">( GMT +9 ) Asia/Chita</option><option value="Asia/Choibalsan">( GMT +8 ) Asia/Choibalsan</option><option value="Asia/Colombo">( GMT +5 ) Asia/Colombo</option><option value="Asia/Damascus">( GMT +3 ) Asia/Damascus</option><option value="Asia/Dhaka">( GMT +6 ) Asia/Dhaka</option><option value="Asia/Dili">( GMT +9 ) Asia/Dili</option><option value="Asia/Dubai">( GMT +4 ) Asia/Dubai</option><option value="Asia/Dushanbe">( GMT +5 ) Asia/Dushanbe</option><option value="Asia/Gaza">( GMT +3 ) Asia/Gaza</option><option value="Asia/Hebron">( GMT +3 ) Asia/Hebron</option><option value="Asia/Ho_Chi_Minh">( GMT +7 ) Asia/Ho_Chi_Minh</option><option value="Asia/Hong_Kong">( GMT +8 ) Asia/Hong_Kong</option><option value="Asia/Hovd">( GMT +7 ) Asia/Hovd</option><option value="Asia/Irkutsk">( GMT +8 ) Asia/Irkutsk</option><option value="Asia/Jakarta">( GMT +7 ) Asia/Jakarta</option><option value="Asia/Jayapura">( GMT +9 ) Asia/Jayapura</option><option value="Asia/Jerusalem">( GMT +3 ) Asia/Jerusalem</option><option value="Asia/Kabul">( GMT +4 ) Asia/Kabul</option><option value="Asia/Kamchatka">( GMT +12 ) Asia/Kamchatka</option><option value="Asia/Karachi">( GMT +5 ) Asia/Karachi</option><option value="Asia/Kathmandu">( GMT +5 ) Asia/Kathmandu</option><option value="Asia/Khandyga">( GMT +9 ) Asia/Khandyga</option><option value="Asia/Kolkata">( GMT +5 ) Asia/Kolkata</option><option value="Asia/Krasnoyarsk">( GMT +7 ) Asia/Krasnoyarsk</option><option value="Asia/Kuala_Lumpur">( GMT +8 ) Asia/Kuala_Lumpur</option><option value="Asia/Kuching">( GMT +8 ) Asia/Kuching</option><option value="Asia/Kuwait">( GMT +3 ) Asia/Kuwait</option><option value="Asia/Macau">( GMT +8 ) Asia/Macau</option><option value="Asia/Magadan">( GMT +11 ) Asia/Magadan</option><option value="Asia/Makassar">( GMT +8 ) Asia/Makassar</option><option value="Asia/Manila">( GMT +8 ) Asia/Manila</option><option value="Asia/Muscat">( GMT +4 ) Asia/Muscat</option><option value="Asia/Nicosia">( GMT +3 ) Asia/Nicosia</option><option value="Asia/Novokuznetsk">( GMT +7 ) Asia/Novokuznetsk</option><option value="Asia/Novosibirsk">( GMT +7 ) Asia/Novosibirsk</option><option value="Asia/Omsk">( GMT +6 ) Asia/Omsk</option><option value="Asia/Oral">( GMT +5 ) Asia/Oral</option><option value="Asia/Phnom_Penh">( GMT +7 ) Asia/Phnom_Penh</option><option value="Asia/Pontianak">( GMT +7 ) Asia/Pontianak</option><option value="Asia/Pyongyang">( GMT +8 ) Asia/Pyongyang</option><option value="Asia/Qatar">( GMT +3 ) Asia/Qatar</option><option value="Asia/Qyzylorda">( GMT +6 ) Asia/Qyzylorda</option><option value="Asia/Rangoon">( GMT +6 ) Asia/Rangoon</option><option value="Asia/Riyadh">( GMT +3 ) Asia/Riyadh</option><option value="Asia/Sakhalin">( GMT +11 ) Asia/Sakhalin</option><option value="Asia/Samarkand">( GMT +5 ) Asia/Samarkand</option><option value="Asia/Seoul">( GMT +9 ) Asia/Seoul</option><option value="Asia/Shanghai">( GMT +8 ) Asia/Shanghai</option><option value="Asia/Singapore">( GMT +8 ) Asia/Singapore</option><option value="Asia/Srednekolymsk">( GMT +11 ) Asia/Srednekolymsk</option><option value="Asia/Taipei">( GMT +8 ) Asia/Taipei</option><option value="Asia/Tashkent">( GMT +5 ) Asia/Tashkent</option><option value="Asia/Tbilisi">( GMT +4 ) Asia/Tbilisi</option><option value="Asia/Tehran">( GMT +3 ) Asia/Tehran</option><option value="Asia/Thimphu">( GMT +6 ) Asia/Thimphu</option><option value="Asia/Tokyo">( GMT +9 ) Asia/Tokyo</option><option value="Asia/Tomsk">( GMT +7 ) Asia/Tomsk</option><option value="Asia/Ulaanbaatar">( GMT +8 ) Asia/Ulaanbaatar</option><option value="Asia/Urumqi">( GMT +6 ) Asia/Urumqi</option><option value="Asia/Ust-Nera">( GMT +10 ) Asia/Ust-Nera</option><option value="Asia/Vientiane">( GMT +7 ) Asia/Vientiane</option><option value="Asia/Vladivostok">( GMT +10 ) Asia/Vladivostok</option><option value="Asia/Yakutsk">( GMT +9 ) Asia/Yakutsk</option><option value="Asia/Yekaterinburg">( GMT +5 ) Asia/Yekaterinburg</option><option value="Asia/Yerevan">( GMT +4 ) Asia/Yerevan</option><option value="Atlantic/Azores">( GMT +0 ) Atlantic/Azores</option><option value="Atlantic/Bermuda">( GMT -3 ) Atlantic/Bermuda</option><option value="Atlantic/Canary">( GMT +1 ) Atlantic/Canary</option><option value="Atlantic/Cape_Verde">( GMT -1 ) Atlantic/Cape_Verde</option><option value="Atlantic/Faroe">( GMT +1 ) Atlantic/Faroe</option><option value="Atlantic/Madeira">( GMT +1 ) Atlantic/Madeira</option><option value="Atlantic/Reykjavik">( GMT +0 ) Atlantic/Reykjavik</option><option value="Atlantic/South_Georgia">( GMT -2 ) Atlantic/South_Georgia</option><option value="Atlantic/St_Helena">( GMT +0 ) Atlantic/St_Helena</option><option value="Atlantic/Stanley">( GMT -3 ) Atlantic/Stanley</option><option value="Australia/Adelaide">( GMT +10 ) Australia/Adelaide</option><option value="Australia/Brisbane">( GMT +10 ) Australia/Brisbane</option><option value="Australia/Broken_Hill">( GMT +10 ) Australia/Broken_Hill</option><option value="Australia/Currie">( GMT +11 ) Australia/Currie</option><option value="Australia/Darwin">( GMT +9 ) Australia/Darwin</option><option value="Australia/Eucla">( GMT +8 ) Australia/Eucla</option><option value="Australia/Hobart">( GMT +11 ) Australia/Hobart</option><option value="Australia/Lindeman">( GMT +10 ) Australia/Lindeman</option><option value="Australia/Lord_Howe">( GMT +11 ) Australia/Lord_Howe</option><option value="Australia/Melbourne">( GMT +11 ) Australia/Melbourne</option><option value="Australia/Perth">( GMT +8 ) Australia/Perth</option><option value="Australia/Sydney">( GMT +11 ) Australia/Sydney</option><option value="Europe/Amsterdam">( GMT +2 ) Europe/Amsterdam</option><option value="Europe/Andorra">( GMT +2 ) Europe/Andorra</option><option value="Europe/Astrakhan">( GMT +4 ) Europe/Astrakhan</option><option value="Europe/Athens">( GMT +3 ) Europe/Athens</option><option value="Europe/Belgrade">( GMT +2 ) Europe/Belgrade</option><option value="Europe/Berlin">( GMT +2 ) Europe/Berlin</option><option value="Europe/Bratislava">( GMT +2 ) Europe/Bratislava</option><option value="Europe/Brussels">( GMT +2 ) Europe/Brussels</option><option value="Europe/Bucharest">( GMT +3 ) Europe/Bucharest</option><option value="Europe/Budapest">( GMT +2 ) Europe/Budapest</option><option value="Europe/Busingen">( GMT +2 ) Europe/Busingen</option><option value="Europe/Chisinau">( GMT +3 ) Europe/Chisinau</option><option value="Europe/Copenhagen">( GMT +2 ) Europe/Copenhagen</option><option value="Europe/Dublin">( GMT +1 ) Europe/Dublin</option><option value="Europe/Gibraltar">( GMT +2 ) Europe/Gibraltar</option><option value="Europe/Guernsey">( GMT +1 ) Europe/Guernsey</option><option value="Europe/Helsinki">( GMT +3 ) Europe/Helsinki</option><option value="Europe/Isle_of_Man">( GMT +1 ) Europe/Isle_of_Man</option><option value="Europe/Istanbul">( GMT +3 ) Europe/Istanbul</option><option value="Europe/Jersey">( GMT +1 ) Europe/Jersey</option><option value="Europe/Kaliningrad">( GMT +2 ) Europe/Kaliningrad</option><option value="Europe/Kiev">( GMT +3 ) Europe/Kiev</option><option value="Europe/Kirov">( GMT +3 ) Europe/Kirov</option><option value="Europe/Lisbon">( GMT +1 ) Europe/Lisbon</option><option value="Europe/Ljubljana">( GMT +2 ) Europe/Ljubljana</option><option value="Europe/London">( GMT +1 ) Europe/London</option><option value="Europe/Luxembourg">( GMT +2 ) Europe/Luxembourg</option><option value="Europe/Madrid">( GMT +2 ) Europe/Madrid</option><option value="Europe/Malta">( GMT +2 ) Europe/Malta</option><option value="Europe/Mariehamn">( GMT +3 ) Europe/Mariehamn</option><option value="Europe/Minsk">( GMT +3 ) Europe/Minsk</option><option value="Europe/Monaco">( GMT +2 ) Europe/Monaco</option><option value="Europe/Moscow">( GMT +3 ) Europe/Moscow</option><option value="Europe/Oslo">( GMT +2 ) Europe/Oslo</option><option value="Europe/Paris">( GMT +2 ) Europe/Paris</option><option value="Europe/Podgorica">( GMT +2 ) Europe/Podgorica</option><option value="Europe/Prague">( GMT +2 ) Europe/Prague</option><option value="Europe/Riga">( GMT +3 ) Europe/Riga</option><option value="Europe/Rome">( GMT +2 ) Europe/Rome</option><option value="Europe/Samara">( GMT +4 ) Europe/Samara</option><option value="Europe/San_Marino">( GMT +2 ) Europe/San_Marino</option><option value="Europe/Sarajevo">( GMT +2 ) Europe/Sarajevo</option><option value="Europe/Simferopol">( GMT +3 ) Europe/Simferopol</option><option value="Europe/Skopje">( GMT +2 ) Europe/Skopje</option><option value="Europe/Sofia">( GMT +3 ) Europe/Sofia</option><option value="Europe/Stockholm">( GMT +2 ) Europe/Stockholm</option><option value="Europe/Tallinn">( GMT +3 ) Europe/Tallinn</option><option value="Europe/Tirane">( GMT +2 ) Europe/Tirane</option><option value="Europe/Ulyanovsk">( GMT +4 ) Europe/Ulyanovsk</option><option value="Europe/Uzhgorod">( GMT +3 ) Europe/Uzhgorod</option><option value="Europe/Vaduz">( GMT +2 ) Europe/Vaduz</option><option value="Europe/Vatican">( GMT +2 ) Europe/Vatican</option><option value="Europe/Vienna">( GMT +2 ) Europe/Vienna</option><option value="Europe/Vilnius">( GMT +3 ) Europe/Vilnius</option><option value="Europe/Volgograd">( GMT +3 ) Europe/Volgograd</option><option value="Europe/Warsaw">( GMT +2 ) Europe/Warsaw</option><option value="Europe/Zagreb">( GMT +2 ) Europe/Zagreb</option><option value="Europe/Zaporozhye">( GMT +3 ) Europe/Zaporozhye</option><option value="Europe/Zurich">( GMT +2 ) Europe/Zurich</option><option value="Indian/Antananarivo">( GMT +3 ) Indian/Antananarivo</option><option value="Indian/Chagos">( GMT +6 ) Indian/Chagos</option><option value="Indian/Christmas">( GMT +7 ) Indian/Christmas</option><option value="Indian/Cocos">( GMT +6 ) Indian/Cocos</option><option value="Indian/Comoro">( GMT +3 ) Indian/Comoro</option><option value="Indian/Kerguelen">( GMT +5 ) Indian/Kerguelen</option><option value="Indian/Mahe">( GMT +4 ) Indian/Mahe</option><option value="Indian/Maldives">( GMT +5 ) Indian/Maldives</option><option value="Indian/Mauritius">( GMT +4 ) Indian/Mauritius</option><option value="Indian/Mayotte">( GMT +3 ) Indian/Mayotte</option><option value="Indian/Reunion">( GMT +4 ) Indian/Reunion</option><option value="Pacific/Apia">( GMT +14 ) Pacific/Apia</option><option value="Pacific/Auckland">( GMT +13 ) Pacific/Auckland</option><option value="Pacific/Bougainville">( GMT +11 ) Pacific/Bougainville</option><option value="Pacific/Chatham">( GMT +13 ) Pacific/Chatham</option><option value="Pacific/Chuuk">( GMT +10 ) Pacific/Chuuk</option><option value="Pacific/Easter">( GMT -5 ) Pacific/Easter</option><option value="Pacific/Efate">( GMT +11 ) Pacific/Efate</option><option value="Pacific/Enderbury">( GMT +13 ) Pacific/Enderbury</option><option value="Pacific/Fakaofo">( GMT +13 ) Pacific/Fakaofo</option><option value="Pacific/Fiji">( GMT +12 ) Pacific/Fiji</option><option value="Pacific/Funafuti">( GMT +12 ) Pacific/Funafuti</option><option value="Pacific/Galapagos">( GMT -6 ) Pacific/Galapagos</option><option value="Pacific/Gambier">( GMT -9 ) Pacific/Gambier</option><option value="Pacific/Guadalcanal">( GMT +11 ) Pacific/Guadalcanal</option><option value="Pacific/Guam">( GMT +10 ) Pacific/Guam</option><option value="Pacific/Honolulu">( GMT -10 ) Pacific/Honolulu</option><option value="Pacific/Johnston">( GMT -10 ) Pacific/Johnston</option><option value="Pacific/Kiritimati">( GMT +14 ) Pacific/Kiritimati</option><option value="Pacific/Kosrae">( GMT +11 ) Pacific/Kosrae</option><option value="Pacific/Kwajalein">( GMT +12 ) Pacific/Kwajalein</option><option value="Pacific/Majuro">( GMT +12 ) Pacific/Majuro</option><option value="Pacific/Marquesas">( GMT -10 ) Pacific/Marquesas</option><option value="Pacific/Midway">( GMT -11 ) Pacific/Midway</option><option value="Pacific/Nauru">( GMT +12 ) Pacific/Nauru</option><option value="Pacific/Niue">( GMT -11 ) Pacific/Niue</option><option value="Pacific/Norfolk">( GMT +11 ) Pacific/Norfolk</option><option value="Pacific/Noumea">( GMT +11 ) Pacific/Noumea</option><option value="Pacific/Pago_Pago">( GMT -11 ) Pacific/Pago_Pago</option><option value="Pacific/Palau">( GMT +9 ) Pacific/Palau</option><option value="Pacific/Pitcairn">( GMT -8 ) Pacific/Pitcairn</option><option value="Pacific/Pohnpei">( GMT +11 ) Pacific/Pohnpei</option><option value="Pacific/Port_Moresby">( GMT +10 ) Pacific/Port_Moresby</option><option value="Pacific/Rarotonga">( GMT -10 ) Pacific/Rarotonga</option><option value="Pacific/Saipan">( GMT +10 ) Pacific/Saipan</option><option value="Pacific/Tahiti">( GMT -10 ) Pacific/Tahiti</option><option value="Pacific/Tarawa">( GMT +12 ) Pacific/Tarawa</option><option value="Pacific/Tongatapu">( GMT +13 ) Pacific/Tongatapu</option><option value="Pacific/Wake">( GMT +12 ) Pacific/Wake</option><option value="Pacific/Wallis">( GMT +12 ) Pacific/Wallis</option></select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-7">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-7 control-label" style="margin-left: 14px;"><input id="countdown" type="checkbox" checked>Show a countdown timer</label></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="tickets-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 214px;">Select one or more tickets (max 5).</div>' +
                '<div id="ticketentry-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="ac-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>' +
                '<div id="acentry-table"></div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhPPV.validatePlistFinalStep()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        $('#any_time').change(function () {
            if ($('#any_time').prop('checked')) {
                $('#datetimepicker1').attr('disabled', '');
                $('#datetimepicker2').attr('disabled', '');
                $('#end-date').attr('disabled', '');
                $('#time-zone').attr('disabled', '');
                $('#countdown').attr('disabled', '');
                $('#scheduling-wrapper .control-label').css('color', '#999');
                $('#end-date').prop('checked', false);
                $('#countdown').prop('checked', false);
            }
        });

        $('#range').change(function () {
            if ($('#range').prop('checked')) {
                $('#datetimepicker1').removeAttr('disabled');
                $('#end-date').removeAttr('disabled');
                $('#time-zone').removeAttr('disabled');
                $('#countdown').removeAttr('disabled');
                $('#scheduling-wrapper .control-label').css('color', '#000');
            }
        });

        $('#end-date').change(function () {
            if ($('#end-date').prop('checked')) {
                $('#datetimepicker2').removeAttr('disabled');
            } else {
                $('#datetimepicker2').attr('disabled', '');
                $('#datetimepicker2').val('');
            }
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true,
            useCurrent: false
        });
        $("#datetimepicker1").on("dp.change", function (e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker2").on("dp.change", function (e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });
        var timezone = jstz.determine();
        var tz_name = timezone.name();
        $('select#time-zone').val(tz_name);

        smhPPV.activatePlistWizard();
        smhPPV.getPlaylists();
    },
    //Category Entry Modal
    addCatEntry: function () {
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Category</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 25%;" class="active"><a href="#select-plist-tab" data-toggle="tab">SELECT CATEGORY</a></li>' +
                '<li style="width: 25%;"><a href="#details-tab" data-toggle="tab">CONFIGURATION</a></li>' +
                '<li style="width: 25%;"><a href="#tickets-tab" data-toggle="tab">ASSIGN TICKET(S)</a></li>' +
                '<li style="width: 25%;"><a href="#ac-tab" data-toggle="tab">ASSIGN ACCESS CONTROL</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="select-plist-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 257px;">Select the category you would like to sell.</div>' +
                '<div id="cat-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="details-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 20px;">Entry Details</div>' +
                '<div id="details"></div>' +
                '</div>' +
                '<div class="tab-pane" id="tickets-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 214px;">Select one or more tickets (max 5).</div>' +
                '<div id="ticketentry-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="ac-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>' +
                '<div id="acentry-table"></div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhPPV.validateFinalStep()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');
        smhPPV.activateCatWizard();
        smhPPV.getCategories();
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
    },
    //View Rules
    viewRules: function (name, domains, countries, ips, flavors, advsec) {
        smhPPV.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '370px');
        $('#smh-modal2 .modal-body').css('padding', '0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });
        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + name + ' Rules</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var domians_exp = {};
        var domain_arr = '';
        var domain_names = '';
        var countries_exp = {};
        var countries_arr = '';
        var flags = '';
        var ips_exp = {};
        var ips_arr = '';
        var ip_text = '';
        var flavors_text = '';
        var flavors_exp = {};
        var flavors_arr = '';
        if (domains.indexOf('Authorized') > -1 || domains.indexOf('Blocked') > -1) {
            domians_exp = domains.split(": ");
            domain_arr = domians_exp[1].split(",");
            $.each(domain_arr, function (index, value) {
                domain_names += "<div class='rule-spacing'>" + value + "</div>";
            });
        } else {
            domians_exp[0] = 'Authorized';
            domain_names = "<div class='rule-spacing'>" + domains + "</div>";
        }
        if (countries.indexOf('Authorized') > -1 || countries.indexOf('Blocked') > -1) {
            countries_exp = countries.split(": ");
            countries_arr = countries_exp[1].split(",");
            $.each(countries_arr, function (index, value) {
                flags += "<div class='rule-spacing'>" + countries_imgs[value] + " " + countries_text[value] + "</div>";
            });
        } else {
            countries_exp[0] = 'Authorized';
            flags = "<div class='rule-spacing'>" + countries + "</div>";
        }
        if (ips.indexOf('Authorized') > -1 || ips.indexOf('Blocked') > -1) {
            ips_exp = ips.split(": ");
            ips_arr = ips_exp[1].split(",");
            $.each(ips_arr, function (index, value) {
                ip_text += "<div class='rule-spacing'>" + value + "</div>";
            });
        } else {
            ips_exp[0] = 'Authorized';
            ip_text = "<div class='rule-spacing'>" + ips + "</div>";
        }
        if (flavors.indexOf('Authorized') > -1 || flavors.indexOf('Blocked') > -1) {
            flavors_exp = flavors.split(": ");
            flavors_arr = flavors_exp[1].split(",");
            $.each(flavors_arr, function (index, value) {
                flavors_text += "<div class='rule-spacing'>" + value + "</div>";
            });
        } else {
            flavors_exp[0] = 'Authorized';
            flavors_text = "<div class='rule-spacing'>" + flavors + "</div>";
        }

        content = "<div id='rules-wrapper'>" +
                "<h4>" + domians_exp[0] + " Domains</h4>" +
                "<div class='rule-wrapper'>" + domain_names + "</div>" +
                "<h4>" + countries_exp[0] + " Countries</h4>" +
                "<div class='rule-wrapper'>" + flags + "</div>" +
                "<h4>" + ips_exp[0] + " IPs</h4>" +
                "<div class='rule-wrapper'>" + ip_text + "</div>" +
                "<h4>" + flavors_exp[0] + " Flavors</h4>" +
                "<div class='rule-wrapper'>" + flavors_text + "</div>" +
                "<h4>Advanced Security & Pay-Per-View</h4>" +
                "<div class='rule-spacing' style='margin-left: 20px;'>" + advsec + "</div>" +
                "</div>";

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2 #rules-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        $('#smh-modal2 .rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Activate wizard
    activateWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index === 1) {
                    return smhPPV.validateFirstStep();
                }
                if (index === 2) {
                    smhPPV.getEntriesTickets(false);
                    return smhPPV.saveDetails();
                }
                if (index === 3) {
                    return smhPPV.validateScheduling();
                }
                if (index === 4) {
                    return smhPPV.validateThirdStep();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    activateSingleEditWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    smhPPV.getEntriesTickets(true);
                    return smhPPV.saveDetails();
                }
                if (index == 2) {
                    return smhPPV.validateScheduling();
                }
                if (index == 3) {
                    return smhPPV.validateSecondStep();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    activatePlistEditWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    smhPPV.getEntriesTickets(true);
                    return smhPPV.savePlaylistDetails();
                }
                if (index == 2) {
                    return smhPPV.validatePlistScheduling();
                }
                if (index == 3) {
                    return smhPPV.validateSecondStep();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    activateCatEditWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    smhPPV.getEntriesTickets(true);
                    return smhPPV.saveCatDetails();
                }
                if (index == 2) {
                    return smhPPV.validateSecondStep();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    activatePlistWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    return smhPPV.validateFirstPlistStep();
                }
                if (index == 2) {
                    smhPPV.getEntriesTickets(false);
                    return smhPPV.savePlaylistDetails();
                }
                if (index === 3) {
                    return smhPPV.validatePlistScheduling();
                }
                if (index == 4) {
                    return smhPPV.validateThirdStep();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    activateCatWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    return smhPPV.validateFirstCatStep();
                }
                if (index == 2) {
                    smhPPV.getEntriesTickets(false);
                    return smhPPV.saveCatDetails();
                }
                if (index == 3) {
                    return smhPPV.validateThirdStep();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    validateFirstStep: function () {
        var radio_value = '';
        var radio_type = '';
        var radio_name = '';
        var rowcollection = ppvEntriesTable.$(".ppv-entry:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_type = checkbox_value[1];
            radio_name = checkbox_value[2];
        });

        if (radio_value == '') {
            alert('You must select an entry!');
            return false;
        } else {
            ppv_entry_id = radio_value;
            ppv_entry_type = radio_type;
            ppv_entry_name = radio_name;
            smhPPV.getEntryDetails(false);
            return true;
        }
    },
    validateFirstPlistStep: function () {
        var radio_value = '';
        var radio_type = '';
        var radio_name = '';
        var rowcollection = plistEntry.$(".ppv-plist:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_type = checkbox_value[1];
            radio_name = checkbox_value[2];
        });

        if (radio_value == '') {
            alert('You must select a playlist!');
            return false;
        } else {
            ppv_entry_id = radio_value;
            ppv_entry_type = radio_type;
            ppv_entry_name = radio_name;
            smhPPV.getPlaylistDetails(false);
            return true;
        }
    },
    validateFirstCatStep: function () {
        var radio_value = '';
        var radio_type = '';
        var radio_name = '';
        var rowcollection = catTable.$(".ppv-cat:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_type = checkbox_value[1];
            radio_name = checkbox_value[2];
        });

        if (radio_value == '') {
            alert('You must select a category!');
            return false;
        } else {
            ppv_entry_id = radio_value;
            ppv_entry_type = radio_type;
            ppv_entry_name = radio_name;
            smhPPV.getCatDetails();
            return true;
        }
    },
    validateSecondStep: function () {
        ppv_tickets = new Array();
        var rowcollection = entryTickets.$(".ppv-ticket:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            ppv_tickets.push($(elem).val());
        });

        if (ppv_tickets.length == 0) {
            alert('You must select at least one ticket!');
            return false;
        } else if (ppv_tickets.length > 5) {
            alert('You can only select a maximum of 5 tickets!');
            return false;
        } else {
            smhPPV.getACEntries(true);
            return true;
        }
    },
    validateScheduling: function () {
        var any_time = ($('#any_time').prop('checked')) ? 1 : 0;
        var range = ($('#range').prop('checked')) ? 1 : 0;
        var startD = $('#datetimepicker1').val();
        var has_end = ($('#end-date').prop('checked')) ? 1 : 0;
        var endD = $('#datetimepicker2').val();

        if (any_time) {
            smhPPV.saveScheduling(any_time, range, startD, has_end, endD);
            return true;
        } else if (range && (startD == '' || startD == null)) {
            alert('You must set a start date!');
            return false;
        } else if (has_end && (endD == '' || endD == null)) {
            alert('You must set an end date!');
            return false;
        } else {
            smhPPV.saveScheduling(any_time, range, startD, has_end, endD);
            return true;
        }
    },
    validatePlistScheduling: function () {
        var any_time = ($('#any_time').prop('checked')) ? 1 : 0;
        var range = ($('#range').prop('checked')) ? 1 : 0;
        var startD = $('#datetimepicker1').val();
        var has_end = ($('#end-date').prop('checked')) ? 1 : 0;
        var endD = $('#datetimepicker2').val();

        if (any_time) {
            smhPPV.savePlistScheduling(any_time, range, startD, has_end, endD);
            return true;
        } else if (range && (startD == '' || startD == null)) {
            alert('You must set a start date!');
            return false;
        } else if (has_end && (endD == '' || endD == null)) {
            alert('You must set an end date!');
            return false;
        } else {
            smhPPV.savePlistScheduling(any_time, range, startD, has_end, endD);
            return true;
        }
    },
    validateThirdStep: function () {
        ppv_tickets = new Array();
        var rowcollection = entryTickets.$(".ppv-ticket:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            ppv_tickets.push($(elem).val());
        });

        if (ppv_tickets.length == 0) {
            alert('You must select at least one ticket!');
            return false;
        } else if (ppv_tickets.length > 5) {
            alert('You can only select a maximum of 5 tickets!');
            return false;
        } else {
            smhPPV.getACEntries(false);
            return true;
        }
    },
    validateFinalStep: function () {
        var radio_value = '';
        var radio_name = '';
        var rowcollection = acEntry.$(".ppv-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });

        if (radio_value == '') {
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhPPV.saveSingleEntry(ac_id, ac_name);
        }
    },
    validatePlistFinalStep: function () {
        var radio_value = '';
        var radio_name = '';
        var rowcollection = acEntry.$(".ppv-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });

        if (radio_value == '') {
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhPPV.savePlistEntry(ac_id, ac_name);
        }
    },
    validateFinalEditStep: function () {
        var radio_value = '';
        var radio_name = '';
        var rowcollection = acEntry.$(".ppv-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });

        if (radio_value == '') {
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhPPV.updateSingleEntry(ac_id, ac_name);
        }
    },
    validatePlistFinalEditStep: function () {
        var radio_value = '';
        var radio_name = '';
        var rowcollection = acEntry.$(".ppv-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });

        if (radio_value == '') {
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhPPV.updatePlistEntry(ac_id, ac_name);
        }
    },
    //Saves Single PPV entry
    saveSingleEntry: function (ac_id, ac_name) {
        var kentry = ppv_entry_id;
        var kentry_name = ppv_entry_name;
        var media_type = ppv_entry_type;
        var tickets = ppv_tickets.join(',');
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name,
            ticket_ids: tickets,
            status: 1
        }
        reqUrl = ApiUrl + 'action=add_entry';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#wizard .btn-previous').attr('disabled', '');
                $('#wizard .btn-finish').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry already <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 3000);
                } else {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 3000);
                    smhPPV.getContent();
                }
            }
        });
    },
    //Updates Single PPV Entry
    updateSingleEntry: function (ac_id, ac_name) {
        var kentry = ppv_entry_id;
        var kentry_name = ppv_entry_name;
        var media_type = ppv_entry_type;
        var tickets = ppv_tickets.join(',');
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name,
            ticket_ids: tickets
        }
        reqUrl = ApiUrl + 'action=update_entry';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#wizard .btn-previous').attr('disabled', '');
                $('#wizard .btn-finish').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry does not <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 3000);
                } else {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 3000);
                    smhPPV.getContent();
                }
            }
        });
    },
    //Updates PPV Playlist Entry
    updatePlistEntry: function (ac_id, ac_name) {
        var kentry = ppv_entry_id;
        var kentry_name = ppv_entry_name;
        var media_type = ppv_entry_type;
        var tickets = ppv_tickets.join(',');
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name,
            ticket_ids: tickets
        }
        reqUrl = ApiUrl + 'action=update_entry';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#wizard .btn-previous').attr('disabled', '');
                $('#wizard .btn-finish').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry does not <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 3000);
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        playlist_id: kentry,
                        ac_id: ac_id
                    }
                    reqUrl = ApiUrl + 'action=update_playlist_entry';

                    $.ajax({
                        cache: false,
                        url: reqUrl,
                        type: 'GET',
                        data: sessData,
                        dataType: 'json',
                        success: function (data) {
                            $('#smh-modal #loading').empty();
                            $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                            setTimeout(function () {
                                $('#smh-modal #pass-result').empty();
                                $('#smh-modal').modal('hide');
                            }, 3000);
                            smhPPV.getContent();
                        }
                    });
                }
            }
        });
    },
    //Saves PPV playlist entry
    savePlistEntry: function (ac_id, ac_name) {
        var kentry = ppv_entry_id;
        var kentry_name = ppv_entry_name;
        var media_type = ppv_entry_type;
        var tickets = ppv_tickets.join(',');
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name,
            ticket_ids: tickets,
            status: 1
        }
        reqUrl = ApiUrl + 'action=add_entry';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#wizard .btn-previous').attr('disabled', '');
                $('#wizard .btn-finish').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
            },
            success: function (data) {
                if (data['error']) {
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry already <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                    }, 3000);
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        playlist_id: kentry,
                        ac_id: ac_id
                    }
                    reqUrl = ApiUrl + 'action=update_playlist_entry';

                    $.ajax({
                        cache: false,
                        url: reqUrl,
                        type: 'GET',
                        data: sessData,
                        dataType: 'json',
                        success: function (data) {
                            $('#smh-modal #loading').empty();
                            $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                            setTimeout(function () {
                                $('#smh-modal #pass-result').empty();
                                $('#smh-modal').modal('hide');
                            }, 3000);
                            smhPPV.getContent();
                        }
                    });
                }
            }
        });
    },
    //Edit PPV Entry
    editEntry: function (eid, name, type, tickets, ac_id, ac_name) {
        if (type == 1 || type == 5 || type == 100) {
            smhPPV.editSingleEntry(eid, name, type, tickets, ac_id, ac_name);
        } else if (type == 3) {
            smhPPV.editPlaylistEntry(eid, name, type, tickets, ac_id, ac_name);
        } else if (type == 6) {
            smhPPV.editCatEntry(eid, name, type, tickets, ac_id, ac_name);
        }
    },
    //Edit Single PPV Entry
    editSingleEntry: function (eid, name, type, tickets, ac_id, ac_name) {
        ppv_entry_id = eid;
        ppv_entry_name = name;
        ppv_entry_type = type;
        ppv_ac_id = ac_id;
        ppv_ac_name = ac_name;
        ppv_tickets = tickets.split('_');

        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Single Entry</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 25%;"><a href="#details-tab" data-toggle="tab">ENTRY DETAILS</a></li>' +
                '<li style="width: 25%;"><a href="#scheduling-tab" data-toggle="tab">SCHEDULING</a></li>' +
                '<li style="width: 25%;"><a href="#tickets-tab" data-toggle="tab">TICKET(S)</a></li>' +
                '<li style="width: 25%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="details-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">The following details will appear on the purchase window. Please make sure they are correct.</div>' +
                '<div id="details"></div>' +
                '</div>' +
                '<div class="tab-pane" id="scheduling-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">Scheduling determines when your entry will be permitted for viewing and when access should be discontinued.<br>The ability to set a start time also allows for a presale window.</div>' +
                '<div id="scheduling-wrapper">' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="any_time" id="any_time" name="scheduling"> Any Time</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="range" id="range" name="scheduling"> Specific Range</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8" style="margin-top: 20px;">' +
                '<div class="form-group">' +
                '<label for="datetimepicker1" class="col-xs-4 control-label">Start Date:</label>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker1" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label"><input style="width=33px" id="end-date" type="checkbox" disabled>End Date:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker2" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label" style="padding-left: 0px;">Time Zone:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<select class="form-control" id="time-zone" style="margin: auto; width: 294px;" disabled><option value="Africa/Abidjan">( GMT +0 ) Africa/Abidjan</option><option value="Africa/Accra">( GMT +0 ) Africa/Accra</option><option value="Africa/Addis_Ababa">( GMT +3 ) Africa/Addis_Ababa</option><option value="Africa/Algiers">( GMT +1 ) Africa/Algiers</option><option value="Africa/Asmara">( GMT +3 ) Africa/Asmara</option><option value="Africa/Bamako">( GMT +0 ) Africa/Bamako</option><option value="Africa/Bangui">( GMT +1 ) Africa/Bangui</option><option value="Africa/Banjul">( GMT +0 ) Africa/Banjul</option><option value="Africa/Bissau">( GMT +0 ) Africa/Bissau</option><option value="Africa/Blantyre">( GMT +2 ) Africa/Blantyre</option><option value="Africa/Brazzaville">( GMT +1 ) Africa/Brazzaville</option><option value="Africa/Bujumbura">( GMT +2 ) Africa/Bujumbura</option><option value="Africa/Cairo">( GMT +2 ) Africa/Cairo</option><option value="Africa/Casablanca">( GMT +1 ) Africa/Casablanca</option><option value="Africa/Ceuta">( GMT +2 ) Africa/Ceuta</option><option value="Africa/Conakry">( GMT +0 ) Africa/Conakry</option><option value="Africa/Dakar">( GMT +0 ) Africa/Dakar</option><option value="Africa/Dar_es_Salaam">( GMT +3 ) Africa/Dar_es_Salaam</option><option value="Africa/Djibouti">( GMT +3 ) Africa/Djibouti</option><option value="Africa/Douala">( GMT +1 ) Africa/Douala</option><option value="Africa/El_Aaiun">( GMT +1 ) Africa/El_Aaiun</option><option value="Africa/Freetown">( GMT +0 ) Africa/Freetown</option><option value="Africa/Gaborone">( GMT +2 ) Africa/Gaborone</option><option value="Africa/Harare">( GMT +2 ) Africa/Harare</option><option value="Africa/Johannesburg">( GMT +2 ) Africa/Johannesburg</option><option value="Africa/Juba">( GMT +3 ) Africa/Juba</option><option value="Africa/Kampala">( GMT +3 ) Africa/Kampala</option><option value="Africa/Khartoum">( GMT +3 ) Africa/Khartoum</option><option value="Africa/Kigali">( GMT +2 ) Africa/Kigali</option><option value="Africa/Kinshasa">( GMT +1 ) Africa/Kinshasa</option><option value="Africa/Lagos">( GMT +1 ) Africa/Lagos</option><option value="Africa/Libreville">( GMT +1 ) Africa/Libreville</option><option value="Africa/Lome">( GMT +0 ) Africa/Lome</option><option value="Africa/Luanda">( GMT +1 ) Africa/Luanda</option><option value="Africa/Lubumbashi">( GMT +2 ) Africa/Lubumbashi</option><option value="Africa/Lusaka">( GMT +2 ) Africa/Lusaka</option><option value="Africa/Malabo">( GMT +1 ) Africa/Malabo</option><option value="Africa/Maputo">( GMT +2 ) Africa/Maputo</option><option value="Africa/Maseru">( GMT +2 ) Africa/Maseru</option><option value="Africa/Mbabane">( GMT +2 ) Africa/Mbabane</option><option value="Africa/Mogadishu">( GMT +3 ) Africa/Mogadishu</option><option value="Africa/Monrovia">( GMT +0 ) Africa/Monrovia</option><option value="Africa/Nairobi">( GMT +3 ) Africa/Nairobi</option><option value="Africa/Ndjamena">( GMT +1 ) Africa/Ndjamena</option><option value="Africa/Niamey">( GMT +1 ) Africa/Niamey</option><option value="Africa/Nouakchott">( GMT +0 ) Africa/Nouakchott</option><option value="Africa/Ouagadougou">( GMT +0 ) Africa/Ouagadougou</option><option value="Africa/Porto-Novo">( GMT +1 ) Africa/Porto-Novo</option><option value="Africa/Sao_Tome">( GMT +0 ) Africa/Sao_Tome</option><option value="Africa/Tripoli">( GMT +2 ) Africa/Tripoli</option><option value="Africa/Tunis">( GMT +1 ) Africa/Tunis</option><option value="Africa/Windhoek">( GMT +2 ) Africa/Windhoek</option><option value="America/Adak">( GMT -9 ) America/Adak</option><option value="America/Anchorage">( GMT -8 ) America/Anchorage</option><option value="America/Anguilla">( GMT -4 ) America/Anguilla</option><option value="America/Antigua">( GMT -4 ) America/Antigua</option><option value="America/Araguaina">( GMT -3 ) America/Araguaina</option><option value="America/Argentina/Buenos_Aires">( GMT -3 ) America/Argentina/Buenos_Aires</option><option value="America/Argentina/Catamarca">( GMT -3 ) America/Argentina/Catamarca</option><option value="America/Argentina/Cordoba">( GMT -3 ) America/Argentina/Cordoba</option><option value="America/Argentina/Jujuy">( GMT -3 ) America/Argentina/Jujuy</option><option value="America/Argentina/La_Rioja">( GMT -3 ) America/Argentina/La_Rioja</option><option value="America/Argentina/Mendoza">( GMT -3 ) America/Argentina/Mendoza</option><option value="America/Argentina/Rio_Gallegos">( GMT -3 ) America/Argentina/Rio_Gallegos</option><option value="America/Argentina/Salta">( GMT -3 ) America/Argentina/Salta</option><option value="America/Argentina/San_Juan">( GMT -3 ) America/Argentina/San_Juan</option><option value="America/Argentina/San_Luis">( GMT -3 ) America/Argentina/San_Luis</option><option value="America/Argentina/Tucuman">( GMT -3 ) America/Argentina/Tucuman</option><option value="America/Argentina/Ushuaia">( GMT -3 ) America/Argentina/Ushuaia</option><option value="America/Aruba">( GMT -4 ) America/Aruba</option><option value="America/Asuncion">( GMT -3 ) America/Asuncion</option><option value="America/Atikokan">( GMT -5 ) America/Atikokan</option><option value="America/Bahia">( GMT -3 ) America/Bahia</option><option value="America/Bahia_Banderas">( GMT -5 ) America/Bahia_Banderas</option><option value="America/Barbados">( GMT -4 ) America/Barbados</option><option value="America/Belem">( GMT -3 ) America/Belem</option><option value="America/Belize">( GMT -6 ) America/Belize</option><option value="America/Blanc-Sablon">( GMT -4 ) America/Blanc-Sablon</option><option value="America/Boa_Vista">( GMT -4 ) America/Boa_Vista</option><option value="America/Bogota">( GMT -5 ) America/Bogota</option><option value="America/Boise" selected="selected">( GMT -6 ) America/Boise</option><option value="America/Cambridge_Bay">( GMT -6 ) America/Cambridge_Bay</option><option value="America/Campo_Grande">( GMT -4 ) America/Campo_Grande</option><option value="America/Cancun">( GMT -5 ) America/Cancun</option><option value="America/Caracas">( GMT -4 ) America/Caracas</option><option value="America/Cayenne">( GMT -3 ) America/Cayenne</option><option value="America/Cayman">( GMT -5 ) America/Cayman</option><option value="America/Chicago">( GMT -5 ) America/Chicago</option><option value="America/Chihuahua">( GMT -6 ) America/Chihuahua</option><option value="America/Costa_Rica">( GMT -6 ) America/Costa_Rica</option><option value="America/Creston">( GMT -7 ) America/Creston</option><option value="America/Cuiaba">( GMT -4 ) America/Cuiaba</option><option value="America/Curacao">( GMT -4 ) America/Curacao</option><option value="America/Danmarkshavn">( GMT +0 ) America/Danmarkshavn</option><option value="America/Dawson">( GMT -7 ) America/Dawson</option><option value="America/Dawson_Creek">( GMT -7 ) America/Dawson_Creek</option><option value="America/Denver">( GMT -6 ) America/Denver</option><option value="America/Detroit">( GMT -4 ) America/Detroit</option><option value="America/Dominica">( GMT -4 ) America/Dominica</option><option value="America/Edmonton">( GMT -6 ) America/Edmonton</option><option value="America/Eirunepe">( GMT -5 ) America/Eirunepe</option><option value="America/El_Salvador">( GMT -6 ) America/El_Salvador</option><option value="America/Fort_Nelson">( GMT -7 ) America/Fort_Nelson</option><option value="America/Fortaleza">( GMT -3 ) America/Fortaleza</option><option value="America/Glace_Bay">( GMT -3 ) America/Glace_Bay</option><option value="America/Godthab">( GMT -2 ) America/Godthab</option><option value="America/Goose_Bay">( GMT -3 ) America/Goose_Bay</option><option value="America/Grand_Turk">( GMT -4 ) America/Grand_Turk</option><option value="America/Grenada">( GMT -4 ) America/Grenada</option><option value="America/Guadeloupe">( GMT -4 ) America/Guadeloupe</option><option value="America/Guatemala">( GMT -6 ) America/Guatemala</option><option value="America/Guayaquil">( GMT -5 ) America/Guayaquil</option><option value="America/Guyana">( GMT -4 ) America/Guyana</option><option value="America/Halifax">( GMT -3 ) America/Halifax</option><option value="America/Havana">( GMT -4 ) America/Havana</option><option value="America/Hermosillo">( GMT -7 ) America/Hermosillo</option><option value="America/Indiana/Indianapolis">( GMT -4 ) America/Indiana/Indianapolis</option><option value="America/Indiana/Knox">( GMT -5 ) America/Indiana/Knox</option><option value="America/Indiana/Marengo">( GMT -4 ) America/Indiana/Marengo</option><option value="America/Indiana/Petersburg">( GMT -4 ) America/Indiana/Petersburg</option><option value="America/Indiana/Tell_City">( GMT -5 ) America/Indiana/Tell_City</option><option value="America/Indiana/Vevay">( GMT -4 ) America/Indiana/Vevay</option><option value="America/Indiana/Vincennes">( GMT -4 ) America/Indiana/Vincennes</option><option value="America/Indiana/Winamac">( GMT -4 ) America/Indiana/Winamac</option><option value="America/Inuvik">( GMT -6 ) America/Inuvik</option><option value="America/Iqaluit">( GMT -4 ) America/Iqaluit</option><option value="America/Jamaica">( GMT -5 ) America/Jamaica</option><option value="America/Juneau">( GMT -8 ) America/Juneau</option><option value="America/Kentucky/Louisville">( GMT -4 ) America/Kentucky/Louisville</option><option value="America/Kentucky/Monticello">( GMT -4 ) America/Kentucky/Monticello</option><option value="America/Kralendijk">( GMT -4 ) America/Kralendijk</option><option value="America/La_Paz">( GMT -4 ) America/La_Paz</option><option value="America/Lima">( GMT -5 ) America/Lima</option><option value="America/Los_Angeles">( GMT -7 ) America/Los_Angeles</option><option value="America/Lower_Princes">( GMT -4 ) America/Lower_Princes</option><option value="America/Maceio">( GMT -3 ) America/Maceio</option><option value="America/Managua">( GMT -6 ) America/Managua</option><option value="America/Manaus">( GMT -4 ) America/Manaus</option><option value="America/Marigot">( GMT -4 ) America/Marigot</option><option value="America/Martinique">( GMT -4 ) America/Martinique</option><option value="America/Matamoros">( GMT -5 ) America/Matamoros</option><option value="America/Mazatlan">( GMT -6 ) America/Mazatlan</option><option value="America/Menominee">( GMT -5 ) America/Menominee</option><option value="America/Merida">( GMT -5 ) America/Merida</option><option value="America/Metlakatla">( GMT -8 ) America/Metlakatla</option><option value="America/Mexico_City">( GMT -5 ) America/Mexico_City</option><option value="America/Miquelon">( GMT -2 ) America/Miquelon</option><option value="America/Moncton">( GMT -3 ) America/Moncton</option><option value="America/Monterrey">( GMT -5 ) America/Monterrey</option><option value="America/Montevideo">( GMT -3 ) America/Montevideo</option><option value="America/Montserrat">( GMT -4 ) America/Montserrat</option><option value="America/Nassau">( GMT -4 ) America/Nassau</option><option value="America/New_York">( GMT -4 ) America/New_York</option><option value="America/Nipigon">( GMT -4 ) America/Nipigon</option><option value="America/Nome">( GMT -8 ) America/Nome</option><option value="America/Noronha">( GMT -2 ) America/Noronha</option><option value="America/North_Dakota/Beulah">( GMT -5 ) America/North_Dakota/Beulah</option><option value="America/North_Dakota/Center">( GMT -5 ) America/North_Dakota/Center</option><option value="America/North_Dakota/New_Salem">( GMT -5 ) America/North_Dakota/New_Salem</option><option value="America/Ojinaga">( GMT -6 ) America/Ojinaga</option><option value="America/Panama">( GMT -5 ) America/Panama</option><option value="America/Pangnirtung">( GMT -4 ) America/Pangnirtung</option><option value="America/Paramaribo">( GMT -3 ) America/Paramaribo</option><option value="America/Phoenix">( GMT -7 ) America/Phoenix</option><option value="America/Port-au-Prince">( GMT -5 ) America/Port-au-Prince</option><option value="America/Port_of_Spain">( GMT -4 ) America/Port_of_Spain</option><option value="America/Porto_Velho">( GMT -4 ) America/Porto_Velho</option><option value="America/Puerto_Rico">( GMT -4 ) America/Puerto_Rico</option><option value="America/Rainy_River">( GMT -5 ) America/Rainy_River</option><option value="America/Rankin_Inlet">( GMT -5 ) America/Rankin_Inlet</option><option value="America/Recife">( GMT -3 ) America/Recife</option><option value="America/Regina">( GMT -6 ) America/Regina</option><option value="America/Resolute">( GMT -5 ) America/Resolute</option><option value="America/Rio_Branco">( GMT -5 ) America/Rio_Branco</option><option value="America/Santarem">( GMT -3 ) America/Santarem</option><option value="America/Santiago">( GMT -3 ) America/Santiago</option><option value="America/Santo_Domingo">( GMT -4 ) America/Santo_Domingo</option><option value="America/Sao_Paulo">( GMT -3 ) America/Sao_Paulo</option><option value="America/Scoresbysund">( GMT +0 ) America/Scoresbysund</option><option value="America/Sitka">( GMT -8 ) America/Sitka</option><option value="America/St_Barthelemy">( GMT -4 ) America/St_Barthelemy</option><option value="America/St_Johns">( GMT -3 ) America/St_Johns</option><option value="America/St_Kitts">( GMT -4 ) America/St_Kitts</option><option value="America/St_Lucia">( GMT -4 ) America/St_Lucia</option><option value="America/St_Thomas">( GMT -4 ) America/St_Thomas</option><option value="America/St_Vincent">( GMT -4 ) America/St_Vincent</option><option value="America/Swift_Current">( GMT -6 ) America/Swift_Current</option><option value="America/Tegucigalpa">( GMT -6 ) America/Tegucigalpa</option><option value="America/Thule">( GMT -3 ) America/Thule</option><option value="America/Thunder_Bay">( GMT -4 ) America/Thunder_Bay</option><option value="America/Tijuana">( GMT -7 ) America/Tijuana</option><option value="America/Toronto">( GMT -4 ) America/Toronto</option><option value="America/Tortola">( GMT -4 ) America/Tortola</option><option value="America/Vancouver">( GMT -7 ) America/Vancouver</option><option value="America/Whitehorse">( GMT -7 ) America/Whitehorse</option><option value="America/Winnipeg">( GMT -5 ) America/Winnipeg</option><option value="America/Yakutat">( GMT -8 ) America/Yakutat</option><option value="America/Yellowknife">( GMT -6 ) America/Yellowknife</option><option value="Antarctica/Casey">( GMT +8 ) Antarctica/Casey</option><option value="Antarctica/Davis">( GMT +7 ) Antarctica/Davis</option><option value="Antarctica/DumontDUrville">( GMT +10 ) Antarctica/DumontDUrville</option><option value="Antarctica/Macquarie">( GMT +11 ) Antarctica/Macquarie</option><option value="Antarctica/Mawson">( GMT +5 ) Antarctica/Mawson</option><option value="Antarctica/McMurdo">( GMT +13 ) Antarctica/McMurdo</option><option value="Antarctica/Palmer">( GMT -3 ) Antarctica/Palmer</option><option value="Antarctica/Rothera">( GMT -3 ) Antarctica/Rothera</option><option value="Antarctica/Syowa">( GMT +3 ) Antarctica/Syowa</option><option value="Antarctica/Troll">( GMT +2 ) Antarctica/Troll</option><option value="Antarctica/Vostok">( GMT +6 ) Antarctica/Vostok</option><option value="Arctic/Longyearbyen">( GMT +2 ) Arctic/Longyearbyen</option><option value="Asia/Aden">( GMT +3 ) Asia/Aden</option><option value="Asia/Almaty">( GMT +6 ) Asia/Almaty</option><option value="Asia/Amman">( GMT +3 ) Asia/Amman</option><option value="Asia/Anadyr">( GMT +12 ) Asia/Anadyr</option><option value="Asia/Aqtau">( GMT +5 ) Asia/Aqtau</option><option value="Asia/Aqtobe">( GMT +5 ) Asia/Aqtobe</option><option value="Asia/Ashgabat">( GMT +5 ) Asia/Ashgabat</option><option value="Asia/Baghdad">( GMT +3 ) Asia/Baghdad</option><option value="Asia/Bahrain">( GMT +3 ) Asia/Bahrain</option><option value="Asia/Baku">( GMT +4 ) Asia/Baku</option><option value="Asia/Bangkok">( GMT +7 ) Asia/Bangkok</option><option value="Asia/Barnaul">( GMT +7 ) Asia/Barnaul</option><option value="Asia/Beirut">( GMT +3 ) Asia/Beirut</option><option value="Asia/Bishkek">( GMT +6 ) Asia/Bishkek</option><option value="Asia/Brunei">( GMT +8 ) Asia/Brunei</option><option value="Asia/Chita">( GMT +9 ) Asia/Chita</option><option value="Asia/Choibalsan">( GMT +8 ) Asia/Choibalsan</option><option value="Asia/Colombo">( GMT +5 ) Asia/Colombo</option><option value="Asia/Damascus">( GMT +3 ) Asia/Damascus</option><option value="Asia/Dhaka">( GMT +6 ) Asia/Dhaka</option><option value="Asia/Dili">( GMT +9 ) Asia/Dili</option><option value="Asia/Dubai">( GMT +4 ) Asia/Dubai</option><option value="Asia/Dushanbe">( GMT +5 ) Asia/Dushanbe</option><option value="Asia/Gaza">( GMT +3 ) Asia/Gaza</option><option value="Asia/Hebron">( GMT +3 ) Asia/Hebron</option><option value="Asia/Ho_Chi_Minh">( GMT +7 ) Asia/Ho_Chi_Minh</option><option value="Asia/Hong_Kong">( GMT +8 ) Asia/Hong_Kong</option><option value="Asia/Hovd">( GMT +7 ) Asia/Hovd</option><option value="Asia/Irkutsk">( GMT +8 ) Asia/Irkutsk</option><option value="Asia/Jakarta">( GMT +7 ) Asia/Jakarta</option><option value="Asia/Jayapura">( GMT +9 ) Asia/Jayapura</option><option value="Asia/Jerusalem">( GMT +3 ) Asia/Jerusalem</option><option value="Asia/Kabul">( GMT +4 ) Asia/Kabul</option><option value="Asia/Kamchatka">( GMT +12 ) Asia/Kamchatka</option><option value="Asia/Karachi">( GMT +5 ) Asia/Karachi</option><option value="Asia/Kathmandu">( GMT +5 ) Asia/Kathmandu</option><option value="Asia/Khandyga">( GMT +9 ) Asia/Khandyga</option><option value="Asia/Kolkata">( GMT +5 ) Asia/Kolkata</option><option value="Asia/Krasnoyarsk">( GMT +7 ) Asia/Krasnoyarsk</option><option value="Asia/Kuala_Lumpur">( GMT +8 ) Asia/Kuala_Lumpur</option><option value="Asia/Kuching">( GMT +8 ) Asia/Kuching</option><option value="Asia/Kuwait">( GMT +3 ) Asia/Kuwait</option><option value="Asia/Macau">( GMT +8 ) Asia/Macau</option><option value="Asia/Magadan">( GMT +11 ) Asia/Magadan</option><option value="Asia/Makassar">( GMT +8 ) Asia/Makassar</option><option value="Asia/Manila">( GMT +8 ) Asia/Manila</option><option value="Asia/Muscat">( GMT +4 ) Asia/Muscat</option><option value="Asia/Nicosia">( GMT +3 ) Asia/Nicosia</option><option value="Asia/Novokuznetsk">( GMT +7 ) Asia/Novokuznetsk</option><option value="Asia/Novosibirsk">( GMT +7 ) Asia/Novosibirsk</option><option value="Asia/Omsk">( GMT +6 ) Asia/Omsk</option><option value="Asia/Oral">( GMT +5 ) Asia/Oral</option><option value="Asia/Phnom_Penh">( GMT +7 ) Asia/Phnom_Penh</option><option value="Asia/Pontianak">( GMT +7 ) Asia/Pontianak</option><option value="Asia/Pyongyang">( GMT +8 ) Asia/Pyongyang</option><option value="Asia/Qatar">( GMT +3 ) Asia/Qatar</option><option value="Asia/Qyzylorda">( GMT +6 ) Asia/Qyzylorda</option><option value="Asia/Rangoon">( GMT +6 ) Asia/Rangoon</option><option value="Asia/Riyadh">( GMT +3 ) Asia/Riyadh</option><option value="Asia/Sakhalin">( GMT +11 ) Asia/Sakhalin</option><option value="Asia/Samarkand">( GMT +5 ) Asia/Samarkand</option><option value="Asia/Seoul">( GMT +9 ) Asia/Seoul</option><option value="Asia/Shanghai">( GMT +8 ) Asia/Shanghai</option><option value="Asia/Singapore">( GMT +8 ) Asia/Singapore</option><option value="Asia/Srednekolymsk">( GMT +11 ) Asia/Srednekolymsk</option><option value="Asia/Taipei">( GMT +8 ) Asia/Taipei</option><option value="Asia/Tashkent">( GMT +5 ) Asia/Tashkent</option><option value="Asia/Tbilisi">( GMT +4 ) Asia/Tbilisi</option><option value="Asia/Tehran">( GMT +3 ) Asia/Tehran</option><option value="Asia/Thimphu">( GMT +6 ) Asia/Thimphu</option><option value="Asia/Tokyo">( GMT +9 ) Asia/Tokyo</option><option value="Asia/Tomsk">( GMT +7 ) Asia/Tomsk</option><option value="Asia/Ulaanbaatar">( GMT +8 ) Asia/Ulaanbaatar</option><option value="Asia/Urumqi">( GMT +6 ) Asia/Urumqi</option><option value="Asia/Ust-Nera">( GMT +10 ) Asia/Ust-Nera</option><option value="Asia/Vientiane">( GMT +7 ) Asia/Vientiane</option><option value="Asia/Vladivostok">( GMT +10 ) Asia/Vladivostok</option><option value="Asia/Yakutsk">( GMT +9 ) Asia/Yakutsk</option><option value="Asia/Yekaterinburg">( GMT +5 ) Asia/Yekaterinburg</option><option value="Asia/Yerevan">( GMT +4 ) Asia/Yerevan</option><option value="Atlantic/Azores">( GMT +0 ) Atlantic/Azores</option><option value="Atlantic/Bermuda">( GMT -3 ) Atlantic/Bermuda</option><option value="Atlantic/Canary">( GMT +1 ) Atlantic/Canary</option><option value="Atlantic/Cape_Verde">( GMT -1 ) Atlantic/Cape_Verde</option><option value="Atlantic/Faroe">( GMT +1 ) Atlantic/Faroe</option><option value="Atlantic/Madeira">( GMT +1 ) Atlantic/Madeira</option><option value="Atlantic/Reykjavik">( GMT +0 ) Atlantic/Reykjavik</option><option value="Atlantic/South_Georgia">( GMT -2 ) Atlantic/South_Georgia</option><option value="Atlantic/St_Helena">( GMT +0 ) Atlantic/St_Helena</option><option value="Atlantic/Stanley">( GMT -3 ) Atlantic/Stanley</option><option value="Australia/Adelaide">( GMT +10 ) Australia/Adelaide</option><option value="Australia/Brisbane">( GMT +10 ) Australia/Brisbane</option><option value="Australia/Broken_Hill">( GMT +10 ) Australia/Broken_Hill</option><option value="Australia/Currie">( GMT +11 ) Australia/Currie</option><option value="Australia/Darwin">( GMT +9 ) Australia/Darwin</option><option value="Australia/Eucla">( GMT +8 ) Australia/Eucla</option><option value="Australia/Hobart">( GMT +11 ) Australia/Hobart</option><option value="Australia/Lindeman">( GMT +10 ) Australia/Lindeman</option><option value="Australia/Lord_Howe">( GMT +11 ) Australia/Lord_Howe</option><option value="Australia/Melbourne">( GMT +11 ) Australia/Melbourne</option><option value="Australia/Perth">( GMT +8 ) Australia/Perth</option><option value="Australia/Sydney">( GMT +11 ) Australia/Sydney</option><option value="Europe/Amsterdam">( GMT +2 ) Europe/Amsterdam</option><option value="Europe/Andorra">( GMT +2 ) Europe/Andorra</option><option value="Europe/Astrakhan">( GMT +4 ) Europe/Astrakhan</option><option value="Europe/Athens">( GMT +3 ) Europe/Athens</option><option value="Europe/Belgrade">( GMT +2 ) Europe/Belgrade</option><option value="Europe/Berlin">( GMT +2 ) Europe/Berlin</option><option value="Europe/Bratislava">( GMT +2 ) Europe/Bratislava</option><option value="Europe/Brussels">( GMT +2 ) Europe/Brussels</option><option value="Europe/Bucharest">( GMT +3 ) Europe/Bucharest</option><option value="Europe/Budapest">( GMT +2 ) Europe/Budapest</option><option value="Europe/Busingen">( GMT +2 ) Europe/Busingen</option><option value="Europe/Chisinau">( GMT +3 ) Europe/Chisinau</option><option value="Europe/Copenhagen">( GMT +2 ) Europe/Copenhagen</option><option value="Europe/Dublin">( GMT +1 ) Europe/Dublin</option><option value="Europe/Gibraltar">( GMT +2 ) Europe/Gibraltar</option><option value="Europe/Guernsey">( GMT +1 ) Europe/Guernsey</option><option value="Europe/Helsinki">( GMT +3 ) Europe/Helsinki</option><option value="Europe/Isle_of_Man">( GMT +1 ) Europe/Isle_of_Man</option><option value="Europe/Istanbul">( GMT +3 ) Europe/Istanbul</option><option value="Europe/Jersey">( GMT +1 ) Europe/Jersey</option><option value="Europe/Kaliningrad">( GMT +2 ) Europe/Kaliningrad</option><option value="Europe/Kiev">( GMT +3 ) Europe/Kiev</option><option value="Europe/Kirov">( GMT +3 ) Europe/Kirov</option><option value="Europe/Lisbon">( GMT +1 ) Europe/Lisbon</option><option value="Europe/Ljubljana">( GMT +2 ) Europe/Ljubljana</option><option value="Europe/London">( GMT +1 ) Europe/London</option><option value="Europe/Luxembourg">( GMT +2 ) Europe/Luxembourg</option><option value="Europe/Madrid">( GMT +2 ) Europe/Madrid</option><option value="Europe/Malta">( GMT +2 ) Europe/Malta</option><option value="Europe/Mariehamn">( GMT +3 ) Europe/Mariehamn</option><option value="Europe/Minsk">( GMT +3 ) Europe/Minsk</option><option value="Europe/Monaco">( GMT +2 ) Europe/Monaco</option><option value="Europe/Moscow">( GMT +3 ) Europe/Moscow</option><option value="Europe/Oslo">( GMT +2 ) Europe/Oslo</option><option value="Europe/Paris">( GMT +2 ) Europe/Paris</option><option value="Europe/Podgorica">( GMT +2 ) Europe/Podgorica</option><option value="Europe/Prague">( GMT +2 ) Europe/Prague</option><option value="Europe/Riga">( GMT +3 ) Europe/Riga</option><option value="Europe/Rome">( GMT +2 ) Europe/Rome</option><option value="Europe/Samara">( GMT +4 ) Europe/Samara</option><option value="Europe/San_Marino">( GMT +2 ) Europe/San_Marino</option><option value="Europe/Sarajevo">( GMT +2 ) Europe/Sarajevo</option><option value="Europe/Simferopol">( GMT +3 ) Europe/Simferopol</option><option value="Europe/Skopje">( GMT +2 ) Europe/Skopje</option><option value="Europe/Sofia">( GMT +3 ) Europe/Sofia</option><option value="Europe/Stockholm">( GMT +2 ) Europe/Stockholm</option><option value="Europe/Tallinn">( GMT +3 ) Europe/Tallinn</option><option value="Europe/Tirane">( GMT +2 ) Europe/Tirane</option><option value="Europe/Ulyanovsk">( GMT +4 ) Europe/Ulyanovsk</option><option value="Europe/Uzhgorod">( GMT +3 ) Europe/Uzhgorod</option><option value="Europe/Vaduz">( GMT +2 ) Europe/Vaduz</option><option value="Europe/Vatican">( GMT +2 ) Europe/Vatican</option><option value="Europe/Vienna">( GMT +2 ) Europe/Vienna</option><option value="Europe/Vilnius">( GMT +3 ) Europe/Vilnius</option><option value="Europe/Volgograd">( GMT +3 ) Europe/Volgograd</option><option value="Europe/Warsaw">( GMT +2 ) Europe/Warsaw</option><option value="Europe/Zagreb">( GMT +2 ) Europe/Zagreb</option><option value="Europe/Zaporozhye">( GMT +3 ) Europe/Zaporozhye</option><option value="Europe/Zurich">( GMT +2 ) Europe/Zurich</option><option value="Indian/Antananarivo">( GMT +3 ) Indian/Antananarivo</option><option value="Indian/Chagos">( GMT +6 ) Indian/Chagos</option><option value="Indian/Christmas">( GMT +7 ) Indian/Christmas</option><option value="Indian/Cocos">( GMT +6 ) Indian/Cocos</option><option value="Indian/Comoro">( GMT +3 ) Indian/Comoro</option><option value="Indian/Kerguelen">( GMT +5 ) Indian/Kerguelen</option><option value="Indian/Mahe">( GMT +4 ) Indian/Mahe</option><option value="Indian/Maldives">( GMT +5 ) Indian/Maldives</option><option value="Indian/Mauritius">( GMT +4 ) Indian/Mauritius</option><option value="Indian/Mayotte">( GMT +3 ) Indian/Mayotte</option><option value="Indian/Reunion">( GMT +4 ) Indian/Reunion</option><option value="Pacific/Apia">( GMT +14 ) Pacific/Apia</option><option value="Pacific/Auckland">( GMT +13 ) Pacific/Auckland</option><option value="Pacific/Bougainville">( GMT +11 ) Pacific/Bougainville</option><option value="Pacific/Chatham">( GMT +13 ) Pacific/Chatham</option><option value="Pacific/Chuuk">( GMT +10 ) Pacific/Chuuk</option><option value="Pacific/Easter">( GMT -5 ) Pacific/Easter</option><option value="Pacific/Efate">( GMT +11 ) Pacific/Efate</option><option value="Pacific/Enderbury">( GMT +13 ) Pacific/Enderbury</option><option value="Pacific/Fakaofo">( GMT +13 ) Pacific/Fakaofo</option><option value="Pacific/Fiji">( GMT +12 ) Pacific/Fiji</option><option value="Pacific/Funafuti">( GMT +12 ) Pacific/Funafuti</option><option value="Pacific/Galapagos">( GMT -6 ) Pacific/Galapagos</option><option value="Pacific/Gambier">( GMT -9 ) Pacific/Gambier</option><option value="Pacific/Guadalcanal">( GMT +11 ) Pacific/Guadalcanal</option><option value="Pacific/Guam">( GMT +10 ) Pacific/Guam</option><option value="Pacific/Honolulu">( GMT -10 ) Pacific/Honolulu</option><option value="Pacific/Johnston">( GMT -10 ) Pacific/Johnston</option><option value="Pacific/Kiritimati">( GMT +14 ) Pacific/Kiritimati</option><option value="Pacific/Kosrae">( GMT +11 ) Pacific/Kosrae</option><option value="Pacific/Kwajalein">( GMT +12 ) Pacific/Kwajalein</option><option value="Pacific/Majuro">( GMT +12 ) Pacific/Majuro</option><option value="Pacific/Marquesas">( GMT -10 ) Pacific/Marquesas</option><option value="Pacific/Midway">( GMT -11 ) Pacific/Midway</option><option value="Pacific/Nauru">( GMT +12 ) Pacific/Nauru</option><option value="Pacific/Niue">( GMT -11 ) Pacific/Niue</option><option value="Pacific/Norfolk">( GMT +11 ) Pacific/Norfolk</option><option value="Pacific/Noumea">( GMT +11 ) Pacific/Noumea</option><option value="Pacific/Pago_Pago">( GMT -11 ) Pacific/Pago_Pago</option><option value="Pacific/Palau">( GMT +9 ) Pacific/Palau</option><option value="Pacific/Pitcairn">( GMT -8 ) Pacific/Pitcairn</option><option value="Pacific/Pohnpei">( GMT +11 ) Pacific/Pohnpei</option><option value="Pacific/Port_Moresby">( GMT +10 ) Pacific/Port_Moresby</option><option value="Pacific/Rarotonga">( GMT -10 ) Pacific/Rarotonga</option><option value="Pacific/Saipan">( GMT +10 ) Pacific/Saipan</option><option value="Pacific/Tahiti">( GMT -10 ) Pacific/Tahiti</option><option value="Pacific/Tarawa">( GMT +12 ) Pacific/Tarawa</option><option value="Pacific/Tongatapu">( GMT +13 ) Pacific/Tongatapu</option><option value="Pacific/Wake">( GMT +12 ) Pacific/Wake</option><option value="Pacific/Wallis">( GMT +12 ) Pacific/Wallis</option></select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-7">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-7 control-label" style="margin-left: 14px;"><input id="countdown" type="checkbox" disabled>Show a countdown timer</label></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="tickets-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 214px;">Select one or more tickets (max 5).</div>' +
                '<div id="ticketentry-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="ac-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>' +
                '<div id="acentry-table"></div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhPPV.validateFinalEditStep()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        $('#any_time').change(function () {
            if ($('#any_time').prop('checked')) {
                $('#datetimepicker1').attr('disabled', '');
                $('#datetimepicker2').attr('disabled', '');
                $('#end-date').attr('disabled', '');
                $('#time-zone').attr('disabled', '');
                $('#countdown').attr('disabled', '');
                $('#scheduling-wrapper .control-label').css('color', '#999');
                $('#end-date').prop('checked', false);
                $('#countdown').prop('checked', false);
            }
        });

        $('#range').change(function () {
            if ($('#range').prop('checked')) {
                $('#datetimepicker1').removeAttr('disabled');
                $('#end-date').removeAttr('disabled');
                $('#time-zone').removeAttr('disabled');
                $('#countdown').removeAttr('disabled');
                $('#scheduling-wrapper .control-label').css('color', '#000');
            }
        });

        $('#end-date').change(function () {
            if ($('#end-date').prop('checked')) {
                $('#datetimepicker2').removeAttr('disabled');
            } else {
                $('#datetimepicker2').attr('disabled', '');
                $('#datetimepicker2').val('');
            }
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true,
            useCurrent: false
        });
        $("#datetimepicker1").on("dp.change", function (e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker2").on("dp.change", function (e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });

        smhPPV.activateSingleEditWizard();
        smhPPV.getEntryDetails(true);
    },
    //Edit PVV Playlist
    editPlaylistEntry: function (eid, name, type, tickets, ac_id, ac_name) {
        ppv_entry_id = eid;
        ppv_entry_name = name;
        ppv_entry_type = type;
        ppv_ac_id = ac_id;
        ppv_ac_name = ac_name;
        ppv_tickets = tickets.split('_');

        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 25%;"><a href="#details-tab" data-toggle="tab">ENTRY DETAILS</a></li>' +
                '<li style="width: 25%;"><a href="#scheduling-tab" data-toggle="tab">SCHEDULING</a></li>' +
                '<li style="width: 25%;"><a href="#tickets-tab" data-toggle="tab">TICKET(S)</a></li>' +
                '<li style="width: 25%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="details-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">The following details will appear on the purchase window. Please make sure they are correct.</div>' +
                '<div id="details"></div>' +
                '</div>' +
                '<div class="tab-pane" id="scheduling-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 14px;">Scheduling determines when your entry will be permitted for viewing and when access should be discontinued.<br>The ability to set a start time also allows for a presale window.</div>' +
                '<div id="scheduling-wrapper">' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="any_time" id="any_time" name="scheduling"> Any Time</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-3" style="font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="range" id="range" name="scheduling"> Specific Range</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8" style="margin-top: 20px;">' +
                '<div class="form-group">' +
                '<label for="datetimepicker1" class="col-xs-4 control-label">Start Date:</label>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker1" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label"><input style="width=33px" id="end-date" type="checkbox" disabled>End Date:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<input type="text" class="form-control" id="datetimepicker2" style="margin: auto; width: 255px;" disabled/>' +
                '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-8">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-4 control-label" style="padding-left: 0px;">Time Zone:</label></div>' +
                '<div class="date">' +
                '<div class="input-group input-append date">' +
                '<select class="form-control" id="time-zone" style="margin: auto; width: 294px;" disabled><option value="Africa/Abidjan">( GMT +0 ) Africa/Abidjan</option><option value="Africa/Accra">( GMT +0 ) Africa/Accra</option><option value="Africa/Addis_Ababa">( GMT +3 ) Africa/Addis_Ababa</option><option value="Africa/Algiers">( GMT +1 ) Africa/Algiers</option><option value="Africa/Asmara">( GMT +3 ) Africa/Asmara</option><option value="Africa/Bamako">( GMT +0 ) Africa/Bamako</option><option value="Africa/Bangui">( GMT +1 ) Africa/Bangui</option><option value="Africa/Banjul">( GMT +0 ) Africa/Banjul</option><option value="Africa/Bissau">( GMT +0 ) Africa/Bissau</option><option value="Africa/Blantyre">( GMT +2 ) Africa/Blantyre</option><option value="Africa/Brazzaville">( GMT +1 ) Africa/Brazzaville</option><option value="Africa/Bujumbura">( GMT +2 ) Africa/Bujumbura</option><option value="Africa/Cairo">( GMT +2 ) Africa/Cairo</option><option value="Africa/Casablanca">( GMT +1 ) Africa/Casablanca</option><option value="Africa/Ceuta">( GMT +2 ) Africa/Ceuta</option><option value="Africa/Conakry">( GMT +0 ) Africa/Conakry</option><option value="Africa/Dakar">( GMT +0 ) Africa/Dakar</option><option value="Africa/Dar_es_Salaam">( GMT +3 ) Africa/Dar_es_Salaam</option><option value="Africa/Djibouti">( GMT +3 ) Africa/Djibouti</option><option value="Africa/Douala">( GMT +1 ) Africa/Douala</option><option value="Africa/El_Aaiun">( GMT +1 ) Africa/El_Aaiun</option><option value="Africa/Freetown">( GMT +0 ) Africa/Freetown</option><option value="Africa/Gaborone">( GMT +2 ) Africa/Gaborone</option><option value="Africa/Harare">( GMT +2 ) Africa/Harare</option><option value="Africa/Johannesburg">( GMT +2 ) Africa/Johannesburg</option><option value="Africa/Juba">( GMT +3 ) Africa/Juba</option><option value="Africa/Kampala">( GMT +3 ) Africa/Kampala</option><option value="Africa/Khartoum">( GMT +3 ) Africa/Khartoum</option><option value="Africa/Kigali">( GMT +2 ) Africa/Kigali</option><option value="Africa/Kinshasa">( GMT +1 ) Africa/Kinshasa</option><option value="Africa/Lagos">( GMT +1 ) Africa/Lagos</option><option value="Africa/Libreville">( GMT +1 ) Africa/Libreville</option><option value="Africa/Lome">( GMT +0 ) Africa/Lome</option><option value="Africa/Luanda">( GMT +1 ) Africa/Luanda</option><option value="Africa/Lubumbashi">( GMT +2 ) Africa/Lubumbashi</option><option value="Africa/Lusaka">( GMT +2 ) Africa/Lusaka</option><option value="Africa/Malabo">( GMT +1 ) Africa/Malabo</option><option value="Africa/Maputo">( GMT +2 ) Africa/Maputo</option><option value="Africa/Maseru">( GMT +2 ) Africa/Maseru</option><option value="Africa/Mbabane">( GMT +2 ) Africa/Mbabane</option><option value="Africa/Mogadishu">( GMT +3 ) Africa/Mogadishu</option><option value="Africa/Monrovia">( GMT +0 ) Africa/Monrovia</option><option value="Africa/Nairobi">( GMT +3 ) Africa/Nairobi</option><option value="Africa/Ndjamena">( GMT +1 ) Africa/Ndjamena</option><option value="Africa/Niamey">( GMT +1 ) Africa/Niamey</option><option value="Africa/Nouakchott">( GMT +0 ) Africa/Nouakchott</option><option value="Africa/Ouagadougou">( GMT +0 ) Africa/Ouagadougou</option><option value="Africa/Porto-Novo">( GMT +1 ) Africa/Porto-Novo</option><option value="Africa/Sao_Tome">( GMT +0 ) Africa/Sao_Tome</option><option value="Africa/Tripoli">( GMT +2 ) Africa/Tripoli</option><option value="Africa/Tunis">( GMT +1 ) Africa/Tunis</option><option value="Africa/Windhoek">( GMT +2 ) Africa/Windhoek</option><option value="America/Adak">( GMT -9 ) America/Adak</option><option value="America/Anchorage">( GMT -8 ) America/Anchorage</option><option value="America/Anguilla">( GMT -4 ) America/Anguilla</option><option value="America/Antigua">( GMT -4 ) America/Antigua</option><option value="America/Araguaina">( GMT -3 ) America/Araguaina</option><option value="America/Argentina/Buenos_Aires">( GMT -3 ) America/Argentina/Buenos_Aires</option><option value="America/Argentina/Catamarca">( GMT -3 ) America/Argentina/Catamarca</option><option value="America/Argentina/Cordoba">( GMT -3 ) America/Argentina/Cordoba</option><option value="America/Argentina/Jujuy">( GMT -3 ) America/Argentina/Jujuy</option><option value="America/Argentina/La_Rioja">( GMT -3 ) America/Argentina/La_Rioja</option><option value="America/Argentina/Mendoza">( GMT -3 ) America/Argentina/Mendoza</option><option value="America/Argentina/Rio_Gallegos">( GMT -3 ) America/Argentina/Rio_Gallegos</option><option value="America/Argentina/Salta">( GMT -3 ) America/Argentina/Salta</option><option value="America/Argentina/San_Juan">( GMT -3 ) America/Argentina/San_Juan</option><option value="America/Argentina/San_Luis">( GMT -3 ) America/Argentina/San_Luis</option><option value="America/Argentina/Tucuman">( GMT -3 ) America/Argentina/Tucuman</option><option value="America/Argentina/Ushuaia">( GMT -3 ) America/Argentina/Ushuaia</option><option value="America/Aruba">( GMT -4 ) America/Aruba</option><option value="America/Asuncion">( GMT -3 ) America/Asuncion</option><option value="America/Atikokan">( GMT -5 ) America/Atikokan</option><option value="America/Bahia">( GMT -3 ) America/Bahia</option><option value="America/Bahia_Banderas">( GMT -5 ) America/Bahia_Banderas</option><option value="America/Barbados">( GMT -4 ) America/Barbados</option><option value="America/Belem">( GMT -3 ) America/Belem</option><option value="America/Belize">( GMT -6 ) America/Belize</option><option value="America/Blanc-Sablon">( GMT -4 ) America/Blanc-Sablon</option><option value="America/Boa_Vista">( GMT -4 ) America/Boa_Vista</option><option value="America/Bogota">( GMT -5 ) America/Bogota</option><option value="America/Boise" selected="selected">( GMT -6 ) America/Boise</option><option value="America/Cambridge_Bay">( GMT -6 ) America/Cambridge_Bay</option><option value="America/Campo_Grande">( GMT -4 ) America/Campo_Grande</option><option value="America/Cancun">( GMT -5 ) America/Cancun</option><option value="America/Caracas">( GMT -4 ) America/Caracas</option><option value="America/Cayenne">( GMT -3 ) America/Cayenne</option><option value="America/Cayman">( GMT -5 ) America/Cayman</option><option value="America/Chicago">( GMT -5 ) America/Chicago</option><option value="America/Chihuahua">( GMT -6 ) America/Chihuahua</option><option value="America/Costa_Rica">( GMT -6 ) America/Costa_Rica</option><option value="America/Creston">( GMT -7 ) America/Creston</option><option value="America/Cuiaba">( GMT -4 ) America/Cuiaba</option><option value="America/Curacao">( GMT -4 ) America/Curacao</option><option value="America/Danmarkshavn">( GMT +0 ) America/Danmarkshavn</option><option value="America/Dawson">( GMT -7 ) America/Dawson</option><option value="America/Dawson_Creek">( GMT -7 ) America/Dawson_Creek</option><option value="America/Denver">( GMT -6 ) America/Denver</option><option value="America/Detroit">( GMT -4 ) America/Detroit</option><option value="America/Dominica">( GMT -4 ) America/Dominica</option><option value="America/Edmonton">( GMT -6 ) America/Edmonton</option><option value="America/Eirunepe">( GMT -5 ) America/Eirunepe</option><option value="America/El_Salvador">( GMT -6 ) America/El_Salvador</option><option value="America/Fort_Nelson">( GMT -7 ) America/Fort_Nelson</option><option value="America/Fortaleza">( GMT -3 ) America/Fortaleza</option><option value="America/Glace_Bay">( GMT -3 ) America/Glace_Bay</option><option value="America/Godthab">( GMT -2 ) America/Godthab</option><option value="America/Goose_Bay">( GMT -3 ) America/Goose_Bay</option><option value="America/Grand_Turk">( GMT -4 ) America/Grand_Turk</option><option value="America/Grenada">( GMT -4 ) America/Grenada</option><option value="America/Guadeloupe">( GMT -4 ) America/Guadeloupe</option><option value="America/Guatemala">( GMT -6 ) America/Guatemala</option><option value="America/Guayaquil">( GMT -5 ) America/Guayaquil</option><option value="America/Guyana">( GMT -4 ) America/Guyana</option><option value="America/Halifax">( GMT -3 ) America/Halifax</option><option value="America/Havana">( GMT -4 ) America/Havana</option><option value="America/Hermosillo">( GMT -7 ) America/Hermosillo</option><option value="America/Indiana/Indianapolis">( GMT -4 ) America/Indiana/Indianapolis</option><option value="America/Indiana/Knox">( GMT -5 ) America/Indiana/Knox</option><option value="America/Indiana/Marengo">( GMT -4 ) America/Indiana/Marengo</option><option value="America/Indiana/Petersburg">( GMT -4 ) America/Indiana/Petersburg</option><option value="America/Indiana/Tell_City">( GMT -5 ) America/Indiana/Tell_City</option><option value="America/Indiana/Vevay">( GMT -4 ) America/Indiana/Vevay</option><option value="America/Indiana/Vincennes">( GMT -4 ) America/Indiana/Vincennes</option><option value="America/Indiana/Winamac">( GMT -4 ) America/Indiana/Winamac</option><option value="America/Inuvik">( GMT -6 ) America/Inuvik</option><option value="America/Iqaluit">( GMT -4 ) America/Iqaluit</option><option value="America/Jamaica">( GMT -5 ) America/Jamaica</option><option value="America/Juneau">( GMT -8 ) America/Juneau</option><option value="America/Kentucky/Louisville">( GMT -4 ) America/Kentucky/Louisville</option><option value="America/Kentucky/Monticello">( GMT -4 ) America/Kentucky/Monticello</option><option value="America/Kralendijk">( GMT -4 ) America/Kralendijk</option><option value="America/La_Paz">( GMT -4 ) America/La_Paz</option><option value="America/Lima">( GMT -5 ) America/Lima</option><option value="America/Los_Angeles">( GMT -7 ) America/Los_Angeles</option><option value="America/Lower_Princes">( GMT -4 ) America/Lower_Princes</option><option value="America/Maceio">( GMT -3 ) America/Maceio</option><option value="America/Managua">( GMT -6 ) America/Managua</option><option value="America/Manaus">( GMT -4 ) America/Manaus</option><option value="America/Marigot">( GMT -4 ) America/Marigot</option><option value="America/Martinique">( GMT -4 ) America/Martinique</option><option value="America/Matamoros">( GMT -5 ) America/Matamoros</option><option value="America/Mazatlan">( GMT -6 ) America/Mazatlan</option><option value="America/Menominee">( GMT -5 ) America/Menominee</option><option value="America/Merida">( GMT -5 ) America/Merida</option><option value="America/Metlakatla">( GMT -8 ) America/Metlakatla</option><option value="America/Mexico_City">( GMT -5 ) America/Mexico_City</option><option value="America/Miquelon">( GMT -2 ) America/Miquelon</option><option value="America/Moncton">( GMT -3 ) America/Moncton</option><option value="America/Monterrey">( GMT -5 ) America/Monterrey</option><option value="America/Montevideo">( GMT -3 ) America/Montevideo</option><option value="America/Montserrat">( GMT -4 ) America/Montserrat</option><option value="America/Nassau">( GMT -4 ) America/Nassau</option><option value="America/New_York">( GMT -4 ) America/New_York</option><option value="America/Nipigon">( GMT -4 ) America/Nipigon</option><option value="America/Nome">( GMT -8 ) America/Nome</option><option value="America/Noronha">( GMT -2 ) America/Noronha</option><option value="America/North_Dakota/Beulah">( GMT -5 ) America/North_Dakota/Beulah</option><option value="America/North_Dakota/Center">( GMT -5 ) America/North_Dakota/Center</option><option value="America/North_Dakota/New_Salem">( GMT -5 ) America/North_Dakota/New_Salem</option><option value="America/Ojinaga">( GMT -6 ) America/Ojinaga</option><option value="America/Panama">( GMT -5 ) America/Panama</option><option value="America/Pangnirtung">( GMT -4 ) America/Pangnirtung</option><option value="America/Paramaribo">( GMT -3 ) America/Paramaribo</option><option value="America/Phoenix">( GMT -7 ) America/Phoenix</option><option value="America/Port-au-Prince">( GMT -5 ) America/Port-au-Prince</option><option value="America/Port_of_Spain">( GMT -4 ) America/Port_of_Spain</option><option value="America/Porto_Velho">( GMT -4 ) America/Porto_Velho</option><option value="America/Puerto_Rico">( GMT -4 ) America/Puerto_Rico</option><option value="America/Rainy_River">( GMT -5 ) America/Rainy_River</option><option value="America/Rankin_Inlet">( GMT -5 ) America/Rankin_Inlet</option><option value="America/Recife">( GMT -3 ) America/Recife</option><option value="America/Regina">( GMT -6 ) America/Regina</option><option value="America/Resolute">( GMT -5 ) America/Resolute</option><option value="America/Rio_Branco">( GMT -5 ) America/Rio_Branco</option><option value="America/Santarem">( GMT -3 ) America/Santarem</option><option value="America/Santiago">( GMT -3 ) America/Santiago</option><option value="America/Santo_Domingo">( GMT -4 ) America/Santo_Domingo</option><option value="America/Sao_Paulo">( GMT -3 ) America/Sao_Paulo</option><option value="America/Scoresbysund">( GMT +0 ) America/Scoresbysund</option><option value="America/Sitka">( GMT -8 ) America/Sitka</option><option value="America/St_Barthelemy">( GMT -4 ) America/St_Barthelemy</option><option value="America/St_Johns">( GMT -3 ) America/St_Johns</option><option value="America/St_Kitts">( GMT -4 ) America/St_Kitts</option><option value="America/St_Lucia">( GMT -4 ) America/St_Lucia</option><option value="America/St_Thomas">( GMT -4 ) America/St_Thomas</option><option value="America/St_Vincent">( GMT -4 ) America/St_Vincent</option><option value="America/Swift_Current">( GMT -6 ) America/Swift_Current</option><option value="America/Tegucigalpa">( GMT -6 ) America/Tegucigalpa</option><option value="America/Thule">( GMT -3 ) America/Thule</option><option value="America/Thunder_Bay">( GMT -4 ) America/Thunder_Bay</option><option value="America/Tijuana">( GMT -7 ) America/Tijuana</option><option value="America/Toronto">( GMT -4 ) America/Toronto</option><option value="America/Tortola">( GMT -4 ) America/Tortola</option><option value="America/Vancouver">( GMT -7 ) America/Vancouver</option><option value="America/Whitehorse">( GMT -7 ) America/Whitehorse</option><option value="America/Winnipeg">( GMT -5 ) America/Winnipeg</option><option value="America/Yakutat">( GMT -8 ) America/Yakutat</option><option value="America/Yellowknife">( GMT -6 ) America/Yellowknife</option><option value="Antarctica/Casey">( GMT +8 ) Antarctica/Casey</option><option value="Antarctica/Davis">( GMT +7 ) Antarctica/Davis</option><option value="Antarctica/DumontDUrville">( GMT +10 ) Antarctica/DumontDUrville</option><option value="Antarctica/Macquarie">( GMT +11 ) Antarctica/Macquarie</option><option value="Antarctica/Mawson">( GMT +5 ) Antarctica/Mawson</option><option value="Antarctica/McMurdo">( GMT +13 ) Antarctica/McMurdo</option><option value="Antarctica/Palmer">( GMT -3 ) Antarctica/Palmer</option><option value="Antarctica/Rothera">( GMT -3 ) Antarctica/Rothera</option><option value="Antarctica/Syowa">( GMT +3 ) Antarctica/Syowa</option><option value="Antarctica/Troll">( GMT +2 ) Antarctica/Troll</option><option value="Antarctica/Vostok">( GMT +6 ) Antarctica/Vostok</option><option value="Arctic/Longyearbyen">( GMT +2 ) Arctic/Longyearbyen</option><option value="Asia/Aden">( GMT +3 ) Asia/Aden</option><option value="Asia/Almaty">( GMT +6 ) Asia/Almaty</option><option value="Asia/Amman">( GMT +3 ) Asia/Amman</option><option value="Asia/Anadyr">( GMT +12 ) Asia/Anadyr</option><option value="Asia/Aqtau">( GMT +5 ) Asia/Aqtau</option><option value="Asia/Aqtobe">( GMT +5 ) Asia/Aqtobe</option><option value="Asia/Ashgabat">( GMT +5 ) Asia/Ashgabat</option><option value="Asia/Baghdad">( GMT +3 ) Asia/Baghdad</option><option value="Asia/Bahrain">( GMT +3 ) Asia/Bahrain</option><option value="Asia/Baku">( GMT +4 ) Asia/Baku</option><option value="Asia/Bangkok">( GMT +7 ) Asia/Bangkok</option><option value="Asia/Barnaul">( GMT +7 ) Asia/Barnaul</option><option value="Asia/Beirut">( GMT +3 ) Asia/Beirut</option><option value="Asia/Bishkek">( GMT +6 ) Asia/Bishkek</option><option value="Asia/Brunei">( GMT +8 ) Asia/Brunei</option><option value="Asia/Chita">( GMT +9 ) Asia/Chita</option><option value="Asia/Choibalsan">( GMT +8 ) Asia/Choibalsan</option><option value="Asia/Colombo">( GMT +5 ) Asia/Colombo</option><option value="Asia/Damascus">( GMT +3 ) Asia/Damascus</option><option value="Asia/Dhaka">( GMT +6 ) Asia/Dhaka</option><option value="Asia/Dili">( GMT +9 ) Asia/Dili</option><option value="Asia/Dubai">( GMT +4 ) Asia/Dubai</option><option value="Asia/Dushanbe">( GMT +5 ) Asia/Dushanbe</option><option value="Asia/Gaza">( GMT +3 ) Asia/Gaza</option><option value="Asia/Hebron">( GMT +3 ) Asia/Hebron</option><option value="Asia/Ho_Chi_Minh">( GMT +7 ) Asia/Ho_Chi_Minh</option><option value="Asia/Hong_Kong">( GMT +8 ) Asia/Hong_Kong</option><option value="Asia/Hovd">( GMT +7 ) Asia/Hovd</option><option value="Asia/Irkutsk">( GMT +8 ) Asia/Irkutsk</option><option value="Asia/Jakarta">( GMT +7 ) Asia/Jakarta</option><option value="Asia/Jayapura">( GMT +9 ) Asia/Jayapura</option><option value="Asia/Jerusalem">( GMT +3 ) Asia/Jerusalem</option><option value="Asia/Kabul">( GMT +4 ) Asia/Kabul</option><option value="Asia/Kamchatka">( GMT +12 ) Asia/Kamchatka</option><option value="Asia/Karachi">( GMT +5 ) Asia/Karachi</option><option value="Asia/Kathmandu">( GMT +5 ) Asia/Kathmandu</option><option value="Asia/Khandyga">( GMT +9 ) Asia/Khandyga</option><option value="Asia/Kolkata">( GMT +5 ) Asia/Kolkata</option><option value="Asia/Krasnoyarsk">( GMT +7 ) Asia/Krasnoyarsk</option><option value="Asia/Kuala_Lumpur">( GMT +8 ) Asia/Kuala_Lumpur</option><option value="Asia/Kuching">( GMT +8 ) Asia/Kuching</option><option value="Asia/Kuwait">( GMT +3 ) Asia/Kuwait</option><option value="Asia/Macau">( GMT +8 ) Asia/Macau</option><option value="Asia/Magadan">( GMT +11 ) Asia/Magadan</option><option value="Asia/Makassar">( GMT +8 ) Asia/Makassar</option><option value="Asia/Manila">( GMT +8 ) Asia/Manila</option><option value="Asia/Muscat">( GMT +4 ) Asia/Muscat</option><option value="Asia/Nicosia">( GMT +3 ) Asia/Nicosia</option><option value="Asia/Novokuznetsk">( GMT +7 ) Asia/Novokuznetsk</option><option value="Asia/Novosibirsk">( GMT +7 ) Asia/Novosibirsk</option><option value="Asia/Omsk">( GMT +6 ) Asia/Omsk</option><option value="Asia/Oral">( GMT +5 ) Asia/Oral</option><option value="Asia/Phnom_Penh">( GMT +7 ) Asia/Phnom_Penh</option><option value="Asia/Pontianak">( GMT +7 ) Asia/Pontianak</option><option value="Asia/Pyongyang">( GMT +8 ) Asia/Pyongyang</option><option value="Asia/Qatar">( GMT +3 ) Asia/Qatar</option><option value="Asia/Qyzylorda">( GMT +6 ) Asia/Qyzylorda</option><option value="Asia/Rangoon">( GMT +6 ) Asia/Rangoon</option><option value="Asia/Riyadh">( GMT +3 ) Asia/Riyadh</option><option value="Asia/Sakhalin">( GMT +11 ) Asia/Sakhalin</option><option value="Asia/Samarkand">( GMT +5 ) Asia/Samarkand</option><option value="Asia/Seoul">( GMT +9 ) Asia/Seoul</option><option value="Asia/Shanghai">( GMT +8 ) Asia/Shanghai</option><option value="Asia/Singapore">( GMT +8 ) Asia/Singapore</option><option value="Asia/Srednekolymsk">( GMT +11 ) Asia/Srednekolymsk</option><option value="Asia/Taipei">( GMT +8 ) Asia/Taipei</option><option value="Asia/Tashkent">( GMT +5 ) Asia/Tashkent</option><option value="Asia/Tbilisi">( GMT +4 ) Asia/Tbilisi</option><option value="Asia/Tehran">( GMT +3 ) Asia/Tehran</option><option value="Asia/Thimphu">( GMT +6 ) Asia/Thimphu</option><option value="Asia/Tokyo">( GMT +9 ) Asia/Tokyo</option><option value="Asia/Tomsk">( GMT +7 ) Asia/Tomsk</option><option value="Asia/Ulaanbaatar">( GMT +8 ) Asia/Ulaanbaatar</option><option value="Asia/Urumqi">( GMT +6 ) Asia/Urumqi</option><option value="Asia/Ust-Nera">( GMT +10 ) Asia/Ust-Nera</option><option value="Asia/Vientiane">( GMT +7 ) Asia/Vientiane</option><option value="Asia/Vladivostok">( GMT +10 ) Asia/Vladivostok</option><option value="Asia/Yakutsk">( GMT +9 ) Asia/Yakutsk</option><option value="Asia/Yekaterinburg">( GMT +5 ) Asia/Yekaterinburg</option><option value="Asia/Yerevan">( GMT +4 ) Asia/Yerevan</option><option value="Atlantic/Azores">( GMT +0 ) Atlantic/Azores</option><option value="Atlantic/Bermuda">( GMT -3 ) Atlantic/Bermuda</option><option value="Atlantic/Canary">( GMT +1 ) Atlantic/Canary</option><option value="Atlantic/Cape_Verde">( GMT -1 ) Atlantic/Cape_Verde</option><option value="Atlantic/Faroe">( GMT +1 ) Atlantic/Faroe</option><option value="Atlantic/Madeira">( GMT +1 ) Atlantic/Madeira</option><option value="Atlantic/Reykjavik">( GMT +0 ) Atlantic/Reykjavik</option><option value="Atlantic/South_Georgia">( GMT -2 ) Atlantic/South_Georgia</option><option value="Atlantic/St_Helena">( GMT +0 ) Atlantic/St_Helena</option><option value="Atlantic/Stanley">( GMT -3 ) Atlantic/Stanley</option><option value="Australia/Adelaide">( GMT +10 ) Australia/Adelaide</option><option value="Australia/Brisbane">( GMT +10 ) Australia/Brisbane</option><option value="Australia/Broken_Hill">( GMT +10 ) Australia/Broken_Hill</option><option value="Australia/Currie">( GMT +11 ) Australia/Currie</option><option value="Australia/Darwin">( GMT +9 ) Australia/Darwin</option><option value="Australia/Eucla">( GMT +8 ) Australia/Eucla</option><option value="Australia/Hobart">( GMT +11 ) Australia/Hobart</option><option value="Australia/Lindeman">( GMT +10 ) Australia/Lindeman</option><option value="Australia/Lord_Howe">( GMT +11 ) Australia/Lord_Howe</option><option value="Australia/Melbourne">( GMT +11 ) Australia/Melbourne</option><option value="Australia/Perth">( GMT +8 ) Australia/Perth</option><option value="Australia/Sydney">( GMT +11 ) Australia/Sydney</option><option value="Europe/Amsterdam">( GMT +2 ) Europe/Amsterdam</option><option value="Europe/Andorra">( GMT +2 ) Europe/Andorra</option><option value="Europe/Astrakhan">( GMT +4 ) Europe/Astrakhan</option><option value="Europe/Athens">( GMT +3 ) Europe/Athens</option><option value="Europe/Belgrade">( GMT +2 ) Europe/Belgrade</option><option value="Europe/Berlin">( GMT +2 ) Europe/Berlin</option><option value="Europe/Bratislava">( GMT +2 ) Europe/Bratislava</option><option value="Europe/Brussels">( GMT +2 ) Europe/Brussels</option><option value="Europe/Bucharest">( GMT +3 ) Europe/Bucharest</option><option value="Europe/Budapest">( GMT +2 ) Europe/Budapest</option><option value="Europe/Busingen">( GMT +2 ) Europe/Busingen</option><option value="Europe/Chisinau">( GMT +3 ) Europe/Chisinau</option><option value="Europe/Copenhagen">( GMT +2 ) Europe/Copenhagen</option><option value="Europe/Dublin">( GMT +1 ) Europe/Dublin</option><option value="Europe/Gibraltar">( GMT +2 ) Europe/Gibraltar</option><option value="Europe/Guernsey">( GMT +1 ) Europe/Guernsey</option><option value="Europe/Helsinki">( GMT +3 ) Europe/Helsinki</option><option value="Europe/Isle_of_Man">( GMT +1 ) Europe/Isle_of_Man</option><option value="Europe/Istanbul">( GMT +3 ) Europe/Istanbul</option><option value="Europe/Jersey">( GMT +1 ) Europe/Jersey</option><option value="Europe/Kaliningrad">( GMT +2 ) Europe/Kaliningrad</option><option value="Europe/Kiev">( GMT +3 ) Europe/Kiev</option><option value="Europe/Kirov">( GMT +3 ) Europe/Kirov</option><option value="Europe/Lisbon">( GMT +1 ) Europe/Lisbon</option><option value="Europe/Ljubljana">( GMT +2 ) Europe/Ljubljana</option><option value="Europe/London">( GMT +1 ) Europe/London</option><option value="Europe/Luxembourg">( GMT +2 ) Europe/Luxembourg</option><option value="Europe/Madrid">( GMT +2 ) Europe/Madrid</option><option value="Europe/Malta">( GMT +2 ) Europe/Malta</option><option value="Europe/Mariehamn">( GMT +3 ) Europe/Mariehamn</option><option value="Europe/Minsk">( GMT +3 ) Europe/Minsk</option><option value="Europe/Monaco">( GMT +2 ) Europe/Monaco</option><option value="Europe/Moscow">( GMT +3 ) Europe/Moscow</option><option value="Europe/Oslo">( GMT +2 ) Europe/Oslo</option><option value="Europe/Paris">( GMT +2 ) Europe/Paris</option><option value="Europe/Podgorica">( GMT +2 ) Europe/Podgorica</option><option value="Europe/Prague">( GMT +2 ) Europe/Prague</option><option value="Europe/Riga">( GMT +3 ) Europe/Riga</option><option value="Europe/Rome">( GMT +2 ) Europe/Rome</option><option value="Europe/Samara">( GMT +4 ) Europe/Samara</option><option value="Europe/San_Marino">( GMT +2 ) Europe/San_Marino</option><option value="Europe/Sarajevo">( GMT +2 ) Europe/Sarajevo</option><option value="Europe/Simferopol">( GMT +3 ) Europe/Simferopol</option><option value="Europe/Skopje">( GMT +2 ) Europe/Skopje</option><option value="Europe/Sofia">( GMT +3 ) Europe/Sofia</option><option value="Europe/Stockholm">( GMT +2 ) Europe/Stockholm</option><option value="Europe/Tallinn">( GMT +3 ) Europe/Tallinn</option><option value="Europe/Tirane">( GMT +2 ) Europe/Tirane</option><option value="Europe/Ulyanovsk">( GMT +4 ) Europe/Ulyanovsk</option><option value="Europe/Uzhgorod">( GMT +3 ) Europe/Uzhgorod</option><option value="Europe/Vaduz">( GMT +2 ) Europe/Vaduz</option><option value="Europe/Vatican">( GMT +2 ) Europe/Vatican</option><option value="Europe/Vienna">( GMT +2 ) Europe/Vienna</option><option value="Europe/Vilnius">( GMT +3 ) Europe/Vilnius</option><option value="Europe/Volgograd">( GMT +3 ) Europe/Volgograd</option><option value="Europe/Warsaw">( GMT +2 ) Europe/Warsaw</option><option value="Europe/Zagreb">( GMT +2 ) Europe/Zagreb</option><option value="Europe/Zaporozhye">( GMT +3 ) Europe/Zaporozhye</option><option value="Europe/Zurich">( GMT +2 ) Europe/Zurich</option><option value="Indian/Antananarivo">( GMT +3 ) Indian/Antananarivo</option><option value="Indian/Chagos">( GMT +6 ) Indian/Chagos</option><option value="Indian/Christmas">( GMT +7 ) Indian/Christmas</option><option value="Indian/Cocos">( GMT +6 ) Indian/Cocos</option><option value="Indian/Comoro">( GMT +3 ) Indian/Comoro</option><option value="Indian/Kerguelen">( GMT +5 ) Indian/Kerguelen</option><option value="Indian/Mahe">( GMT +4 ) Indian/Mahe</option><option value="Indian/Maldives">( GMT +5 ) Indian/Maldives</option><option value="Indian/Mauritius">( GMT +4 ) Indian/Mauritius</option><option value="Indian/Mayotte">( GMT +3 ) Indian/Mayotte</option><option value="Indian/Reunion">( GMT +4 ) Indian/Reunion</option><option value="Pacific/Apia">( GMT +14 ) Pacific/Apia</option><option value="Pacific/Auckland">( GMT +13 ) Pacific/Auckland</option><option value="Pacific/Bougainville">( GMT +11 ) Pacific/Bougainville</option><option value="Pacific/Chatham">( GMT +13 ) Pacific/Chatham</option><option value="Pacific/Chuuk">( GMT +10 ) Pacific/Chuuk</option><option value="Pacific/Easter">( GMT -5 ) Pacific/Easter</option><option value="Pacific/Efate">( GMT +11 ) Pacific/Efate</option><option value="Pacific/Enderbury">( GMT +13 ) Pacific/Enderbury</option><option value="Pacific/Fakaofo">( GMT +13 ) Pacific/Fakaofo</option><option value="Pacific/Fiji">( GMT +12 ) Pacific/Fiji</option><option value="Pacific/Funafuti">( GMT +12 ) Pacific/Funafuti</option><option value="Pacific/Galapagos">( GMT -6 ) Pacific/Galapagos</option><option value="Pacific/Gambier">( GMT -9 ) Pacific/Gambier</option><option value="Pacific/Guadalcanal">( GMT +11 ) Pacific/Guadalcanal</option><option value="Pacific/Guam">( GMT +10 ) Pacific/Guam</option><option value="Pacific/Honolulu">( GMT -10 ) Pacific/Honolulu</option><option value="Pacific/Johnston">( GMT -10 ) Pacific/Johnston</option><option value="Pacific/Kiritimati">( GMT +14 ) Pacific/Kiritimati</option><option value="Pacific/Kosrae">( GMT +11 ) Pacific/Kosrae</option><option value="Pacific/Kwajalein">( GMT +12 ) Pacific/Kwajalein</option><option value="Pacific/Majuro">( GMT +12 ) Pacific/Majuro</option><option value="Pacific/Marquesas">( GMT -10 ) Pacific/Marquesas</option><option value="Pacific/Midway">( GMT -11 ) Pacific/Midway</option><option value="Pacific/Nauru">( GMT +12 ) Pacific/Nauru</option><option value="Pacific/Niue">( GMT -11 ) Pacific/Niue</option><option value="Pacific/Norfolk">( GMT +11 ) Pacific/Norfolk</option><option value="Pacific/Noumea">( GMT +11 ) Pacific/Noumea</option><option value="Pacific/Pago_Pago">( GMT -11 ) Pacific/Pago_Pago</option><option value="Pacific/Palau">( GMT +9 ) Pacific/Palau</option><option value="Pacific/Pitcairn">( GMT -8 ) Pacific/Pitcairn</option><option value="Pacific/Pohnpei">( GMT +11 ) Pacific/Pohnpei</option><option value="Pacific/Port_Moresby">( GMT +10 ) Pacific/Port_Moresby</option><option value="Pacific/Rarotonga">( GMT -10 ) Pacific/Rarotonga</option><option value="Pacific/Saipan">( GMT +10 ) Pacific/Saipan</option><option value="Pacific/Tahiti">( GMT -10 ) Pacific/Tahiti</option><option value="Pacific/Tarawa">( GMT +12 ) Pacific/Tarawa</option><option value="Pacific/Tongatapu">( GMT +13 ) Pacific/Tongatapu</option><option value="Pacific/Wake">( GMT +12 ) Pacific/Wake</option><option value="Pacific/Wallis">( GMT +12 ) Pacific/Wallis</option></select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-7">' +
                '<div class="form-group">' +
                '<div class="checkbox"><label class="col-xs-7 control-label" style="margin-left: 14px;"><input id="countdown" type="checkbox" disabled>Show a countdown timer</label></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="tickets-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 214px;">Select one or more tickets (max 5).</div>' +
                '<div id="ticketentry-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="ac-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>' +
                '<div id="acentry-table"></div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhPPV.validatePlistFinalEditStep()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        $('#any_time').change(function () {
            if ($('#any_time').prop('checked')) {
                $('#datetimepicker1').attr('disabled', '');
                $('#datetimepicker2').attr('disabled', '');
                $('#end-date').attr('disabled', '');
                $('#time-zone').attr('disabled', '');
                $('#countdown').attr('disabled', '');
                $('#scheduling-wrapper .control-label').css('color', '#999');
                $('#end-date').prop('checked', false);
                $('#countdown').prop('checked', false);
            }
        });

        $('#range').change(function () {
            if ($('#range').prop('checked')) {
                $('#datetimepicker1').removeAttr('disabled');
                $('#end-date').removeAttr('disabled');
                $('#time-zone').removeAttr('disabled');
                $('#countdown').removeAttr('disabled');
                $('#scheduling-wrapper .control-label').css('color', '#000');
            }
        });

        $('#end-date').change(function () {
            if ($('#end-date').prop('checked')) {
                $('#datetimepicker2').removeAttr('disabled');
            } else {
                $('#datetimepicker2').attr('disabled', '');
                $('#datetimepicker2').val('');
            }
        });

        $('#datetimepicker1').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true
        });
        $('#datetimepicker2').datetimepicker({
            toolbarPlacement: 'bottom',
            showClear: true,
            format: 'YYYY-MM-DD hh:mm A',
            sideBySide: true,
            useCurrent: false
        });
        $("#datetimepicker1").on("dp.change", function (e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker2").on("dp.change", function (e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });

        smhPPV.activatePlistEditWizard();
        smhPPV.getPlaylistDetails(true);
    },
    //Edit PPV Category
    editCatEntry: function (eid, name, type, tickets, ac_id, ac_name) {
        ppv_entry_id = eid;
        ppv_entry_name = name;
        ppv_entry_type = type;
        ppv_ac_id = ac_id;
        ppv_ac_name = ac_name;
        ppv_tickets = tickets.split('_');

        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 33.33%;"><a href="#details-tab" data-toggle="tab">CONFIGURATION</a></li>' +
                '<li style="width: 33.33%;"><a href="#tickets-tab" data-toggle="tab">ASSIGN TICKET(S)</a></li>' +
                '<li style="width: 33.33%;"><a href="#ac-tab" data-toggle="tab">ASSIGN ACCESS CONTROL</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="details-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 745px; padding: 10px 10px 0; font-size: 20px;">Entry Details</div>' +
                '<div id="details"></div>' +
                '</div>' +
                '<div class="tab-pane" id="tickets-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 214px;">Select one or more tickets (max 5).</div>' +
                '<div id="ticketentry-table"></div>' +
                '</div>' +
                '<div class="tab-pane" id="ac-tab">' +
                '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>' +
                '<div id="acentry-table"></div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhPPV.validateFinalEditStep()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');
        smhPPV.activateCatEditWizard();
        smhPPV.getCatDetails();
    },
    //Get Entry Details
    getEntryDetails: function (edit) {
        partnerData = '';
        startDate = '';
        endDate = '';
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var desc = ''
            if (results['description'] == '' || results['description'] == null) {
                desc = '';
            } else {
                desc = results['description'];
            }
            if (results['partnerData']) {
                partnerData = results['partnerData'];
            }
            if (results['startDate']) {
                startDate = results['startDate'];
            }
            if (results['endDate']) {
                endDate = results['endDate'];
            }
            if (edit) {
                if (startDate) {
                    var ppvJSON = JSON.parse(partnerData);
                    var ppv_tz = '';
                    if (ppvJSON.ppvConfig) {
                        ppv_tz = ppvJSON.ppvConfig[0].timezone;
                        $('#time-zone').val(ppv_tz);
                        if (ppvJSON.ppvConfig[0].countdown == 'true') {
                            $('#countdown').prop('checked', true);
                        } else {
                            $('#countdown').prop('checked', false);
                        }
                    }
                    $('#range').prop('checked', true);
                    $('#datetimepicker1').removeAttr('disabled');
                    $('#time-zone').removeAttr('disabled');
                    $('#countdown').removeAttr('disabled');
                    $('#end-date').removeAttr('disabled');
                    $('#scheduling-wrapper .control-label').css('color', '#000');
                    var starttime = moment.utc(startDate * 1000).tz(ppv_tz).format('YYYY-MM-DD hh:mm A');
                    $('#datetimepicker1').val(starttime);
                }
                if (endDate) {
                    $('#end-date').removeAttr('disabled');
                    $('#end-date').prop('checked', true);
                    $('#datetimepicker2').removeAttr('disabled');
                    var endtime = moment.utc(endDate * 1000).tz(ppv_tz).format('YYYY-MM-DD hh:mm A');
                    $('#datetimepicker2').val(endtime);
                }
                if (!startDate && !endDate) {
                    $('#any_time').prop('checked', true);
                    var timezone = jstz.determine();
                    var tz_name = timezone.name();
                    $('select#time-zone').val(tz_name);
                }
            }

            $('#details').html('<form id="details-form">' +
                    '<table style="border: 0px !important;font-size: 14px;">' +
                    '<tr>' +
                    '<td>Thumbnail:</td><td><div id="thumb"><img src="/p/' + sessInfo.pid + '/thumbnail/entry_id/' + ppv_entry_id + '"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Name:</td><td><div id="name" style="width: 337px; margin-top: 10px;"><input name="content_name" type="text" class="form-control" placeholder="Enter a Name" id="content_name" value="' + results['name'] + '"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Custom Message:</td><td><div id="desc" style="width: 595px; margin-top: 10px;"><textarea name="content_desc" class="form-control" id="content_desc">' + desc + '</textarea></div></td>' +
                    '</tr>' +
                    '</table>' +
                    '</form>');
            $('#content_desc').wysihtml5({
                "font-styles": true,
                "emphasis": true,
                "lists": true,
                "html": true,
                "link": true,
                "image": false,
                "color": false,
                "blockquote": true
            });
        };

        $('#details').html('<div style="position: relative; top: 70px;"><center><div style="padding: 10px;"></div><img src="/img/loading.gif" height="20px" /></center></div>');
        var version;
        client.baseEntry.get(cb, ppv_entry_id, version);
    },
    //Gets playlist details
    getPlaylistDetails: function (edit) {
        var desc = ''
        var name = '';
        var entry = '';
        partnerData = '';
        startDate = '';
        endDate = '';
        playlistContent = new Array();
        var cb2 = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            if (results['startDate']) {
                startDate = results['startDate'];
            }
            if (results['endDate']) {
                endDate = results['endDate'];
            }
            if (edit) {
                if (startDate) {
                    var ppvJSON = JSON.parse(partnerData);
                    var ppv_tz = '';
                    if (ppvJSON.ppvConfig) {
                        ppv_tz = ppvJSON.ppvConfig[0].timezone;
                        $('#time-zone').val(ppv_tz);
                        if (ppvJSON.ppvConfig[0].countdown == 'true') {
                            $('#countdown').prop('checked', true);
                        } else {
                            $('#countdown').prop('checked', false);
                        }
                    }
                    $('#range').prop('checked', true);
                    $('#datetimepicker1').removeAttr('disabled');
                    $('#time-zone').removeAttr('disabled');
                    $('#countdown').removeAttr('disabled');
                    $('#end-date').removeAttr('disabled');
                    $('#scheduling-wrapper .control-label').css('color', '#000');
                    var starttime = moment.utc(startDate * 1000).tz(ppv_tz).format('YYYY-MM-DD hh:mm A');
                    $('#datetimepicker1').val(starttime);
                }
                if (endDate) {
                    $('#end-date').removeAttr('disabled');
                    $('#end-date').prop('checked', true);
                    $('#datetimepicker2').removeAttr('disabled');
                    var endtime = moment.utc(endDate * 1000).tz(ppv_tz).format('YYYY-MM-DD hh:mm A');
                    $('#datetimepicker2').val(endtime);
                }
                if (!startDate && !endDate) {
                    $('#any_time').prop('checked', true);
                    var timezone = jstz.determine();
                    var tz_name = timezone.name();
                    $('select#time-zone').val(tz_name);
                }
            }

            $('#details').html('<form id="details-form">' +
                    '<table style="border: 0px !important;font-size: 12px;">' +
                    '<tr>' +
                    '<td>Thumbnail:</td><td><div id="thumb"><img src="/p/' + sessInfo.pid + '/thumbnail/entry_id/' + entry + '"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Name:</td><td><div id="name" style="width: 337px; margin-top: 10px;"><input name="content_name" type="text" class="form-control" placeholder="Enter a Name" id="content_name" value="' + name + '"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Custom Message:</td><td><div id="desc" style="width: 595px; margin-top: 10px;"><textarea name="content_desc" class="form-control" id="content_desc">' + desc + '</textarea></div></td>' +
                    '</tr>' +
                    '</table>' +
                    '</form>');
            $('#content_desc').wysihtml5({
                "font-styles": true,
                "emphasis": true,
                "lists": true,
                "html": true,
                "link": true,
                "image": false,
                "color": false,
                "blockquote": true
            });
        };
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            if (results['description'] == '' || results['description'] == null) {
                desc = '';
            } else {
                desc = results['description'];
            }
            if (results['name'] == '' || results['name'] == null) {
                name = '';
            } else {
                name = results['name'];
            }
            if (results['playlistContent']) {
                playlistContent = results['playlistContent'].split(",");
            }

            if (results['partnerData']) {
                partnerData = results['partnerData'];
            }

            entry = smhPPV.get_thumb(ppv_entry_id);
            var version;
            client.baseEntry.get(cb2, entry, version);
        };

        $('#details').html('<div style="position: relative; top: 70px;"><center><div style="padding: 10px;"></div><img src="/img/loading.gif" height="20px" /></center></div>');
        var version;
        client.playlist.get(cb, ppv_entry_id, version);
    },
    //Get Category details
    getCatDetails: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var desc = ''
            if (results['description'] == '' || results['description'] == null) {
                desc = '';
            } else {
                desc = results['description'];
            }

            var entry = smhPPV.get_cat_thumb(ppv_entry_id);

            $('#details').html('<form id="details-form">' +
                    '<table style="border: 0px !important;font-size: 12px;">' +
                    '<tr>' +
                    '<td>Thumbnail:</td><td><div id="thumb"><img src="/p/' + sessInfo.pid + '/thumbnail/entry_id/' + entry + '"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Name:</td><td><div id="name" style="width: 337px; margin-top: 10px;"><input name="content_name" type="text" class="form-control" placeholder="Enter a Name" id="content_name" value="' + results['name'] + '"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Custom Message:</td><td><div id="desc" style="width: 595px; margin-top: 10px;"><textarea name="content_desc" class="form-control" id="content_desc">' + desc + '</textarea></div></td>' +
                    '</tr>' +
                    '</table>' +
                    '</form>');
            $('#content_desc').wysihtml5({
                "font-styles": true,
                "emphasis": true,
                "lists": true,
                "html": true,
                "link": true,
                "image": false,
                "color": false,
                "blockquote": true
            });
        };

        $('#details').html('<div style="position: relative; top: 70px;"><center><div style="padding: 10px;"></div><img src="/img/loading.gif" height="20px" /></center></div>');
        client.category.get(cb, ppv_entry_id);
    },
    //Gets thumbnail image
    get_thumb: function (entryId) {
        var sessData = {
            entry_id: entryId,
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var thumb = '';
        $.ajax({
            type: "GET",
            url: ApiUrl + 'action=get_thumb',
            async: false,
            data: sessData,
            dataType: 'json'
        }).done(function (data) {
            thumb = data;
        });

        return thumb;
    },
    //Gets category thumbnail image
    get_cat_thumb: function (catId) {
        var sessData = {
            cat_id: catId,
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var thumb = '';
        $.ajax({
            type: "GET",
            url: ApiUrl + 'action=get_cat_thumb',
            async: false,
            data: sessData,
            dataType: 'json'
        }).done(function (data) {
            thumb = data;
        });

        return thumb;
    },
    //Saves PPV details
    saveDetails: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        var name = $('#content_name').val();
        var container = $("#details-form iframe");
        var desc = container.contents().find("body").html();
        var description = (desc == '<br>') ? '' : desc;
        var baseEntry;
        baseEntry = new KalturaBaseEntry();
        baseEntry.name = name;
        baseEntry.description = description;
        client.baseEntry.update(cb, ppv_entry_id, baseEntry);
    },
    //Saves PPV scheduling
    saveScheduling: function (any_time, range, startD, has_end, endD) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        if (any_time) {
            var baseEntry;
            baseEntry = new KalturaBaseEntry();
            baseEntry.startDate = '';
            baseEntry.endDate = '';
            client.baseEntry.update(cb, ppv_entry_id, baseEntry);
        }
        if (range) {
            var timezone = $('#time-zone').val();
            var countdown = ($('#countdown').prop('checked')) ? 'true' : 'false';
            var pData = '';
            if (partnerData) {
                var ppvJSON = JSON.parse(partnerData);
                if (ppvJSON.ppvConfig) {
                    ppvJSON.ppvConfig[0].timezone = timezone;
                    ppvJSON.ppvConfig[0].countdown = countdown;
                } else {
                    var ppvConfig = {};
                    ppvConfig['timezone'] = timezone;
                    ppvConfig['countdown'] = countdown;
                    ppvJSON['ppvConfig'] = [];
                    ppvJSON['ppvConfig'][0] = ppvConfig;
                }
                pData = JSON.stringify(ppvJSON);

                var starttime = moment(startD, ["YYYY-MM-DD hh:mm A"]).format('YYYY-MM-DD HH:mm:ss');
                var starttime_unix = moment(startD, ["YYYY-MM-DD hh:mm A"]).tz(timezone).format('MM/DD/YYYY HH:mm:ss');
                var starttime_unix_time = moment(moment(starttime_unix, "MM/DD/YYYY HH:mm:ss").unix() * 1000);
                var offset = moment.tz.zone(timezone).offset(starttime_unix_time);

                var starttime_utc = moment.utc(starttime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
                var starttime_utc_unix = moment.utc(starttime_utc).utcOffset(offset);
                startDate = starttime_utc_unix.unix();

                if (has_end) {
                    var endtime = moment(endD, ["YYYY-MM-DD hh:mm A"]).format('YYYY-MM-DD HH:mm:ss');
                    var endtime_utc = moment.utc(endtime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
                    var endtime_utc_unix = moment.utc(endtime_utc).utcOffset(offset);
                    endDate = endtime_utc_unix.unix();
                } else {
                    endDate = '';
                }

            } else {
                pData = '{"ppvConfig":[{"timezone":"' + timezone + '","countdown":"' + countdown + '"}]}';
            }
            var baseEntry;
            baseEntry = new KalturaBaseEntry();
            baseEntry.startDate = startDate;
            baseEntry.endDate = endDate;
            baseEntry.partnerData = pData;
            client.baseEntry.update(cb, ppv_entry_id, baseEntry);
        }
    },
    savePlistScheduling: function (any_time, range, startD, has_end, endD) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        if (any_time) {
            client.startMultiRequest();
            $.each(playlistContent, function (key, value) {
                var baseEntry;
                baseEntry = new KalturaBaseEntry();
                baseEntry.startDate = '';
                baseEntry.endDate = '';
                client.baseEntry.update(cb, value, baseEntry);
            });
            client.doMultiRequest(cb);
        }
        if (range) {
            var timezone = $('#time-zone').val();
            var countdown = ($('#countdown').prop('checked')) ? 'true' : 'false';
            var pData = '';
            if (partnerData) {
                var ppvJSON = JSON.parse(partnerData);
                if (ppvJSON.ppvConfig) {
                    ppvJSON.ppvConfig[0].timezone = timezone;
                    ppvJSON.ppvConfig[0].countdown = countdown;
                } else {
                    var ppvConfig = {};
                    ppvConfig['timezone'] = timezone;
                    ppvConfig['countdown'] = countdown;
                    ppvJSON['ppvConfig'] = [];
                    ppvJSON['ppvConfig'][0] = ppvConfig;
                }
                pData = JSON.stringify(ppvJSON);

                var starttime = moment(startD, ["YYYY-MM-DD hh:mm A"]).format('YYYY-MM-DD HH:mm:ss');
                var starttime_unix = moment(startD, ["YYYY-MM-DD hh:mm A"]).tz(timezone).format('MM/DD/YYYY HH:mm:ss');
                var starttime_unix_time = moment(moment(starttime_unix, "MM/DD/YYYY HH:mm:ss").unix() * 1000);
                var offset = moment.tz.zone(timezone).offset(starttime_unix_time);

                var starttime_utc = moment.utc(starttime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
                var starttime_utc_unix = moment.utc(starttime_utc).utcOffset(offset);
                startDate = starttime_utc_unix.unix();

                if (has_end) {
                    var endtime = moment(endD, ["YYYY-MM-DD hh:mm A"]).format('YYYY-MM-DD HH:mm:ss');
                    var endtime_utc = moment.utc(endtime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
                    var endtime_utc_unix = moment.utc(endtime_utc).utcOffset(offset);
                    endDate = endtime_utc_unix.unix();
                } else {
                    endDate = '';
                }

            } else {
                pData = '{"ppvConfig":[{"timezone":"' + timezone + '","countdown":"' + countdown + '"}]}';
            }
            client.startMultiRequest();
            var updateStats;
            var playlist = new KalturaPlaylist();
            playlist.partnerData = pData;
            client.playlist.update(cb, ppv_entry_id, playlist, updateStats);
            $.each(playlistContent, function (key, value) {
                var baseEntry;
                baseEntry = new KalturaBaseEntry();
                baseEntry.startDate = startDate;
                baseEntry.endDate = endDate;
                client.baseEntry.update(cb, value, baseEntry);
            });
            client.doMultiRequest(cb);
        }
    },
    //Saves PPV details
    savePlaylistDetails: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        var name = $('#content_name').val();
        var container = $("#details-form iframe");
        var desc = container.contents().find("body").html();
        var description = (desc == '<br>') ? '' : desc;
        var updateStats;
        var playlist = new KalturaPlaylist();
        playlist.name = name;
        playlist.description = description;
        client.playlist.update(cb, ppv_entry_id, playlist, updateStats);
    },
    //Saves PPV Category details
    saveCatDetails: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        var name = $('#content_name').val();
        var container = $("#details-form iframe");
        var desc = container.contents().find("body").html();
        var description = (desc == '<br>') ? '' : desc;
        var category = new KalturaCategory();
        category.name = name;
        category.description = description;
        client.category.update(cb, ppv_entry_id, category);
    },
    //Get Tickets table
    getEntriesTickets: function (edit) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#ticketentry-table').empty();
        $('#ticketentry-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="entrytickets-data"></table>');
        entryTickets = $('#entrytickets-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "paginate": false,
            "searching": true,
            "info": false,
            "scrollCollapse": true,
            "scrollY": "341px",
            "lengthChange": false,
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "action": 'list_entryTickets',
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "currency": $.cookie('currency')
                    });
                }
            },
            "language": {
                "zeroRecords": "No Tickets Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'>Name</span>"
                },
                {
                    "title": "<span style='float: left;'>Price</span>"
                },
                {
                    "title": "<span style='float: left;'>Type</span>"
                },
                {
                    "title": "<span style='float: left;'>Expiry Period</span>"
                },
                {
                    "title": "<span style='float: left;'>Max Views</span>"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 6, 7);
                if (edit) {
                    $.each(ppv_tickets, function (index, value) {
                        $('#' + value).prop('checked', true);
                    });
                }
            }
        });
        $('#ticketentry-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Get Access Control profiles
    getACEntries: function (edit) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#acentry-table').empty();
        $('#acentry-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="acentry-data"></table>');
        acEntry = $('#acentry-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "paginate": false,
            "searching": true,
            "info": false,
            "scrollCollapse": true,
            "scrollY": "341px",
            "lengthChange": false,
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "action": 'list_actype',
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    });
                }
            },
            "language": {
                "zeroRecords": "No Access Control Profiles Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'>Name</span>"
                },
                {
                    "title": "<span style='float: left;'>Rule</span>",
                    "width": "200px"
                },
                {
                    "title": "<span style='float: left;'>Created At</span>",
                    "width": "200px"
                },
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 4, 7);
                if (edit) {
                    $('#' + ppv_ac_id).prop('checked', true);
                }
            }
        });
        $('#acentry-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Get Playlist table
    getPlaylists: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#ppv-playlist-table').empty();
        $('#ppv-playlist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="ppv-playlist-data"></table>');
        plistEntry = $('#ppv-playlist-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "paginate": false,
            "searching": true,
            "info": false,
            "scrollCollapse": true,
            "scrollY": "341px",
            "lengthChange": false,
            "ajax": {
                "url": "/api/v1/ppv_playlists",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
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
                    "title": "<span style='float: left;'>Name</span>"
                },
                {
                    "title": "<span style='float: left;'>ID</span>"
                },
                {
                    "title": "<span style='float: left;'>Created At</span>"
                },
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 4, 7);
            }
        });
        $('#ppv-playlist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Get Categories table
    getCategories: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#cat-table').empty();
        $('#cat-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="ppv-cat-data"></table>');
        catTable = $('#ppv-cat-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 7,
            "paginate": true,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "ajax": {
                "url": "/api/v1/ppv_categories",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz
                    });
                }
            },
            "language": {
                "zeroRecords": "No Categories Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'>Name</span>"
                },
                {
                    "title": "<span style='float: left;'>ID</span>"
                },
                {
                    "title": "<span style='float: left;'>Created At</span>"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 5, 7);
            }
        });
    },
    //Get Entries table
    getMediaEntries: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#mediaentry-table').empty();
        $('#mediaentry-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="ppv-entries-data"></table>');
        ppvEntriesTable = $('#ppv-entries-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 7,
            "paginate": true,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "ajax": {
                "url": "/api/v1/ppv_entries",
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
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'>Name</span>"
                },
                {
                    "title": "<span style='float: left;'>Entry ID</span>"
                },
                {
                    "title": "<span style='float: left;'>Type</span>"
                },
                {
                    "title": "<span style='float: left;'>Duration</span>"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 5, 7);
            }
        });
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
                categories = smhPPV.getNestedChildren(categories_arr, 0);
            }
        };

        var filter = new KalturaCategoryFilter();
        filter.orderBy = "+name";
        var pager = null;
        client.category.listAction(cb, filter, pager);
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
                    var ac_obj = {};
                    ac_obj['id'] = value.id;
                    ac_obj['name'] = value.name;
                    ac_obj['parentId'] = 0;
                    ac_obj['children'] = [];
                    ac_arr.push(ac_obj);
                });
                ac = ac_arr;
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
    //Creates nested children
    getNestedChildren: function (arr, parentId) {
        var out = []
        for (var i in arr) {
            if (arr[i].parentId == parentId) {
                var children = smhPPV.getNestedChildren(arr, arr[i].id)

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
    //Creates unordered tree
    json_tree: function (data, type) {
        var json = '<ul>';
        for (var i = 0; i < data.length; ++i) {
            if (data[i].children.length) {
                json = json + '<li class="collapsed"><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
                json = json + smhPPV.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Resets filters
    resetFilters: function () {
        categoryIDs = [];
        mediaTypes = [];
        duration = [];
        clipped = [];
        ac_filter = [];
        flavors_filter = [];
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_ppv_content_metadata';
        }
    },
    //Reset Modal
    resetPreviewModal: function () {
        $('#smh-modal3 .modal-header').empty();
        $('#smh-modal3 .modal-body').empty();
        $('#smh-modal3 .modal-footer').empty();
        $('#smh-modal3 .modal-content').css('min-height', '');
        $('#smh-modal3 .smh-dialog2').css('width', '');
        $('#smh-modal3 .modal-body').css('height', '');
        $('#smh-modal3 .modal-body').css('padding', '15px');
    },
    //Register all user actions
    registerActions: function () {
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal3').on('click', '.smh-close', function () {
            $('#smh-modal3').on('hidden.bs.modal', function (e) {
                smhPPV.resetPreviewModal();
            });
        });
    }
}

// PPV on ready
$(document).ready(function () {
    smhPPV = new PPV();
    smhPPV.registerActions();
    smhPPV.getGateways();
    smhPPV.getContent();
    smhPPV.getCats();
    smhPPV.getAccessControlProfiles();
    smhPPV.getFlavors();
});
