const loginAjax = (data) => {
    $.ajax({
        url: '/authentication/login',
        type: 'POST',
        data,
        cache: false,
        headers: { 'cache-control': 'no-cache' },
        success(data) {
            if (data.status) {
                window.location = data.url;
            } else {
                $('#invalidLoginPrompt').removeClass('display-none');
            }
        },
        error(data) {
            $('#invalidLoginPrompt').removeClass('display-none');
        },
    });
}