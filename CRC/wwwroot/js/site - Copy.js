function returnCables() {
    return $("#cabletypes").dxSelectBox("instance");
}

function returnDevices() {
    return $("#devicetypes").dxSelectBox("instance");
}

function onCableValChange(e, options) {
    console.log('onCableValChange');
   
    if (e.value !== null) {
        var other = returnDevices();
        other.option("value", null);
        other.reset();
    }
}

function onDeviceValChange(e, options) {
    console.log('onDeviceValChange');
   
    if (e.value !== null) {
        var other = returnCables();
        other.option("value", null);
        other.reset();
    }
}

function showNotify(value) {
    DevExpress.ui.notify("The \"" + value + "\" button is clicked.");
}

//// static objects; to be replaced
//// main layout:: HIGH, MID, LOW, XMIITHIGH, XMITLOW
var defaultcontact = [{ id: 0, text: "TAP", high: 100, mid: 100, low: 100, xmitHigh: 100, xmitLow: 100 }];
var sumtotal = [{ id: 9999, text: "FINAL", high: 0, mid: 0, low: 0, xmitHigh: 0, xmitLow: 0 }];
//var newcontact = [{id: 10, text: "device", high: 100, mid: 100, low: 100, xmitHigh: 100, xmitLow: 100 }];
var contacts = [
    //{ id: 1, text: "device1", high: valRand(), mid: valRand(), low: valRand(), xmitHigh: valRand(), xmitLow: valRand() },
    //{ id: 2, text: "device2", high: valRand(), mid: valRand(), low: valRand(), xmitHigh: valRand(), xmitLow: valRand() },
    //{ id: 3, text: "device3", high: valRand(), mid: valRand(), low: valRand(), xmitHigh: valRand(), xmitLow: valRand() },
];

//// store for inserting/deleting
var store = new DevExpress.data.ArrayStore({
    key: "id",
    data: contacts
});

//// global var for inserting/deleting
var selectedRowIndex = -1,
    selectedRow;

var selectionChanged = function (e) {
    selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);

    $("#action-remove").dxSpeedDialAction("instance").option("visible", selectedRowIndex !== -1);
    $("#action-edit").dxSpeedDialAction("instance").option("visible", selectedRowIndex !== -1);
}

//// generic helpers
var getList = function (sel) {
    return $("#list").dxList("instance");
}
var getDS = function () {
    return getList().option("dataSource");
}
//var getLen = function () {
//    return getDS().length
//}

function valRand() {
    var min = 0;
    var max = 4;
    var random = Math.random() * (+max - +min) + +min;
    return Math.round(random * 10) / 10
}

//// specifying context menu items
var topSheetItems = [
    //{ text: "Add Cable Type" },
    //{ text: "Add Passive Device" },
    //{text: "Duplicate" },
    //{text: "Delete" },
    { text: "Clear All" },
    { text: "Start Over" }
];

//// specifying context menu items
var actionSheetItems = [
    //{text: "Add Cable Type" },
    //{text: "Add Passive Device" },
    { text: "Edit Length" },
    { text: "Duplicate" },
    { text: "Delete" },
    { text: "Clear All" },
    { text: "Start Over" }
];


//// increment over max id;  if one doesnt exist, create one
var getNextID = function () {
    //var items = getList().option("dataSource"); //getDS; //.push(newcontact);
    var items = getDS();
    console.log('getNextID');
    //console.log(items);
    if (items) {
        console.log('items exist')
        console.log(items)
        var maxId = Math.max.apply(Math, items.map(function (o) { return o.id; }))
        if (maxId < 0 || !maxId) {
            console.log('max <0 or maxid null: ' + maxId)
            return 0 + 1;
        } else {
            console.log('found max: ' + maxId)
            return maxId + 1
        }
    } else {
        console.log('no items')
        return 1;
    }
}

//// clone the row for duplicate
function copyRow(src) {
    return Object.assign({}, src);
}

