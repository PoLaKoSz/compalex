<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>COMPALEX - database schema and table rows compare tool</title>
    <link rel="stylesheet" href="public/css/bootstrap.4.4.1.min.css">
    <link rel="stylesheet" href="public/css/style.css">
    <script src="public/js/jquery-3.4.1.slim.min.js" defer></script>
    <script src="public/js/bootstrap.4.4.1.min.js" defer></script>
    <script src="public/js/functional.js" defer></script>
</head>

<body>
<div class="modal-background" onclick="Data.hideTableData(); return false;">
    <div class="modallll">
        <div id="asdasdasd"></div>
    </div>
</div>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="compare-database-block">
    <h1>Compalex</h1>

    <h3>Database schema and table rows compare tool</h3>
    <table class="table">
        <tr class="panel">
            <td>
                <?php
                switch (DRIVER) {
                    case 'mysql':
                        $buttons = array('tables', 'views', 'procedures', 'functions', 'indexes', 'triggers');
                        break;
                    case 'mssql':
                    case 'dblib':
                        $buttons = array('tables', 'views', 'procedures', 'functions', 'indexes');
                        break;
                    case 'pgsql':
                        $buttons = array('tables', 'views', 'functions', 'indexes');
                        break;
                }

                if (!isset($_REQUEST['action'])) $_REQUEST['action'] = 'tables';
                foreach ($buttons as $li) {
                    echo '<a href="index.php?action=' . $li . '"  ' . ($li == $_REQUEST['action'] ? 'class="active"' : '') . '>' . $li . '</a>&nbsp;';
                }
                ?>

            </td>
            <td class="sp">
                <a href="#" onclick="Data.showAll(this); return false;" class="active">all</a>
                <a href="#" onclick="Data.showDiff(this); return false;">changed</a>

            </td>
        </tr>
    </table>
    <table class="table">
        <tr class="header">
            <td width="50%">
                <h2><?php echo DATABASE_NAME ?></h2>
                <span><?php $spath = explode("@", FIRST_DSN);
                    echo end($spath); ?></span>
            </td>
            <td  width="50%">
                <h2><?php echo DATABASE_NAME_SECONDARY ?></h2>
                <span><?php $spath = explode("@", SECOND_DSN);
                    echo end($spath); ?></span>
            </td>
            <td></td>
        </tr>
    <?php foreach ($tables as $tableName => $data) { ?>
        <tr class="data">
            <?php foreach (array('fArray', 'sArray') as $blockType) { ?>
            <td class="type-<?php echo $_REQUEST['action']; ?>">
                <h3><?php echo $tableName; ?> <sup style="color: red;"><?php echo count($data[$blockType]); ?></sup></h3>
                <div class="table-additional-info">
                    <?php if(isset($additionalTableInfo[$tableName][$blockType])) {
                            foreach ($additionalTableInfo[$tableName][$blockType] as $paramKey => $paramValue) {
                                if(strpos($paramKey, 'ARRAY_KEY') === false) echo "<b>{$paramKey}</b>: {$paramValue}<br />";
                            }
                        }
                    ?>
                </div>
                <?php if ($data[$blockType]) { ?>
                    <ul>
                        <?php foreach ($data[$blockType] as $fieldName => $tparam) { ?>
                            <li <?php if (isset($tparam['isNew']) && $tparam['isNew']) {
                                echo 'style="color: red;" class="new" ';
                            } ?>><b><?php echo $fieldName; ?></b>
                                <span <?php if (isset($tparam['changeType']) && $tparam['changeType']): ?>style="color: red;" class="new" <?php endif;?>>
                                    <?php echo $tparam['dtype']; ?>
                                </span>
                            </li>
                        <?php } ?>
                    </ul>
                <?php } ?>
                <?php if (count($data[$blockType]) && in_array($_REQUEST['action'], array('tables', 'views'))) { ?><a
                    target="_blank"
                    onclick="Data.getTableData('index.php?action=rows&baseName=<?php echo $basesName[$blockType]; ?>&tableName=<?php echo $tableName; ?>'); return false;"
                    href="#" class="sample-data">Sample data (<?php echo SAMPLE_DATA_LENGTH; ?> rows)</a><?php } ?>
            </td>
            <?php } ?>
            <td>
                <button type="button" class="btn btn-primary diff-table-rows" data-table-name="<?php echo $tableName; ?>" data-toggle="modal" data-target="#exampleModal">
                    Diff table rows
                </button>
            </td>
        </tr>
    <?php } ?>
    </table>

</div>
</body>
