function sysMessage() {
    this.severity = [
        'error',
        'warning',
        'info',
        'success',
    ];
    this.displayType = [
        'modal',
        'toastr',
    ];
    this.defaultMsg = {
        title: 'Empty title',
        body: 'Empty body',
        footer: null, // to override footer set this to string.
        severity: 'error',
        displayType: 'modal',
    };
    this.msg = {};
    for (var k in this.defaultMsg) {
        this.msg[k] = this.defaultMsg[k];
    }
    this.defaultModalBody = this.defaultModalFooter = this.defaultModalTitle = '';
    this.modalOpen = false;
    this.modalQueue = [];
    this.initModal();
}


sysMessage.prototype.initModal = function() {
$('body').append('\
<div class="modal fade" id="msgModal" tabindex="-1" role="dialog" aria-labelledby="msgModal" aria-hidden="true">\
    <div class="modal-dialog modal-dialog-centered" role="document">\
        <div class="modal-content">\
            <div class="modal-header">\
                <h5 class="modal-title" id="msgModalTitle"></h5>\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                    <span aria-hidden="true">×</span>\
                </button>\
            </div>\
            <div class="modal-body" id="msgModalBody"></div>\
            <div class="modal-footer" id="msgModalFooter"></div>\
        </div>\
    </div>\
</div>\
');
    this.defaultModalTitle = 'Unset title';
    this.defaultModalBody = '';
    this.defaultModalFooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
}
sysMessage.prototype.initToastr = function() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "10000",
      "extendedTimeOut": "2000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
}

/*
    object should be inited. then u simply call:
    sysMessage.show({'title': 'Title of modal', 'body': 'msg here'})
*/
sysMessage.prototype.show = function(props) {
    if (props.displayType !== undefined && this.displayType.indexOf(props.displayType) > -1) {
        this.msg.displayType = props.displayType;
    }
    if (props.severity !== undefined && this.severity.indexOf(props.severity)>-1) {
        this.msg.severity = props.severity;
    }

    if (this.msg.displayType == 'modal') {
        // add
        this.showModal(props);
    }
    if (this.msg.displayType == 'toastr')
        this.showToastr(props);
}

sysMessage.prototype.showModal = function(msg) {
    var oThis = this;
    if (oThis.modalOpen == true) {
        oThis.modalQueue.push(msg);
        return;
    }
    if (oThis.modalQueue.length < 1)
        oThis.modalQueue.push(msg);
    if (oThis.modalOpen == false)
        oThis.showModalQueue();
}

sysMessage.prototype.showModalQueue = function() {
    var oThis = this;
    if (oThis.modalQueue.length<1) {
        //console.log('queue less than 1');
        return;
    }
    if (oThis.modalOpen) {
        //console.log('modal still open');
        return;
    }
    oThis.modalOpen = true;
    msg = oThis.modalQueue.shift();
    //console.log(msg, oThis.modalQueue);
    var msgButtonsStr = this.defaultModalFooter;
    if (msg.severity !== undefined)
        this.msg.severity = msg.severity;
    var icon = 'flaticon-';
    var alertType = 'alert-';
    if (this.msg.severity == 'error') {
        icon += 'close';
        alertType += 'danger';
    }
    if (this.msg.severity == 'warning') {
        icon += 'warning-sign';
        alertType += 'warning';
    }
    if (this.msg.severity == 'info') {
        icon += 'medical';
        alertType += 'info';
    }
    if (this.msg.severity == 'success') {
        icon += 'info';
        alertType += 'success';
    }
    if (msg.body != undefined)
        this.msg.body = msg.body;
    if (msg.title != undefined)
        this.msg.title = msg.title;

    $('#msgModalTitle').html(msg.title);
    $('#msgModalBody').html('\
    <div class="alert '+alertType+' fade show" role="alert">\
        <div class="alert-icon"><i class="'+icon+'"></i></div>\
        <div class="alert-text">'+this.msg.body+'</div>\
    </div>\
    ');
    //<!--<button type="button" class="btn btn-secondary">Save changes</button>-->
    if (msg.buttons !== undefined && Array.isArray(msg.buttons)) {
        for(var mbi=0; mbi<msg.buttons.length;mbi++) {
            msgButtonsStr = msg.buttons[mbi]+msgButtonsStr;
        }
    }
    $('#msgModalFooter').html(msgButtonsStr);
    $('#msgModal').modal({ show: false});
    $('#msgModal').modal('show');
    $('#msgModal').on('show.bs.modal', function (event) {

    });
    $('#msgModal').on('hide.bs.modal', function (event) {
        oThis.clearMsg();
        oThis.modalOpen = false;
        setTimeout(function() {
            oThis.showModalQueue();
        }, 750);
        if (oThis.modalQueue.length < 1 && 'onClose' in msg) {
            setTimeout(function() {
                msg.onClose();
            },750);
        }
    });
}

sysMessage.prototype.showToastr = function(msg) {
    if (msg.body != undefined)
        this.msg.body = msg.body;
    if (msg.severity !== undefined)
        this.msg.severity = msg.severity;

    if (this.msg.severity == 'error')
        toastr.error(this.msg.body);
    if (this.msg.severity == 'warning')
        toastr.warning(this.msg.body);
    if (this.msg.severity == 'info')
        toastr.info(this.msg.body);
    if (this.msg.severity == 'success')
        toastr.success(this.msg.body);
    this.clearMsg();
}

sysMessage.prototype.clearMsg = function() {
        $('#msgModalFooter').html(this.defaultModalFooter);
        $('#msgModalTitle').html(this.defaultModalTitle);
        $('#msgModalBody').html(this.defaultModalBody);
        this.msg.body = this.defaultMsg.body;
        this.msg.title = this.defaultMsg.title;
        this.msg.footer = this.defaultMsg.footer;
        this.msg.severity = this.defaultMsg.severity;
        this.msg.displayType = this.defaultMsg.displayType;
}
