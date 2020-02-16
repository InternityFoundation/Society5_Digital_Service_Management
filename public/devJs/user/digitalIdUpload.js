(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var files = [];

    var input = $('.validate-input .input100');
    $('#uploadIdForm').submit(false);
    $('input:file').on('change', function (e) {
        var name = e.target.files[0].name;
        $('input:text', $(e.target).parent()).val(name);
        files = $(this).get(0).files;
    });
    $('#uploadIdFormSubmit').on('click', function () {
        var check = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if (check === true) {
            const data = $('#uploadIdForm').serializeArray();
            var formData = new FormData();
            formData.append('file', files[0], files[0].name);
            formData.append('idType',data[0].value);
            debugger;
            uploadIdAjax(formData);
        }
        return check;
    });

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).val().trim() == '') {
            return false;
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);
