<?php
$cfg = yaml_parse_file(__DIR__ . '/app/config/parameters.yml') or die("Can't parse config");
$cfg = $cfg['parameters'];

//print_r($cfg);exit;
try {
    $dbh = new PDO('mysql:host='.$cfg['database_host'].';dbname=' . $cfg['database_name'], $cfg['database_user'], $cfg['database_password']);
//    $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch( PDOExecption $e ) {
    print "Error!: " . $e->getMessage() . "</br>";
}

$dbh->beginTransaction();

//echo 'OK';exit;

$init = [
    'NUTCH' => [
        'fos_user' => ['NUTCH','nutch','asen.natchev@polirind.com','asen.natchev@polirind.com',1,NULL,'$2y$13$RaWUchL.AZAVuL9JA1mh2uxuOoGWfXJxtN0R2gAlowAqrFdyJRP.C','2022-01-17 16:13:53',NULL,NULL,'a:4:{i:0;s:12:"ROLE_STUDENT";i:1;s:11:"ROLE_CLIENT";i:2;s:15:"ROLE_INSTRUCTOR";i:3;s:10:"ROLE_ADMIN";}',2,2,'2021-08-25 07:54:08','2022-01-18 12:51:22',NULL,NULL],
        'user_personal_info' => ['NUTCH','a:1:{i:0;i:0;}',NULL,2,'__THIS_USERID__','2021-08-25 07:54:08','2021-09-16 12:40:21',NULL,'"null"',87,'__THIS_USERID__',171,175,35,182,'Assen',NULL,'Natchev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-08-24',NULL,NULL,'Асен',NULL,'Начев',NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),'{"2686":{"max_life":{"type":"seconds","value":3600}}}',NULL,NULL],
        'user_profile_role_types' => [227,228,229,231,1132],
    ],
    'NUTCH-PILOT' => [
        'fos_user' => ['NUTCH-PILOT','nutch-pilot','asen.natchev1@polirind.com','asen.natchev1@polirind.com',1,NULL,'$2y$13$QVyaW4wQbj0o1ncoss7c1u5o4G8d.011sP9PumlkOmI/eFX4f8yEa','2021-08-25 08:07:15',NULL,NULL,'a:3:{i:0;s:12:"ROLE_STUDENT";i:1;s:11:"ROLE_CLIENT";i:2;s:15:"ROLE_INSTRUCTOR";}',2,2,'2021-08-25 07:57:41','2022-01-18 12:53:09',NULL,NULL],
        'user_personal_info' => ['NUTCH-PILOT','a:1:{i:0;i:0;}',NULL,2,2,'2021-08-25 07:57:41','2021-08-25 07:57:42',NULL,'"null"',87,'__THIS_USERID__',171,175,35,182,'Pilot',NULL,'Nutch',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-08-22',NULL,NULL,'Асен-Пилот',NULL,'Nutch',NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,NULL],
        'user_profile_role_types' => [227,228,229,1132],
    ],
    'NUTCH-USER' => [
        'fos_user' => ['NUTCH-USER','nutch-user','asen.natchev2@polirind.com','asen.natchev2@polirind.com',1,NULL,'$2y$13$8EVaOTh6W6tVs/Hjr.PC8exjPAlQ2Fo/k8Rf0eD/d6N.HvVLlVVgu','2021-10-22 10:06:03',NULL,NULL,'a:2:{i:0;s:12:"ROLE_STUDENT";i:1;s:11:"ROLE_CLIENT";}',2,2,'2021-08-25 07:59:48','2022-01-18 12:53:35',NULL,NULL],
        'user_personal_info' =>['NUTCH-USER','a:2:{i:0;i:0;i:1;i:1;}',NULL,2,3,'2021-08-25 07:59:48','2021-10-21 13:24:11',NULL,'"{\\"346\\":{\\"contact\\":\\"asen.natchev2@polirind.com\\",\\"active\\":false,\\"silent\\":[]}}"',66,'__THIS_USERID__',171,175,35,182,'Assen-user',NULL,'Asen-user',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-08-22',NULL,NULL,'Асен Юзър',NULL,'Асен Юзър',NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,1402.1600],
        'user_profile_role_types' => [227,228,339,1132],
    ],
    'jorkataoperator' => [
        'fos_user' => ['jorkataoperator','jorkataoperator','peshev82@abv.bg','peshev82@abv.bg',1,NULL,'$2y$13$ONEAOi1AK1uCcG0uYGvRQ.RpReL.tFEzndvixDo12aoKUxxRo.gRK','2022-01-18 13:43:36','OrTgTI7RZqDoIxsQOtydyWL1ZPVoPoqMWff7X0H406U',NULL,'a:1:{i:0;s:13:"ROLE_OPERATOR";}',NULL,NULL,'2021-10-15 18:07:14','2022-01-18 13:43:36',NULL,NULL],
        'user_personal_info' => ['jorkataoperator','a:1:{i:0;i:0;}',NULL,NULL,270,'2021-10-15 18:07:14','2022-01-06 11:49:14',NULL,'"{\\"346\\":{\\"contact\\":\\"peshev82@abv.bg\\",\\"active\\":false,\\"silent\\":[]}}"',87,'__THIS_USERID__',171,175,35,NULL,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,NULL,NULL,NULL,NULL,NULL],
        'user_profile_role_types' => [230],
        'user_contact' => [
            [198,NULL,NULL,'peshev82@abv.bg',NULL,'2021-10-15 18:07:14','2021-10-15 18:07:14',NULL,'__THIS_PROFILEID__',NULL,NULL,NULL],
        ],
    ],
    'Jorkatadual' => [
        'fos_user' => ['Jorkatadual','jorkatadual','jorkatadual@examplemail.com','jorkatadual@examplemail.com',1,NULL,'$2y$13$wCWWk1Ay9wvktacElsg67u9iBalMxzmbgifKDQWcSOgi9BZZJNMqa','2022-01-18 14:16:26',NULL,NULL,'a:1:{i:0;s:12:"ROLE_STUDENT";}',270,291,'2021-12-22 14:33:48','2022-01-18 14:21:39',NULL,NULL],
        'user_personal_info' => ['Jorkatadual','a:0:{}',NULL,270,291,'2021-12-22 14:33:48','2022-01-18 14:21:39',NULL,'"{\\"346\\":{\\"contact\\":\\"jorkatadual@examplemail.com\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-11-01',NULL,NULL,'0883354395',NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,'2022-04-11 00:29:59','2022-04-12 00:29:59',NULL,NULL,NULL],
        'user_profile_role_types' => [227],
        'user_course' => [
            [1157,1158,1185,270,270,'2021-11-01',NULL,0,'2021-12-22 14:33:49','2022-01-12 15:50:18','2022-01-12 15:54:39','__THIS_PROFILEID__',1186],
            [1140,1141,1143,270,270,'2022-01-10',NULL,0,'2022-01-12 15:54:39','2022-01-12 15:54:39','2022-01-12 15:55:05','__THIS_PROFILEID__',1152],
            [1140,1141,1143,270,270,'2020-09-14',NULL,0,'2022-01-12 15:55:45','2022-01-12 16:10:11',NULL,'__THIS_PROFILEID__',1152],
        ],
    ],
    'jorkataclient' => [
        'fos_user' => ['Jorkataclient','jorkataclient','jorkataclient@examplemail.com','jorkataclient@examplemail.com',1,NULL,'$2y$13$7t.n6jrA1gSvkkGpazCqCOAmw.dnzh4SC3d0qwltCLdmONYJufDfK','2022-01-18 13:01:14',NULL,NULL,'a:3:{i:0;s:11:"ROLE_CLIENT";i:1;s:14:"ROLE_PASSENGER";i:2;s:12:"ROLE_STUDENT";}',270,291,'2022-01-04 14:23:02','2022-01-18 14:11:02',NULL,NULL],
        'user_personal_info' => ['jorkataclient','a:0:{}',NULL,270,291,'2022-01-04 14:23:02','2022-01-18 14:11:02',NULL,'"{\\"346\\":{\\"contact\\":\\"jorkataclient@examplemail.com\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,'088335439',NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,5800.0000],
        'user_profile_role_types' => [227,228,1132],
        'user_course' => [
            [1140,1141,1143,270,270,'2021-11-01',NULL,0,'2022-01-06 12:05:04','2022-01-06 12:05:04',NULL,'__THIS_PROFILEID__',1152],
        ],
    ],
    'jorkatainstruktor' => [
        'fos_user' => ['Jorkatainstruktor','jorkatainstruktor','georgi.peshev@gmail.co','georgi.peshev@gmail.co',1,NULL,'$2y$13$4NzfbJcQ08LcytSH6vPtr.o4pJY9Ycz8yvZk45hreVi/wqWCLaIM6',NULL,NULL,NULL,'a:1:{i:0;s:15:"ROLE_INSTRUCTOR";}',291,291,'2022-01-18 13:46:15','2022-01-18 14:03:11',NULL,NULL],
        'user_personal_info' => ['Jorkatainstruktor','a:0:{}',NULL,291,291,'2022-01-18 13:46:15','2022-01-18 14:02:48',NULL,'"{\\"346\\":{\\"contact\\":\\"georgi.peshev@gmail.co\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,NULL],
        'user_profile_role_types' => [229],
        'user_course' => [
            [1140,1141,1143,291,291,'2021-10-01',NULL,0,'2022-01-18 14:19:14','2022-01-18 14:19:14',NULL,'__THIS_PROFILEID__',1152],
        ],

    ],
    'jorkatagroundinstructor' => [
        'fos_user' => ['Jorkatagroundinstructor','jorkatagroundinstructor','jorkatagroundinstructor@examplemail.com','jorkatagroundinstructor@examplemail.com',1,NULL,'$2y$13$gUY4aKr8qSIcOtc5ZfOLFOkADc1KhqE59n/jP1fxWFGdJAoN/gH8W','2022-01-18 13:53:54',NULL,NULL,'a:1:{i:0;s:15:"ROLE_INSTRUCTOR";}',270,NULL,'2022-01-04 15:03:33','2022-01-18 13:53:54',NULL,NULL],
        'user_personal_info' => ['Jorkatagroundinstructor','a:0:{}',NULL,270,270,'2022-01-04 15:03:33','2022-01-12 12:06:01',NULL,'"{\\"346\\":{\\"contact\\":\\"jorkatagroundinstructor@examplemail.com\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),'{"1117":{"soloPeriod":{"type":"days","value":50},"passangersPeriod":{"type":"days","value":50}}}',NULL,NULL],
        'user_profile_role_types' => [229],
    ],
    'jorkataPIC' => [
        'fos_user' => ['jorkataPIC','jorkatapic','jorkatapic@examplemail.com','jorkatapic@examplemail.com',1,NULL,'$2y$13$mly6CnCpd5DsqbfzcZq1Y.sa6YRMOUXDA80Ao8FZnMSiFIycWTajy',NULL,NULL,NULL,'a:2:{i:0;s:12:"ROLE_STUDENT";i:1;s:11:"ROLE_CLIENT";}',270,291,'2022-01-06 11:57:30','2022-01-18 14:22:03',NULL,NULL],
        'user_personal_info' => ['jorkataPIC','a:0:{}',NULL,270,291,'2022-01-06 11:57:30','2022-01-18 14:22:03',NULL,'"{\\"346\\":{\\"contact\\":\\"jorkatapic@examplemail.com\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,'0883354395',NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,NULL],
        'user_profile_role_types' => [227,228],
        'user_course' => [
            [1140,1141,1143,270,270,'2021-11-01',NULL,0,'2022-01-06 11:58:14','2022-01-06 11:58:14',NULL,'__THIS_PROFILEID__',1152],
        ]
    ],
    'jorkataadmin' => [
        'fos_user' => ['jorkataadmin','jorkataadmin','georgi.peshev@gm.k','georgi.peshev@gm.k',1,NULL,'$2y$13$hYZdIGp860M/Bk1otrWFmeGsfUyNsy5c2HHkEKPuO5UN.Joh1pPnW','2022-01-18 14:16:36',NULL,NULL,'a:1:{i:0;s:10:"ROLE_ADMIN";}',270,NULL,'2022-01-18 13:39:11','2022-01-18 14:16:36',NULL,NULL],
        'user_personal_info' => ['jorkataadmin','a:0:{}',NULL,270,270,'2022-01-18 13:39:11','2022-01-18 13:40:11',NULL,'"{\\"346\\":{\\"contact\\":\\"georgi.peshev@gm.k\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,'0883354395',NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,NULL],
        'user_profile_role_types' => [231],

    ],
    'jorkatapassenger' => [
        'fos_user' => ['jorkatapassenger','jorkatapassenger','georgi.peshev@gm','georgi.peshev@gm',1,NULL,'$2y$13$pmwekdvEJMGP8/nxHN9a8eiCXoDbsctuqUBVHiBsnDlvPvjBSX27i',NULL,NULL,NULL,'a:2:{i:0;s:11:"ROLE_CLIENT";i:1;s:14:"ROLE_PASSENGER";}',291,291,'2022-01-18 13:56:00','2022-01-18 14:22:37',NULL,NULL],
        'user_personal_info' => ['jorkatapassenger','a:0:{}',NULL,291,291,'2022-01-18 13:56:00','2022-01-18 14:22:37',NULL,'"{\\"346\\":{\\"contact\\":\\"georgi.peshev@gm\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,NULL],
        'user_profile_role_types' => [228,1132],
        'user_course' => [
            [1140,1141,1143,291,291,'2021-10-01',NULL,0,'2022-01-18 14:22:37','2022-01-18 14:22:37',NULL,'__THIS_PROFILEID__',1152],
        ]

    ],
    'Jorkataexaminer' => [
        'fos_user' => ['Jorkataexaminer','jorkataexaminer','georgi.peshev@gmw','georgi.peshev@gmw',1,NULL,'$2y$13$umEKNngs9Iu4y8SYCKun3u/Q8e9xAGCaXy/rGH2ezO5WuvWbjNWUu',NULL,NULL,NULL,'a:1:{i:0;s:15:"ROLE_INSTRUCTOR";}',291,291,'2022-01-18 14:00:22','2022-01-18 14:00:50',NULL,NULL],
        'user_personal_info' => ['Jorkataexaminer','a:0:{}',NULL,291,291,'2022-01-18 14:00:22','2022-01-18 14:01:12',NULL,'"{\\"346\\":{\\"contact\\":\\"georgi.peshev@gmw\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,date("Y-m-d H:i:s", strtotime("+5 years")),date("Y-m-d H:i:s", strtotime("+5 years")),NULL,NULL,NULL],
        'user_profile_role_types' => [229],

    ],
    'JorkataNoSolo' => [
        'fos_user' => ['JorkataNoSolo','jorkatanosolo','georgi.peshev@gmail.c','georgi.peshev@gmail.c',1,NULL,'$2y$13$kx9QDgS0y.GgF.iU5wUUk.uUpofJ4YaHgTLyMfzySQm9PM8OmfMV.',NULL,NULL,NULL,'a:1:{i:0;s:15:"ROLE_INSTRUCTOR";}',291,291,'2022-01-18 14:06:10','2022-01-18 14:06:36',NULL,NULL],
        'user_personal_info' => ['JorkataNoSolo','a:0:{}',NULL,291,291,'2022-01-18 14:06:10','2022-01-18 14:20:43',NULL,'"{\\"346\\":{\\"contact\\":\\"georgi.peshev@gmail.c\\",\\"active\\":false,\\"silent\\":[]}}"',NULL,'__THIS_USERID__',171,175,35,182,'Georgi',NULL,'Peshev',NULL,NULL,NULL,NULL,NULL,NULL,226,'2021-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,812,'ft','in','nm','US gal/h','US gal','hddd°mm\'ss.s"','ft','hPa','C','sec','kt','ft/m','m','lb','kt',NULL,'{}',0,NULL,NULL,NULL,NULL,NULL],
        'user_profile_role_types' => [229],
    ],
];


function replacePlaceholderWithId($ph, $id, $arr) {
    foreach($arr as $cn => $d) {
        if ($d == $ph)
            $arr[$cn] = str_replace($ph, $id, $d);
    }
    return $arr;
}

try {
$fos_user_q = $dbh->prepare("INSERT INTO fos_user (username,username_canonical,email,email_canonical,enabled,salt,password,
    last_login,confirmation_token,password_requested_at, roles, created_by, updated_by, created_at, updated_at, deleted_at, language)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);");
$user_personal_info_q = $dbh->prepare("INSERT INTO user_personal_info (nickname, languages, company, created_by, updated_by, created_at, updated_at, deleted_at, message_provider, parent_organisation_id, user_id, prefix_id, sex_id, nationality_id, company_type_id, first_name, middle_name, last_name, suffix, dob, company_name, company_id, company_vat, company_person, person_type_id, date_of_enrolment, departament, job_title, first_name_phonetic, middle_name_phonetic, last_name_phonetic, suffix_phonetic, company_name_phonetic, company_type_phonetic, company_person_phonetic, prefix_phonetic_id, altitude_units, center_of_gravity_units, distance_units, flow_units, volume_units, geographic_coordinate_units, length_units, pressure_units, temperature_units, time_units, velocity_units, vertical_speed_units, visibility_units, weight_units, wind_speed_units, dashboard_settings, emergency_contact, disabled, solo_current, passangers_current, system_settings_overwrite, avatar_id, debit)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
$user_profile_role_types_q = $dbh->prepare("INSERT INTO `user_profile_role_types` (profile_id,basenom_id) VALUES (?,?);");

$user_contact_q = $dbh->prepare("INSERT INTO `user_contact` (contact_type_id,created_by,updated_by,info1,info2,created_at,updated_at,deleted_at,personalInfo,info3,emergency_contact_bnom_phone_type_id,emergency_contact_bnom_email_type_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
$user_course_q = $dbh->prepare("INSERT INTO `user_course` (course_id,sub_course_id,issue_id,created_by,updated_by,`start`,`end`,finished,created_at,updated_at,deleted_at,personalInfo,revision_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);");

} catch (\Exception $e) {
    print_r($e->getTrace());
    exit;
}

try {
foreach($init as $user => $udt) {
    if (isset($udt['fos_user'])) {
        print_r($udt['fos_user']);
        $fos_user_q->execute($udt['fos_user']);
        $userId = $dbh->lastInsertId();
        // replace __THIS_USERID__ -> $userId
        $udt['user_personal_info'] = replacePlaceholderWithId('__THIS_USERID__', $userId, $udt['user_personal_info']);
        /*
        foreach($udt['user_personal_info'] as $rf => $fldd) {
            if ($fldd == '__THIS_USERID__')
                $udt['user_personal_info'][$rf] = str_replace('__THIS_USERID__', $userId);
        }
        */
        //echo "S: ".sizeof($udt['user_personal_info'])."\n";
        $user_personal_info_q->execute($udt['user_personal_info']);
        $profileId = $dbh->lastInsertId();
        if (isset($udt['user_profile_role_types'])) {
            foreach($udt['user_profile_role_types'] as $uprtd) {
                $user_profile_role_types_q->execute([$profileId, $uprtd]);
            }
        }
        if (isset($udt['user_course'])) {
            foreach($udt['user_course'] as $cd) {
                // replace __THIS_PROFILEID__
                $cd = replacePlaceholderWithId('__THIS_PROFILEID__', $profileId, $cd);
                /*
                foreach($cd as $cdn => $cdd) {
                    if ($cdd == '__THIS_PROFILEID__')
                        $cd[$cdn] = str_replace('__THIS_PROFILEID__', $profileId);
                }
                */
                $user_course_q->execute($cd);
            }
        }
        if (isset($udt['user_contact'])) {
            foreach($udt['user_contact'] as $uc) {
                $uc = replacePlaceholderWithId('__THIS_PROFILEID__', $profileId, $uc);
                $user_contact_q->execute($uc);
            }
        }
    }
}
} catch (\PDOException $e) {
    print_r($e->getMessage());
    print_r($e->getTrace());
    exit;
} catch (\Execption $e) {
    print_r($e->getTrace());
    exit;
}

$dbh->commit();