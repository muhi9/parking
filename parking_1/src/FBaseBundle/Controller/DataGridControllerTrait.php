<?php
namespace FBaseBundle\Controller;

use \Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait DataGridControllerTrait {

    /**
     * Handle request from DataGrid ajax call. Filter, Order, Limit and return class info.
     * @param $request Symfony\Component\HttpFoundation\Request
     * @param $class string Class Entity Name
     * @param $options array defaultOrder=>['id' => 'ASC'],returnDataType=>'object'
     * @return array ['list'=>data, 'totalRows'=>total rows count by criteria without limit, 'displayRows' => table page rows count with limit ]
     * /
     * NOT USED!!!
    public function dataGridBaseHandler(Request $request, $class, array $options) {
        $defaultOpts = [
            'order' => [ 'id' => 'ASC'],
            'returnDataType' => 'array',
            'columns' => 'all',
        ];
        foreach($defaultOpts as $opt => $default) {
            if (!isset($options[$opt]))
                $options[$opt] = $defaultOpts[$opt];
        }


        $offset = 0;
        $limit = 10;
        $search = [];
        $order = $options['order'];

        $qorder = $request->query->get('order');
        $qcolumns = $request->query->get('columns');
        if ($qorder && $qcolumns) {
            $order=[];
            foreach ($qorder as $ord) {
                if (isset($ord['column']) && isset($qcolumns[$ord['column']]['data']))
                $order[$qcolumns[ $ord['column'] ]['data']] = $ord['dir'];
            }
        }
        if ($request->query->get('start') && preg_match('/^[0-9]+$/', $request->query->get('start')))
            $offset = $request->query->get('start');
        if ($request->query->get('lenght') && preg_match('/^[0-9]+$/', $request->query->get('lenght')))
            $limit = $request->query->get('lenght');

        $em = $this->getDoctrine()->getManager();
        $list = $em->getRepository($class);

        $totalRows = $list->findCountBy($search, $order);

        $list = $list->findArrayBy($options['columns'], $search, $order, $limit, $offset);
        return ['list' => $list, 'totalRows' => (int)$totalRows, 'displayRows' => sizeof($list) ];
    }
    public function dataAdd(\Symfony\Component\HttpFoundation\Request $request, $object, array $options) {
       $em = $this->getDoctrine()->getManager();
       $em->persist($object);
       $em->flush();
       return $object;
    }

    public function dataUpdate(\Symfony\Component\HttpFoundation\Request $request, $class, array $options) {


        return ;
    }


    */

    public function dataGridPrepareHandler(Request $request, $class, array $options) {

        $defaultOpts = [
            'order' => [ 'id' => 'ASC'],
            'returnDataType' => 'array',
            'columns' => 'all',
            'full_columns' => [],
            'searchMap'=>[],
            'searchJoin'=>[],
            'isDate'=>[],
            'prepareQuery' => false,
        ];
        foreach($defaultOpts as $opt => $default) {
            if (!isset($options[$opt]))
                $options[$opt] = $defaultOpts[$opt];
        }
        $getData = [];
        if (!empty($options['criteries'])) {
            $getData['criteries'] = $options['criteries'];
        }
//dump($options['criteries']);exit;
        //dump($options);exit;

        $offset = 0;
        $limit = 10;
        $search = [];
        $order = $options['order'];
        $where = $whereDef = [];
        $qorder = $request->query->get('order');
        $qcolumns = $request->query->get('columns');
        $searchJoin = $options['searchJoin'];

//dump($options['searchCustom']);exit;

        if(isset($options['defWhere'])&&!empty($options['defWhere'])){
            foreach ($options['defWhere'] as $key => $value) {
                $search_type = $options['searchMap'][$key]??'eq';
                if(isset($searchJoin[$key])){
                    $getData['join'][$key]['criteries'][$search_type][$searchJoin[$key]] = $value;
                }else{
                    $getData['criteries'][$search_type][$key] = $value;
                }
                /*
                if(is_array($value)){
                    $getData['criteries'][key($value)][$key] = current($value);
                }else{
                    $getData['criteries'][$key] = $value;
                }
                */
            }
        }

//        dump($options);exit;
//        dump($qorder);exit;
//        dump($qcolumns);exit;
        // NO AJAX sorting - handle default sorting! this is used for initial showing the data - not ajax query one
        $topOrd = $order;
        $order = [];
        if (!$qorder && !$qcolumns) {
            $colName = $options['columns'][$options['defaultSorting']['col']];
            //dump($options);exit;
            $idx=0;
            $or = false;
            //dump($topOrd);exit;
            if (isset($options['defaultSorting']['col']))
            foreach($topOrd as $k=>$o) {
                if($idx==$options['defaultSorting']['col']) {
                    $or = $k;
                    break;
                }
                $idx++;
            }
            if($or)
                $order[$or] = $options['defaultSorting']['sort'];
        }
        //dump($order);exit;
        // handle ajax query loading & reordering from ajax!
        if (($qorder && $qcolumns)) {
            $order=[];
            foreach ($qorder as $ord) {
                if (isset($ord['column']) && isset($qcolumns[$ord['column']]['data'])) {
                    //if(isset())
                    $idx=0;
                    $or = false;
                    //dump($topOrd);exit;
                    foreach($topOrd as $k=>$o) {
                        if($idx==$ord['column']) {
                            $or = $k;
                            break;
                        }
                        $idx++;
                    }
                    if(!$or)
                        $or = $qcolumns[ $ord['column'] ]['data'];
                    $order[$or] = $ord['dir'];
                }
            }

        }



        if ($request->query->get('start') && preg_match('/^[0-9]+$/', $request->query->get('start')))
            $offset = $request->query->get('start');

        //limit
        if ($request->query->get('length') && preg_match('/^[0-9]+$/', $request->query->get('length')))
            $limit = $request->query->get('length');

        //search
        if ($request->query->get('search')){
            $search = $request->query->get('search');
//dump($search);exit;
            if(!empty($search['value'])&&isset($options['search'])&&$options['search']!='join'){
            // $where[$options['search']]=$search['value'];
                if (is_array($options['search'])) {
                    foreach ($options['search'] as $svalue) {
                        $getData['criteries']['orLike'][$svalue] = $search['value'].'%';
                    }
                } else {
                    $getData['criteries']['like'][$options['search']] = $search['value'].'%';
                }
            }
            if(!empty($search['value'])&&isset($options['search'])&&isset($options['searchJoin'])&&$options['search']=='join'){
                foreach ($options['searchJoin'] as $k => $f) {
                    $getData['join'][$k]['criteries']['like'][$f] = $search['value'];
                }

            }

        }
//print_r($getData);exit;
//print_r($options);exit;
//dump($options);exit;
//dump($qcolumns);exit;
        if ($qcolumns) {

            foreach ($qcolumns as $qk => $column) {

                if(!empty($column['search']['value'])){
// handle custom searchDataTransformer - transform value from get/post before anything if transformer set

                    //dump($options['full_columns']);exit;
                    if(isset($options['full_columns'][$column['data']]['searchDataTransformer'])) {
                        $qcolumns[$qk]['search']['value'] = call_user_func_array(
                            $options['full_columns'][$column['data']]['searchDataTransformer'],
                            [$column['search']['value'], $column['data'], $options]
                        );
                        $column = $qcolumns[$qk];
                        //dump($qcolumns);exit;
                    }

                    if(!isset($options['searchJoin'][$column['data']])){
                        if(in_array($column['data'], ['status', 'active', 'disabled'])) {
                            $column['search']['value'] = $column['search']['value']=='on'?1:0;
                        }

                        //serach types???
                        if(isset($options['searchMap'][$column['data']])){
                            $search_type = $options['searchMap'][$column['data']];
                            if(!empty($search_type)){
                                $cVal = $this->dataTransform($column,$options);
                                $getData['criteries'][$search_type][$column['data']] = $cVal;
                            }

                        }else{
                            $getData['criteries']['like'][$column['data']] = $column['search']['value'];
                        }
                    }else{
                        $jfield = $column['data'];
                        $jfieldS = $options['searchJoin'][$column['data']];
                        if(isset($options['searchMap'][$column['data']])){

                            $search_type = $options['searchMap'][$column['data']];
                            if($search_type!=''){
                                $getData['join'][$jfield]['criteries'][$search_type][$jfieldS] = $column['search']['value'];
                            }

                        }else{
                            $getData['join'][$jfield]['criteries']['like'][$jfieldS] = $column['search']['value'];
                        }
                    }
                }
            }
            //dump($qcolumns);exit;
        }
//dump($getData);exit;
        //dump($qcolumns);exit;

        if (isset($options['searchJoin']['complex'])) {
            foreach($options['searchJoin']['complex'] as $joinParams) {
                if (isset($joinParams['gridField']) && isset($joinParams['join']) && isset($joinParams['jwhere'])) {
                    //print_r($qcolumns);exit;//[$joinParams['gridField']]);exit;
                    $colOr=False;
                    foreach ($qcolumns as $col) {
                        if ($col['data'] == $joinParams['gridField']) {
                            if (isset($col['search']['value']) && !empty($col['search']['value']) ) {
                                $colOr = true;
                                $getData['join'][$joinParams['join']]['criteries']['orLike'][$joinParams['jwhere']] = $col['search']['value'];
                                // add or
                                unset($getData['criteries']['like'][$col['data']]);
                                $getData['criteries']['orLike'][$col['data']] = $col['search']['value'];
                            }
                            break;
                        }
                    }
                    if (!$colOr) {
                        $getData['join'][$joinParams['join']]['criteries']['like'][$joinParams['jwhere']] = $col['search']['value'];
                    }
                }
            }
        }
        //print_r($getData);exit;
        //print_r($qcolumns);exit;


        
        //if (isset($options['searchCustom']) && $request->get('search')) {
        //dump($qcolumns);exit;
        if (isset($options['searchCustom'])) {
            $customSearches = [];
//dump($options['searchCustom']);
            foreach ($options['searchCustom'] as $gridField => $joins) {
//dump($gridField);dump($joins);exit;
                foreach ($joins as $customJoin) {
//dump($customJoin);
                    if (isset($customJoin['field'])) { //} && isset($customJoin['where'])) {// && isset($customJoin['where']['valSetter'])) {
                        $col = null;
                        if ($qcolumns) {
                            foreach ($qcolumns as $key => $col) {
                                if (isset($col['data']) && $gridField == $col['data']) {
                                    $currcol = $col;
                                    break;
                                }
                            }
                        }
                        $globalSearch = $request->query->get('search');
                        if (isset($globalSearch['value']) && !empty($globalSearch['value'])) {
                            $customJoin['where']['value'] = trim($globalSearch['value']);
                        }
                        if (isset($col['search']['value']) && !empty($col['search']['value']))
                            $customJoin['where']['value'] = trim($col['search']['value']);
                        // if search value is not emply - add join to query
                        if (isset($customJoin['where']['value']) && !empty($customJoin['where']['value'])) {
                            // if slike is set - replace value with slike expression and place {val} as value.
                            if (isset($customJoin['where']['slike']) && !empty($customJoin['where']['slike'])) {
                                $customJoin['where']['value'] = str_replace('{{val}}', $customJoin['where']['value'], $customJoin['where']['slike']);
                            }
                        }
                        if (!isset($customSearches[$gridField]) || !is_array($customSearches[$gridField]))
                            $customSearches[$gridField] = [];
                        $customSearches[$gridField][] = $customJoin;
                    }
                }
            }
            //print_r($customSearches);exit;
            $getData['customSearches'] = $customSearches;
        }
//dump($getData);exit;
//dump($customSearches);exit;
        if (isset($getData['criteries'])) {
            //skip custom join fields - do not add it to where clause
            foreach($getData['criteries'] as $stype => $ar) {
                foreach($ar as $fld => $what) {
                    if (isset($options['searchCustom']) && isset($options['searchCustom'][$fld])) {
//dump($options['searchCustom'][$fld]);exit;
                    unset($getData['criteries'][$stype][$fld]);
//dump($options['criteries']);exit;
                    continue;
                    }
                }
            }
        }

        //$getData['table']= BaseNoms::class;
        //$getData['table']= $class;

        $getData['order'] = $order;
        $getData['limit'] = $limit;
        $getData['offset'] = $offset;
        //$getData['group_by'] = isset($options['group_by']) ? $options['group_by'] : null;
        $getData['group_by'] = isset($options['group_by']) ? $options['group_by'] : ['field'=>'id'];
        if(isset($options['join'])&&!empty($options['join'])){
            foreach ($options['join'] as $key => $value) {
                $jField = is_array($value)?$key:$value;
                $getData['join'][$jField] = $value;
            }
        }
        if(isset($options['criteriesJoin'])&&!empty($options['criteriesJoin'])){
            foreach ($options['criteriesJoin'] as $key => $value) {
                $getData['join'][$key] = ['criteries'=>$value];
            }
        }

        $getData['alias'] = isset($options['alias'])&&!empty($options['alias'])?$options['alias']:'q';


            // remove fields with custom queries so we don't add them automatically in criteries
            if(isset($getData['customSearches'])
                && isset($getData['criteries'])
                && is_array($getData['customSearches'])
                && is_array($getData['criteries'])) {

//dump($getData['customSearches']);dump($getData['criteries']);exit;

                foreach($getData['customSearches'] as $fld => $customS) {
                    if (!is_array($customS)) {
                        $customS = [$customS];
                    }
                    foreach($customS as $cs) {
                        if(isset($cs['field'])) {
                            $fld = $cs['field'];
                            foreach($getData['criteries'] as $stype => &$flds) {
                                if (!is_object($fld) && !is_object($flds) && isset($flds[$fld])) {
                                    unset($flds[$fld]);
                                }
                            }
                        }
                    }
                }
            }


//dump($getData);exit;

        $em = $this->getDoctrine()->getManager();

        $list = $em->getRepository($class)->readList($getData, $options['prepareQuery']);
        $count = $em->getRepository($class)->getCount($getData, $options['prepareQuery']);
        //$count = $em->getRepository($class)->readList($getData,true);
        return ['list'=>$list, 'count'=>$count, 'limit'=>$limit];
    }


    private function dataTransform($column, $options){
        $result = $column['search']['value'];
//dump($column);exit;
        if(isset($options['isDate'][$column['data']])){
            $col = $options['isDate'][$column['data']];
            $time = '';

            if($col=='start'){
                $time = '00:00:00';
            }

            if($col=='end'){
                $time = '23:59:59';
            }

            $result = date('Y-m-d '.$time, strtotime($column['search']['value']));
        }
        return $result;
    }


    /**
     * @param $request Symfony\Component\HttpFoundation\Request
     * @param $entityClass Entity::class OR callback($searchMap, $columns):[] OR ['list'=>[], 'limit'=>(int), 'count'=>(int)]
     * @param $settings [
            'class' => Entity::class,
            OPTIONAL -- 'show_data' => (bool) false = (default) show table and run ajax; true = show table and data;
            OPTIONAL -- 'route' => $request->get('_route'),
            OPTIONAL -- 'columns_search' => (bool) Show search fields for cols,
            OPTIONAL -- 'search' => random usage,
            OPTIONAL -- 'action_links' => [
                // these are handled with only edit=>edit
                OPTIONAL -- 'edit' => URL annotation / callback($key),
                OPTIONAL -- 'delete' => URL annotation / callback($key),
                OPTIONAL -- 'view' => URL annotation / callback($key),
                // add others below. easiest use callback
            ],
            OPTIONAL -- 'datagrid_callback' => [
                OPTIONAL -- 'initComplete' => JS function(settings, json) // https://datatables.net/reference/event/init
                OPTIONAL -- 'rowCallback' => JS function(row, data, displayNum, displayIndex, dataIndex) // https://datatables.net/reference/option/rowCallback
                OPTIONAL -- 'footerCallback' => JS function(tfoot, data, start, end, display) // https://datatables.net/reference/option/footerCallback
                // to add other callbacks, see https://datatables.net/reference/option/
            ],
            OPTIONAL -- 'order' => ['col'=>1, 'sort'=>'ASC'],
            OPTIONAL -- 'slug_field' => $entityClass,
            OPTIONAL -- 'pk_field' => 'id',
            OPTIONAL -- 'searchJoin' => [Join tables]
            OPTIONAL -- 'customSearch' (old searchCustom) => force search definitions (fields[search_type] is not used)
            DEPRECATED -- use fields[search_type] -- 'searchMap' => [Searchable fields=>'eq']
            OPTIONAL -- 'ajax_paremeters' => [get=>parameters]
            OPTIONAL -- 'defWhere' => [Predefined search constrains]
            OPTIONAL -- 'ajaxComplete' => JS
            OPTIONAL -- 'scrollY' =>
            OPTIONAL -- 'ajax_response_append' => Additional AJAX response data
            OPTIONAL -- 'export' => [type of export ('csv') => ['header'=>callback($tableData, $fieldNames):[[]], 'row'=>callback($row, $tableData, $fieldNames):[[]], 'footer'=>callback($tableData, $fieldNames):[[]], 'outputFileName'=>callback($tableData, $fieldNames):string]]
            OPTIONAL -- 'statusStrike' => ['enabled'=>false, 'getter'=>'getStatus']
            OPTIONAL -- 'prepareQuery' => callback(queryBuilder, isListQuery)
            OPTIONAL -- 'rawOptions' => https://datatables.net/manual/index
        ];
     * @param $fields [
            'id' => [
                OPTIONAL -- 'title' => 'ID',
                OPTIONAL -- 'getter' => 'getId',
                OPTIONAL -- 'orderable'=> false,
                OPTIONAL -- 'reorder' => false || save order url - like "order" col in bnoms
                OPTIONAL -- 'target'=> 0,
                OPTIONAL -- 'search'=> searchFields || false,
                OPTIONAL -- 'search_type' => false || 'eq' || ...,
                OPTIONAL -- 'searchDataTransformer' => method - this transforms string from query search when passing it to db
                OPTIONAL -- 'custom_orderKey' => if joined with customJoin you can set column with alias here: f.name
            ]
        ];
     */
    protected function dataTable(Request $request, $entityClass, $settings, $fields) {
       
        $translator = $this->get('translator');
        $reorderColumn = false;
        $callEntityResolver = false;
        $forceDisableActions = false; // disable action_links - automatically when in prodand only 1 link is in cell. automatically assigned to first cell in tbl
        $datagridOrder = empty($settings['order']) ? ['col'=>0, 'sort'=>'ASC'] : $settings['order'];
        $queryOrder = [];
        if (is_object($entityClass)) {
            $callEntityResolver = $entityClass;
            if (get_class($entityClass) == 'Closure') {
                if (!isset($settings['slug_field']) || empty($settings['slug_field'])) {
                    throw new \Exception("Error [DataGridControllerTrait::dataTable]: When using Closure you must set slug_field!", 1);
                } else {
                    // set entityClass = slug so we can have string to pass around
                    $entityClass = $settings['slug_field'];
                }
            } else {
                $entityClass = get_class($entityClass);
            }
            //echo $settings['slug_field'];exit;
        }
        $slug = md5(empty($settings['slug_field']) ? $entityClass : $settings['slug_field']);
        $searchMap = !empty($settings['searchMap']) ? $settings['searchMap'] : [];
        $searchFields = [];
        $searchCols = [];
        $fieldNames = [];
        $custom_column_defs = [];
        if ($this->container->getParameter('kernel.environment') != 'dev') {
            if (isset($fields['id'])) {
                $fields['id']['visible'] = 'false';
            }
        }
        //dump($fields);exit;
        $nextRenderLink = 0;
        $colCounter = 0;
        foreach ($fields as $field=>$conf) {
            $colCounter++;
            $key = $field;
            if (is_numeric($field) && is_string($conf)) {
                $fields[$key] = [];
                $field = $conf;
                $conf = [];
            } elseif (!is_numeric($field) && is_string($conf)) {
                $fields[$key] = $conf = ['title'=>$translator->trans($conf)];
            }
            $fields[$key]['field'] = $field;
            $tmp = ucwords(preg_replace('/\W+/', ' ', $field));
            $fieldNames[$field] = preg_replace('/([^A-Z])([A-Z])/', '$1 $2', empty($conf['title']) ? $translator->trans($tmp) : $translator->trans($conf['title']));
            if (!empty($conf['search'])) {
                if (isset($conf['search_type'])) {
                    if ($conf['search_type'] && $conf['search_type']!='match') {
                        $searchMap[$field] = $conf['search_type'];
                    }
                    unset($conf['search_type']);
                } else {
                    $searchMap[$field] = 'eq';
                }
                $searchCols[] = $field;
                $conf['searchable'] = 'true';
                $searchFields[] = is_array($conf['search']) ? $conf['search'] : ['type'=>'input', 'value'=>null];
            } else {
                $conf['searchable'] = 'false';
                $searchFields[] = ['type'=>null, 'value'=>null];
            }
            if (empty($conf['orderable'])) {
                $conf['orderable'] = 'false';
            } else {
                $conf['orderable'] = 'true';
            }
            if (!empty($conf['reorder'])) {
                $reorderColumn = [
                    'field' => $field,
                    'className' => 'reorder',
                    'url' => call_user_func_array([$this, 'generateUrl'], is_array($conf['reorder']) ? $conf['reorder'] : [$conf['reorder']]),
                ];
                $conf['className'] = '\''.$reorderColumn['className'].'\'';
                $conf['orderable'] = 'true';
            }

            if (empty($conf['getter']) && !(isset($conf['getter']) && false === $conf['getter'])) {
                $fields[$key]['getter'] = 'get'.str_replace(' ', '', $tmp);
                // remove fields with . in it. Below we make inner calls based on path
                if (strstr($key, '.')) {
                    //$fields[$key]['getter'] = $key;
                    $fldProps = $fields[$key];
                    $fldProps['getter'] = $key;
                    $fldProps['field'] = str_replace('.', '_', $key);
                    $fields[str_replace('.', '_', $key)] = $fldProps;
                    unset($fields[$key]);
                }
            }
            //if ($this->container->getParameter('kernel.environment') != 'dev' &&
            if($nextRenderLink && !empty($settings['action_links'])) {
                if (isset($settings['action_links']) && isset($settings['action_links']['edit'])) {
                    if (is_callable($settings['action_links']['edit'])) {
                        $link = call_user_func($settings['action_links']['edit'], 'edit', ['id'=> '____pk_value____']);
                    } else {
                        $link = $this->generateUrl($settings['action_links']['edit'], ['id'=> '____pk_value____']);
                    }
                    if (!isset($conf['render'])) {
                        $conf['render'] = "function (data, type, row, meta) { var link='".$link."'; return '<a href=\"'+link.replace('____pk_value____',row.id)+'\">'+data+'</a>'; }";
                    }
                    if (sizeof($settings['action_links'])==1) {
                        $forceDisableActions = true;
                        //$disableActionsSetting = $this->container->get('settings')->get('settings.grid');
                        if (isset($disableActionsSetting['disableSingleActionLink']) && is_bool($disableActionsSetting['disableSingleActionLink']))
                            $forceDisableActions = (bool) $disableActionsSetting['disableSingleActionLink'];
                        //dump($disableActionsSetting);exit;
                    }
                }
                $nextRenderLink = false;
            }

            if (strtolower($field)=='id') { $nextRenderLink = true;}
            unset($conf['title'], $conf['getter'], $conf['search'], $conf['reorder']);
            $custom_column_defs[$field] = $conf;
//dump($datagridOrder);exit;
            if ($datagridOrder) {
            /*    if(isset($datagridOrder['default'])) {
                    if(isset($datagridOrder['default'][$key])) {
                        $queryOrder[$key] = $datagridOrder['default'][$key];
                    }
                }else{
            */
                    if (isset($datagridOrder['col']) && (isset($conf['orderable']) && $conf['orderable'] == true)) {
                        //dump($custom_column_defs);
                        if (isset($custom_column_defs[$key]['custom_orderKey'])) {
                            $queryOrder[$custom_column_defs[$key]['custom_orderKey']] = $datagridOrder['sort'];
                        } else
                            $queryOrder[$key] = $datagridOrder['sort'];
                    } else {
                        foreach ($datagridOrder as $temp) {
                            if (isset($temp['col']) && $temp['col']==$colCounter) {
                                if (isset($custom_column_defs[$key]['custom_orderKey'])) {
                                  $queryOrder[$custom_column_defs[$key]['custom_orderKey']] = $temp['sort'];
                                } else
                                  $queryOrder[$key] = $temp['sort'];
                            }
                        }
                    }
                //}

            }
        }
//dump($datagridOrder);exit;
//dump($queryOrder);exit;
        if (!empty($settings['search'])) {
            $searchCols = $settings['search'];
        } elseif (!empty($settings['searchJoin'])) {
            $searchCols = 'join';
        }

        $tableData = false;/*[
            "iTotalRecords" => 0,
            "iTotalDisplayRecords" => 0,
            "sEcho" => 0,
            "sColumns" => "",
            "aaData" => [],
        ];*/

        $requestDataExport = $request->get('export') && $request->get('slug')===$slug && !$request->isXmlHttpRequest();
        $requestAjaxResponse = $request->get('slug')===$slug && $request->isXmlHttpRequest();

        if (!isset($settings['show_data']) || !empty($settings['show_data']) || $requestAjaxResponse || $requestDataExport) {
            // XHR ROWS
            // if we have $entityClass Repo fetched - this is entity. Otherwise check what it is.
            // We can pass lambda functions or other methods that can handle returning data.
            $em = $this->getDoctrine()->getManager();
            if (!$callEntityResolver) {
                try {
//                    dump($queryOrder);exit;
                    $entityClassRepo = $em->getRepository($entityClass);
                    $gridOpts = [
                        'searchMap'     => $searchMap,
                        'order'         => $queryOrder,
                        'columns'       => array_keys($custom_column_defs),
                        'full_columns'  => $custom_column_defs,
                        'search'        => empty($settings['customSearch']) ? $searchCols : null,
                        'searchJoin'    => empty($settings['searchJoin']) ? null : $settings['searchJoin'],
                        'join'          => empty($settings['join']) ? null : $settings['join'],
                        'alias'         => empty($settings['alias']) ? null : $settings['alias'],
                        'criteriesJoin' => empty($settings['criteriesJoin']) ? null : $settings['criteriesJoin'],
                        'defWhere'      => empty($settings['defWhere']) ? null : $settings['defWhere'],
                        'criteries'     => empty($settings['criteries']) ? null : $settings['criteries'],
                        'searchCustom'  => empty($settings['customSearch']) ? null : $settings['customSearch'],
                        'isDate'        => empty($settings['isDate']) ? null : $settings['isDate'],
                        'group_by'      => empty($settings['group_by'])?null : $settings['group_by'],
                        'prepareQuery'  => empty($settings['prepareQuery']) || !is_callable($settings['prepareQuery']) ? null : $settings['prepareQuery'],
                    ];
                    if (isset($datagridOrder)) {
                        $gridOpts['defaultSorting'] = $datagridOrder;
                    }
                    $gridData = $this->dataGridPrepareHandler($request, $entityClass, $gridOpts);
                } catch(\Doctrine\Persistence\Mapping\MappingException $e) {
                    /* custom method to handle grid data.
                    $offser = 0;
                    if ($request->query->get('start') && preg_match('/^[0-9]+$/', $request->query->get('start')))
                        $offset = $request->query->get('start');
                    $limit = 10;
                    //limit
                    if ($request->query->get('length') && preg_match('/^[0-9]+$/', $request->query->get('length')))
                        $limit = $request->query->get('length');

                    $list = $em->getRepository($class)->readList($getData);
                    $count = $em->getRepository($class)->getCount($getData);

                    return ['list'=>$list, 'count'=>$count, 'limit'=>$limit];
                    */
                    echo 'error. class dont exists';
                    $gridData = [];
                    exit;
                }
            } else {
                $gridData = call_user_func_array($callEntityResolver,[$request, [
                    'searchMap'     => $searchMap,
                    'columns'       => array_keys($custom_column_defs),
                ]]);
                $gridData = $gridData ?: [];
                if (!isset($gridData['list'])) {
                    $gridData = [
                        'list' => $gridData,
                        'limit' => count($gridData),
                        'count' => count($gridData),
                    ];
                }
                $gridData['limit'] = !isset($gridData['limit']) ? count($gridData['list']) : $gridData['limit'];
                $gridData['count'] = !isset($gridData['count']) ? count($gridData['count']) : $gridData['count'];
            }
            $list = [];
            $strike = false;
            if (isset($settings['statusStrike'])
                && isset($settings['statusStrike']['enabled'])
                && true === $settings['statusStrike']['enabled']
                && isset($settings['statusStrike']['getter'])
            )
                $strike = true;

            //print_r($gridData);exit;
            foreach ($gridData['list'] as $entity) {
                $temp = ['actions' => null];
                $striked = null;
                if (true === $strike && is_callable([$entity, $settings['statusStrike']['getter']])) {
                    if (false == $entity->{$settings['statusStrike']['getter']}())
                        $striked = '<strike>';
                }

                foreach ($fields as $conf) {
                    //echo "D: $conf[field] -> $conf[getter]";
                    //dump($entity);exit;
                    if (is_string($conf['getter'])) {
                        if (strstr($conf['getter'], '.')) {
                            $getters = explode('.', $conf['getter']);
                            //print_r($getters);exit;
                            //dump($getters);exit;
                            $get1 = 'get'.ucfirst($getters[0]);
                            $getit = $entity->{$get1}();
                            array_shift($getters);
                            foreach($getters as $get) {
                                $get1 = 'get'.ucfirst($get);
                                $getit = $getit->{$get1}();
                            }
                            $temp[str_replace('.', '_', $conf['field'])] = $getit;
                        } else {
                            $temp[$conf['field']] = $entity->{$conf['getter']}();
                        }

                    } else if (is_callable($conf['getter'])) {
                        $temp[$conf['field']] = call_user_func($conf['getter'], $entity, $key, $conf);
                    } else {
                        if (false !== $conf['getter'])
                            throw new \Exception("Error finding propper getter: ". $conf['getter'], 1);
                    }
                    if (is_object($temp[$conf['field']]) && $temp[$conf['field']] instanceof \DateTime) {
                        $temp[$conf['field']] = $temp[$conf['field']]->format($this->getParameter('i18n')['date_format_s']);
                    } elseif (is_object($temp[$conf['field']]) && method_exists($temp[$conf['field']], 'getFullNameSpan')) {
                        $temp[$conf['field']] = $temp[$conf['field']]->getFullNameSpan();
                    } elseif (is_array($temp[$conf['field']])) {
                        $temp[$conf['field']] = $temp[$conf['field']];
                    } else {
                        $temp[$conf['field']] = (string)$temp[$conf['field']];
                    }
                    // with current setup field can't have render per row.
                    // only config render method is accepted... each row hold only value
                    //if (isset($conf['render']))
                    //    $temp[$conf['field']] = ['render' => $conf['render']];
                    if (is_string($temp[$conf['field']]) && $striked && $conf['field'] != 'id')
                        $temp[$conf['field']] = $striked . $temp[$conf['field']] . ($striked?'</strike>':null);
                }
                if ($requestDataExport) {
                    $temp['_entity_'] = $entity;
                }
                $list[] = $temp;
            }
            //dump($fields);exit;

            $tableData = [
                "iTotalRecords" => $gridData['limit'],
                "iTotalDisplayRecords" => $gridData['count'],
                "sEcho" => 0,
                "sColumns" => "",
                "aaData" => $list,
            ];
        }

        if($requestDataExport) {
            switch ($request->get('export')) {
                case 'csv':
                default:
                    return $this->exportCSV($tableData, $settings, $entityClass, $fieldNames, $slug);
            }
        } elseif($requestAjaxResponse) {
            return new JsonResponse($tableData + (isset($settings['ajax_response_append']) ? $settings['ajax_response_append'] : []));
        } else {
            // TABLE TEMPLATE
            $action_links = [];
            if (!empty($settings['action_links']) && $forceDisableActions==false) {
                foreach ($settings['action_links'] as $type => $link) {
                    if (is_callable($link)) {
                        $link = call_user_func($link, $type, []);
                    } else {
                        $link = $this->generateUrl($link, ['id'=>'{{{pk_value}}}']);
                    }
                    switch ($type) {
                        case 'edit':
                            $action_links[$type.'_link'] = ['html' => '<a href="'.$link.'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="'.$translator->trans('Edit').'"> <i class="la la-edit"></i></a>'];
                            break;
                        case 'delete':
                            $action_links[$type.'_link'] = ['html' => '<a href="'.$link.'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="'.$translator->trans('Delete').'"> <i class="la la-remove"></i></a>'];
                            break;
                        case 'confirm':
                            $action_links[$type.'_link'] = ['html' => '<a href="'.$link.'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="'.$translator->trans('Confirm').'"> <i class="la la-check"></i></a>'];
                            break;
                        case 'refusal':
                            $action_links[$type.'_link'] = ['html' => '<a href="'.$link.'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="'.$translator->trans('Refusal').'"> <i class="la flaticon-circle"></i></a>'];
                            break;
                        case 'download':
                            $action_links[$type.'_link'] = ['html' => '<a href="'.$link.'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="'.$translator->trans('Download').'"> <i class="la la-download"></i></a>'];
                            break;
                    }
                }
            }

            $ajax_data_url = ['slug' => $slug];
            if (!empty($settings['ajax_paremeters'])) {
                $ajax_data_url += $settings['ajax_paremeters'];
            } elseif (!empty($settings['defWhere'])) {
                $ajax_data_url += ['where' => http_build_query($settings['defWhere'])];
            }


            //cleanup custom_column_defs from method clousers(callbacks) before passing it to tpl.
            foreach($custom_column_defs as $k=>$vcol) {
                if (is_callable($vcol))
                    unset($custom_column_defs[$k]);
                foreach($vcol as $kk=>$vvcol) {
                    if (is_callable($vvcol))
                        unset($custom_column_defs[$k][$kk]);
                }
            }
            $result = [
                'id' => str_replace('\\', '_', $entityClass),
                'name' => $entityClass,
                'order'=> $datagridOrder,
                'slug_field'=> "'$slug'",
                'ajax_data_url' => $this->generateUrl(empty($settings['route']) ? $request->get('_route') : $settings['route'], $ajax_data_url),
                'action_links' =>$action_links,
                'pk_field' => empty($settings['pk_field']) ? 'id' : $settings['pk_field'],
                'fields' => $fieldNames,
                'custom_column_defs' => $custom_column_defs,
                'table_data' => $tableData,
                'datagrid_callback' => empty($settings['datagrid_callback']) || !is_array($settings['datagrid_callback']) ? [] : $settings['datagrid_callback'],
                'rawOptions' => empty($settings['rawOptions']) ? [] : $settings['rawOptions'],
                'reorderColumn' => $reorderColumn,
            ];
            if(sizeof($action_links)==0) $result['disable_actions_column'] = true;

            foreach (['ajaxComplete', 'scrollY'] as $key) {
                if (!empty($settings[$key])) {
                    $result[$key] = $settings[$key];
                }
            }

            if (empty($searchCols) && empty($settings['customSearch'])) {
                $result['searching'] = false;
            } elseif (!empty($settings['columns_search'])) {
                $result['searchFields'] = $searchFields;
            }
//dump($result);exit;
            return $result;
        }
    }


    private function exportCSV($tableData, $settings, $entityClass, $fieldNames, $slug) {
        $output   = fopen("php://memory", 'w');
//        fwrite($output, '<pre>');

        // output headers
        if (!empty($settings['export']['csv']['header']) && is_callable($settings['export']['csv']['header'])) {
            $temp = $settings['export']['csv']['header']($tableData, $fieldNames);
        } else {
            // col names are default
            $temp = [array_values($fieldNames)];
        }

        foreach ($temp as $row) {
            fputcsv($output, $row);
        }

        // output rows
        if (!empty($settings['export']['csv']['row']) && is_callable($settings['export']['csv']['row'])) {
            foreach ($tableData['aaData'] as $row) {
                $temp = $settings['export']['csv']['row']($row, $tableData, $fieldNames);
                foreach ($temp as $row) {
                    fputcsv($output, $row);
                }
            }
        } else {
            // col names are default
            foreach ($tableData['aaData'] as $row) {
                $temp = [];
                foreach ($fieldNames as $field=>$name) {
                    if ($field!='actions') {
                        $temp[] = strip_tags($row[$field]);
                    }
                }
                fputcsv($output, $temp);
            }
        }


        // output footers
        if (!empty($settings['export']['csv']['footer']) && is_callable($settings['export']['csv']['footer'])) {
            $temp = $settings['export']['csv']['footer']($tableData, $fieldNames);
        } else {
            // no default footer
            $temp = [];
        }

        foreach ($temp as $row) {
            fputcsv($output, $row);
        }

        //$length = ob_get_length();
        $length = fstat($output);
        $length = $length['size'];
        rewind($output);
        $buf = stream_get_contents($output);
        fclose($output);

        if (!empty($settings['export']['csv']['outputFileName'])) {
            if (is_callable($settings['export']['csv']['outputFileName'])) {
                $outputFileName = $settings['export']['csv']['outputFileName']($tableData, $fieldNames);
            } else {
                $outputFileName = $settings['export']['csv']['outputFileName'];
            }
        } else {
            $outputFileName = substr($entityClass, strrpos($entityClass, '\\')+1);
        }

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename='.$outputFileName.'.csv');
        header('Expires: 0');
        header('Cache-Control: no-cache');
        header('Content-Length: '.$length);
        //$c = ob_get_flush();
        //ob_end_clean();
        echo $buf;
        exit;
    }

    /**
     *  @param string $document - the whole html string to be saved and generated as pdf
     *  @param string $fileName - file name to be downloaded as. ONLY Filename part - no .pdf or path
     *  @return Response
     *  @throws Exception 1422 - missing wkhtmltopdf installed; 1423 - html saving failed/file not found; 1424 - pdf file saving failed/file not found; 1000 - common error on last line - shoudn't reach it never
     */
    public function generatePdf($document, $fileName, $download = false, $header = '', $footer = '', $title = '', $landscape = false, $pageSize = 'A4'){

        $fileBase = uniqid($fileName, true);
        $htmlFile = sys_get_temp_dir() . '/' . $fileBase . '.html';
        $pdfFile = sys_get_temp_dir() . '/' . $fileBase . '.pdf';

        if (!file_exists('/usr/local/bin/wkhtmltopdf') && !file_exists('/usr/bin/wkhtmltopdf')) {
            throw new \Exception("'wkhtmltopdf executable not found.Please install wkhtmltox deb package from APPROOT/libs/'", 1422);
        }
        file_put_contents($htmlFile, $document);
        if (trim($header)) {
            $headerFile = str_replace('.html', '.header.html', $htmlFile);
            file_put_contents($headerFile, $header);
            $header = '--header-html "'.$headerFile.'"';
        }
        if (trim($footer)) {
            $footerFile = str_replace('.html', '.footer.html', $htmlFile);
            file_put_contents($footerFile, $footer);
            $footer = '--footer-html "'.$footerFile.'"';
        }
        if (file_exists($htmlFile)) {
            $bin = '/usr/local/bin/wkhtmltopdf';
            if(file_exists('/usr/bin/wkhtmltopdf')) $bin = '/usr/bin/wkhtmltopdf';
            $orientation = '--orientation ' . ($landscape ? 'Landscape' : 'Portrait');
            $pageSize = '--page-size ' . $pageSize;
            $title = trim($title) ? '--title "'.escapeshellcmd($title).'"' : '';
            $cmd = ("$bin $pageSize $orientation $title $header $footer --enable-local-file-access --print-media-type ".str_replace(" ", "\\ ",escapeshellcmd($htmlFile))." ".str_replace(" ", "\\ ",escapeshellcmd($pdfFile)));
            //echo $cmd;exit;
            system($cmd);
            if (file_exists($pdfFile)) {
                // Generate response
                $response = new Response();

                // Set headers
                $download = $download ? 'attachment' : 'inline';
                $response->headers->set('Cache-Control', 'private');
                $response->headers->set('Content-type', mime_content_type($pdfFile));
                $response->headers->set('Content-Disposition', $download.'; filename="' . basename($fileName . '.pdf') . '";');
                $response->headers->set('Content-length', filesize($pdfFile));

                // Send headers before outputting anything
                $response->sendHeaders();

                $response->setContent(file_get_contents($pdfFile));
            } else {
                $exception = ['PDF file not found: ' . $pdfFile, 1424];
            }
        } else {
            $exception = ['HTML file not found: ' . $htmlFile, 1423];
        }

        @unlink($htmlFile);
        @unlink($pdfFile);
        if (isset($headerFile)) {
            @unlink($headerFile);
        }
        if (isset($footerFile)) {
            @unlink($footerFile);
        }
        if (isset($exception)) {
            throw new \Exception($expression[0], $expression[1]);
        }
        return $response;
    }
}
