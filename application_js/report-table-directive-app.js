var reportTable = angular.module('reportTable', []);
function unSelect(element) {
    if ($(element).parent('tr').hasClass('selected'))
        $(element).parent('tr').toggleClass('selected')
    else {
        $('tr').removeClass('selected');
        $(element).parent('tr').addClass('selected')

    }

}

reportTable.directive('reportTablerow', function () {
    return {
        restrict: 'AE',

        template: '',
        controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
            var strTemplate = '';
            var strHideTemplate = '';
            var counter = ''
            var strRowTemplate = '<tr id="hiddenRow' + $scope.$index + '-child" class="hiddenRow collapse"><td colspan="9"><div class="inner-div">';
            angular.forEach($scope.modifyColumns, function (column, index) {
                if (column.template) {
                    if (column.hideData) {
                        strHideTemplate += '<span class="hidden-data hidden-span">' + '<label class=" pure-u-1-2 hidden-column-label"><b>' + column.label + '</b></label>' + '<label class=" pure-u-1-2 hidden-column-data"> ' + (($scope.record[column.name]) ? $scope.record[column.name] : '</label>') + '</span>';
                        /*counter++
                        if (counter === 1) {
                            strHideTemplate += '<br /><br />'
                            counter = 0;
                        }*/
                    }
                    strTemplate += '<td class="table-cell ' + ((column.showAlways) ? 'showonmobile' : '') + ' ' + ((column.hideData) ? 'hide-row' : '') + '" onclick="unSelect(this);" id=' + column.label + '   ><span class="pure-u-1-2 mobile-header"><b>' + column.mobileHeader + '</b></span><span class="pure-u-1-2 mobile-data">' + column.template + '</span></td>';
                }
                else {
                    if (column.hideData) {
                        strHideTemplate += '<span class="hidden-data hidden-span">' + '<label class=" pure-u-1-2 hidden-column-label"><b>' + column.label + '</b></label>' + '<label class=" pure-u-1-2 hidden-column-data">' + (($scope.record[column.name]) ? $scope.record[column.name] : '</label>') + '</span>';
                        /*counter++;
                        if (counter === 1) {
                            strHideTemplate += '<br /><br />'
                            counter = 0;
                        }*/
                    }
                    strTemplate += '<td class="table-cell ' + ((column.showAlways) ? 'showonmobile' : '') + ' ' + ((column.hideData) ? 'hide-row' : '') + '" onclick="unSelect(this);" id=' + column.label + '  ><span class="pure-u-1-2 mobile-header"><b>' + column.mobileHeader + '</b></span><span class="pure-u-1-2 mobile-data">' + (($scope.record[column.name]) ? $scope.record[column.name] : '') + '</span></td>';
                }
            });
            strRowTemplate += strHideTemplate;
            strRowTemplate += '</div></td></tr>';
            $element.append(strTemplate);
            $element.attr('id', 'hiddenRow' + $scope.$index);
            $compile($element.contents())($scope);
            $element.after(strRowTemplate);
            $compile($('.hiddenRow').contents())($scope);
            $scope.call = function (fn) {
                fn();
            }
            $('.inner-div').mCustomScrollbar({
                scrollButtons: { enable: true },
                scrollbarPosition: "inside",
                updateOnContentResize: true
            });
            $scope.toggleDetail = function (id) { 
                $.each($('.responsive tbody tr:odd'), function (key, data) {
                    if ((data.id != id + "-child") && !($(data).hasClass('collapse'))) {
                        $(data).addClass('collapse');
                    }
                });
                if ($("#" + id + "-child").hasClass('collapse')) {
                    $("#" + id + "-child").removeClass('collapse');
                }
                else {
                    $("#" + id + "-child").addClass('collapse');
                }
            };
            $scope.toggelFunction = function (rowData, $index, event) {
                if (!$scope.$parent.$parent.toggelTrigger) {
                    $scope.$parent.$parent.showProjects(rowData, $index);
                } else {
                    $scope.toggleDetail(event.currentTarget.id);
                }
            }
        }],
    }
});