//// adding a new static row
var addItem = function (type, obj) {
    console.log('addItem');
    console.log(type);
    console.log(obj);
    console.log(store);

    var newid = getNextID()
    //console.log(getNextID());

    var newRow = { id: newid, text: type, type: obj.type, high: obj.high, mid: obj.mid, low: obj.low, xmitHigh: obj.xmitHigh, xmitLow: obj.xmitLow };
    //var newRow = { id: getNextID(), text: type, high: valRand(), mid: valRand(), low: valRand(), xmitHigh: valRand(), xmitLow: valRand() };

    console.log('finished with row')

    store.insert(newRow)
        .done(function (values, key) {
            console.log('done')
        })
        .fail(function (error) {
            console.log('error')
            console.log(error)
        });

    var items = getList().option("dataSource"); //getDS; //.push(newcontact);
    console.log('item result');
    console.log(items);
    console.log(store);
    getList().reload();
}

//// remove the selected row
var removeItem = function (row) {
    var Rowid = selectedRow.itemData.id;

    store.remove(Rowid)
        .done(function (key) {
        })
        .fail(function (error) {
        });
    getList().reload();
}

//// remove the selected row
var removeAll = function () {
    var items = getDS(); //.push(newcontact);

    if (items) {
        items.forEach(function (item, index, object) {
            setTimeout(() => {
                store.remove(item.id)
                    .done(function (key) {
                        getList().reload();
                    })
                    .fail(function (error) {
                    });
            }, index * 50);
        });
    }
}

////
var recalc = function () {
    var items = getDS(); //.push(newcontact);

    //var start = $('#defaultlist').dxDataGrid("instance");
    var start = $('#defaultlist').dxList("instance");
    var dsGet = start.getDataSource();
    var dsStart = start.option("dataSource");
    console.log('recalc = function')
    console.log(start)
    console.log(dsGet)
    console.log(dsStart)
    console.log(start._itemsCache[0])
    //console.log(dsStart._array[0])
    //console.log(dsStart[0])

    var obj = start._itemsCache[0];
    //var obj = dsStart._array[0];

    if (obj) { //dsStart[0]
        console.log('obj exists, calc')

        startHigh = obj.high;
        startMid = obj.mid;
        startLow = obj.low;
        startXmitHigh = obj.xmitHigh;
        startXmitLow = obj.xmitLow;

        if (items) {
            console.log('items')
            console.log(items)
            items.forEach(function (item, index, object) {

                var length = 1;

                if (item.type == "Cable") {
                    length = (item.length ? item.length : 0) / 100
                }

                startHigh -= item.high * length;
                startMid -= item.mid * length;
                startLow -= item.low * length;
                startXmitHigh -= item.xmitHigh * length;
                startXmitLow -= item.xmitLow * length;
            });

            //var total = $('#sumtotal').dxDataGrid("instance");
            var total = $('#sumtotal').dxList("instance");
            var dsTotal = total.option("dataSource");

            dsTotal[0].high = Math.round(startHigh * 10) / 10;
            dsTotal[0].mid = Math.round(startMid * 10) / 10; //startMid;
            dsTotal[0].low = Math.round(startLow * 10) / 10; //startLow;
            dsTotal[0].xmitHigh = Math.round(startXmitHigh * 10) / 10; //startXmitHigh;
            dsTotal[0].xmitLow = Math.round(startXmitLow * 10) / 10; //startXmitLow;

            //total.refresh();
            total.reload();
        }
    }
}

//// duplicate the selected row; increment the max ID by 1
var duplicateItem = function (row) {
    var newRow = copyRow(row.itemData);
    var items = getList().option("dataSource"); //getDS; //.push(newcontact);
    var maxId = Math.max.apply(Math, items.map(function (o) { return o.id; }))
    newRow.id = maxId + 1;

    store.insert(newRow)
        .done(function (key) {
        })
        .fail(function (error) {
        });
    getList().reload();
}


////// button click handling
//function handleItem(btn) {
//    var btnName = btn.itemData.text
//    switch (btnName) {
//        case "Add Cable Type":
//            addItem('Cable Type Model');
//            break;
//        case "Add Passive Device":
//            addItem('Device Type Model');
//            break;
//        case "Duplicate":
//            duplicateItem(selectedRow);
//            break;
//        case "Edit Length":
//            showLength(selectedRow);
//            break;
//        case "Delete":
//            removeItem(selectedRow);
//            break;
//        case "Clear All":
//            removeAll();
//            break;
//        case "Start Over":
//            location.reload();
//            break;
//        default:
//        // code block
//    }
//}

