/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	AC
 *
 *	7-3-2014
 */
//AC constructor
function AC() {}

//Global variables
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
var authFlavors = {};
var bulkdelete = new Array();
var total_entries;
var CacheApiUrl = "/apps/cache/v1.0/index.php?";

//AC prototype/class
AC.prototype = {
    constructor: AC,
    //Inserts name on page
    getAC: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#ac-table').empty();
        $('#ac-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="ac-data"></table>');
        acTable = $('#ac-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": false,
            "info": true,
            "lengthChange": true,
            "ajax": {
                "url": "/api/v1/getAC",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("ACCESS_CONTROL_UPDATE", sessPerm) != -1) ? true : false,
                        "d": ($.inArray("ACCESS_CONTROL_DELETE", sessPerm) != -1) ? true : false
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No access control found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><input type='checkbox' class='ac-delete' id='ac-deleteAll' style='width:16px; margin-right: 7px;' name='ac_deleteAll' /></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>ID</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Name</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Description</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Rules</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Default</div></span>",
                    "width": "70px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                    "width": "170px"
                },
            ],
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 8, 10);
            }
        });

        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled', '');
        $('#ac-table').on('change', ".ac-delete", function () {
            var anyBoxesChecked = false;
            $('#ac-table input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });

            if (anyBoxesChecked == true && ($.inArray("ACCESS_CONTROL_DELETE", sessPerm) != -1)) {
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled', '');
            }
        });
        $('#ac-deleteAll').click(function () {
            if (this.checked) {
                $('.ac-delete').each(function () {
                    this.checked = true;
                });
            } else {
                $('.ac-delete').each(function () {
                    this.checked = false;
                });
            }
        });
    },
    //Add access control modal
    addAC: function () {
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '680px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ac-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Profile</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<form id="add-ac-form">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 13%;" class="active"><a href="#details-tab" data-toggle="tab">DETAILS</a></li>' +
                '<li style="width: 13%;"><a href="#domains-tab" data-toggle="tab">DOMAINS</a></li>' +
                '<li style="width: 14%;"><a href="#countries-tab" data-toggle="tab">COUNTRIES</a></li>' +
                '<li style="width: 12%;"><a href="#ips-tab" data-toggle="tab">IPs</a></li>' +
                '<li style="width: 13%;"><a href="#flavors-tab" data-toggle="tab">FLAVORS</a></li>' +
                '<li style="width: 35%;"><a href="#advsec-tab" data-toggle="tab">ADVANCED SECURITY & PPV</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="details-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Enter Profile Details' +
                '</div>' +
                '<div class="col-sm-8 center-block">' +
                '<table width="100%" border="0" id="ac-add-table">' +
                '<tr>' +
                '<td><span class="required" style="font-weight: normal;">Profile Name:</span></td><td style="width: 71%;"><input type="text" name="profile_name" id="profile_name" class="form-control" placeholder="Enter a profile name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="profile_desc" id="profile_desc" class="form-control" placeholder="Enter a description"></td>' +
                '</tr>' +
                '<tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="domains-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Which DNS domains are able to access the video?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_domains" id="all_domains" name="domains" checked> All domains</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-10" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="only_domains" id="only_domains" name="domains"> Only in the following domains:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-domains"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-domain-only"><i class="fa fa-plus-square-o"></i> Add another domain</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-domain-only"><i class="fa fa-minus-square-o"></i> Remove selected domains</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-11" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_domains" id="block_domains" name="domains"> Block from the following domains:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-domains"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-domain"><i class="fa fa-plus-square-o"></i> Add another domain</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-domain"><i class="fa fa-minus-square-o"></i> Remove selected domains</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="countries-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Where can viewers come from?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_countries" id="all_countries" name="countries" checked> Anywhere</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-11" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="allow_countries" id="allow_countries" name="countries"> Only from the following countries:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-countries"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-allow-country"><i class="fa fa-plus-square-o"></i> Add Countries</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-allow-country"><i class="fa fa-minus-square-o"></i> Remove selected Countries</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-11" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_countries" id="block_countries" name="countries"> Block from the following countries:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-countries"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-country"><i class="fa fa-plus-square-o"></i> Add Countries</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-country"><i class="fa fa-minus-square-o"></i> Remove selected Countries</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="ips-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Which IP ranges are able to access the video?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_ips" id="all_ips" name="ips" checked> All IPs</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-9" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="only_ips" id="only_ips" name="ips"> Only for the following IPs:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-ips"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-ip-only"><i class="fa fa-plus-square-o"></i> Add another IP</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-ip-only"><i class="fa fa-minus-square-o"></i> Remove selected IPs</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-10" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_ips" id="block_ips" name="ips"> Block from the following IPs:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-ips"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-ip"><i class="fa fa-plus-square-o"></i> Add another IP</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-ip"><i class="fa fa-minus-square-o"></i> Remove selected IPs</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="flavors-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Which flavors are authorized for playback?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_flavors" id="all_flavors" name="flavors" checked> All Flavors</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-12" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="only_flavors" id="only_flavors" name="flavors"> Only flavors defined in the following list:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-flavors"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-flavor-only"><i class="fa fa-plus-square-o"></i> Add Flavor</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-flavor-only"><i class="fa fa-minus-square-o"></i> Remove selected Flavors</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-12" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_flavors" id="block_flavors" name="flavors"> Block flavors defined in the following list:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-flavors"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-flavor"><i class="fa fa-plus-square-o"></i> Add Flavor</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-flavor"><i class="fa fa-minus-square-o"></i> Remove selected Flavors</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="advsec-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 25px; text-align: center;">' +
                'Restrict access to the video?<br><div style="font-size: 12px; color: #999; font-weight: normal;">Relevant for pay-per-view or members only models</div>' +
                '</div>' +
                '<div class="col-sm-6" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="checkbox"><label><input type="checkbox" value="true" id="secure" name="secure"> Protect Video With Authentication Token</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="preview-title" class="col-sm-3" style="margin-top: 15px; margin-left: 20px; font-weight: normal;">' +
                '<div class="checkbox"><label><input type="checkbox" value="true" id="preview" name="preview" disabled> Free Preview</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="preview-desc" class="col-sm-7" style="margin-left: 20px; font-weight: normal;">' +
                'Allow free preview of <div id="preview-time"></div> (minutes : seconds) followed by a prompt to pay or login for continued viewing.' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhAC.saveAC()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '</form>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#preview-time').timepicker({
            format: 'HH:mm'
        });

        $('#preview-time a').removeClass('ui-state-default');
        $('#preview-time a').addClass('ui-state-disabled');

        $('.rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        //domains
        $('#domains-tab').on('click', '#add-domain-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addDomainOnly();
        });
        $('#domains-tab').on('click', '#remove-domain-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeDomainOnly();
        });
        $('#domains-tab').on('click', '#add-block-domain', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockDomain();
        });
        $('#domains-tab').on('click', '#remove-block-domain', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockDomain();
        });

        //countries
        $('#countries-tab').on('click', '#add-allow-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addAllowCountries();
        });
        $('#countries-tab').on('click', '#remove-allow-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeAllowCountry();
        });
        $('#countries-tab').on('click', '#add-block-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockCountries();
        });
        $('#countries-tab').on('click', '#remove-block-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockCountries();
        });
        //IPs
        $('#ips-tab').on('click', '#add-ip-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addIPOnly();
        });
        $('#ips-tab').on('click', '#remove-ip-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeIPOnly();
        });
        $('#ips-tab').on('click', '#add-block-ip', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockIP();
        });
        $('#ips-tab').on('click', '#remove-block-ip', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockIP();
        });
        //Flavors
        $('#flavors-tab').on('click', '#add-flavor-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addFlavorOnly();
        });
        $('#flavors-tab').on('click', '#remove-flavor-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeFlavorOnly();
        });
        $('#flavors-tab').on('click', '#add-block-flavor', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockFlavor();
        });
        $('#flavors-tab').on('click', '#remove-block-flavor', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockFlavor();
        });

        //domains
        $("#add-domain-only").attr('rel', 'disabled');
        $("#remove-domain-only").attr('rel', 'disabled');
        $("#add-block-domain").attr('rel', 'disabled');
        $("#remove-block-domain").attr('rel', 'disabled');

        //countries
        $("#add-allow-country").attr('rel', 'disabled');
        $("#remove-allow-country").attr('rel', 'disabled');
        $("#add-block-country").attr('rel', 'disabled');
        $("#remove-block-country").attr('rel', 'disabled');

        //IPs
        $("#add-ip-only").attr('rel', 'disabled');
        $("#remove-ip-only").attr('rel', 'disabled');
        $("#add-block-ip").attr('rel', 'disabled');
        $("#remove-block-ip").attr('rel', 'disabled');

        //Flavors
        $("#add-flavor-only").attr('rel', 'disabled');
        $("#remove-flavor-only").attr('rel', 'disabled');
        $("#add-block-flavor").attr('rel', 'disabled');
        $("#remove-block-flavor").attr('rel', 'disabled');

        //domains
        $('#all_domains').change(function () {
            if (($('#all_domains').prop('checked'))) {
                $('#only-domains').css('background-color', '#dddddd');
                $('#block-domains').css('background-color', '#dddddd');
                $("#add-domain-only").attr('rel', 'disabled');
                $("#add-domain-only").css('color', '');
                $("#remove-domain-only").attr('rel', 'disabled');
                $("#remove-domain-only").css('color', '');
                $("#add-block-domain").attr('rel', 'disabled');
                $("#add-block-domain").css('color', '');
                $("#remove-block-domain").attr('rel', 'disabled');
                $("#remove-block-domain").css('color', '');
            }
        });
        $('#only_domains').change(function () {
            if (($('#only_domains').prop('checked'))) {
                $('#only-domains').css('background-color', '#ffffff');
                $('#block-domains').css('background-color', '#dddddd');
                $("#add-domain-only").removeAttr('rel');
                $("#add-domain-only").css('color', '#3c8dbc');
                $("#remove-domain-only").removeAttr('rel');
                $("#remove-domain-only").css('color', '#3c8dbc');
                $("#add-block-domain").attr('rel', 'disabled');
                $("#add-block-domain").css('color', '');
                $("#remove-block-domain").attr('rel', 'disabled');
                $("#remove-block-domain").css('color', '');
            }
        });
        $('#block_domains').change(function () {
            if (($('#block_domains').prop('checked'))) {
                $('#only-domains').css('background-color', '#dddddd');
                $('#block-domains').css('background-color', '#ffffff');
                $("#add-block-domain").removeAttr('rel');
                $("#add-block-domain").css('color', '#3c8dbc');
                $("#remove-block-domain").removeAttr('rel');
                $("#remove-block-domain").css('color', '#3c8dbc');
                $("#add-domain-only").attr('rel', 'disabled');
                $("#add-domain-only").css('color', '');
                $("#remove-domain-only").attr('rel', 'disabled');
                $("#remove-domain-only").css('color', '');
            }
        });

        //countries
        $('#all_countries').change(function () {
            if (($('#all_countries').prop('checked'))) {
                $('#only-countries').css('background-color', '#dddddd');
                $('#block-countries').css('background-color', '#dddddd');
                $("#add-allow-country").attr('rel', 'disabled');
                $("#add-allow-country").css('color', '');
                $("#remove-allow-country").attr('rel', 'disabled');
                $("#remove-allow-country").css('color', '');
                $("#add-block-country").attr('rel', 'disabled');
                $("#add-block-country").css('color', '');
                $("#remove-block-country").attr('rel', 'disabled');
                $("#remove-block-country").css('color', '');
            }
        });
        $('#allow_countries').change(function () {
            if (($('#allow_countries').prop('checked'))) {
                $('#only-countries').css('background-color', '#ffffff');
                $('#block-countries').css('background-color', '#dddddd');
                $("#add-allow-country").removeAttr('rel');
                $("#add-allow-country").css('color', '#3c8dbc');
                $("#remove-allow-country").removeAttr('rel');
                $("#remove-allow-country").css('color', '#3c8dbc');
                $("#add-block-country").attr('rel', 'disabled');
                $("#add-block-country").css('color', '');
                $("#remove-block-country").attr('rel', 'disabled');
                $("#remove-block-country").css('color', '');
            }
        });
        $('#block_countries').change(function () {
            if (($('#block_countries').prop('checked'))) {
                $('#only-countries').css('background-color', '#dddddd');
                $('#block-countries').css('background-color', '#ffffff');
                $("#add-block-country").removeAttr('rel');
                $("#add-block-country").css('color', '#3c8dbc');
                $("#remove-block-country").removeAttr('rel');
                $("#remove-block-country").css('color', '#3c8dbc');
                $("#add-allow-country").attr('rel', 'disabled');
                $("#add-allow-country").css('color', '');
                $("#remove-allow-country").attr('rel', 'disabled');
                $("#remove-allow-country").css('color', '');
            }
        });

        //IPs
        $('#all_ips').change(function () {
            if (($('#all_ips').prop('checked'))) {
                $('#only-ips').css('background-color', '#dddddd');
                $('#block-ips').css('background-color', '#dddddd');
                $("#add-ip-only").attr('rel', 'disabled');
                $("#add-ip-only").css('color', '');
                $("#remove-ip-only").attr('rel', 'disabled');
                $("#remove-ip-only").css('color', '');
                $("#add-block-ip").attr('rel', 'disabled');
                $("#add-block-ip").css('color', '');
                $("#remove-block-ip").attr('rel', 'disabled');
                $("#remove-block-ip").css('color', '');
            }
        });
        $('#only_ips').change(function () {
            if (($('#only_ips').prop('checked'))) {
                $('#only-ips').css('background-color', '#ffffff');
                $('#block-ips').css('background-color', '#dddddd');
                $("#add-ip-only").removeAttr('rel');
                $("#add-ip-only").css('color', '#3c8dbc');
                $("#remove-ip-only").removeAttr('rel');
                $("#remove-ip-only").css('color', '#3c8dbc');
                $("#add-block-ip").attr('rel', 'disabled');
                $("#add-block-ip").css('color', '');
                $("#remove-block-ip").attr('rel', 'disabled');
                $("#remove-block-ip").css('color', '');
            }
        });
        $('#block_ips').change(function () {
            if (($('#block_ips').prop('checked'))) {
                $('#only-ips').css('background-color', '#dddddd');
                $('#block-ips').css('background-color', '#ffffff');
                $("#add-block-ip").removeAttr('rel');
                $("#add-block-ip").css('color', '#3c8dbc');
                $("#remove-block-ip").removeAttr('rel');
                $("#remove-block-ip").css('color', '#3c8dbc');
                $("#add-ip-only").attr('rel', 'disabled');
                $("#add-ip-only").css('color', '');
                $("#remove-ip-only").attr('rel', 'disabled');
                $("#remove-ip-only").css('color', '');
            }
        });

        //Flavors
        $('#all_flavors').change(function () {
            if (($('#all_flavors').prop('checked'))) {
                $('#only-flavors').css('background-color', '#dddddd');
                $('#block-flavors').css('background-color', '#dddddd');
                $("#add-flavor-only").attr('rel', 'disabled');
                $("#add-flavor-only").css('color', '');
                $("#remove-flavor-only").attr('rel', 'disabled');
                $("#remove-flavor-only").css('color', '');
                $("#add-block-flavor").attr('rel', 'disabled');
                $("#add-block-flavor").css('color', '');
                $("#remove-block-flavor").attr('rel', 'disabled');
                $("#remove-block-flavor").css('color', '');
            }
        });
        $('#only_flavors').change(function () {
            if (($('#only_flavors').prop('checked'))) {
                $('#only-flavors').css('background-color', '#ffffff');
                $('#block-flavors').css('background-color', '#dddddd');
                $("#add-flavor-only").removeAttr('rel');
                $("#add-flavor-only").css('color', '#3c8dbc');
                $("#remove-flavor-only").removeAttr('rel');
                $("#remove-flavor-only").css('color', '#3c8dbc');
                $("#add-block-flavor").attr('rel', 'disabled');
                $("#add-block-flavor").css('color', '');
                $("#remove-block-flavor").attr('rel', 'disabled');
                $("#remove-block-flavor").css('color', '');
            }
        });
        $('#block_flavors').change(function () {
            if (($('#block_flavors').prop('checked'))) {
                $('#only-flavors').css('background-color', '#dddddd');
                $('#block-flavors').css('background-color', '#ffffff');
                $("#add-block-flavor").removeAttr('rel');
                $("#add-block-flavor").css('color', '#3c8dbc');
                $("#remove-block-flavor").removeAttr('rel');
                $("#remove-block-flavor").css('color', '#3c8dbc');
                $("#add-flavor-only").attr('rel', 'disabled');
                $("#add-flavor-only").css('color', '');
                $("#remove-flavor-only").attr('rel', 'disabled');
                $("#remove-flavor-only").css('color', '');
            }
        });
        $('#secure').change(function () {
            if ($('#secure').prop('checked')) {
                $('#preview').removeAttr('disabled');
                $('#preview-title').css('color', '#000');
            }
            if ($('#secure').prop('checked') === false) {
                $('#preview').attr('disabled', '');
                $('#preview-title').css('color', '');
                $('#preview-time input').attr('disabled', '');
                $('#preview-time .ui-spinner-input').css('color', '');
                $('#preview-time a').removeClass('ui-state-default');
                $('#preview-time a').addClass('ui-state-disabled');
                $('#preview-desc').css('color', '');
                $('#preview').prop('checked', false);
            }
        });
        $('#preview').change(function () {
            if ($('#preview').prop('checked')) {
                $('#preview-time input').removeAttr('disabled');
                $('#preview-time .ui-spinner-input').css('color', '#000');
                $('#preview-time a').removeClass('ui-state-disabled');
                $('#preview-time a').addClass('ui-state-default');
                $('#preview-desc').css('color', '#000');
            }
            if ($('#preview').prop('checked') === false) {
                $('#preview-time input').attr('disabled', '');
                $('#preview-time .ui-spinner-input').css('color', '');
                $('#preview-time a').removeClass('ui-state-default');
                $('#preview-time a').addClass('ui-state-disabled');
                $('#preview-desc').css('color', '');
            }
        });

        smhAC.activateWizard();

        $('#add-ac-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#add-ac-form").validate({
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
                profile_name: "required"
            },
            messages: {
                profile_name: "Please enter a profile name"
            }
        });
    },
    //Saves AC Profile
    saveAC: function () {
        var name = $('#wizard #profile_name').val();
        var desc = $('#wizard #profile_desc').val();
        var only_domains = ($('#wizard #only_domains').prop('checked')) ? 1 : 0;
        var block_domains = ($('#wizard #block_domains').prop('checked')) ? 1 : 0;
        var allow_countries = ($('#wizard #allow_countries').prop('checked')) ? 1 : 0;
        var block_countries = ($('#wizard #block_countries').prop('checked')) ? 1 : 0;
        var only_ips = ($('#wizard #only_ips').prop('checked')) ? 1 : 0;
        var block_ips = ($('#wizard #block_ips').prop('checked')) ? 1 : 0;
        var only_flavors = ($('#wizard #only_flavors').prop('checked')) ? 1 : 0;
        var block_flavors = ($('#wizard #block_flavors').prop('checked')) ? 1 : 0;
        var secure = ($('#wizard #secure').prop('checked')) ? 1 : 0;
        var preview = ($('#wizard #preview').prop('checked')) ? 1 : 0;
        var preview_time = parseFloat($('#preview-time .ui-timepicker-hour').val() * 60) + parseFloat($('#preview-time .ui-timepicker-minute').val());


        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal #loading').empty();
            $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
            setTimeout(function () {
                $('#smh-modal #pass-result').empty();
                $('#smh-modal').modal('hide');
            }, 3000);
            smhAC.getAC();
        };

        var accessControl = new KalturaAccessControl();
        accessControl.restrictions = [];

        if (only_domains || block_domains) {
            var siteRestriction = {};
            var site_list = '';
            var site_arr = [];
            if (only_domains) {
                $('#wizard #only-domains .rule-spacing').each(function (n) {
                    site_arr.push($(this).text());
                });
                if (site_arr.length > 0) {
                    site_list = site_arr.join(',');
                    siteRestriction['siteRestrictionType'] = KalturaSiteRestrictionType.ALLOW_SITE_LIST;
                }
            }
            if (block_domains) {
                $('#wizard #block-domains .rule-spacing').each(function (n) {
                    site_arr.push($(this).text());
                });
                if (site_arr.length > 0) {
                    site_list = site_arr.join(',');
                    siteRestriction['siteRestrictionType'] = KalturaSiteRestrictionType.RESTRICT_SITE_LIST;
                }
            }
            if (site_arr.length > 0) {
                siteRestriction['objectType'] = 'KalturaSiteRestriction';
                siteRestriction['siteList'] = site_list;
                accessControl.restrictions.push(siteRestriction);
            }
        }

        if (allow_countries || block_countries) {
            var countryRestriction = {};
            var country_list = '';
            var country_arr = [];
            if (allow_countries) {
                $('#wizard #only-countries .rule-spacing').each(function () {
                    var country = $.trim($(this).text());
                    $.each(countries_text, function (index, value) {
                        if (value === country) {
                            country_arr.push(index);
                        }
                    });
                });
                if (country_arr.length > 0) {
                    country_list = country_arr.join(',');
                    countryRestriction['countryRestrictionType'] = KalturaCountryRestrictionType.ALLOW_COUNTRY_LIST;
                }
            }
            if (block_countries) {
                $('#wizard #block-countries .rule-spacing').each(function () {
                    var country = $.trim($(this).text());
                    $.each(countries_text, function (index, value) {
                        if (value === country) {
                            country_arr.push(index);
                        }
                    });

                });
                if (country_arr.length > 0) {
                    country_list = country_arr.join(',');
                    countryRestriction['countryRestrictionType'] = KalturaCountryRestrictionType.RESTRICT_COUNTRY_LIST;
                }
            }
            if (country_arr.length > 0) {
                countryRestriction['objectType'] = 'KalturaCountryRestriction';
                countryRestriction['countryList'] = country_list;
                accessControl.restrictions.push(countryRestriction);
            }
        }

        if (only_ips || block_ips) {
            var ipAddressRestriction = {};
            var ip_list = '';
            var ip_arr = [];
            if (only_ips) {
                $('#wizard #only-ips .rule-spacing').each(function () {
                    ip_arr.push($(this).text());
                });
                if (ip_arr.length > 0) {
                    ip_list = ip_arr.join(',');
                    ipAddressRestriction['ipAddressRestrictionType'] = KalturaIpAddressRestrictionType.ALLOW_LIST;
                }
            }
            if (block_ips) {
                $('#wizard #block-ips .rule-spacing').each(function () {
                    ip_arr.push($(this).text());
                });
                if (ip_arr.length > 0) {
                    ip_list = ip_arr.join(',');
                    ipAddressRestriction['ipAddressRestrictionType'] = KalturaIpAddressRestrictionType.RESTRICT_LIST;
                }
            }
            if (ip_arr.length > 0) {
                ipAddressRestriction['objectType'] = 'KalturaIpAddressRestriction';
                ipAddressRestriction['ipAddressList'] = ip_list;
                accessControl.restrictions.push(ipAddressRestriction);
            }
        }

        if (only_flavors || block_flavors) {
            var limitFlavorsRestriction = {};
            var flavor_list = '';
            var flavor_arr = [];
            if (only_flavors) {
                $('#wizard #only-flavors .rule-spacing').each(function () {
                    var flavor = $.trim($(this).text());
                    $.each(authFlavors, function (index, value) {
                        if (value === flavor) {
                            flavor_arr.push(index);
                        }
                    });
                });
                if (flavor_arr.length > 0) {
                    flavor_list = flavor_arr.join(',');
                    limitFlavorsRestriction['limitFlavorsRestrictionType'] = KalturaLimitFlavorsRestrictionType.ALLOW_LIST;
                }
            }
            if (block_flavors) {
                $('#wizard #block-flavors .rule-spacing').each(function () {
                    var flavor = $.trim($(this).text());
                    $.each(authFlavors, function (index, value) {
                        if (value === flavor) {
                            flavor_arr.push(index);
                        }
                    });
                });
                if (flavor_arr.length > 0) {
                    flavor_list = flavor_arr.join(',');
                    limitFlavorsRestriction['limitFlavorsRestrictionType'] = KalturaLimitFlavorsRestrictionType.RESTRICT_LIST;
                }
            }
            if (flavor_arr.length > 0) {
                limitFlavorsRestriction['objectType'] = 'KalturaLimitFlavorsRestriction';
                limitFlavorsRestriction['flavorParamsIds'] = flavor_list;
                accessControl.restrictions.push(limitFlavorsRestriction);
            }
        }

        if (secure) {
            var sessionRestriction = {};
            sessionRestriction['objectType'] = 'KalturaSessionRestriction';
            accessControl.restrictions.push(sessionRestriction);
        }
        if (preview) {
            var previewRestriction = {};
            previewRestriction['objectType'] = 'KalturaPreviewRestriction';
            previewRestriction['previewLength'] = preview_time;
            accessControl.restrictions.push(previewRestriction);
        }

        $('#wizard .btn-previous').attr('disabled', '');
        $('#wizard .btn-finish').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        accessControl.name = name;
        accessControl.description = desc;
        client.accessControl.add(cb, accessControl);
    },
    //Activate wizard
    activateWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    return smhAC.validateFirstStep();
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
    //First step validation
    validateFirstStep: function () {
        if (!$(".wizard-card #add-ac-form").valid()) {
            //form is invalid
            return false;
        }
        return true;
    },
    //Display add only domain modal
    addDomainOnly: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '300px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2 add-domain-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add New Domain</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="color: #797979;">For example: streamingmediahosting.com</div>' +
                '<div style="margin-top: 20px; margin-bottom: 20px;"><form id="domain-form"><input type="text" name="add_domain_url" id="add_domain_url" placeholder="Enter domain" class="form-control"></form></div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2 add-domain-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveDomainOnlyURL();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');

        $('#domain-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#domain-form").validate({
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
                add_domain_url: {
                    required: true,
                    domain: true
                }
            },
            messages: {
                add_domain_url: {
                    required: "Please enter a domain",
                    domain: "Please enter a valid domain"
                }
            }
        });
    },
    //Add domain
    saveDomainOnlyURL: function () {
        var valid = validator.form();
        if (valid) {
            var domain = $('#domain-form #add_domain_url').val();
            var found_domain = false;
            $('#wizard #only-domains .rule-spacing').each(function () {
                if ($(this).text() == domain) {
                    found_domain = true;
                }
                ;
            });

            if (!found_domain) {
                $('#only-domains .mCSB_container').append('<div class="rule-spacing">' + domain + '</div>');
            }
            $('#smh-modal2').modal('hide');
            $('#smh-modal').css('z-index', '');
        }
    },
    //Removes Domain
    removeDomainOnly: function () {
        $('#wizard #only-domains .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Add blocked domain modal
    addBlockDomain: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '300px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2 add-domain-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add New Domain</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="color: #797979;">For example: streamingmediahosting.com</div>' +
                '<div style="margin-top: 20px; margin-bottom: 20px;"><form id="domain-form"><input type="text" name="bock_domain_url" id="block_domain_url" placeholder="Enter domain" class="form-control"></form></div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2 add-domain-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveBlockDomainURL();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');

        $('#domain-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#domain-form").validate({
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
                add_domain_url: {
                    required: true,
                    domain: true
                }
            },
            messages: {
                add_domain_url: {
                    required: "Please enter a domain",
                    domain: "Please enter a valid domain"
                }
            }
        });
    },
    //Add block domain
    saveBlockDomainURL: function () {
        var valid = validator.form();
        if (valid) {
            var domain = $('#domain-form #block_domain_url').val();
            var found_domain = false;
            $('#wizard #block-domains .rule-spacing').each(function () {
                if ($(this).text() == domain) {
                    found_domain = true;
                }
                ;
            });

            if (!found_domain) {
                $('#block-domains .mCSB_container').append('<div class="rule-spacing">' + domain + '</div>');
            }
            $('#smh-modal2').modal('hide');
            $('#smh-modal').css('z-index', '');
        }
    },
    //Removes block Domain
    removeBlockDomain: function () {
        $('#wizard #block-domains .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Add countries modal
    addAllowCountries: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '315px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Countries</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var flags = '';
        $.each(countries_imgs, function (index, value) {
            flags += "<div class='rule-spacing'>" + value + " " + countries_text[index] + "</div>";
        });
        content = '<div style="color: #797979; text-align: center;">Select Countries to add:</div>' +
                '<div id="country-flags" style="margin-top: 20px;">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper">' +
                flags +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal2 .modal-body').html(content);
        $('#country-flags .rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveAllowCountries();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');
    },
    //Save countries
    saveAllowCountries: function () {
        var selected_countries = [];
        $('#smh-modal2 #country-flags .rule-selected').each(function (index, value) {
            selected_countries[index] = $(value).html();
        });

        $('#wizard #only-countries .rule-spacing').each(function () {
            var country_to_remove = $(this).html();
            selected_countries = $.grep(selected_countries, function (value) {
                return value != country_to_remove;
            });
        });

        $.each(selected_countries, function (index, value) {
            $('#only-countries .mCSB_container').append('<div class="rule-spacing">' + value + '</div>');
        });

        $('#smh-modal2').modal('hide');
        $('#smh-modal').css('z-index', '');
    },
    //Removes Countries
    removeAllowCountry: function () {
        $('#wizard #only-countries .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Add block countries modal
    addBlockCountries: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '315px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Countries</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var flags = '';
        $.each(countries_imgs, function (index, value) {
            flags += "<div class='rule-spacing'>" + value + " " + countries_text[index] + "</div>";
        });
        content = '<div style="color: #797979; text-align: center;">Select Countries to add:</div>' +
                '<div id="country-flags" style="margin-top: 20px;">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper">' +
                flags +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal2 .modal-body').html(content);
        $('#country-flags .rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveBlockCountries();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');
    },
    //Save block countries
    saveBlockCountries: function () {
        var selected_countries = [];
        $('#smh-modal2 #country-flags .rule-selected').each(function (index, value) {
            selected_countries[index] = $(value).html();
        });

        $('#wizard #block-countries .rule-spacing').each(function () {
            var country_to_remove = $(this).html();
            selected_countries = $.grep(selected_countries, function (value) {
                return value != country_to_remove;
            });
        });

        $.each(selected_countries, function (index, value) {
            $('#block-countries .mCSB_container').append('<div class="rule-spacing">' + value + '</div>');
        });

        $('#smh-modal2').modal('hide');
        $('#smh-modal').css('z-index', '');
    },
    //Removes Countries
    removeBlockCountries: function () {
        $('#wizard #block-countries .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Add IP modal
    addIPOnly: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '300px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2 add-ip-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add New IP</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="color: #797979;">Use the following format:<br>Single IP: e.g. 192.168.10.1<br>Range: e.g. 192.168.10.1-192.168.10.255<br>CIDR notation: e.g. 192.168.10.1/24<br>IP+Mask: e.g. 192.168.10.1/255.255.255.0</div>' +
                '<div style="margin-top: 20px; margin-bottom: 20px;"><form id="ip-form"><input type="text" name="add_ip_addr" id="add_ip_addr" placeholder="Enter IP Address" class="form-control"></form></div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2 add-ip-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveIPAddr();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');

        $('#ip-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#ip-form").validate({
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
                add_ip_addr: {
                    required: true,
                    IP4Checker: true
                }
            },
            messages: {
                add_ip_addr: {
                    required: "Please enter an IP address",
                    IP4Checker: "Please enter a valid IP address"
                }
            }
        });
    },
    //Saves IP address
    saveIPAddr: function () {
        var valid = validator.form();
        if (valid) {
            var ip = ($('#ip-form #add_ip_addr').val()).replace(/ /g, '');
            var found_ip = false;
            $('#wizard #only-ips .rule-spacing').each(function () {
                if ($(this).text() == ip) {
                    found_ip = true;
                }
                ;
            });

            if (!found_ip) {
                $('#only-ips .mCSB_container').append('<div class="rule-spacing">' + ip + '</div>');
            }
            $('#smh-modal2').modal('hide');
            $('#smh-modal').css('z-index', '');
        }
    },
    //Remove IP
    removeIPOnly: function () {
        $('#wizard #only-ips .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Add block IP modal
    addBlockIP: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '300px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2 add-ip-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add New IP</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="color: #797979;">Use the following format:<br>Single IP: e.g. 192.168.10.1<br>Range: e.g. 192.168.10.1-192.168.10.255<br>CIDR notation: e.g. 192.168.10.1/24<br>IP+Mask: e.g. 192.168.10.1/255.255.255.0</div>' +
                '<div style="margin-top: 20px; margin-bottom: 20px;"><form id="ip-form"><input type="text" name="block_ip_addr" id="block_ip_addr" placeholder="Enter IP Address" class="form-control"></form></div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2 add-ip-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveBlockIPAddr();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');

        $('#ip-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#ip-form").validate({
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
                block_ip_addr: {
                    required: true,
                    IP4Checker: true
                }
            },
            messages: {
                block_ip_addr: {
                    required: "Please enter an IP address",
                    IP4Checker: "Please enter a valid IP address"
                }
            }
        });
    },
    //Save Block IP
    saveBlockIPAddr: function () {
        var valid = validator.form();
        if (valid) {
            var ip = ($('#ip-form #block_ip_addr').val()).replace(/ /g, '');
            var found_ip = false;
            $('#wizard #block-ips .rule-spacing').each(function () {
                if ($(this).text() == ip) {
                    found_ip = true;
                }
                ;
            });

            if (!found_ip) {
                $('#block-ips .mCSB_container').append('<div class="rule-spacing">' + ip + '</div>');
            }
            $('#smh-modal2').modal('hide');
            $('#smh-modal').css('z-index', '');
        }
    },
    //Remove Block IP
    removeBlockIP: function () {
        $('#wizard #block-ips .rule-selected').each(function () {
            $(this).remove();
        });
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
    //View rules
    viewRules: function (name, domains, countries, ips, flavors, advsec) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '370px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + name + ' Rules</h4>';
        $('#smh-modal .modal-header').html(header);

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

        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal #rules-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        $('.rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Edit AC modal
    editAC: function (id, name, desc, isdefault, domains, countries, ips, flavors, auth_token, auth_time) {
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '680px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close add-ac-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Profile</h4>';
        $('#smh-modal .modal-header').html(header);

        var disabled = (isdefault == 'true') ? 'disabled' : '';
        var perm_disabled = ($.inArray("ACCESS_CONTROL_UPDATE", sessPerm) != -1) ? '' : 'disabled';
        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<form id="add-ac-form">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 13%;" class="active"><a href="#details-tab" data-toggle="tab">DETAILS</a></li>' +
                '<li style="width: 13%;"><a href="#domains-tab" data-toggle="tab">DOMAINS</a></li>' +
                '<li style="width: 14%;"><a href="#countries-tab" data-toggle="tab">COUNTRIES</a></li>' +
                '<li style="width: 12%;"><a href="#ips-tab" data-toggle="tab">IPs</a></li>' +
                '<li style="width: 13%;"><a href="#flavors-tab" data-toggle="tab">FLAVORS</a></li>' +
                '<li style="width: 35%;"><a href="#advsec-tab" data-toggle="tab">ADVANCED SECURITY & PPV</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="details-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Enter Profile Details' +
                '</div>' +
                '<div class="col-sm-8 center-block">' +
                '<table width="100%" border="0" id="ac-add-table">' +
                '<tr>' +
                '<td><span class="required" style="font-weight: normal;">Profile Name:</span></td><td style="width: 71%;"><input type="text" name="profile_name" id="profile_name" class="form-control" placeholder="Enter a profile name" value="' + name + '" ' + disabled + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="profile_desc" id="profile_desc" class="form-control" placeholder="Enter a description" value="' + desc + '"></td>' +
                '</tr>' +
                '<tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="domains-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Which DNS domains are able to access the video?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_domains" id="all_domains" name="domains" checked> All domains</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-10" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="only_domains" id="only_domains" name="domains"> Only in the following domains:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-domains"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-domain-only"><i class="fa fa-plus-square-o"></i> Add another domain</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-domain-only"><i class="fa fa-minus-square-o"></i> Remove selected domains</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-11" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_domains" id="block_domains" name="domains"> Block from the following domains:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-domains"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-domain"><i class="fa fa-plus-square-o"></i> Add another domain</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-domain"><i class="fa fa-minus-square-o"></i> Remove selected domains</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="countries-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Where can viewers come from?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_countries" id="all_countries" name="countries" checked> Anywhere</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-11" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="allow_countries" id="allow_countries" name="countries"> Only from the following countries:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-countries"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-allow-country"><i class="fa fa-plus-square-o"></i> Add Countries</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-allow-country"><i class="fa fa-minus-square-o"></i> Remove selected Countries</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-11" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_countries" id="block_countries" name="countries"> Block from the following countries:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-countries"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-country"><i class="fa fa-plus-square-o"></i> Add Countries</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-country"><i class="fa fa-minus-square-o"></i> Remove selected Countries</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="ips-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Which IP ranges are able to access the video?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_ips" id="all_ips" name="ips" checked> All IPs</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-9" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="only_ips" id="only_ips" name="ips"> Only for the following IPs:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-ips"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-ip-only"><i class="fa fa-plus-square-o"></i> Add another IP</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-ip-only"><i class="fa fa-minus-square-o"></i> Remove selected IPs</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-10" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_ips" id="block_ips" name="ips"> Block from the following IPs:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-ips"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-ip"><i class="fa fa-plus-square-o"></i> Add another IP</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-ip"><i class="fa fa-minus-square-o"></i> Remove selected IPs</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="flavors-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 20px; text-align: center;">' +
                'Which flavors are authorized for playback?' +
                '</div>' +
                '<div class="col-sm-3" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="all_flavors" id="all_flavors" name="flavors" checked> All Flavors</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-12" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="only_flavors" id="only_flavors" name="flavors"> Only flavors defined in the following list:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="only-flavors"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-flavor-only"><i class="fa fa-plus-square-o"></i> Add Flavor</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-flavor-only"><i class="fa fa-minus-square-o"></i> Remove selected Flavors</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="col-sm-12" style="margin-left: 5px; margin-top: 15px; font-weight: normal;">' +
                '<div class="radio"><label><input type="radio" value="block_flavors" id="block_flavors" name="flavors"> Block flavors defined in the following list:</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="col-sm-13">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper" id="block-flavors"></div>' +
                '<div style="width: 272px;"><div style="inline-block; float: left; font-size: 11px; font-weight: normal;"><a id="add-block-flavor"><i class="fa fa-plus-square-o"></i> Add Flavor</a></div><div style="inline-block; float: right; font-size: 11px; font-weight: normal;"><a id="remove-block-flavor"><i class="fa fa-minus-square-o"></i> Remove selected Flavors</a></div></div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="advsec-tab">' +
                '<div class="row">' +
                '<div class="col-sm-7 center-block" style="margin-bottom: 25px; text-align: center;">' +
                'Restrict access to the video?<br><div style="font-size: 12px; color: #999; font-weight: normal;">Relevant for pay-per-view or members only models</div>' +
                '</div>' +
                '<div class="col-sm-6" style="margin-left: 20px; font-weight: normal;">' +
                '<div class="checkbox"><label><input type="checkbox" value="true" id="secure" name="secure"> Protect Video With Authentication Token</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="preview-title" class="col-sm-3" style="margin-top: 15px; margin-left: 20px; font-weight: normal;">' +
                '<div class="checkbox"><label><input type="checkbox" value="true" id="preview" name="preview" disabled> Free Preview</label></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="preview-desc" class="col-sm-7" style="margin-left: 20px; font-weight: normal;">' +
                'Allow free preview of <div id="preview-time"></div> (minutes : seconds) followed by a prompt to pay or login for continued viewing.' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhAC.updateAC(' + id + ',' + isdefault + ')" name="finish" value="Finish" ' + perm_disabled + '/>' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>' +
                '</form>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#preview-time').timepicker({
            format: 'HH:mm'
        });

        $('#preview-time a').removeClass('ui-state-default');
        $('#preview-time a').addClass('ui-state-disabled');

        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        //domains
        $('#domains-tab').on('click', '#add-domain-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addDomainOnly();
        });
        $('#domains-tab').on('click', '#remove-domain-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeDomainOnly();
        });
        $('#domains-tab').on('click', '#add-block-domain', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockDomain();
        });
        $('#domains-tab').on('click', '#remove-block-domain', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockDomain();
        });

        //countries
        $('#countries-tab').on('click', '#add-allow-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addAllowCountries();
        });
        $('#countries-tab').on('click', '#remove-allow-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeAllowCountry();
        });
        $('#countries-tab').on('click', '#add-block-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockCountries();
        });
        $('#countries-tab').on('click', '#remove-block-country', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockCountries();
        });
        //IPs
        $('#ips-tab').on('click', '#add-ip-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addIPOnly();
        });
        $('#ips-tab').on('click', '#remove-ip-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeIPOnly();
        });
        $('#ips-tab').on('click', '#add-block-ip', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockIP();
        });
        $('#ips-tab').on('click', '#remove-block-ip', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockIP();
        });
        //Flavors
        $('#flavors-tab').on('click', '#add-flavor-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addFlavorOnly();
        });
        $('#flavors-tab').on('click', '#remove-flavor-only', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeFlavorOnly();
        });
        $('#flavors-tab').on('click', '#add-block-flavor', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.addBlockFlavor();
        });
        $('#flavors-tab').on('click', '#remove-block-flavor', function () {
            if ($(this).attr('rel') == 'disabled') {
                return;
            }
            smhAC.removeBlockFlavor();
        });

        //domains
        $("#add-domain-only").attr('rel', 'disabled');
        $("#remove-domain-only").attr('rel', 'disabled');
        $("#add-block-domain").attr('rel', 'disabled');
        $("#remove-block-domain").attr('rel', 'disabled');

        //countries
        $("#add-allow-country").attr('rel', 'disabled');
        $("#remove-allow-country").attr('rel', 'disabled');
        $("#add-block-country").attr('rel', 'disabled');
        $("#remove-block-country").attr('rel', 'disabled');

        //IPs
        $("#add-ip-only").attr('rel', 'disabled');
        $("#remove-ip-only").attr('rel', 'disabled');
        $("#add-block-ip").attr('rel', 'disabled');
        $("#remove-block-ip").attr('rel', 'disabled');

        //Flavors
        $("#add-flavor-only").attr('rel', 'disabled');
        $("#remove-flavor-only").attr('rel', 'disabled');
        $("#add-block-flavor").attr('rel', 'disabled');
        $("#remove-block-flavor").attr('rel', 'disabled');

        //domains
        $('#all_domains').change(function () {
            if (($('#all_domains').prop('checked'))) {
                $('#only-domains').css('background-color', '#dddddd');
                $('#block-domains').css('background-color', '#dddddd');
                $("#add-domain-only").attr('rel', 'disabled');
                $("#add-domain-only").css('color', '');
                $("#remove-domain-only").attr('rel', 'disabled');
                $("#remove-domain-only").css('color', '');
                $("#add-block-domain").attr('rel', 'disabled');
                $("#add-block-domain").css('color', '');
                $("#remove-block-domain").attr('rel', 'disabled');
                $("#remove-block-domain").css('color', '');
            }
        });
        $('#only_domains').change(function () {
            if (($('#only_domains').prop('checked'))) {
                $('#only-domains').css('background-color', '#ffffff');
                $('#block-domains').css('background-color', '#dddddd');
                $("#add-domain-only").removeAttr('rel');
                $("#add-domain-only").css('color', '#3c8dbc');
                $("#remove-domain-only").removeAttr('rel');
                $("#remove-domain-only").css('color', '#3c8dbc');
                $("#add-block-domain").attr('rel', 'disabled');
                $("#add-block-domain").css('color', '');
                $("#remove-block-domain").attr('rel', 'disabled');
                $("#remove-block-domain").css('color', '');
            }
        });
        $('#block_domains').change(function () {
            if (($('#block_domains').prop('checked'))) {
                $('#only-domains').css('background-color', '#dddddd');
                $('#block-domains').css('background-color', '#ffffff');
                $("#add-block-domain").removeAttr('rel');
                $("#add-block-domain").css('color', '#3c8dbc');
                $("#remove-block-domain").removeAttr('rel');
                $("#remove-block-domain").css('color', '#3c8dbc');
                $("#add-domain-only").attr('rel', 'disabled');
                $("#add-domain-only").css('color', '');
                $("#remove-domain-only").attr('rel', 'disabled');
                $("#remove-domain-only").css('color', '');
            }
        });

        //countries
        $('#all_countries').change(function () {
            if (($('#all_countries').prop('checked'))) {
                $('#only-countries').css('background-color', '#dddddd');
                $('#block-countries').css('background-color', '#dddddd');
                $("#add-allow-country").attr('rel', 'disabled');
                $("#add-allow-country").css('color', '');
                $("#remove-allow-country").attr('rel', 'disabled');
                $("#remove-allow-country").css('color', '');
                $("#add-block-country").attr('rel', 'disabled');
                $("#add-block-country").css('color', '');
                $("#remove-block-country").attr('rel', 'disabled');
                $("#remove-block-country").css('color', '');
            }
        });
        $('#allow_countries').change(function () {
            if (($('#allow_countries').prop('checked'))) {
                $('#only-countries').css('background-color', '#ffffff');
                $('#block-countries').css('background-color', '#dddddd');
                $("#add-allow-country").removeAttr('rel');
                $("#add-allow-country").css('color', '#3c8dbc');
                $("#remove-allow-country").removeAttr('rel');
                $("#remove-allow-country").css('color', '#3c8dbc');
                $("#add-block-country").attr('rel', 'disabled');
                $("#add-block-country").css('color', '');
                $("#remove-block-country").attr('rel', 'disabled');
                $("#remove-block-country").css('color', '');
            }
        });
        $('#block_countries').change(function () {
            if (($('#block_countries').prop('checked'))) {
                $('#only-countries').css('background-color', '#dddddd');
                $('#block-countries').css('background-color', '#ffffff');
                $("#add-block-country").removeAttr('rel');
                $("#add-block-country").css('color', '#3c8dbc');
                $("#remove-block-country").removeAttr('rel');
                $("#remove-block-country").css('color', '#3c8dbc');
                $("#add-allow-country").attr('rel', 'disabled');
                $("#add-allow-country").css('color', '');
                $("#remove-allow-country").attr('rel', 'disabled');
                $("#remove-allow-country").css('color', '');
            }
        });

        //IPs
        $('#all_ips').change(function () {
            if (($('#all_ips').prop('checked'))) {
                $('#only-ips').css('background-color', '#dddddd');
                $('#block-ips').css('background-color', '#dddddd');
                $("#add-ip-only").attr('rel', 'disabled');
                $("#add-ip-only").css('color', '');
                $("#remove-ip-only").attr('rel', 'disabled');
                $("#remove-ip-only").css('color', '');
                $("#add-block-ip").attr('rel', 'disabled');
                $("#add-block-ip").css('color', '');
                $("#remove-block-ip").attr('rel', 'disabled');
                $("#remove-block-ip").css('color', '');
            }
        });
        $('#only_ips').change(function () {
            if (($('#only_ips').prop('checked'))) {
                $('#only-ips').css('background-color', '#ffffff');
                $('#block-ips').css('background-color', '#dddddd');
                $("#add-ip-only").removeAttr('rel');
                $("#add-ip-only").css('color', '#3c8dbc');
                $("#remove-ip-only").removeAttr('rel');
                $("#remove-ip-only").css('color', '#3c8dbc');
                $("#add-block-ip").attr('rel', 'disabled');
                $("#add-block-ip").css('color', '');
                $("#remove-block-ip").attr('rel', 'disabled');
                $("#remove-block-ip").css('color', '');
            }
        });
        $('#block_ips').change(function () {
            if (($('#block_ips').prop('checked'))) {
                $('#only-ips').css('background-color', '#dddddd');
                $('#block-ips').css('background-color', '#ffffff');
                $("#add-block-ip").removeAttr('rel');
                $("#add-block-ip").css('color', '#3c8dbc');
                $("#remove-block-ip").removeAttr('rel');
                $("#remove-block-ip").css('color', '#3c8dbc');
                $("#add-ip-only").attr('rel', 'disabled');
                $("#add-ip-only").css('color', '');
                $("#remove-ip-only").attr('rel', 'disabled');
                $("#remove-ip-only").css('color', '');
            }
        });

        //Flavors
        $('#all_flavors').change(function () {
            if (($('#all_flavors').prop('checked'))) {
                $('#only-flavors').css('background-color', '#dddddd');
                $('#block-flavors').css('background-color', '#dddddd');
                $("#add-flavor-only").attr('rel', 'disabled');
                $("#add-flavor-only").css('color', '');
                $("#remove-flavor-only").attr('rel', 'disabled');
                $("#remove-flavor-only").css('color', '');
                $("#add-block-flavor").attr('rel', 'disabled');
                $("#add-block-flavor").css('color', '');
                $("#remove-block-flavor").attr('rel', 'disabled');
                $("#remove-block-flavor").css('color', '');
            }
        });
        $('#only_flavors').change(function () {
            if (($('#only_flavors').prop('checked'))) {
                $('#only-flavors').css('background-color', '#ffffff');
                $('#block-flavors').css('background-color', '#dddddd');
                $("#add-flavor-only").removeAttr('rel');
                $("#add-flavor-only").css('color', '#3c8dbc');
                $("#remove-flavor-only").removeAttr('rel');
                $("#remove-flavor-only").css('color', '#3c8dbc');
                $("#add-block-flavor").attr('rel', 'disabled');
                $("#add-block-flavor").css('color', '');
                $("#remove-block-flavor").attr('rel', 'disabled');
                $("#remove-block-flavor").css('color', '');
            }
        });
        $('#block_flavors').change(function () {
            if (($('#block_flavors').prop('checked'))) {
                $('#only-flavors').css('background-color', '#dddddd');
                $('#block-flavors').css('background-color', '#ffffff');
                $("#add-block-flavor").removeAttr('rel');
                $("#add-block-flavor").css('color', '#3c8dbc');
                $("#remove-block-flavor").removeAttr('rel');
                $("#remove-block-flavor").css('color', '#3c8dbc');
                $("#add-flavor-only").attr('rel', 'disabled');
                $("#add-flavor-only").css('color', '');
                $("#remove-flavor-only").attr('rel', 'disabled');
                $("#remove-flavor-only").css('color', '');
            }
        });
        $('#secure').change(function () {
            if ($('#secure').prop('checked')) {
                $('#preview').removeAttr('disabled');
                $('#preview-title').css('color', '#000');
            }
            if ($('#secure').prop('checked') === false) {
                $('#preview').attr('disabled', '');
                $('#preview-title').css('color', '');
                $('#preview-time input').attr('disabled', '');
                $('#preview-time .ui-spinner-input').css('color', '');
                $('#preview-time a').removeClass('ui-state-default');
                $('#preview-time a').addClass('ui-state-disabled');
                $('#preview-desc').css('color', '');
                $('#preview').prop('checked', false);
            }
        });
        $('#preview').change(function () {
            if ($('#preview').prop('checked')) {
                $('#preview-time input').removeAttr('disabled');
                $('#preview-time .ui-spinner-input').css('color', '#000');
                $('#preview-time a').removeClass('ui-state-disabled');
                $('#preview-time a').addClass('ui-state-default');
                $('#preview-desc').css('color', '#000');
            }
            if ($('#preview').prop('checked') === false) {
                $('#preview-time input').attr('disabled', '');
                $('#preview-time .ui-spinner-input').css('color', '');
                $('#preview-time a').removeClass('ui-state-default');
                $('#preview-time a').addClass('ui-state-disabled');
                $('#preview-desc').css('color', '');
            }
        });

        var domians_exp = {};
        var domain_arr = '';
        var domain_names = '';
        if (domains.indexOf('Authorized') > -1 || domains.indexOf('Blocked') > -1) {
            domians_exp = domains.split(": ");
            domain_arr = domians_exp[1].split(",");
            $.each(domain_arr, function (index, value) {
                domain_names += "<div class='rule-spacing'>" + value + "</div>";
            });
            if (domains.indexOf('Authorized') > -1) {
                $('#only-domains').html(domain_names);
                $('#only_domains').click();
            } else if (domains.indexOf('Blocked') > -1) {
                $('#block-domains').html(domain_names);
                $('#block_domains').click();
            }
        } else {
            $('#all_domains').click();
        }

        var countries_exp = {};
        var countries_arr = '';
        var flags = '';
        if (countries.indexOf('Authorized') > -1 || countries.indexOf('Blocked') > -1) {
            countries_exp = countries.split(": ");
            countries_arr = countries_exp[1].split(",");
            $.each(countries_arr, function (index, value) {
                flags += "<div class='rule-spacing'>" + countries_imgs[value] + " " + countries_text[value] + "</div>";
            });
            if (countries.indexOf('Authorized') > -1) {
                $('#only-countries').html(flags);
                $('#allow_countries').click();
            } else if (countries.indexOf('Blocked') > -1) {
                $('#block-countries').html(flags);
                $('#block_countries').click();
            }
        } else {
            $('#all_countries').click();
        }

        var ips_exp = {};
        var ips_arr = '';
        var ip_text = '';
        if (ips.indexOf('Authorized') > -1 || ips.indexOf('Blocked') > -1) {
            ips_exp = ips.split(": ");
            ips_arr = ips_exp[1].split(",");
            $.each(ips_arr, function (index, value) {
                ip_text += "<div class='rule-spacing'>" + value + "</div>";
            });
            if (ips.indexOf('Authorized') > -1) {
                $('#only-ips').html(ip_text);
                $('#only_ips').click();
            } else if (ips.indexOf('Blocked') > -1) {
                $('#block-ips').html(ip_text);
                $('#block_ips').click();
            }
        } else {
            $('#all_ips').click();
        }

        var flavors_text = '';
        var flavors_exp = {};
        var flavors_arr = '';
        if (flavors.indexOf('Authorized') > -1 || flavors.indexOf('Blocked') > -1) {
            flavors_exp = flavors.split(": ");
            flavors_arr = flavors_exp[1].split(",");
            $.each(flavors_arr, function (index, value) {
                flavors_text += "<div class='rule-spacing'>" + value + "</div>";
            });
            if (flavors.indexOf('Authorized') > -1) {
                $('#only-flavors').html(flavors_text);
                $('#only_flavors').click();
            } else if (flavors.indexOf('Blocked') > -1) {
                $('#block-flavors').html(flavors_text);
                $('#block_flavors').click();
            }
        } else {
            $('#all_flavors').click();
        }

        if (auth_token != -1) {
            $('#secure').click();
        }
        if (auth_time != '-1') {
            $('#preview').click();
            var time_exp = '';
            var m_exp = '';
            var m = '';
            var s_exp = '';
            var s = '';
            if (auth_time.indexOf('m') > -1 && auth_time.indexOf('s') > -1) {
                time_exp = auth_time.split(';');
                m_exp = time_exp[0].split(':');
                m = smhAC.pad(m_exp[1]);
                s_exp = time_exp[1].split(':');
                s = smhAC.pad(s_exp[1]);
                $('#preview-time .ui-timepicker-hour').val(m);
                $('#preview-time .ui-timepicker-minute').val(s);
            }
            if (auth_time.indexOf('m') > -1 && auth_time.indexOf('s') == -1) {
                m_exp = auth_time.split(':');
                m = smhAC.pad(m_exp[1]);
                $('#preview-time .ui-timepicker-hour').val(m);
            }
            if (auth_time.indexOf('m') == -1 && auth_time.indexOf('s') > -1) {
                s_exp = auth_time.split(':');
                s = smhAC.pad(s_exp[1]);
                $('#preview-time .ui-timepicker-minute').val(s);
            }
        }

        $('.rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        smhAC.activateWizard();

        $('#add-ac-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#add-ac-form").validate({
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
                profile_name: "required"
            },
            messages: {
                profile_name: "Please enter a profile name"
            }
        });
    },
    //Update AC
    updateAC: function (id, isdefault) {
        var name = $('#wizard #profile_name').val();
        var desc = $('#wizard #profile_desc').val();
        var only_domains = ($('#wizard #only_domains').prop('checked')) ? 1 : 0;
        var block_domains = ($('#wizard #block_domains').prop('checked')) ? 1 : 0;
        var allow_countries = ($('#wizard #allow_countries').prop('checked')) ? 1 : 0;
        var block_countries = ($('#wizard #block_countries').prop('checked')) ? 1 : 0;
        var only_ips = ($('#wizard #only_ips').prop('checked')) ? 1 : 0;
        var block_ips = ($('#wizard #block_ips').prop('checked')) ? 1 : 0;
        var only_flavors = ($('#wizard #only_flavors').prop('checked')) ? 1 : 0;
        var block_flavors = ($('#wizard #block_flavors').prop('checked')) ? 1 : 0;
        var secure = ($('#wizard #secure').prop('checked')) ? 1 : 0;
        var preview = ($('#wizard #preview').prop('checked')) ? 1 : 0;
        var preview_time = parseFloat($('#preview-time .ui-timepicker-hour').val() * 60) + parseFloat($('#preview-time .ui-timepicker-minute').val());

        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            var purgeResponse = smhAC.purgeCache('ac');
            if (purgeResponse) {
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">Metadata Successfully Updated!</span>');
            } else {
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
            }
            setTimeout(function () {
                $('#smh-modal #pass-result').empty();
                $('#smh-modal').modal('hide');
            }, 3000);
            smhAC.getAC();
        };

        var accessControl = new KalturaAccessControl();
        accessControl.restrictions = [];

        if (only_domains || block_domains) {
            var siteRestriction = {};
            var site_list = '';
            var site_arr = [];
            if (only_domains) {
                $('#wizard #only-domains .rule-spacing').each(function (n) {
                    site_arr.push($(this).text());
                });
                if (site_arr.length > 0) {
                    site_list = site_arr.join(',');
                    siteRestriction['siteRestrictionType'] = KalturaSiteRestrictionType.ALLOW_SITE_LIST;
                }
            }
            if (block_domains) {
                $('#wizard #block-domains .rule-spacing').each(function (n) {
                    site_arr.push($(this).text());
                });
                if (site_arr.length > 0) {
                    site_list = site_arr.join(',');
                    siteRestriction['siteRestrictionType'] = KalturaSiteRestrictionType.RESTRICT_SITE_LIST;
                }
            }
            if (site_arr.length > 0) {
                siteRestriction['objectType'] = 'KalturaSiteRestriction';
                siteRestriction['siteList'] = site_list;
                accessControl.restrictions.push(siteRestriction);
            }
        }

        if (allow_countries || block_countries) {
            var countryRestriction = {};
            var country_list = '';
            var country_arr = [];
            if (allow_countries) {
                $('#wizard #only-countries .rule-spacing').each(function () {
                    var country = $.trim($(this).text());
                    $.each(countries_text, function (index, value) {
                        if (value === country) {
                            country_arr.push(index);
                        }
                    });
                });
                if (country_arr.length > 0) {
                    country_list = country_arr.join(',');
                    countryRestriction['countryRestrictionType'] = KalturaCountryRestrictionType.ALLOW_COUNTRY_LIST;
                }
            }
            if (block_countries) {
                $('#wizard #block-countries .rule-spacing').each(function () {
                    var country = $.trim($(this).text());
                    $.each(countries_text, function (index, value) {
                        if (value === country) {
                            country_arr.push(index);
                        }
                    });

                });
                if (country_arr.length > 0) {
                    country_list = country_arr.join(',');
                    countryRestriction['countryRestrictionType'] = KalturaCountryRestrictionType.RESTRICT_COUNTRY_LIST;
                }
            }
            if (country_arr.length > 0) {
                countryRestriction['objectType'] = 'KalturaCountryRestriction';
                countryRestriction['countryList'] = country_list;
                accessControl.restrictions.push(countryRestriction);
            }
        }

        if (only_ips || block_ips) {
            var ipAddressRestriction = {};
            var ip_list = '';
            var ip_arr = [];
            if (only_ips) {
                $('#wizard #only-ips .rule-spacing').each(function () {
                    ip_arr.push($(this).text());
                });
                if (ip_arr.length > 0) {
                    ip_list = ip_arr.join(',');
                    ipAddressRestriction['ipAddressRestrictionType'] = KalturaIpAddressRestrictionType.ALLOW_LIST;
                }
            }
            if (block_ips) {
                $('#wizard #block-ips .rule-spacing').each(function () {
                    ip_arr.push($(this).text());
                });
                if (ip_arr.length > 0) {
                    ip_list = ip_arr.join(',');
                    ipAddressRestriction['ipAddressRestrictionType'] = KalturaIpAddressRestrictionType.RESTRICT_LIST;
                }
            }
            if (ip_arr.length > 0) {
                ipAddressRestriction['objectType'] = 'KalturaIpAddressRestriction';
                ipAddressRestriction['ipAddressList'] = ip_list;
                accessControl.restrictions.push(ipAddressRestriction);
            }
        }

        if (only_flavors || block_flavors) {
            var limitFlavorsRestriction = {};
            var flavor_list = '';
            var flavor_arr = [];
            if (only_flavors) {
                $('#wizard #only-flavors .rule-spacing').each(function () {
                    var flavor = $.trim($(this).text());
                    $.each(authFlavors, function (index, value) {
                        if (value === flavor) {
                            flavor_arr.push(index);
                        }
                    });
                });
                if (flavor_arr.length > 0) {
                    flavor_list = flavor_arr.join(',');
                    limitFlavorsRestriction['limitFlavorsRestrictionType'] = KalturaLimitFlavorsRestrictionType.ALLOW_LIST;
                }
            }
            if (block_flavors) {
                $('#wizard #block-flavors .rule-spacing').each(function () {
                    var flavor = $.trim($(this).text());
                    $.each(authFlavors, function (index, value) {
                        if (value === flavor) {
                            flavor_arr.push(index);
                        }
                    });
                });
                if (flavor_arr.length > 0) {
                    flavor_list = flavor_arr.join(',');
                    limitFlavorsRestriction['limitFlavorsRestrictionType'] = KalturaLimitFlavorsRestrictionType.RESTRICT_LIST;
                }
            }
            if (flavor_arr.length > 0) {
                limitFlavorsRestriction['objectType'] = 'KalturaLimitFlavorsRestriction';
                limitFlavorsRestriction['flavorParamsIds'] = flavor_list;
                accessControl.restrictions.push(limitFlavorsRestriction);
            }
        }

        if (secure) {
            var sessionRestriction = {};
            sessionRestriction['objectType'] = 'KalturaSessionRestriction';
            accessControl.restrictions.push(sessionRestriction);
        }
        if (preview) {
            var previewRestriction = {};
            previewRestriction['objectType'] = 'KalturaPreviewRestriction';
            previewRestriction['previewLength'] = preview_time;
            accessControl.restrictions.push(previewRestriction);
        }

        $('#wizard .btn-previous').attr('disabled', '');
        $('#wizard .btn-finish').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        accessControl.name = name;
        accessControl.description = desc;
        accessControl.isDefault = (isdefault) ? 1 : 0;
        client.accessControl.update(cb, id, accessControl);
    },
    //Add leading zeros
    pad: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },
    //Delete AC modal
    deleteAC: function (id, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 30px auto; height: 95px; width: 378px;'>After deleting this profile, all entries using it will go back to use the default profile. Are you sure you want to delete the following Access Control Profile?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-ac" onclick="smhAC.removeAC(\'' + id + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove role
    removeAC: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhAC.purgeCache('ac');
                $('#smh-modal').modal('hide');
                smhAC.getAC();
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#delete-ac').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.accessControlProfile.deleteAction(cb, id);
    },
    //Display setDefault modal
    setDefault: function (id, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '476px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Set As Default</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 30px auto; height: 60px; width: 445px;'>Are you sure you want to set the following profile as your default Access Control Profile?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="default-trans" onclick="smhAC.setAsDefault(\'' + id + '\')">Set As Default</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Set profile as default
    setAsDefault: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal').modal('hide');
            smhAC.getAC();
        };

        $('#default-trans').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        var accessControlProfile = new KalturaAccessControlProfile();
        accessControlProfile.isDefault = KalturaNullableBoolean.TRUE_VALUE;
        client.accessControlProfile.update(cb, id, accessControlProfile);
    },
    //Validate IP
    ipValidator: function (ipAddr) {
        if (ipAddr.indexOf('-') > -1) {
            var ip_exp = ipAddr.split('-');
            var ip_one = $.trim(ip_exp[0]);
            var ip_two = $.trim(ip_exp[1]);
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip_one) && /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip_two);
        } else if (ipAddr.indexOf('/') > -1) {
            var ip_exp2 = ipAddr.split('/');
            var ip1 = $.trim(ip_exp2[0]);
            var ip2 = $.trim(ip_exp2[1]);
            if (ip2.indexOf('.') > -1) {
                return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip1) && /^(((128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(0|128|192|224|240|248|252|254)\.0\.0)|(255\.255\.(0|128|192|224|240|248|252|254)\.0)|(255\.255\.255\.(0|128|192|224|240|248|252|254)))$/.test(ip2);
            } else {
                return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/.test(ipAddr);
            }
        } else {
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddr);
        }
    },
    //Get Flavors
    getFlavors: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                $.each(results.objects, function (index, value) {
                    authFlavors[value.id] = value.name;
                });
            }
        };

        var filter;
        var pager;
        client.flavorParams.listAction(cb, filter, pager);
    },
    //List flavors modal
    addFlavorOnly: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '315px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Flavors</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var flavors = '';
        $.each(authFlavors, function (index, value) {
            flavors += "<div class='rule-spacing'>" + value + "</div>";
        });
        content = '<div style="color: #797979; text-align: center;">Select Flavors to add:</div>' +
                '<div id="auth-flavors" style="margin-top: 20px;">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper">' +
                flavors +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal2 .modal-body').html(content);
        $('#auth-flavors .rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveOnlyFlavors();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');
    },
    //Save only flavors
    saveOnlyFlavors: function () {
        var selected_flavors = [];
        $('#smh-modal2 #auth-flavors .rule-selected').each(function (index, value) {
            selected_flavors[index] = $(value).html();
        });

        $('#wizard #only-flavors .rule-spacing').each(function () {
            var flavor_to_remove = $(this).html();
            selected_flavors = $.grep(selected_flavors, function (value) {
                return value != flavor_to_remove;
            });
        });

        $.each(selected_flavors, function (index, value) {
            $('#only-flavors .mCSB_container').append('<div class="rule-spacing">' + value + '</div>');
        });

        $('#smh-modal2').modal('hide');
        $('#smh-modal').css('z-index', '');
    },
    //Removes Flavors only
    removeFlavorOnly: function () {
        $('#wizard #only-flavors .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Add blocked flavors modal
    addBlockFlavor: function () {
        smhAC.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '315px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Flavors</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var flavors = '';
        $.each(authFlavors, function (index, value) {
            flavors += "<div class='rule-spacing'>" + value + "</div>";
        });
        content = '<div style="color: #797979; text-align: center;">Select Flavors to add:</div>' +
                '<div id="auth-flavors" style="margin-top: 20px;">' +
                '<div id="rules-wrapper">' +
                '<div class="rule-wrapper">' +
                flavors +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal2 .modal-body').html(content);
        $('#auth-flavors .rule-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhAC.saveBlockFlavors();">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '1030');
    },
    //Saves blocked flavors
    saveBlockFlavors: function () {
        var selected_flavors = [];
        $('#smh-modal2 #auth-flavors .rule-selected').each(function (index, value) {
            selected_flavors[index] = $(value).html();
        });

        $('#wizard #block-flavors .rule-spacing').each(function () {
            var flavor_to_remove = $(this).html();
            selected_flavors = $.grep(selected_flavors, function (value) {
                return value != flavor_to_remove;
            });
        });

        $.each(selected_flavors, function (index, value) {
            $('#block-flavors .mCSB_container').append('<div class="rule-spacing">' + value + '</div>');
        });

        $('#smh-modal2').modal('hide');
        $('#smh-modal').css('z-index', '');
    },
    //Removes blocked flavors
    removeBlockFlavor: function () {
        $('#wizard #block-flavors .rule-selected').each(function () {
            $(this).remove();
        });
    },
    //Bulk delete modal
    bulkDeleteModal: function () {
        bulkdelete = new Array();
        var rowcollection = acTable.$(".ac-delete:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val();
            if (checkbox_value != -1) {
                bulkdelete.push(checkbox_value);
            }
        });

        if (bulkdelete.length == 0) {
            smhAC.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '440px');
            $('#smh-modal .modal-body').css('padding', '0');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Bulk Delete</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected profiles?</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-ac" onclick="smhAC.bulkDelete()">Delete</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    //Do bulk delete
    bulkDelete: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhAC.purgeCache('ac');
            $('#smh-modal').modal('hide');
            smhAC.getAC();
        };

        $('#delete-ac').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkdelete, function (key, value) {
            client.accessControlProfile.deleteAction(cb, value);
        });
        client.doMultiRequest(cb);
    },
    //No Profile selected
    noEntrySelected: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '286px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel"><i class="fa fa-lock"></i> No Profile Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a profile</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_ac_metadata';
        }
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
    //Register all user actions
    registerActions: function () {
        $('#smh-modal').on('click', '.add-ac-close', function () {
            $('#add-ac-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal2').on('click', '.add-domain-close', function () {
            $('#domain-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal2').on('click', '.add-ip-close', function () {
            $('#ip-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
        });
        $.validator.addMethod("domain", function (value, element) {
            return this.optional(element) || /^([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);
        }, "Please enter a valid domain name");
        $.validator.addMethod('IP4Checker', function (value) {
            return smhAC.ipValidator(value);
        }, 'Invalid IP address');
        $('#smh-modal').on('click', '#only-domains .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#block-domains .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#only-countries .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#block-countries .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal2').on('click', '#country-flags .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal2').on('click', '#auth-flavors .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#only-ips .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#block-ips .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#only-flavors .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
        $('#smh-modal').on('click', '#block-flavors .rule-spacing', function () {
            if ($(this).hasClass('rule-selected')) {
                $(this).removeClass('rule-selected');
            } else {
                $(this).addClass('rule-selected');
            }
        });
    }
}

// AC on ready
$(document).ready(function () {
    smhAC = new AC();
    smhAC.getFlavors();
    smhAC.getAC();
    smhAC.registerActions();
});
