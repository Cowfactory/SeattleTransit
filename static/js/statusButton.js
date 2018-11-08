var searchBtnEl;
var searchMsgEl;
var statusMsgEl;
var statusCircleEl;

function toggleStatusVisibility() {
    statusCircleEl.classList.toggle('hide');
    statusMsgEl.classList.toggle('hide');
    searchMsgEl.classList.toggle('hide');
    $('#toggle').hide();
    $('#incomingbusses').hide();
}

function setStatusMsg(msg) {
    statusMsgEl.textContent = msg;
}

searchMsgEl = document.getElementById("searchMsg");
searchBtnEl = document.getElementById("searchBtn");
statusCircleEl = document.getElementById("statusCircle");
statusMsgEl = document.getElementById("statusMsg");