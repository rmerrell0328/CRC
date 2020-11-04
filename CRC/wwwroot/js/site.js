////////////////////////////////////////////////////////////////////////////////
function returnCables() {
    return $("#cabletypes").dxSelectBox("instance");
}

function returnDevices() {
    return $("#devicetypes").dxSelectBox("instance");
}

function showNotify(value) {
    DevExpress.ui.notify("The \"" + value + "\" button is clicked.");
}

//function checkClear(e) {
//    console.log('checkClear')
//    console.log(e)
//    if (e.keyCode === 27) {
//        this.popup.instance.hide();
//    } 
//}

function submitForm(e) {
    $("#button-tap").click();
}

function submitLength(e) {
    $("#button-form").click();
}

////////////////////////////////////////////////////////////////////////////////
//// static objects; to be replaced
var defaultcontact = [{ id: 0, text: "Tap / Source", type: "Tap", high: 100, mid: 100, low: 100, xmitHigh: 100, xmitLow: 100 }];
var sumtotal = [{ id: 9999, text: "FINAL", high: 0, mid: 0, low: 0, xmitHigh: 0, xmitLow: 0 }];
var contacts = [
    //{ id: 1, text: "device1", high: valRand(), mid: valRand(), low: valRand(), xmitHigh: valRand(), xmitLow: valRand() },
    //{ id: 2, text: "device2", high: valRand(), mid: valRand(), low: valRand(), xmitHigh: valRand(), xmitLow: valRand() },
];

////////////////////////////////////////////////////////////////////////////////
//// store for inserting/deleting
var store = new DevExpress.data.ArrayStore({
    key: "id",
    data: contacts
});

var tapStoreOrig = new DevExpress.data.ArrayStore({
    key: "id",
    data: defaultcontact
});

var tapStore = new DevExpress.data.AspNet.createStore({
    key: "text",
    loadUrl: "/CRC/api/Menu/GetDefault",
    onLoaded: function () {
        recalc()
    }
});


////////////////////////////////////////////////////////////////////////////////
//// global var for inserting/deleting
var selectedRowIndex = -1,
    selectedRow;

var selectionChanged = function (e) {
    selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);

    //$("#action-add-cable").dxSpeedDialAction("instance").option("visible", selectedRowIndex !== -1);
    $("#action-add-passive").dxSpeedDialAction("instance").option("visible", selectedRowIndex !== -1);
}

////////////////////////////////////////////////////////////////////////////////
//// generic helpers
var getList = function () {
    return $("#list").dxList("instance");
}
var getTap = function () {
    return $("#defaultlist").dxList("instance");
}
var getDS = function () {
    return getList().option("dataSource");
}

////////////////////////////////////////////////////////////////////////////////
//// helper function for random values for testing
function valRand() {
    var min = 0;
    var max = 4;
    var random = Math.random() * (+max - +min) + +min;
    return Math.round(random * 10) / 10
}

////////////////////////////////////////////////////////////////////////////////
//// action menu items for the tap
var actionsTap = [
    { text: "Edit Tap Values" },
    { text: "Clear All" },
    { text: "Start Over" }
];
var actionsCable = [
    { text: "Edit Length" },
    { text: "Duplicate" },
    { text: "Delete" },
];
var actionsDevice = [
    { text: "Duplicate" },
    { text: "Delete" },
];

////////////////////////////////////////////////////////////////////////////////
//// increment over max id;  if one doesnt exist, create one
var getNextID = function () {
    //var items = getList().option("dataSource"); //getDS; //.push(newcontact);
    var items = getDS();
    //console.log('getNextID');
    //console.log(items);
    if (items) {
        //console.log('items exist')
        //console.log(items)
        var maxId = Math.max.apply(Math, items.map(function (o) { return o.id; }))
        if (maxId < 0 || !maxId) {
            //console.log('max <0 or maxid null: ' + maxId)
            return 0 + 1;
        } else {
            //console.log('found max: ' + maxId)
            return maxId + 1
        }
    } else {
        //console.log('no items')
        return 1;
    }
}

////////////////////////////////////////////////////////////////////////////////
//// clone the row for duplicate
function copyRow(src) {
    return Object.assign({}, src);
}