reportTable.directive('reportTable', function () {
    return {
        restrict: 'AE',
        scope: {
            columns: '=columns',
            sortorder: '=sortorder',
            object: '=object',
            getdata: '&getdata'
        },

        template: '\
				<div id="enzi-table-id" class="table-function" style="text-align: right;margin-bottom: 10px;">\
					<input type="search" ng-change="searchTextKeyup(currentPage)" ng-model="keyword" style="float:left" placeholder="Search">\
					<div class="pager pure-u-1-2">\
						<nav class="pagination pure-g">\
							<div class="page-number-block pure-u-1-2">\
								<b>Records Per Page: </b><select class="pagesize ng-pristine ng-untouched ng-valid" ng-model="pageSize" ng-change="callGetDataFunction(1)">\
									<option selected="selected" value="10">10</option>\
									<option value="20">20</option>\
									<option value="30">30</option>\
									<option value="40">40</option>\
								</select>\
							</div>\
							<div class="nav-block pure-u-1-2">\
								<a class="first nav-icon" ng-click="checkPaginationEndPoint(1)"><<</a>\
								<a class="prev nav-icon" ng-click="addPage(-1)"><</a>\
								<!-- <div class="pagedisplay">{{currentPage}}/{{pageCount}}</div> -->\
								<div class="pagedisplay">\
									<select class="pagesize" ng-model="selectedPage" ng-options="page as page for page in totalPages" ng-change="goToPage(selectedPage)">\
									</select>\
								</div>\
								<a class="nav-icon" ng-click="addPage(1)">></a>\
								<a class="nav-icon" ng-click="checkPaginationEndPoint(pageCount)">>></a>\
							</div>\
						</nav>\
					</div>\
				</div>\
				<div class="corp-rpt-tbl">\
					<div class="table-div">\
						<table class="table list attachments responsive" id="report-table">\
							<thead>\
								<tr class="headerRow table-header">\
									<th ng-class="{\'hide-row\': column.hideData}" class="head-cell" name="{{column.name}}" disableSort={{column.disableSort}} ng-repeat="column in columns" onclick="toggleHeaderSign(this);" ng-click="sort($event)">{{column.label}}<span ng-class="{\'arrow\': !column.disableSort, \'sortable\': column.disableSort}"></span><i style="font-size: 10px;" class="glyphicon"></i></th>\
								</tr>\
							</thead>\
							<tbody>\
								<tr ng-repeat="record in pagedRecords" report-tablerow="record" columns="modifyColumns" index="$index" ng-click="toggelFunction(record,$index,$event)">\
								</tr>\
							</tbody>\
						</table>\
					</div>\
					<div class="table-function" style="text-align: right;margin-bottom: 10px;">\
					<div class="pager pure-u-1-2">\
						<nav class="pagination pure-g">\
							<div class="page-number-block pure-u-1-2">\
								<b>Records Per Page: </b><select class="pagesize ng-pristine ng-untouched ng-valid" ng-model="pageSize" ng-change="callGetDataFunction(1)">\
									<option selected="selected" value="10">10</option>\
									<option value="20">20</option>\
									<option value="30">30</option>\
									<option value="40">40</option>\
								</select>\
							</div>\
							<div class="nav-block pure-u-1-2">\
								<a class="first nav-icon" ng-click="checkPaginationEndPoint(1)"><<</a>\
								<a class="prev nav-icon" ng-click="addPage(-1)"><</a>\
								<!-- <div class="pagedisplay">{{currentPage}}/{{pageCount}}</div> -->\
								<div class="pagedisplay">\
									<select class="pagesize" ng-model="selectedPage" ng-options="page as page for page in totalPages" ng-change="goToPage(selectedPage)">\
									</select>\
								</div>\
								<a class="nav-icon" ng-click="addPage(1)">></a>\
								<a class="nav-icon" ng-click="checkPaginationEndPoint(pageCount)">>></a>\
							</div>\
						</nav>\
					</div>\
				</div>\
				</div>',
        controller: function ($scope, $rootScope, $attrs, $filter, $timeout, $compile, $element) {
            $scope.records = [];
            $scope.currentPage = 0;
            $scope.selectedPage = 1;
            $scope.sortOrderCopy = angular.copy($scope.sortorder);
            $scope.pageCount = 1;
            $scope.pageSize = 10;
            $scope.pagedRecords = [];
            $scope.pagedRecordsToExport = [];
            $scope.sortAsc = true;
            $scope.totalRecordsCount = -1;
            $scope.searchRecords = [];
            $scope.isDataComeFromServer = false;
            $scope.barrier = 1000;
            $scope.totalRecordsCount = $scope.barrier + 1;
            $scope.searchTotalRecordsCount = $scope.barrier + 1;
            $scope.keyword = "";
            $rootScope.$on('update', function (event, argRecord) {
                angular.forEach($scope.getObjectValue(argRecord), function (record) {
                    if (getIndex($scope.records, record.Id) != -1)
                        $scope.records[getIndex($scope.records, record.Id)] = record;
                    if (getIndex($scope.pagedRecords, record.Id) != -1)
                        $scope.pagedRecords[getIndex($scope.pagedRecords, record.Id)] = record;
                });
                $scope.records = angular.copy($scope.records);
                $scope.pagedRecords = angular.copy($scope.pagedRecords);
                $scope.$apply();
            });

            function getIndex(arrObj, objId) {
                var foundItem = $filter('filter')(arrObj, { Id: objId }, true)[0];
                var iIndex = arrObj.indexOf(foundItem);
                return iIndex;
            }

            $scope.$on('refreshReportData', function (e) {
                $scope.pagedRecords = $scope.$parent.reportData;
            });
            $scope.addPage = function (iCount) {
                $scope.checkPaginationEndPoint($scope.currentPage + iCount);
                $('#load-spinner').hide();
            }
            $scope.goToPage = function (pageNumber) {
                $scope.checkPaginationEndPoint(Number(pageNumber));
            }
            $scope.totalPages = [];
            $scope.$watch('pageCount', function () {
                if ($scope.pageCount > 0) {
                    $scope.totalPages = [];
                    for (var i = 1; i <= $scope.pageCount; i++)
                        $scope.totalPages.push(i);
                }
            })

            $scope.modifyColumnsName = function () {
                String.prototype.replaceAll = function (s, r) { return this.split(s).join(r) }
                $scope.modifyColumns = [];
                if ($scope.columns) {
                    $scope.modifyColumns = angular.copy($scope.columns);
                    angular.forEach($scope.modifyColumns, function (column) {
                        column.name = column.name.replaceAll(".", "_");
                    })
                }
            }


            $scope.setPage = function (iPage, iTotalCount) {
                var filteredRecords = $filter('filter')($scope.recordsToProcess, $scope.keyword)//$scope.filterRecord($scope.recordsToProcess, $scope.keyword, $scope.modifyColumns);//$filter('filterRelationalData')($scope.records, $scope.keyword, $scope.columns);
                if (filteredRecords && filteredRecords.length >= 0)
                    $scope.pageCount = Math.ceil(((iTotalCount) ? (iTotalCount == $scope.recordsToProcess.length) ? filteredRecords.length : iTotalCount : filteredRecords.length) / $scope.pageSize);//Math.ceil((($scope.records.length >= ((iTotalCount) ? iTotalCount : $scope.totalRecordsCount)) ? filteredRecords.length : ((iTotalCount) ? iTotalCount : $scope.totalRecordsCount)) / $scope.pageSize);
                else
                    $scope.pageCount = 0;

                if ($scope.pageCount == 0)
                { $scope.currentPage = 1; $scope.pagedRecords = []; return; }
                if (iPage > $scope.pageCount)
                    iPage = $scope.pageCount;
                else if (iPage <= 0)
                    iPage = 1;
                if ($scope.pageCount == 0)
                    $scope.pageCount = 1;
                if (iPage > 0 && iPage <= $scope.pageCount) {
                    $scope.currentPage = iPage;
                    $scope.selectedPage = iPage;
                    $scope.pagedRecords = ($scope.isDataComeFromServer) ? filteredRecords : $filter('orderBy')(filteredRecords, $scope.sortBy, !$scope.sortAsc).splice((iPage - 1) * $scope.pageSize, $scope.pageSize);
                    $.each($scope.pagedRecords, function (index, data) {
                        if (data.Join_Date__c != undefined) {
                            data.Join_Date__c = $.datepicker.formatDate('mm/dd/y', new Date(new Date(data.Join_Date__c)));
                        }
                    })
                }
            }
            $scope.sort = function (e) {
                var field = $(e.currentTarget).attr('name');
                var disableSort = $(e.currentTarget).attr('disableSort');
                if (disableSort != 'true') {
                    if ($scope.sortBy == field)
                        $scope.sortAsc = ($scope.sortAsc) ? false : true;
                    else {
                        $element.find('i').removeClass('glyphicon-arrow-up glyphicon-arrow-down')
                        $scope.sortAsc = true;
                        $scope.sortBy = field;
                    }
                    $(e.currentTarget).find('i').removeClass('glyphicon-arrow-up glyphicon-arrow-down').addClass(($scope.sortAsc) ? 'glyphicon-arrow-up' : 'glyphicon-arrow-down');
                    $scope.sortOrderCopy = [];
                    $scope.sortOrderCopy = [{ name: field, direction: ($scope.sortAsc) ? 'asc' : 'desc' }];
                    var isTolatRecord = ($scope.keyword) ? $scope.searchTotalRecordsCount <= $scope.searchRecords.length : $scope.totalRecordsCount <= $scope.records.length;
                    if (!isTolatRecord)
                        $scope.callGetDataFunction($scope.currentPage);
                    else
                        $scope.setPage($scope.currentPage);
                }
            }

            $scope.callGetDataFunction = function (page) {
                $scope.isDataComeFromServer = false;
                if ($scope.records.length < $scope.totalRecordsCount) {
                    if (($scope.keyword.indexOf($scope.previousKeyword) != -1 && $scope.searchRecords.length == $scope.searchTotalRecordsCount)) {
                        $scope.recordsToProcess = angular.copy($scope.searchRecords);
                        $scope.setPage(page);
                    }
                    else {
                        $scope.searchRecords = [];
                        var isTolatRecord = ($scope.keyword) ? $scope.searchTotalRecordsCount <= $scope.barrier : $scope.totalRecordsCount <= $scope.barrier;
                        $scope.getdata({
                            callback: function (data, columns) {
                                $scope.columns = columns.column;
                                $scope.records = data.Data;
                                $scope.modifyColumnsName();
                                $scope.pagedRecordsToExport = data.Data;
                                if ($scope.records) {
                                    $scope.records = $scope.getObjectValue($scope.records);
                                }
                                $scope.recordsToProcess = angular.copy($scope.records);

                                if ($scope.keyword) {
                                    $scope.searchTotalRecordsCount = data.TotalCount;
                                    $scope.searchRecords = angular.copy($scope.records);
                                }
                                else
                                    $scope.totalRecordsCount = data.TotalCount;
                                $scope.isDataComeFromServer = true;
                                if ($scope.records.length >= $scope.totalRecordsCount || $scope.records.length >= $scope.searchTotalRecordsCount)
                                    $scope.isDataComeFromServer = false;
                                $scope.setPage(page, ($scope.keyword) ? $scope.searchTotalRecordsCount : $scope.totalRecordsCount);
                                $scope.$apply();
                            }
                        });
                    }
                }
                else {
                    $scope.recordsToProcess = angular.copy($scope.records);
                    $scope.setPage(page);
                }
            }

            $scope.searchTextKeyup = function (page) {
                if ($scope.timer)
                    $timeout.cancel($scope.timer);
                $scope.timer = $timeout(function () {
                    if ($scope.keyword.indexOf($scope.previousKeyword) >= 0) {
                        if ($scope.searchTotalRecordsCount != $scope.searchRecords.length)
                            $scope.callGetDataFunction(page);
                        else {
                            $scope.recordsToProcess = angular.copy($scope.searchRecords);
                            $scope.isDataComeFromServer = false
                            $scope.setPage(page);
                        }
                        $scope.previousKeyword = $scope.keyword;
                    }
                    else {
                        $scope.callGetDataFunction(page);
                        $scope.previousKeyword = $scope.keyword;
                    }
                }, 800);
            }

            $scope.checkPaginationEndPoint = function (page) {

                if (page <= 0) {
                    $scope.currentPage = 1;
                    return;
                }
                if (page >= $scope.pageCount + 1) {
                    $scope.currentPage = $scope.pageCount;
                    return;
                }

                if ($scope.currentPage == page) {
                    $scope.currentPage = page;
                    return;
                }
                $scope.callGetDataFunction(page);
            }

            $scope.callGetDataFunction(1);

            $scope.getObjectValue = function (records) {
                if (records && records.length > 0) {
                    angular.forEach(records, function (record) {
                        angular.forEach($scope.columns, function (column) {
                            if (column.name) {
                                var arrSplitField = column.name.split(".");
                                if (arrSplitField.length > 1) {
                                    var recordCopy = angular.copy(record);
                                    angular.forEach(arrSplitField, function (field) {
                                        if (recordCopy)
                                            recordCopy = recordCopy[field];
                                    });
                                    record[arrSplitField.join('_')] = recordCopy;
                                }
                            }
                        })
                    })
                }
                return records;
            }

            $scope.filterRecord = function (recordsToBeFilter, strKeyword, columns) {
                var recordRet = [];
                if (strKeyword) {
                    angular.forEach(recordsToBeFilter, function (record) {
                        var flag = false;
                        for (var iIndex = 0; iIndex < columns.length; iIndex++) {
                            var datafield = columns[iIndex]
                            $scope.filteredData = record[datafield.name];
                            if ($scope.filteredData) {
                                if ($.type($scope.filteredData) != "string")
                                    $scope.filteredData = $scope.filteredData + "";
                                if (angular.lowercase($scope.filteredData).indexOf(angular.lowercase(strKeyword) || '') != -1) {
                                    recordRet.push(record);
                                    break;
                                }
                            }
                        }
                    });
                }
                else
                    return recordsToBeFilter;
                return recordRet;
            };
        }
    };
})