function getTextBox() {
    console.log('getTextBox()')
    console.log($('#cablelengths').dxTextBox('instance'));
    return $('#cablelengths').dxTextBox('instance');
}

var cableLength = null,
    updateRow = null;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$(function () {

    //// popup loading information
    var employee = {},
        popup = null,
        form = null,
        popupOptions = {
            width: 300,
            height: 250,
            contentTemplate: function () {
                return $("<div />").append(
                    //        //deviceTypes
                    //        $("#device-types").dxSelectBox({
                    //            displayExpr: "text",
                    //            valueExpr: "id",
                    //            items: contacts,
                    //            itemTemplate: function (data) {
                    //                return "<div class='product-name'>" + data.text + "</div>";
                    //            }
                    //        })
                    $("<div id='htmlhere'></div>")
                );
            },
            //    //var formContainer = $("<div id='form'>");
            //    //formContainer.dxForm(deviceTypes).dxForm("instance");
            //    //    e.append(formContainer);
            //},
            id: "popup",
            showTitle: true,
            title: "Information",
            visible: false,
            dragEnabled: false,
            closeOnOutsideClick: true,
            onShowing: function () {
                console.log('popup');
                $.ajax({
                    type: "POST",
                    url: '/Home/Popup',
                    //url: '@Url.Action("Popup", "Home", null)',
                    //data: {'Employee_ESSID': currentEmployee.Agent_ESSID },
                    //cache: true,
                    //dataType: "json",
                    //traditional: true,
                    success: function (response) {
                        //console.log('success');
                        //console.log(response);
                        $('#htmlhere').html(response);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //console.log('error');
                        alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
                    }
                });

            }
        }
        , formOptions = {
            width: 300,
            height: 250,
            contentTemplate: function () {
                return $("<div />").append(
                    $("<div id='formhere'></div>")
                );
            },
            id: "popup-form",
            showTitle: true,
            title: "Information",
            visible: false,
            dragEnabled: false,
            closeOnOutsideClick: true,
            onShowing: function () {
                $.ajax({
                    type: "POST",
                    url: '/Home/Form',
                    success: function (response) {
                        $('#formhere').html(response);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //console.log('error');
                        alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
                    }
                });

            },
            onShown: function () {
                console.log('onShown: function ()')
                console.log('cableLength: ' + cableLength)
                //var len = getTextBox();
                //if (len) {
                //    len.option('value', cableLength);
                //}
                //if (data.length) {
                $('#cablelengths').dxTextBox('instance').option('value', cableLength)
                //}
            }
        };

    var showInfo = function (data) {
        if (!popup) {
            popup = $("#popup").dxPopup(popupOptions).dxPopup("instance");
        }
        popup.show();
    }

    var showLength = function (data) {
        if (!form) {
            form = $("#popup-form").dxPopup(formOptions).dxPopup("instance");
        }
        form.show();
        console.log('showLength = function')
        console.log(data)
        console.log(data.itemData.length)
        console.log(data.itemData.id)
        if (data) {
            //$('#cablelengths').dxTextBox('instance').option('value', data.itemData.length)
            cableLength = data.itemData.length;
            updateRow = data.itemData;
        }

        //var len = getTextBox(); 
        //if (len) {
        //    len.option('value', data.length);
        //}
    }

    //// button click handling
    function handleItem(btn) {
        var btnName = btn.itemData.text
        switch (btnName) {
            case "Add Cable Type":
                addItem('Cable Type Model');
                
                break;
            case "Add Passive Device":
                addItem('Device Type Model');
                break;
            case "Duplicate":
                duplicateItem(selectedRow);
                break;
            case "Edit Length":
                showLength(selectedRow);
                break;
            case "Delete":
                removeItem(selectedRow);
                break;
            case "Clear All":
                removeAll();
                break;
            case "Start Over":
                location.reload();
                break;
            default:
            // code block
        }
    }

    //// speed dial shit for lower right menu
    $("#action-add-cable").dxSpeedDialAction({
        label: "Add row",
        icon: "add",
        index: 1,
        visible: true,
        onClick: function () {
            showInfo()
        }
    }).dxSpeedDialAction("instance");

    var deleteSDA = $("#action-add-passive").dxSpeedDialAction({
        label: "Delete row",
        icon: "trash",
        index: 2,
        visible: false,
        onClick: function () {
            showInfo()
        }
    }).dxSpeedDialAction("instance");

    //// action menu when selecting from the list
    var topMenu = $("#top-sheet").dxActionSheet({
        dataSource: topSheetItems,
        title: "Choose action",
        usePopover: true,
        showTitle: false,
        showCancelButton: true,
        onCancelClick: function () {
            showNotify("Cancel");
        },
        onItemClick: function (btn) {
            //showNotify(value.itemData.text);
            //showNotify(selectedRow.itemData.text);
            //console.log(value.itemData.id);
            //removeItem(selectedRow.itemData.id)
            handleItem(btn)
            //console.log(btn);                //console.log(btn);
        },
    }).dxActionSheet("instance");

    //// action menu when selecting from the list
    var actionMenu = $("#action-sheet").dxActionSheet({
        dataSource: actionSheetItems,
        title: "Choose action",
        usePopover: true,
        showTitle: false,
        showCancelButton: true,
        onCancelClick: function () {
            showNotify("Cancel");
        },
        onItemClick: function (btn) {
            //showNotify(value.itemData.text);
            //showNotify(selectedRow.itemData.text);
            //console.log(value.itemData.id);
            //removeItem(selectedRow.itemData.id)
            handleItem(btn)
            //console.log(btn);                //console.log(btn);
        },
    }).dxActionSheet("instance");

    //// actual list of items
    function createList(selector, records) {
        var listWidget = $(selector).dxList({
            dataSource: records, //null,
            itemTemplate: $("#list-template"),
            //itemTemplate: function (data, index) {
            //    var result = $("<tbody class='employee dx-row'><tr class='main-row'>").addClass("product");
            //    $("<td>").text(data.text).appendTo(result);
            //    $("<td>").text(data.high).appendTo(result);
            //    $("<td>").text(data.mid).appendTo(result);
            //    $("<td>").text(data.low).appendTo(result);
            //    $("<td>").text(data.xmitHigh).appendTo(result);
            //    $("<td>").text(data.xmitLow).appendTo(result);
            //    $("</tr></tbody>").text(data.text).appendTo(result);
            //    return result;
            //},  
            //itemTemplate: function (data, index) {
            //    var result = $("<div>").addClass("product");
            //    $("<div>").text(data.text).appendTo(result);
            //    $("<div>").text(data.high).appendTo(result);
            //    $("<div>").text(data.mid).appendTo(result);
            //    $("<div>").text(data.low).appendTo(result);
            //    $("<div>").text(data.xmitHigh).appendTo(result);
            //    $("<div>").addClass("price").text(data.xmitLow).appendTo(result);
            //    return result;
            //},  
            onItemClick: function (e) {
                actionMenu.option("target", e.itemElement);
                actionMenu.option("visible", true);
                selectedRowIndex = e.itemIndex;
                selectedRow = e;
            },
            onContentReady: function (e) {
                console.log('onContentReady');
                recalc();
            },
            //onItemDeleted: function (e) {
            //    console.log('onItemDeleted')
            //},
            onItemReordered: function (e) {
                console.log('onItemReordered');
                recalc();
            },
            ////
            repaintChangesOnly: true,
            keyExpr: "id",
            itemDragging: {
                allowReordering: false,
                group: "records",
                onDragStart: function (e) {
                    e.itemData = records[e.fromIndex];
                },
                onAdd: function (e) {
                    console.log('onAdd')
                    records.splice(e.toIndex, 0, e.itemData);
                    listWidget.option("dataSource", records);
                },
                onRemove: function (e) {
                    console.log('onRemove')
                    records.splice(e.fromIndex, 1);
                    listWidget.option("dataSource", records);
                }
            }

        }).dxList("instance");
    }

    //var toplist = $('#defaultlist').dxDataGrid({
    //    dataSource: defaultcontact,
    //    //rowTemplate: function (data, index) {
    //    //    var result = $("<tbody class='employee dx-row'><tr class='main-row'>").addClass("product");
    //    //    $("<td>").text(data.text).appendTo(result);
    //    //    $("<td>").text(data.high).appendTo(result);
    //    //    $("<td>").text(data.mid).appendTo(result);
    //    //    $("<td>").text(data.low).appendTo(result);
    //    //    $("<td>").text(data.xmitHigh).appendTo(result);
    //    //    $("<td>").text(data.xmitLow).appendTo(result);
    //    //    $("</tr></tbody>").appendTo(result);
    //    //    return result;
    //    //},  
    //    rowTemplate: function (container, item) {
    //        var data = item.data,
    //            markup = "<tbody class='employee dx-row'><tr class='main-row'>" +
    //                "<td>" + data.text + "</td>" +
    //                "<td>" + data.high + " dBmV</td>" +
    //                "<td>" + data.mid + " dBmV</td>" +
    //                "<td>" + data.low + " dBmV</td>" +
    //                "<td>" + data.xmitHigh + " dBmV</td>" +
    //                "<td>" + data.xmitLow + " dBmV</td>" +
    //                "<td></td>" +
    //                "</tr>" +
    //                "</tbody>";
    //        container.append(markup);
    //    },
    //    columnAutoWidth: false,
    //    showBorders: true,
    //    showColumnHeaders: true,
    //    showColumnLines: true,
    //    hoverStateEnabled: true,
    //    wordWrapEnabled: true,
    //    columns: [
    //        {
    //            dataField: "text",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "high",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "mid",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "low",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "xmitHigh",
    //            caption: "xHigh",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "xmitLow",
    //            caption: "xLow",
    //            alignment: "center"
    //        }
    //        , {
    //            caption: "",
    //            visible: true
    //        }
    //    ]
    //});
    var serviceUrl = "https://localhost:44398/api/Menu";
    var toplist = $('#defaultlist').dxList({
        //dataSource: defaultcontact,
        //dataSource: new DevExpress.data.ArrayStore({
        //    data: defaultcontact,
        //    onLoaded: function () {
        //        // Event handling commands go here
        //    }
        //}),
        dataSource: DevExpress.data.AspNet.createStore({
            key: "text",
            loadUrl: serviceUrl + "/GetDefault",
            //onBeforeSend: function (method, ajaxOptions) {
            //    ajaxOptions.xhrFields = { withCredentials: false };
            //}
            onLoaded: function (method, ajaxOptions) {
                console.log('onLoaded');
                recalc();
            }
        }),
        itemTemplate: $("#defaultlist-template"),
        //itemTemplate: function (data, index) {
        //    var result = $("<div>").addClass("product");
        //    $("<div>").text(data.text).appendTo(result);
        //    $("<div>").text(data.high).appendTo(result);
        //    $("<div>").text(data.mid).appendTo(result);
        //    $("<div>").text(data.low).appendTo(result);
        //    $("<div>").text(data.xmitHigh).appendTo(result);
        //    $("<div>").addClass("price").text(data.xmitLow).appendTo(result);
        //    return result;
        //},  
        //itemTemplate: function (data, index) {
        //    var result = $("<tbody class='employee dx-row'><tr class='main-row'>").addClass("product");
        //    $("<td>").text(data.text).appendTo(result);
        //    $("<td>").text(data.high).appendTo(result);
        //    $("<td>").text(data.mid).appendTo(result);
        //    $("<td>").text(data.low).appendTo(result);
        //    $("<td>").text(data.xmitHigh).appendTo(result);
        //    $("<td>").text(data.xmitLow).appendTo(result);
        //    $("</tr></tbody>").text(data.text).appendTo(result);
        //    return result;
        //},
        //onItemClick: function (e) {
        //    topMenu.option("target", e.itemElement);
        //    topMenu.option("visible", true);
        //    selectedRowIndex = e.itemIndex;
        //    selectedRow = e;
        //}
        repaintChangesOnly: true,
        keyExpr: "id",
        itemDragging: {
            allowReordering: false,
            group: defaultcontact,
            onDragStart: function (e) {
                e.itemData = defaultcontact[e.fromIndex];
            },
            onAdd: function (e) {
                console.log('onAdd')
                defaultcontact.splice(e.toIndex, 0, e.itemData);
                listWidget.option("dataSource", defaultcontact);
            },
            onRemove: function (e) {
                console.log('onRemove')
                defaultcontact.splice(e.fromIndex, 1);
                listWidget.option("dataSource", defaultcontact);
            }
        }

    });

    //var bottomlist = $('#sumtotal').dxDataGrid({
    //    dataSource: sumtotal,
    //    //rowTemplate: function (data, index) {
    //    //    var result = $("<tbody class='employee dx-row'><tr class='main-row'>").addClass("product");
    //    //    $("<td>").text(data.text).appendTo(result);
    //    //    $("<td>").text(data.high).appendTo(result);
    //    //    $("<td>").text(data.mid).appendTo(result);
    //    //    $("<td>").text(data.low).appendTo(result);
    //    //    $("<td>").text(data.xmitHigh).appendTo(result);
    //    //    $("<td>").text(data.xmitLow).appendTo(result);
    //    //    $("</tr></tbody>").appendTo(result);
    //    //    return result;
    //    //},  
    //    rowTemplate: function (container, item) {
    //        var data = item.data,
    //            markup = "<tbody class='dx-row'><tr class='main-row'>" +
    //                "<td>" + data.text + "</td>" +
    //                "<td>" + data.high + " dBmV</td>" +
    //                "<td>" + data.mid + " dBmV</td>" +
    //                "<td>" + data.low + " dBmV</td>" +
    //                "<td>" + data.xmitHigh + " dBmV</td>" +
    //                "<td>" + data.xmitLow + " dBmV</td>" +
    //                "<td></td>" +
    //                "</tr>" +
    //                "</tbody>";
    //        container.append(markup);
    //    },
    //    columnAutoWidth: false,
    //    showBorders: false,
    //    showColumnHeaders: false,
    //    showColumnLines: false,
    //    hoverStateEnabled: true,
    //    wordWrapEnabled: true,
    //    columns: [
    //        {
    //            dataField: "text",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "high",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "mid",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "low",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "xmitHigh",
    //            caption: "xHigh",
    //            alignment: "center"
    //        }
    //        , {
    //            dataField: "xmitLow",
    //            caption: "xLow",
    //            alignment: "center"
    //        }
    //        , {
    //            caption: "",
    //            visible: true
    //        }
    //    ]
    //});

    var bottomlist = $('#sumtotal').dxList({
        dataSource: sumtotal,
        itemTemplate: $("#sumtotal-template"),
        repaintChangesOnly: true,
        keyExpr: "id",
        itemDragging: {
            allowReordering: false,
            group: sumtotal,
            onDragStart: function (e) {
                e.itemData = sumtotal[e.fromIndex];
            },
            onAdd: function (e) {
                console.log('onAdd')
                sumtotal.splice(e.toIndex, 0, e.itemData);
                listWidget.option("dataSource", sumtotal);
            },
            onRemove: function (e) {
                console.log('onRemove')
                sumtotal.splice(e.fromIndex, 1);
                listWidget.option("dataSource", sumtotal);
            }
        }

    });

    createList("#list", contacts);

    $("#button").dxButton({
        text: "Click to show Action Sheet",
        onClick: function () {
            actionMenu.option("visible", true);
        }
    });



    //var getTasksCoachingUser = function () {
    //    //console.log('GetTasksCoachingUser');
    //    //console.log(Employee_ESSID)
    //    var dgCoachingTasks = $("#dgCoachingTasks").dxDataGrid("instance");
    //    $.ajax({
    //        url: '/UserIdentity/api/Portal_AgentCoachingTracker_Detail/GetAgentCoachings',
    //        //url: '@Url.Action("GetAgentCoachings", "Portal_AgentCoachingTracker_Detail", null)',
    //        data: { 'Employee_ESSID': currentEmployee.Agent_ESSID },
    //        cache: true,
    //        dataType: "json",
    //        traditional: true,
    //        type: "GET",
    //        beforeSend: function () {
    //            //console.log('beforeSend');
    //            dgCoachingTasks.beginCustomLoading('blahblah');
    //        },
    //        success: function (response) {
    //            //console.log('success');
    //            //console.log(response);
    //            $("#dgCoachingTasks").dxDataGrid({ dataSource: response.data }).dxDataGrid("instance");
    //            //updateHeaderText(data);
    //            dgCoachingTasks.endCustomLoading();
    //        },
    //        error: function (xhr, textStatus, errorThrown) {
    //            //console.log('error');
    //            alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
    //        }
    //    });
    //}

});
