/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	PPV
 *
 *	7-3-2014
 */
//PPV constructor
function MEM() {}

//Global variables
var ApiUrl = "/apps/mem/v1.0/index.php?";
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
var mem_entry_id;
var mem_entry_type;
var mem_entry_name;
var mem_ac_id;
var mem_ac_name;
var countries_imgs = {
    'AF' : '<img src="/img/flags/af.gif" title="Afghanistan">',
    'AX' : '<img src="/img/flags/ax.gif" title="Aland Islands">',
    'AL' : '<img src="/img/flags/al.gif" title="Albania">',
    'DZ' : '<img src="/img/flags/dz.gif" title="Algeria">',
    'AS' : '<img src="/img/flags/as.gif" title="American Samoa">',
    'AD' : '<img src="/img/flags/ad.gif" title="Andorra">',
    'AO' : '<img src="/img/flags/ao.gif" title="Angola">',
    'AI' : '<img src="/img/flags/ai.gif" title="Anguilla">',
    'AQ' : '<img src="/img/flags/aq.gif" title="Antarctica">',
    'AG' : '<img src="/img/flags/ag.gif" title="Antigua and Barbuda">',
    'AR' : '<img src="/img/flags/ar.gif" title="Argentina">',
    'AM' : '<img src="/img/flags/am.gif" title="Armenia">',
    'AW' : '<img src="/img/flags/aw.gif" title="Aruba">',
    'AU' : '<img src="/img/flags/au.gif" title="Australia">',
    'AT' : '<img src="/img/flags/at.gif" title="Austria">',
    'AZ' : '<img src="/img/flags/az.gif" title="Azerbaijan">',
    'BS' : '<img src="/img/flags/bs.gif" title="Bahamas">',
    'BH' : '<img src="/img/flags/bh.gif" title="Bahrain">',
    'BD' : '<img src="/img/flags/bd.gif" title="Bangladesh">',
    'BB' : '<img src="/img/flags/bb.gif" title="Barbados">',
    'BY' : '<img src="/img/flags/by.gif" title="Belarus">',
    'BE' : '<img src="/img/flags/be.gif" title="Belgium">',
    'BZ' : '<img src="/img/flags/bz.gif" title="Belize">',
    'BJ' : '<img src="/img/flags/bj.gif" title="Benin">',
    'BM' : '<img src="/img/flags/bm.gif" title="Bermuda">',
    'BT' : '<img src="/img/flags/bt.gif" title="Bhutan">',
    'BO' : '<img src="/img/flags/bo.gif" title="Bolivia">',
    'BA' : '<img src="/img/flags/ba.gif" title="Bosnia and Herzegovina">',
    'BW' : '<img src="/img/flags/bw.gif" title="Botswana">',
    'BV' : '<img src="/img/flags/bv.gif" title="Bouvet Island">',
    'BR' : '<img src="/img/flags/br.gif" title="Brazil">',
    'IO' : '<img src="/img/flags/io.gif" title="British Indian Ocean Territory">',
    'BN' : '<img src="/img/flags/bn.gif" title="Brunei">',
    'BG' : '<img src="/img/flags/bg.gif" title="Bulgaria">',
    'BF' : '<img src="/img/flags/bf.gif" title="Burkina Faso">',
    'BI' : '<img src="/img/flags/bi.gif" title="Burundi">',
    'KH' : '<img src="/img/flags/kh.gif" title="Cambodia">',
    'CM' : '<img src="/img/flags/cm.gif" title="Cameroon">',
    'CA' : '<img src="/img/flags/ca.gif" title="Canada">',
    'CV' : '<img src="/img/flags/cv.gif" title="Cape Verde">',
    'KY' : '<img src="/img/flags/ky.gif" title="Cayman Island">',
    'CF' : '<img src="/img/flags/cf.gif" title="Central African Republic">',
    'TD' : '<img src="/img/flags/td.gif" title="Chad">',
    'CL' : '<img src="/img/flags/cl.gif" title="Chile">',
    'CN' : '<img src="/img/flags/cn.gif" title="China">',
    'CO' : '<img src="/img/flags/co.gif" title="Colombia">',
    'KM' : '<img src="/img/flags/km.gif" title="Comoros">',
    'CG' : '<img src="/img/flags/cg.gif" title="Congo">',
    'CD' : '<img src="/img/flags/cd.gif" title="Congo (DRC)">',
    'CK' : '<img src="/img/flags/ck.gif" title="Cook Islands">',
    'CR' : '<img src="/img/flags/cr.gif" title="Costa Rica">',
    'HR' : '<img src="/img/flags/hr.gif" title="Croatia">',
    'CU' : '<img src="/img/flags/cu.gif" title="Cuba">',
    'CY' : '<img src="/img/flags/cy.gif" title="Cyprus">',
    'CZ' : '<img src="/img/flags/cz.gif" title="Czech Republic">',
    'CI' : '<img src="/img/flags/ci.gif" title="Cte d\'lvoire">',
    'DK' : '<img src="/img/flags/dk.gif" title="Denmark">',
    'DJ' : '<img src="/img/flags/dj.gif" title="Djibouti">',
    'DM' : '<img src="/img/flags/dm.gif" title="Dominica">',
    'DO' : '<img src="/img/flags/do.gif" title="Dominican Republic">',
    'EC' : '<img src="/img/flags/ec.gif" title="Ecuador">',
    'EG' : '<img src="/img/flags/eg.gif" title="Eqypt">',
    'SV' : '<img src="/img/flags/sv.gif" title="El Salvador">',
    'GQ' : '<img src="/img/flags/gq.gif" title="Equatorial Guinea">',
    'ER' : '<img src="/img/flags/er.gif" title="Eritrea">',
    'EE' : '<img src="/img/flags/ee.gif" title="Estonia">',
    'ET' : '<img src="/img/flags/et.gif" title="Ethiopia">',
    'FK' : '<img src="/img/flags/fk.gif" title="Falkland Islands (Islas Malvinas)">',
    'FO' : '<img src="/img/flags/fo.gif" title="Faroe Islands">',
    'FJ' : '<img src="/img/flags/fj.gif" title="Fiji Islands">',
    'FI' : '<img src="/img/flags/fi.gif" title="Finland">',
    'FR' : '<img src="/img/flags/fr.gif" title="France">',
    'GF' : '<img src="/img/flags/gf.gif" title="French Guiana">',
    'PF' : '<img src="/img/flags/pf.gif" title="French Polynesia">',
    'TF' : '<img src="/img/flags/tf.gif" title="French Southern and Antarctic Lands">',
    'GA' : '<img src="/img/flags/ga.gif" title="Gabon">',
    'GM' : '<img src="/img/flags/gm.gif" title="Gambia, The">',
    'GE' : '<img src="/img/flags/ge.gif" title="Georgia">',
    'DE' : '<img src="/img/flags/de.gif" title="Germany">',
    'GH' : '<img src="/img/flags/gh.gif" title="Ghana">',
    'GI' : '<img src="/img/flags/gi.gif" title="Gibraltar">',
    'GR' : '<img src="/img/flags/gr.gif" title="Greece">',
    'GL' : '<img src="/img/flags/gl.gif" title="Greenland">',
    'GD' : '<img src="/img/flags/gd.gif" title="Grenada">',
    'GP' : '<img src="/img/flags/gp.gif" title="Guadeloupe">',
    'GU' : '<img src="/img/flags/gu.gif" title="Guam">',
    'GT' : '<img src="/img/flags/gt.gif" title="Guatemala">',
    'GG' : '<img src="/img/flags/gg.gif" title="Guernsey">',
    'GN' : '<img src="/img/flags/gn.gif" title="Guinea">',
    'GW' : '<img src="/img/flags/gw.gif" title="Guinea-Bissau">',
    'GY' : '<img src="/img/flags/gy.gif" title="Guyana">',
    'HT' : '<img src="/img/flags/ht.gif" title="Haiti">',
    'HM' : '<img src="/img/flags/hm.gif" title="Heard Island and McDonald Islands">',
    'HN' : '<img src="/img/flags/hn.gif" title="Honduras">',
    'HK' : '<img src="/img/flags/hk.gif" title="Hong Kong SAR">',
    'HU' : '<img src="/img/flags/hu.gif" title="Hungary">',
    'IS' : '<img src="/img/flags/is.gif" title="Iceland">',
    'IN' : '<img src="/img/flags/in.gif" title="India">',
    'ID' : '<img src="/img/flags/id.gif" title="Indonesia">',
    'IR' : '<img src="/img/flags/ir.gif" title="Iran">',
    'IQ' : '<img src="/img/flags/iq.gif" title="Iraq">',
    'IE' : '<img src="/img/flags/ie.gif" title="Ireland">',
    'IM' : '<img src="/img/flags/im.gif" title="Isle of Man">',
    'IL' : '<img src="/img/flags/il.gif" title="Israel">',
    'IT' : '<img src="/img/flags/it.gif" title="Italy">',
    'JM' : '<img src="/img/flags/jm.gif" title="Jamaica">',
    'JP' : '<img src="/img/flags/jp.gif" title="Japan">',
    'JE' : '<img src="/img/flags/je.gif" title="Jersey">',
    'JO' : '<img src="/img/flags/jo.gif" title="Jordan">',
    'KZ' : '<img src="/img/flags/kz.gif" title="Kazakhstan">',
    'KE' : '<img src="/img/flags/ke.gif" title="Kenya">',
    'KI' : '<img src="/img/flags/ki.gif" title="Kiribati">',
    'KR' : '<img src="/img/flags/kr.gif" title="Korea">',
    'KW' : '<img src="/img/flags/kw.gif" title="Kuwait">',
    'KG' : '<img src="/img/flags/kg.gif" title="Kyrgyzstan">',
    'LA' : '<img src="/img/flags/la.gif" title="Laos">',
    'LV' : '<img src="/img/flags/lv.gif" title="Latvia">',
    'LB' : '<img src="/img/flags/lb.gif" title="Lebanon">',
    'LS' : '<img src="/img/flags/ls.gif" title="Lesotho">',
    'LR' : '<img src="/img/flags/lr.gif" title="Liberia">',
    'LY' : '<img src="/img/flags/ly.gif" title="Libya">',
    'LI' : '<img src="/img/flags/li.gif" title="Liechtenstein">',
    'LT' : '<img src="/img/flags/lt.gif" title="Lithuania">',
    'LU' : '<img src="/img/flags/lu.gif" title="Luxembourg">',
    'MO' : '<img src="/img/flags/mo.gif" title="Macao SAR">',
    'MK' : '<img src="/img/flags/mk.gif" title="Macedonia, Former Yugoslav Republic of">',
    'MG' : '<img src="/img/flags/mg.gif" title="Madagascar">',
    'MW' : '<img src="/img/flags/mw.gif" title="Malawi">',
    'MY' : '<img src="/img/flags/my.gif" title="Malaysia">',
    'MV' : '<img src="/img/flags/mv.gif" title="Maldives">',
    'ML' : '<img src="/img/flags/ml.gif" title="Mali">',
    'MT' : '<img src="/img/flags/mt.gif" title="Malta">',
    'MH' : '<img src="/img/flags/mh.gif" title="Marshall Islands">',
    'MQ' : '<img src="/img/flags/mq.gif" title="Martinique">',
    'MR' : '<img src="/img/flags/mr.gif" title="Mauritania">',
    'MU' : '<img src="/img/flags/mu.gif" title="Mauritius">',
    'YT' : '<img src="/img/flags/yt.gif" title="Mayotte">',
    'MX' : '<img src="/img/flags/mx.gif" title="Mexico">',
    'FM' : '<img src="/img/flags/fm.gif" title="Micronesia">',
    'MD' : '<img src="/img/flags/md.gif" title="Moldova">',
    'MC' : '<img src="/img/flags/mc.gif" title="Monaco">',
    'MN' : '<img src="/img/flags/mn.gif" title="Mongolia">',
    'ME' : '<img src="/img/flags/me.gif" title="Montenegro">',
    'MS' : '<img src="/img/flags/ms.gif" title="Montserrat">',
    'MA' : '<img src="/img/flags/ma.gif" title="Morocco">',
    'MZ' : '<img src="/img/flags/mz.gif" title="Mozambique">',
    'MM' : '<img src="/img/flags/mm.gif" title="Myanmar">',
    'NA' : '<img src="/img/flags/na.gif" title="Namibia">',
    'NR' : '<img src="/img/flags/nr.gif" title="Nauru">',
    'NP' : '<img src="/img/flags/np.gif" title="Nepal">',
    'NL' : '<img src="/img/flags/nl.gif" title="Netherlands">',
    'AN' : '<img src="/img/flags/an.gif" title="Netherlands Antilles">',
    'NC' : '<img src="/img/flags/nc.gif" title="New Caledonia">',
    'NZ' : '<img src="/img/flags/nz.gif" title="New Zealand">',
    'NI' : '<img src="/img/flags/ni.gif" title="Nicaragua">',
    'NE' : '<img src="/img/flags/ne.gif" title="Niger>',
    'NG' : '<img src="/img/flags/ng.gif" title="Nigeria">',
    'NU' : '<img src="/img/flags/nu.gif" title="Niue">',
    'NF' : '<img src="/img/flags/nf.gif" title="Norfolk Island">',
    'KP' : '<img src="/img/flags/kp.gif" title="North Korea">',
    'MP' : '<img src="/img/flags/mp.gif" title="Northern Mariana Islands">',
    'NO' : '<img src="/img/flags/no.gif" title="Norway">',
    'OM' : '<img src="/img/flags/om.gif" title="Oman">',
    'PK' : '<img src="/img/flags/pk.gif" title="Pakistan">',
    'PW' : '<img src="/img/flags/pw.gif" title="Palau">',
    'PA' : '<img src="/img/flags/pa.gif" title="Panama">',
    'PG' : '<img src="/img/flags/pg.gif" title="Papua New Guinea">',
    'PY' : '<img src="/img/flags/py.gif" title="Paraguay">',
    'PE' : '<img src="/img/flags/pe.gif" title="Peru">',
    'PH' : '<img src="/img/flags/ph.gif" title="Philippines">',
    'PN' : '<img src="/img/flags/pn.gif" title="Pitcairn Islands">',
    'PL' : '<img src="/img/flags/pl.gif" title="Poland">',
    'PT' : '<img src="/img/flags/pt.gif" title="Portugal">',
    'PR' : '<img src="/img/flags/pr.gif" title="Puerto Rico">',
    'QA' : '<img src="/img/flags/qa.gif" title="Qatar">',
    'RE' : '<img src="/img/flags/re.gif" title="Reunion">',
    'RO' : '<img src="/img/flags/ro.gif" title="Romania">',
    'RU' : '<img src="/img/flags/ru.gif" title="Russia">',
    'RW' : '<img src="/img/flags/rw.gif" title="Rwanda">',
    'MF' : '',
    'WS' : '<img src="/img/flags/ws.gif" title="Samoa">',
    'SM' : '<img src="/img/flags/sm.gif" title="San Marino">',
    'SA' : '<img src="/img/flags/sa.gif" title="Saudi Arabia">',
    'SN' : '<img src="/img/flags/sn.gif" title="Senegal">',
    'RS' : '<img src="/img/flags/rs.gif" title="Serbia">',
    'CS' : '<img src="/img/flags/cs.gif" title="Serbia and Montenegro">',
    'SC' : '<img src="/img/flags/sc.gif" title="Seychelles">',
    'SL' : '<img src="/img/flags/sl.gif" title="Sierra Leone">',
    'SG' : '<img src="/img/flags/sg.gif" title="Singapore">',
    'SK' : '<img src="/img/flags/sk.gif" title="Slovakia">',
    'SI' : '<img src="/img/flags/si.gif" title="Slovenia">',
    'SB' : '<img src="/img/flags/sb.gif" title="Solomon Islands">',
    'SO' : '<img src="/img/flags/so.gif" title="Somalia">',
    'ZA' : '<img src="/img/flags/za.gif" title="South Africa">',
    'GS' : '<img src="/img/flags/gs.gif" title="South Georgia and the South Sandwich Islands">',
    'ES' : '<img src="/img/flags/es.gif" title="Spain">',
    'LK' : '<img src="/img/flags/lk.gif" title="Sri Lanka">',
    'KN' : '<img src="/img/flags/kn.gif" title="St. Kitts and Nevis">',
    'LC' : '<img src="/img/flags/lc.gif" title="St. Lucia">',
    'PM' : '<img src="/img/flags/pm.gif" title="St. Pierre and Miquelon">',
    'VC' : '<img src="/img/flags/vc.gif" title="St. Vincent and the Grenadines">',
    'SD' : '<img src="/img/flags/sd.gif" title="Sudan">',
    'SR' : '<img src="/img/flags/sr.gif" title="Suriname">',
    'SZ' : '<img src="/img/flags/sz.gif" title="Swaziland">',
    'SE' : '<img src="/img/flags/se.gif" title="Sweden">',
    'CH' : '<img src="/img/flags/ch.gif" title="Switzerland">',
    'SY' : '<img src="/img/flags/sy.gif" title="Syria">',
    'ST' : '<img src="/img/flags/st.gif" title="So Tom and Principe">',
    'TW' : '<img src="/img/flags/tw.gif" title="Taiwan">',
    'TJ' : '<img src="/img/flags/tj.gif" title="Tajikistan">',
    'TZ' : '<img src="/img/flags/tz.gif" title="Tanzania">',
    'TH' : '<img src="/img/flags/th.gif" title="Thailand">',
    'TG' : '<img src="/img/flags/tg.gif" title="Togo">',
    'TK' : '<img src="/img/flags/tk.gif" title="Tokelau">',
    'TO' : '<img src="/img/flags/to.gif" title="Tonga">',
    'TT' : '<img src="/img/flags/tt.gif" title="Trinidad and Tobago">',
    'TN' : '<img src="/img/flags/tn.gif" title="Tunisia">',
    'TR' : '<img src="/img/flags/tr.gif" title="Turkey">',
    'TM' : '<img src="/img/flags/tm.gif" title="Turkmenistan">',
    'TC' : '<img src="/img/flags/tc.gif" title="Turks and Caicos Islands">',
    'TV' : '<img src="/img/flags/tv.gif" title="Tuvalu">',
    'UG' : '<img src="/img/flags/ug.gif" title="Uganda">',
    'UA' : '<img src="/img/flags/ua.gif" title="Ukraine">',
    'AE' : '<img src="/img/flags/ae.gif" title="United Arab Emirates">',
    'UK' : '<img src="/img/flags/uk.gif" title="United Kingdom">',
    'US' : '<img src="/img/flags/us.gif" title="United States">',
    'UM' : '<img src="/img/flags/um.gif" title="United States Minor Outlying Islands">',
    'UY' : '<img src="/img/flags/uy.gif" title="Uruguay">',
    'UZ' : '<img src="/img/flags/uz.gif" title="Uzbekistan">',
    'VU' : '<img src="/img/flags/vu.gif" title="Vanuatu">',
    'VA' : '<img src="/img/flags/va.gif" title="Vatican City">',
    'VE' : '<img src="/img/flags/ve.gif" title="Venezuela">',
    'VN' : '<img src="/img/flags/vn.gif" title="Vietnam">',
    'VI' : '<img src="/img/flags/vi.gif" title="Virgin Islands">',
    'VG' : '<img src="/img/flags/vg.gif" title="Virgin Islands, British">',
    'WF' : '<img src="/img/flags/wf.gif" title="Walls and Futuna">',
    'YE' : '<img src="/img/flags/ye.gif" title="Yemen">',
    'ZM' : '<img src="/img/flags/zm.gif" title="Zambia">',
    'ZW' : '<img src="/img/flags/zw.gif" title="Zimbabwe">'
};
var countries_text = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua and Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia and Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Island',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo (DRC)',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'CI' : 'Cate dlvoire',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Eqypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Islas Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji Islands',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern and Antarctic Lands',
    'GA' : 'Gabon',
    'GM' : 'Gambia, The',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island and McDonald Islands',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong SAR',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Laos',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao SAR',
    'MK' : 'Macedonia, Former Yugoslav Republic of',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger>',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'KP' : 'North Korea',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn Islands',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russia',
    'RW' : 'Rwanda',
    'MF' : 'Saint Martin',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'CS' : 'Serbia and Montenegro',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia and the South Sandwich Islands',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'KN' : 'St. Kitts and Nevis',
    'LC' : 'St. Lucia',
    'PM' : 'St. Pierre and Miquelon',
    'VC' : 'St. Vincent and the Grenadines',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syria',
    'ST' : 'So Tom and Principe',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad and Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks and Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'UK' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Minor Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VA' : 'Vatican City',
    'VE' : 'Venezuela',
    'VN' : 'Vietnam',
    'VI' : 'Virgin Islands',
    'VG' : 'Virgin Islands, British',
    'WF' : 'Walls and Futuna',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};

