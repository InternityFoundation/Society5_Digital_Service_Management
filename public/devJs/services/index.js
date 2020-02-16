function uploadIdAjax(data) {
    $.ajax({
        url: '/digital/identity',
        type: 'POST',
        data,
        processData: false,
        contentType: false,
        success(data) {
            document.getElementById("uploadIdForm").reset();
            $('#uploadIdErrorMsg').addClass('display-none');
            $('#uploadIdSuccessMsg').removeClass('display-none');
        },
        error(data) {
            $('#uploadIdErrorMsg').removeClass('display-none');
            $('#uploadIdSuccessMsg').addClass('display-none');

        },
    });
}

const verifyIdentity = (addr, index) => {
    $.ajax({
        url: '/digital/identityVerification',
        type: 'PUT',
        data: { addr, index },
        success(data) {
            window.location.reload()
        },
        error(data) {
            // $('#uploadIdErrorMsg').removeClass('display-none');
            // $('#uploadIdSuccessMsg').addClass('display-none');

        },
    });

}