////////////////////////////////////////////////////////////////////////////////
//// adding a new static row
function addItem(type, obj) {
    var newRow = { id: getNextID(), text: type, type: obj.type, high: obj.high, mid: obj.mid, low: obj.low, xmitHigh: obj.xmitHigh, xmitLow: obj.xmitLow, length: obj.length };
    store.insert(newRow)
        .done(function () {
            getList().reload();
        })
        .fail(function () {
        });
    recalc();
}

////////////////////////////////////////////////////////////////////////////////
//// remove the selected row
function removeItem() {
    var Rowid = selectedRow.itemData.id;
    store.remove(Rowid)
        .done(function () {
            getList().reload();
        })
        .fail(function () {
        });
}

////////////////////////////////////////////////////////////////////////////////
//// remove all the added rows
function removeAll() {
    var items = getDS(); //.push(newcontact);

    if (items) {
        items.forEach(function (item, index) {
            setTimeout(() => {
                store.remove(item.id)
                    .done(function () {
                        getList().reload();
                    })
                    .fail(function () {
                    });
            }, index * 50);
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
//// recalculation function to do the math for the final output
function recalc() {
    var items = getDS(); //.push(newcontact);

    //var start = $('#defaultlist').dxDataGrid("instance");
    var start = $('#defaultlist').dxList("instance");
    //var dsGet = start.getDataSource();
    //var dsStart = start.option("dataSource");
    //console.log('recalc = function')
    //console.log(start)
    //console.log(dsGet)
    //console.log(dsStart)
    //console.log(start._itemsCache[0])
    //console.log(dsStart._array[0])
    //console.log(dsStart[0])

    var obj = start._itemsCache[0];
    //var obj = dsStart._array[0];

    if (obj) { //dsStart[0]
        //console.log('obj exists, calc')

        startHigh = obj.high;
        startMid = obj.mid;
        startLow = obj.low;
        startXmitHigh = obj.xmitHigh;
        startXmitLow = obj.xmitLow;

        if (items) {
            //console.log('items')
            //console.log(items)
            items.forEach(function (item, index, object) {
                var length = 1;

                if (item.type == "Cable") {
                    length = (item.length ? item.length : 0) / 100
                }

                startHigh -= item.high * length;
                startMid -= item.mid * length;
                startLow -= item.low * length;
                startXmitHigh += item.xmitHigh * length;
                startXmitLow += item.xmitLow * length;
            });

            //var total = $('#sumtotal').dxDataGrid("instance");
            var total = $('#sumtotal').dxList("instance");
            var dsTotal = total.option("dataSource");

            dsTotal[0].high = Math.round(startHigh * 100) / 100;
            dsTotal[0].mid = Math.round(startMid * 100) / 100; //startMid;
            dsTotal[0].low = Math.round(startLow * 100) / 100; //startLow;
            dsTotal[0].xmitHigh = Math.round(startXmitHigh * 100) / 100; //startXmitHigh;
            dsTotal[0].xmitLow = Math.round(startXmitLow * 100) / 100; //startXmitLow;

            //total.refresh();
            total.reload();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//// duplicate the selected row; increment the max ID by 1
function duplicateItem(row) {
    var newRow = copyRow(row.itemData);
    var items = getList().option("dataSource"); //getDS; //.push(newcontact);
    var maxId = Math.max.apply(Math, items.map(function (o) { return o.id; }))
    newRow.id = maxId + 1;

    store.insert(newRow)
        .done(function () {
            getList().reload();
        })
        .fail(function () {
        });
}

////////////////////////////////////////////////////////////////////////////////
var cableLength = null,
    updateRow = null,
    tapHigh = null,
    tapMid = null,
    tapLow = null,
    tapXmitHigh = null,
    tapXmitLow = null;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

$(function () {
    ////////////////////////////////////////////////////////////////////////////
    //// popup loading information
    //var employee = {},
        var popupTap = null,
        popupLength = null,
        popupCable = null,
        popupDevice = null;
        //form = null;

    ////////////////////////////////////////////////////////////////////////////
    //// popup menu for adding cable or passive devices;  pass data
    var createCableBody = function () {
        $.ajax({
            type: "POST",
            url: '/CRC/Home/FormCableType',
            success: function (response) {
                $('#cabletypehtmlhere').html(response);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
            }
        });
    }
    var showCableForm = function () {
        if (!popupCable) {
            popupCable = $("#popup-cable").dxPopup({
                id: "popup-cable",
                width: 300,
                height: 200,
                showTitle: true,
                title: "Select a cable type",
                closeOnOutsideClick: true,
                onShowing: createCableBody
            }).dxPopup("instance");
        }
        popupCable.show();
    }

    ////////////////////////////////////////////////////////////////////////////
    //// popup menu for adding cable or passive devices
    var createDeviceBody = function () {
        $.ajax({
            type: "POST",
            url: '/CRC/Home/FormDeviceType',
            success: function (response) {
                $('#devicetypehtmlhere').html(response);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
            }
        });
    }
    var showDeviceForm = function () {
        if (!popupDevice) {
            popupDevice = $("#popup-device").dxPopup({
                id: "popup-device",
                width: 300,
                height: 200,
                showTitle: true,
                title: "Select a device type",
                closeOnOutsideClick: true,
                onShowing: createDeviceBody
            }).dxPopup("instance");
        }
        popupDevice.show();
    }

    ////////////////////////////////////////////////////////////////////////////
    //// popup for tap values
    var createTapForm = function () {
        $.ajax({
            type: "POST",
            url: '/CRC/Home/FormTap',
            success: function (response) {
                $('#taphtmlhere').html(response);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
            }
        });
    }
    var populateTapValue = function () {
        if (tapHigh) {
            $('#tapHigh').dxNumberBox('instance').option('value', tapHigh)
            $('#tapMid').dxNumberBox('instance').option('value', tapMid)
            $('#tapLow').dxNumberBox('instance').option('value', tapLow)
            $('#tapXmitHigh').dxNumberBox('instance').option('value', tapXmitHigh)
            $('#tapXmitLow').dxNumberBox('instance').option('value', tapXmitLow)
            //$('#updateRow').dxTextBox('instance').option('value', tapHigh)
        }
        $('#tapHigh').dxNumberBox('instance').focus();
    }
    var showTapForm = function (data) {
        if (data) {
            //cableLength = data.itemData.length;
            tapHigh = data.itemData.high;
            tapMid = data.itemData.mid;
            tapLow = data.itemData.low;
            tapXmitHigh = data.itemData.xmitHigh;
            tapXmitLow = data.itemData.xmitLow;
            updateRow = data.itemData;
        }
        if (!popupTap) {
            popupTap = $("#popup-tap").dxPopup({
                id: "popup-tap",
                width: 300,
                height: 400,
                showTitle: true,
                title: "Enter Tap Values",
                closeOnOutsideClick: true,
                onShowing: createTapForm,
                onShown: populateTapValue
            }).dxPopup("instance");
        }
        popupTap.show();
    }

    ////////////////////////////////////////////////////////////////////////////
    //// popup for cable length input
    var createLengthForm = function () {
        $.ajax({
            type: "POST",
            url: '/CRC/Home/FormLength',
            success: function (response) {
                $('#lengthhtmlhere').html(response);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
            }
        });
    }
    var populateLengthValue = function () {
        if (cableLength) {
            $('#cablelengths').dxNumberBox('instance').option('value', cableLength)
        }
        $('#cablelengths').dxNumberBox('instance').focus();
    }
    var showLengthForm = function (data) {
        if (data) {
            cableLength = data.itemData.length;
            updateRow = data.itemData;
        }
        if (!popupLength) {
            popupLength = $("#popup-length").dxPopup({
                id: "popup-length",
                width: 300,
                height: 200,
                showTitle: true,
                title: "Enter a length (feet)",
                closeOnOutsideClick: true,
                onShowing: createLengthForm,
                onShown: populateLengthValue
            }).dxPopup("instance");
        }
        popupLength.show();
    }

    ////////////////////////////////////////////////////////////////////////////
    //// speed dial shit for lower right menu
    $("#action-add-cable").dxSpeedDialAction({
        label: "Add Cable Type",
        icon: "add",
        index: 1,
        visible: true,
        onClick: function () {
            showCableForm()
        }
    }).dxSpeedDialAction("instance");

    var passiveSDA = $("#action-add-passive").dxSpeedDialAction({
        label: "Add Passive Device",
        icon: "add",
        index: 2,
        visible: true,
        onClick: function () {
            showDeviceForm()
        }
    }).dxSpeedDialAction("instance");

    ////////////////////////////////////////////////////////////////////////////
    //// action menu when selecting from the list
    var actionMenu = $("#action-sheet").dxActionSheet({
        dataSource: actionsCable,
        title: "Choose action",
        usePopover: true,
        showTitle: false,
        showCancelButton: true,
        onCancelClick: function () {
            showNotify("Cancel")
        },
        onItemClick: function (btn) {
            handleItem(btn)
        },
    }).dxActionSheet("instance");

    ////////////////////////////////////////////////////////////////////////////
    //// button click handling
    var handleItem = function (btn) {
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
                showLengthForm(selectedRow);
                break;
            case "Edit Tap Values":
                showTapForm(selectedRow);
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

    ////////////////////////////////////////////////////////////////////////////
    //// handle the action lists
    var handleAction = function (e) {
        //console.log(e.itemData.type)
        switch (e.itemData.type) {
            case "Tap":
                actionMenu.option("dataSource", actionsTap)
                break;
            case "Device":
                actionMenu.option("dataSource", actionsDevice)
                break;
            case "Cable":
                actionMenu.option("dataSource", actionsCable)
                break;
            default:
                actionMenu.option("dataSource", actionsCable)
        }

        actionMenu.option("target", e.itemElement);
        actionMenu.option("visible", true);
        selectedRowIndex = e.itemIndex;
        selectedRow = e;

    }

    ////////////////////////////////////////////////////////////////////////////
    //// top list for tap values
    //var serviceUrl = "https://localhost:44398/api/Menu";
    //serviceUrl = "http://vm0dwcorpt0001.corp.chartercom.com/CRC/api/Menu";
    var toplist = $('#defaultlist').dxList({
        //dataSource: DevExpress.data.AspNet.createStore({
        //    key: "text",
        //    loadUrl: "/CRC/api/Menu/GetDefault",
        //    //loadUrl: serviceUrl + "/api/Menu/GetDefault",
        //    onLoaded: function (method, ajaxOptions) {
        //        //console.log('onLoaded')
        //        recalc()
        //    }
        //}),
        dataSource: tapStore,
        itemTemplate: $("#defaultlist-template"),
        onItemClick: function (e) {
            handleAction(e);
        },
        repaintChangesOnly: true,
        keyExpr: "id",
        itemDragging: {
            allowReordering: false,
            group: defaultcontact,
            onDragStart: function (e) {
                e.itemData = defaultcontact[e.fromIndex];
            },
            onAdd: function (e) {
                defaultcontact.splice(e.toIndex, 0, e.itemData);
                listWidget.option("dataSource", defaultcontact);
            },
            onRemove: function (e) {
                defaultcontact.splice(e.fromIndex, 1);
                listWidget.option("dataSource", defaultcontact);
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////
    //// actual list of items
    function createList(selector, records) {
        var listWidget = $(selector).dxList({
            dataSource: records, //null,
            allowItemDeleting: true,
            itemTemplate: $("#list-template"),
            onItemClick: function (e) {
                handleAction(e);
            },
            onContentReady: recalc,
            onItemDeleted: recalc,
            onItemReordered: recalc,
            ////
            repaintChangesOnly: true,
            keyExpr: "id",
            itemDragging: {
                allowReordering: true,
                group: "records",
                onDragStart: function (e) {
                    e.itemData = records[e.fromIndex];
                },
                onAdd: function (e) {
                    records.splice(e.toIndex, 0, e.itemData);
                    listWidget.option("dataSource", records);
                },
                onRemove: function (e) {
                    records.splice(e.fromIndex, 1);
                    listWidget.option("dataSource", records);
                }
            }
        }).dxList("instance");
    }

    createList("#list", contacts);

    ////////////////////////////////////////////////////////////////////////////
    //// bottom list for final calculations
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
                sumtotal.splice(e.toIndex, 0, e.itemData);
                listWidget.option("dataSource", sumtotal);
            },
            onRemove: function (e) {
                sumtotal.splice(e.fromIndex, 1);
                listWidget.option("dataSource", sumtotal);
            }
        }
    });
});