'use strict';

var revList;
var maxRev;

function handleDoc(data) {
    revList = data._revisions.ids;
    console.log('revList', revList);
    maxRev = data._revisions.start;
    $('#curRev').val(maxRev);
}

function getBasicAuthString() {
    var couchUser = $('#couchUser').val();
    var couchPass = $('#couchPass').val();
    return 'Basic ' + btoa(couchUser + ':' + couchPass);
}

function getRevisions(revLeft, revRight) {


    var url = $('#couchUrl').val() + '?rev=' + revLeft;
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#textarealeft').val(JSON.stringify(data, null, 2));
        },
        error: function () {
            alert('boo!');
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', getBasicAuthString());
        }
    });
    url = $('#couchUrl').val() + '?rev=' + revRight;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#textarearight').val(JSON.stringify(data, null, 2));
        },
        error: function () {
            alert('boo!');
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', getBasicAuthString());
        }
    });
}

function updateCurRev() {
    var newVal = $('#curRev').val();
    if (newVal < 1) $('#curRev').val(1);
    if (newVal > maxRev) $('#curRev').val(maxRev);
    console.log(newVal);

    var newRevLeft = newVal + '-' + revList[maxRev - newVal];
    var newValRight = newVal - 1;
    var newRevRight = newValRight + '-' + revList[maxRev - newValRight];
    console.log('newRevLeft', newRevLeft);
    console.log('newRevRight', newRevRight);
    getRevisions(newRevLeft, newRevRight);
}

jQuery(document).ready(function () {


    $('#getDocButton').click(function () {
        var url = $('#couchUrl').val() + '?revs=true';
        console.log(url);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: handleDoc,
            error: function () {
                alert('boo!');
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', getBasicAuthString());
            }
        });

    });


    $('#showNext').click(function () {
        $('#curRev').val($('#curRev').val() * 1 + 1);
        updateCurRev();
    });
    $('#showPrev').click(function () {
        $('#curRev').val($('#curRev').val() * 1 - 1);
        updateCurRev();
    });

    $('#curRev').change(function () {
        updateCurRev();
    });


});
