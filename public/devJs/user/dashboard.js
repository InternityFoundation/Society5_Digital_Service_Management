

const showIdentity = () => {
    const identityVerifications = $('#identityVerificationTable').DataTable({
        destroy: true,
        bInfo: false,
        lengthChange: false,
        paginationType: 'full_numbers',
        ordering: false,
        dom: '<bottam>p',
        initComplete() { },
        processing: true,
        ajax: {
            url: '/digital/identity',
            type: 'GET',
            dataSrc: '',
            dataFilter(data) {
                return JSON.stringify(JSON.parse(data).data);
            },
            error(data) {
                return data;
            },
        },
        columns: [
            {
                render(data, type, full) {
                    return `<span>${full.args.idType}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `<a target='_blank' href='/file/${full.args.ipfsHash}'>File</a>`;
                }
            },
            {
                render(data, type, full) {
                    return `<span title='${full.transactionHash}'>${full.transactionHash.length < 20 ? full.transactionHash : `${full.transactionHash.substr(0, 20)}...`}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `<span title='${full.args.dataHash}'>${full.args.dataHash.length < 20 ? full.args.dataHash : `${full.args.dataHash.substr(0, 20)}...`}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `${full.args.isVerified ? `<span title='${full.args.verifiedTx}'>${full.args.verifiedTx.length < 20 ? full.args.verifiedTx : `${full.args.verifiedTx.substr(0, 20)}...`}</span>` : 'Pending'}`;
                }
            },
            {
                render(data, type, full) {
                    return `${full.args.isVerified ? `<span>${full.args.verifiedBlockNumber}</span>` : '-'}`;
                }
            },
        ],
    });
    $('#identityVerificationSearch').on('keyup', () => {
        identityVerifications.search($('#identityVerificationSearch').val()).draw();
    });
}

const showIdentityForVerification = () => {
    const identityVerifications = $('#identityVerificationTable').DataTable({
        destroy: true,
        bInfo: false,
        lengthChange: false,
        paginationType: 'full_numbers',
        ordering: false,
        dom: '<bottam>p',
        initComplete() { },
        processing: true,
        ajax: {
            url: '/digital/identity',
            type: 'GET',
            dataSrc: '',
            dataFilter(data) {
                return JSON.stringify(JSON.parse(data).data);
            },
            error(data) {
                return data;
            },
        },
        columns: [
            {
                render(data, type, full) {
                    return `<span>${full.user.firstName} ${full.user.lastName}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `<span>${full.args.idType}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `<a target='_blank' href='/file/${full.args.ipfsHash}'>File</a>`;
                }
            },
            {
                render(data, type, full) {
                    return `<span title='${full.transactionHash}'>${full.transactionHash.length < 20 ? full.transactionHash : `${full.transactionHash.substr(0, 20)}...`}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `<span title='${full.args.dataHash}'>${full.args.dataHash.length < 20 ? full.args.dataHash : `${full.args.dataHash.substr(0, 20)}...`}</span>`;
                }
            },
            {
                render(data, type, full) {
                    return `<span onClick="verifyIdentity('${full.args.addr}','${full.args.index}')" href='/file/${full.args.ipfsHash}'>Verify</span>`;
                }
            },
        ],
    });
    $('#identityVerificationSearch').on('keyup', () => {
        identityVerifications.search($('#identityVerificationSearch').val()).draw();
    });
}

const switchHome = (hash) => {
    $(`.home`).addClass('display-none');
    $(`#${hash || 'home1'}`).removeClass('display-none');
    switch (hash) {
        case 'home2':
            $('.homeNav').removeClass('active');
            $('.homeNav2').addClass('active');
            showIdentity();
            break;
        case 'home3':
            $('.homeNav').removeClass('active');
            $('.homeNav3').addClass('active');
            break;
        case 'home4':
            $('.homeNav').removeClass('active');
            $('.homeNav4').addClass('active');
            showVictim();
            break;
        case 'home5':
            $('.homeNav').removeClass('active');
            $('.homeNav5').addClass('active');
            showCitizens();
            break;
        default:
            $('.homeNav').removeClass('active');
            $('.homeNav1').addClass('active');
            // fundsDetailAjax();
            if (roleCode == 4) {
                showIdentityForVerification();
            }
            break;
    }
    document.documentElement.scrollTop = 0;
}
const navHandler = () => {
    $(".homeNav").click((e) => {
        $('.homeNav').removeClass('active');
        $(e.currentTarget).addClass('active');
        switchHome(e.currentTarget.firstElementChild.hash.substr(1));
    });
};

$(document).ready(() => {
    navHandler();
    const hash = location.hash.substr(1);
    switchHome(hash);
})