//MEM prototype/class
MEM.prototype = {
    constructor: MEM,
    //Load ppv user table
    getContent:function(){
        $('#content-table').empty();
        $('#content-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="content-data"></table>');
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
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "action": "list_entries",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks
                    } );
                },
                "dataSrc": function ( json ) {
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
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 8, 10);     
            }                              
        });  
    },
    //Status modal
    statusEntry:function(pid,eid,status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        var status_update, status_text;
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';           
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+eid+")</div>";     
            status_update = 2;
            status_text = 'Block';    
        } else {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+eid+")</div>";    
            status_update = 1;    
            status_text = 'Unblock';    
        }
        $('#smh-modal .modal-header').html(header);       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-entry" class="btn btn-primary" onclick="smhMEM.updateStatus('+pid+',\''+eid+'\','+status_update+')">'+status_text+'</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do update status
    updateStatus:function(pid,eid,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            kentry_id: eid,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_entry_status';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-entry').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#status-entry').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Entry does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },5000);
                } else { 
                    smhMEM.getContent();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000);
                }
            }
        });
    },
    //Delete entry modal
    deleteEntry:function(pid,eid,type){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Entry</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+eid+")</div>";        
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="delete-entry" class="btn btn-primary" onclick="smhMEM.removeEntry('+pid+',\''+eid+'\','+type+')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do remove entry
    removeEntry:function(pid,eid,type){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            kentry_id: eid,
            media_type: type
        }

        var reqUrl = ApiUrl+'action=delete_entry';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-entry').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-entry').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Entry does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },5000);
                } else {  
                    smhMEM.getContent();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Deleted!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000);
                }
            }
        });
    },
    //Show preview and embed
    previewEmbed:function(sm_ak,uiconf,player_width,player_height,eid,mode,wrap_width){
        smhMain.resetModal();
        var header, content;
        $('#smh-modal3 .modal-body').css('height','700px');
        $('#smh-modal3 .modal-body').css('padding','0');
        $('#smh-modal3').modal({
            backdrop: 'static'
        });
        $('#smh-modal3').addClass('previewModal');
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Preview & Embed</h4>';
        $('#smh-modal3 .modal-header').html(header);

        content = '<iframe id="trim-clip" allowfullscreen webkitallowfullscreen mozallowfullscreen scrolling="no" width="100%" height="100%" frameborder="0" src="/apps/platform/preview_embed_mem.php?pid='+sessInfo.pid+'&sm_ak='+sm_ak+'&ks='+sessInfo.ks+'&uiconf_id='+uiconf+'&width='+player_width+'&height='+player_height+'&entry_id='+eid+'&mode='+mode+'&wrap_width='+wrap_width+'">';       
        $('#smh-modal3 .modal-body').html(content);
    },
    //Singel Entry modal
    addSingleEntry:function(){
        smhMain.resetModal();
        smhMEM.resetFilters();
        var header, content;
        $('.smh-dialog').css('width','900px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Single Entry</h4>';
        $('#smh-modal .modal-header').html(header);
        
        var tree = smhMEM.json_tree(categories,'cat');
        var tree_ac = smhMEM.json_tree(ac,'ac');
        var tree_flavors = smhMEM.json_tree(flavors,'flavors');
        
        content = '<div class="card wizard-card ct-wizard-green" id="wizard">'+
        '<div id="crumbs">'+
        '<ul class="nav nav-pills">'+
        '<li style="width: 50%;" class="active"><a href="#select-entry-tab" data-toggle="tab">SELECT ENTRY</a></li>'+
        '<li style="width: 50%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>'+
        '</ul>'+
        '</div>'+
        '<div class="tab-content">'+        
        '<div class="tab-pane active" id="select-entry-tab">'+
        '<div id="ppv-entries-wrapper">'+
        '<div style="margin-left: auto; margin-right: auto; width: 255px;">Select an entry you would like to protect.</div>'+
        '<div class="header rs-header">'+
        '<span class="dropdown header dropdown-accordion">'+
        '<div class="btn-group">'+
        '<button type="button" class="btn btn-default filter-btn"><span class="text">Filters</span></button>'+
        '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>'+
        '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">'+
        '<li role="presentation">'+
        '<div class="panel-group" id="accordion">'+
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a href="#collapseOne" data-toggle="collapse" data-parent="#accordion">'+
        'Filter by Categories'+
        '</a>'+
        '</h4>'+
        '</div>'+
        '<div class="panel-collapse collapse in" id="collapseOne">'+
        '<div class="panel-body">'+
        '<div id="tree1">'+
        '<div class="filter-header">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="filter-body cat-filter">'+
        tree+        
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a href="#collapseTwo" data-toggle="collapse" data-parent="#accordion">'+
        'Additional Filters'+
        '</a>'+
        '</h4>'+
        '</div>'+
        '<div class="panel-collapse collapse" id="collapseTwo">'+
        '<div class="panel-body">'+
        '<div id="tree2">'+
        '<div id="filter-header">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="all" class="media_all" checked> <b>All Media Types</b></label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="filter-body media-filter">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="1" class="media_list"> Video</label></div>'+
        '</li>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="5" class="media_list"> Audio</label></div>'+
        '</li>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="100" class="media_list"> Live Stream</label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div id="filter-header" style="margin-top: 13px;">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="all" class="durations_all" checked> <b>All Durations</b></label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="filter-body duration-filter">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="short" class="duration_list"> Short (0-4 min.)</label></div>'+
        '</li>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="medium" class="duration_list"> Medium (4-20 min.)</label></div>'+
        '</li>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="long" class="duration_list"> Long (20+ min.)</label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div id="filter-header" style="margin-top: 13px;">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="all" class="clipped_all" checked> <b>All Original & Clipped Entries</b></label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="filter-body clipped-filter">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="1" class="clipped_list"> Original Entries</label></div>'+
        '</li>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="0" class="clipped_list"> Clipped Entries</label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div id="filter-header" style="margin-top: 13px;">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="filter-body ac-filter">'+
        tree_ac+
        '</div>'+
        '<div id="filter-header" style="margin-top: 13px;">'+
        '<ul>'+
        '<li>'+
        '<div class="checkbox"><label><input type="checkbox" value="all" class="flavors_all" checked> <b>All Flavors</b></label></div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="filter-body flavors-filter">'+
        tree_flavors+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '</span>'+
        '</div>'+
        '<div id="entries">'+
        '<div id="mediaentry-table"></div>'+
        '</div>'+
        '</div>'+        
        '</div>'+                
        '<div class="tab-pane" id="ac-tab">'+        
        '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>'+
        '<div id="acentry-table"></div>'+        
        '</div>'+         
        '</div>'+
        '<div class="wizard-footer">'+
        '<div class="pull-right">'+
        '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>'+
        '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />'+
        '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhMEM.validateFinalStep()" name="finish" value="Finish" />'+
        '</div>'+
        '<div class="pull-left">'+
        '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />'+
        '</div>'+
        '<div class="clearfix"></div>'+
        '</div>';
 
        $('#smh-modal .modal-body').html(content);
        
        $('#smh-modal .modal-footer').css('padding','5px');
        $('#smh-modal .modal-footer').css('border-top-color','#ffffff');
        smhMEM.activateWizard();
        smhMEM.getMediaEntries();
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
            theme:"inset-dark",
            scrollButtons:{
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
        $('#smh-modal #tree1').on('change',".cat_all",function(){
            if ($(this).is(":checked")) {
                $('#smh-modal2 .cat-filter input[type="checkbox"]').each(function() {
                    $(this).prop('checked',false);
                });
            } else {
                $(this).prop('checked',true);
            }
            categoryIDs = [];
            smhMEM.getMediaEntries();
        });
        $('#smh-modal #tree1').on('click',".cat_list",function(){
            setTimeout(function(){
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function() {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true){
                    $('#smh-modal .cat_all').prop('checked',false);
                } else {
                    $('#smh-modal .cat_all').prop('checked',true);
                }
            },50);
            setTimeout(function(){
                smhMEM.getMediaEntries();
            },100);
        });
        
        $('#smh-modal #tree2').on('change',".media_all",function(){
            if ($(this).is(":checked")) {
                $('#smh-modal .media-filter input[type="checkbox"]').each(function() {
                    $(this).prop('checked',false);
                });
            } else {
                $(this).prop('checked',true);
            }
            mediaTypes = [];
            smhMEM.getMediaEntries();
        });
        $('#smh-modal #tree2').on('click',".media_list",function(){
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('#smh-modal .media-filter input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true){
                $('#smh-modal .media_all').prop('checked',false);
            }
            else {
                $('#smh-modal .media_all').prop('checked',true);
            }
            smhMEM.getMediaEntries();
        });
        
        $('#smh-modal #tree2').on('change',".durations_all",function(){
            if ($(this).is(":checked")) {
                $('#smh-modal .duration-filter input[type="checkbox"]').each(function() {
                    $(this).prop('checked',false);
                });
            } else {
                $(this).prop('checked',true);
            }
            duration = [];
            smhMEM.getMediaEntries();
        });
        $('#smh-modal #tree2').on('click',".duration_list",function(){
            var anyBoxesChecked = false;
            duration = [];
            $('#smh-modal .duration-filter input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true){
                $('#smh-modal .durations_all').prop('checked',false);
            } else {
                $('#smh-modal .durations_all').prop('checked',true);
            }
            smhMEM.getMediaEntries();
        });
        
        $('#smh-modal #tree2').on('change',".clipped_all",function(){
            if ($(this).is(":checked")) {
                $('#smh-modal .clipped-filter input[type="checkbox"]').each(function() {
                    $(this).prop('checked',false);
                });
            } else {
                $(this).prop('checked',true);
            }
            clipped = [];
            smhMEM.getMediaEntries();
        });
        $('#smh-modal #tree2').on('click',".clipped_list",function(){
            var anyBoxesChecked = false;
            clipped = [];
            $('#smh-modal .clipped-filter input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true){
                $('#smh-modal .clipped_all').prop('checked',false);
            } else {
                $('#smh-modal .clipped_all').prop('checked',true);
            }
            smhMEM.getMediaEntries();
        });
        
        $('#smh-modal #tree2').on('change',".ac_all",function(){
            if ($(this).is(":checked")) {
                $('#smh-modal .ac-filter input[type="checkbox"]').each(function() {
                    $(this).prop('checked',false);
                });
            } else {
                $(this).prop('checked',true);
            }
            ac_filter = [];
            smhMEM.getMediaEntries();
        });
        $('#smh-modal #tree2').on('click',".ac_list",function(){
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#smh-modal .ac-filter input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true){
                $('#smh-modal .ac_all').prop('checked',false);
            } else {
                $('#smh-modal .ac_all').prop('checked',true);
            }
            smhMEM.getMediaEntries();
        });
        
        $('#smh-modal #tree2').on('change',".flavors_all",function(){
            if ($(this).is(":checked")) {
                $('#smh-modal .flavors-filter input[type="checkbox"]').each(function() {
                    $(this).prop('checked',false);
                });
            } else {
                $(this).prop('checked',true);
            }
            flavors_filter = [];
            smhMEM.getMediaEntries();
        });
        $('#smh-modal #tree2').on('click',".flavors_list",function(){
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('#smh-modal .flavors-filter input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true){
                $('#smh-modal .flavors_all').prop('checked',false);
            } else {
                $('#smh-modal .flavors_all').prop('checked',true);
            }
            smhMEM.getMediaEntries();
        });
    },
    //Playlist Entry Modal
    addPlistEntry:function(){
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width','900px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Playlist</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div class="card wizard-card ct-wizard-green" id="wizard">'+
        '<div id="crumbs">'+
        '<ul class="nav nav-pills">'+
        '<li style="width: 50%;" class="active"><a href="#select-plist-tab" data-toggle="tab">SELECT PLAYLIST</a></li>'+
        '<li style="width: 50%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>'+
        '</ul>'+
        '</div>'+
        '<div class="tab-content">'+        
        '<div class="tab-pane active" id="select-plist-tab">'+
        '<div style="margin-left: auto; margin-right: auto; width: 270px;">Select the playlist you would like to protect.<br><small>*Note: You must have at least 1 manual Playlist</small></div>'+
        '<div id="mem-playlist-table"></div>'+
        '</div>'+                      
        '<div class="tab-pane" id="ac-tab">'+        
        '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>'+
        '<div id="acentry-table"></div>'+        
        '</div>'+          
        '</div>'+
        '<div class="wizard-footer">'+
        '<div class="pull-right">'+
        '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>'+
        '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />'+
        '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhMEM.validatePlistFinalStep()" name="finish" value="Finish" />'+
        '</div>'+
        '<div class="pull-left">'+
        '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />'+
        '</div>'+
        '<div class="clearfix"></div>'+
        '</div>';
 
        $('#smh-modal .modal-body').html(content);
        
        $('#smh-modal .modal-footer').css('padding','5px');
        $('#smh-modal .modal-footer').css('border-top-color','#ffffff');
        smhMEM.activatePlistWizard();
        smhMEM.getPlaylists();
    },
    //Category Entry Modal
    addCatEntry:function(){
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width','900px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Category</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div class="card wizard-card ct-wizard-green" id="wizard">'+
        '<div id="crumbs">'+
        '<ul class="nav nav-pills">'+
        '<li style="width: 50%;" class="active"><a href="#select-plist-tab" data-toggle="tab">SELECT CATEGORY</a></li>'+
        '<li style="width: 50%;"><a href="#ac-tab" data-toggle="tab">ACCESS CONTROL</a></li>'+
        '</ul>'+
        '</div>'+
        '<div class="tab-content">'+        
        '<div class="tab-pane active" id="select-plist-tab">'+
        '<div style="margin-left: auto; margin-right: auto; width: 282px;">Select the category you would like to protect.</div>'+
        '<div id="cat-table"></div>'+
        '</div>'+                       
        '<div class="tab-pane" id="ac-tab">'+        
        '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>'+
        '<div id="acentry-table"></div>'+        
        '</div>'+          
        '</div>'+
        '<div class="wizard-footer">'+
        '<div class="pull-right">'+
        '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>'+
        '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />'+
        '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhMEM.validateFinalStep()" name="finish" value="Finish" />'+
        '</div>'+
        '<div class="pull-left">'+
        '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />'+
        '</div>'+
        '<div class="clearfix"></div>'+
        '</div>';
 
        $('#smh-modal .modal-body').html(content);
        
        $('#smh-modal .modal-footer').css('padding','5px');
        $('#smh-modal .modal-footer').css('border-top-color','#ffffff');
        smhMEM.activateCatWizard();
        smhMEM.getCategories();
    },
    //Reset Modal
    resetModal:function(){
        $('#smh-modal2 .modal-header').empty(); 
        $('#smh-modal2 .modal-body').empty();
        $('#smh-modal2 .modal-footer').empty();
        $('#smh-modal2 .modal-content').css('min-height','');
        $('#smh-modal2 .smh-dialog2').css('width','');
        $('#smh-modal2 .modal-body').css('height','');
        $('#smh-modal2 .modal-body').css('padding','15px');
    },
    //View Rules
    viewRules:function(name,domains,countries,ips,flavors,advsec){
        smhMEM.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width','370px');
        $('#smh-modal2 .modal-body').css('padding','0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        }); 
        $('#smh-modal2').css('z-index','2000');
        $('#smh-modal').css('z-index','2');
        
        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">'+name+' Rules</h4>';
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
            $.each(domain_arr, function(index, value){ 
                domain_names += "<div class='rule-spacing'>"+value+"</div>";
            });
        } else {
            domians_exp[0] = 'Authorized';
            domain_names = "<div class='rule-spacing'>"+domains+"</div>";
        }
        if (countries.indexOf('Authorized') > -1 || countries.indexOf('Blocked') > -1) {
            countries_exp = countries.split(": ");
            countries_arr = countries_exp[1].split(",");        
            $.each(countries_arr, function(index, value){             
                flags += "<div class='rule-spacing'>"+countries_imgs[value] + " " +countries_text[value]+ "</div>";
            });
        } else {
            countries_exp[0] = 'Authorized';
            flags = "<div class='rule-spacing'>"+countries+"</div>";
        }
        if (ips.indexOf('Authorized') > -1 || ips.indexOf('Blocked') > -1) {
            ips_exp = ips.split(": ");
            ips_arr = ips_exp[1].split(",");
            $.each(ips_arr, function(index, value){ 
                ip_text += "<div class='rule-spacing'>"+value+"</div>";
            });
        } else {
            ips_exp[0] = 'Authorized';
            ip_text = "<div class='rule-spacing'>"+ips+"</div>";
        }
        if (flavors.indexOf('Authorized') > -1 || flavors.indexOf('Blocked') > -1) {
            flavors_exp = flavors.split(": ");
            flavors_arr = flavors_exp[1].split(",");
            $.each(flavors_arr, function(index, value){ 
                flavors_text += "<div class='rule-spacing'>"+value+"</div>";
            });
        } else {
            flavors_exp[0] = 'Authorized';
            flavors_text = "<div class='rule-spacing'>"+flavors+"</div>";
        }

        content = "<div id='rules-wrapper'>"+
        "<h4>"+domians_exp[0]+" Domains</h4>"+
        "<div class='rule-wrapper'>"+domain_names+"</div>"+
        "<h4>"+countries_exp[0]+" Countries</h4>"+
        "<div class='rule-wrapper'>"+flags+"</div>"+
        "<h4>"+ips_exp[0]+" IPs</h4>"+
        "<div class='rule-wrapper'>"+ip_text+"</div>"+
        "<h4>"+flavors_exp[0]+" Flavors</h4>"+
        "<div class='rule-wrapper'>"+flavors_text+"</div>"+
        "<h4>Advanced Security & Pay-Per-View</h4>"+
        "<div class='rule-spacing' style='margin-left: 20px;'>"+advsec+"</div>"+
        "</div>";
 
        $('#smh-modal2 .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
        
        $('#smh-modal2 #rules-wrapper').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
        $('#smh-modal2 .rule-wrapper').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Activate wizard
    activateWizard:function(){
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function(tab, navigation, index){
                if(index == 1){
                    smhMEM.getACEntries(false);
                    return smhMEM.validateFirstStep();
                }    
            },
            onTabClick : function(tab, navigation, index){
                // Disable the posibility to click on tabs
                return false;
            }, 
            onTabShow: function(tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index+1;
            
                var wizard = navigation.closest('.wizard-card');
            
                // If it's the last tab then hide the last button and show the finish instead
                if($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });  
    },
    activatePlistWizard:function(){
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function(tab, navigation, index){
                if(index == 1){
                    smhMEM.getACEntries(false);
                    return smhMEM.validateFirstPlistStep();
                }     
            },
            onTabClick : function(tab, navigation, index){
                // Disable the posibility to click on tabs
                return false;
            }, 
            onTabShow: function(tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index+1;
            
                var wizard = navigation.closest('.wizard-card');
            
                // If it's the last tab then hide the last button and show the finish instead
                if($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        }); 
    },
    activateCatWizard:function(){
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function(tab, navigation, index){
                if(index == 1){
                    smhMEM.getACEntries(false);
                    return smhMEM.validateFirstCatStep();
                } 
            },
            onTabClick : function(tab, navigation, index){
                // Disable the posibility to click on tabs
                return false;
            }, 
            onTabShow: function(tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index+1;
            
                var wizard = navigation.closest('.wizard-card');
            
                // If it's the last tab then hide the last button and show the finish instead
                if($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    validateFirstStep:function(){
        var radio_value = '';
        var radio_type = '';
        var radio_name = '';
        var rowcollection =  memEntriesTable.$(".mem-entry:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_type = checkbox_value[1];
            radio_name = checkbox_value[2];
        });
        
        if(radio_value == ''){
            alert('You must select an entry!');
            return false;
        } else {
            mem_entry_id = radio_value;
            mem_entry_type = radio_type;
            mem_entry_name = radio_name;
            return true;
        }  
    },
    validateFirstPlistStep:function(){
        var radio_value = '';
        var radio_type = '';
        var radio_name = '';
        var rowcollection =  plistEntry.$(".mem-plist:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_type = checkbox_value[1];
            radio_name = checkbox_value[2];
        });
        
        if(radio_value == ''){
            alert('You must select a playlist!');
            return false;
        } else {
            mem_entry_id = radio_value;
            mem_entry_type = radio_type;
            mem_entry_name = radio_name;
            return true;
        } 
    },
    validateFirstCatStep:function(){
        var radio_value = '';
        var radio_type = '';
        var radio_name = '';
        var rowcollection =  catTable.$(".mem-cat:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_type = checkbox_value[1];
            radio_name = checkbox_value[2];
        });
        
        if(radio_value == ''){
            alert('You must select a category!');
            return false;
        } else {
            mem_entry_id = radio_value;
            mem_entry_type = radio_type;
            mem_entry_name = radio_name;
            return true;
        } 
    },
    validateFinalStep:function(){
        var radio_value = '';
        var radio_name = '';
        var rowcollection =  acEntry.$(".mem-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });
        
        if(radio_value == ''){
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhMEM.saveSingleEntry(ac_id,ac_name);
        } 
    },
    validatePlistFinalStep:function(){
        var radio_value = '';
        var radio_name = '';
        var rowcollection =  acEntry.$(".mem-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });
        
        if(radio_value == ''){
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhMEM.savePlistEntry(ac_id,ac_name);
        } 
    },
    validateFinalEditStep:function(){
        var radio_value = '';
        var radio_name = '';
        var rowcollection =  acEntry.$(".mem-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });
        
        if(radio_value == ''){
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhMEM.updateSingleEntry(ac_id,ac_name);
        } 
    },
    validatePlistFinalEditStep:function(){
        var radio_value = '';
        var radio_name = '';
        var rowcollection =  acEntry.$(".mem-ac:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val().split(';');
            radio_value = checkbox_value[0];
            radio_name = checkbox_value[1];
        });
        
        if(radio_value == ''){
            alert('You must select a profile!');
        } else {
            var ac_id = radio_value;
            var ac_name = radio_name;
            smhMEM.updatePlistEntry(ac_id,ac_name);
        }   
    },
    //Saves Single PPV entry
    saveSingleEntry:function(ac_id,ac_name){
        var kentry = mem_entry_id;
        var kentry_name = mem_entry_name;
        var media_type = mem_entry_type;
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name,
            status: 1
        } 
        reqUrl = ApiUrl+'action=add_entry';
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#wizard .btn-previous').attr('disabled','');
                $('#wizard .btn-finish').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry already <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000);
                } else {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                    smhMEM.getContent(); 
                }
            }
        });        
    },
    //Updates Single PPV Entry
    updateSingleEntry:function(ac_id,ac_name){
        var kentry = mem_entry_id;
        var kentry_name = mem_entry_name;
        var media_type = mem_entry_type;
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name
        } 
        reqUrl = ApiUrl+'action=update_entry';
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#update-entry').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#update-entry').removeAttr('disabled');
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry does not <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000);
                } else {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                    smhMEM.getContent(); 
                }
            }
        });
    },
    //Updates PPV Playlist Entry
    updatePlistEntry:function(ac_id,ac_name){
        var kentry = mem_entry_id;
        var kentry_name = mem_entry_name;
        var media_type = mem_entry_type;
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name
        } 
        reqUrl = ApiUrl+'action=update_entry';
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#update-entry').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#update-entry').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry does not <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000);
                } else {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                    smhMEM.getContent(); 
                }
            }
        });
    },
    //Saves PPV playlist entry
    savePlistEntry:function(ac_id,ac_name){
        var kentry = mem_entry_id;
        var kentry_name = mem_entry_name;
        var media_type = mem_entry_type;
        var sessData, reqUrl;
        sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            kentry_id: kentry,
            kentry_name: kentry_name,
            media_type: media_type,
            ac_id: ac_id,
            ac_name: ac_name,
            status: 1
        } 
        reqUrl = ApiUrl+'action=add_entry';
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#wizard .btn-previous').attr('disabled','');
                $('#wizard .btn-finish').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Entry already <strong>Exists</strong>. Please try again.</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000);
                } else {
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                    smhMEM.getContent();                              
                }
            }
        }); 
    },
    //Edit Mem Entry
    editEntry:function(eid,name,type,ac_id,ac_name){
        if(type == 1 || type == 5 || type == 100){
            smhMEM.editSingleEntry(eid,name,type,ac_id,ac_name);
        } else if(type == 3){
            smhMEM.editPlaylistEntry(eid,name,type,ac_id,ac_name);
        } else if (type == 6){
            smhMEM.editCatEntry(eid,name,type,ac_id,ac_name);
        }
    },
    //Edit Single MEM Entry
    editSingleEntry:function(eid,name,type,ac_id,ac_name){
        mem_entry_id = eid;
        mem_entry_name = name;
        mem_entry_type = type;
        mem_ac_id = ac_id;
        mem_ac_name = ac_name;
        
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','900px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Single Entry</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>'+
        '<div id="acentry-table"></div>'; 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="update-entry" class="btn btn-primary" onclick="smhMEM.validateFinalEditStep()">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhMEM.getACEntries(true);
    },
    //Edit PVV Playlist
    editPlaylistEntry:function(eid,name,type,ac_id,ac_name){
        mem_entry_id = eid;
        mem_entry_name = name;
        mem_entry_type = type;
        mem_ac_id = ac_id;
        mem_ac_name = ac_name;
        
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','900px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Playlist</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>'+
        '<div id="acentry-table"></div>'; 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="update-entry" class="btn btn-primary" onclick="smhMEM.validatePlistFinalEditStep()">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhMEM.getACEntries(true);
    },
    //Edit PPV Category
    editCatEntry:function(eid,name,type,ac_id,ac_name){
        mem_entry_id = eid;
        mem_entry_name = name;
        mem_entry_type = type;
        mem_ac_id = ac_id;
        mem_ac_name = ac_name;
        
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','900px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Category</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<div style="margin-left: auto; margin-right: auto; width: 433px; text-align: center;">Select an Access Control Profile.<br><small>*Note: You must have at least 1 Profile with authetication token protection enabled.</small></div>'+
        '<div id="acentry-table"></div>'; 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="update-entry" class="btn btn-primary" onclick="smhMEM.validateFinalEditStep()">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhMEM.getACEntries(true);
    },  
    //Get Access Control profiles
    getACEntries:function(edit){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#acentry-table').empty();
        $('#acentry-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="acentry-data"></table>');
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
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "action": 'list_actype',
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    } );
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
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 4, 7);   
                if(edit){
                    $('#'+mem_ac_id).prop('checked',true);
                }
            }                                
        });
        $('#acentry-table .dataTables_scrollBody').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Get Playlist table
    getPlaylists:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#mem-playlist-table').empty();
        $('#mem-playlist-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="mem-playlist-data"></table>');
        plistEntry = $('#mem-playlist-data').DataTable({
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
                "url": "/api/v1/mem_playlists",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz
                    } );
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
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 4, 7);   
            }                                
        });
        $('#mem-playlist-table .dataTables_scrollBody').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Get Categories table
    getCategories:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#cat-table').empty();
        $('#cat-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="mem-cat-data"></table>');
        catTable = $('#mem-cat-data').DataTable({
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
                "url": "/api/v1/mem_categories",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz
                    } );
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
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 5, 7);    
            }                                
        });
    },
    //Get Entries table
    getMediaEntries:function(){
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#mediaentry-table').empty();
        $('#mediaentry-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="mem-entries-data"></table>');
        memEntriesTable = $('#mem-entries-data').DataTable({
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
                "url": "/api/v1/mem_entriesFW",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "category": categories_id,
                        "mediaType": mediaTypes_id,
                        "duration": durations,
                        "clipped": clipped_id,
                        "ac": ac_id,
                        "flavors": flavors_id
                    } );
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
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 5, 7);    
            }                                
        });
    },
    //Get Categories
    getCats:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
            if(results.code && results.message){
                alert(results.message);
                return;
            }else{
                var categories_arr = [];
                $.each(results.objects, function(index, value){
                    var cat_arr = {};
                    cat_arr['id'] = value.id;
                    cat_arr['parentId'] = value.parentId;
                    cat_arr['name'] = value.name;
                    cat_arr['partnerSortValue'] = value.partnerSortValue;
                    categories_arr.push(cat_arr);
                });
                categories_arr.sort(function(a,b) {
                    return a.partnerSortValue - b.partnerSortValue;
                });
                categories = smhMEM.getNestedChildren(categories_arr,0);
            }
        };
        
        var filter = new KalturaCategoryFilter();
        filter.orderBy = "+name";
        var pager = null;
        client.category.listAction(cb, filter, pager); 
    },
    //Get Access Control Profiles
    getAccessControlProfiles:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
            if(results.code && results.message){
                alert(results.message);
                return;
            }else{
                var ac_arr = [];
                $.each(results.objects, function(index, value){
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
    getFlavors:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
            if(results.code && results.message){
                alert(results.message);
                return;
            }else{
                var flavors_arr = [];
                $.each(results.objects, function(index, value){
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
    getNestedChildren:function(arr, parentId){
        var out = []
        for(var i in arr) {
            if(arr[i].parentId == parentId) {
                var children = smhMEM.getNestedChildren(arr, arr[i].id)

                if(children.length) {
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
    json_tree:function(data,type){
        var json = '<ul>';    
        for(var i = 0; i < data.length; ++i) {
            if(data[i].children.length) {
                json = json + '<li class="collapsed"><div class="checkbox"><label><input type="checkbox" class="'+type+'_list" value="'+data[i].id+'" /> '+data[i].name+'</label></div>';
                json = json + smhMEM.json_tree(data[i].children,type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="'+type+'_list" value="'+data[i].id+'" /> '+data[i].name+'</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Resets filters
    resetFilters:function(){
        categoryIDs = [];
        mediaTypes = [];
        duration = [];
        clipped = [];
        ac_filter = [];
        flavors_filter = [];   
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_mem_content_metadata';  
        }        
    },
    //Reset Modal
    resetPreviewModal:function(){
        $('#smh-modal3 .modal-header').empty(); 
        $('#smh-modal3 .modal-body').empty();
        $('#smh-modal3 .modal-footer').empty();
        $('#smh-modal3 .modal-content').css('min-height','');
        $('#smh-modal3 .smh-dialog2').css('width','');
        $('#smh-modal3 .modal-body').css('height','');
        $('#smh-modal3 .modal-body').css('padding','15px');
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal2').on('click', '.smh-close2', function(){
            $('#smh-modal').css('z-index','');    
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal3').on('click', '.smh-close', function(){
            $('#smh-modal3').on('hidden.bs.modal', function (e) {
                smhMEM.resetPreviewModal();  
            });            
        });
    }
}

// PPV on ready
$(document).ready(function(){
    smhMEM = new MEM();
    smhMEM.registerActions();
    smhMEM.getContent();
    smhMEM.getCats();
    smhMEM.getAccessControlProfiles();
    smhMEM.getFlavors();
});
